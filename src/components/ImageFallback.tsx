import { useState, ImgHTMLAttributes } from "react";
import { CustomVideoPlayer } from "./CustomVideoPlayer";

// Eagerly load all local assets in /src/assets so Vite bundles them during production build
const localAssetModules = import.meta.glob<{ default: string }>(
  "/src/assets/**/*.{gif,jpg,jpeg,png,svg,webp,GIF,JPG,JPEG,PNG,SVG,WEBP}",
  { eager: true }
);

export function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/i.test(url);
}

export function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0`;
  }
  return url;
}

export function isVimeoUrl(url: string): boolean {
  return /vimeo\.com/i.test(url);
}

export function getVimeoEmbedUrl(url: string): string {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}`;
  }
  return url;
}

export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const clean = url.toLowerCase();
  return (
    clean.startsWith("data:video/") ||
    (clean.startsWith("blob:") && clean.includes("video")) ||
    /\.(mp4|webm|mov|avi|mkv|ogv|flv|wmv|m4v)(\?.*)?$/i.test(clean) ||
    isYouTubeUrl(clean) ||
    isVimeoUrl(clean)
  );
}

export function fixAssetUrl(url?: string): string {
  if (!url) return "";
  const clean = url.trim();
  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("data:") ||
    clean.startsWith("blob:")
  ) {
    return clean;
  }

  let normalizedPath = clean;

  // Auto-map GIF-274 variations
  if (clean.includes("GIF-274.gif")) {
    normalizedPath = "/src/assets/images/GIF-274.gif";
  } else if (!clean.startsWith("/")) {
    normalizedPath = "/" + clean;
  }

  // Convert /assets/... to /src/assets/... for glob lookup if needed
  if (normalizedPath.startsWith("/assets/")) {
    normalizedPath = "/src" + normalizedPath;
  }

  // Return the Vite-bundled URL if available
  if (localAssetModules[normalizedPath]?.default) {
    return localAssetModules[normalizedPath].default;
  }

  if (clean.startsWith("/src") && localAssetModules[clean]?.default) {
    return localAssetModules[clean].default;
  }

  return normalizedPath;
}

interface ImageFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  category?: string;
  fallbackType?: "project" | "profile" | "logo" | "showreel";
  gifMode?: boolean;
}

const FALLBACK_IMAGES: Record<string, string> = {
  profile: "src/assets/images/MyPicture.jpg", // New generated profile image
  showreel: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80", // Video editing / screen
  explainer_video: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80", // Camera/creative
  brand_film: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80", // Dark gradient lighting
  lottie_web: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80", // Abstract vector fluid
  broadcast_film: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80", // Film theme
  general: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80", // Technical / abstract workspace
};

export function ImageFallback({
  src,
  alt,
  className,
  category,
  fallbackType = "project",
  gifMode = false,
  ...props
}: ImageFallbackProps) {
  const [error, setError] = useState(false);

  const resolvedSrc = fixAssetUrl(src);

  const getFallbackUrl = () => {
    if (fallbackType === "profile") return FALLBACK_IMAGES.profile;
    if (fallbackType === "showreel") return FALLBACK_IMAGES.showreel;
    if (fallbackType === "logo") return ""; // Will render text/SVG

    if (category) {
      const lower = category.toLowerCase();
      if (lower.includes("explainer")) return FALLBACK_IMAGES.explainer_video;
      if (lower.includes("brand") || lower.includes("sizzle")) return FALLBACK_IMAGES.brand_film;
      if (lower.includes("lottie") || lower.includes("web")) return FALLBACK_IMAGES.lottie_web;
      if (lower.includes("broadcast") || lower.includes("film")) return FALLBACK_IMAGES.broadcast_film;
    }

    return FALLBACK_IMAGES.general;
  };

  if (error || !resolvedSrc) {
    const fallbackUrl = fixAssetUrl(getFallbackUrl());
    if (fallbackType === "logo") {
      // Return a clean text-logo SVG if logo fails
      return (
        <span className={className}>
          YA
        </span>
      );
    }

    return (
      <div className={`relative flex items-center justify-center bg-brand-card overflow-hidden ${className}`}>
        {fallbackUrl ? (
          <>
            <img
              src={fallbackUrl}
              alt={alt}
              className={`absolute inset-0 w-full h-full object-cover filter grayscale-40 transition-transform duration-500 hover:scale-105 ${
                fallbackType === "project" ? "opacity-90" : "opacity-60"
              }`}
            />
            {fallbackType !== "project" && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <span className="block font-bebas text-lg tracking-wider text-brand-white leading-tight uppercase">
                    {alt}
                  </span>
                  {category && (
                    <span className="block text-brand-green text-[10px] font-grotesk tracking-widest uppercase mt-0.5">
                      {category}
                    </span>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-center p-4">
            <span className="text-brand-green font-bebas text-xl tracking-wider block">
              {alt || "YA PORTFOLIO"}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (isYouTubeUrl(resolvedSrc)) {
    if (gifMode) {
      const match = resolvedSrc.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      const ytId = match ? match[1] : "";
      const embedUrl = ytId
        ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&playsinline=1`
        : getYouTubeEmbedUrl(resolvedSrc);
      return (
        <iframe
          src={embedUrl}
          title={alt || "YouTube GIF Video"}
          className={`w-full aspect-video rounded-lg pointer-events-none select-none ${className}`}
        />
      );
    }
    const embedUrl = getYouTubeEmbedUrl(resolvedSrc);
    return (
      <iframe
        src={embedUrl}
        title={alt || "YouTube Video"}
        className={`w-full aspect-video rounded-lg ${className}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isVimeoUrl(resolvedSrc)) {
    if (gifMode) {
      const match = resolvedSrc.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      const vimeoId = match ? match[1] : "";
      const embedUrl = vimeoId
        ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&background=1&loop=1`
        : getVimeoEmbedUrl(resolvedSrc);
      return (
        <iframe
          src={embedUrl}
          title={alt || "Vimeo GIF Video"}
          className={`w-full aspect-video rounded-lg pointer-events-none select-none ${className}`}
        />
      );
    }
    const embedUrl = getVimeoEmbedUrl(resolvedSrc);
    return (
      <iframe
        src={embedUrl}
        title={alt || "Vimeo Video"}
        className={`w-full aspect-video rounded-lg ${className}`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isVideoUrl(resolvedSrc)) {
    if (gifMode) {
      const customFit = className?.includes("object-") ? "" : "object-cover";
      const customSize = className?.includes("h-") || className?.includes("aspect-") ? "" : "aspect-video";
      return (
        <video
          src={resolvedSrc}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full ${customSize} ${customFit} rounded-lg pointer-events-none select-none ${className}`}
        />
      );
    }
    return (
      <CustomVideoPlayer
        src={resolvedSrc}
        title={alt}
        className={`w-full aspect-video ${className}`}
      />
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
}
