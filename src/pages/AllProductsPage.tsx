import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';
import { navigateTo } from '../utils/router';
import { 
  ChevronRight, 
  Search, 
  RefreshCw, 
  Layers, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export const AllProductsPage: React.FC = () => {
  const { products, isLoadingProducts } = useStore();
  const { lang } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: { bn: 'সকল আচার', en: 'All Pickles' } },
    { id: 'mango', label: { bn: 'আমের আচার', en: 'Mango Pickles' } },
    { id: 'plum', label: { bn: 'বরই আচার', en: 'Plum Pickles' } },
    { id: 'garlic', label: { bn: 'রসুন আচার', en: 'Garlic Pickles' } },
    { id: 'tamarind', label: { bn: 'তেঁতুল আচার', en: 'Tamarind Pickles' } },
    { id: 'chalta', label: { bn: 'চালতা আচার', en: 'Chalta Pickles' } },
    { id: 'amra', label: { bn: 'আমড়া আচার', en: 'Amra Pickles' } },
    { id: 'jalpai', label: { bn: 'জলপাই আচার', en: 'Olive Pickles' } },
  ];

  const displayedProducts = products.filter(product => {
    // Category filter
    if (activeCategory !== 'all' && product.category !== activeCategory) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBanglaName = product.banglaName && product.banglaName.toLowerCase().includes(q);
      const matchTagline = product.tagline && product.tagline.toLowerCase().includes(q);
      const matchBanglaTagline = product.banglaTagline && product.banglaTagline.toLowerCase().includes(q);
      return matchName || matchBanglaName || matchTagline || matchBanglaTagline;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500">
        <button 
          onClick={() => navigateTo('/')} 
          className="hover:text-stone-800 transition-colors cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'হোমপেজে ফিরুন' : 'Back to Home'}</span>
        </button>
        <ChevronRight className="w-3 h-3 text-stone-300" />
        <span className="text-stone-900 font-bold">
          {lang === 'bn' ? 'সকল আচার সমাহার' : 'All Pickles Collection'}
        </span>
      </nav>

      {/* 2. Header & Count */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DECDB8] pb-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F5338] shrink-0" />
            <span>{lang === 'bn' ? 'সকল খাঁটি ঘরোয়া আচার' : 'Complete Pickle Collection'}</span>
            <span className="text-xs font-bold text-[#0F5338] bg-emerald-50 px-2.5 py-1 rounded-full shrink-0 border border-emerald-200/80">
              {displayedProducts.length}টি বয়াম
            </span>
          </h1>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'bn' ? 'আচার খুঁজুন...' : 'Search pickles...'}
            className="w-full bg-white text-xs pl-8 pr-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#0F5338] focus:border-[#0F5338] shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-stone-700 bg-stone-100 rounded-full px-1.5 py-0.5"
            >
              মুছুন
            </button>
          )}
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#0F5338] to-[#166A48] text-white shadow-xs border border-emerald-600/30'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              {lang === 'bn' ? cat.label.bn : cat.label.en}
            </button>
          );
        })}
      </div>

      {/* 4. Products Grid */}
      {isLoadingProducts && products.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-7 h-7 text-[#0F5338] animate-spin mx-auto" />
          <p className="text-xs font-semibold text-stone-600">আচার লোড হচ্ছে...</p>
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-stone-200/80 p-8 space-y-3 max-w-md mx-auto">
          <div className="text-4xl">🥒</div>
          <h2 className="text-base font-bold text-stone-900">
            {lang === 'bn' ? 'কোনো আচার পাওয়া যায়নি' : 'No Pickles Found'}
          </h2>
          <p className="text-xs text-stone-500">
            {lang === 'bn' ? 'দয়া করে অন্য কোনো ক্যাটাগরি বা নাম দিয়ে চেষ্টা করুন।' : 'Try clearing filters or searching for another flavor.'}
          </p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="px-4 py-1.5 bg-gradient-to-r from-[#0F5338] via-[#166A48] to-[#0A432B] hover:from-[#0B442D] hover:via-[#11563A] hover:to-[#073622] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs border border-emerald-500/20"
          >
            {lang === 'bn' ? 'সব আচার দেখুন' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
