import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Check, 
  ArrowLeft, 
  Truck, 
  Share2, 
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Play
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Product, ProductVariant } from '../types';
import { navigateTo } from '../utils/router';
import { ProductCard } from './ProductCard';

interface ProductDetailPageProps {
  productId: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const { 
    products, 
    isLoadingProducts, 
    addToCart, 
    setIsCheckoutOpen,
    setMakingVideoProduct
  } = useStore();
  const { lang, t } = useLanguage();

  const decodedId = decodeURIComponent(productId || '').toLowerCase();
  const product = products.find(p => 
    p.id.toLowerCase() === decodedId ||
    (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === decodedId) ||
    (p.banglaName && p.banglaName.toLowerCase() === decodedId)
  );

  // Selected variant state
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  // Dynamic Title
  useEffect(() => {
    if (product) {
      document.title = `${lang === 'bn' ? product.banglaName : product.name} | নিউ ব্রাদার্স আচার বার`;
    }
  }, [product, lang]);

  // Copy link feedback
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync variant index & active image ONLY when navigating to a new productId
  const lastLoadedIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (productId && lastLoadedIdRef.current !== productId) {
      lastLoadedIdRef.current = productId;
      if (product) {
        setSelectedVariantIndex(product.defaultVariantIndex || 0);
      }
      setActiveImageIndex(0);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [productId, product]);

  if (isLoadingProducts && !product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-stone-200 border-t-[#0F392B] rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-stone-500">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 bg-[#fefbf3] text-[#967623] rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">
          {lang === 'bn' ? 'আচারটি পাওয়া যায়নি' : 'Pickle Not Found'}
        </h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          {lang === 'bn'
            ? 'আপনি যে আচারের পেজে যেতে চেয়েছেন তা বর্তমানে তালিকায় নেই।'
            : 'The pickle jar you are looking for may have been removed or is temporarily unavailable.'}
        </p>
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F392B] hover:bg-[#164E3D] text-white text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'bn' ? 'হোমপেজে ফিরে যান' : 'Back to Store'}</span>
        </button>
      </div>
    );
  }

  const currentVariant: ProductVariant = product.variants[selectedVariantIndex] || product.variants[0] || {
    size: '250g',
    price: product.price,
    originalPrice: product.originalPrice,
    stock: product.stock
  };

  const discountPercent = currentVariant.originalPrice
    ? Math.round(((currentVariant.originalPrice - currentVariant.price) / currentVariant.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (currentVariant.stock <= 0) return;
    addToCart(product, currentVariant, quantity);
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 1200);
  };

  const handleBuyNow = () => {
    if (currentVariant.stock <= 0) return;
    addToCart(product, currentVariant, quantity);
    navigateTo('/checkout');
  };

