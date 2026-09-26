import React from 'react';
import { Droplet, Heart, Truck, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TrustBadges: React.FC = () => {
  const { lang } = useLanguage();

  const badges = [
    {
      icon: Droplet,
      iconBg: 'bg-[#fefbf3]/80 border border-[#fceabd]/80 text-[#D97706]',
      title: {
        bn: 'খাঁটি সরিষার তেল',
        en: '100% Pure Cold-Pressed Mustard Oil'
      },
      desc: {
        bn: 'কোনো কেমিক্যাল বা প্রিজারভেটিভ নেই',
        en: 'Zero artificial preservatives or chemical colors'
      }
    },
    {
      icon: Heart,
      iconBg: 'bg-[#fefbf3]/80 border border-[#fceabd]/80 text-[#B45309]',
      title: {
        bn: 'ঘরোয়া পরিচ্ছন্ন পরিবেশে তৈরি',
        en: 'Hygienically Handcrafted at Home'
      },
      desc: {
        bn: 'নানী-দাদীদের খাঁটি রেসিপি',
        en: 'Authentic heritage grandmother recipes'
      }
    },
    {
      icon: Truck,
      iconBg: 'bg-orange-50/80 border border-orange-200/80 text-[#EA580C]',
      title: {
        bn: 'সারা দেশে হোম ডেলিভারি',
        en: 'Nationwide Express Home Delivery'
      },
      desc: {
        bn: 'ঢাকাতে ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ২-৪ দিন',
        en: 'Dhaka: 24-48 hrs, Outside Dhaka: 2-4 days'
      }
    },
    {
      icon: ShieldCheck,
      iconBg: 'bg-stone-100/80 border border-stone-200/80 text-stone-700',
      title: {
        bn: 'ক্যাশ অন ডেলিভারি',
        en: 'Cash on Delivery (COD)'
      },
      desc: {
        bn: 'পণ্য দেখে টাকা পরিশোধ',
        en: 'Inspect your order before making payment'
      }
    }
  ];

  return (
    <section className="w-full">
      {/* Container: clean card with rounded borders */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-stone-200/90 shadow-2xs">
        {/* Compact 2-column grid on mobile (saves vertical space), 4-cols on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div 
                key={idx}
                className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-stone-50/50 sm:bg-stone-50/40 border border-stone-200/70 sm:border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3.5 hover:border-[#D4AF37]/80 hover:bg-[#fefbf3]/20 transition-all duration-200"
              >
                {/* Icon Squircle */}
                <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${badge.iconBg}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Text Content */}
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-[14px] font-bold text-stone-900 leading-snug tracking-tight">
                    {lang === 'bn' ? badge.title.bn : badge.title.en}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5 leading-snug line-clamp-2">
                    {lang === 'bn' ? badge.desc.bn : badge.desc.en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
