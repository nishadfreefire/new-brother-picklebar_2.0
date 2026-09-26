import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Check, Droplet, Clock, ShoppingBag, Truck, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { navigateTo } from '../utils/router';

export const ProductQuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, setIsCheckoutOpen, setMakingVideoProduct } = useStore();
  const { lang, t } = useLanguage();

  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedVariantIdx(quickViewProduct.defaultVariantIndex || 0);
      setActiveImgIdx(0);
      setQuantity(1);
    }
  }, [quickViewProduct?.id]);

  if (!quickViewProduct) return null;

  const rawImages = (quickViewProduct.images && quickViewProduct.images.length > 0)
    ? quickViewProduct.images
    : [quickViewProduct.imageUrl];
  const imagesList = Array.from(new Set(rawImages.filter(Boolean)));
  const hasMultiple = imagesList.length > 1;
  const currentImg = imagesList[activeImgIdx] || imagesList[0] || quickViewProduct.imageUrl;

  const variant = quickViewProduct.variants[selectedVariantIdx] || quickViewProduct.variants[0];

  const handleAddToCart = () => {
    addToCart(quickViewProduct, variant, quantity);
    setIsAddedAnim(true);
    setTimeout(() => {
      setIsAddedAnim(false);
      setQuickViewProduct(null);
    }, 1000);
  };

  const handleInstantBuy = () => {
    addToCart(quickViewProduct, variant, quantity);
    setQuickViewProduct(null);
    navigateTo('/checkout');
  };

  const handleViewFullPage = () => {
    const id = quickViewProduct.id;
    setQuickViewProduct(null);
    navigateTo(`/product/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left: Clean Image & Multi-Image Slider */}
          <div className="md:col-span-5 bg-stone-50 p-5 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-inner bg-white border border-stone-200 select-none group">
                <img
                  src={currentImg}
                  alt={quickViewProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#0F5338] text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs z-10">
                  ১০০% খাঁটি ঘরোয়া
                </div>

                {hasMultiple && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImgIdx(prev => (prev === 0 ? imagesList.length - 1 : prev - 1));
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImgIdx(prev => (prev === imagesList.length - 1 ? 0 : prev + 1));
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 right-2 z-10 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {activeImgIdx + 1} / {imagesList.length}
                    </div>
                  </>
                )}
              </div>

              {hasMultiple && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {imagesList.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImgIdx(idx)}
                      className={`relative w-11 h-11 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImgIdx === idx
                          ? 'border-[#0F5338] scale-95'
                          : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt="Thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Clean Micro Benefits */}
              <div className="space-y-1.5 text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200/80">
                <div className="flex items-center gap-2">
                  <Droplet className="w-3.5 h-3.5 text-[#B8922A]" />
                  <span>ঘানির সরিষার তেল</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>প্রিজারভেটিভ মুক্ত</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>১২ মাস পর্যন্ত মেয়াদ</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleViewFullPage}
              className="mt-4 text-xs font-semibold text-[#0F5338] hover:underline text-center cursor-pointer"
            >
              সম্পূর্ণ বিবরণ দেখুন →
            </button>
          </div>

          {/* Right: Title, Weights, Actions */}
          <div className="md:col-span-7 p-6 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              {/* Taste Badge */}
              <span className="text-[11px] font-bold text-[#0F5338] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block">
                {quickViewProduct.category.toUpperCase()}
              </span>

              {/* Titles */}
              <div>
                <h2 className="text-xl font-bold text-stone-900 leading-snug">
                  {lang === 'bn' ? quickViewProduct.banglaName : quickViewProduct.name}
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  {quickViewProduct.name}
                </p>
              </div>

              {/* Short Tagline */}
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'bn' ? quickViewProduct.banglaTagline || quickViewProduct.tagline : quickViewProduct.tagline}
              </p>

              {/* Making Video Link */}
              <button
                type="button"
                onClick={() => {
                  const p = quickViewProduct;
                  setQuickViewProduct(null);
                  setMakingVideoProduct(p);
                }}
                className="w-full py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0F5338] border border-emerald-200/80 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" />
                  <span>এই আচার কীভাবে তৈরি হয়েছে দেখতে চান?</span>
                </div>
                <span className="font-bold underline text-[11px]">ভিডিও দেখুন</span>
              </button>

              {/* Weight Selector */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-stone-700">সাইজ নির্বাচন করুন:</span>
                <div className="grid grid-cols-3 gap-2">
                  {quickViewProduct.variants.map((v, idx) => {
                    const isSelected = selectedVariantIdx === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariantIdx(idx)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#0F5338] to-[#166A48] text-white border-emerald-600/40 shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="text-xs font-bold">{v.size}</div>
                        <div className={`text-xs font-bold mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-[#0F5338]'}`}>
                          ৳{v.price}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-stone-600">পরিমাণ:</span>
                <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-sm font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-stone-900 min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(variant.stock || 20, quantity + 1))}
                    className="px-2.5 py-1 text-sm font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline justify-between pt-2 border-t border-stone-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#0F5338]">
                    ৳{variant.price * quantity}
                  </span>
                  {variant.originalPrice && (
                    <span className="text-xs text-stone-400 line-through">
                      ৳{variant.originalPrice * quantity}
                    </span>
                  )}
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-50/90 text-emerald-800 border border-emerald-200/80 shadow-2xs">
                  <span className={`w-1.5 h-1.5 rounded-full ${variant.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  <span>{variant.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={variant.stock <= 0}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0F5338] via-[#166A48] to-[#0A432B] hover:from-[#0B442D] hover:via-[#11563A] hover:to-[#073622] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-950/20 border border-emerald-500/20 active:scale-98"
              >
                {isAddedAnim ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>কার্টে যোগ হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleInstantBuy}
                disabled={variant.stock <= 0}
                className="w-full py-2.5 px-4 rounded-xl bg-[#B8922A] hover:bg-[#967623] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <Truck className="w-4 h-4" />
                <span>এখনই অর্ডার করুন</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
