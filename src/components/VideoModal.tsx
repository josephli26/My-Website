import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Sanitize and transform standard youtube watch url or vimeo url to embed
  const safeVideoUrl = (videoUrl || "").trim();
  let embedUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";

  // Prevent javascript: or unsafe URI schemes
  if (/^(javascript|data|vbscript):/i.test(safeVideoUrl)) {
    embedUrl = "about:blank";
  } else if (safeVideoUrl.includes("youtube.com/embed/") || safeVideoUrl.includes("player.vimeo.com/")) {
    embedUrl = safeVideoUrl;
  } else if (safeVideoUrl.includes("vimeo.com/")) {
    // Extract ID from vimeo.com/1153984527
    const vimeoIdMatch = safeVideoUrl.match(/vimeo\.com\/([0-9]+)/);
    if (vimeoIdMatch && vimeoIdMatch[1]) {
      embedUrl = `https://player.vimeo.com/video/${vimeoIdMatch[1]}?autoplay=1`;
    }
  } else if (safeVideoUrl.includes("youtube.com/watch") || safeVideoUrl.includes("youtu.be/")) {
    // Extract ID from youtube.com/watch?v=...
    const ytIdMatch = safeVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
    if (ytIdMatch && ytIdMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytIdMatch[1]}?autoplay=1`;
    }
  } else if (/^https?:\/\//i.test(safeVideoUrl)) {
    embedUrl = safeVideoUrl;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-100 bg-brand-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 xl:p-12"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="relative w-full max-w-[1550px] aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-brand-black/80 hover:bg-brand-green/20 hover:text-brand-green text-white transition-colors duration-200"
              aria-label="Close video showreel"
            >
              <X size={20} />
            </button>

            {/* Video Iframe */}
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Youssef Abaali Showreel Video"
            ></iframe>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