  const handleShare = () => {
    const fullUrl = `${window.location.origin}/product/${product.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-5 sm:space-y-8">
      
      {/* 1. Subtle Breadcrumbs */}
      <nav className="flex items-center flex-wrap gap-1.5 text-xs text-stone-400">
        <button 
          onClick={() => navigateTo('/')} 
          className="hover:text-stone-800 transition-colors cursor-pointer"
        >
          {lang === 'bn' ? 'হোম' : 'Home'}
        </button>
        <ChevronRight className="w-3 h-3 text-stone-300" />
        <button 
          onClick={() => navigateTo('/')} 
          className="hover:text-stone-800 transition-colors cursor-pointer"
        >
          {lang === 'bn' ? 'আচার সমাহার' : 'Pickles'}
        </button>
        <ChevronRight className="w-3 h-3 text-stone-300" />
        <span className="text-stone-800 font-semibold truncate">
          {lang === 'bn' ? product.banglaName : product.name}
        </span>
      </nav>

      {/* 2. Compact Modern 2-Column Product Showcase */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-3 sm:p-6 lg:p-7 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 lg:gap-8">
        
        {/* Left Column: Clean Image & Multi-Image Gallery */}
        <div className="lg:col-span-6 space-y-3">
          {(() => {
            const rawImages = (product.images && product.images.length > 0)
              ? product.images
              : [product.imageUrl];
            const imagesList = Array.from(new Set(rawImages.filter(Boolean)));
            const hasMultiple = imagesList.length > 1;
            const currentImg = imagesList[activeImageIndex] || imagesList[0] || product.imageUrl;

            const handlePrev = (e: React.MouseEvent) => {
              e.stopPropagation();
              setActiveImageIndex(prev => (prev === 0 ? imagesList.length - 1 : prev - 1));
            };

            const handleNext = (e: React.MouseEvent) => {
              e.stopPropagation();
              setActiveImageIndex(prev => (prev === imagesList.length - 1 ? 0 : prev + 1));
            };

            return (
              <>
                <div className="relative aspect-4/3 sm:aspect-square max-h-72 sm:max-h-none w-full rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/60 shadow-inner group select-none">
                  <img
                    src={currentImg}
                    alt={`${product.name} - image ${activeImageIndex + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  
                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pointer-events-none z-10">
                    {product.isSignature ? (
                      <span className="bg-[#0F392B] text-[#D4AF37] text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        {lang === 'bn' ? '⚡ সিগনেচার স্পেশাল' : '⚡ Signature'}
                      </span>
                    ) : discountPercent > 0 ? (
                      <span className="bg-[#B8922A] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        -{discountPercent}% ছাড়
                      </span>
                    ) : (
                      <span className="bg-stone-900/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        ★ ১০০% ঘরোয়া
                      </span>
                    )}
                  </div>

                  {/* Multiple Images Slide Controls - ONLY if multiple images exist */}
                  {hasMultiple && (
                    <>
                      {/* Left Arrow */}
                      <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous image"
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer shadow-md"
                      >
                        <ChevronLeft className="w-5 h-5 -ml-0.5" />
                      </button>

                      {/* Right Arrow */}
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next image"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer shadow-md"
                      >
                        <ChevronRight className="w-5 h-5 -mr-0.5" />
                      </button>

                      {/* Image Counter Badge */}
                      <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs pointer-events-none">
                        {activeImageIndex + 1} / {imagesList.length}
                      </div>
                    </>
                  )}

                  {currentVariant.stock <= 0 && (
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-20">
                      <span className="bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                        {t('product.outOfStock')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Multiple Images Thumbnail Row - ONLY if multiple images exist */}
                {hasMultiple && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                    {imagesList.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-[#0F392B] ring-2 ring-emerald-500/30 scale-95 shadow-sm'
                            : 'border-stone-200 opacity-60 hover:opacity-100 hover:border-stone-300'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* Right Column: Title, Price, Variants, Actions - Clean & Space-Efficient */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
          
          <div className="space-y-2.5 sm:space-y-3">
            
            {/* Category Tag & Share */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-[#0F392B] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                {product.category}
              </span>

              <button
                onClick={handleShare}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer relative"
                title="শেয়ার করুন"
              >
                <Share2 className="w-4 h-4" />
                {copiedLink && (
                  <span className="absolute -bottom-6 right-0 bg-stone-900 text-white text-[10px] px-2 py-0.5 rounded shadow z-10 whitespace-nowrap">
                    লিংক কপি হয়েছে!
                  </span>
                )}
              </button>
            </div>

            {/* Product Title (Compact) */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 leading-tight">
                {lang === 'bn' ? product.banglaName : product.name}
              </h1>
              {lang !== 'bn' && (
                <p className="text-xs text-stone-400 font-normal mt-0.5">
                  {product.name}
                </p>
              )}
            </div>

            {/* Compact Price Row */}
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0F392B]">
                ৳{currentVariant.price}
              </span>
              {currentVariant.originalPrice && (
                <span className="text-xs sm:text-sm text-stone-400 line-through">
                  ৳{currentVariant.originalPrice}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[10px] font-bold text-[#967623] bg-[#fefbf3] px-2 py-0.5 rounded-full border border-[#fceabd]">
                  Save {discountPercent}%
                </span>
              )}
              <div className="ml-auto inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50/90 text-emerald-800 border border-emerald-200/80">
                <span className={`w-1.5 h-1.5 rounded-full ${currentVariant.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span>{currentVariant.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
              </div>
            </div>

            {/* Clean Weight Variant Selector (Compact) */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-stone-600">
                সাইজ নির্বাচন করুন (Weight):
              </div>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {product.variants.map((v, idx) => {
                  const isSelected = selectedVariantIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`p-2 sm:p-2.5 rounded-xl border text-center sm:text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0F5338] bg-emerald-50/90 ring-1 ring-[#0F5338] shadow-2xs'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-stone-900">{v.size}</div>
                      <div className="text-xs sm:text-sm font-extrabold text-[#0F5338] mt-0.5">৳{v.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Price (Single compact row) */}
            <div className="flex items-center justify-between py-1.5 px-2.5 bg-stone-50/70 rounded-xl border border-stone-200/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600">পরিমাণ:</span>
                <div className="flex items-center border border-stone-200 rounded-lg bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-0.5 text-stone-600 hover:bg-stone-50 font-bold text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-2.5 py-0.5 text-xs font-bold text-stone-900 min-w-[26px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(currentVariant.stock || 20, quantity + 1))}
                    className="px-2 py-0.5 text-stone-600 hover:bg-stone-50 font-bold text-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-xs text-stone-500">
                মোট: <strong className="text-sm text-stone-900 font-bold">৳{currentVariant.price * quantity}</strong>
              </div>
            </div>

            {/* Side-by-Side Modern Action Buttons on Mobile & Desktop */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={currentVariant.stock <= 0}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  isAddedAnim
                    ? 'bg-emerald-800 text-white'
                    : currentVariant.stock <= 0
                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#0F5338] via-[#166A48] to-[#0A432B] hover:from-[#0B442D] hover:via-[#11563A] hover:to-[#073622] text-white shadow-emerald-950/20 border border-emerald-500/20 active:scale-98'
                }`}
              >
                {isAddedAnim ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>{lang === 'bn' ? 'যোগ হয়েছে!' : 'Added!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={currentVariant.stock <= 0}
                className="py-2.5 px-3 rounded-xl bg-[#B8922A] hover:bg-[#967623] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 cursor-pointer disabled:opacity-50"
              >
                <Truck className="w-3.5 h-3.5 text-white" />
                <span>{lang === 'bn' ? 'এখনই অর্ডার' : 'Buy Now'}</span>
              </button>
            </div>

            {/* Dedicated Making Video Banner/Link */}
            <div className="bg-orange-50/70 rounded-2xl p-3 sm:p-3.5 border border-orange-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E07A24] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                    এই আচার কীভাবে তৈরি হয়েছে দেখতে চান?
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    ঘরোয়া খাঁটি প্রস্তুত প্রণালী ভিডিও দেখুন
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMakingVideoProduct(product)}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-[#D4AF37] hover:text-[#fceabd] text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>ভিডিও দেখুন</span>
                <Play className="w-3 h-3 fill-current" />
              </button>
            </div>

            {/* Clean Delivery Info */}
            <div className="text-[11px] text-stone-500 pt-0.5 border-t border-stone-100 flex items-center justify-between">
              <span>🚚 সারা দেশে ডেলিভারি</span>
              <span className="text-emerald-700 font-semibold">ক্যাশ অন ডেলিভারি</span>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Clean & Focused Product Details (No clutter, straight to the point) */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-7 shadow-xs space-y-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <span>আচারের বিবরণ ও বিশেষত্ব</span>
          </h2>
          <p className="text-sm text-stone-700 leading-relaxed pt-3">
            {lang === 'bn' ? product.banglaDescription || product.description : product.description}
          </p>
        </div>

        {/* Clean Storage & Usage */}
        <div className="pt-2 border-t border-stone-100">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
            সংরক্ষণ ও ব্যবহার:
          </h3>
          <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
            <li>সর্বদা শুকনো পরিষ্কার চামচ ব্যবহার করুন।</li>
            <li>আচার সবসময় খাঁটি সরিষার তেলে ডুবিয়ে রাখুন।</li>
            <li>মেয়াদকাল: উৎপাদনের তারিখ থেকে ১২ মাস পর্যন্ত সম্পূর্ণ ভালো থাকে।</li>
          </ul>
        </div>
      </div>

      {/* 4. Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-stone-200/80">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900">
              {lang === 'bn' ? 'আরও পছন্দের আচার' : 'You May Also Like'}
            </h3>
            <button
              onClick={() => navigateTo('/')}
              className="text-xs font-semibold text-[#0F5338] hover:underline cursor-pointer"
            >
              {lang === 'bn' ? 'সব আচার দেখুন →' : 'View All →'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
