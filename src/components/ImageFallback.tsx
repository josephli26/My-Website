import { useState, ImgHTMLAttributes } from "react";

export function fixAssetUrl(url?: string): string {
  if (!url) return "";
  let clean = url.trim();
  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("data:") ||
    clean.startsWith("blob:")
  ) {
    return clean;
  }
  // Strip leading slash so relative paths work properly on GitHub Pages subpaths
  while (clean.startsWith("/")) {
    clean = clean.slice(1);
  }

  // Auto-map legacy root GIF path to organized src/assets/images/ folder
  if (clean === "src/assets/GIF-274.gif" || clean === "assets/GIF-274.gif" || clean === "GIF-274.gif") {
    return "src/assets/images/GIF-274.gif";
  }

  return clean;
}

interface ImageFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  category?: string;
  fallbackType?: "project" | "profile" | "logo" | "showreel";
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
          YA.
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
