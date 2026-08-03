import { useState } from "react";
import { useCMS } from "../context/CMSContext";
import { ImageFallback } from "./ImageFallback";
import { Copy, Check } from "lucide-react";

interface FooterProps {
  onNavigate: (view: "home" | "projects" | "about") => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { data } = useCMS();
  const [copied, setCopied] = useState(false);

  const displayEmail = data.contact?.email || data.email;

  const rawSocials = (data.footer.footerSocials && data.footer.footerSocials.length > 0)
    ? data.footer.footerSocials
    : (data.socials || []).map((s) => ({ label: s.name, href: s.href, isVisible: true }));

  const activeSocials = rawSocials.filter((s: any) => s.isVisible !== false);
  const copyrightText = data.footer.copyrightText || `© ${data.footer.year} ${data.name.toLowerCase()}. All rights reserved.`;

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(displayEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full flex flex-col">
      {/* Footer Top - Cream Background */}
      <div className="bg-brand-footer text-brand-black py-10 w-full">
        <div className="max-w-[1550px] mx-auto px-6 md:px-12 xl:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center cursor-pointer focus:outline-none"
          >
            <ImageFallback
              src="assets/images/Logo.png"
              alt="Youssef Abaali Logo"
              fallbackType="logo"
              className="font-bebas text-2xl tracking-widest text-brand-black hover:opacity-70 transition-opacity duration-200 font-bold"
            />
          </button>

          {/* Nav */}
          <nav className="flex flex-wrap gap-8 md:gap-12">
            <button
              onClick={() => onNavigate("projects")}
              className="font-sans text-[13px] font-semibold tracking-wider uppercase hover:opacity-60 transition-opacity cursor-pointer text-brand-black"
            >
              Work
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="font-sans text-[13px] font-semibold tracking-wider uppercase hover:opacity-60 transition-opacity cursor-pointer text-brand-black"
            >
              About & Contact
            </button>
          </nav>

          {/* Direct contact */}
          <div className="flex flex-col text-left">
            <span className="font-sans text-[11px] font-bold tracking-widest uppercase opacity-75">
              Contact Directly
            </span>
            <div className="flex items-center gap-2 mt-1">
              <a
                href={`mailto:${displayEmail}`}
                className="font-sans text-xs md:text-[13px] font-black tracking-wider hover:opacity-75 transition-opacity break-all select-all text-brand-black cursor-text"
              >
                {displayEmail}
              </a>
              <button
                onClick={handleCopyEmail}
                className="p-1 text-brand-black/70 hover:text-brand-black transition-colors cursor-pointer rounded hover:bg-black/5"
                title="Copy Email Address"
                aria-label="Copy Email"
              >
                {copied ? <Check size={14} className="text-emerald-800" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom - Black Background */}
      <div className="bg-brand-black border-t border-white/5 py-6 w-full text-white/50 text-[11px]">
        <div className="max-w-[1550px] mx-auto px-6 md:px-12 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Socials */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {activeSocials.map((social: any, sIdx: number) => (
              <a
                key={social.label || sIdx}
                href={social.href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans hover:text-white transition-colors uppercase tracking-wider font-semibold"
              >
                {social.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="font-sans tracking-wide text-center sm:text-right">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
