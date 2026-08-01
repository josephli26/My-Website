import { useState } from "react";
import { useCMS } from "../context/CMSContext";
import { motion } from "motion/react";
import { ImageFallback, fixAssetUrl } from "./ImageFallback";
import { FileText, Download, Copy, Check, ExternalLink } from "lucide-react";

export function AboutView() {
  const { data } = useCMS();
  const [copied, setCopied] = useState(false);

  const design = data.design || { layout: { sectionGap: 250, sectionGapMobile: 100, paddingTop: 128, paddingBottom: 96, paragraphGap: 24, headingGap: 24 } };
  const gapDesktop = design.layout.sectionGap ?? 250;
  const gapMobile = design.layout.sectionGapMobile ?? 100;
  const pyDesktop = design.layout.paddingTop ?? 128;
  const pyMobile = Math.round(pyDesktop * 0.6);
  const paragraphGap = design.layout.paragraphGap ?? 24;
  const headingGap = design.layout.headingGap ?? 24;

  const aboutMe = data.aboutMe || {
    profileImage: "/src/assets/images/MyPicture.jpg",
    paragraphs: [],
    creativeHeadline: "My creative\ntoolbox",
    skills: [],
    resumeUrl: "/assets/Resume-Youssef-Abaali.pdf",
    resumeButtonText: "My Resume"
  };

  const currentEmail = data.contact?.email || data.email;

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(currentEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  const desktopWidth = aboutMe.profileImageWidthDesktop || 440;
  const mobileWidth = aboutMe.profileImageWidthMobile || 380;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full cms-page-padding"
    >
      <style>{`
        .cms-page-padding {
          padding-top: ${pyMobile}px;
          padding-bottom: ${pyMobile}px;
        }
        @media (min-width: 768px) {
          .cms-page-padding {
            padding-top: ${pyDesktop}px;
            padding-bottom: ${pyDesktop}px;
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

        @media (min-width: 1024px) {
          .about-bio-grid {
            grid-template-columns: ${desktopWidth}px 1fr !important;
          }
        }
      `}</style>
      {/* ══════════════════════════════════════════
           PROFILE BIOGRAPHY SECTION
       ══════════════════════════════════════════ */}
      <section className="w-full cms-section-gap">
        <div className="max-w-[1550px] mx-auto px-6 md:px-12 xl:px-16">
          <div className="grid grid-cols-1 about-bio-grid gap-12 md:gap-20 items-start">
            {/* Picture wrap */}
            <motion.div
              variants={itemVariants}
              className="w-full"
              style={{ maxWidth: `min(100%, ${mobileWidth}px)` }}
            >
              <div className="aspect-[3/3.8] rounded-lg overflow-hidden bg-brand-card border border-white/5 shadow-2xl">
                <ImageFallback
                  src={aboutMe.profileImage}
                  alt="Youssef Abaali Profile Photo"
                  fallbackType="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Description biography */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col text-left pt-2"
              style={{ gap: `${paragraphGap}px` }}
            >
              {aboutMe.paragraphs.map((para, index) => {
                const isSemiBold = index === aboutMe.paragraphs.length - 2;
                return (
                  <p
                    key={index}
                    className={`font-grotesk text-[15px] sm:text-base leading-relaxed tracking-wide ${
                      isSemiBold
                        ? "text-white/90 font-semibold mt-4"
                        : "text-white"
                    }`}
                  >
                    {para}
                  </p>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           EMAIL + SOCIAL SECTION
      ══════════════════════════════════════════ */}
      <section className="border-t border-white/5 py-12 bg-brand-black w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          className="max-w-[1550px] mx-auto px-6 md:px-12 xl:px-16 flex flex-col items-center gap-10"
        >
          {/* Call-to-action email with copy button */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4"
          >
            <a
              href={`mailto:${currentEmail}`}
              className="font-grotesk text-base sm:text-xl md:text-2xl font-medium tracking-wide sm:tracking-widest text-brand-green hover:opacity-85 transition-opacity text-center break-words select-all cursor-text"
            >
              {currentEmail}
            </a>

            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-green/10 border border-brand-green/20 text-brand-green hover:bg-brand-green hover:text-brand-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              title="Copy Email Address to Clipboard"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400 font-bold" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </motion.div>

          {/* MY RESUME PDF BUTTON */}
          {aboutMe.resumeUrl && (
            <motion.div variants={itemVariants} className="flex items-center justify-center my-2">
              <a
                href={aboutMe.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-brand-green text-brand-black hover:bg-white px-7 py-3.5 rounded-xl font-grotesk font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-103 shadow-lg shadow-brand-green/10"
              >
                <FileText size={18} className="text-brand-black group-hover:text-black" />
                <span>{aboutMe.resumeButtonText || "My Resume"}</span>
                <ExternalLink size={15} className="opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            </motion.div>
          )}

          {/* Social connections */}
          <motion.div
            variants={containerVariants}
            className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mt-4"
          >
            {(data.aboutSocials || data.socials).map((social) => (
              <motion.a
                key={social.name}
                variants={itemVariants}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-brand-green transition-all hover:scale-110 duration-200"
                aria-label={social.name}
              >
                <img
                  src={fixAssetUrl(social.iconBW || social.icon)}
                  alt={social.name}
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
           MY CREATIVE TOOLBOX
      ══════════════════════════════════════════ */}
      <section className="border-t border-white/5 py-20 bg-brand-black/40 w-full">
        <div className="max-w-[1550px] mx-auto px-6 md:px-12 xl:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Headline */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-120px" }}
            className="text-left"
          >
            <h2 className="font-grotesk text-[32px] sm:text-[40px] md:text-[48px] font-normal leading-[1.15] tracking-tight text-white uppercase whitespace-pre-line">
              {aboutMe.creativeHeadline}
            </h2>
          </motion.div>

          {/* Skill lines */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-120px" }}
            className="flex flex-col gap-8 text-left"
          >
            {aboutMe.skills.map((skill) => (
              <motion.div key={skill.name} variants={itemVariants} className="flex flex-col gap-2.5">
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="font-grotesk text-sm font-semibold tracking-wider text-white">
                      {skill.name}
                    </span>
                    <span className="font-grotesk text-xs text-white/45 tracking-wide mt-0.5">
                      {skill.desc}
                    </span>
                  </div>
                  <span className="font-grotesk text-xs sm:text-sm font-bold tracking-wider text-brand-green">
                    {skill.percent}%
                  </span>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-green rounded-full"
                    initial={{ width: "0%" }}
                    whileInView={{ width: `${skill.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
