import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Check, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { navigateTo } from '../utils/router';

export const MasterChefHero: React.FC = () => {
  const { products, addToCart, setIsCartOpen } = useStore();
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'signature' | 'spicy' | 'sweet'>('signature');
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  // Pick top signature items
  const signaturePickle = products.find(p => p.id === 'nbp-001' || p.isSignature) || products[0];
  const spicyPickle = products.find(p => p.id === 'nbp-015' || (p.spiceLevel ?? 3) >= 4) || products[1];
  const sweetPickle = products.find(p => p.id === 'nbp-005' || p.name.toLowerCase().includes('boroi')) || products[2];

  const currentHero = activeTab === 'signature' ? signaturePickle : activeTab === 'spicy' ? spicyPickle : sweetPickle;

  const handleHeroAdd = () => {
    if (!currentHero) return;
    addToCart(currentHero, currentHero.variants[0], 1);
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 1200);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#132A22] text-[#F5EFEB] border border-[#274E3F] shadow-2xl p-6 sm:p-10 lg:p-12">
      {/* Warm Ambient Heritage Glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#fefbf3]0/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Col: Masterpiece Storytelling */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          
          {/* Heritage Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C3B30] text-[#D4AF37] text-xs font-semibold tracking-wide border border-[#D4AF37]/20 shadow-xs">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{lang === 'bn' ? 'মাস্টার কারিগরদের ঐতিহ্যবাহী আচার কুটির' : 'Heritage Picklebar Atelier'}</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-editorial font-bold text-white tracking-tight leading-[1.15]">
              {lang === 'bn' ? (
                <>
                  ঘরোয়া রোদে শুকানো <br />
                  <span className="text-[#D4AF37] italic">খাঁটি সরিষার তেলের</span> আসল আচার
                </>
              ) : (
                <>
                  Sun-Cured Artisanal Pickles <br />
                  <span className="text-[#D4AF37] italic">In Pure Cold-Pressed Oil</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-stone-300 font-light leading-relaxed max-w-xl">
              {lang === 'bn'
                ? 'বংশপরম্পরায় চলে আসা খাঁটি গ্রামীণ রেসিপি। কাঠের ঘানির ১ম প্রেস ঝাঁঝালো সরিষার তেল, দেশি কাঁচা ফল ও হাতে ভাজা পাঁচফোড়নে তৈরি প্রতিটি বয়াম।'
                : 'Handcrafted in slow seasonal runs with handpicked native fruits, slow stone-ground heirloom spices, and pure unrefined mustard oil.'}
            </p>
          </div>

          {/* Interactive Curator Flavor Selector Tabs */}
          <div className="pt-2 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]/80">
              {lang === 'bn' ? 'আমাদের বিশেষ সিগনেচার কালেকশন:' : 'Explore Master Curations:'}
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'signature', labelBn: 'আমের স্পেশাল আচার 🥭', labelEn: 'Signature Mango' },
                { id: 'spicy', labelBn: 'সিলেটি নাগা মরিচ 🔥', labelEn: 'Sylheti Ghost Naga' },
                { id: 'sweet', labelBn: 'টক-মিষ্টি বরই আচার 🍒', labelEn: 'Sweet Boroi Chutney' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#D4AF37] text-stone-950 shadow-md scale-102'
                      : 'bg-white/10 hover:bg-white/15 text-stone-200 border border-white/10'
                  }`}
                >
                  {lang === 'bn' ? tab.labelBn : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Core Trust Indicators in Hero */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-3 text-center sm:text-left">
            <div>
              <div className="text-[#D4AF37] font-bold text-sm sm:text-base">১০০% ন্যাচারাল</div>
              <div className="text-[11px] text-stone-400">জিরো কেমিক্যাল</div>
            </div>
            <div>
              <div className="text-[#D4AF37] font-bold text-sm sm:text-base">কাঠের ঘানি</div>
              <div className="text-[11px] text-stone-400">১ম প্রেস সরিষার তেল</div>
            </div>
            <div>
              <div className="text-[#D4AF37] font-bold text-sm sm:text-base">সারাদেশে হোম</div>
              <div className="text-[11px] text-stone-400">ক্যাশ অন ডেলিভারি</div>
            </div>
          </div>

        </div>

        {/* Right Col: Interactive Feature Card of Selected Jar */}
        {currentHero && (
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm bg-[#18362B] border border-[#D4AF37]/20 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md group">
              
              {/* Highlight Ribbon */}
              <div className="absolute top-4 right-4 bg-[#D4AF37] text-stone-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs">
                {lang === 'bn' ? 'স্পেশাল রেসিপি' : 'Special Run'}
              </div>

              {/* Jar Photo with Subtle Golden Frame */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-900/40 mb-4 border border-white/10">
                <img
                  src={currentHero.imageUrl}
                  alt={currentHero.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                  {currentHero.variants[0]?.size || '250g'} কাঁচের বয়াম
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-1 mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  {lang === 'bn' ? currentHero.banglaName : currentHero.name}
                </h3>
                <p className="text-xs text-[#fceabd]/80 font-light line-clamp-2">
                  {currentHero.tagline}
                </p>
              </div>

              {/* Pricing & Add to Cart */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div>
                  <span className="text-xl font-black text-[#D4AF37]">
                    ৳{currentHero.price}
                  </span>
                  {currentHero.originalPrice && (
                    <span className="text-xs text-stone-400 line-through ml-2">
                      ৳{currentHero.originalPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateTo(`/product/${currentHero.id}`)}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    বিস্তারিত
                  </button>

                  <button
                    onClick={handleHeroAdd}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isAddedAnim
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#D4AF37] hover:bg-[#D4AF37] active:bg-[#fefbf3]0 text-stone-950 shadow-md active:scale-95'
                    }`}
                  >
                    {isAddedAnim ? (
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
          </div>
        )}

      </div>
    </section>
  );
};
