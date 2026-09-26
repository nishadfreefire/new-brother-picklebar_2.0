import React from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AllProductsPage } from './pages/AllProductsPage';
import { Footer } from './components/Footer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { ProductMakingVideoModal } from './components/ProductMakingVideoModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutPage } from './pages/CheckoutPage';
import { TrackingPage } from './pages/TrackingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { CartToastNotification } from './components/CartToastNotification';
import { StickyBottomBar } from './components/StickyBottomBar';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { HomeVideoSection } from './components/HomeVideoSection';
import { HomeHeroSlider } from './components/HomeHeroSlider';
import { IngredientsCarousel } from './components/IngredientsCarousel';
import { StoreContext, StoreProvider, useStore } from './context/StoreContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useRoute, navigateTo } from './utils/router';
import { RefreshCw, ArrowRight } from 'lucide-react';

function AppContent() {
  const { products, isLoadingProducts } = useStore();
  const { lang } = useLanguage();
  const route = useRoute();

  // Home Page Display Products (placed before any early returns to strictly follow React's Rules of Hooks):
  // 1. Strictly prioritize the 3 requested items in front:
  //    #1 আলুবোখারা আচার (Aloo Bokhara)
  //    #2 রসুন আচার (Garlic / Roshun)
  //    #3 নাগা আচার (Naga)
  // 2. Followed by all products marked as isFeatured === true from Admin Panel ("Featured on Home")
  const homeDisplayProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];

    const isAlooBokhara = (p: typeof products[0]) =>
      p.id === 'nbp-005' ||
      p.banglaName.includes('আলুবোখারা') ||
      p.banglaName.includes('আলু বোখারা') ||
      p.name.toLowerCase().includes('aloo');

    const isRoshun = (p: typeof products[0]) =>
      p.id === 'nbp-006' ||
      p.category === 'garlic' ||
      p.banglaName.includes('রসুন') ||
      p.name.toLowerCase().includes('roshun') ||
      p.name.toLowerCase().includes('garlic');

    const isNaga = (p: typeof products[0]) =>
      p.id === 'nbp-007' ||
      p.banglaName.includes('নাগা') ||
      p.name.toLowerCase().includes('naga');

    const aloo = products.find(isAlooBokhara);
    const roshun = products.find(isRoshun);
    const naga = products.find(isNaga);

    // Guaranteed top 3 in order
    const topThree = [aloo, roshun, naga].filter((p): p is typeof products[0] => Boolean(p));
    const topThreeIds = new Set(topThree.map(p => p.id));

    // All other products with isFeatured marked from Admin Panel
    const adminFeatured = products.filter(p => p.isFeatured && !topThreeIds.has(p.id));

    // Combine top three + admin featured items
    const combined = [...topThree, ...adminFeatured];

    // If still less than 5 items, pad with remaining bestsellers/products
    if (combined.length < 5) {
      const remaining = products.filter(p => !topThreeIds.has(p.id) && !combined.some(c => c.id === p.id));
      combined.push(...remaining.slice(0, 5 - combined.length));
    }

    return combined;
  }, [products]);

  // 1. Dedicated Admin Route (/admin)
  if (route.page === 'admin') {
    return <AdminDashboard isStandalonePage={true} />;
  }

  // 2. Dedicated Standalone Checkout Page (/checkout)
  if (route.page === 'checkout') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-[#0F392B] selection:text-white pb-16 sm:pb-0">
        <Header />
        <main className="flex-1 w-full">
          <CheckoutPage />
        </main>
        <Footer />
        <StickyBottomBar />
        <FloatingWhatsAppButton />
        <CartDrawer />
      </div>
    );
  }

  // 3. Dedicated Standalone Order Tracking Page (/track)
  if (route.page === 'track') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-[#0F392B] selection:text-white pb-16 sm:pb-0">
        <Header />
        <main className="flex-1 w-full">
          <TrackingPage initialOrderId={route.orderId} />
        </main>
        <Footer />
        <StickyBottomBar />
        <FloatingWhatsAppButton />
        <CartDrawer />
      </div>
    );
  }

  // 4. Dedicated All Products Page (/products)
  if (route.page === 'products') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-[#0F392B] selection:text-white pb-16 sm:pb-0">
        <Header />
        <main className="flex-1 w-full">
          <AllProductsPage />
        </main>
        <Footer />
        <StickyBottomBar />
        <FloatingWhatsAppButton />
        <CartDrawer />
        <ProductQuickViewModal />
        <ProductMakingVideoModal />
      </div>
    );
  }

  // 5. Dedicated Single Product Page (/product/:id)
  if (route.page === 'product') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-[#0F392B] selection:text-white pb-16 sm:pb-0">
        <Header />
        <main className="flex-1 w-full">
          <ProductDetailPage productId={route.productId} />
        </main>
        <Footer />
        <StickyBottomBar />
        <FloatingWhatsAppButton />
        <CartDrawer />
        <ProductQuickViewModal />
        <ProductMakingVideoModal />
      </div>
    );
  }

  // Home Page: Top 3 Pickles In Front + Admin Featured Products + Direct Link to All Products
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col font-sans selection:bg-[#0F392B] selection:text-white pb-16 sm:pb-0">
      {/* Top Sticky Header */}
      <Header />

      {/* Main Content Showcase */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full py-4 sm:py-6 space-y-8">
        
        {/* Top Hero Slider - Video + Images */}
        <HomeHeroSlider />

        {/* Premium Ingredients Carousel */}
        <IngredientsCarousel />

        {/* Popular & Featured Products Grid Section */}
        <section id="popular-products-section" className="space-y-4">
          
          {/* Section Header (Centered in the Middle) */}
          <div className="text-center py-2 border-b border-[#DECDB8]/80 pb-4">
            <div className="flex items-center justify-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F392B]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
                {lang === 'bn' ? 'জনপ্রিয় ও স্পেশাল আচার' : 'Popular & Featured Pickles'}
              </h2>
            </div>
          </div>

          {/* Responsive Products Grid */}
          {isLoadingProducts && products.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-6 h-6 text-[#0F392B] animate-spin mx-auto" />
              <p className="text-xs font-semibold text-stone-600">আচার লোড হচ্ছে...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {homeDisplayProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Call to action card to explore all pickles */}
          <div className="pt-6 pb-2 text-center">
            <button
              onClick={() => navigateTo('/products')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0F5338] via-[#166A48] to-[#0A432B] hover:from-[#0B442D] hover:via-[#11563A] hover:to-[#073622] text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-950/20 border border-emerald-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <span>{lang === 'bn' ? 'আমাদের সকল ১৫টি খাঁটি ঘরোয়া আচার দেখুন' : 'Explore All 15 Pickles Collection'}</span>
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </button>
          </div>
        </section>

      </main>

      {/* Modern Compact Footer */}
      <Footer />

      {/* Mobile Floating Sticky Bar */}
      <StickyBottomBar />

      {/* Floating WhatsApp Chat Button */}
      <FloatingWhatsAppButton />

      {/* Notification Toast */}
      <CartToastNotification />

      {/* Global Modals */}
      <ProductQuickViewModal />
      <ProductMakingVideoModal />
      <CartDrawer />
    </div>
  );
}

export function App() {
  const store = React.useContext(StoreContext);
  if (!store) {
    return (
      <LanguageProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </LanguageProvider>
    );
  }
  return <AppContent />;
}

export default App;
