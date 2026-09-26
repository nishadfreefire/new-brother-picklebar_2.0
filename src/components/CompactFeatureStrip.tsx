import React, { useState } from 'react';
import { Sparkles, Flame, ShieldCheck, Compass, Gift, ArrowRight, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { navigateTo } from '../utils/router';

interface CompactFeatureStripProps {
  onOpenSommelier: () => void;
  isSommelierOpen: boolean;
}

export const CompactFeatureStrip: React.FC<CompactFeatureStripProps> = ({ 
  onOpenSommelier, 
  isSommelierOpen 
}) => {
  const { lang } = useLanguage();
  const { setFilters } = useStore();

  const handleQuickFilter = (category: string) => {
    setFilters(prev => ({ ...prev, category: category as any }));
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-2.5">
      {/* Sleek App-Style Feature Bar (Zero clutter, instantaneous access) */}
      <div className="bg-[#11241D] text-white rounded-2xl p-3 sm:p-4 border border-[#23493C] shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Punchy Artisanal Identity Tag */}
        <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-white p-0.5 shrink-0 shadow-xs flex items-center justify-center overflow-hidden">
            <img
              src="https://i.postimg.cc/zGswr7Dq/logo.png"
              alt="New Brother Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-white tracking-tight">
                {lang === 'bn' ? 'নিউ ব্রাদার খাঁটি হোমমেড আচার' : 'New Brother Artisanal Pickles'}
              </span>
              <span className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-[9px] font-bold px-1.5 py-0.2 rounded">
                ১০০% সরিষার তেল
              </span>
            </div>
            <p className="text-[11px] text-stone-300/80 truncate">
              {lang === 'bn' ? 'রোদে শুকানো • কোনো কেমিক্যাল নেই • ক্যাশ অন ডেলিভারি' : 'Sun-cured • Zero chemical preservatives • Nationwide COD'}
            </p>
          </div>
        </div>

        {/* Right: Fast Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          {/* Sommelier Taste Matcher Trigger Button */}
          <button
            type="button"
            onClick={onOpenSommelier}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isSommelierOpen
                ? 'bg-[#D4AF37] text-stone-950 ring-2 ring-[#D4AF37]'
                : 'bg-[#1E4336] hover:bg-[#265343] text-[#D4AF37] border border-[#D4AF37]/30'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'স্বাদ ম্যাচমেকার' : 'Taste Sommelier'}</span>
            {isSommelierOpen ? <X className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
          </button>

          {/* 3-Jar Tasting Box Quick Anchor */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('combo-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-stone-100 border border-white/15 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{lang === 'bn' ? '৩-জার কম্বো (১৫% ছাড়)' : '3-Jar Box (-15%)'}</span>
          </button>
        </div>

      </div>

      {/* Ultra Fast Visual Category Quick-Chips (Designed specifically for rapid mobile tap-to-browse) */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {[
          { id: 'mango', name: 'আমের আচার', icon: '🥭', count: '৫টি' },
          { id: 'boroi', name: 'বরই আচার', icon: '🍒', count: '৩টি' },
          { id: 'garlic', name: 'রসুন আচার', icon: '🧄', count: '২টি' },
          { id: 'tamarind', name: 'তেঁতুল আচার', icon: '🫘', count: '২টি' },
          { id: 'chalta', name: 'চালতা আচার', icon: '🍈', count: '২টি' },
          { id: 'all', name: 'সব কালেকশন', icon: '✨', count: 'সকল' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleQuickFilter(item.id)}
            className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-[#fefbf3]/60 border border-[#E5DACB] hover:border-[#D4AF37]/70 transition-all text-center flex flex-col items-center justify-center group cursor-pointer shadow-2xs"
          >
            <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="text-[11px] sm:text-xs font-bold text-stone-800 line-clamp-1 mt-0.5 group-hover:text-[#0F392B]">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
