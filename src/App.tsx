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
    return isAdmin ? <AdminCMS /> : <AdminLogin />;
  }

  // Construct dynamic design variables
  const design = data.design;
  const styleVars = {
    "--color-brand-green": design.colors.primary,
    "--color-brand-black": design.colors.background,
    "--color-brand-white": design.colors.text,
    "--color-brand-card": design.colors.card,
    "--color-brand-footer": design.colors.footer,
    "--font-bebas": `"${design.typography.headingFont}", sans-serif`,
    "--font-grotesk": `"${design.typography.bodyFont}", sans-serif`,
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
