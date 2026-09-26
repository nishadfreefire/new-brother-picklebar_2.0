import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, bnFallback?: string) => string;
}

const translations: Record<string, { en: string; bn: string }> = {
  // Navigation & Header
  'nav.home': { en: 'Home', bn: 'হোম' },
  'nav.allPickles': { en: 'All Pickles', bn: 'সকল আচার' },
  'nav.combos': { en: 'Pickle Combos', bn: 'স্পেশাল কম্বো' },
  'nav.reviews': { en: 'Customer Reviews', bn: 'গ্রাহক রিভিউ' },
  'nav.trackOrder': { en: 'Track Order', bn: 'অর্ডার ট্র্যাক' },
  'nav.admin': { en: 'Admin Panel', bn: 'অ্যাডমিন প্যানেল' },
  'search.placeholder': { en: 'Search delicious pickles (e.g. Naga Mango, Garlic, Boroi)...', bn: 'পছন্দের আচার খুঁজুন (যেমন: নাগা আম, রসুন, বড়ই)...' },
  
  // Hero
  'hero.badge': { en: '100% PURE GHANI MUSTARD OIL • HOMEMADE', bn: '১০০% খাঁটি ঘানির সরিষার তেল • সম্পূর্ণ ঘরোয়া' },
  'hero.title': { en: 'Handcrafted Authentic Bengali Achar & Pickles', bn: 'গ্রামবাংলার আসল স্বাদের খাঁটি হোমমেড আচার' },
  'hero.subtitle': { en: 'Sun-dried native fruits, organic whole spices, and virgin cold-pressed mustard oil crafted in traditional recipes passed down through generations.', bn: 'রোদে শুকানো সেরা ফল, খাঁটি কাঠের ঘানির সরিষার তেল ও হাতে ভাজা সুগন্ধি পাঁচফোড়নে তৈরি জিভে জল আনা মুখরোচক আচার।' },
  'hero.shopNow': { en: 'Explore 15 Artisan Pickles', bn: '১৫টি স্পেশাল আচার দেখুন' },
  'hero.fastDelivery': { en: '24-48h Delivery across Bangladesh', bn: 'সারা দেশে দ্রুত হোম ডেলিভারি' },

  // Trust badges
  'trust.oil': { en: '100% Pure Mustard Oil', bn: 'খাঁটি সরিষার তেল' },
  'trust.oilDesc': { en: 'Cold pressed, zero adulteration', bn: 'কোনো কেমিক্যাল বা প্রিজারভেটিভ নেই' },
  'trust.homemade': { en: 'Artisanal Batch Crafted', bn: 'ঘরোয়া পরিচ্ছন্ন পরিবেশে তৈরি' },
  'trust.homemadeDesc': { en: 'Traditional sun-dried recipes', bn: 'নানী-দাদীদের খাঁটি রেসিপি' },
  'trust.cod': { en: 'Cash on Delivery', bn: 'ক্যাশ অন ডেলিভারি' },
  'trust.codDesc': { en: 'Pay after checking package', bn: 'পণ্য দেখে টাকা পরিশোধ' },
  'trust.tracking': { en: 'Live Order Tracking', bn: 'লাইভ অর্ডার ট্র্যাকিং' },
  'trust.trackingDesc': { en: 'Real-time SMS & online updates', bn: 'কুরিয়ার আপডেট সরাসরি দেখুন' },

  // Filter
  'filter.all': { en: 'All Items', bn: 'সব আচার' },
  'filter.taste': { en: 'Taste Profile', bn: 'স্বাদের ধরন' },
  'filter.spice': { en: 'Spice Level', bn: 'ঝালের মাত্রা' },
  'filter.price': { en: 'Price Range', bn: 'মূল্য সীমা' },
  'filter.size': { en: 'Jar Size', bn: 'জারের সাইজ' },
  'filter.inStock': { en: 'In Stock Only', bn: 'স্টকে আছে' },
  'filter.reset': { en: 'Clear Filters', bn: 'ফিল্টার মুছুন' },

  // Product Card
  'product.addToCart': { en: 'Add to Cart', bn: 'Add to Cart' },
  'product.buyNow': { en: 'Instant Order (1-Click)', bn: 'এখনই অর্ডার করুন' },
  'product.outOfStock': { en: 'Out of Stock', bn: 'স্টক শেষ' },
  'product.quickView': { en: 'Quick View', bn: 'বিস্তারিত দেখুন' },
  'product.bestSeller': { en: 'Best Seller', bn: 'বেস্ট সেলার' },
  'product.new': { en: 'New Arrival', bn: 'নতুন আইটেম' },
  'product.organic': { en: '100% Organic', bn: '১০০% অরগানিক' },

  // Cart & Checkout
  'cart.title': { en: 'Your Pickle Basket', bn: 'আপনার আচারের ঝুড়ি' },
  'cart.empty': { en: 'Your basket is empty! Add some tangy goodness.', bn: 'আপনার ঝুড়ি খালি! কিছু লোভনীয় আচার যোগ করুন।' },
  'cart.subtotal': { en: 'Subtotal', bn: 'মোট মূল্য' },
  'cart.delivery': { en: 'Delivery Fee', bn: 'ডেলিভারি চার্জ' },
  'cart.discount': { en: 'Discount', bn: 'ডিসকাউন্ট' },
  'cart.total': { en: 'Total Amount', bn: 'সর্বমোট' },
  'cart.checkout': { en: 'Proceed to Fast Checkout', bn: 'অর্ডার সম্পন্ন করুন' },
  'cart.freeShippingProgress': { en: 'Add ৳{amount} more for FREE Delivery!', bn: 'ফ্রি ডেলিভারি পেতে আরও ৳{amount} টাকার অর্ডার করুন!' },
  'cart.freeShippingEarned': { en: '🎉 You have unlocked FREE Delivery!', bn: '🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি পেয়েছেন!' },

  // Checkout
  'checkout.title': { en: 'Express Fast Checkout', bn: 'সহজ ও দ্রুত অর্ডার করুন' },
  'checkout.name': { en: 'Your Full Name', bn: 'আপনার পুরো নাম' },
  'checkout.phone': { en: 'Mobile Number (e.g. 01711XXXXXX)', bn: 'মোবাইল নম্বর (যেমন: 017XXXXXXXX)' },
  'checkout.address': { en: 'Full Delivery Address (House/Road/Area)', bn: 'সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা)' },
  'checkout.city': { en: 'District / City', bn: 'জেলা / শহর' },
  'checkout.deliveryZone': { en: 'Select Delivery Area', bn: 'ডেলিভারি এরিয়া সিলেক্ট করুন' },
  'checkout.insideDhaka': { en: 'Inside Dhaka City (৳70) - 24 to 48 Hours', bn: 'ঢাকা সিটির ভেতরে (৳৭০) - ২৪-৪৮ ঘণ্টা' },
  'checkout.subDhaka': { en: 'Dhaka Sub-Area (৳100) - Savar/Gazipur/Narayanganj', bn: 'ঢাকা সাব-এরিয়া (৳১০০) - সাভার/গাজীপুর/নারায়ণগঞ্জ' },
  'checkout.outsideDhaka': { en: 'Outside Dhaka (৳130) - All Bangladesh Districts', bn: 'ঢাকার বাইরে (৳১৩০) - সারা বাংলাদেশ' },
  'checkout.paymentMethod': { en: 'Payment Method', bn: 'মূল্য পরিশোধের মাধ্যম' },
  'checkout.cod': { en: 'Cash on Delivery (Pay when you receive)', bn: 'ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা দিন)' },
  'checkout.bkash': { en: 'bKash Send Money / Payment', bn: 'বিকাশ পেমেন্ট' },
  'checkout.nagad': { en: 'Nagad Send Money / Payment', bn: 'নগদ পেমেন্ট' },
  'checkout.coupon': { en: 'Have a Promo Coupon?', bn: 'প্রোমো কোড আছে?' },
  'checkout.apply': { en: 'Apply', bn: 'প্রয়োগ' },
  'checkout.placeOrder': { en: 'Confirm Order (ক্যাশ অন ডেলিভারি)', bn: 'অর্ডার নিশ্চিত করুন' },

  // Tracking
  'track.title': { en: 'Real-Time Order Tracking', bn: 'লাইভ অর্ডার ট্র্যাকিং' },
  'track.subtitle': { en: 'Enter your Order ID (e.g. NBP-78921) or 11-digit phone number', bn: 'আপনার অর্ডার আইডি (যেমন: NBP-78921) বা মোবাইল নম্বর দিন' },
  'track.button': { en: 'Track Order', bn: 'ট্র্যাক করুন' },
  'track.status': { en: 'Current Status', bn: 'বর্তমান অবস্থা' },
  'track.courier': { en: 'Assigned Courier Partner', bn: 'কুরিয়ার পার্টনার' },
  'track.timeline': { en: 'Shipment Progress Timeline', bn: 'শিপমেন্ট অগ্রগতি' }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'bn',
  setLang: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('bn'); // Default to Bangla for authentic BD feel, toggleable instantly

  const t = (key: string, bnFallback?: string): string => {
    if (translations[key]) {
      return translations[key][lang] || translations[key].en || key;
    }
    return bnFallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
