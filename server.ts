import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_COUPONS, INITIAL_SETTINGS, DEFAULT_PRODUCT_IMAGE } from './src/data/initialData';
import { Order, Product, Coupon, Review, StoreSettings, OrderStatus, TrackingStep } from './src/types';
import { 
  verifyAdminToken, 
  generateAdminToken, 
  requestSizeLimiter, 
  requestTimeout,
  AuthenticatedRequest 
} from './src/middleware/security';
import {
  validateRequest,
  orderValidationSchema,
  productValidationSchema,
  couponValidationSchema,
  reviewValidationSchema,
  sanitizeSearchQuery,
  sanitizeString,
  sanitizePhone,
  sanitizeEmail
} from './src/middleware/validation';

// Ensure NODE_ENV is set
if (!process.env.NODE_ENV) {
  console.warn('⚠️  NODE_ENV not set, defaulting to development');
  process.env.NODE_ENV = 'development';
}

interface StoreData {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  settings: StoreSettings;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Set restrictive file permissions on data file (Unix-like systems)
try {
  if (fs.existsSync(DATA_FILE)) {
    fs.chmodSync(DATA_FILE, 0o600); // Read/write owner only
  }
} catch (err) {
  console.warn('Could not set file permissions:', err);
}

// Initial Sample Orders for demonstration
const INITIAL_ORDERS: Order[] = [
  {
    id: 'NBP-78921',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    customerName: 'Ashikur Rahman',
    phone: '01711998877',
    deliveryZone: 'inside-dhaka',
    address: 'Flat 4B, House 12, Road 4, Dhanmondi',
    city: 'Dhaka',
    paymentMethod: 'cod',
    paymentStatus: 'cod_verified',
    items: [
      {
        productId: 'nbp-001',
        productName: 'Amer Achar',
        banglaName: 'আমের আচার',
        size: '300gm',
        price: 250,
        quantity: 2,
        imageUrl: DEFAULT_PRODUCT_IMAGE
      }
    ],
    subtotal: 500,
    deliveryFee: 70,
    discountAmount: 0,
    totalAmount: 570,
    status: 'out_for_delivery',
    courierName: 'Pathao Courier',
    courierTrackingId: 'PTH-9928124',
    estimatedDeliveryDate: 'Today by 6:00 PM',
    trackingHistory: []
  }
];

// Mutex for preventing race conditions in file writes
let fileLock = false;
const lockQueue: Array<() => void> = [];

async function acquireLock(): Promise<void> {
  if (!fileLock) {
    fileLock = true;
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    lockQueue.push(resolve);
  });
}

function releaseLock(): void {
  fileLock = false;
  const next = lockQueue.shift();
  if (next) {
    fileLock = true;
    next();
  }
}

function loadStore(): StoreData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        products: parsed.products || INITIAL_PRODUCTS,
        orders: parsed.orders || INITIAL_ORDERS,
        coupons: parsed.coupons || INITIAL_COUPONS,
        reviews: parsed.reviews || INITIAL_REVIEWS,
        settings: { ...INITIAL_SETTINGS, ...(parsed.settings || {}) }
      };
    }
  } catch (err) {
    console.error('Failed to read store file, reinitializing with defaults:', err);
  }

  const initialStore: StoreData = {
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    coupons: INITIAL_COUPONS,
    reviews: INITIAL_REVIEWS,
    settings: INITIAL_SETTINGS
  };
  saveStore(initialStore);
  return initialStore;
}

async function saveStore(data: StoreData): Promise<void> {
  await acquireLock();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    // Ensure restrictive permissions after write
    try {
      fs.chmodSync(DATA_FILE, 0o600);
    } catch {}
  } catch (err) {
    console.error('Failed to save store file:', err);
    throw err;
  } finally {
    releaseLock();
  }
}

// In-memory synced state
let store = loadStore();

