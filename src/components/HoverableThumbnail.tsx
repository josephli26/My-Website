import { useState } from "react";
import { ImageFallback, fixAssetUrl } from "./ImageFallback";

interface HoverableThumbnailProps {
  thumbnail: string;
  title: string;
  category: string;
  hoverGif?: string;
  hoverVideo?: string;
  className?: string;
}

export function HoverableThumbnail({
  thumbnail,
  title,
  category,
  hoverGif,
  hoverVideo,
  className = "",
}: HoverableThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [gifError, setGifError] = useState(false);

  const resolvedHoverGif = fixAssetUrl(hoverGif);
  const resolvedHoverVideo = fixAssetUrl(hoverVideo);

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
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
      />

      {/* Hover Video */}
      {resolvedHoverVideo && (
        <video
          src={resolvedHoverVideo}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300 pointer-events-none ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Background preloader to cache GIF seamlessly */}
      {!resolvedHoverVideo && resolvedHoverGif && !gifError && (
        <img
          src={resolvedHoverGif}
          alt=""
          className="hidden"
          aria-hidden="true"
          referrerPolicy="no-referrer"
          onError={() => setGifError(true)}
        />
      )}

      {/* Hover GIF - Rendered dynamically on hover so Chrome/Firefox start GIF animation thread immediately */}
      {!resolvedHoverVideo && resolvedHoverGif && isHovered && !gifError && (
        <img
          key={`active-gif-${resolvedHoverGif}`}
          src={resolvedHoverGif}
          alt={`${title} Preview`}
          onError={() => {
            console.warn("Hover GIF failed to load:", resolvedHoverGif);
            setGifError(true);
          }}
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none transition-opacity duration-300 opacity-100"
          referrerPolicy="no-referrer"
        />
      )}

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-brand-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none" />
    </div>
  );
}
