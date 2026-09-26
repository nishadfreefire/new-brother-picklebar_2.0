import React, { useState } from 'react';
import { Utensils, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { navigateTo } from '../utils/router';

interface PairingCategory {
  id: string;
  emoji: string;
  name: { bn: string; en: string };
  desc: { bn: string; en: string };
  productIds: string[];
  pairingReason: { bn: string; en: string };
}

const PAIRING_CATEGORIES: PairingCategory[] = [
  {
    id: 'khichuri',
    emoji: '🍲',
    name: { bn: 'ভুনা ও লেটকা খিচুড়ি', en: 'Khichuri Lovers' },
    desc: { bn: 'বৃষ্টির দিনে কিংবা উৎসবের খিচুড়ির সেরা সঙ্গী', en: 'Best match for rainy day hot khichuri' },
    productIds: ['nbp-005', 'nbp-008', 'nbp-002'], // Mishti Boroi, Chaltar Jhura, Amer Foli
    pairingReason: {
      bn: 'খিচুড়ির মৃদু গরম মসলার স্বাদের সাথে মিষ্টি বরই বা চালতার ঝুরা আচারের টক-মিষ্টি ভারসাম্য মুখে অনন্য তৃপ্তি এনে দেয়।',
      en: 'Sweet & sour boroi and shredded chalta pickle provide the ultimate tangy balance to rich khichuri.'
    }
  },
  {
    id: 'biryani',
    emoji: '🍚',
    name: { bn: 'কাচ্চি, বিরিয়ানি ও তেহারি', en: 'Biryani & Tehari' },
    desc: { bn: 'শাহী খাবারের আভিজাত্য বাড়াতে অনন্য আচার', en: 'Royal companions for festive rice dishes' },
    productIds: ['nbp-013', 'nbp-015', 'nbp-014'], // Aloo Bokhara, Naga Morich, Roshun
    pairingReason: {
      bn: 'কাচ্চি ও বিরিয়ানির ভারী স্বাদের সাথে আলুবোখারার মিষ্টি রসালো চাটনি এবং সিলেটের ঝাঁঝালো নাগা আচার অতুলনীয়।',
      en: 'Tangy-sweet aloo bokhara chutney and fiery Sylheti ghost pepper elevate rich festive meats.'
    }
  },
  {
    id: 'dalbhat',
    emoji: '🍛',
    name: { bn: 'সাদা ভাত, ডাল ও ভর্তা', en: 'Steamed Rice & Dal' },
    desc: { bn: 'বাঙালির রোজকার দুপুরের তৃপ্তিকর ভোজ', en: 'Traditional everyday comforting lunch' },
    productIds: ['nbp-001', 'nbp-012', 'nbp-010'], // Amer Achar, Jolpai, Amra
    pairingReason: {
      bn: 'পাতলা মুগ/মসুর ডাল ও গরম ভাতে এক চামচ খাঁটি সরিষার তেলের টক আমের বা জলপাইয়ের আচার পুরো ভোজকে অমৃত করে তোলে।',
      en: 'A spoonful of cold-pressed mustard oil mango or olive pickle turns simple dal-rice into pure bliss.'
    }
  },
  {
    id: 'paratha',
    emoji: '🫓',
    name: { bn: 'সকালের পরোটা ও লুচি', en: 'Breakfast Paratha & Roti' },
    desc: { bn: 'মচমচে পরোটার সাথে একটু মিষ্টি-টক চাটনি', en: 'Crispy warm breakfast flatbreads' },
    productIds: ['nbp-003', 'nbp-011', 'nbp-004'], // Aamsotto, Ada Tetul, Mix
    pairingReason: {
      bn: 'ঘিয়ে ভাজা পরোটার সাথে আমসত্ত্বের নস্টালজিক মিষ্টি আচার অথবা আদা-তেঁতুলের ঝাঁঝালো টক স্বাদ জিভে পানি আনে।',
      en: 'Sweet aamsotto layer or spicy ginger-tamarind pairs wonderfully with buttery hot parathas.'
    }
  },
  {
    id: 'snacks',
    emoji: '🍢',
    name: { bn: 'বিকেলের স্ন্যাক্স ও ফুচকা', en: 'Evening Snacks & Fuchka' },
    desc: { bn: 'সিঙ্গারা, সমুচা, চটপটি ও ক্রিস্পি স্ন্যাক্স', en: 'Crispy savory fritters, samosas & street food' },
    productIds: ['nbp-007', 'nbp-006', 'nbp-009'], // Tetul, Burmese Boroi, Chaltar Slice
    pairingReason: {
      bn: 'মুচমুচে ফ্রায়েড স্ন্যাক্স ও ফুচকার সাথে খাঁটি তেঁতুল বা বার্মিজ বরইয়ের চটপটা ঝাঁঝ জিভের রুচি বাড়িয়ে দেয়।',
      en: 'Mouthwatering tamarind chutney and spiced Burmese jujube amplify crispy evening treats.'
    }
  }
];

export const FoodPairingMatchmaker: React.FC = () => {
  const { products, addToCart } = useStore();
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('khichuri');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const currentCategory = PAIRING_CATEGORIES.find(c => c.id === activeTab) || PAIRING_CATEGORIES[0];

  // Match the recommended product objects
  const recommendedProducts = currentCategory.productIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVariant = product.variants?.[0] || {
      size: '250g',
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock
    };
    addToCart(product, defaultVariant, 1, false);

    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section 
      id="food-pairing-matchmaker"
      className="bg-gradient-to-br from-[#5C3826] via-[#4A2B1D] to-[#341B10] text-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden border border-[#654e22]/40"
    >
      {/* Decorative ambient background rings */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#fefbf3]0/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Header Info */}
      <div className="relative z-10 max-w-3xl mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fefbf3]0/20 text-[#D4AF37] text-xs font-black uppercase tracking-wider mb-3 border border-[#D4AF37]/30">
          <Utensils className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{lang === 'bn' ? 'স্মার্ট আচার ম্যাচমেকার' : 'Pickle & Meal Matchmaker'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-[#fefbf3]">
          {lang === 'bn' ? 'আজ আপনার মেন্যুতে কী আছে?' : 'What are you feasting on today?'}
        </h2>
        <p className="text-xs sm:text-sm text-[#fceabd]/80 mt-2 font-medium leading-relaxed">
          {lang === 'bn'
            ? 'খাবারের ক্যাটাগরি সিলেক্ট করুন—আমাদের এক্সপার্ট শেফ সুপারিশ করবে কোন আচারটি আপনার খাবারের স্বাদ বহুগুণ বাড়িয়ে দেবে!'
            : 'Select your meal to discover the handpicked gourmet pickles that pair flawlessly with your plate.'}
        </p>
      </div>

      {/* Interactive Meal Tabs (Horizontal scroll on mobile) */}
      <div className="relative z-10 flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-6">
        {PAIRING_CATEGORIES.map(category => {
          const isSelected = activeTab === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center gap-2 sm:gap-2.5 px-4 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-[#D4AF37] text-stone-950 border-[#D4AF37] shadow-lg shadow-emerald-950/40 scale-105 font-black'
                  : 'bg-white/10 text-stone-200 border-white/10 hover:bg-white/20 hover:border-white/20'
              }`}
            >
              <span className="text-lg">{category.emoji}</span>
              <span>{category.name[lang]}</span>
            </button>
          );
        })}
      </div>

      {/* Flavor Harmony Quote / Explanation Banner */}
      <div className="relative z-10 bg-black/25 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#fceabd]">
              {lang === 'bn' ? `${currentCategory.name.bn} এর সাথে পারফেক্ট পেয়ারিং:` : `Perfect Pairing Note:`}
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 mt-0.5 leading-relaxed">
              {currentCategory.pairingReason[lang]}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Pickle Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {recommendedProducts.map((product: any) => {
          if (!product) return null;
          const isAdded = addedIds[product.id];
          const variant = product.variants?.[0] || { size: '250g', price: product.price };

          return (
            <div
              key={product.id}
              onClick={() => navigateTo(`/product/${product.id}`)}
              className="bg-white/95 text-stone-900 rounded-2xl p-3.5 sm:p-4.5 border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
            >
              <div className="flex items-center gap-3.5 mb-3">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {variant.size}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="inline-block bg-[#fef6e6] text-[#5C3826] text-[10px] font-black px-2 py-0.5 rounded-md mb-1">
                    {lang === 'bn' ? 'সাজেস্টেড পেয়ারিং' : 'Best Match'}
                  </span>
                  <h3 className="font-extrabold text-stone-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-[#5C3826]">
                    {lang === 'bn' ? product.banglaName : product.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                    {product.name}
                  </p>
                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="text-base sm:text-lg font-black text-[#15803D]">
                      ৳{variant.price}
                    </span>
                    {variant.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        ৳{variant.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(product, e)}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    isAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-gradient-to-r from-[#0F5338] via-[#166A48] to-[#0A432B] hover:from-[#0B442D] hover:via-[#11563A] hover:to-[#073622] text-white active:scale-95 shadow-sm shadow-emerald-950/20 border border-emerald-500/20'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{lang === 'bn' ? 'যোগ হয়েছে ✓' : 'Added!'}</span>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo(`/product/${product.id}`);
                  }}
                  className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>{lang === 'bn' ? 'বিস্তারিত' : 'View'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
