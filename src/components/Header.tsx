import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  Globe, 
  X, 
  Menu, 
  Home, 
  ChevronRight,
  Headphones,
  Tag,
  Sparkles,
  Layers
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';
import { navigateTo, useRoute } from '../utils/router';

export const Header: React.FC = () => {
  const { 
    cartItemCount, 
    cartSubtotal, 
    setIsCartOpen, 
    setIsTrackingOpen, 
    filters, 
    setFilters,
    products,
    settings
  } = useStore();
  
  const { lang, setLang, t } = useLanguage();
  const route = useRoute();
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Instant preview items matching search query
  const searchResults = filters.searchQuery.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.banglaName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const handleNavClick = (target: string, sectionId?: string) => {
    setMobileMenuOpen(false);
    if (sectionId) {
      if (route.page !== 'home') {
        navigateTo('/');
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigateTo(target);
    }
  };

  const navItems = [
    {
      id: 'home',
      label: { bn: 'হোম', en: 'Home' },
      icon: Home,
      action: () => handleNavClick('/'),
      isActive: route.page === 'home'
    },
    {
      id: 'products',
      label: { bn: 'সব আচার', en: 'All Pickles' },
      icon: Layers,
      action: () => handleNavClick('/products'),
      isActive: route.page === 'products'
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        {/* Top Minimal Announcement Bar */}
        {showAnnouncement && (settings?.showAnnouncement ?? true) && (
          <div className="bg-[#0F392B] text-stone-100 text-xs py-1.5 px-3 sm:px-4 font-medium relative flex items-center justify-between">
            <div className="container mx-auto flex items-center justify-center gap-2 text-center">
              <span className="inline-flex items-center gap-1.5 text-white font-medium text-[11px] sm:text-xs">
                <Tag className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{settings?.announcementBanner || '🚚 সারাদেশে ক্যাশ অন ডেলিভারি • ৳১৫০০+ অর্ডারে ফ্রি ডেলিভারি'}</span>
              </span>
            </div>
            <button 
              onClick={() => setShowAnnouncement(false)}
              className="text-white/70 hover:text-white p-0.5 cursor-pointer ml-2"
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Header Bar */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
            
            {/* Left: Brand Logo & Search */}
            <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
              {/* Brand Logo - clean without truncation */}
              <div 
                className="flex items-center cursor-pointer select-none" 
                onClick={() => navigateTo('/')}
              >
                <Logo size="md" />
              </div>

              {/* Mobile Search Toggle (placed where Menu was) */}
              <button
                id="header-mobile-search-btn"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/80 transition-colors cursor-pointer shadow-2xs"
                aria-label="Search pickles"
                title="Search pickles"
              >
                <Search className="w-4 h-4 text-stone-700" />
              </button>

              {/* Desktop Modern Search Input (on the left next to logo) */}
              <div className="hidden md:block relative w-48 lg:w-60">
                <input
                  id="main-search-input"
                  type="text"
                  value={filters.searchQuery}
                  onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search pickles..."
                  className="w-full pl-8 pr-7 py-2 bg-stone-50 border border-stone-200/90 rounded-full text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0F392B] focus:border-transparent transition-all shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                {filters.searchQuery && (
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}

                {/* Instant Search Results Dropdown */}
                {isSearchFocused && filters.searchQuery && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-2 border-b border-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider px-3">
                      {lang === 'bn' ? `পণ্য সমাহার (${searchResults.length})` : `Found (${searchResults.length})`}
                    </div>
                    <div className="divide-y divide-stone-100">
                      {searchResults.map(prod => (
                        <div
                          key={prod.id}
                          onMouseDown={() => navigateTo(`/product/${prod.id}`)}
                          className="p-2.5 flex items-center gap-3 hover:bg-stone-50 cursor-pointer transition-colors"
                        >
                          <img src={prod.imageUrl} alt={prod.name} referrerPolicy="no-referrer" className="w-9 h-9 rounded-lg object-cover border border-stone-200" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-stone-900 truncate">
                              {lang === 'bn' ? prod.banglaName : prod.name}
                            </div>
                            <div className="text-[11px] text-stone-400 truncate">
                              {prod.name}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#0F392B]">৳{prod.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Language, Tracking, Menu Button, Cart */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Language Switcher - DESKTOP ONLY */}
              <button
                id="lang-toggle-btn"
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
                title="Toggle Language"
              >
                <Globe className="w-3.5 h-3.5 text-stone-500" />
                <span className="text-[11px]">{lang === 'bn' ? 'English' : 'বাংলা'}</span>
              </button>

              {/* Order Tracking - DESKTOP ONLY */}
              <button
                id="track-order-header-btn"
                onClick={() => setIsTrackingOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
                title="Track Order"
              >
                <Truck className="w-3.5 h-3.5 text-[#0F392B]" />
                <span className="hidden lg:inline">{t('nav.trackOrder')}</span>
              </button>

              {/* Universal Menu Button (Now on the right where search was, English by default) */}
              <button
                id="header-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-[#0F392B] text-stone-700 hover:text-white border border-stone-200/80 transition-all duration-200 cursor-pointer text-xs font-bold shadow-2xs group"
                aria-label="Toggle navigation menu"
                title="Open Menu"
              >
                <Menu className="w-4 h-4 text-stone-700 group-hover:text-white transition-colors" />
                <span>Menu</span>
              </button>

              {/* Modern Cart Button - Desktop Only */}
              <button
                id="cart-drawer-toggle-btn"
                onClick={() => setIsCartOpen(true)}
                className="hidden md:flex relative items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#0F5338] via-[#166A48] to-[#0A432B] hover:from-[#0B442D] hover:via-[#11563A] hover:to-[#073622] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/20 border border-emerald-500/25 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-stone-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="font-extrabold text-emerald-100">৳{cartSubtotal}</span>
              </button>
            </div>
          </div>

          {/* Mobile Search Expandable Box */}
          {mobileSearchOpen && (
            <div className="pb-3 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="relative w-full">
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder="Search pickles..."
                  className="w-full pl-9 pr-9 py-2 bg-stone-50 border border-stone-300 rounded-full text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F392B]"
                  autoFocus
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                {filters.searchQuery && (
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modern Slide-in Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between z-[51] animate-in slide-in-from-left duration-300">
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                <Logo size="md" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Switcher inside Mobile Menu Drawer */}
              <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-stone-400" />
                    <span>{lang === 'bn' ? 'ভাষা / Language' : 'Language / ভাষা'}</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-200/60 rounded-xl border border-stone-200/80">
                  <button
                    type="button"
                    onClick={() => setLang('bn')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      lang === 'bn'
                        ? 'bg-white text-[#0F392B] shadow-2xs font-extrabold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>🇧🇩 বাংলা</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      lang === 'en'
                        ? 'bg-white text-[#0F392B] shadow-2xs font-extrabold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>🇬🇧 English</span>
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="p-4 space-y-1.5">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
                  {lang === 'bn' ? 'মেন্যু নেভিগেশন' : 'Navigation Menu'}
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        item.isActive
                          ? 'bg-[#0F392B] text-white shadow-xs'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label[lang]}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-60" />
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsTrackingOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-[#0F392B]" />
                    <span>{lang === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
              </div>
            </div>

            {/* Bottom Actions inside Drawer */}
            <div className="p-4 border-t border-stone-100 bg-stone-50 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0F5338] via-[#166A48] to-[#0A432B] hover:from-[#0B442D] hover:via-[#11563A] hover:to-[#073622] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 border border-emerald-500/25 cursor-pointer active:scale-98 transition-transform"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>{lang === 'bn' ? `কার্ট দেখুন (৳${cartSubtotal})` : `View Cart (৳${cartSubtotal})`}</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <Headphones className="w-3.5 h-3.5 text-[#0F5338]" />
                  <span>{settings?.contactPhone || '01711-234567'}</span>
                </span>
                <span className="font-semibold text-[#0F5338]">১০০% খাঁটি আচার</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
