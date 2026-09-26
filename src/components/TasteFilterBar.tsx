import React, { useState } from 'react';
import { SlidersHorizontal, Flame, X, RotateCcw, Check, ChevronDown, ArrowUpDown, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Category, TasteProfile } from '../types';

export const TasteFilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, filteredProducts, products } = useStore();
  const { lang, t } = useLanguage();

  const categories: { id: Category; labelEn: string; labelBn: string; emoji: string }[] = [
    { id: 'all', labelEn: 'All Pickles', labelBn: 'সকল আচার', emoji: '✨' },
    { id: 'signature', labelEn: 'Signature', labelBn: 'সিগনেচার', emoji: '⚡' },
    { id: 'mango', labelEn: 'Mango', labelBn: 'আমের আচার', emoji: '🥭' },
    { id: 'boroi', labelEn: 'Boroi', labelBn: 'বরই আচার', emoji: '🍒' },
    { id: 'garlic', labelEn: 'Garlic', labelBn: 'রসুন আচার', emoji: '🧄' },
    { id: 'tamarind', labelEn: 'Tamarind', labelBn: 'তেঁতুল আচার', emoji: '🫘' },
    { id: 'chalta', labelEn: 'Chalta', labelBn: 'চালতা আচার', emoji: '🍈' },
    { id: 'amra', labelEn: 'Amra', labelBn: 'আমড়া আচার', emoji: '🍏' },
    { id: 'olive', labelEn: 'Olive', labelBn: 'জলপাই আচার', emoji: '🫒' },
    { id: 'mixed', labelEn: 'Mixed', labelBn: 'মিক্স আচার', emoji: '🥣' }
  ];

  const tasteOptions: { id: TasteProfile; labelBn: string; labelEn: string; color: string }[] = [
    { id: 'Tok-Jhal-Mishti (Sweet-Sour-Spicy)', labelBn: 'টক-ঝাল-মিষ্টি', labelEn: 'Sweet & Sour', color: 'bg-[#fef6e6] text-[#654e22] border-[#D4AF37]' },
    { id: 'Naga Hot', labelBn: 'নাগা ঝাল 🔥', labelEn: 'Naga Hot', color: 'bg-red-100 text-red-900 border-red-300' },
    { id: 'Jhal (Spicy)', labelBn: 'ঝাল আচার', labelEn: 'Spicy', color: 'bg-orange-100 text-orange-900 border-orange-300' },
    { id: 'Tok (Sour)', labelBn: 'খাঁটি টক', labelEn: 'Sour', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { id: 'Garlic Infused', labelBn: 'রসুন জারিত', labelEn: 'Garlic', color: 'bg-stone-200 text-stone-900 border-stone-300' },
    { id: 'Mishti (Sweet)', labelBn: 'মিষ্টি স্বাদ', labelEn: 'Sweet', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' }
  ];

  const toggleTaste = (taste: TasteProfile) => {
    setFilters(prev => {
      const exists = prev.tasteProfiles.includes(taste);
      return {
        ...prev,
        tasteProfiles: exists
          ? prev.tasteProfiles.filter(t => t !== taste)
          : [...prev.tasteProfiles, taste]
      };
    });
  };

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.tasteProfiles.length > 0 || 
    filters.spiceLevel !== null || 
    filters.searchQuery.trim() !== '' ||
    filters.selectedSize !== 'all';

  return (
    <div id="filter-container" className="space-y-3.5">
      {/* 1. Artisanal Category Bar with Wood-Paper Styling */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar py-1">
        {categories.map(cat => {
          const isActive = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilters(prev => ({ ...prev, category: cat.id }))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-[#0F392B] text-[#D4AF37] ring-2 ring-[#0F392B] font-bold'
                  : 'bg-[#FAF7F2] text-stone-700 border border-[#DECDB8] hover:bg-white hover:border-stone-400'
              }`}
            >
              <span className="text-sm">{cat.emoji}</span>
              <span>{lang === 'bn' ? cat.labelBn : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Secondary Taste Pill Strip & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F4EFE6] p-3 sm:p-3.5 rounded-2xl border border-[#DECDB8]">
        
        {/* Taste Profile Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-stone-600 uppercase tracking-wider mr-1 hidden sm:inline">
            {lang === 'bn' ? 'স্বাদ প্রোফাইল:' : 'Taste:'}
          </span>

          {tasteOptions.map(tOption => {
            const isSelected = filters.tasteProfiles.includes(tOption.id);
            return (
              <button
                key={tOption.id}
                onClick={() => toggleTaste(tOption.id)}
                className={`px-3 py-1 rounded-full text-xs transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#0F392B] text-white border-[#0F392B] shadow-xs font-bold'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400 hover:bg-stone-50 font-medium'
                }`}
              >
                {lang === 'bn' ? tOption.labelBn : tOption.labelEn}
              </button>
            );
          })}
        </div>

        {/* Right: Reset & Filter status */}
        <div className="flex items-center gap-2 ml-auto">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#7a5e23] hover:text-[#3a2b11] bg-[#fef6e6] px-3 py-1 rounded-full border border-[#D4AF37] cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'bn' ? 'রিসেট' : 'Reset'}</span>
            </button>
          )}

          <div className="text-xs font-bold text-stone-600 bg-white/80 px-2.5 py-0.5 rounded-md border border-stone-300/80">
            {filteredProducts.length} {lang === 'bn' ? 'টি আচার' : 'jars'}
          </div>
        </div>
      </div>
    </div>
  );
};
