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

      {/* Hover GIF - Preloaded in DOM for smooth immediate playback without freezing */}
      {!resolvedHoverVideo && resolvedHoverGif && (
        <img
          key={isHovered ? `gif-active-${resolvedHoverGif}` : `gif-idle-${resolvedHoverGif}`}
          src={resolvedHoverGif}
          alt={`${title} Preview`}
          className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300 pointer-events-none ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          referrerPolicy="no-referrer"
        />
      )}

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-brand-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none" />
    </div>
  );
}
