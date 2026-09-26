import React from 'react';
import { ShoppingBag, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

export const CartToastNotification: React.FC = () => {
  const { cartToast, dismissCartToast, setIsCartOpen } = useStore();
  const { lang } = useLanguage();

  if (!cartToast || !cartToast.show) return null;

  const { product, variant, quantity } = cartToast;

  const handleOpenCart = () => {
    setIsCartOpen(true);
    dismissCartToast();
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-auto max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300 select-none">
      <div className="bg-stone-900/95 text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-stone-700/80 backdrop-blur-md flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Product Thumbnail & Success Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              referrerPolicy="no-referrer"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-stone-700" 
            />
            <div className="absolute -top-1 -right-1 bg-[#15803D] text-white rounded-full p-0.5 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-white truncate">
              {lang === 'bn' ? product.banglaName : product.name}
            </div>
            <div className="text-[11px] text-stone-300 flex items-center gap-1.5 mt-0.5">
              <span>{variant.size}</span>
              <span>•</span>
              <span className="font-semibold text-[#D4AF37]">৳{variant.price * quantity}</span>
              {quantity > 1 && <span className="text-stone-400">({quantity}x)</span>}
            </div>
          </div>
        </div>

        {/* Right: View Cart Button & Dismiss */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleOpenCart}
            className="px-3.5 py-2 rounded-xl bg-[#0F5338] hover:bg-[#0B442D] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'কার্ট দেখুন' : 'View Cart'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={dismissCartToast}
            className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer rounded-lg"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
