export interface NavLink {
  label: string;
  href: string;
}

export interface Showreel {
  videoUrl: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  link: string;
  imageLeft: boolean;
  hoverGif?: string;
  hoverVideo?: string;
}

export interface AllProject {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  link: string;
  hoverGif?: string;
  hoverVideo?: string;
}

export interface Service {
  title: string;
  items: string[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
  iconBW?: string;
}

export interface ProjectSection {
  type: "grid" | "row";
  label: string;
  images: string[];
}

export interface ProjectDetail {
  id: number;
  title: string;
  shortDescription: string;
  heroImage: string;
  role: string;
  client: string;
  description: string;
  sections: ProjectSection[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSocial {
  label: string;
  href: string;
}

export interface FooterData {
  year: number;
  footerLinks: FooterLink[];
  footerSocials: FooterSocial[];
}

export interface SiteData {
  name: string;
  title: string;
  tagline: string;
  email: string;
  nav: NavLink[];
  showreel: Showreel;
  projects: Project[];
  allProjects: AllProject[];
  services: Service[];
  socials: SocialLink[];
  projectDetails: ProjectDetail[];
  footer: FooterData;
}

export const siteData: SiteData = {
  name: "YOUSSEF ABAALI",
  title: "MOTION GRAPHICS",
  tagline: "I'M HERE TO HELP YOU TO TURNING\nYOUR IDEAS INTO THE LIVE",
  email: "youssef.abaali@gmail.com",

  nav: [
    { label: "Project", href: "projects" },
    { label: "About & Contact", href: "about" },
  ],

  showreel: {
    videoUrl: "https://vimeo.com/1153984527?fl=pl&fe=sh",
  },

  projects: [
    {
      id: 1,
      title: "247 MAINTENANCE",
      category: "Explainer",
      description:
        "247 MAINTENANCE IS A SMART APP THAT CONNECTS YOU WITH EXPERT TECHNICIANS FOR ALL YOUR HOME NEEDS ANYWHERE IN THE UNITED ARAB EMIRATES.",
      thumbnail: "assets/images/project-1.png",
      link: "#",
      imageLeft: true,
      hoverGif: "src/assets/images/GIF-274.gif",
    },
    {
      id: 2,
      title: "AINSI VA MANU - TV SERIES",
      category: "Explainer",
      description:
        "THE DIRECTOR NEEDED SCREEN GRAPHICS TO SUPPORT THE VISUAL STORYTELLING, AND MY TASK WAS TO DESIGN AND ANIMATE THESE GRAPHICS IN A WAY THAT ALIGNS WITH THE SERIES' SHOTS AND REFLECTS ITS DRAMATIC ENERGY.",
      thumbnail: "assets/images/project-2.webp",
      link: "#",
      imageLeft: false,
      hoverGif: "src/assets/images/GIF-274.gif",
    },
    {
      id: 3,
      title: "FONETIK CREATIVE STUDIO SHOWREEL",
      category: "Brand",
      description:
        "FULL-SCALE AUDIOVISUAL PRODUCTION, BRAND CREATION, AND CULTURAL LOCALIZATION.",
      thumbnail: "assets/images/project-3.jpg",
      link: "#",
      imageLeft: true,
      hoverGif: "src/assets/images/GIF-274.gif",
    },
  ],

  allProjects: [
    {
      id: 1,
      title: "247 Maintenance",
      category: "Explainer",
      thumbnail: "assets/images/project-1.png",
      link: "#",
      hoverGif: "src/assets/images/GIF-274.gif",
    },
    {
      id: 2,
      title: "Ainsi Va Manu - TV Series",
      category: "Explainer",
      thumbnail: "assets/images/project-2.webp",
      link: "#",
      hoverGif: "src/assets/images/GIF-274.gif",
    },
    {
      id: 3,
      title: "Fonetik Creative Studio",
      category: "Brand",
      thumbnail: "assets/images/project-3.jpg",
      link: "#",
      hoverGif: "src/assets/images/GIF-274.gif",
    },
    {
      id: 4,
      title: "Fonetik Studio Créatif",
      category: "Brand",
      thumbnail: "assets/images/project-4.jpg",
      link: "#",
      hoverGif: "src/assets/images/GIF-274.gif",
    },
    {
      id: 5,
      title: "Workleap — Gathering Theme",
      category: "UI Motion",
      thumbnail: "assets/images/project-7.jpg",
      link: "#",
      hoverGif: "src/assets/images/GIF-274.gif",
    },
    {
      id: 6,
      title: "Workleap",
      category: "UI Motion",
      thumbnail: "assets/images/project-6.png",
      link: "#",
      hoverGif: "src/assets/images/GIF-274.gif",
    },
    {
      id: 7,
      title: "Montréal Club de Lecture",
      category: "Broadcast",
      thumbnail: "assets/images/project-5.jpg",
      link: "#",
      hoverGif: "src/assets/images/GIF-274.gif",
    },
    {
      id: 8,
      title: "Youssef Abaali Showreel",
      category: "Showreel",
      thumbnail: "assets/images/showreel-Thumbnail.png",
      link: "#",
      hoverGif: "src/assets/images/GIF-274.gif",
    },
  ],

  services: [
    {
      title: "MOTION GRAPHICS",
      items: ["SAS", "EXPLAINER VIDEO", "REEL"],
    },
    {
      title: "LOGO ANIMATION",
      items: ["FRAME BY FRAME"],
    },
    {
      title: "UX-UI ANIMATION",
      items: ["LOTTIE"],
    },
  ],

  socials: [
    { name: "LinkedIn", href: "https://linkedin.com", icon: "/src/assets/Icons/Icon-LinkedIn-Color.svg", iconBW: "/src/assets/Icons/Icon-LinkedIn-BW.svg" },
    { name: "Behance", href: "https://behance.net", icon: "/src/assets/Icons/Icon-Behance-Color.svg", iconBW: "/src/assets/Icons/Icon-Behance-BW.svg" },
    { name: "X", href: "https://x.com", icon: "/src/assets/Icons/Icon-X-Color.svg", iconBW: "/src/assets/Icons/Icon-X-BW.svg" },
    { name: "Instagram", href: "https://instagram.com", icon: "/src/assets/Icons/Icon-Instagram-Color.svg", iconBW: "/src/assets/Icons/Icon-Instagram-BW.svg" },
    { name: "Facebook", href: "https://facebook.com", icon: "/src/assets/Icons/Icon-Facebook-Color.svg", iconBW: "/src/assets/Icons/Icon-Facebook-BW.svg" },
  ],

  projectDetails: [
    {
      id: 1,
      title: "247 MAINTENANCE - CONNECTING HOMES TO EXPERTS",
      shortDescription:
        "247 MAINTENANCE IS A SMART APP THAT CONNECTS YOU WITH EXPERT TECHNICIANS FOR ALL YOUR HOME NEEDS ANYWHERE IN THE UNITED ARAB EMIRATES.",
      heroImage: "assets/images/project-1.png",
      role: "STORYBOARD, ILLUSTRATION, ANIMATION & SFX",
      client: "247 MAINTENANCE",
      description:
        "247 MAINTENANCE IS A SMART APP THAT CONNECTS YOU WITH EXPERT TECHNICIANS FOR ALL YOUR HOME NEEDS ANYWHERE IN THE UNITED ARAB EMIRATES.",
      sections: [
        {
          type: "grid",
          label: "STORYBOARD",
          images: [
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
          ],
        },
        {
          type: "grid",
          label: "ILLUSTRATION",
          images: [
            "assets/images/picture-illustration.png",
            "assets/images/picture-illustration.png",
            "assets/images/picture-illustration.png",
            "assets/images/picture-illustration.png",
            "assets/images/picture-illustration.png",
            "assets/images/picture-illustration.png",
          ],
        },
        {
          type: "row",
          label: "STYLEFRAMES",
          images: [
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
          ],
        },
        {
          type: "row",
          label: "PROCESS",
          images: [
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
          ],
        },
      ],
    },
    {
      id: 2,
      title: "AINSI VA MANU - TV SERIES",
      shortDescription:
        "THE DIRECTOR NEEDED SCREEN GRAPHICS TO SUPPORT THE VISUAL STORYTELLING, AND MY TASK WAS TO DESIGN AND ANIMATE THESE GRAPHICS.",
      heroImage: "assets/images/project-2.webp",
      role: "MOTION GRAPHICS & ANIMATION",
      client: "AINSI VA MANU",
      description:
        "THE DIRECTOR NEEDED SCREEN GRAPHICS TO SUPPORT THE VISUAL STORYTELLING, AND MY TASK WAS TO DESIGN AND ANIMATE THESE GRAPHICS IN A WAY THAT ALIGNS WITH THE SERIES' SHOTS AND REFLECTS ITS DRAMATIC ENERGY.",
      sections: [
        {
          type: "grid",
          label: "STORYBOARD",
          images: [
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
          ],
        },
        {
          type: "row",
          label: "STYLEFRAMES",
          images: [
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
          ],
        },
      ],
    },
    {
      id: 3,
      title: "FONETIK CREATIVE STUDIO SHOWREEL",
      shortDescription: "FULL-SCALE AUDIOVISUAL PRODUCTION, BRAND CREATION, AND CULTURAL LOCALIZATION.",
      heroImage: "assets/images/project-3.jpg",
      role: "BRAND FILM & SIZZLE REEL",
      client: "FONETIK CREATIVE STUDIO",
      description: "FULL-SCALE AUDIOVISUAL PRODUCTION, BRAND CREATION, AND CULTURAL LOCALIZATION.",
      sections: [
        {
          type: "grid",
          label: "STORYBOARD",
          images: [
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
          ],
        },
        {
          type: "row",
          label: "PROCESS",
          images: [
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
          ],
        },
      ],
    },
    {
      id: 4,
      title: "FONETIK STUDIO CRÉATIF",
      shortDescription: "FULL-SCALE AUDIOVISUAL PRODUCTION, BRAND CREATION, AND CULTURAL LOCALIZATION.",
      heroImage: "assets/images/project-4.jpg",
      role: "BRAND FILM & SIZZLE REEL",
      client: "FONETIK STUDIO CRÉATIF",
      description: "FULL-SCALE AUDIOVISUAL PRODUCTION, BRAND CREATION, AND CULTURAL LOCALIZATION.",
      sections: [
        {
          type: "grid",
          label: "STORYBOARD",
          images: [
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
          ],
        },
        {
          type: "row",
          label: "PROCESS",
          images: [
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
          ],
        },
      ],
    },
    {
      id: 5,
      title: "WORKLEAP — GATHERING THEME",
      shortDescription: "INTERACTIVE WEB ANIMATIONS AND DESIGNS FOR WORKLEAP COLLABORATION SYSTEM.",
      heroImage: "assets/images/project-7.jpg",
      role: "LOTTIE & WEB ANIMATION",
      client: "WORKLEAP",
      description: "INTERACTIVE WEB ANIMATIONS AND DESIGNS FOR WORKLEAP COLLABORATION SYSTEM.",
      sections: [
        {
          type: "grid",
          label: "STORYBOARD",
          images: [
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
          ],
        },
        {
          type: "row",
          label: "PROCESS",
          images: [
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
          ],
        },
      ],
    },
    {
      id: 6,
      title: "WORKLEAP BRANDING",
      shortDescription: "BRANDING ANIMATIONS AND MICRO-INTERACTIONS FOR DIGITAL PLATFORMS.",
      heroImage: "assets/images/project-6.png",
      role: "LOTTIE & WEB ANIMATION",
      client: "WORKLEAP",
      description: "BRANDING ANIMATIONS AND MICRO-INTERACTIONS FOR DIGITAL PLATFORMS.",
      sections: [
        {
          type: "grid",
          label: "STORYBOARD",
          images: [
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
          ],
        },
        {
          type: "row",
          label: "PROCESS",
          images: [
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
          ],
        },
      ],
    },
    {
      id: 7,
      title: "MONTRÉAL CLUB DE LECTURE",
      shortDescription: "VIDEO INTRO AND MOTION GRAPHICS FOR THE BOOK CLUB BROADCAST SHOW.",
      heroImage: "assets/images/project-5.jpg",
      role: "BROADCAST & FILM",
      client: "MONTRÉAL CLUB DE LECTURE",
      description: "VIDEO INTRO AND MOTION GRAPHICS FOR THE BOOK CLUB BROADCAST SHOW.",
      sections: [
        {
          type: "grid",
          label: "STORYBOARD",
          images: [
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
          ],
        },
        {
          type: "row",
          label: "PROCESS",
          images: [
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
          ],
        },
      ],
    },
    {
      id: 8,
      title: "YOUSSEF ABAALI - MOTION SHOWREEL",
      shortDescription: "A COMPILATION OF MY BEST MOTION GRAPHICS, CHARACTER ANIMATION, AND 3D DESIGN PROJECTS.",
      heroImage: "assets/images/showreel-Thumbnail.png",
      role: "CREATIVE DIRECTION, DESIGN & ANIMATION",
      client: "SELF-PROMOTION",
      description: "A SELECTION OF MY PERSONAL AND COMMERCIAL WORK FROM THE PAST YEARS, REPRESENTING MY CREATIVE JOURNEY AND EXPERTISE IN THE FIELD OF MOTION DESIGN.",
      sections: [
        {
          type: "grid",
          label: "STORYBOARD & PLANNING",
          images: [
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
            "assets/images/picture-storyboard.png",
          ],
        },
        {
          type: "row",
          label: "CREATIVE PROCESS & ANIMATION",
          images: [
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
            "assets/images/picture-styleframe.png",
          ],
        },
      ],
    },
  ],

  footer: {
    year: 2026,
    footerLinks: [
      { label: "PROJECTS", href: "projects" },
      { label: "CONTACT", href: "about" },
    ],
    footerSocials: [
      { label: "FACEBOOK", href: "https://facebook.com" },
      { label: "INSTAGRAM", href: "https://instagram.com" },
      { label: "BEHANCE", href: "https://behance.net" },
      { label: "LINKEDIN", href: "https://linkedin.com" },
      { label: "VIMEO", href: "https://vimeo.com" },
    ],
  },
};
