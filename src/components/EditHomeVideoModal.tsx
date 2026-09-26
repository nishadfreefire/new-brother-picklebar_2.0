import React, { useState, useEffect } from 'react';
import { X, Video, Play, Check, Sparkles, AlertCircle, Eye, RefreshCw, Layers } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { extractYouTubeId, getYouTubeEmbedUrl } from '../utils/youtube';

interface EditHomeVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Preset verified pickle making videos
export const VIDEO_PRESETS = [
  {
    id: 'preset-1',
    titleBn: 'কাঁচা আমের টক-ঝাল-মিষ্টি আচার তৈরির রেসিপি',
    titleEn: 'Sweet & Spicy Green Mango Pickle Recipe',
    subtitleBn: 'রাজশাহীর তাজা আম, খাঁটি সরিষার তেল ও রোস্টেড পাঁচফোড়নে ঘরোয়া আচার তৈরি',
    url: 'https://www.youtube.com/watch?v=FSJlOtqTa-w',
    badge: 'জনপ্রিয় কাঁচা আম'
  },
  {
    id: 'preset-2',
    titleBn: 'ঝালপ্রেমীদের বিশেষ খাঁটি আমের আচার প্রণালী',
    titleEn: 'Spicy Tangy Mango Pickle Making Craft',
    subtitleBn: 'ঐতিহ্যবাহী রোদে শুকানো পদ্ধতি ও কাঠের ঘানির সরিষার তেলে সংরক্ষণ',
    url: 'https://www.youtube.com/watch?v=dW6aZPu2jNU',
    badge: 'স্পাইসি ম্যাঙ্গো'
  },
  {
    id: 'preset-3',
    titleBn: 'খাঁটি সরিষার তেলে ঘরোয়া জলপাই ও রসুনের আচার',
    titleEn: 'Mustard Oil Garlic & Olive Pickle Preparation',
    subtitleBn: 'হাতে ভাজা খাঁটি মসলা ও ভিনেগার ছাড়া স্বাভাবিক প্রাকৃতিক জারণ',
    url: 'https://www.youtube.com/watch?v=Ficz1PoWEaw',
    badge: 'জলপাই ও রসুন'
  }
];

