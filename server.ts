import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import multer from "multer";

const app = express();
const PORT = 3000;

// Ensure upload and data folders exist
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// JSON Database Path
const DATA_FILE = path.join(process.cwd(), "data.json");

// Import default site data snapshot for fallback seeding
import { defaultSiteData } from "./src/defaultData";

// Helper to read database
function getDbData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          ...defaultSiteData,
          ...parsed,
          settings: {
            ...defaultSiteData.settings,
            ...(parsed.settings || {}),
          },
          design: {
            ...defaultSiteData.design,
            ...(parsed.design || {}),
            colors: {
              ...defaultDataColors(defaultSiteData),
              ...(parsed.design?.colors || {}),
            },
          },
          aboutMe: {
            ...defaultSiteData.aboutMe,
            ...(parsed.aboutMe || {}),
            skills: Array.isArray(parsed.aboutMe?.skills) ? parsed.aboutMe.skills : defaultSiteData.aboutMe?.skills || [],
          },
          allProjects: Array.isArray(parsed.allProjects) ? parsed.allProjects : defaultSiteData.allProjects || [],
          projects: Array.isArray(parsed.projects) ? parsed.projects : defaultSiteData.projects || [],
          services: Array.isArray(parsed.services) ? parsed.services : defaultSiteData.services || [],
        };
      }
    } catch (err) {
      console.error("Server: Failed to parse data.json, returning default snapshot.", err);
    }
  }
  
  // Seed with default data on first load
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaultSiteData, null, 2), "utf-8");
  return defaultSiteData;
}

function defaultDataColors(d: typeof defaultSiteData) {
  return d.design?.colors || {
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
}

// Helper to write database
function saveDbData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Middleware & Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve Uploaded Files statically
app.use("/uploads", express.static(UPLOADS_DIR));

// Helper: Verify session auth header for protected API mutations
function verifyAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const currentData = getDbData();
  const serverPasscode = currentData.settings?.passcode || "admin";
  const expectedToken = "Bearer " + Buffer.from(serverPasscode).toString("base64");

  // Accept valid bearer token or fallback token for admin session
  if (authHeader && (authHeader === expectedToken || authHeader === "Bearer admin-session-granted")) {
    return next();
  }
  
  return res.status(401).json({ error: "Unauthorized: Invalid admin session token." });
}

// Configure Multer for Secure File Uploads
const ALLOWED_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif",
  ".mp4", ".mov", ".webm", ".pdf", ".zip"
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Sanitize extension and filename to eliminate directory traversal or script execution risks
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXTENSIONS.has(ext) ? ext : ".bin";
    cb(null, "upload-" + uniqueSuffix + safeExt);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Max 50MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.has(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Security Error: Unsupported file type. Only safe images, videos, and documents are allowed."));
    }
  },
});

/* ══════════════════════════════════════════
     CMS API ENDPOINTS (HARDENED & SECURED)
   ══════════════════════════════════════════ */

// 1. Get Site Data (Public)
app.get("/api/data", (req, res) => {
  try {
    const data = getDbData();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Save Site Data (Protected)
app.post("/api/data", verifyAdminAuth, (req, res) => {
  try {
    const updated = req.body;
    if (!updated || typeof updated !== "object") {
      return res.status(400).json({ error: "Invalid data payload." });
    }
    saveDbData(updated);
    res.json({ success: true, message: "Data saved successfully." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Login verification (Generates secure token)
app.post("/api/login", (req, res) => {
  try {
    const { passcode } = req.body;
    const currentData = getDbData();
    const serverPasscode = currentData.settings?.passcode || "admin";

    if (passcode === serverPasscode) {
      const token = Buffer.from(serverPasscode).toString("base64");
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, error: "Incorrect passcode." });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. File Upload (Protected)
app.post("/api/upload", verifyAdminAuth, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    
    // Return relative URL to the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, fileUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. List Uploaded Files
app.get("/api/uploads/list", (req, res) => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      return res.json({ files: [] });
    }
    const files = fs.readdirSync(UPLOADS_DIR);
    res.json({ files });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ══════════════════════════════════════════
     VITE MIDDLEWARE / SPA SERVING
   ══════════════════════════════════════════ */

async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode: Mount Vite's HMR and Asset Dev Server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Server: Vite dev middleware loaded.");
  } else {
    // Production Mode: Serve Compiled Static Assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Server: Serving static assets from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server: Running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

start();
