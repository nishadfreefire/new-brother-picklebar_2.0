import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order, Coupon, Review, StoreSettings, FilterState, DeliveryZone, PaymentMethod, ProductVariant } from '../types';
import { navigateTo } from '../utils/router';

interface StoreContextType {
  products: Product[];
  isLoadingProducts: boolean;
  cart: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number, openDrawer?: boolean) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;
  
  // UI Triggers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  makingVideoProduct: Product | null;
  setMakingVideoProduct: (product: Product | null) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  cartToast: { show: boolean; product: Product; variant: ProductVariant; quantity: number } | null;
  dismissCartToast: () => void;

  // Filter & Search
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filteredProducts: Product[];

  // Settings & Coupons
  settings: StoreSettings | null;
  coupons: Coupon[];
  reviews: Review[];
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Actions
  placeOrder: (orderData: {
    customerName: string;
    phone: string;
    altPhone?: string;
    email?: string;
    deliveryZone: DeliveryZone;
    address: string;
    city: string;
    postalCode?: string;
    orderNotes?: string;
    paymentMethod: PaymentMethod;
    transactionId?: string;
  }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  
  trackOrder: (query: string) => Promise<{ success: boolean; order?: Order; error?: string }>;
  submitReview: (reviewData: { userName: string; userCity: string; rating: number; comment: string; productName?: string }) => Promise<boolean>;

  // Admin Actions (Real-time DB updates)
  refreshData: () => Promise<void>;
  updateProduct: (product: Product) => Promise<boolean>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  resetProducts: () => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: Order['status'], courierName?: string, trackingId?: string) => Promise<boolean>;
  deleteOrder: (orderId: string) => Promise<boolean>;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<boolean>;
  addCoupon: (coupon: Omit<Coupon, 'usageCount' | 'isActive'>) => Promise<boolean>;
  deleteCoupon: (code: string) => Promise<boolean>;
  toggleCoupon: (code: string) => Promise<boolean>;
  deleteExpiredCoupons: () => Promise<{ success: boolean; count: number }>;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  tasteProfiles: [],
  spiceLevel: null,
  minPrice: 0,
  maxPrice: 2000,
  selectedSize: 'all',
  onlyInStock: false,
  onlyOrganic: false,
  sortBy: 'featured'
};

