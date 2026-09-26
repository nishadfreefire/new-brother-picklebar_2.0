/**
 * Extracts YouTube Video ID from any format:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - VIDEO_ID directly
 */
export function extractYouTubeId(urlOrId?: string): string | null {
  if (!urlOrId || !urlOrId.trim()) return null;
  const trimmed = urlOrId.trim();

  // 1. Check direct video ID format (usually 11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // 2. youtube.com/watch?v=XXXX
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?(?:.*&)?v=)([^&#]+)/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // 3. youtu.be/XXXX
  const shortMatch = trimmed.match(/youtu\.be\/([^?&#/]+)/);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  // 4. youtube.com/embed/XXXX
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([^?&#/]+)/);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  // 5. youtube.com/shorts/XXXX
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([^?&#/]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }

  return null;
}

/**
 * Returns a fully formed YouTube embed URL with autoplay, mute, and loop options
 */
export function getYouTubeEmbedUrl(urlOrId?: string, autoplay: boolean = true, mute: boolean = true): string | null {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return null;

  const params = new URLSearchParams({
    rel: '0',
    controls: '0',
    showinfo: '0',
    iv_load_policy: '3',
    modestbranding: '1',
    playsinline: '1',
    enablejsapi: '1',
    disablekb: '1',
    fs: '0'
  });

  if (typeof window !== 'undefined' && window.location.origin) {
    params.set('origin', window.location.origin);
  }

  if (autoplay) {
    params.set('autoplay', '1');
    params.set('loop', '1');
    params.set('playlist', videoId);
  }

  if (mute) {
    params.set('mute', '1');
  } else {
    params.set('mute', '0');
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function getYouTubeThumbnailUrl(urlOrId?: string): string | null {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
