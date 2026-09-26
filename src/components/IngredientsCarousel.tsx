import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
  banglaName: string;
  emoji: string;
}

// শুধুমাত্র আচারে ব্যবহৃত প্রধান উপাদান
const INGREDIENTS: Ingredient[] = [
  { id: 'mango', name: 'Mango', banglaName: 'আম', emoji: '🥭' },
  { id: 'tamarind', name: 'Tamarind', banglaName: 'তেঁতুল', emoji: '🌰' },
  { id: 'olive', name: 'Olive', banglaName: 'জলপাই', emoji: '🫒' },
  { id: 'garlic', name: 'Garlic', banglaName: 'রসুন', emoji: '🧄' },
  { id: 'chili', name: 'Chili', banglaName: 'মরিচ', emoji: '🌶️' }
];

export const IngredientsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % INGREDIENTS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + INGREDIENTS.length) % INGREDIENTS.length);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % INGREDIENTS.length);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Get visible items for carousel effect
  const getVisibleIngredients = () => {
    const visible = [];
    const isMobile = window.innerWidth < 640;
    const range = isMobile ? 1 : 2;
    
    for (let i = -range; i <= range; i++) {
      const index = (currentIndex + i + INGREDIENTS.length) % INGREDIENTS.length;
      visible.push({
        ...INGREDIENTS[index],
        position: i
      });
    }
    return visible;
  };

  return (
    <div className="w-full py-6 relative">
      <div className="container mx-auto px-4">
        {/* Simple Header */}
        <div className="text-center mb-5">
          <span className="inline-block text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
            খাঁটি উপাদান • 100% Natural
          </span>
        </div>

        {/* Compact Carousel */}
        <div className="relative max-w-2xl mx-auto">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white hover:bg-[#D4AF37] text-stone-700 hover:text-white shadow-md transition-all cursor-pointer flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Carousel Track */}
          <div className="flex items-center justify-center py-4 overflow-hidden">
            {getVisibleIngredients().map((item, idx) => {
              const isCenter = item.position === 0;
              const isMobile = window.innerWidth < 640;
              const isVisible = Math.abs(item.position) <= (isMobile ? 1 : 2);

              if (!isVisible) return null;

              return (
                <div
                  key={`${item.id}-${idx}`}
                  className={`
                    transition-all duration-500 mx-1 sm:mx-2
                    ${isCenter ? 'scale-100 opacity-100 z-10' : 'scale-75 opacity-50'}
                  `}
                >
                  {/* Ingredient Card - Compact */}
                  <div
                    className={`
                      relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl shadow-md
                      flex flex-col items-center justify-center gap-1
                      border-2 transition-all duration-300 bg-white
                      ${isCenter ? 'border-[#D4AF37]' : 'border-stone-200'}
                    `}
                  >
                    {/* Emoji */}
                    <div className="text-3xl sm:text-4xl">
                      {item.emoji}
                    </div>

                    {/* Name */}
                    <p className={`
                      font-bold text-stone-900 text-[10px] sm:text-xs leading-tight text-center
                    `}>
                      {item.banglaName}
                    </p>

                    {/* Checkmark for center */}
                    {isCenter && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-white flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white hover:bg-[#D4AF37] text-stone-700 hover:text-white shadow-md transition-all cursor-pointer flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dots Indicator - Minimal */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {INGREDIENTS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(idx);
                setTimeout(() => setIsAutoPlaying(true), 5000);
              }}
              className={`
                transition-all cursor-pointer
                ${idx === currentIndex
                  ? 'w-6 h-1.5 bg-[#D4AF37] rounded-full'
                  : 'w-1.5 h-1.5 bg-stone-300 rounded-full hover:bg-stone-400'
                }
              `}
              aria-label={`Go to ${item.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
