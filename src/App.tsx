import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomeView } from "./components/HomeView";
import { ProjectsView } from "./components/ProjectsView";
import { ProjectDetailView } from "./components/ProjectDetailView";
import { AboutView } from "./components/AboutView";
import { VideoModal } from "./components/VideoModal";
import { AdminLogin } from "./components/AdminLogin";
import { AdminCMS } from "./components/AdminCMS";
import { CMSErrorBoundary } from "./components/CMSErrorBoundary";
import { useCMS } from "./context/CMSContext";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "motion/react";

export default function App() {
  const { data, isLoading, isAdmin } = useCMS();
  const [currentView, setCurrentView] = useState<"home" | "projects" | "about" | "project-detail" | "admin">("home");
  const [selectedProjectId, setSelectedProjectId] = useState<number>(1);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Scroll progress for top indicator bar
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.0001
  });

  const progressWidth = useTransform(smoothProgress, (v) => `${Math.max(0, Math.min(100, v * 100))}%`);
  const progressOpacity = useTransform(smoothProgress, (v) => (v < 0.003 ? 0 : 1));

  // Synchronize state with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash === "#admin" || hash === "#cms") {
        setCurrentView("admin");
        window.scrollTo(0, 0);
        return;
      }

      if (hash.startsWith("#project/")) {
        const id = parseInt(hash.replace("#project/", ""), 10);
        if (!isNaN(id)) {
          setSelectedProjectId(id);
          setCurrentView("project-detail");
          window.scrollTo(0, 0);
          return;
        }
      }

      if (hash === "#projects") {
        setCurrentView("projects");
      } else if (hash === "#about") {
        setCurrentView("about");
      } else {
        setCurrentView("home");
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener("hashchange", handleHashChange);
    // Trigger on initial load
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Update URL hash when state is triggered programmatically
  const handleNavigation = (view: "home" | "projects" | "about") => {
    if (view === "home") {
      window.location.hash = "";
    } else {
      window.location.hash = `#${view}`;
    }
  };

  const handleSelectProject = (id: number) => {
    window.location.hash = `#project/${id}`;
  };

  const handleBackToProjects = () => {
    window.location.hash = "#projects";
  };

  // Sync root CSS variables with CMS dynamic theme settings
  useEffect(() => {
    const root = document.documentElement;
    if (currentView === "admin") {
      // Force admin theme on root when viewing CMS
      root.style.setProperty("--brand-green", "#8cff2e");
      root.style.setProperty("--brand-black", "#131313");
      root.style.setProperty("--brand-white", "#ffffff");
      root.style.setProperty("--brand-card", "#1a1a1a");
      root.style.setProperty("--brand-footer", "#c8c5ae");
      root.style.setProperty("--brand-accent", "#8cff2e");
      root.style.setProperty("--brand-border", "#262626");
      root.style.setProperty("--brand-button-bg", "#8cff2e");
      root.style.setProperty("--brand-button-text", "#131313");
      root.style.setProperty("--brand-muted", "#a3a3a3");
      root.style.setProperty("--brand-nav-bg", "#131313");
      root.style.setProperty("--brand-nav-text", "#ffffff");
      root.style.setProperty("--brand-badge-bg", "#262626");
      root.style.setProperty("--brand-badge-text", "#8cff2e");
    } else if (data?.design?.colors) {
      const c = data.design.colors;
      const primary = c.primary || "#8cff2e";
      const bg = c.background || "#131313";
      const text = c.text || "#ffffff";
      const card = c.card || "#1a1a1a";
      const footer = c.footer || "#c8c5ae";
      const accent = c.accent || primary;
      const border = c.border || "#262626";
      const buttonBg = c.buttonBg || primary;
      const buttonText = c.buttonText || "#131313";
      const mutedText = c.mutedText || "#a3a3a3";
      const navBg = c.navBg || bg;
      const navText = c.navText || text;
      const badgeBg = c.badgeBg || "#262626";
      const badgeText = c.badgeText || primary;

      root.style.setProperty("--brand-green", primary);
      root.style.setProperty("--brand-black", bg);
      root.style.setProperty("--brand-white", text);
      root.style.setProperty("--brand-card", card);
      root.style.setProperty("--brand-footer", footer);
      root.style.setProperty("--brand-accent", accent);
      root.style.setProperty("--brand-border", border);
      root.style.setProperty("--brand-button-bg", buttonBg);
      root.style.setProperty("--brand-button-text", buttonText);
      root.style.setProperty("--brand-muted", mutedText);
      root.style.setProperty("--brand-nav-bg", navBg);
      root.style.setProperty("--brand-nav-text", navText);
      root.style.setProperty("--brand-badge-bg", badgeBg);
      root.style.setProperty("--brand-badge-text", badgeText);

      if (data?.design?.typography) {
        root.style.setProperty("--font-bebas", `"${data.design.typography.headingFont}", sans-serif`);
        root.style.setProperty("--font-grotesk", `"${data.design.typography.bodyFont}", sans-serif`);
      }
    }
  }, [data?.design, currentView]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-[#8cff2e] font-mono text-xs uppercase tracking-widest">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#8cff2e] border-t-transparent rounded-full animate-spin" />
          Loading Portfolio Database...
        </div>
      </div>
    );
  }

  // Check if we are in the secret admin area
  if (currentView === "admin") {
    return isAdmin ? (
      <CMSErrorBoundary>
        <AdminCMS />
      </CMSErrorBoundary>
    ) : (
      <AdminLogin />
    );
  }

  // Construct dynamic design variables
  const colors = data?.design?.colors || {
    primary: "#8cff2e",
    background: "#131313",
    text: "#ffffff",
    card: "#1a1a1a",
    footer: "#c8c5ae",
    accent: "#8cff2e",
    border: "#262626",
    buttonBg: "#8cff2e",
    buttonText: "#131313",
    mutedText: "#a3a3a3",
    navBg: "#131313",
    navText: "#ffffff",
    badgeBg: "#262626",
    badgeText: "#8cff2e",
  };

  const typography = data?.design?.typography || {
    headingFont: "Bebas Neue",
    bodyFont: "Space Grotesk",
  };

  const styleVars = {
    "--brand-green": colors.primary || "#8cff2e",
    "--brand-black": colors.background || "#131313",
    "--brand-white": colors.text || "#ffffff",
    "--brand-card": colors.card || "#1a1a1a",
    "--brand-footer": colors.footer || "#c8c5ae",
    "--brand-accent": colors.accent || colors.primary || "#8cff2e",
    "--brand-border": colors.border || "#262626",
    "--brand-button-bg": colors.buttonBg || colors.primary || "#8cff2e",
    "--brand-button-text": colors.buttonText || "#131313",
    "--brand-muted": colors.mutedText || "#a3a3a3",
    "--brand-nav-bg": colors.navBg || colors.background || "#131313",
    "--brand-nav-text": colors.navText || colors.text || "#ffffff",
    "--brand-badge-bg": colors.badgeBg || "#262626",
    "--brand-badge-text": colors.badgeText || colors.primary || "#8cff2e",
    "--font-bebas": `"${typography.headingFont || "Bebas Neue"}", sans-serif`,
    "--font-grotesk": `"${typography.bodyFont || "Space Grotesk"}", sans-serif`,
  } as React.CSSProperties;

  return (
    <div
      style={styleVars}
      className="min-h-screen bg-brand-black text-brand-white flex flex-col font-grotesk overflow-x-hidden select-none selection:bg-brand-green selection:text-brand-black"
    >
      {/* Dynamic scroll progress bar indicator */}
      <motion.div
        className="fixed top-0 left-0 h-[3px] bg-brand-green z-[200] shadow-[0_0_8px_var(--color-brand-green)] pointer-events-none rounded-r-sm"
        style={{ width: progressWidth, opacity: progressOpacity }}
      />

      {/* Header / Navbar */}
      <Navbar currentView={currentView} onNavigate={handleNavigation} />

      {/* Main Container - Page transition animations */}
      <div className="flex-1 flex flex-col w-full relative">
        <AnimatePresence mode="wait">
          <motion.main
            key={currentView === "project-detail" ? `detail-${selectedProjectId}` : currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: "easeInOut" }}
            className="flex-1 w-full flex flex-col"
          >
            {currentView === "home" && (
              <HomeView
                onNavigate={handleNavigation}
                onSelectProject={handleSelectProject}
                onOpenShowreel={() => setIsVideoOpen(true)}
              />
            )}

            {currentView === "projects" && (
              <ProjectsView onSelectProject={handleSelectProject} />
            )}

            {currentView === "project-detail" && (
              <ProjectDetailView
                projectId={selectedProjectId}
                onBack={handleBackToProjects}
              />
            )}

            {currentView === "about" && <AboutView />}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <Footer onNavigate={handleNavigation} />

      {/* Interactive Showreel Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={data.showreel.videoUrl}
      />
    </div>
  );
}
