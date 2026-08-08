import { useState } from "react";
import { useCMS } from "../context/CMSContext";
import { motion, AnimatePresence } from "motion/react";
import { HoverableThumbnail } from "./HoverableThumbnail";

interface ProjectsViewProps {
  onSelectProject: (id: number) => void;
}

export function ProjectsView({ onSelectProject }: ProjectsViewProps) {
  const { data } = useCMS();
  const [activeFilter, setActiveFilter] = useState("all");

  const customCats = data.projectCategories && data.projectCategories.length > 0
    ? data.projectCategories
    : ["Explainer", "Brand", "Broadcast", "UI Motion", "Event", "Showreel"];

  const categoriesList = [
    { label: "everything", value: "all" },
    ...customCats.map((cat) => ({ label: cat, value: cat })),
  ];

  const design = data.design || { layout: { paddingTop: 128, paddingBottom: 96 } };
  const pyTopDesktop = design.layout.paddingTop ?? 128;
  const pyBottomDesktop = design.layout.paddingBottom ?? pyTopDesktop;
  const pyTopMobile = Math.round(pyTopDesktop * 0.6);
  const pyBottomMobile = Math.round(pyBottomDesktop * 0.6);

  const publishedAll = data.allProjects.filter(p => p.isPublished !== false);

  const filteredProjects =
    activeFilter === "all"
      ? publishedAll
      : publishedAll.filter((p) => {
          if (p.categories && Array.isArray(p.categories) && p.categories.length > 0) {
            return p.categories.some(c => c.trim().toLowerCase() === activeFilter.toLowerCase());
          }
          if (p.category) {
            const catList = p.category.split(",").map(c => c.trim().toLowerCase());
            return catList.includes(activeFilter.toLowerCase());
          }
          return false;
        });

  // Distribute categories into 3 columns dynamically to match the vertical-first grid design
  const colSize = Math.ceil(categoriesList.length / 3);
  const column1 = categoriesList.slice(0, colSize);
  const column2 = categoriesList.slice(colSize, colSize * 2);
  const column3 = categoriesList.slice(colSize * 2);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <div className="w-full cms-page-padding">
      <style>{`
        .cms-page-padding {
          padding-top: ${pyTopMobile}px;
          padding-bottom: ${pyBottomMobile}px;
        }
        @media (min-width: 768px) {
          .cms-page-padding {
            padding-top: ${pyTopDesktop}px;
            padding-bottom: ${pyBottomDesktop}px;
          }
        }
      `}</style>
      <div className="max-w-[1550px] mx-auto px-6 md:px-12 xl:px-16">
        {/* ══════════════════════════════════════════
             FILTER TABS (Multi-column list)
        ══════════════════════════════════════════ */}
        <section className="grid grid-cols-3 gap-y-4 gap-x-4 sm:gap-x-12 pb-12 max-w-4xl border-b border-white/5 text-left">
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            {column1.map((cat) => (
              <div key={cat.value} className="flex justify-start">
                <button
                  onClick={() => setActiveFilter(cat.value)}
                  className={`font-grotesk text-sm sm:text-base md:text-lg tracking-wide relative transition-all duration-200 cursor-pointer text-left focus:outline-none ${
                    activeFilter === cat.value
                      ? "text-white font-medium"
                      : "text-white/55 hover:text-white/85"
                  }`}
                >
                  <span className={activeFilter === cat.value ? "border-b border-brand-green pb-1 inline-block" : "pb-1 inline-block"}>
                    {cat.label}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            {column2.map((cat) => (
              <div key={cat.value} className="flex justify-start">
                <button
                  onClick={() => setActiveFilter(cat.value)}
                  className={`font-grotesk text-sm sm:text-base md:text-lg tracking-wide relative transition-all duration-200 cursor-pointer text-left focus:outline-none ${
                    activeFilter === cat.value
                      ? "text-white font-medium"
                      : "text-white/55 hover:text-white/85"
                  }`}
                >
                  <span className={activeFilter === cat.value ? "border-b border-brand-green pb-1 inline-block" : "pb-1 inline-block"}>
                    {cat.label}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4">
            {column3.map((cat) => (
              <div key={cat.value} className="flex justify-start">
                <button
                  onClick={() => setActiveFilter(cat.value)}
                  className={`font-grotesk text-sm sm:text-base md:text-lg tracking-wide relative transition-all duration-200 cursor-pointer text-left focus:outline-none ${
                    activeFilter === cat.value
                      ? "text-white font-medium"
                      : "text-white/55 hover:text-white/85"
                  }`}
                >
                  <span className={activeFilter === cat.value ? "border-b border-brand-green pb-1 inline-block" : "pb-1 inline-block"}>
                    {cat.label}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
             PROJECTS GRID
        ══════════════════════════════════════════ */}
        <main className="mt-16 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16"
            >
              {filteredProjects.length === 0 ? (
                <div className="col-span-full text-center py-24 text-white/30 font-grotesk tracking-widest uppercase">
                  No projects in this category yet.
                </div>
              ) : (
                filteredProjects.map((project) => {
                  return (
                    <motion.button
                      key={project.id}
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-80px" }}
                      onClick={() => onSelectProject(project.id)}
                      className="flex flex-col gap-4 text-left group cursor-pointer focus:outline-none"
                    >
                      <HoverableThumbnail
                        thumbnail={project.thumbnail}
                        title={project.title}
                        category={project.category}
                        hoverGif={project.hoverGif}
                        hoverVideo={project.hoverVideo}
                        gifMode={Boolean(project.gifModes?.[project.thumbnail])}
                        className="w-full aspect-[16/10]"
                      />

                      <div className="flex flex-col gap-1.5 px-1">
                        <h2 className="font-grotesk text-xl sm:text-2xl font-medium tracking-wide text-white group-hover:text-brand-green transition-colors duration-200">
                          {project.title}
                        </h2>
                        <p className="font-grotesk text-sm tracking-wide text-white/50">
                          {project.categories && project.categories.length > 0
                            ? project.categories.join(" / ")
                            : project.category}
                        </p>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