export const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, _setIsCheckoutOpen] = useState(false);
  const setIsCheckoutOpen = useCallback((open: boolean) => {
    _setIsCheckoutOpen(open);
    if (open) {
      setIsCartOpen(false);
      navigateTo('/checkout');
    }
  }, []);
  const [isTrackingOpen, _setIsTrackingOpen] = useState(false);
  const setIsTrackingOpen = useCallback((open: boolean) => {
    _setIsTrackingOpen(open);
    if (open) {
      navigateTo('/track');
    }
  }, []);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [makingVideoProduct, setMakingVideoProduct] = useState<Product | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [cartToast, setCartToast] = useState<{ show: boolean; product: Product; variant: ProductVariant; quantity: number } | null>(null);
  const toastTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const dismissCartToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setCartToast(null);
  };

  // Filters
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Applied coupon
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // 1. Fetch live products and data from server
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products from backend:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  }, []);

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchProducts(), fetchSettings(), fetchCoupons(), fetchReviews()]);
  }, [fetchProducts, fetchSettings, fetchCoupons, fetchReviews]);

  // Initial fetch and real-time synchronization interval (every 8s for live backend sync)
  useEffect(() => {
    refreshData();
    const syncInterval = setInterval(() => {
      fetchProducts();
    }, 8000);
    return () => clearInterval(syncInterval);
  }, [refreshData, fetchProducts]);

  // Cart operations
  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1, openDrawer: boolean = false) => {
    const selectedVariant = variant || product.variants[product.defaultVariantIndex] || product.variants[0];
    
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedVariant.size === selectedVariant.size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedVariant, quantity }];
      }
    });

    // Trigger smooth notification toast instead of forcefully opening drawer
    setCartToast({ show: true, product, variant: selectedVariant, quantity });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setCartToast(null);
    }, 4000);

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.selectedVariant.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedVariant.size === size)));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.selectedVariant.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Recalculate coupon discount whenever subtotal changes
  useEffect(() => {
    if (!appliedCoupon) {
      setCouponDiscount(0);
      return;
    }

    if (cartSubtotal < appliedCoupon.minOrderAmount) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      return;
    }

    let discount = 0;
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      discount = appliedCoupon.discountValue;
    }
    setCouponDiscount(discount);
  }, [cartSubtotal, appliedCoupon]);

  const applyCouponCode = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: cartSubtotal })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponDiscount(data.discountAmount);
        return { success: true, message: `Coupon applied: -৳${data.discountAmount}` };
      } else {
        return { success: false, message: data.error || 'Invalid coupon' };
      }
    } catch (err: any) {
      return { success: false, message: 'Failed to validate coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  // Place order
  const placeOrder = async (orderData: {
    customerName: string;
    phone: string;
    altPhone?: string;
    email?: string;
    deliveryZone: DeliveryZone;
    address: string;
    city: string;
    postalCode?: string;
    orderNotes?: string;
    paymentMethod: PaymentMethod;
    transactionId?: string;
  }) => {
    try {
      // Calculate delivery fee
      let deliveryFee = 70;
      if (settings) {
        if (orderData.deliveryZone === 'inside-dhaka') deliveryFee = settings.deliveryFeeInsideDhaka;
        else if (orderData.deliveryZone === 'sub-dhaka') deliveryFee = settings.deliveryFeeSubDhaka;
        else deliveryFee = settings.deliveryFeeOutsideDhaka;

        // Free delivery rule
        if (settings.freeDeliveryThreshold && cartSubtotal >= settings.freeDeliveryThreshold) {
          deliveryFee = 0;
        }
      }

      const totalAmount = Math.max(0, cartSubtotal + deliveryFee - couponDiscount);

      const items = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        banglaName: item.product.banglaName,
        size: item.selectedVariant.size,
        price: item.selectedVariant.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl
      }));

      const payload = {
        ...orderData,
        items,
        subtotal: cartSubtotal,
        deliveryFee,
        discountAmount: couponDiscount,
        couponCode: appliedCoupon?.code,
        totalAmount
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        refreshData();
        return { success: true, order: data.order };
      } else {
        return { success: false, error: data.error || 'Failed to place order' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error while placing order' };
    }
  };

  // Track order
  const trackOrder = async (query: string) => {
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setActiveTrackingOrder(data.order);
        setIsTrackingOpen(true);
        return { success: true, order: data.order };
      } else {
        return { success: false, error: data.error || 'Order not found' };
      }
    } catch (err: any) {
      return { success: false, error: 'Failed to connect to tracking server' };
    }
  };

  // Submit Review
  const submitReview = async (reviewData: { userName: string; userCity: string; rating: number; comment: string; productName?: string }) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      const data = await res.json();
      if (data.success) {
        fetchReviews();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Admin database controls
  const updateProduct = async (product: Product): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const data = await res.json();
      if (data.success) {
        await fetchProducts();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const data = await res.json();
      if (data.success) {
        await fetchProducts();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await fetchProducts();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const resetProducts = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/products/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchProducts();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], courierName?: string, trackingId?: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, courierName, courierTrackingId: trackingId })
      });
      const data = await res.json();
      return data.success;
    } catch {
      return false;
    }
  };

  const deleteOrder = async (orderId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      return data.success;
    } catch {
      return false;
    }
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const addCoupon = async (coupon: Omit<Coupon, 'usageCount' | 'isActive'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon)
      });
      const data = await res.json();
      if (data.success) {
        fetchCoupons();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteCoupon = async (code: string): Promise<boolean> => {
    // Optimistic local state update
    setCoupons(prev => prev.filter(c => c.code.toUpperCase() !== code.toUpperCase()));
    if (appliedCoupon?.code.toUpperCase() === code.toUpperCase()) {
      removeCoupon();
    }
    try {
      const res = await fetch(`/api/coupons/${encodeURIComponent(code)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.coupons)) {
          setCoupons(data.coupons);
        } else {
          fetchCoupons();
        }
        return true;
      }
      fetchCoupons();
      return false;
    } catch {
      fetchCoupons();
      return false;
    }
  };

  const toggleCoupon = async (code: string): Promise<boolean> => {
    setCoupons(prev => prev.map(c => c.code.toUpperCase() === code.toUpperCase() ? { ...c, isActive: !c.isActive } : c));
    try {
      const res = await fetch(`/api/coupons/${encodeURIComponent(code)}/toggle`, {
        method: 'PATCH'
      });
      const data = await res.json();
      if (data.success) {
        if (!data.coupon.isActive && appliedCoupon?.code.toUpperCase() === code.toUpperCase()) {
          removeCoupon();
        }
        fetchCoupons();
        return true;
      }
      fetchCoupons();
      return false;
    } catch {
      fetchCoupons();
      return false;
    }
  };

  const deleteExpiredCoupons = async (): Promise<{ success: boolean; count: number }> => {
    try {
      const res = await fetch('/api/coupons/delete-expired', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.coupons)) {
          setCoupons(data.coupons);
        } else {
          fetchCoupons();
        }
        return { success: true, count: data.deletedCount || 0 };
      }
      return { success: false, count: 0 };
    } catch {
      return { success: false, count: 0 };
    }
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  // Dynamic filtering calculation
  const filteredProducts = products.filter(p => {
    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q) || p.banglaName.toLowerCase().includes(q);
      const matchTag = p.tagline.toLowerCase().includes(q) || p.banglaTagline.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q) || p.banglaDescription.toLowerCase().includes(q);
      const matchIngredients = p.ingredients.some(i => i.toLowerCase().includes(q));
      if (!matchName && !matchTag && !matchDesc && !matchIngredients) return false;
    }

    // Category
    if (filters.category !== 'all') {
      if (filters.category === 'signature') {
        if (!p.isSignature && p.category !== 'signature') return false;
      } else if (p.category !== filters.category) {
        return false;
      }
    }

    // Taste profile
    if (filters.tasteProfiles.length > 0) {
      const hasMatchingTaste = filters.tasteProfiles.some(t => p.tasteProfiles.includes(t));
      if (!hasMatchingTaste) return false;
    }

    // Spice level
    if (filters.spiceLevel !== null && p.spiceLevel !== filters.spiceLevel) {
      return false;
    }

    // Price range
    if (p.price < filters.minPrice || p.price > filters.maxPrice) {
      return false;
    }

    // Size
    if (filters.selectedSize !== 'all') {
      const hasSize = p.variants.some(v => v.size === filters.selectedSize);
      if (!hasSize) return false;
    }

    // In-Stock
    if (filters.onlyInStock && p.stock <= 0) {
      return false;
    }

    // Organic
    if (filters.onlyOrganic && !p.isOrganic100) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.price - b.price;
    if (filters.sortBy === 'price-high') return b.price - a.price;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
  });

  return (
    <StoreContext.Provider
      value={{
        products,
        isLoadingProducts,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartItemCount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isAdminOpen,
        setIsAdminOpen,
        quickViewProduct,
        setQuickViewProduct,
        makingVideoProduct,
        setMakingVideoProduct,
        activeTrackingOrder,
        setActiveTrackingOrder,
        cartToast,
        dismissCartToast,
        filters,
        setFilters,
        resetFilters,
        filteredProducts,
        settings,
        coupons,
        reviews,
        appliedCoupon,
        couponDiscount,
        applyCouponCode,
        removeCoupon,
        placeOrder,
        trackOrder,
        submitReview,
        refreshData,
        updateProduct,
        addProduct,
        deleteProduct,
        resetProducts,
        updateOrderStatus,
        deleteOrder,
        updateSettings,
        addCoupon,
        deleteCoupon,
        toggleCoupon,
        deleteExpiredCoupons
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
