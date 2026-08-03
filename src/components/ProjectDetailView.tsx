import { useState, useEffect } from "react";
import { useCMS } from "../context/CMSContext";
import { ArrowRight, X, ChevronLeft, Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageFallback } from "./ImageFallback";

interface ProjectDetailViewProps {
  projectId: number;
  onBack: () => void;
}

export function ProjectDetailView({ projectId, onBack }: ProjectDetailViewProps) {
  const { data } = useCMS();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Find active project details
  const project = data.projectDetails.find((p) => p.id === projectId);

  useEffect(() => {
    setIsPlayingVideo(false);
  }, [projectId]);

  // Find next project in the series for navigation
  const currentProjectIndex = data.projectDetails.findIndex((p) => p.id === projectId);
  const nextProject = currentProjectIndex !== -1
    ? data.projectDetails[(currentProjectIndex + 1) % data.projectDetails.length]
    : null;

  // Sanitize and transform standard youtube watch url or vimeo url to embed
  const rawVideoUrl = (project?.videoUrl || data.showreel.videoUrl || "").trim();
  let embedUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

  if (/^(javascript|data|vbscript):/i.test(rawVideoUrl)) {
    embedUrl = "about:blank";
  } else if (rawVideoUrl.includes("youtube.com/embed/") || rawVideoUrl.includes("player.vimeo.com/")) {
    embedUrl = rawVideoUrl;
  } else if (rawVideoUrl.includes("vimeo.com/")) {
    const vimeoIdMatch = rawVideoUrl.match(/vimeo\.com\/([0-9]+)/);
    if (vimeoIdMatch && vimeoIdMatch[1]) {
      embedUrl = `https://player.vimeo.com/video/${vimeoIdMatch[1]}`;
    }
  } else if (rawVideoUrl.includes("youtube.com/watch") || rawVideoUrl.includes("youtu.be/")) {
    const ytIdMatch = rawVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
    if (ytIdMatch && ytIdMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytIdMatch[1]}`;
    }
  } else if (/^https?:\/\//i.test(rawVideoUrl)) {
    embedUrl = rawVideoUrl;
  }

  // Flat list of all images across sections for lightbox navigation
  const allImages: string[] = [];
  if (project) {
    project.sections.forEach((sec) => {
      if (sec.type === "grid" && sec.rows && sec.rows.length > 0) {
        sec.rows.forEach((r) => {
          r.images.forEach((img) => allImages.push(img));
        });
      } else {
        sec.images.forEach((img) => allImages.push(img));
      }
    });
  }

  // Handle keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + allImages.length) % allImages.length : null
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % allImages.length : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, allImages.length]);

  if (!project) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center text-center p-6 pt-32">
        <h2 className="font-bebas text-4xl text-white tracking-widest uppercase mb-4">
          Work Not Found
        </h2>
        <button
          onClick={onBack}
          className="font-grotesk text-brand-green tracking-widest text-sm uppercase flex items-center gap-2 hover:underline"
        >
          <ChevronLeft size={16} /> Back to Work
        </button>
      </div>
    );
  }

  const design = data.design || {
    layout: {
      sectionGap: 250,
      sectionGapMobile: 100,
      paddingTop: 128,
      paddingBottom: 96,
      headingGap: 24,
      headingGapMobile: 16,
      paragraphGap: 24,
    },
  };
  const gapDesktop = design.layout.sectionGap ?? 250;
  const gapMobile = design.layout.sectionGapMobile ?? 100;
  const pyTopDesktop = design.layout.paddingTop ?? 128;
  const pyBottomDesktop = design.layout.paddingBottom ?? pyTopDesktop;
  const pyTopMobile = Math.round(pyTopDesktop * 0.6);
  const pyBottomMobile = Math.round(pyBottomDesktop * 0.6);
  const headingGap = design.layout.headingGap ?? 24;
  const headingGapMobile = design.layout.headingGapMobile ?? 16;

  const heroCover = project.heroImage || project.thumbnail;

  // Determine starting global index for each section's image list
  let cumulativeImageCount = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full cms-detail-page-padding"
    >
      <style>{`
        .cms-detail-page-padding {
          padding-top: ${pyTopMobile}px;
          padding-bottom: ${pyBottomMobile}px;
        }
        @media (min-width: 768px) {
          .cms-detail-page-padding {
            padding-top: ${pyTopDesktop}px;
            padding-bottom: ${pyBottomDesktop}px;
          }
        }

        .cms-section-gap {
          margin-bottom: ${gapMobile}px;
        }
        @media (min-width: 768px) {
          .cms-section-gap {
            margin-bottom: ${gapDesktop}px;
          }
        }

        .cms-detail-sections-gap {
          gap: ${gapMobile}px;
        }
        @media (min-width: 768px) {
          .cms-detail-sections-gap {
            gap: ${gapDesktop}px;
          }
        }

        .cms-heading-gap {
          margin-bottom: ${headingGapMobile}px;
        }
        @media (min-width: 768px) {
          .cms-heading-gap {
            margin-bottom: ${headingGap}px;
          }
        }
      `}</style>

      {/* ══════════════════════════════════════════
           HERO TEXT SECTION
      ══════════════════════════════════════════ */}
      <section className="px-6 md:px-12 xl:px-16 cms-section-gap max-w-[1550px] mx-auto">
        <button
          onClick={onBack}
          className="font-grotesk text-brand-green tracking-widest text-xs uppercase flex items-center gap-1.5 mb-10 hover:opacity-80 cursor-pointer focus:outline-none"
        >
          <ChevronLeft size={14} /> Back to Work
        </button>

        <div className="flex flex-col md:flex-row items-start justify-between gap-10 md:gap-16">
          <h1 className="font-bebas text-4xl sm:text-5xl md:text-[50px] font-normal tracking-wider text-white uppercase leading-none md:max-w-[55%]">
            {project.title}
          </h1>
          <p className="font-sans text-xs sm:text-[13px] tracking-wider leading-relaxed text-white/80 uppercase md:max-w-[38%] pt-2">
            {project.shortDescription}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           HERO VIDEO (SHOWREEL) WITH THUMBNAIL COVER
      ══════════════════════════════════════════ */}
      <section className="px-6 md:px-12 xl:px-16 max-w-[1550px] mx-auto cms-section-gap">
        <div className="overflow-hidden rounded-xl border border-white/5 shadow-2xl bg-black aspect-video w-full relative">
          {isPlayingVideo ? (
            <iframe
              src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${project.title} Video Showreel`}
            />
          ) : (
            <div
              onClick={() => setIsPlayingVideo(true)}
              className="w-full h-full relative cursor-pointer overflow-hidden flex items-center justify-center bg-neutral-900 group"
            >
              <ImageFallback
                src={heroCover}
                alt={`${project.title} Cover Hero`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

              {/* Play Icon Overlay */}
              <div className="absolute flex flex-col items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-green/90 group-hover:bg-brand-green text-brand-black flex items-center justify-center shadow-[0_0_35px_rgba(140,255,46,0.5)] transition-all duration-300 group-hover:scale-110">
                  <Play size={32} className="ml-1 fill-brand-black" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
           PROJECT META (Dynamic Role, Client, Custom Info Fields, Description)
      ══════════════════════════════════════════ */}
      <section className="px-6 md:px-12 xl:px-16 max-w-[1550px] mx-auto cms-section-gap">
        {(() => {
          const displayFields: { label: string; value: string }[] =
            project.customFields && project.customFields.length > 0
              ? project.customFields
              : [
                  ...(project.role ? [{ label: "Role", value: project.role }] : []),
                  ...(project.client ? [{ label: "Client", value: project.client }] : []),
                  ...(project.date ? [{ label: "Date", value: project.date }] : []),
                ];

          if (displayFields.length === 0) return null;

          return (
            <div className="flex flex-wrap justify-center items-start sm:items-center gap-8 md:gap-12 border-b border-white/5 pb-12 mb-12">
              {displayFields.map((field, fIdx) => (
                <div key={fIdx} className="flex flex-col gap-1.5 pl-4 border-l-2 border-brand-green text-left">
                  <span className="font-sans text-[11px] tracking-widest text-white/50 uppercase">
                    {field.label}
                  </span>
                  <span className="font-sans text-sm font-bold tracking-wider text-white uppercase whitespace-pre-line">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Description body */}
        {project.description && (
          <p className="font-sans text-sm md:text-base tracking-widest text-white/75 leading-relaxed uppercase max-w-4xl mx-auto text-center">
            {project.description}
          </p>
        )}
      </section>

      {/* ══════════════════════════════════════════
           DYNAMIC GALLERY SECTIONS
      ══════════════════════════════════════════ */}
      <section className="px-6 md:px-12 xl:px-16 max-w-[1550px] mx-auto flex flex-col cms-detail-sections-gap">
        {project.sections.map((sec, secIdx) => {
          const startingGlobalIndex = cumulativeImageCount;

          const sectionRows =
            sec.type === "grid" && sec.rows && sec.rows.length > 0
              ? sec.rows
              : sec.type === "grid"
              ? [{ images: sec.images }]
              : null;

          let secImagesCount = 0;
          if (sec.type === "grid" && sec.rows && sec.rows.length > 0) {
            secImagesCount = sec.rows.flatMap((r) => r.images).length;
          } else {
            secImagesCount = sec.images.length;
          }
          cumulativeImageCount += secImagesCount;

          return (
            <div key={sec.label || secIdx} className="flex flex-col">
              <h2 className="font-bebas text-3xl sm:text-4xl tracking-widest text-brand-green cms-heading-gap text-left uppercase">
                {sec.label}
              </h2>

              {sec.type === "row" || !sectionRows ? (
                /* WIDESCREEN FULL ROW IMAGES (preserves natural aspect ratio without stretching) */
                <div className="flex flex-col gap-6 md:gap-8 w-full">
                  {sec.images.map((imgSrc, imgIdx) => {
                    const globalIdx = startingGlobalIndex + imgIdx;
                    return (
                      <button
                        key={imgIdx}
                        onClick={() => setLightboxIndex(globalIdx)}
                        className="overflow-hidden bg-brand-card/40 rounded-lg border border-white/5 group cursor-pointer focus:outline-none w-full flex items-center justify-center p-1 sm:p-2"
                      >
                        <ImageFallback
                          src={imgSrc}
                          alt={`${sec.label} Frame ${imgIdx + 1}`}
                          category={project.title}
                          className="w-full h-auto max-h-[85vh] object-contain transition-transform duration-500 group-hover:scale-[1.02] rounded-lg"
                        />
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* GRID SECTION WITH ROWS (Images display with natural proportions side by side without stretch) */
                <div className="flex flex-col gap-6 md:gap-8 w-full">
                  {sectionRows.map((rowItem, rIdx) => {
                    if (!rowItem.images || rowItem.images.length === 0) return null;
                    const isSingle = rowItem.images.length === 1;
                    const cols = isSingle && rowItem.singleImageColumns && rowItem.singleImageColumns >= 1 ? rowItem.singleImageColumns : 1;
                    const styleMaxWidth = isSingle && cols > 1 ? { maxWidth: `${Math.round(10000 / cols) / 100}%` } : {};

                    return (
                      <div
                        key={rIdx}
                        className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full items-center justify-center"
                      >
                        {rowItem.images.map((imgSrc, imgIdx) => {
                          const imgGlobalIdx = allImages.indexOf(imgSrc);
                          const activeGlobalIdx =
                            imgGlobalIdx !== -1 ? imgGlobalIdx : startingGlobalIndex + imgIdx;

                          return (
                            <button
                              key={imgIdx}
                              onClick={() => setLightboxIndex(activeGlobalIdx)}
                              style={styleMaxWidth}
                              className={`overflow-hidden bg-brand-card/40 rounded-lg border border-white/5 group cursor-pointer focus:outline-none w-full flex items-center justify-center p-1 sm:p-2 ${
                                isSingle && cols > 1 ? "flex-none" : "flex-1 min-w-0"
                              }`}
                            >
                              <ImageFallback
                                src={imgSrc}
                                alt={`${sec.label} Row ${rIdx + 1} Image ${imgIdx + 1}`}
                                category={project.title}
                                className="w-full h-auto max-h-[750px] object-contain transition-transform duration-500 group-hover:scale-[1.02] rounded-lg"
                              />
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ══════════════════════════════════════════
           NEXT PROJECT NAVIGATION
      ══════════════════════════════════════════ */}
      {nextProject && (
        <section className="px-6 md:px-12 max-w-7xl mx-auto pt-[150px] pb-[100px] border-t border-white/5 mt-[150px] text-left">
          <div className="max-w-3xl">
            <span className="font-grotesk text-sm tracking-[0.2em] text-brand-green uppercase block mb-3">
              Next Work
            </span>
            <a
              href={`#project/${nextProject.id}`}
              className="group font-grotesk text-2xl sm:text-4xl md:text-5xl font-light tracking-wide text-white/80 hover:text-white transition-all duration-300 inline-flex items-baseline gap-3 text-left leading-tight"
            >
              <span className="group-hover:text-brand-green transition-colors duration-300">
                {nextProject.title}
              </span>
              <span className="text-brand-green group-hover:translate-x-2 transition-transform duration-300 inline-block font-sans">
                →
              </span>
            </a>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
           LIGHTBOX MODAL
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-brand-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-brand-black/80 hover:bg-brand-green/20 hover:text-brand-green text-white transition-colors cursor-pointer"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            {/* Prev Image */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  (lightboxIndex - 1 + allImages.length) % allImages.length
                );
              }}
              className="absolute left-4 md:left-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-brand-green transition-all cursor-pointer"
              aria-label="Previous gallery image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Image */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % allImages.length);
              }}
              className="absolute right-4 md:right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-brand-green transition-all cursor-pointer"
              aria-label="Next gallery image"
            >
              <ArrowRight size={24} />
            </button>

            {/* Lightbox Inner container */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-5xl w-full flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <ImageFallback
                  src={allImages[lightboxIndex]}
                  alt="Gallery enlargement"
                  category="general"
                  className="w-full aspect-[16/10] object-contain max-h-[75vh]"
                />
              </div>

              {/* Status Info */}
              <div className="text-white/60 font-sans text-xs tracking-wider uppercase">
                IMAGE {lightboxIndex + 1} OF {allImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
