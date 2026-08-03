export interface NavLink {
  label: string;
  href: string;
}

export interface Showreel {
  videoUrl: string;
  thumbnail: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  categories?: string[];
  description: string;
  thumbnail: string;
  link: string;
  imageLeft: boolean;
  hoverGif?: string;
  hoverVideo?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

export interface AllProject {
  id: number;
  title: string;
  category: string;
  categories?: string[];
  thumbnail: string;
  link: string;
  hoverGif?: string;
  hoverVideo?: string;
  isPublished?: boolean;
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

export interface GalleryRow {
  id?: string;
  images: string[];
  singleImageColumns?: number;
}

export interface CustomInfoField {
  id: string;
  label: string;
  value: string;
}

export interface ProjectSection {
  type: "grid" | "row";
  label: string;
  images: string[];
  rows?: GalleryRow[];
}

export interface ProjectDetail {
  id: number;
  title: string;
  shortDescription: string;
  heroImage: string;
  thumbnail?: string;
  role: string;
  client: string;
  description: string;
  videoUrl?: string;
  categories?: string[];
  sections: ProjectSection[];
  date?: string;
  softwareUsed?: string[];
  behanceLink?: string;
  externalLink?: string;
  customFields?: CustomInfoField[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSocial {
  label: string;
  href: string;
  isVisible?: boolean;
}

export interface FooterData {
  year: number;
  logoText?: string;
  descriptionText?: string;
  copyrightText?: string;
  footerLinks: FooterLink[];
  footerSocials: FooterSocial[];
}

export interface SkillItem {
  name: string;
  desc: string;
  percent: number;
}

export interface AboutMeData {
  profileImage: string;
  profileImageWidthDesktop?: number;
  profileImageWidthMobile?: number;
  paragraphs: string[];
  creativeHeadline: string;
  skills: SkillItem[];
  resumeUrl?: string;
  resumeButtonText?: string;
}

export interface ContactData {
  email?: string;
  phone?: string;
  location?: string;
  googleMapsEmbed?: string;
  hours?: string;
}

export interface SEOPageData {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
}

export interface SEOSettings {
  home: SEOPageData;
  projects: SEOPageData;
  about: SEOPageData;
}

export interface DesignColors {
  primary: string;       // default #8cff2e
  background: string;    // default #131313
  text: string;          // default #ffffff
  card: string;          // default #1a1a1a
  footer: string;        // default #c8c5ae
  accent?: string;       // default #8cff2e
  border?: string;       // default #262626
  buttonBg?: string;     // default #8cff2e
  buttonText?: string;   // default #131313
  mutedText?: string;    // default #a3a3a3
  navBg?: string;        // default #131313
  navText?: string;      // default #ffffff
  badgeBg?: string;      // default #262626
  badgeText?: string;    // default #8cff2e
}

export interface DesignTypography {
  headingFont: string;     // default "Bebas Neue"
  bodyFont: string;        // default "Space Grotesk"
  heroSizeDesktop: number; // in % or relative
  heroSizeMobile: number;
  headingSizeDesktop: number;
  headingSizeMobile: number;
  bodySizeDesktop: number;
  bodySizeMobile: number;
  letterSpacing: string;   // tracking-wide, etc.
  lineHeight: string;      // leading-relaxed, etc.
}

export interface DesignLayout {
  paddingTop: number;     // in px
  paddingBottom: number;  // in px
  sectionGap: number;     // Desktop/Laptop section gap in px
  sectionGapMobile?: number; // Mobile/Tablet section gap in px
  cardGap: number;        // in px
  gridGap: number;        // in px
  elementGap: number;     // in px
  headingGap?: number;    // spacing between heading/title and paragraph in px
  headingGapMobile?: number; // spacing between heading/title on mobile/tablet in px
  paragraphGap?: number;  // spacing between paragraphs in px
}

export interface CMSDesignSystem {
  colors: DesignColors;
  typography: DesignTypography;
  layout: DesignLayout;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export interface CMSSettings {
  passcode: string; // CMS password
}

export interface HomeSectionTitles {
  showreel?: string;
  featuredWork?: string;
  services?: string;
  contactCta?: string;
  socials?: string;
}

export interface HomeSectionVisibility {
  hero?: boolean;
  showreel?: boolean;
  featuredWork?: boolean;
  services?: boolean;
  contactCta?: boolean;
  socials?: boolean;
}

export interface CMSSiteData {
  name: string;
  title: string;
  tagline: string;
  heroImage: string;
  heroImageMobile?: string;
  myInfo?: string;
  myInfoMobile?: string;
  email: string;
  nav: NavLink[];
  showreel: Showreel;
  projects: Project[];
  allProjects: AllProject[];
  services: Service[];
  socials: SocialLink[];
  aboutSocials?: SocialLink[];
  projectDetails: ProjectDetail[];
  footer: FooterData;
  aboutMe: AboutMeData;
  contact: ContactData;
  seo: SEOSettings;
  design: CMSDesignSystem;
  settings: CMSSettings;
  activityLogs: ActivityLog[];
  homeTitles?: HomeSectionTitles;
  homeVisibility?: HomeSectionVisibility;
  projectCategories?: string[]; // Custom dynamic list of project categories
}
