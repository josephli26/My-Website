import { Play, ArrowUpRight } from "lucide-react";
import { useCMS } from "../context/CMSContext";
import { motion } from "motion/react";
import { ImageFallback, fixAssetUrl } from "./ImageFallback";
import { HoverableThumbnail } from "./HoverableThumbnail";

interface HomeViewProps {
  onNavigate: (view: "home" | "projects" | "about") => void;
  onSelectProject: (id: number) => void;
  onOpenShowreel: () => void;
}

export function HomeView({
  onNavigate,
  onSelectProject,
  onOpenShowreel,
}: HomeViewProps) {
  const { data } = useCMS();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  const handleProjectClick = (id: number) => {
    onSelectProject(id);
  };

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

  const titles = data.homeTitles || {};
  const visibility = data.homeVisibility || {};

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full cms-home-padding"
    >
      {/* Dynamic spacing CSS variables for smooth live response to CMS sliders */}
      <style>{`
        .cms-section-gap {
          margin-bottom: ${gapMobile}px;
        }
        @media (min-width: 768px) {
          .cms-section-gap {
            margin-bottom: ${gapDesktop}px;
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

        .cms-see-other-work-spacing {
          margin-top: ${gapMobile}px;
        }
        @media (min-width: 768px) {
          .cms-see-other-work-spacing {
            margin-top: ${gapDesktop}px;
          }
        }

        .cms-featured-gap {
          gap: ${gapMobile}px;
        }
        @media (min-width: 768px) {
          .cms-featured-gap {
            gap: ${gapDesktop}px;
          }
        }

        .cms-home-padding {
          padding-top: ${pyTopMobile}px;
          padding-bottom: ${pyBottomMobile}px;
        }
        @media (min-width: 768px) {
          .cms-home-padding {
            padding-top: ${pyTopDesktop}px;
            padding-bottom: ${pyBottomDesktop}px;
          }
        }
      `}</style>

      {/* ══════════════════════════════════════════
           HERO SECTION
      ══════════════════════════════════════════ */}
      {visibility.hero !== false && (
        <section className="w-full cms-section-gap">
          <div className="max-w-[1550px] mx-auto px-6 md:px-12 xl:px-16">
            <motion.div
              variants={itemVariants}
              className="w-full flex items-center justify-center overflow-visible"
            >
              <picture className="w-full flex justify-center">
                {data.heroImageMobile && (
                  <source media="(max-width: 640px)" srcSet={fixAssetUrl(data.heroImageMobile)} />
                )}
                <img
                  src={fixAssetUrl(data.heroImage)}
                  alt="Youssef Abaali - Motion Graphics"
                  className="w-full h-auto object-contain mx-auto select-none transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </picture>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
           SHOWREEL SECTION
      ══════════════════════════════════════════ */}
      {visibility.showreel !== false && (
        <section className="w-full cms-section-gap">
          <div className="max-w-[1550px] mx-auto px-6 md:px-12 xl:px-16">
            {titles.showreel && (
              <motion.p
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-120px" }}
                className="font-bebas text-3xl sm:text-4xl md:text-[45px] tracking-widest text-brand-green cms-heading-gap"
              >
                {titles.showreel}
              </motion.p>
            )}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              className="w-full overflow-hidden rounded-lg border border-white/10 group cursor-pointer relative"
              onClick={onOpenShowreel}
            >
              <ImageFallback
                src={data.showreel.thumbnail}
                alt="Showreel — ¿QUÉ ES? SHOWREEL ¿PORQUE DEBERIA TENER UNO?"
                fallbackType="showreel"
                className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-103"
              />
              {/* Overlay and play button */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-green/90 group-hover:bg-brand-green text-brand-black flex items-center justify-center shadow-[0_0_35px_rgba(140,255,46,0.5)] transition-all duration-300 group-hover:scale-110">
                  <Play size={32} className="ml-1 fill-brand-black text-brand-black" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
           FEATURED WORK
      ══════════════════════════════════════════ */}
      {visibility.featuredWork !== false && (
        <section className="w-full cms-section-gap">
          <div className="max-w-[1550px] mx-auto px-6 md:px-12 xl:px-16">
            <motion.p
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              className="font-bebas text-3xl sm:text-4xl md:text-[45px] tracking-widest text-brand-green cms-heading-gap"
            >
              {titles.featuredWork || "FEATURED WORK"}
            </motion.p>

            <div className="flex flex-col cms-featured-gap">
              {data.projects.filter(p => p.isPublished !== false).map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-120px" }}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 pt-8 ${
                    !project.imageLeft ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Thumbnail */}
                  <button
                    onClick={() => handleProjectClick(project.id)}
                    className="w-full md:w-[58%] overflow-hidden rounded-xl bg-brand-card border border-white/5 cursor-pointer text-left focus:outline-none"
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
                  </button>

                  {/* Info */}
                  <div className="w-full md:w-[42%] flex flex-col gap-4 text-left">
                    <span className="text-brand-green font-grotesk text-xs tracking-widest uppercase font-semibold">
                      {project.category}
                    </span>
                    <button
                      onClick={() => handleProjectClick(project.id)}
                      className="text-left focus:outline-none cursor-pointer"
                    >
                      <h3 className="font-bebas text-3xl sm:text-4xl md:text-[48px] tracking-wider text-white hover:text-brand-green transition-colors duration-200">
                        {project.title}
                      </h3>
                    </button>
                    <p className="font-grotesk text-xs sm:text-[13px] tracking-wider leading-relaxed text-white/70 uppercase max-w-lg">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              className="flex justify-center cms-see-other-work-spacing"
            >
              <button
                onClick={() => onNavigate("projects")}
                className="flex items-center gap-3 bg-brand-green text-brand-black font-grotesk font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-xl cursor-pointer hover:opacity-90 transition-transform duration-200 hover:-translate-y-0.5"
              >
                See Other Work
                <ArrowUpRight size={16} />
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
           SERVICES & EXPERTISE
      ══════════════════════════════════════════ */}
      {visibility.services !== false && (
        <section className="w-full cms-section-gap">
          <div className="max-w-[1550px] mx-auto px-6 md:px-12 xl:px-16">
            <motion.p
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              className="font-bebas text-3xl sm:text-4xl md:text-[45px] tracking-widest text-brand-green cms-heading-gap"
            >
              {titles.services || "SERVICES & EXPERTISE"}
            </motion.p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-center items-stretch"
            >
              {data.services.map((service, idx) => (
                <motion.div
                  key={service.title}
                  variants={itemVariants}
                  className={`bg-brand-card border border-white/5 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[220px] w-full ${
                    idx === 2
                      ? "sm:col-span-2 sm:w-[calc(50%-0.75rem)] sm:justify-self-center lg:col-span-1 lg:w-full lg:justify-self-auto"
                      : ""
                  }`}
                >
                  <h3 className="font-bebas text-2xl sm:text-3xl tracking-widest text-white leading-snug break-words">
                    {service.title}
                  </h3>
                  <div className="w-8 h-[2px] bg-brand-green shrink-0" />
                  <ul className="flex flex-col gap-1.5">
                    {service.items.map((item) => (
                      <li
                        key={item}
                        className="font-grotesk text-xs sm:text-[13px] font-normal tracking-widest text-white/70 uppercase"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
           CONTACT CTA
      ══════════════════════════════════════════ */}
      {visibility.contactCta !== false && (
        <section className="w-full cms-section-gap">
          <div className="max-w-[1550px] mx-auto px-6 md:px-12 xl:px-16 flex items-center justify-center overflow-visible">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              className="w-full flex items-center justify-center"
            >
              <picture className="w-full flex justify-center">
                {data.myInfoMobile ? (
                  <source media="(max-width: 640px)" srcSet={data.myInfoMobile} />
                ) : (
                  <source media="(max-width: 640px)" srcSet="/src/assets/images/myInfo-Mobile.png" />
                )}
                <img
                  src={data.myInfo || "/src/assets/images/myInfo.jpg"}
                  alt="Youssef Abaali - Contact Info"
                  className="w-full h-auto object-contain mx-auto select-none transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </picture>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
           SOCIALS — "I'M ALL OVER THE INTERNET"
      ══════════════════════════════════════════ */}
      {visibility.socials !== false && (
        <section className="w-full cms-section-gap">
          <div className="max-w-[1550px] mx-auto px-6 md:px-12 xl:px-16">
            <motion.p
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              className="font-bebas text-3xl sm:text-4xl md:text-[45px] tracking-widest text-brand-green cms-heading-gap"
            >
              {titles.socials || "I'M ALL OVER THE INTERNET"}
            </motion.p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              className="flex flex-wrap justify-center gap-4 sm:gap-6"
            >
              {data.socials.map((social) => (
                <motion.a
                  key={social.name}
                  variants={itemVariants}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-card border border-white/5 hover:border-brand-green rounded-xl p-4 md:p-5 flex flex-col justify-between items-start gap-3 md:gap-8 group transition-all duration-300 hover:-translate-y-1 w-[calc(50%-8px)] sm:w-[calc(33.33%-16px)] md:flex-1 min-w-[120px] max-w-[180px] aspect-[4/3]"
                >
                  <span className="font-grotesk text-xs sm:text-sm font-medium tracking-wide text-white group-hover:text-brand-green transition-colors duration-200">
                    {social.name}
                  </span>
                  <div className="self-end opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <img
                      src={social.icon}
                      alt={social.name}
                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain select-none pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </motion.div>
  );
}
