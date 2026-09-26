import React from 'react';
import { Sun, Droplets, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ArtisanalStorySection: React.FC = () => {
  const { lang } = useLanguage();

  const steps = [
    {
      step: '০১',
      icon: Sun,
      color: 'bg-[#fefbf3] text-[#967623] border-[#fceabd]',
      title: { bn: 'প্রাকৃতিক রোদে শুকানো', en: 'Sun-Cured' },
      desc: {
        bn: 'সেরা কাঁচা ফল রোদে শুকিয়ে মসলা মাখানো হয়, যা আসল স্বাদ অক্ষুণ্ণ রাখে।',
        en: 'Fresh regional seasonal fruits are hand-sliced and sun-cured.'
      }
    },
    {
      step: '০২',
      icon: Droplets,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      title: { bn: 'কাঠের ঘানির সরিষার তেল', en: 'Mustard Oil' },
      desc: {
        bn: 'খাঁটি কাঠের ঘানির ১ম প্রেস ঝাঁঝালো সরিষার তেল, কোনো সয়াবিন বা পাম অয়েল নেই।',
        en: 'Crafted strictly in unfiltered first-press pure mustard oil.'
      }
    },
    {
      step: '০৩',
      icon: HeartHandshake,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: { bn: 'হাতে তৈরি পাঁচফোড়ন', en: 'Hand-Ground Spices' },
      desc: {
        bn: 'আস্ত ধনিয়া, মৌরি, মেথি ও মরিচ ভেজে শিল-পাটায় গুঁড়ো করে নিখুঁত স্বাদ।',
        en: 'Whole heirloom spices are roasted gently and stone-ground.'
      }
    },
    {
      step: '০৪',
      icon: ShieldCheck,
      color: 'bg-stone-50 text-stone-700 border-stone-200',
      title: { bn: 'কাঁচের বয়ামে সংরক্ষণ', en: 'Glass Jar Pack' },
      desc: {
        bn: 'জিরো কেমিক্যাল, ১০০% ফুড-গ্রেড কাঁচের বয়ামে তেলের প্রাকৃতিক সুরক্ষায় বন্দি।',
        en: '100% preservative-free in airtight food-grade glass jars.'
      }
    }
  ];

  return (
    <section 
      id="heritage-story-section"
      className="bg-[#FAF6F0] rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-[#E8DCCF] shadow-xs relative overflow-hidden"
    >
      {/* Background Watermark */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-9xl font-serif font-black text-[#654e22]/5 select-none pointer-events-none hidden lg:block">
        আচার
      </div>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-4 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-[#5C3826] text-[11px] font-black uppercase tracking-wider mb-2 border border-[#D9C4B2] shadow-2xs">
          <Award className="w-3 h-3 text-[#B8922A]" />
          <span>{lang === 'bn' ? 'আমাদের বিশুদ্ধতার অঙ্গীকার' : 'Artisanal Purity Guarantee'}</span>
        </div>
        <h2 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif text-stone-900 tracking-tight">
          {lang === 'bn' ? 'কেন নিউ ব্রাদার পিকলবারের আচার অনন্য?' : 'What Makes Our Pickles Special?'}
        </h2>
      </div>

      {/* 4 Pillars Grid - 2 columns on mobile for compact view */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 relative z-10">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-stone-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center border ${item.color}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-black font-serif text-stone-300">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 mb-1 leading-snug">
                  {item.title[lang]}
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {item.desc[lang]}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#5C3826]">
                <ShieldCheck className="w-2.5 h-2.5 text-[#B8922A] shrink-0" />
                <span className="truncate">{lang === 'bn' ? '১০০% খাঁটি ও নির্ভেজাল' : '100% Pure'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
