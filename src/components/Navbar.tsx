import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ImageFallback } from "./ImageFallback";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: "home" | "projects" | "about") => void;
}

export function Navbar({ currentView, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (view: "home" | "projects" | "about") => {
    onNavigate(view);
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        isScrolled
          ? "bg-brand-nav-bg/90 backdrop-blur-md border-b border-brand-border/30 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1550px] mx-auto px-6 md:px-12 xl:px-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleLinkClick("home")}
          className="flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <ImageFallback
            src="assets/images/Logo.png"
            alt="Youssef Abaali Logo"
            fallbackType="logo"
            className="font-bebas text-2xl tracking-widest text-brand-green hover:opacity-80 transition-opacity duration-200 font-bold"
          />
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-12">
          <button
            onClick={() => handleLinkClick("projects")}
            className={`font-sans text-[14px] uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
              currentView === "projects" || currentView === "project-detail"
                ? "text-brand-green font-semibold"
                : "text-brand-nav-text/80 hover:text-brand-green"
            }`}
          >
            Work
          </button>
          <button
            onClick={() => handleLinkClick("about")}
            className={`font-sans text-[14px] uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
              currentView === "about"
                ? "text-brand-green font-semibold"
                : "text-brand-nav-text/80 hover:text-brand-green"
            }`}
          >
            About & Contact
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-brand-green transition-colors duration-200 cursor-pointer"
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Links Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-brand-black/98 border-b border-white/10 px-6 py-8 flex flex-col gap-6 shadow-xl animate-fade-in">
          <button
            onClick={() => handleLinkClick("projects")}
            className={`text-left font-sans text-lg uppercase tracking-wider ${
              currentView === "projects" || currentView === "project-detail"
                ? "text-brand-green font-bold"
                : "text-white"
            }`}
          >
            Work
          </button>
          <button
            onClick={() => handleLinkClick("about")}
            className={`text-left font-sans text-lg uppercase tracking-wider ${
              currentView === "about" ? "text-brand-green font-bold" : "text-white"
            }`}
          >
            About & Contact
          </button>
        </div>
      )}
    </nav>
  );
}
