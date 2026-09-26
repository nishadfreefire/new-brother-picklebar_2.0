import React, { useState, useMemo, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { extractYouTubeId, getYouTubeEmbedUrl } from '../utils/youtube';

export const HomeVideoSection: React.FC = () => {
  const { settings } = useStore();
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // If explicitly disabled in settings
  if (settings?.showHomeVideo === false) {
    return null;
  }

  const rawVideoUrl = settings?.craftVideoUrl || 'https://www.youtube.com/watch?v=FSJlOtqTa-w';
  const autoplay = settings?.craftVideoAutoplay ?? true;

  // Check if direct video file (e.g. mp4, webm)
  const isDirectVideo = useMemo(() => {
    return (
      rawVideoUrl.endsWith('.mp4') ||
      rawVideoUrl.endsWith('.webm') ||
      rawVideoUrl.endsWith('.mov') ||
      rawVideoUrl.includes('/video/')
    );
  }, [rawVideoUrl]);

  const videoId = extractYouTubeId(rawVideoUrl) || 'FSJlOtqTa-w';

  // Embed URL with controls=0, loop=1, autoplay=1, mute=1
  const embedUrl = getYouTubeEmbedUrl(rawVideoUrl, autoplay, isMuted) || 
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? '1' : '0'}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&playsinline=1&modestbranding=1&enablejsapi=1`;

  // Toggle Play / Pause
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

  // Toggle Sound Mute / Unmute
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

  return (
    <div id="home-top-video" className="relative w-full group my-2 sm:my-3 select-none">
      {/* Light, Elegant Headline above the video */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="w-2 h-2 rounded-full bg-[#E07A24] animate-pulse" />
        <h2 className="text-xs sm:text-sm font-bold text-stone-800 tracking-tight flex items-center gap-1.5">
          <span>{settings?.craftVideoTitle || 'কীভাবে আমাদের খাঁটি আচার প্রস্তুত করা হয় দেখুন'}</span>
        </h2>
      </div>

      {/* 
        Clean Edge-to-Edge Video Container:
        - Click anywhere on the video to play / pause
        - YouTube's title bar is cropped away
        - Seamless controls with Play/Pause & Sound
      */}
      <div 
        onClick={togglePlay}
        className="relative w-full aspect-16/9 sm:aspect-21/9 max-h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-md border border-stone-200/80 cursor-pointer"
        title={isPlaying ? 'পজ করতে ক্লিক করুন (Click to Pause)' : 'প্লে করতে ক্লিক করুন (Click to Play)'}
      >
        {isDirectVideo ? (
          /* Pure Native HTML5 Video */
          <video
            ref={videoRef}
            src={rawVideoUrl}
            autoPlay={autoplay}
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          /* Cropped YouTube Embed (Title Bar and Player Controls Clipped Away) */
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <iframe
              ref={iframeRef}
              key={videoId}
              src={embedUrl}
              title="Achar Craft Video"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[145%] min-w-full min-h-full border-0 pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}

        {/* Clickable Overlay to capture clicks reliably across all devices */}
        <div className="absolute inset-0 z-10" />

        {/* Center Pause Indicator Overlay (Visible when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 backdrop-blur-[2px] transition-all">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 text-white flex items-center justify-center border-2 border-white/40 shadow-2xl pl-1 hover:scale-105 active:scale-95 transition-transform">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white" />
            </div>
          </div>
        )}

        {/* Minimal Floating Controls (Top Right) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-2" onClick={e => e.stopPropagation()}>
          {/* Play / Pause Toggle Button */}
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

          {/* Sound Toggle Button */}
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
      </div>
    </div>
  );
};
