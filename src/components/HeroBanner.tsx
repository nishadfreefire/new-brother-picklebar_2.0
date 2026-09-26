import React from 'react';
import { Award, Flame, Shield, ArrowDown, HeartHandshake, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { DEFAULT_PRODUCT_IMAGE } from '../data/initialData';

export const HeroBanner: React.FC = () => {
  const { lang, t } = useLanguage();
  const { setFilters, setIsTrackingOpen } = useStore();

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-radial from-[#244A3C] via-[#16382C] to-[#0E241C] text-white py-12 md:py-16 lg:py-20 border-b border-[#654e22]/30">
      {/* Background Subtle Spices Particle Motifs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#D4AF37] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#E07A24] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Organic Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fefbf3]0/20 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-wide uppercase">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white font-serif">
              {lang === 'bn' ? (
                <>
                  স্বাদে ঐতিহ্যে খাঁটি <span className="text-[#D4AF37] underline decoration-[#D4AF37]/60 decoration-wavy">হোমমেড আচার</span>, কাঠের ঘানির সরিষার তেলে জারিত
                </>
              ) : (
                <>
                  Artisanal Handcrafted <span className="text-[#D4AF37]">Bengali Achar</span> in Pure Cold-Pressed Mustard Oil
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-emerald-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Key Feature Bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-[#fceabd]/90 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 bg-emerald-900/50 backdrop-blur-xs p-2.5 rounded-xl border border-emerald-700/40">
                <Shield className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>০% কৃত্রিম রঙ ও প্রিজারভেটিভ</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-900/50 backdrop-blur-xs p-2.5 rounded-xl border border-emerald-700/40">
                <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>১০০% খাঁটি কাঠের ঘানির তেল</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-900/50 backdrop-blur-xs p-2.5 rounded-xl border border-emerald-700/40 col-span-2 sm:col-span-1">
                <Flame className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>আসল নাগা ও বোম্বাই মরিচ</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                id="hero-explore-btn"
                onClick={scrollToProducts}
                className="px-7 py-3.5 rounded-full bg-[#E07A24] hover:bg-[#C96818] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#654e22]/40 hover:shadow-[#654e22]/60 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>{t('hero.shopNow')}</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                id="hero-track-btn"
                onClick={() => setIsTrackingOpen(true)}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-xs transition-all flex items-center gap-2"
              >
                <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
                <span>{lang === 'bn' ? 'অর্ডার ট্র্যাক ও সহায়তা' : 'Track Order & Support'}</span>
              </button>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-[#2A5948]/80 to-[#1A3F31]/90 rounded-3xl p-5 sm:p-6 border border-[#D4AF37]/30 shadow-2xl backdrop-blur-md">
              
              {/* Featured Badge */}
              <div className="absolute -top-3.5 right-6 bg-[#E07A24] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                🔥 Top Seller • রাজশাহীর কাঁচা আমের আচার
              </div>

              {/* Jar Visual */}
              <div className="relative rounded-2xl overflow-hidden mb-4 aspect-4/3 group">
                <img
                  src={DEFAULT_PRODUCT_IMAGE}
                  alt="Kancha Amer Achar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="text-[#D4AF37] text-xs font-bold block">New Brother Artisanal</span>
                    <h3 className="text-white text-base font-bold">Rajshahi Amer Achar (আমের আচার)</h3>
                  </div>
                  <div className="bg-[#D4AF37] text-[#16382C] font-black text-sm px-2.5 py-1 rounded-lg">
                    ৳260
                  </div>
                </div>
              </div>

              {/* Quick Details */}
              <div className="space-y-2 text-xs text-[#fceabd]/80">
                <div className="flex items-center justify-between py-1 border-b border-white/10">
                  <span className="text-gray-300">তেলের ধরন / Oil Base:</span>
                  <span className="font-bold text-[#D4AF37]">১০০% কাঠের ঘানির সরিষার তেল</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/10">
                  <span className="text-gray-300">ঝালের মাত্রা / Spice:</span>
                  <span className="font-bold text-red-400">🔥🔥🔥🔥 (Extreme Flavor)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-300">ডেলিভারি / Delivery:</span>
                  <span className="font-bold text-emerald-300">সারা বাংলাদেশে ক্যাশ অন ডেলিভারি</span>
                </div>
              </div>

              {/* Customer Rating Proof */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-[#D4AF37] text-xs">
                    {'★★★★★'}
                  </div>
                  <span className="text-xs font-bold text-white">4.9/5</span>
                  <span className="text-[11px] text-gray-300">(310+ Reviews)</span>
                </div>
                <span className="text-[11px] bg-emerald-700/50 text-emerald-200 px-2 py-0.5 rounded font-medium">
                  ✓ Verified Batch
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
