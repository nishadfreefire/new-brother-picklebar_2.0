import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const LOGO_URL = '/images/pickles/logo.png';

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const [imageError, setImageError] = useState(false);

  const sizeMap = {
    sm: { img: 'h-8 w-8', text: 'text-sm', sub: 'text-[9px]' },
    md: { img: 'h-10 w-10 sm:h-11 sm:w-11', text: 'text-base sm:text-lg', sub: 'text-[10px]' },
    lg: { img: 'h-12 w-12 sm:h-14 sm:w-14', text: 'text-xl sm:text-2xl', sub: 'text-xs' },
    xl: { img: 'h-16 w-16 sm:h-20 sm:w-20', text: 'text-2xl sm:text-3xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Brand Logo PNG */}
      <div className={`relative ${currentSize.img} shrink-0 flex items-center justify-center`}>
        {!imageError ? (
          <img
            src={LOGO_URL}
            alt="New Brother Pickle Bar Logo"
            className="w-full h-full object-contain filter drop-shadow-xs"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full rounded-2xl bg-[#0F392B] p-1.5 shadow-sm flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-[#D4AF37]">
              <path d="M7 3h10v2H7z" fill="currentColor" opacity="0.3" />
              <line x1="6" y1="5" x2="18" y2="5" />
              <path d="M5 8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v10a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8z" />
              <path d="M12 9v6" stroke="#FAF8F5" strokeWidth="1.5" />
              <path d="M10 12c1-2 3-2 4 0" stroke="#FAF8F5" strokeWidth="1.5" />
            </svg>
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-stone-900 leading-none text-base sm:text-lg font-sans">
              New Brothers
            </span>
            <span className="bg-[#0F392B] text-[#D4AF37] text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
              PICKLEBAR
            </span>
          </div>
          <span className={`text-stone-500 font-medium tracking-tight ${currentSize.sub} hidden sm:inline-block mt-0.5`}>
            খাঁটি ঘরোয়া আচার • 100% Homemade
          </span>
        </div>
      )}
    </div>
  );
};

