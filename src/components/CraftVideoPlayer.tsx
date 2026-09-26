import React, { useState } from 'react';
import { Volume2, VolumeX, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { extractYouTubeId } from '../utils/youtube';

interface CraftVideoPlayerProps {
  videoUrl?: string;
  videoTitle?: string;
  autoplay?: boolean;
}

export const CraftVideoPlayer: React.FC<CraftVideoPlayerProps> = ({
  videoUrl = 'https://www.youtube.com/watch?v=7WT93V_29uA',
  videoTitle,
  autoplay = true
}) => {
  const { lang } = useLanguage();
  const [isMuted, setIsMuted] = useState(true);

  const videoId = extractYouTubeId(videoUrl) || '7WT93V_29uA';
  
  // YouTube embed with autoplay & mute (mute is browser-mandatory for autoplay)
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-xl border border-stone-800/80 group">
      {/* 16:9 Responsive Aspect Ratio Video Container */}
      <div className="relative w-full aspect-video">
        <iframe
          key={`${videoId}-${isMuted}`}
          src={embedUrl}
          title={videoTitle || 'Artisanal Pickle Making Process'}
          className="w-full h-full border-0 absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Floating Minimal Sound & Link Controls Overlay */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md text-[#D4AF37] hover:text-[#fceabd] border border-[#D4AF37]/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'সাউন্ড চালু করুন' : 'Unmute'}</span>
              <span className="sm:hidden">🔊</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'সাউন্ড সক্রিয়' : 'Sound On'}</span>
              <span className="sm:hidden">🔇</span>
            </>
          )}
        </button>

        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md text-stone-300 hover:text-white border border-white/10 text-xs font-medium flex items-center gap-1 transition-all shadow-md"
          title="Watch on YouTube"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">YouTube</span>
        </a>
      </div>
    </div>
  );
};
