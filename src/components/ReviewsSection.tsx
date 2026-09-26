import React, { useState, useEffect, useRef } from 'react';
import { Star, CheckCircle, MessageSquare, Send, ChevronLeft, ChevronRight, X, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

export const ReviewsSection: React.FC = () => {
  const { reviews, submitReview } = useStore();
  const { lang } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedPickleName, setSelectedPickleName] = useState('Classic Roasted Garlic (রসুন আচার)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Smooth continuous auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    let scrollPos = el.scrollLeft;

    const autoScroll = () => {
      if (!isPaused && el) {
        scrollPos += 0.8;
        // When reached end of half the duplicate list, reset seamlessly
        if (scrollPos >= el.scrollWidth / 2) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      } else if (el) {
        scrollPos = el.scrollLeft;
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, reviews]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -320 : 320;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    await submitReview({
      userName: customerName.trim(),
      userCity: district.trim(),
      rating,
      comment: comment.trim(),
      productName: selectedPickleName
    });
    setIsSubmitting(false);
    setShowSuccess(true);
    setCustomerName('');
    setComment('');
    setTimeout(() => {
      setShowSuccess(false);
      setIsWriteModalOpen(false);
    }, 1800);
  };

  // Duplicate reviews array to create seamless loop for smooth infinite marquee sliding
  const displayReviews = [...reviews, ...reviews];

  return (
    <section id="reviews-section" className="my-8 sm:my-10 space-y-4 scroll-mt-24">
      {/* Section Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200/80 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-[#5C3826] text-[11px] font-bold uppercase tracking-wider border border-[#E8DCCF] mb-1">
            <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
            <span>{lang === 'bn' ? 'গ্রাহকদের মিষ্টি-ঝাল অভিজ্ঞতা' : 'Real Customer Experiences'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2C241E] font-serif">
            {lang === 'bn' ? 'হাজারো ভোজনরসিকের রিভিউ' : 'Loved by Pickle Lovers Nationwide'}
          </h2>
        </div>

        {/* Action & Nav controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="px-3 py-1.5 rounded-full bg-[#5C3826] hover:bg-[#432818] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'রিভিউ লিখুন' : 'Write Review'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => handleManualScroll('left')}
              className="p-1.5 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors shadow-2xs cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleManualScroll('right')}
              className="p-1.5 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors shadow-2xs cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Smooth Sliding Carousel Strip */}
      <div 
        className="relative -mx-3 sm:-mx-4 px-3 sm:px-4 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
      >
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayReviews.map((rev, idx) => (
            <div
              key={`${rev.id}-${idx}`}
              className="w-[260px] sm:w-[300px] shrink-0 p-4 rounded-2xl bg-white border border-[#E6DEC8]/80 shadow-2xs hover:shadow-md hover:border-[#5C3826]/30 transition-all flex flex-col justify-between space-y-2.5"
            >
              <div className="space-y-1.5">
                {/* Star Rating & Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex text-[#D4AF37] text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-stone-200'}`}
                      />
                    ))}
                  </div>
                  {rev.verifiedBuyer && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/80">
                      <CheckCircle className="w-2.5 h-2.5" />
                      <span>{lang === 'bn' ? 'ভেরিফাইড' : 'Verified'}</span>
                    </span>
                  )}
                </div>

                {/* Comment text */}
                <p className="text-xs text-stone-700 leading-relaxed italic line-clamp-3">
                  "{rev.comment}"
                </p>
              </div>

              {/* Customer & Product Info */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1.5">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 truncate">{rev.userName}</h4>
                  <span className="text-[10px] text-stone-400 truncate block">{rev.userCity}</span>
                </div>
                <span className="text-[10px] font-semibold text-[#8A5A36] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E6DEC8] truncate max-w-[120px] shrink-0">
                  {rev.productName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Modal (Compact & out of the way) */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div 
            className="bg-white rounded-3xl w-full max-w-lg border border-stone-200 shadow-2xl p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#5C3826] border border-orange-200 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-stone-900 font-serif">
                    {lang === 'bn' ? 'আপনার আচারের অভিজ্ঞতা জানান' : 'Write Your Pickle Review'}
                  </h3>
                  <p className="text-[11px] text-stone-500">আপনার সৎ মতামত আমাদের মান ধরে রাখতে সাহায্য করে</p>
                </div>
              </div>
              <button 
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {lang === 'bn' ? 'আপনার নাম' : 'Your Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5C3826]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {lang === 'bn' ? 'শহর / জেলা' : 'City / District'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="e.g. Dhaka, Dhanmondi"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5C3826]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {lang === 'bn' ? 'কোন আচারের রিভিউ?' : 'Pickle Item'}
                  </label>
                  <select
                    value={selectedPickleName}
                    onChange={e => setSelectedPickleName(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5C3826]"
                  >
                    <option value="Classic Roasted Garlic (রসুন আচার)">রসুন আচার (Garlic Pickle)</option>
                    <option value="Raw Mango Special (আমের টক-ঝাল)">কাঁচা আমের আচার (Mango Pickle)</option>
                    <option value="Sweet & Sour Boroi (মিষ্টি বরই)">মিষ্টি বরই আচার (Boroi Pickle)</option>
                    <option value="Traditional Beef Pickle (গরুর মাংসের আচার)">গরুর মাংসের আচার (Beef Pickle)</option>
                    <option value="Sylhet Naga Chili (সিলেট নাগা মরিচ)">নাগা মরিচ আচার (Naga Pickle)</option>
                    <option value="Spicy Tamarind (তেঁতুলের চাটনি)">তেঁতুল আচার (Tamarind Pickle)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {lang === 'bn' ? 'রেটিং' : 'Rating'}
                  </label>
                  <select
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-[#967623] focus:outline-none focus:ring-1 focus:ring-[#5C3826]"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5) অসাধারণ</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5) খুব ভালো</option>
                    <option value={3}>⭐⭐⭐ (3/5) ভালো</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {lang === 'bn' ? 'আপনার অনুভূতি ও স্বাদ কেমন লেগেছে?' : 'Your Experience & Feedback'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="তেলের খাঁটি ঝাঁঝ, ফ্লেভার ও প্যাকেজিং সম্পর্কে লিখুন..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5C3826]"
                />
              </div>

              {showSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl font-bold text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>ধন্যবাদ! আপনার রিভিউটি সফলভাবে প্রকাশিত হয়েছে।</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#5C3826] hover:bg-[#432818] text-white font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Posting...' : (lang === 'bn' ? 'সাবমিট করুন' : 'Submit Review')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
