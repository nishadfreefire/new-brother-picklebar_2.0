import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Droplets, 
  ShieldCheck, 
  Heart, 
  Compass, 
  Check, 
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';
import { navigateTo } from '../utils/router';

export const PickleSommelier: React.FC = () => {
  const { products, addToCart, setIsCartOpen } = useStore();
  const { lang } = useLanguage();

  // Step 1: Dish / Occasion
  // Step 2: Heat tolerance
  // Step 3: Flavor profile preference
  const [dish, setDish] = useState<'khichuri' | 'biryani' | 'dalbhat' | 'paratha' | 'snack'>('khichuri');
  const [heat, setHeat] = useState<'mild' | 'medium' | 'extra'>('medium');
  const [preference, setPreference] = useState<'tangy' | 'sweet' | 'garlic' | 'mustard'>('tangy');
  const [isMatchedAnim, setIsMatchedAnim] = useState(false);
  const [addedItemAnim, setAddedItemAnim] = useState<string | null>(null);

  // Recommendations logic based on sensory choices
  const getMatches = (): Product[] => {
    let list = [...products];

    // Score products based on matching criteria
    const scored = list.map(p => {
      let score = 0;

      // Dish pairings
      if (dish === 'khichuri') {
        if (p.category === 'boroi' || p.category === 'chalta' || p.category === 'mango') score += 5;
      } else if (dish === 'biryani') {
        if (p.name.toLowerCase().includes('aloo') || p.category === 'garlic' || (p.spiceLevel ?? 3) >= 4) score += 5;
      } else if (dish === 'dalbhat') {
        if (p.category === 'mango' || p.category === 'olive' || p.category === 'amra') score += 5;
      } else if (dish === 'paratha') {
        if (p.category === 'tamarind' || p.name.toLowerCase().includes('aamsotto') || p.category === 'mixed') score += 5;
      } else {
        if (p.category === 'boroi' || p.category === 'tamarind') score += 5;
      }

      // Heat level
      const currentSpice = p.spiceLevel ?? 3;
      if (heat === 'mild' && currentSpice <= 2) score += 4;
      if (heat === 'medium' && (currentSpice === 2 || currentSpice === 3)) score += 4;
      if (heat === 'extra' && currentSpice >= 4) score += 6;

      // Flavor note
      if (preference === 'tangy' && p.tasteProfiles.some(t => t.toLowerCase().includes('tok') || t.toLowerCase().includes('sour'))) score += 3;
      if (preference === 'sweet' && p.tasteProfiles.some(t => t.toLowerCase().includes('mishti') || t.toLowerCase().includes('sweet'))) score += 3;
      if (preference === 'garlic' && (p.category === 'garlic' || p.name.toLowerCase().includes('roshun'))) score += 4;
      if (preference === 'mustard' && (p.ingredients?.some(ing => ing.toLowerCase().includes('mustard') || ing.includes('সরিষা')) || p.tasteProfiles.some(t => t.includes('Mustard')))) score += 3;

      return { product: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map(s => s.product);
  };

  const matchedProducts = getMatches();

  const handleQuickAdd = (product: Product) => {
    const variant = product.variants[0];
    addToCart(product, variant, 1);
    setAddedItemAnim(product.id);
    setTimeout(() => {
      setAddedItemAnim(null);
    }, 1200);
  };

  return (
    <section 
      id="pickle-sommelier" 
      className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#162E25] to-[#0A1F18] text-[#F3ECE0] border border-[#2D5A4A]/50 p-6 sm:p-8 lg:p-10 shadow-2xl"
    >
      {/* Subtle organic spice pattern decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#fefbf3]0/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        
        {/* Header with Artisanal Taste Guild Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20493A] text-[#D4AF37] text-xs font-semibold tracking-wide border border-[#D4AF37]/20">
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{lang === 'bn' ? 'স্বাদ ম্যাচমেকার ও সোমেলিয়ে' : 'Taste Matchmaker & Sommelier'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-bold text-white tracking-tight">
              {lang === 'bn' ? 'আপনার রুচির পারফেক্ট আচার খুঁজে নিন' : 'Discover Your Exact Flavor Match'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300/80 max-w-xl font-light">
              {lang === 'bn'
                ? 'আপনার খাবার, পছন্দের ঝাল ও স্বাদের নোট নির্বাচন করুন—আমরা সেকেন্ডেই আপনাকে সেরা আচারটি সাজেস্ট করব।'
                : 'Choose what you are eating and your preferred heat scale to unlock your tailored pickle pairing.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-[#0C241C] px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-[#fceabd]/90">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span>{lang === 'bn' ? 'খাবার অনুযায়ী ইন্সট্যান্ট ম্যাচ' : 'Interactive Sensory Finder'}</span>
          </div>
        </div>

        {/* Step-by-Step Interactive Sensory Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white/5 p-4 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-xs">
          
          {/* Step 1: Dish Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#D4AF37]/90 uppercase tracking-wider flex items-center gap-1.5">
              <span>১. কোন খাবারের সাথে খাবেন?</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'khichuri', icon: '🍲', labelBn: 'খিচুড়ি ও ভাত', labelEn: 'Khichuri' },
                { id: 'biryani', icon: '🍚', labelBn: 'কাচ্চি / পোলাও', labelEn: 'Biryani' },
                { id: 'dalbhat', icon: '🍛', labelBn: 'ডাল ও সাদা ভাত', labelEn: 'Rice & Dal' },
                { id: 'paratha', icon: '🫓', labelBn: 'পরোটা ও রুটি', labelEn: 'Paratha' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDish(item.id as any)}
                  className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    dish === item.id 
                      ? 'bg-[#D4AF37] text-stone-950 shadow-md font-bold' 
                      : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.labelBn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Heat Tolerance */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#D4AF37]/90 uppercase tracking-wider flex items-center gap-1.5">
              <span>২. ঝাল কতটুকু পছন্দ?</span>
            </label>
            <div className="space-y-2">
              {[
                { id: 'mild', labelBn: 'মৃদু ঝাল (মায়ের হাতের মৃদু স্বাদ)', labelEn: 'Mild Heat', icon: '🌶️' },
                { id: 'medium', labelBn: 'মাঝারি ঝাল (টক-মিষ্টি ব্যালেন্স)', labelEn: 'Medium Spicy', icon: '🌶️🌶️' },
                { id: 'extra', labelBn: 'চরম নাগা ঝাঁঝ (সিলেটি বোম্বাই মরিচ)', labelEn: 'Extra Hot / Naga', icon: '🔥🌶️🔥' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setHeat(item.id as any)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    heat === item.id 
                      ? 'bg-[#D4AF37] text-stone-950 shadow-md font-bold' 
                      : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
                  }`}
                >
                  <span>{item.labelBn}</span>
                  <span className="text-xs">{item.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Dominant Flavor Note */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#D4AF37]/90 uppercase tracking-wider flex items-center gap-1.5">
              <span>৩. মুখের স্বাদ কী চান?</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'tangy', icon: '🍋', labelBn: 'জিভে জল আনা টক', labelEn: 'Tangy Sour' },
                { id: 'sweet', icon: '🍯', labelBn: 'আখের গুড়ের মিষ্টি', labelEn: 'Jaggery Sweet' },
                { id: 'garlic', icon: '🧄', labelBn: 'দেশি রসুন বাটা', labelEn: 'Garlic Notes' },
                { id: 'mustard', icon: '🌿', labelBn: 'ঘানির সরিষার ঝাঁঝ', labelEn: 'Mustard Punch' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreference(item.id as any)}
                  className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    preference === item.id 
                      ? 'bg-[#D4AF37] text-stone-950 shadow-md font-bold' 
                      : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.labelBn}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Results: Sommelier Curated Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping" />
              <h3 className="text-sm sm:text-base font-bold text-[#fceabd]">
                {lang === 'bn' ? 'আপনার স্বাদের জন্য সেরা ৩টি সুপারিশ:' : 'Top 3 Recommended Pairings:'}
              </h3>
            </div>
            <span className="text-xs text-stone-400 font-medium hidden sm:inline">
              ১০০% খাঁটি সরিষার তেলে প্রস্তুত
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {matchedProducts.map((product, idx) => {
              const currentVariant = product.variants[0];
              const isAdded = addedItemAnim === product.id;

              return (
                <div 
                  key={product.id}
                  className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-900/50">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-2 left-2 bg-[#0F392B]/90 backdrop-blur-xs text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                        ম্যাচ #{idx + 1}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {currentVariant.size}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                        {lang === 'bn' ? product.banglaName : product.name}
                      </h4>
                      <p className="text-xs text-[#fceabd]/80 line-clamp-1 font-light mt-0.5">
                        {product.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-3">
                    <div>
                      <span className="text-base font-black text-[#D4AF37]">৳{currentVariant.price}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => navigateTo(`/product/${product.id}`)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                        title="বিস্তারিত দেখুন"
                      >
                        বিস্তারিত
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isAdded 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-[#D4AF37] hover:bg-[#D4AF37] text-stone-950 shadow-xs active:scale-95'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>যোগ হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
