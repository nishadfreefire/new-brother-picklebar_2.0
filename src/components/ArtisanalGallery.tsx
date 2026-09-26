import React from 'react';
import { Camera, Heart, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ArtisanalGallery: React.FC = () => {
  const { lang } = useLanguage();

  const galleryItems = [
    {
      id: 1,
      image: '/images/pickles/mishti-boroi-achar.jpg',
      caption: { bn: 'বৃষ্টির দিনে গরম ভুনা খিচুড়ির সাথে মিষ্টি বরই আচার', en: 'Hot khichuri paired with sweet boroi pickle' },
      user: '@tanvir.foodie',
      rating: 5,
      likes: 142
    },
    {
      id: 2,
      image: '/images/pickles/amer-achar.jpg',
      caption: { bn: 'কাঁচের বয়ামে কাঠের ঘানির খাঁটি সরিষার তেলে আম ও রসুনের আচার', en: 'Pure cold-pressed mustard oil jars' },
      user: '@shahnaz_kitchen',
      rating: 5,
      likes: 198
    },
    {
      id: 3,
      image: '/images/pickles/naga-achar.jpg',
      caption: { bn: 'সিলেটি খাঁটি নাগা মরিচের সুবাসিত ঝাঁঝ – চরম ঝালপ্রেমীদের জন্য', en: 'Fiery Sylheti ghost pepper signature' },
      user: '@sylhet_spicelovers',
      rating: 5,
      likes: 276
    },
    {
      id: 4,
      image: '/images/pickles/aloo-bokhara-achar.jpg',
      caption: { bn: 'কাচ্চি বিরিয়ানির সাথে মিষ্টি-টক আলুবোখারা চাটনি', en: 'Royal Aloo Bokhara with fragrant biryani' },
      user: '@dhaka_gourmet',
      rating: 5,
      likes: 310
    }
  ];

  return (
    <section id="pickle-moments-gallery" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2 border border-rose-200">
            <Camera className="w-3.5 h-3.5 text-rose-600" />
            <span>{lang === 'bn' ? 'কাস্টমার মোমেন্টস ও আনবক্সিং' : 'Customer Moments & Dining Table'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 font-serif tracking-tight">
            {lang === 'bn' ? 'ভোজনরসিকদের ডাইনিং টেবিলে আমাদের আচার' : 'Pickle Lovers Across Bangladesh'}
          </h2>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-stone-500">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>#NewBrotherPicklebar</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden bg-stone-900 aspect-4/5 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200"
          >
            <img
              src={item.image}
              alt={item.caption.en}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-3 sm:p-4 text-white">
              <div className="flex items-center justify-between">
                <span className="bg-black/60 backdrop-blur-xs text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md text-[#D4AF37]">
                  {item.user}
                </span>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                  <span>{item.likes}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-0.5 mb-1 text-[#D4AF37]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-medium leading-snug line-clamp-2 text-stone-100">
                  {item.caption[lang]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
