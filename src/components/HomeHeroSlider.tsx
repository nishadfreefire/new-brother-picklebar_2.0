import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { extractYouTubeId, getYouTubeEmbedUrl } from '../utils/youtube';

interface Slide {
  id: string;
  type: 'video' | 'image';
  url: string;
  title?: string;
  description?: string;
}

export const HomeHeroSlider: React.FC = () => {
  const { settings } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // If video section is disabled
  if (settings?.showHomeVideo === false) {
    return null;
  }

  const rawVideoUrl = settings?.craftVideoUrl || 'https://www.youtube.com/watch?v=FSJlOtqTa-w';
  
  // Get slider title from settings or use default
  const sliderTitle = settings?.sliderTitle || 'প্রিমিয়াম খাঁটি আচার';

  // Define slides: 1 video + multiple images
  const slides: Slide[] = [
    {
      id: 'video-1',
      type: 'video',
      url: rawVideoUrl,
      title: settings?.craftVideoTitle || 'কীভাবে আমাদের খাঁটি আচার প্রস্তুত করা হয় দেখুন',
      description: 'Watch our traditional pickle making process'
    },
    {
      id: 'img-1',
      type: 'image',
      url: settings?.sliderImage1Url || '/images/pickles/amer-achar.jpg',
      title: 'রাজশাহীর কাঁচা আমের আচার',
      description: 'Authentic Rajshahi Green Mango Pickle'
    },
    {
      id: 'img-2',
      type: 'image',
      url: settings?.sliderImage2Url || '/images/pickles/jolpai-achar.jpg',
      title: 'তাজা জলপাইয়ের আচার',
      description: 'Fresh Olive Pickle - Premium Quality'
    },
    {
      id: 'img-3',
      type: 'image',
      url: settings?.sliderImage3Url || '/images/pickles/roshun-achar.jpg',
      title: 'রসুনের ঝাঁঝালো আচার',
      description: 'Spicy Garlic Pickle - Bold Flavor'
    }
  ];

  const autoplay = settings?.craftVideoAutoplay ?? true;
  const isDirectVideo = rawVideoUrl.endsWith('.mp4') || rawVideoUrl.endsWith('.webm');
  const videoId = extractYouTubeId(rawVideoUrl) || 'FSJlOtqTa-w';
  const embedUrl = getYouTubeEmbedUrl(rawVideoUrl, autoplay, isMuted) || 
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? '1' : '0'}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&playsinline=1&modestbranding=1&enablejsapi=1`;

  // Auto-slide every 5 seconds (except on video slide)
  useEffect(() => {
    if (!isAutoPlaying || slides[currentSlide].type === 'video') return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide, slides.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

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

  const currentSlideData = slides[currentSlide];

  return (
    <div id="home-hero-slider" className="relative w-full group my-2 sm:my-3 select-none">
      {/* Header - Centered with 3 words */}
      <div className="flex items-center justify-center gap-2 mb-2 px-1">
        <h2 className="text-sm sm:text-base font-bold text-stone-800 tracking-tight font-bengali">
          {sliderTitle}
        </h2>
      </div>

      {/* Slider Container */}
      <div className="relative w-full aspect-16/9 sm:aspect-21/9 max-h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-md border border-stone-200/80">
        
        {/* Slides */}
        <div className="relative w-full h-full">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`
                absolute inset-0 transition-all duration-700 ease-in-out
                ${idx === currentSlide 
                  ? 'opacity-100 translate-x-0 z-10' 
                  : idx < currentSlide 
                    ? 'opacity-0 -translate-x-full z-0'
                    : 'opacity-0 translate-x-full z-0'
                }
              `}
            >
              {slide.type === 'video' ? (
                /* Video Slide */
                <div 
                  onClick={togglePlay}
                  className="relative w-full h-full cursor-pointer"
                  title={isPlaying ? 'পজ করতে ক্লিক করুন' : 'প্লে করতে ক্লিক করুন'}
                >
                  {isDirectVideo ? (
                    <video
                      ref={videoRef}
                      src={slide.url}
                      autoPlay={autoplay}
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <iframe
                        ref={iframeRef}
                        src={embedUrl}
                        title="Achar Craft Video"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[145%] min-w-full min-h-full border-0 pointer-events-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  )}

                  {/* Video Controls */}
                  {idx === currentSlide && (
                    <>
                      <div className="absolute inset-0 z-10" />
                      
                      {!isPlaying && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 text-white flex items-center justify-center border-2 border-white/40 shadow-2xl pl-1">
                            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white" />
                          </div>
                        </div>
                      )}

                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="px-3 py-1.5 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer border border-white/20"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                              <span className="text-[11px]">পজ</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                              <span className="text-[11px]">প্লে</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={toggleMute}
                          className="px-3 py-1.5 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer border border-white/20"
                        >
                          {isMuted ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span className="text-[11px]">সাউন্ড চালু</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[11px]">সাউন্ড বন্ধ</span>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Image Slide - Clean without text overlay */
                <div className="relative w-full h-full">
                  <img
                    src={slide.url}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentSlide(idx);
                setTimeout(() => setIsAutoPlaying(true), 8000);
              }}
              className={`
                transition-all cursor-pointer
                ${idx === currentSlide
                  ? 'w-8 h-2 bg-[#D4AF37] rounded-full shadow-lg'
                  : 'w-2 h-2 bg-white/70 hover:bg-white rounded-full'
                }
              `}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
