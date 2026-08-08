import { useState, useEffect } from "react";
import { ImageFallback, fixAssetUrl } from "./ImageFallback";

interface HoverableThumbnailProps {
  thumbnail: string;
  title: string;
  category: string;
  hoverGif?: string;
  hoverVideo?: string;
  gifMode?: boolean;
  className?: string;
}

export function HoverableThumbnail({
  thumbnail,
  title,
  category,
  hoverGif,
  hoverVideo,
  gifMode = false,
  className = "",
}: HoverableThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [gifError, setGifError] = useState(false);

  const resolvedHoverGif = fixAssetUrl(hoverGif);
  const resolvedHoverVideo = fixAssetUrl(hoverVideo);

  // Reset error state whenever hoverGif or hoverVideo prop changes
  useEffect(() => {
    setGifError(false);
  }, [hoverGif, hoverVideo]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-brand-card border border-white/5 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Primary Thumbnail */}
      <ImageFallback
        src={thumbnail}
        alt={title}
        category={category}
        gifMode={gifMode}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
      />

      {/* Hover Preview (GIF, MP4 Video, WebM, YouTube, Vimeo) */}
      {(resolvedHoverVideo || resolvedHoverGif) && !gifError && (
        <div
          className={`absolute inset-0 w-full h-full z-10 pointer-events-none transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <ImageFallback
            src={resolvedHoverVideo || resolvedHoverGif}
            alt={`${title} Preview`}
            gifMode={true}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-brand-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none" />
    </div>
  );
}