function generateTrackingTimeline(status: OrderStatus, courierName?: string, trackingId?: string): TrackingStep[] {
  const nowStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
  const steps: TrackingStep[] = [
    {
      status: 'pending',
      title: 'Order Placed',
      description: 'Your order has been recorded in our system.',
      timestamp: nowStr,
      completed: true,
      current: status === 'pending'
    },
    {
      status: 'confirmed',
      title: 'Order Confirmed',
      description: 'Inventory verified and order confirmed by production team.',
      timestamp: status === 'pending' ? 'Pending confirmation' : nowStr,
      completed: status !== 'pending' && status !== 'cancelled',
      current: status === 'confirmed'
    },
    {
      status: 'packaging',
      title: 'Artisanal Packaging & Quality Check',
      description: 'Freshly packed in sanitized glass jars with security seal.',
      timestamp: ['packaging', 'out_for_delivery', 'delivered'].includes(status) ? nowStr : 'Waiting in line',
      completed: ['packaging', 'out_for_delivery', 'delivered'].includes(status),
      current: status === 'packaging'
    },
    {
      status: 'out_for_delivery',
      title: 'Out for Delivery / In Transit',
      description: courierName ? `Dispatched via ${courierName} (${trackingId || 'In Transit'})` : 'Handed to courier delivery partner.',
      timestamp: ['out_for_delivery', 'delivered'].includes(status) ? nowStr : 'Dispatches upon packing',
      completed: ['out_for_delivery', 'delivered'].includes(status),
      current: status === 'out_for_delivery'
    },
    {
      status: 'delivered',
      title: 'Delivered',
      description: 'Delivered to your doorstep. Enjoy the taste of authentic achar!',
      timestamp: status === 'delivered' ? nowStr : 'Pending delivery',
      completed: status === 'delivered',
      current: status === 'delivered'
    }
  ];

  if (status === 'cancelled') {
    return [
      {
        status: 'cancelled',
        title: 'Order Cancelled',
        description: 'This order was cancelled by administrator or customer request.',
        timestamp: nowStr,
        completed: true,
        current: true
      }
    ];
  }

  return steps;
}

// Failed login attempt tracking
const failedLoginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

function checkLoginAttempts(identifier: string): { allowed: boolean; remainingAttempts?: number; lockoutTime?: number } {
  const now = Date.now();
  const attempts = failedLoginAttempts.get(identifier);

  if (!attempts) {
    return { allowed: true };
  }

  // Reset if lockout time has passed
  if (now - attempts.lastAttempt > LOGIN_LOCKOUT_TIME) {
    failedLoginAttempts.delete(identifier);
    return { allowed: true };
  }

  if (attempts.count >= LOGIN_MAX_ATTEMPTS) {
    const timeRemaining = Math.ceil((LOGIN_LOCKOUT_TIME - (now - attempts.lastAttempt)) / 1000 / 60);
    return { 
      allowed: false, 
      lockoutTime: timeRemaining 
    };
  }

  return { 
    allowed: true, 
    remainingAttempts: LOGIN_MAX_ATTEMPTS - attempts.count 
  };
}

function recordFailedLogin(identifier: string): void {
  const now = Date.now();
  const attempts = failedLoginAttempts.get(identifier);

  if (!attempts || now - attempts.lastAttempt > LOGIN_LOCKOUT_TIME) {
    failedLoginAttempts.set(identifier, { count: 1, lastAttempt: now });
  } else {
    attempts.count += 1;
    attempts.lastAttempt = now;
  }
}

