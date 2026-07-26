import { useState } from "react";
import { ImageFallback } from "./ImageFallback";

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
      {isHovered && hoverVideo && (
        <video
          src={hoverVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
        />
      )}

      {/* Hover GIF */}
      {isHovered && !hoverVideo && hoverGif && (
        <img
          src={hoverGif}
          alt={`${title} Preview`}
          className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
          referrerPolicy="no-referrer"
        />
      )}

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-brand-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none" />
    </div>
  );
}
