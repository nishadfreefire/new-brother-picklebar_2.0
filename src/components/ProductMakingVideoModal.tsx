import React, { useState, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { extractYouTubeId, getYouTubeEmbedUrl } from '../utils/youtube';

// Default authentic recipe making video mapping based on category if product doesn't have custom URL
const CATEGORY_VIDEO_MAP: Record<string, string> = {
  mango: 'https://www.youtube.com/watch?v=FSJlOtqTa-w', // Amer achar recipe
  garlic: 'https://www.youtube.com/watch?v=Ficz1PoWEaw', // Garlic / olive achar recipe
  boroi: 'https://www.youtube.com/watch?v=dW6aZPu2jNU', // Sweet tangy boroi achar
  olive: 'https://www.youtube.com/watch?v=7WT93V_29uA', // Jolpai achar
  tamarind: 'https://www.youtube.com/watch?v=FSJlOtqTa-w',
  default: 'https://www.youtube.com/watch?v=FSJlOtqTa-w'
};

export const ProductMakingVideoModal: React.FC = () => {
  const { makingVideoProduct, setMakingVideoProduct, addToCart, setIsCheckoutOpen } = useStore();
  const { lang } = useLanguage();

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!makingVideoProduct) return null;

  const rawVideoUrl = 
    makingVideoProduct.makingVideoUrl || 
    CATEGORY_VIDEO_MAP[makingVideoProduct.category] || 
    CATEGORY_VIDEO_MAP.default;

  const isDirectVideo = 
    rawVideoUrl.endsWith('.mp4') || 
    rawVideoUrl.endsWith('.webm') || 
    rawVideoUrl.endsWith('.mov');

  const videoId = extractYouTubeId(rawVideoUrl) || 'FSJlOtqTa-w';

  const embedUrl = getYouTubeEmbedUrl(rawVideoUrl, true, isMuted) ||
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? '1' : '0'}&loop=1&playlist=${videoId}&playsinline=1&rel=0&enablejsapi=1`;

  const togglePlay = () => {
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);

    if (isDirectVideo && videoRef.current) {
      if (nextPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    } else if (iframeRef.current?.contentWindow) {
      const command = nextPlaying ? 'playVideo' : 'pauseVideo';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (isDirectVideo && videoRef.current) {
      videoRef.current.muted = nextMuted;
    } else if (iframeRef.current?.contentWindow) {
      const command = nextMuted ? 'mute' : 'unMute';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
    }
  };

  const handleOrder = () => {
    const variant = makingVideoProduct.variants[makingVideoProduct.defaultVariantIndex || 0] || makingVideoProduct.variants[0];
    addToCart(makingVideoProduct, variant, 1, false);
    setIsAddedAnim(true);
    setTimeout(() => {
      setIsAddedAnim(false);
      setMakingVideoProduct(null);
      setIsCheckoutOpen(true);
    }, 600);
  };

  const defaultVariant = makingVideoProduct.variants[makingVideoProduct.defaultVariantIndex || 0] || makingVideoProduct.variants[0];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={() => setMakingVideoProduct(null)}
    >
      <div 
        className="relative bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-3.5 sm:px-5 bg-[#1C1917] text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h3 className="font-bold text-sm sm:text-base text-[#fefbf3] truncate">
              {lang === 'bn' 
                ? `${makingVideoProduct.banglaName} • তৈরির প্রস্তুত প্রণালী` 
                : `${makingVideoProduct.name} • Craft & Recipe Process`}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setMakingVideoProduct(null)}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Container */}
        <div 
          onClick={togglePlay}
          className="relative w-full aspect-16/9 bg-black overflow-hidden cursor-pointer group"
        >
          {isDirectVideo ? (
            <video
              ref={videoRef}
              src={rawVideoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <iframe
                ref={iframeRef}
                key={`${videoId}-${isMuted}`}
                src={embedUrl}
                title={makingVideoProduct.name}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[145%] min-w-full min-h-full border-0 pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          )}

          {/* Invisible Overlay for click to pause/play */}
          <div className="absolute inset-0 z-10" />

          {/* Center Play indicator when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <div className="w-14 h-14 rounded-full bg-black/70 text-white flex items-center justify-center border-2 border-white/40 shadow-xl pl-1">
                <Play className="w-7 h-7 fill-white text-white" />
              </div>
            </div>
          )}

          {/* Floating Controls Top Right */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={togglePlay}
              className="px-2.5 py-1 rounded-full bg-black/70 hover:bg-black/90 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-md border border-white/20 cursor-pointer shadow-md"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 fill-current text-[#D4AF37]" />
                  <span>পজ</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current text-emerald-400" />
                  <span>প্লে</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="px-2.5 py-1 rounded-full bg-black/70 hover:bg-black/90 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-md border border-white/20 cursor-pointer shadow-md"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3 h-3 text-[#D4AF37]" />
                  <span>সাউন্ড চালু</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3 text-emerald-400" />
                  <span>মিউট</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Details & Quick Order Row */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200">
          <div className="space-y-1 text-center sm:text-left w-full sm:w-auto">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-black text-stone-900 font-serif">
                {lang === 'bn' ? makingVideoProduct.banglaName : makingVideoProduct.name}
              </span>
              <span className="text-[11px] font-extrabold text-[#0F5338]">
                ৳{defaultVariant.price} ({defaultVariant.size})
              </span>
            </div>
            <p className="text-[11px] text-stone-500 line-clamp-1">
              {lang === 'bn' ? makingVideoProduct.banglaTagline : makingVideoProduct.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleOrder}
              disabled={defaultVariant.stock <= 0}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0F5338] via-[#166A48] to-[#0A432B] hover:from-[#0B442D] hover:via-[#11563A] hover:to-[#073622] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/25 border border-emerald-500/25 transition-all active:scale-95 cursor-pointer"
            >
              {isAddedAnim ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>অর্ডার প্রসেসিং...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>সরাসরি অর্ডার করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