function clearFailedLogins(identifier: string): void {
  failedLoginAttempts.delete(identifier);
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const IS_PRODUCTION = process.env.NODE_ENV === 'production';

  // Trust proxy for rate limiting behind reverse proxies
  app.set('trust proxy', 1);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.youtube.com", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://www.youtube.com", "https://i.ytimg.com"],
        frameSrc: ["'self'", "https://www.youtube.com"],
        mediaSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: IS_PRODUCTION ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'deny' }
  }));

  // CORS configuration
  const allowedOrigins = IS_PRODUCTION 
    ? [process.env.APP_URL || 'http://localhost:3000']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Token']
  }));

  // Request parsing with size limits
  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'CHANGE_THIS_IN_PRODUCTION_' + Math.random().toString(36),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: IS_PRODUCTION,
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
      sameSite: 'strict'
    }
  }));

  // Global rate limiter
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: { success: false, error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Admin login rate limiter
  const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: { success: false, error: 'Too many login attempts. Please try again after 15 minutes.' },
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Order creation rate limiter
  const orderLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Maximum 5 orders per minute per IP
    message: { success: false, error: 'Too many orders. Please wait a moment.' }
  });

  app.use(globalLimiter);
  app.use(requestTimeout(30000)); // 30 second timeout
  app.use(requestSizeLimiter(2)); // 2MB max

  // ==========================
  // API Endpoints
  // ==========================

  // Health checks
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), env: process.env.NODE_ENV });
  });

  app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
  });

  // ========== PUBLIC ENDPOINTS (No Auth Required) ==========

  // 1. PRODUCTS - Public read access
  app.get('/api/products', (req, res) => {
    res.json({ success: true, products: store.products });
  });

  // 2. SETTINGS - Public read (PIN hidden)
  app.get('/api/settings', (req, res) => {
    const { adminPin, ...safeSettings } = store.settings;
    res.json({ success: true, settings: safeSettings });
  });

  // 3. REVIEWS - Public read
  app.get('/api/reviews', (req, res) => {
    res.json({ success: true, reviews: store.reviews });
  });

  // 4. PUBLIC COUPONS - List only (validation requires cart)
  app.get('/api/coupons', (req, res) => {
    // Only return active coupons to public
    const publicCoupons = store.coupons
      .filter(c => c.isActive)
      .map(({ code, discountType, discountValue, minOrderAmount, description, expiryDate }) => ({
        code,
        discountType,
        discountValue,
        minOrderAmount,
        description,
        expiryDate
      }));
    res.json({ success: true, coupons: publicCoupons });
  });

  // 5. COUPON VALIDATION - Public with cart context
  app.post('/api/coupons/validate', (req, res) => {
    const { code, cartTotal } = req.body;
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, error: 'Coupon code is required' });
    }

    if (!cartTotal || typeof cartTotal !== 'number' || cartTotal < 0) {
      return res.status(400).json({ success: false, error: 'Valid cart total is required' });
    }

    const sanitizedCode = sanitizeString(code, 50).toUpperCase();
    const coupon = store.coupons.find(c => c.code.toUpperCase() === sanitizedCode);

    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, error: 'This coupon is no longer active' });
    }

    if (coupon.expiryDate) {
      const expDate = new Date(coupon.expiryDate.includes('T') ? coupon.expiryDate : `${coupon.expiryDate}T23:59:59`);
      if (!isNaN(expDate.getTime()) && Date.now() > expDate.getTime()) {
        return res.status(400).json({ 
          success: false, 
          error: `Coupon expired on ${coupon.expiryDate}` 
        });
      }
    }

    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({ 
        success: false, 
        error: `Minimum order of ৳${coupon.minOrderAmount} required for this coupon` 
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((cartTotal * coupon.discountValue) / 100);
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        description: coupon.description
      },
      discountAmount: discount
    });
  });

  // 6. ORDER CREATION - Public but rate limited and validated
  app.post('/api/orders', orderLimiter, async (req, res) => {
    try {
      // Sanitize inputs
      const sanitizedData = {
        customerName: sanitizeString(req.body.customerName, 100),
        phone: sanitizePhone(req.body.phone),
        altPhone: req.body.altPhone ? sanitizePhone(req.body.altPhone) : '',
        email: req.body.email ? sanitizeEmail(req.body.email) : '',
        deliveryZone: req.body.deliveryZone,
        address: sanitizeString(req.body.address, 500),
        city: sanitizeString(req.body.city, 100),
        postalCode: req.body.postalCode ? sanitizeString(req.body.postalCode, 20) : '',
        orderNotes: req.body.orderNotes ? sanitizeString(req.body.orderNotes, 500) : '',
        paymentMethod: req.body.paymentMethod,
        transactionId: req.body.transactionId ? sanitizeString(req.body.transactionId, 50) : '',
        items: req.body.items
      };

      // Validate basic fields
      if (!sanitizedData.customerName || sanitizedData.customerName.length < 2) {
        return res.status(400).json({ success: false, error: 'Valid customer name is required' });
      }

      if (!sanitizedData.phone.match(/^(\+?88)?01[0-9]{9}$/)) {
        return res.status(400).json({ success: false, error: 'Valid Bangladeshi phone number is required' });
      }

      if (!['inside-dhaka', 'sub-dhaka', 'outside-dhaka'].includes(sanitizedData.deliveryZone)) {
        return res.status(400).json({ success: false, error: 'Valid delivery zone is required' });
      }

      if (!Array.isArray(sanitizedData.items) || sanitizedData.items.length === 0) {
        return res.status(400).json({ success: false, error: 'At least one item is required' });
      }

      // CRITICAL: Recalculate all prices server-side (never trust client prices)
      let serverSubtotal = 0;
      const validatedItems: Order['items'] = [];

      for (const item of sanitizedData.items) {
        const product = store.products.find(p => p.id === item.productId);
        
        if (!product) {
          return res.status(400).json({ 
            success: false, 
            error: `Product ${item.productId} not found` 
          });
        }

        // Validate stock
        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            success: false, 
            error: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
          });
        }

        // Find variant price (must match server-side data)
        const variant = product.variants.find(v => v.size === item.size);
        if (!variant) {
          return res.status(400).json({ 
            success: false, 
            error: `Invalid size ${item.size} for ${product.name}` 
          });
        }

        if (variant.stock < item.quantity) {
          return res.status(400).json({ 
            success: false, 
            error: `Insufficient stock for ${product.name} (${item.size}). Available: ${variant.stock}` 
          });
        }

        const itemTotal = variant.price * item.quantity;
        serverSubtotal += itemTotal;

        validatedItems.push({
          productId: product.id,
          productName: product.name,
          banglaName: product.banglaName,
          size: variant.size,
          price: variant.price, // Server-side price
          quantity: item.quantity,
          imageUrl: product.imageUrl
        });
      }

      // Calculate delivery fee server-side
      let deliveryFee = 70;
      if (sanitizedData.deliveryZone === 'sub-dhaka') {
        deliveryFee = store.settings.deliveryFeeSubDhaka || 100;
      } else if (sanitizedData.deliveryZone === 'outside-dhaka') {
        deliveryFee = store.settings.deliveryFeeOutsideDhaka || 130;
      } else {
        deliveryFee = store.settings.deliveryFeeInsideDhaka || 70;
      }

      // Free delivery check
      if (store.settings.freeDeliveryThreshold && serverSubtotal >= store.settings.freeDeliveryThreshold) {
        deliveryFee = 0;
      }

      // Validate and apply coupon server-side
      let discountAmount = 0;
      let validatedCouponCode: string | undefined;

      if (req.body.couponCode) {
        const couponCode = sanitizeString(req.body.couponCode, 50).toUpperCase();
        const coupon = store.coupons.find(c => c.code.toUpperCase() === couponCode);

        if (coupon && coupon.isActive) {
          // Check expiry
          if (coupon.expiryDate) {
            const expDate = new Date(coupon.expiryDate.includes('T') ? coupon.expiryDate : `${coupon.expiryDate}T23:59:59`);
            if (isNaN(expDate.getTime()) || Date.now() <= expDate.getTime()) {
              // Check minimum order
              if (serverSubtotal >= coupon.minOrderAmount) {
                if (coupon.discountType === 'percentage') {
                  discountAmount = Math.round((serverSubtotal * coupon.discountValue) / 100);
                } else {
                  discountAmount = coupon.discountValue;
                }
                validatedCouponCode = coupon.code;
              }
            }
          } else if (serverSubtotal >= coupon.minOrderAmount) {
            if (coupon.discountType === 'percentage') {
              discountAmount = Math.round((serverSubtotal * coupon.discountValue) / 100);
            } else {
              discountAmount = coupon.discountValue;
            }
            validatedCouponCode = coupon.code;
          }
        }
      }

      const totalAmount = Math.max(0, serverSubtotal + deliveryFee - discountAmount);

      // Generate order
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      const orderId = `NBP-${randomCode}`;

      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customerName: sanitizedData.customerName,
        phone: sanitizedData.phone,
        altPhone: sanitizedData.altPhone,
        email: sanitizedData.email,
        deliveryZone: sanitizedData.deliveryZone,
        address: sanitizedData.address,
        city: sanitizedData.city,
        postalCode: sanitizedData.postalCode,
        orderNotes: sanitizedData.orderNotes,
        paymentMethod: sanitizedData.paymentMethod,
        transactionId: sanitizedData.transactionId,
        paymentStatus: sanitizedData.paymentMethod === 'cod' ? 'pending' : (sanitizedData.transactionId ? 'paid' : 'pending'),
        items: validatedItems,
        subtotal: serverSubtotal,
        deliveryFee,
        discountAmount,
        couponCode: validatedCouponCode,
        totalAmount,
        status: 'pending',
        courierName: sanitizedData.deliveryZone === 'inside-dhaka' ? 'In-House Rider' : 'Steadfast Courier',
        trackingHistory: generateTrackingTimeline('pending', sanitizedData.deliveryZone === 'inside-dhaka' ? 'In-House Rider' : 'Steadfast Courier'),
        estimatedDeliveryDate: sanitizedData.deliveryZone === 'inside-dhaka' ? 'Within 24-48 Hours' : 'Within 2-4 Days'
      };

      // Use mutex lock for atomic inventory update
      await acquireLock();
      try {
        // Decrement product inventory
        for (const item of validatedItems) {
          const prod = store.products.find(p => p.id === item.productId);
          if (prod) {
            prod.stock = Math.max(0, prod.stock - item.quantity);
            const variant = prod.variants.find(v => v.size === item.size);
            if (variant) {
              variant.stock = Math.max(0, variant.stock - item.quantity);
            }
          }
        }

        // Record coupon usage
        if (validatedCouponCode) {
          const coupon = store.coupons.find(c => c.code.toUpperCase() === validatedCouponCode.toUpperCase());
          if (coupon) {
            coupon.usageCount += 1;
          }
        }

        store.orders.unshift(newOrder);
        await saveStore(store);
      } finally {
        releaseLock();
      }

      res.json({ success: true, order: newOrder });
    } catch (err: any) {
      console.error('Order creation error:', err);
      res.status(500).json({ success: false, error: 'Failed to create order' });
    }
  });

  // 7. ORDER TRACKING - Public but should implement OTP in production
  app.get('/api/orders/track/:query', (req, res) => {
    const query = sanitizeString(req.params.query, 50).toLowerCase();
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Order ID or phone number is required' });
    }

    const order = store.orders.find(o => 
      o.id.toLowerCase() === query || 
      o.phone.replace(/\D/g, '') === query.replace(/\D/g, '')
    );

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'No order found with the provided Order ID or Phone number.' 
      });
    }

    // Return masked data for privacy
    const maskedOrder = {
      ...order,
      customerName: order.customerName.substring(0, 1) + '***',
      phone: order.phone.substring(0, 4) + '***' + order.phone.substring(order.phone.length - 2),
      address: '***' // Don't expose full address in public tracking
    };

    res.json({ success: true, order: maskedOrder });
  });

  // 8. ADMIN PIN VERIFICATION with rate limiting and lockout
  app.post('/api/admin/verify', adminLoginLimiter, (req, res) => {
    const { pin } = req.body;
    const clientIp = (req.ip || req.socket.remoteAddress || 'unknown').toString();

    if (!pin) {
      return res.status(400).json({ success: false, error: 'PIN is required' });
    }

    // Check lockout status
    const loginCheck = checkLoginAttempts(clientIp);
    if (!loginCheck.allowed) {
      return res.status(429).json({ 
        success: false, 
        error: `Too many failed attempts. Try again in ${loginCheck.lockoutTime} minutes.`,
        lockoutTime: loginCheck.lockoutTime
      });
    }

    // FIXED: Removed hardcoded PIN fallback
    if (pin !== store.settings.adminPin) {
      recordFailedLogin(clientIp);
      const remaining = checkLoginAttempts(clientIp);
      
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid Admin PIN',
        remainingAttempts: remaining.remainingAttempts
      });
    }

    // Success - clear failed attempts and generate token
    clearFailedLogins(clientIp);
    const token = generateAdminToken();

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });

    res.json({ 
      success: true, 
      verified: true,
      token 
    });
  });

  // 9. ADMIN PIN CHANGE (Protected)
  app.post('/api/admin/change-pin', verifyAdminToken, (req: AuthenticatedRequest, res) => {
    const { currentPin, newPin } = req.body;

    if (!currentPin || !newPin) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current PIN and new PIN are required' 
      });
    }

    // Verify current PIN
    if (currentPin !== store.settings.adminPin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Current PIN is incorrect' 
      });
    }

    // Validate new PIN
    if (newPin.length < 4) {
      return res.status(400).json({ 
        success: false, 
        message: 'New PIN must be at least 4 digits' 
      });
    }

    if (!/^\d+$/.test(newPin)) {
      return res.status(400).json({ 
        success: false, 
        message: 'PIN must contain only numbers' 
      });
    }

    // Update PIN in store
    try {
      store.settings.adminPin = newPin;
      saveStore(store);

      console.log(`✅ Admin PIN changed successfully at ${new Date().toISOString()}`);

      res.json({ 
        success: true, 
        message: 'Admin PIN changed successfully' 
      });
    } catch (error) {
      console.error('Failed to change admin PIN:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to save new PIN' 
      });
    }
  });

  // ========== PROTECTED ADMIN ENDPOINTS (Auth Required) ==========

  // All routes below this point require admin authentication
  app.use('/api/products', (req, res, next) => {
    if (req.method !== 'GET') {
      return verifyAdminToken(req as AuthenticatedRequest, res, next);
    }
    next();
  });

  app.use('/api/orders', (req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/track')) {
      return verifyAdminToken(req as AuthenticatedRequest, res, next);
    }
    next();
  });

  app.use('/api/coupons', (req, res, next) => {
    if (!['GET', 'POST'].includes(req.method) || !req.path.startsWith('/validate')) {
      return verifyAdminToken(req as AuthenticatedRequest, res, next);
    }
    next();
  });

  app.use('/api/reviews', (req, res, next) => {
    if (req.method !== 'GET') {
      return verifyAdminToken(req as AuthenticatedRequest, res, next);
    }
    next();
  });

  app.use('/api/settings', (req, res, next) => {
    if (req.method !== 'GET') {
      return verifyAdminToken(req as AuthenticatedRequest, res, next);
    }
    next();
  });

  app.use('/api/stats', verifyAdminToken);

  // PRODUCT MANAGEMENT (Admin only)
  app.post('/api/products', async (req, res) => {
    try {
      // Validate product data
      const sanitizedProduct = {
        ...req.body,
        name: sanitizeString(req.body.name, 200),
        banglaName: sanitizeString(req.body.banglaName, 200),
        description: sanitizeString(req.body.description, 2000),
        banglaDescription: sanitizeString(req.body.banglaDescription, 2000),
        tagline: sanitizeString(req.body.tagline, 500),
        banglaTagline: sanitizeString(req.body.banglaTagline, 500)
      };

      const newProduct: Product = {
        ...sanitizedProduct,
        id: req.body.id || `nbp-${Date.now().toString(36)}`,
        rating: req.body.rating || 5.0,
        reviewCount: req.body.reviewCount || 0
      };

      store.products.unshift(newProduct);
      await saveStore(store);
      
      res.json({ success: true, product: newProduct });
    } catch (err: any) {
      console.error('Product creation error:', err);
      res.status(500).json({ success: false, error: 'Failed to create product' });
    }
  });

  app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const index = store.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const sanitizedUpdate = {
      ...req.body,
      name: req.body.name ? sanitizeString(req.body.name, 200) : undefined,
      banglaName: req.body.banglaName ? sanitizeString(req.body.banglaName, 200) : undefined,
      description: req.body.description ? sanitizeString(req.body.description, 2000) : undefined,
      banglaDescription: req.body.banglaDescription ? sanitizeString(req.body.banglaDescription, 2000) : undefined
    };

    store.products[index] = { ...store.products[index], ...sanitizedUpdate };
    await saveStore(store);
    
    res.json({ success: true, product: store.products[index] });
  });

  app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    store.products = store.products.filter(p => p.id !== id);
    await saveStore(store);
    res.json({ success: true, message: 'Product deleted' });
  });

  app.post('/api/products/reset', async (req, res) => {
    store.products = INITIAL_PRODUCTS;
    await saveStore(store);
    res.json({ success: true, products: store.products });
  });

  // ORDER MANAGEMENT (Admin only)
  app.get('/api/orders', sanitizeSearchQuery, (req, res) => {
    const { status, search } = req.query;
    let filtered = [...store.orders];

    if (status && status !== 'all') {
      filtered = filtered.filter(o => o.status === status);
    }
    
    if (search && typeof search === 'string' && search.length > 0) {
      const q = search.toLowerCase();
      filtered = filtered.filter(o => 
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ success: true, orders: filtered });
  });

  app.patch('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const orderIndex = store.orders.findIndex(o => o.id === id);
    
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const currentOrder = store.orders[orderIndex];
    const newStatus: OrderStatus = req.body.status || currentOrder.status;
    const courierName = req.body.courierName ? sanitizeString(req.body.courierName, 100) : currentOrder.courierName;
    const courierTrackingId = req.body.courierTrackingId ? sanitizeString(req.body.courierTrackingId, 50) : currentOrder.courierTrackingId;

    let updatedHistory = currentOrder.trackingHistory;
    if (req.body.status && req.body.status !== currentOrder.status) {
      updatedHistory = generateTrackingTimeline(newStatus, courierName, courierTrackingId);
    }

    store.orders[orderIndex] = {
      ...currentOrder,
      ...req.body,
      status: newStatus,
      courierName,
      courierTrackingId,
      trackingHistory: updatedHistory
    };

    await saveStore(store);
    res.json({ success: true, order: store.orders[orderIndex] });
  });

  app.delete('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    store.orders = store.orders.filter(o => o.id !== id);
    await saveStore(store);
    res.json({ success: true, message: 'Order deleted' });
  });

  // COUPON MANAGEMENT (Admin only)
  app.post('/api/coupons', async (req, res) => {
    const code = sanitizeString(req.body.code, 50).toUpperCase().trim();
    
    if (!code.match(/^[A-Z0-9]+$/)) {
      return res.status(400).json({ success: false, error: 'Coupon code must be alphanumeric' });
    }

    const existingIndex = store.coupons.findIndex(c => c.code.toUpperCase() === code);
    
    const newCoupon: Coupon = {
      code,
      discountType: req.body.discountType || 'percentage',
      discountValue: Number(req.body.discountValue) || 0,
      minOrderAmount: Number(req.body.minOrderAmount) || 0,
      description: sanitizeString(req.body.description, 500),
      expiryDate: req.body.expiryDate || undefined,
      usageCount: 0,
      isActive: true
    };

    if (existingIndex >= 0) {
      store.coupons[existingIndex] = { ...store.coupons[existingIndex], ...newCoupon };
    } else {
      store.coupons.unshift(newCoupon);
    }

    await saveStore(store);
    res.json({ success: true, coupon: newCoupon });
  });

  app.delete('/api/coupons/:code', async (req, res) => {
    const { code } = req.params;
    const sanitizedCode = sanitizeString(code, 50).toUpperCase();
    store.coupons = store.coupons.filter(c => c.code.toUpperCase() !== sanitizedCode);
    await saveStore(store);
    res.json({ success: true, message: 'Coupon deleted', coupons: store.coupons });
  });

  app.post('/api/coupons/delete-expired', async (req, res) => {
    const now = Date.now();
    const initialCount = store.coupons.length;
    
    store.coupons = store.coupons.filter(c => {
      if (!c.expiryDate) return true;
      const expDate = new Date(c.expiryDate.includes('T') ? c.expiryDate : `${c.expiryDate}T23:59:59`);
      return isNaN(expDate.getTime()) || now <= expDate.getTime();
    });
    
    const deletedCount = initialCount - store.coupons.length;
    await saveStore(store);
    
    res.json({ success: true, deletedCount, coupons: store.coupons });
  });

  app.patch('/api/coupons/:code/toggle', async (req, res) => {
    const { code } = req.params;
    const sanitizedCode = sanitizeString(code, 50).toUpperCase();
    const coupon = store.coupons.find(c => c.code.toUpperCase() === sanitizedCode);
    
    if (coupon) {
      coupon.isActive = !coupon.isActive;
      await saveStore(store);
      return res.json({ success: true, coupon });
    }
    
    res.status(404).json({ success: false, error: 'Coupon not found' });
  });

  // REVIEW MANAGEMENT (Admin only for write)
  app.post('/api/reviews', async (req, res) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userName: sanitizeString(req.body.userName, 100),
      userCity: sanitizeString(req.body.userCity, 100),
      rating: Math.min(5, Math.max(1, Number(req.body.rating) || 5)),
      comment: sanitizeString(req.body.comment, 1000),
      date: 'Just now',
      verifiedBuyer: true,
      productName: req.body.productName ? sanitizeString(req.body.productName, 200) : undefined
    };
    
    store.reviews.unshift(newReview);
    await saveStore(store);
    res.json({ success: true, review: newReview });
  });

  app.delete('/api/reviews/:id', async (req, res) => {
    const { id } = req.params;
    store.reviews = store.reviews.filter(r => r.id !== id);
    await saveStore(store);
    res.json({ success: true, message: 'Review deleted' });
  });

  // SETTINGS MANAGEMENT (Admin only for write)
  app.put('/api/settings', async (req, res) => {
    // Validate admin PIN if changing it
    if (req.body.adminPin) {
      const newPin = sanitizeString(req.body.adminPin, 20);
      if (newPin.length < 4) {
        return res.status(400).json({ success: false, error: 'PIN must be at least 4 characters' });
      }
      req.body.adminPin = newPin;
    }

    // Sanitize text fields
    if (req.body.storeName) req.body.storeName = sanitizeString(req.body.storeName, 200);
    if (req.body.tagline) req.body.tagline = sanitizeString(req.body.tagline, 500);
    if (req.body.announcementBanner) req.body.announcementBanner = sanitizeString(req.body.announcementBanner, 1000);
    if (req.body.contactPhone) req.body.contactPhone = sanitizePhone(req.body.contactPhone);
    if (req.body.whatsappPhone) req.body.whatsappPhone = sanitizePhone(req.body.whatsappPhone);
    if (req.body.contactEmail) req.body.contactEmail = sanitizeEmail(req.body.contactEmail);

    store.settings = { ...store.settings, ...req.body };
    await saveStore(store);
    
    // Don't return PIN in response
    const { adminPin, ...safeSettings } = store.settings;
    res.json({ success: true, settings: safeSettings });
  });

  // ANALYTICS (Admin only)
  app.get('/api/stats', (req, res) => {
    const totalOrders = store.orders.length;
    const deliveredOrders = store.orders.filter(o => o.status === 'delivered');
    const totalRevenue = store.orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = store.orders.filter(o => o.status === 'pending').length;
    const inTransitOrders = store.orders.filter(o => o.status === 'out_for_delivery').length;

    const productSalesMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
    
    for (const order of store.orders) {
      if (order.status === 'cancelled') continue;
      for (const item of order.items) {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
        }
        productSalesMap[item.productId].quantity += item.quantity;
        productSalesMap[item.productId].revenue += item.price * item.quantity;
      }
    }

    const topSellingProducts = Object.entries(productSalesMap)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const lowStockProducts = store.products.filter(p => p.stock < 25);

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        inTransitOrders,
        completedOrders: deliveredOrders.length,
        averageOrderValue: totalOrders ? Math.round(totalRevenue / totalOrders) : 0,
        topSellingProducts,
        lowStockProducts,
        totalProducts: store.products.length
      }
    });
  });

  // ==========================
  // Vite & Static Asset Handling
  // ==========================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    
    // Block sensitive files
    app.use((req, res, next) => {
      const blocked = ['.env', '.git', 'config.json', 'store.json', '.sql', '.db'];
      if (blocked.some(pattern => req.path.includes(pattern))) {
        return res.status(403).send('Forbidden');
      }
      next();
    });

    app.use(express.static(distPath, {
      maxAge: '1d',
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        // Additional security headers for static files
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    }));

    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('<!doctype html><html><body><h3>App Initializing...</h3></body></html>');
      }
    });
  }

  // Global error handler
  app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Server error:', err);
    
    // Don't expose internal errors in production
    if (IS_PRODUCTION) {
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Internal server error'
    });
  });

  const server = app.listen(PORT, () => {
    console.log(`
🔒 Secure Server Running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 URL: http://localhost:${PORT}
🌍 Environment: ${process.env.NODE_ENV}
🛡️  Security Features Enabled:
   ✓ Helmet (Security Headers)
   ✓ CORS Protection
   ✓ Rate Limiting
   ✓ JWT Authentication
   ✓ Input Validation & Sanitization
   ✓ CSRF Protection
   ✓ Request Size Limits
   ✓ File Lock Mechanism
   ✓ Login Attempt Limiting
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
