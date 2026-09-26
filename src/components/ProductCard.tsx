import React, { useState } from 'react';
import { ShoppingBag, Check, Eye, Award, Heart, Play } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { navigateTo } from '../utils/router';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setQuickViewProduct, setMakingVideoProduct } = useStore();
  const { lang, t } = useLanguage();

  const [isAddedAnim, setIsAddedAnim] = useState(false);

  // Default standard variant
  const currentVariant: ProductVariant =
    product.variants[product.defaultVariantIndex || 0] ||
    product.variants[0] || {
      size: '250g',
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock
    };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentVariant.stock <= 0) return;
    
    addToCart(product, currentVariant, 1, false);
    
    setIsAddedAnim(true);
    setTimeout(() => {
      setIsAddedAnim(false);
    }, 1200);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleCardClick = () => {
    navigateTo(`/product/${product.id}`);
  };

  const discountPercent = currentVariant.originalPrice
    ? Math.round(((currentVariant.originalPrice - currentVariant.price) / currentVariant.originalPrice) * 100)
    : 0;

  // Short Bengali taste label
  const primaryTaste = product.tasteProfiles?.[0] || 'Tok-Jhal-Mishti';
  const getTasteBangla = (taste: string) => {
    if (taste.includes('Sweet-Sour-Spicy') || taste.includes('Tok-Jhal-Mishti')) return 'টক-ঝাল-মিষ্টি';
    if (taste.includes('Naga')) return 'নাগা ঝাল';
    if (taste.includes('Garlic')) return 'রসুন বাটা';
    if (taste.includes('Sour') || taste.includes('Tok')) return 'খাঁটি টক';
    if (taste.includes('Sweet') || taste.includes('Mishti')) return 'মিষ্টি স্বাদ';
    if (taste.includes('Mustard')) return 'সরিষা ঝাঁঝ';
    return 'ঘরোয়া স্বাদ';
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#967623]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden hover:-translate-y-1"
    >
      {/* 1. Product Image Showcase (Full bleed, no extra borders or framing padding) */}
      <a 
        href={`/product/${product.id}`}
        onClick={(e) => {
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            handleCardClick();
          }
        }}
        className="block relative aspect-square w-full overflow-hidden bg-stone-100 cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Quality Badge / Seal */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none flex flex-col gap-1">
          {product.isSignature ? (
            <span className="bg-[#0F392B] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs border border-[#D4AF37]/30 flex items-center gap-1">
              <Award className="w-2.5 h-2.5 text-[#D4AF37]" />
              <span>{lang === 'bn' ? 'সিগনেচার' : 'Signature'}</span>
            </span>
          ) : discountPercent > 0 ? (
            <span className="bg-[#967623] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
              -{discountPercent}% ছাড়
            </span>
          ) : product.isBestSeller ? (
            <span className="bg-[#2B231D] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              ★ হট ফেভারিট
            </span>
          ) : null}
        </div>

        {/* Quick View Eye Button */}
        <button
          type="button"
          onClick={handleQuickView}
          title="এক নজরে দেখুন (Quick View)"
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-[#0F392B] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Out of Stock Mask */}
        {currentVariant.stock <= 0 && (
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              {t('product.outOfStock')}
            </span>
          </div>
        )}
      </a>

      {/* 2. Concise Product Info (Clean, Minimalist Layout: Name, Price, Add to Cart) */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Bengali Name with explicit anchor link */}
          <a
            href={`/product/${product.id}`}
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                handleCardClick();
              }
            }}
            className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-[#0F5338] transition-colors block cursor-pointer"
          >
            {lang === 'bn' ? product.banglaName : product.name}
          </a>

          {/* Video link: "এই আচার কীভাবে তৈরি হয়েছে দেখতে চাইলে ক্লিক করুন" */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMakingVideoProduct(product);
            }}
            className="mt-1.5 w-full py-1 px-2 rounded-lg bg-emerald-50/80 hover:bg-emerald-100 text-[#0F5338] hover:text-[#0A432B] border border-emerald-200/80 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs group/vid"
            title="এই আচার কীভাবে তৈরি হয়েছে দেখতে ক্লিক করুন"
          >
            <Play className="w-3 h-3 text-[#0F5338] fill-[#0F5338] group-hover/vid:scale-110 transition-transform" />
            <span className="truncate">তৈরি প্রণালী দেখতে ক্লিক করুন</span>
          </button>
        </div>

        {/* 3. Pricing & Clean Add to Cart Action */}
        <div className="pt-2 border-t border-stone-200/80 space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-[#0F5338]">
                ৳{currentVariant.price}
              </span>
              {currentVariant.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ৳{currentVariant.originalPrice}
                </span>
              )}
            </div>

            <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
              {currentVariant.size}
            </span>
          </div>

          <button
            id={`add-to-cart-${product.id}`}
            onClick={handleAddToCart}
            disabled={currentVariant.stock <= 0}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer select-none ${
              isAddedAnim
                ? 'bg-emerald-700 text-white shadow-xs'
                : currentVariant.stock <= 0
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#0F5338] via-[#166A48] to-[#0A432B] hover:from-[#0B442D] hover:via-[#11563A] hover:to-[#073622] text-white active:scale-95 shadow-sm shadow-emerald-950/20 border border-emerald-500/20'
            }`}
          >
            {isAddedAnim ? (
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                <span>{lang === 'bn' ? 'যোগ হয়েছে' : 'Added!'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Add to Cart</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