export const EditHomeVideoModal: React.FC<EditHomeVideoModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useStore();
  const { lang } = useLanguage();

  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoSubtitle, setVideoSubtitle] = useState('');
  const [autoplay, setAutoplay] = useState(true);
  const [showHomeVideo, setShowHomeVideo] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync with current settings when modal opens
  useEffect(() => {
    if (isOpen && settings) {
      setVideoUrl(settings.craftVideoUrl || 'https://www.youtube.com/watch?v=FSJlOtqTa-w');
      setVideoTitle(settings.craftVideoTitle || 'ঘরোয়া উপায়ে খাঁটি আচার তৈরির ঐতিহ্য ও প্রস্তুত প্রণালী');
      setVideoSubtitle(settings.craftVideoSubtitle || 'রোদে শুকানো কাঁচা আম, খাঁটি সরিষার তেল ও হাতে ভাজা পাঁচফোড়ন দিয়ে কীভাবে ঐতিহ্যবাহী আচার তৈরি করা হয় দেখুন');
      setAutoplay(settings.craftVideoAutoplay ?? true);
      setShowHomeVideo(settings.showHomeVideo ?? true);
      setSavedSuccess(false);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof VIDEO_PRESETS[0]) => {
    setVideoUrl(preset.url);
    setVideoTitle(preset.titleBn);
    setVideoSubtitle(preset.subtitleBn);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const success = await updateSettings({
        craftVideoUrl: videoUrl.trim(),
        craftVideoTitle: videoTitle.trim(),
        craftVideoSubtitle: videoSubtitle.trim(),
        craftVideoAutoplay: autoplay,
        showHomeVideo: showHomeVideo
      });

      if (success) {
        setSavedSuccess(true);
        setTimeout(() => {
          setIsSaving(false);
          onClose();
        }, 800);
      } else {
        setIsSaving(false);
      }
    } catch {
      setIsSaving(false);
    }
  };

  const videoId = extractYouTubeId(videoUrl);
  const previewUrl = videoId ? getYouTubeEmbedUrl(videoUrl, false, true) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FCFAF7] border border-[#DECDB8] w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#0F392B] text-white flex items-center justify-between border-b border-[#1A5340]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/30">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                {lang === 'bn' ? 'হোমপেজ ভিডিও পরিবর্তন ও অপশন' : 'Home Page Video Settings'}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#fceabd]/80">
                {lang === 'bn' ? 'আচার বানানোর ভিডিও বা যেকোনো ইউটিউব লিংক সেট করুন' : 'Display pickle making craft video on home page'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-5 flex-1 text-stone-800 text-xs sm:text-sm">
          
          {/* Quick Toggle: Show/Hide on Home */}
          <div className="flex items-center justify-between p-3.5 bg-[#fefbf3]/80 border border-[#fceabd]/80 rounded-2xl">
            <div className="space-y-0.5">
              <span className="font-bold text-stone-900 block text-xs sm:text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0F392B]" />
                {lang === 'bn' ? 'হোমপেজে ভিডিও প্রদর্শন করুন' : 'Show Video Section on Home Page'}
              </span>
              <p className="text-[11px] text-stone-600">
                {lang === 'bn' ? 'চালু থাকলে হোমপেজের একদম উপরে ভিডিও প্লেয়ারটি দেখা যাবে।' : 'When active, the video will be pinned atop the home page.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showHomeVideo}
                onChange={e => setShowHomeVideo(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F392B]"></div>
            </label>
          </div>

          {/* 1-Click Curated Presets */}
          <div className="space-y-2">
            <label className="font-extrabold text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E07A24]" />
              <span>{lang === 'bn' ? 'রেডিমেড আচার তৈরির ভিডিও প্রিসেট (১-ক্লিক)' : 'Curated Pickle Making Video Presets'}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {VIDEO_PRESETS.map(preset => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    videoUrl === preset.url
                      ? 'bg-[#0F392B]/10 border-[#0F392B] text-[#0F392B] shadow-xs'
                      : 'bg-white border-stone-200 hover:border-[#D4AF37] text-stone-700'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fef6e6] text-[#654e22]">
                      {preset.badge}
                    </span>
                    <p className="font-bold text-xs line-clamp-2">{lang === 'bn' ? preset.titleBn : preset.titleEn}</p>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-2 flex items-center gap-1">
                    <Play className="w-2.5 h-2.5 fill-current" />
                    {videoUrl === preset.url ? (lang === 'bn' ? '✓ সিলেক্টেড' : '✓ Selected') : (lang === 'bn' ? 'সিলেক্ট করুন' : 'Select')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Video URL Input */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-900 block">
              {lang === 'bn' ? 'ভিডিও লিংক / YouTube URL' : 'Video URL / YouTube Link'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... বা Shorts লিংক"
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F392B] text-xs sm:text-sm font-mono"
              />
            </div>
            <p className="text-[11px] text-stone-500">
              {lang === 'bn' 
                ? 'যেকোনো YouTube ভিডিও লিংক অথবা সরাসরি MP4 ভিডিও লিংক দিতে পারেন। হোমপেজে কোনো বাড়তি লেখা বা কন্ট্রোল ছাড়া ভিডিওটি নিট অ্যান্ড ক্লিন চলবে।' 
                : 'Supports YouTube URLs, YouTube Shorts, or direct MP4 video URLs. Plays clean on home page without titles or overlays.'}
            </p>
          </div>

          {/* Live Video Preview */}
          {previewUrl && (
            <div className="space-y-1.5">
              <span className="font-bold text-stone-700 text-xs flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#0F392B]" />
                {lang === 'bn' ? 'ভিডিও প্রিভিউ' : 'Live Video Preview'}
              </span>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-stone-300">
                <iframe
                  src={previewUrl}
                  title="Video Preview"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Video Title & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-900 block">
                {lang === 'bn' ? 'ভিডিও শিরোনাম (Title)' : 'Video Title'}
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={e => setVideoTitle(e.target.value)}
                placeholder="ঘরোয়া উপায়ে খাঁটি আচার তৈরির ঐতিহ্য"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F392B] text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-900 block">
                {lang === 'bn' ? 'উপ-শিরোনাম / বিবরণ (Subtitle)' : 'Subtitle / Description'}
              </label>
              <input
                type="text"
                value={videoSubtitle}
                onChange={e => setVideoSubtitle(e.target.value)}
                placeholder="রোদে শুকানো কাঁচা আম ও সরিষার তেলে তৈরির দৃশ্য"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F392B] text-xs"
              />
            </div>
          </div>

          {/* Autoplay toggle */}
          <div className="flex items-center justify-between p-3 bg-stone-100/70 rounded-xl border border-stone-200">
            <div className="space-y-0.5">
              <span className="font-bold text-stone-800 text-xs">
                {lang === 'bn' ? 'অটোপ্লে (স্বয়ংক্রিয়ভাবে চালু)' : 'Autoplay on load (muted)'}
              </span>
              <p className="text-[10px] text-stone-500">
                {lang === 'bn' ? 'ব্রাউজার নিয়মানুযায়ী অটোপ্লে চালু থাকলে ভিডিওটি মিউটেড অবস্থায় শুরু হবে।' : 'Autoplays quietly upon visiting the site.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoplay}
                onChange={e => setAutoplay(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0F392B]"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-stone-700 hover:bg-stone-200 text-xs font-bold transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#0F392B] hover:bg-[#16503c] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</span>
                </>
              ) : savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{lang === 'bn' ? 'সফলভাবে সংরক্ষিত!' : 'Saved!'}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'ভিডিও সেভ করুন' : 'Save Video'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
