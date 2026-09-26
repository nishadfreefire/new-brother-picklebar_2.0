import React from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

export const StickyBottomBar: React.FC = () => {
  const { cartItemCount, cartSubtotal, setIsCartOpen } = useStore();
  const { lang } = useLanguage();

  if (cartItemCount === 0) {
    return null;
  }

  return (
    <aside aria-label="Floating Cart" className="fixed bottom-6 right-4 z-40 sm:hidden animate-in zoom-in-90 slide-in-from-bottom-6 duration-300">
      <button
        id="mobile-floating-cart-btn"
        onClick={() => setIsCartOpen(true)}
        className="group relative flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-full bg-gradient-to-r from-[#0F5338] via-[#166A48] to-[#0A432B] hover:from-[#0B442D] hover:via-[#11563A] hover:to-[#073622] text-white font-display font-bold shadow-2xl shadow-emerald-950/60 border-2 border-emerald-400/90 active:scale-95 transition-all duration-200 cursor-pointer ring-4 ring-emerald-950/20"
        aria-label="View Cart"
      >
        {/* Cart Icon & Count Badge */}
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
          <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-stone-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
            {cartItemCount}
          </span>
        </div>

        {/* Text & Price Info */}
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">
            {lang === 'bn' ? 'কার্ট দেখুন' : 'View Cart'}
          </span>
          <span className="text-sm font-extrabold text-white">
            ৳{cartSubtotal}
          </span>
        </div>

        {/* Arrow indicator */}
        <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center -mr-1">
          <ChevronRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </button>
    </aside>
  );
};

