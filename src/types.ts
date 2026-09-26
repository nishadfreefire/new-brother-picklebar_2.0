export type TasteProfile = 
  | 'Tok (Sour)'
  | 'Jhal (Spicy)'
  | 'Mishti (Sweet)'
  | 'Tok-Jhal-Mishti (Sweet-Sour-Spicy)'
  | 'Garlic Infused'
  | 'Naga Hot'
  | 'Mustard Pungent';

export type Category = 
  | 'all'
  | 'mango'
  | 'garlic'
  | 'boroi'
  | 'tamarind'
  | 'olive'
  | 'chalta'
  | 'amra'
  | 'mixed'
  | 'signature'
  | 'seasonal';

export type SpiceLevel = 1 | 2 | 3 | 4 | 5;

export interface ProductVariant {
  size: string; // '250g' | '400g' | '500g' | '1kg'
  price: number;
  originalPrice?: number;
  stock: number;
}

export interface Review {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  productId?: string;
  productName?: string;
}

export interface Product {
  id: string;
  name: string;
  banglaName: string;
  category: Category;
  tagline: string;
  banglaTagline: string;
  description: string;
  banglaDescription: string;
  imageUrl: string;
  images?: string[];
  tasteProfiles: TasteProfile[];
  spiceLevel?: SpiceLevel;
  price: number; // Base price for default variant
  originalPrice?: number;
  variants: ProductVariant[];
  defaultVariantIndex: number;
  ingredients: string[];
  shelfLife: string;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isSignature?: boolean;
  isNew?: boolean;
  isOrganic100?: boolean;
  rating: number;
  reviewCount: number;
  stock: number;
  pairings: string[]; // e.g. "Khichuri", "Paratha", "Dal-Bhaat"
  benefits: string[];
  makingVideoUrl?: string; // Video showing how this specific pickle is prepared
}

export interface CartItem {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

export type DeliveryZone = 'inside-dhaka' | 'sub-dhaka' | 'outside-dhaka';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket' | 'card';

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'packaging'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  banglaName: string;
  size: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string; // e.g. NBP-28491
  createdAt: string;
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
  paymentStatus: 'pending' | 'paid' | 'cod_verified';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  status: OrderStatus;
  courierName?: 'Pathao Courier' | 'Steadfast Courier' | 'RedX' | 'In-House Rider';
  courierTrackingId?: string;
  trackingHistory: TrackingStep[];
  estimatedDeliveryDate?: string;
  adminNotes?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g., 10 for 10% or 100 for 100 BDT
  minOrderAmount: number;
  description: string;
  expiryDate?: string;
  isActive: boolean;
  usageCount: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactPhone: string;
  whatsappPhone: string;
  whatsappMessage?: string;
  showWhatsappButton?: boolean;
  contactEmail: string;
  officeAddress: string;
  deliveryFeeInsideDhaka: number;
  deliveryFeeSubDhaka: number;
  deliveryFeeOutsideDhaka: number;
  freeDeliveryThreshold: number;
  announcementBanner: string;
  showAnnouncement: boolean;
  adminPin: string;
  bkashNumber: string;
  nagadNumber: string;
  enableCashOnDelivery?: boolean;
  enableBkash?: boolean;
  enableNagad?: boolean;
  craftVideoUrl?: string;
  craftVideoTitle?: string;
  craftVideoSubtitle?: string;
  sliderTitle?: string; // 3-word title for hero slider
  sliderImage1Url?: string; // Image URL for slider image 1
  sliderImage2Url?: string; // Image URL for slider image 2
  sliderImage3Url?: string; // Image URL for slider image 3
  craftVideoAutoplay?: boolean;
  showHomeVideo?: boolean;
}

export interface FilterState {
  searchQuery: string;
  category: Category;
  tasteProfiles: TasteProfile[];
  spiceLevel: number | null; // null for any
  minPrice: number;
  maxPrice: number;
  selectedSize: string;
  onlyInStock: boolean;
  onlyOrganic: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}
