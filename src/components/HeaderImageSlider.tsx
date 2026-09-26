import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShieldCheck, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { DEFAULT_PRODUCT_IMAGE } from '../data/initialData';

interface Slide {
  id: number;
  badge: { bn: string; en: string };
  title: { bn: string; en: string };
  subtitle: { bn: string; en: string };
  ctaText: { bn: string; en: string };
  ctaAction: 'products' | 'combo' | 'spicy';
  image: string;
}

export const HeaderImageSlider: React.FC = () => {
  const { lang } = useLanguage();
  const { setFilters } = useStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);

  const slides: Slide[] = [
    {
      id: 1,
      badge: {
        bn: '🌿 ১০০% খাঁটি সরিষার তেল ও রোদে শুকানো',
        en: '🌿 100% Cold-Pressed Mustard Oil'
      },
      title: {
        bn: 'গ্রামবাংলার ঐতিহ্যবাহী খাঁটি হোমমেড আচার',
        en: 'Traditional Artisanal Homemade Pickles'
      },
      subtitle: {
        bn: 'রাজশাহীর সেরা কাঁচা আম, আখের গুড় ও ভাজা পাঁচফোড়নে তৈরি। কোনো কৃত্রিম কেমিক্যাল নেই।',
        en: 'Slow-cured with organic fruits and pure cold-pressed mustard oil. Zero chemical preservatives.'
      },
      ctaText: {
        bn: 'আচার কালেকশন দেখুন',
        en: 'Explore Pickles'
      },
      ctaAction: 'products',
      image: DEFAULT_PRODUCT_IMAGE
    },
    {
      id: 2,
      badge: {
        bn: '🎁 স্পেশাল অফার | ৩ জারের কম্বো বক্স',
        en: '🎁 Special Offer | 3-Jar Tasting Box'
      },
      title: {
        bn: 'পছন্দের ৩টি আচার নিয়ে তৈরি করুন কম্বো বান্ডেল',
        en: 'Craft Your Signature 3-Jar Tasting Box'
      },
      subtitle: {
        bn: 'যেকোনো ৩টি আচার একসাথে নিলে পাচ্ছেন বিশেষ ক্যাশব্যাক ও ফ্রি গিফট বক্স!',
        en: 'Handpick any 3 gourmet pickles and enjoy instant bundle savings with code PICKLE10.'
      },
      ctaText: {
        bn: 'কম্বো বক্স তৈরি করুন',
        en: 'Build Tasting Box'
      },
      ctaAction: 'combo',
      image: DEFAULT_PRODUCT_IMAGE
    },
    {
      id: 3,
      badge: {
        bn: '🌶️ সিগনেচার স্পাইসি | আসল সিলেটি নাগা',
        en: '🌶️ Signature Fiery | Sylheti Naga Chilli'
      },
      title: {
        bn: 'আসল সিলেটি নাগা মরিচ ও খাঁটি রসুনের আচার',
        en: 'Authentic Naga Morich & Garlic Pickle'
      },
      subtitle: {
        bn: 'ঘানির ঝাঁঝালো সরিষার তেল ও আসল নাগা মরিচের সুবাসিত ঝাল — খিচুড়ির সেরা সঙ্গী।',
        en: 'Infused with cold-pressed mustard oil and aromatic ghost peppers for authentic Bengali heat.'
      },
      ctaText: {
        bn: 'ঝাল আচার সমাহার',
        en: 'Shop Spicy Pickles'
      },
      ctaAction: 'spicy',
      image: DEFAULT_PRODUCT_IMAGE
    }
  ];

  // Auto slide
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleAction = (action: Slide['ctaAction']) => {
    if (action === 'combo') {
      const el = document.getElementById('combo-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'spicy') {
      setFilters(prev => ({
        ...prev,
        category: 'all',
        tasteProfiles: ['Jhal (Spicy)', 'Naga Hot']
      }));
      const el = document.getElementById('products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById('products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeSlide = slides[currentSlide];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6">
      <div 
        className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 bg-stone-900 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const touchEndX = e.changedTouches[0].clientX;
          if (touchStartX.current - touchEndX > 50) handleNext();
          if (touchEndX - touchStartX.current > 50) handlePrev();
        }}
      >
        {/* Background Visual Carousel */}
        <div className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[480px] w-full flex items-center overflow-hidden">
          {slides.map((s, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div
                key={s.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={s.image}
                  alt={s.title.en}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
                {/* Modern subtle darkening gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-stone-950/30" />
              </div>
            );
          })}

          {/* Hero Content Overlay */}
          <div className="relative z-20 w-full max-w-3xl px-6 sm:px-12 py-10 sm:py-14 space-y-4 sm:space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D4AF37] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>{activeSlide.badge[lang]}</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {activeSlide.title[lang]}
            </h1>

            {/* Clean 1-2 sentence subtitle */}
            <p className="text-stone-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-normal">
              {activeSlide.subtitle[lang]}
            </p>

            {/* CTAs & Micro Trust Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleAction(activeSlide.ctaAction)}
                className="px-6 py-3 rounded-full bg-[#0F392B] hover:bg-[#164E3D] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 border border-emerald-500/30 cursor-pointer"
              >
                <span>{activeSlide.ctaText[lang]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('combo-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
              >
                {lang === 'bn' ? 'কম্বো অফার দেখুন' : 'View Combo Box'}
              </button>
            </div>

            {/* Quick Micro Trust Row */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 text-[11px] sm:text-xs text-stone-300 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>১০০% খাঁটি সরিষার তেল</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>প্রিজারভেটিভ মুক্ত</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">★</span>
                <span>৪.৯/৫ কাস্টমার রেটিং</span>
              </div>
            </div>
          </div>

          {/* Left / Right Nav Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-stone-900/40 hover:bg-stone-900/80 text-white backdrop-blur-xs border border-white/10 transition-all cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-stone-900/40 hover:bg-stone-900/80 text-white backdrop-blur-xs border border-white/10 transition-all cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-4 right-6 z-30 flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
