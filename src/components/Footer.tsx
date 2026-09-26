import React, { useState } from 'react';
import { Phone, Truck, ShieldCheck, Heart, HandCoins, ChevronDown, ChevronUp } from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { navigateTo } from '../utils/router';

export const Footer: React.FC = () => {
  const { setIsTrackingOpen, settings } = useStore();
  const { lang } = useLanguage();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const phoneDisplay = settings?.contactPhone || '01711-234567';
  const phoneTel = phoneDisplay.replace(/\s+/g, '');

  return (
    <footer className="bg-[#121110] text-stone-400 pt-8 sm:pt-12 pb-8 sm:pb-10 border-t border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        
        {/* Top Brand Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
          
          {/* Brand & Mission Column (5 cols on desktop) */}
          <div className="md:col-span-5 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="md" showText={false} className="shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-base sm:text-lg font-black tracking-wider text-white">
                    NEW BROTHERS
                  </span>
                  <span className="bg-[#D4AF37] text-stone-950 text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase shadow-xs">
                    PICKLEBAR
                  </span>
                </div>
                <span className="text-[11px] tracking-widest text-[#D4AF37] font-bold uppercase block mt-0.5">
                  {lang === 'bn' ? 'খাঁটি আচারের ঘর' : 'House of Authentic Pickles'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md">
              {lang === 'bn' 
                ? 'ঐতিহ্যবাহী পারিবারিক রেসিপিতে ১০০% খাঁটি কাঠের ঘানির সরিষার তেল ও বাছাইকৃত মশলায় তৈরি স্বাস্থ্যসম্মত ঘরোয়া আচার। কোনো কৃত্রিম প্রিজারভেটিভ ছাড়া খাঁটি স্বাদ।'
                : 'Handcrafted artisanal pickles prepared in 100% pure cold-pressed mustard oil with authentic heritage recipes. 100% natural with zero chemical additives.'}
            </p>

            {/* Mobile "See More" / Toggle Button */}
            <div className="md:hidden pt-1">
              <button
                type="button"
                onClick={() => setMobileExpanded(!mobileExpanded)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-xs font-bold hover:text-white transition-all cursor-pointer shadow-2xs"
              >
                <span>
                  {mobileExpanded 
                    ? (lang === 'bn' ? 'ফুটার সংক্ষেপ করুন' : 'Show Less Footer Details') 
                    : (lang === 'bn' ? 'ফুটার বিস্তারিত দেখুন (লিংক ও হেল্পলাইন)' : 'See More Footer Details')}
                </span>
                {mobileExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Links & Contact Details Container (Hidden on mobile unless expanded, always visible on md+) */}
          <div className={`md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 ${mobileExpanded ? 'block' : 'hidden md:grid'}`}>
            
            {/* Quick Links Column */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-stone-200 uppercase tracking-widest font-display">
                {lang === 'bn' ? 'কুইক লিংকস' : 'Quick Links'}
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('/')}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {lang === 'bn' ? 'হোমপেজ' : 'Home'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('/products')}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {lang === 'bn' ? 'সকল আচার সমাহার' : 'All Pickles Collection'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsTrackingOpen(true)}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-left"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span>{lang === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact & Support Column */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-stone-200 uppercase tracking-widest font-display">
                {lang === 'bn' ? 'যোগাযোগ ও হেল্পলাইন' : 'Customer Support'}
              </h4>
              
              <div className="space-y-3 text-xs text-stone-400">
                <a
                  href={`tel:${phoneTel}`}
                  className="flex items-center gap-2.5 text-stone-300 hover:text-[#D4AF37] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-[#D4AF37] group-hover:border-[#D4AF37]/40">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block leading-tight">{phoneDisplay}</span>
                    <span className="text-[11px] text-stone-500">
                      {lang === 'bn' ? 'সকাল ৯টা - রাত ১০টা' : '9:00 AM - 10:00 PM'}
                    </span>
                  </div>
                </a>

                {/* Quality & Trust Highlights */}
                <div className="pt-1 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900/80 border border-stone-800 text-[11px] text-stone-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'bn' ? '১০০% খাঁটি ও ঘরোয়া' : '100% Pure & Artisanal'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900/80 border border-stone-800 text-[11px] text-stone-300">
                    <HandCoins className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{lang === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Minimalist Bottom Bar with Developer Credits */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-center sm:text-left">
            <span>
              © {new Date().getFullYear()} New Brothers Picklebar. {lang === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>
              Website developed by{' '}
              <a
                href="https://www.facebook.com/share/1DiNWoHzD5/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#D4AF37] hover:text-[#D4AF37] underline underline-offset-2 transition-colors cursor-pointer"
              >
                Zauqin
              </a>
            </span>
          </div>

          <div className="flex items-center gap-2 text-stone-500 text-[11px]">
            <span>{lang === 'bn' ? 'ঐতিহ্যবাহী স্বাদে বিশুদ্ধতার প্রতিশ্রুতি' : 'Authentic Heritage Taste'}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-stone-400">
              {lang === 'bn' ? 'হাতে তৈরি খাঁটি আচার' : 'Crafted with care'}
              <Heart className="w-3 h-3 text-rose-500/80 fill-rose-500/40" />
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
