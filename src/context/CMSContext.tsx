import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CMSSiteData, ActivityLog } from "../types/cms";
import { defaultSiteData } from "../defaultData";

interface CMSContextType {
  data: CMSSiteData;
  isLoading: boolean;
  isAdmin: boolean;
  login: (passcode: string) => Promise<boolean>;
  logout: () => void;
  updateData: (updater: (prev: CMSSiteData) => CMSSiteData, action?: string, details?: string) => Promise<boolean>;
  uploadFile: (file: File) => Promise<string>;
  restoreBackup: (backupData: CMSSiteData) => Promise<boolean>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CMSSiteData>(defaultSiteData);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/data");
        if (res.ok) {
          const serverData = await res.json();
          const mergedData = {
            ...defaultSiteData,
            ...serverData,
            myInfo: serverData.myInfo !== undefined ? serverData.myInfo : defaultSiteData.myInfo,
            myInfoMobile: serverData.myInfoMobile !== undefined ? serverData.myInfoMobile : defaultSiteData.myInfoMobile,
            aboutSocials: serverData.aboutSocials || defaultSiteData.aboutSocials || serverData.socials || defaultSiteData.socials,
          };
          setData(mergedData);
          // Sync with local storage too for safety
          localStorage.setItem("cms_portfolio_data", JSON.stringify(mergedData));
        } else {
          // Fallback to local storage if server endpoint is not ready
          const cached = localStorage.getItem("cms_portfolio_data");
          if (cached) {
            const parsed = JSON.parse(cached);
            setData({
              ...defaultSiteData,
              ...parsed,
              myInfo: parsed.myInfo !== undefined ? parsed.myInfo : defaultSiteData.myInfo,
              myInfoMobile: parsed.myInfoMobile !== undefined ? parsed.myInfoMobile : defaultSiteData.myInfoMobile,
              aboutSocials: parsed.aboutSocials || defaultSiteData.aboutSocials || parsed.socials || defaultSiteData.socials,
            });
          } else {
            setData(defaultSiteData);
          }
        }
      } catch (err) {
        console.warn("CMS: Failed to fetch server data, using localStorage/default fallback.", err);
        const cached = localStorage.getItem("cms_portfolio_data");
        if (cached) {
          const parsed = JSON.parse(cached);
          setData({
            ...defaultSiteData,
            ...parsed,
            myInfo: parsed.myInfo !== undefined ? parsed.myInfo : defaultSiteData.myInfo,
            myInfoMobile: parsed.myInfoMobile !== undefined ? parsed.myInfoMobile : defaultSiteData.myInfoMobile,
            aboutSocials: parsed.aboutSocials || defaultSiteData.aboutSocials || parsed.socials || defaultSiteData.socials,
          });
        } else {
          setData(defaultSiteData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Check login state
    const adminSession = localStorage.getItem("cms_admin_session");
    if (adminSession === "true") {
      setIsAdmin(true);
    }

    loadData();
  }, []);

  // Update HTML Document Head for dynamic SEO (Title, description, keywords)
  useEffect(() => {
    if (!data || !data.seo) return;
    
    // Simple dynamic SEO updating on page hash changes
    const updateSEO = () => {
      const hash = window.location.hash;
      let pageSEO = data.seo.home;
      if (hash === "#projects") pageSEO = data.seo.projects;
      if (hash === "#about") pageSEO = data.seo.about;

      document.title = pageSEO.title || data.seo.home.title;
      
      // Update meta elements
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", pageSEO.description);

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", pageSEO.keywords);
    };

    window.addEventListener("hashchange", updateSEO);
    updateSEO(); // run once on load

    return () => window.removeEventListener("hashchange", updateSEO);
  }, [data]);

  const getAuthToken = (): string => {
    return localStorage.getItem("cms_auth_token") || "admin-session-granted";
  };

  const login = async (passcode: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      if (res.ok) {
        const body = await res.json();
        const token = body.token || btoa(passcode);
        setIsAdmin(true);
        localStorage.setItem("cms_admin_session", "true");
        localStorage.setItem("cms_auth_token", token);
        return true;
      }
    } catch (err) {
      console.warn("CMS Login: Server endpoint unavailable, verifying on client-side passcode.", err);
    }

    // Client-side fallback login check
    if (passcode === data.settings.passcode) {
      const token = btoa(passcode);
      setIsAdmin(true);
      localStorage.setItem("cms_admin_session", "true");
      localStorage.setItem("cms_auth_token", token);
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("cms_admin_session");
    localStorage.removeItem("cms_auth_token");
  };

  const updateData = async (
    updater: (prev: CMSSiteData) => CMSSiteData,
    action: string = "Modified Content",
    details: string = "Updated section or general settings"
  ): Promise<boolean> => {
    const updatedData = updater(data);

    // Append activity log
    const newLog: ActivityLog = {
      id: "log_" + Date.now(),
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    
    const finalData = {
      ...updatedData,
      activityLogs: [newLog, ...(updatedData.activityLogs || [])].slice(0, 100), // Keep last 100 logs
    };

    // Optimistically update frontend state
    setData(finalData);
    localStorage.setItem("cms_portfolio_data", JSON.stringify(finalData));

    try {
      const token = getAuthToken();
      const res = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(finalData),
      });
      return res.ok;
    } catch (err) {
      console.error("CMS: Failed to save to server, saved locally in cache instead.", err);
      return true; // Return true as it succeeded locally in browser
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = getAuthToken();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (res.ok) {
        const body = await res.json();
        return body.fileUrl; // e.g. /uploads/image.png
      }
    } catch (err) {
      console.error("CMS: Server upload failed, falling back to local base64 preview.", err);
    }

    // Fallback base64 conversion if backend is offline/unreachable
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const restoreBackup = async (backupData: CMSSiteData): Promise<boolean> => {
    return updateData(
      () => backupData,
      "Backup Restored",
      "Successfully restored a full JSON backup."
    );
  };

  return (
    <CMSContext.Provider
      value={{
        data,
        isLoading,
        isAdmin,
        login,
        logout,
        updateData,
        uploadFile,
        restoreBackup,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
}
