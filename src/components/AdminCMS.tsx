import { useState, useRef, useEffect } from "react";
import { useCMS } from "../context/CMSContext";
import { CMSSiteData, Project, ProjectDetail, Service, SkillItem, ActivityLog } from "../types/cms";
import { ImageFallback, fixAssetUrl, isVideoUrl, isYouTubeUrl, isVimeoUrl } from "./ImageFallback";
import {
  LayoutDashboard,
  Home as HomeIcon,
  Briefcase,
  User as UserIcon,
  Sliders,
  Settings,
  Mail,
  Menu as MenuIcon,
  FileText,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Upload,
  Eye,
  EyeOff,
  Save,
  Check,
  Search,
  ExternalLink,
  RotateCcw,
  BookOpen,
  LogOut,
  Sparkles,
  Palette,
  Image as ImageIcon,
  CheckSquare,
  AlertCircle,
  Edit2,
  Tag,
  FolderDown,
  Loader2,
  Move,
  ArrowRight,
  X,
  Scissors,
  ClipboardCopy,
  RefreshCw,
  Clipboard
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function CMSImageField({
  label,
  value,
  onChange,
  onUploadSuccess,
  recommendedText,
  gifMode,
  onToggleGifMode,
  onCopy,
  onCut,
  onPaste,
  imageClipboard,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onUploadSuccess?: (url: string) => void;
  recommendedText?: string;
  gifMode?: boolean;
  onToggleGifMode?: () => void;
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
  imageClipboard?: { imgUrl: string; mode: "copy" | "move"; gifMode?: boolean } | null;
}) {
  const { uploadFile } = useCMS();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  const processFile = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadFile(file);
      onChange(url);
      if (onUploadSuccess) onUploadSuccess(url);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    } else {
      const droppedUrl = e.dataTransfer.getData("text/plain");
      if (droppedUrl && droppedUrl.trim()) {
        onChange(droppedUrl.trim());
      }
    }
  };

  const handleSystemClipboardPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        onChange(text.trim());
        setCopiedNotice("Pasted from clipboard!");
        setTimeout(() => setCopiedNotice(null), 2000);
      }
    } catch {
      // Browser permission check fallback
    }
  };

  const isVideo = isVideoUrl(value);
  const isYT = isYouTubeUrl(value);
  const isVim = isVimeoUrl(value);
  const isGif = value?.toLowerCase().endsWith(".gif");
  const isPdf = value?.toLowerCase().includes(".pdf") || value?.startsWith("data:application/pdf");
  const isCopiedInClipboard = imageClipboard?.imgUrl === value && !!value;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col gap-2 p-3.5 rounded-xl text-left transition-all relative ${
        isDragging
          ? "bg-brand-green/10 border-2 border-dashed border-brand-green shadow-[0_0_15px_rgba(140,255,46,0.2)]"
          : "bg-neutral-900/60 border border-white/5 hover:border-white/10"
      }`}
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <label className="text-[10px] text-neutral-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
          {label}
          {isCopiedInClipboard && (
            <span className="px-1.5 py-0.2 rounded bg-brand-green/20 text-brand-green border border-brand-green/30 text-[8px] font-mono">
              IN CLIPBOARD
            </span>
          )}
        </label>

        <div className="flex items-center gap-1 flex-wrap">
          {/* GIF Mode Toggle Button */}
          {onToggleGifMode && (
            <button
              type="button"
              onClick={onToggleGifMode}
              className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded cursor-pointer transition-all flex items-center gap-1 border ${
                gifMode
                  ? "bg-brand-green text-brand-black border-brand-green"
                  : "bg-neutral-800 text-neutral-400 border-white/10 hover:text-white"
              }`}
              title="Toggle GIF Mode (Continuous Autoplay Muted Loop)"
            >
              <RefreshCw size={10} className={gifMode ? "animate-spin" : ""} />
              {gifMode ? "GIF MODE: ON" : "GIF MODE: OFF"}
            </button>
          )}

          {/* Copy Button */}
          {onCopy && value && (
            <button
              type="button"
              onClick={onCopy}
              className="px-1.5 py-0.5 text-[9px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold uppercase rounded cursor-pointer transition-all flex items-center gap-1 border border-white/10"
              title="Copy media path to clipboard"
            >
              <Copy size={10} />
              Copy
            </button>
          )}

          {/* Cut Button */}
          {onCut && value && (
            <button
              type="button"
              onClick={onCut}
              className="px-1.5 py-0.5 text-[9px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold uppercase rounded cursor-pointer transition-all flex items-center gap-1 border border-white/10"
              title="Cut media path to move elsewhere"
            >
              <Scissors size={10} />
              Cut
            </button>
          )}

          {/* Paste Clipboard Button */}
          {onPaste && imageClipboard && (
            <button
              type="button"
              onClick={onPaste}
              className="px-2 py-0.5 text-[9px] bg-brand-green/20 hover:bg-brand-green text-brand-green hover:text-brand-black font-extrabold uppercase rounded cursor-pointer transition-all flex items-center gap-1 border border-brand-green/40 animate-pulse"
              title={`Paste media: ${imageClipboard.imgUrl}`}
            >
              <ClipboardCopy size={10} />
              Paste Media
            </button>
          )}

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-2.5 py-1 text-[10px] bg-brand-green/20 hover:bg-brand-green text-brand-green hover:text-black font-bold uppercase rounded cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Upload size={12} />
            {uploading ? "Uploading..." : "Upload File"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,.mp4,.webm,.mov,.avi,.mkv,.gif,.jpg,.jpeg,.png,.svg,.webp,.pdf,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Input row */}
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Path, URL, YouTube/Vimeo link, or upload video/image..."
          className="flex-1 bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green font-mono"
        />

        {/* System Clipboard Quick Paste */}
        <button
          type="button"
          onClick={handleSystemClipboardPaste}
          className="p-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-brand-green border border-white/10 rounded-lg cursor-pointer transition-all shrink-0"
          title="Paste from system clipboard"
        >
          <Clipboard size={13} />
        </button>

        {/* Clear Field Button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-2 bg-neutral-950 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-white/10 rounded-lg cursor-pointer transition-all shrink-0"
            title="Clear field"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Recommended text & notice */}
      <div className="flex items-center justify-between gap-2">
        {copiedNotice ? (
          <span className="text-[9px] text-brand-green uppercase font-bold animate-fade-in">{copiedNotice}</span>
        ) : recommendedText ? (
          <span className="text-[9px] text-neutral-500 uppercase font-semibold">{recommendedText}</span>
        ) : (
          <span />
        )}
        <span className="text-[9px] text-brand-green/80 font-mono italic shrink-0">
          {isDragging ? "Drop media file here!" : "Drag & drop image or video"}
        </span>
      </div>

      {/* Live Preview Box */}
      {value ? (
        <div className="mt-1 bg-black/50 border border-white/10 rounded-lg p-2 flex items-center gap-3 relative overflow-hidden">
          <div className="w-20 h-14 rounded bg-neutral-950 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative">
            {isPdf ? (
              <FileText className="text-brand-green w-6 h-6" />
            ) : (
              <ImageFallback
                src={value}
                alt="Preview"
                gifMode={gifMode}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="overflow-hidden text-ellipsis flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              {isYT ? (
                <span className="px-1.5 py-0.2 rounded bg-red-600/30 text-red-400 border border-red-500/30 text-[8px] font-extrabold uppercase tracking-wider">
                  YouTube Video
                </span>
              ) : isVim ? (
                <span className="px-1.5 py-0.2 rounded bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 text-[8px] font-extrabold uppercase tracking-wider">
                  Vimeo Video
                </span>
              ) : isVideo ? (
                <span className="px-1.5 py-0.2 rounded bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[8px] font-extrabold uppercase tracking-wider">
                  MP4 / WebM Video
                </span>
              ) : isGif ? (
                <span className="px-1.5 py-0.2 rounded bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[8px] font-extrabold uppercase tracking-wider">
                  Animated GIF
                </span>
              ) : isPdf ? (
                <span className="px-1.5 py-0.2 rounded bg-brand-green/30 text-brand-green border border-brand-green/40 text-[8px] font-extrabold uppercase tracking-wider">
                  PDF Document
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-white/10 text-[8px] font-extrabold uppercase tracking-wider">
                  Image
                </span>
              )}

              {gifMode && (
                <span className="px-1.5 py-0.2 rounded bg-brand-green/20 text-brand-green border border-brand-green/40 text-[8px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <RefreshCw size={8} className="animate-spin" /> GIF Mode (Loop)
                </span>
              )}
            </div>

            <span className="text-[9px] text-neutral-400 block font-mono truncate">{value}</span>
          </div>
        </div>
      ) : (
        <div className="mt-1 bg-neutral-950/50 border border-dashed border-white/10 rounded-lg p-2.5 text-center">
          <span className="text-[9px] text-neutral-500 uppercase font-mono">
            {isDragging ? "Release to upload media file" : "No file set — Drag & drop image/video or paste URL"}
          </span>
        </div>
      )}
    </div>
  );
}

function parseAnyColorToHex(input: string): string | null {
  if (!input) return null;
  let str = input.trim();

  // 1. Standard hex (#FFF, #FFFFFF, FFF, FFFFFF)
  if (/^#?([0-9A-F]{3}){1,2}$/i.test(str)) {
    if (!str.startsWith("#")) str = "#" + str;
    if (str.length === 4) {
      return `#${str[1]}${str[1]}${str[2]}${str[2]}${str[3]}${str[3]}`.toUpperCase();
    }
    return str.toUpperCase();
  }

  // 2. rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = str.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    const r = Math.min(255, Math.max(0, parseInt(rgbMatch[1], 10))).toString(16).padStart(2, "0");
    const g = Math.min(255, Math.max(0, parseInt(rgbMatch[2], 10))).toString(16).padStart(2, "0");
    const b = Math.min(255, Math.max(0, parseInt(rgbMatch[3], 10))).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`.toUpperCase();
  }

  // 3. Plain comma-separated numbers e.g. "140, 255, 46"
  const plainRgbMatch = str.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/);
  if (plainRgbMatch) {
    const r = Math.min(255, Math.max(0, parseInt(plainRgbMatch[1], 10))).toString(16).padStart(2, "0");
    const g = Math.min(255, Math.max(0, parseInt(plainRgbMatch[2], 10))).toString(16).padStart(2, "0");
    const b = Math.min(255, Math.max(0, parseInt(plainRgbMatch[3], 10))).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`.toUpperCase();
  }

  // 4. Browser canvas parser for HSL or named colors
  try {
    const ctx = document.createElement("canvas").getContext("2d");
    if (ctx) {
      ctx.fillStyle = str;
      const computed = ctx.fillStyle;
      if (/^#([0-9A-F]{6})$/i.test(computed)) {
        return computed.toUpperCase();
      }
    }
  } catch (e) {
    // fallback
  }

  return null;
}

function HexColorPickerItem({
  label,
  arabicLabel,
  value,
  onChange,
  description,
}: {
  label: string;
  arabicLabel: string;
  value: string;
  onChange: (val: string) => void;
  description?: string;
}) {
  const parsedCurrent = parseAnyColorToHex(value) || "#000000";
  const [localInput, setLocalInput] = useState(parsedCurrent);

  useEffect(() => {
    setLocalInput(parsedCurrent);
  }, [parsedCurrent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalInput(raw);

    const parsedHex = parseAnyColorToHex(raw);
    if (parsedHex) {
      onChange(parsedHex);
    }
  };

  const handleBlur = () => {
    const parsedHex = parseAnyColorToHex(localInput);
    if (parsedHex) {
      setLocalInput(parsedHex);
      onChange(parsedHex);
    } else {
      setLocalInput(parsedCurrent);
    }
  };

  const handleSwatchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseVal = e.target.value.toUpperCase();
    setLocalInput(uppercaseVal);
    onChange(uppercaseVal);
  };

  return (
    <div className="bg-neutral-900/60 p-3.5 rounded-xl border border-white/5 flex flex-col justify-between gap-2.5 hover:border-brand-green/30 transition-all">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-wider">{label}</span>
          <span className="text-[10px] text-brand-green font-sans font-semibold dir-rtl text-right">{arabicLabel}</span>
        </div>
        {description && <span className="text-[9px] text-neutral-500 mt-0.5">{description}</span>}
      </div>

      <div className="flex items-center gap-2 bg-black/60 p-2 rounded-lg border border-white/10">
        <div className="relative w-7 h-7 rounded border border-white/20 overflow-hidden shrink-0 shadow-inner">
          <input
            type="color"
            value={parsedCurrent}
            onChange={handleSwatchChange}
            className="absolute -top-2 -left-2 w-12 h-12 rounded border-none bg-transparent cursor-pointer"
          />
        </div>

        <div className="flex-1 flex items-center gap-1 bg-neutral-950 px-2.5 py-1.5 rounded-md border border-white/10">
          <span className="text-xs font-mono text-neutral-500 font-bold select-none">#</span>
          <input
            type="text"
            value={localInput.startsWith("#") ? localInput.slice(1) : localInput}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="8CFF2E"
            className="w-full bg-transparent text-xs font-mono font-bold text-white uppercase focus:outline-none tracking-wider"
          />
        </div>
      </div>
    </div>
  );
}

function CMSSingleRowEditor({
  rowTitle,
  images,
  singleImageColumns,
  gifModes,
  allSections,
  currentSectionIdx,
  currentRowIdx,
  allTransferTargets,
  imageClipboard,
  onUpdateRowImages,
  onUpdateSingleImageColumns,
  onToggleGifMode,
  onTransferImage,
  onCopyImage,
  onPasteImage,
  onDeleteRow,
  onMoveRow,
  canDelete,
  canMoveUp,
  canMoveDown,
}: {
  rowTitle: string;
  images: string[];
  singleImageColumns?: number;
  gifModes?: Record<string, boolean>;
  allSections?: { sIdx: number; label: string }[];
  currentSectionIdx?: number;
  currentRowIdx?: number;
  allTransferTargets?: { secIdx: number; rowIdx: number; label: string }[];
  imageClipboard?: { imgUrl: string; mode: "copy" | "move"; sourceSecIdx: number; sourceRowIdx: number; sourceImgIdx: number } | null;
  onUpdateRowImages: (newImgs: string[]) => void;
  onUpdateSingleImageColumns?: (cols: number) => void;
  onToggleGifMode?: (imgUrl: string) => void;
  onTransferImage?: (imgIdx: number, targetSecIdx: number, targetRowIdx: number, mode: "copy" | "move") => void;
  onCopyImage?: (imgUrl: string, mode: "copy" | "move", sourceSecIdx: number, sourceRowIdx: number, sourceImgIdx: number) => void;
  onPasteImage?: (targetSecIdx: number, targetRowIdx: number) => void;
  onDeleteRow: () => void;
  onMoveRow?: (dir: "up" | "down") => void;
  canDelete?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}) {
  const { uploadFile } = useCMS();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pasteInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState({ current: 0, total: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [showRawText, setShowRawText] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState("");

  const processFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files).filter((f) =>
      f.type.startsWith("image/") ||
      f.type.startsWith("video/") ||
      f.name.match(/\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov|avi|mkv|ogv|flv|wmv|m4v)$/i)
    );
    if (fileList.length === 0) return;

    try {
      setUploading(true);
      setUploadCount({ current: 0, total: fileList.length });

      const uploadedUrls: string[] = [];
      for (let i = 0; i < fileList.length; i++) {
        setUploadCount({ current: i + 1, total: fileList.length });
        const url = await uploadFile(fileList[i]);
        uploadedUrls.push(url);
      }

      onUpdateRowImages([...images, ...uploadedUrls]);
    } catch (err) {
      console.error("Row upload error:", err);
    } finally {
      setUploading(false);
      setUploadCount({ current: 0, total: 0 });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const clipboardItems = e.clipboardData.items;
    const filesToProcess: File[] = [];

    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.type.startsWith("image/") || item.type.startsWith("video/")) {
        const f = item.getAsFile();
        if (f) filesToProcess.push(f);
      }
    }

    if (filesToProcess.length > 0) {
      e.preventDefault();
      await processFiles(filesToProcess);
      setCopiedNotification("Pasted image file(s) from clipboard!");
      setTimeout(() => setCopiedNotification(""), 3000);
      return;
    }

    const textData = e.clipboardData.getData("text");
    if (textData && textData.trim()) {
      const lines = textData
        .split(/[\s,\n]+/)
        .map((s) => s.trim())
        .filter((s) => s.startsWith("http") || s.includes("assets/") || s.startsWith("/"));
      if (lines.length > 0) {
        e.preventDefault();
        onUpdateRowImages([...images, ...lines]);
        setCopiedNotification(`Pasted ${lines.length} URL(s) from clipboard!`);
        setTimeout(() => setCopiedNotification(""), 3000);
      }
    }
  };

  const handlePasteButtonClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          const lines = text
            .split(/[\s,\n]+/)
            .map((s) => s.trim())
            .filter((s) => s.startsWith("http") || s.includes("assets/") || s.startsWith("/"));
          if (lines.length > 0) {
            onUpdateRowImages([...images, ...lines]);
            setCopiedNotification(`Pasted ${lines.length} URL(s) from clipboard!`);
            setTimeout(() => setCopiedNotification(""), 3000);
            return;
          }
        }
      }
    } catch (err) {
      console.log("Clipboard direct access restricted, focusing paste input...");
    }
    // Fallback: focus paste input
    if (pasteInputRef.current) {
      pasteInputRef.current.focus();
    }
  };

  const removeImage = (idx: number) => {
    const newImgs = images.filter((_, i) => i !== idx);
    onUpdateRowImages(newImgs);
  };

  const moveImage = (idx: number, direction: "left" | "right") => {
    const newImgs = [...images];
    const targetIdx = direction === "left" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newImgs.length) return;
    const temp = newImgs[idx];
    newImgs[idx] = newImgs[targetIdx];
    newImgs[targetIdx] = temp;
    onUpdateRowImages(newImgs);
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    onUpdateRowImages([...images, manualUrl.trim()]);
    setManualUrl("");
  };

  const calcPercentage = () => {
    if (images.length === 0) return "0%";
    return `${Math.round(100 / images.length)}% each`;
  };

  return (
    <div
      onPaste={handlePaste}
      tabIndex={0}
      className="p-4 bg-neutral-950/80 border border-white/10 rounded-xl flex flex-col gap-3 transition-all focus:border-brand-green/60 outline-none"
    >
      {/* Row Header Info & Controls */}
      <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono bg-white/5 px-2.5 py-1 rounded">
            {rowTitle}
          </span>
          <span className="text-[10px] text-brand-green font-mono font-bold bg-brand-green/10 px-2 py-0.5 rounded border border-brand-green/20">
            {images.length} Image{images.length === 1 ? "" : "s"} ({calcPercentage()})
          </span>
          {copiedNotification && (
            <span className="text-[10px] text-brand-green font-bold animate-pulse">
              ✓ {copiedNotification}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onMoveRow && canMoveUp && (
            <button
              type="button"
              onClick={() => onMoveRow("up")}
              className="p-1 bg-neutral-900 border border-white/10 hover:border-brand-green text-white hover:text-brand-green rounded cursor-pointer"
              title="Move Row Up"
            >
              <ArrowUp size={13} />
            </button>
          )}
          {onMoveRow && canMoveDown && (
            <button
              type="button"
              onClick={() => onMoveRow("down")}
              className="p-1 bg-neutral-900 border border-white/10 hover:border-brand-green text-white hover:text-brand-green rounded cursor-pointer"
              title="Move Row Down"
            >
              <ArrowDown size={13} />
            </button>
          )}
          {canDelete !== false && (
            <button
              type="button"
              onClick={onDeleteRow}
              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold uppercase ml-2"
              title="Delete this row"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Remove Row</span>
            </button>
          )}
        </div>
      </div>

      {/* Drag & Drop Upload + Paste Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-3.5 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 text-center relative ${
          isDragging
            ? "bg-brand-green/15 border-brand-green shadow-[0_0_20px_rgba(140,255,46,0.25)]"
            : "bg-neutral-900/60 border-white/10 hover:border-white/20"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-green/20 border border-brand-green/30 flex items-center justify-center text-brand-green shrink-0">
            <Upload size={14} />
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {isDragging ? "Drop image or video file(s) into this row!" : "Drag & Drop Images/Videos, Click Upload, or Copy & Paste (Ctrl+V)"}
          </span>
        </div>

        <p className="text-[10px] text-neutral-400">
          Upload image/video files directly or paste video & image URLs (YouTube, Vimeo, MP4, WebM, etc.).
        </p>

        <div className="flex items-center gap-2 flex-wrap justify-center mt-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3.5 py-1.5 bg-brand-green hover:bg-brand-green/90 text-neutral-950 font-bold text-xs uppercase rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-md"
          >
            <Upload size={13} />
            {uploading
              ? `Uploading (${uploadCount.current}/${uploadCount.total})...`
              : "Upload Image / Video File(s)"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.mp4,.webm,.mov,.avi,.mkv,.ogv,.flv,.wmv,.m4v,.svg,.webp,.gif,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />

          {imageClipboard && onPasteImage && (
            <button
              type="button"
              onClick={() => onPasteImage(currentSectionIdx ?? 0, currentRowIdx ?? 0)}
              className="px-3.5 py-1.5 bg-brand-green hover:bg-brand-green/90 text-neutral-950 font-black text-xs uppercase rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-lg shadow-brand-green/20 animate-pulse border-2 border-white/20"
              title="Paste image/media currently copied in clipboard into this row"
            >
              <ClipboardCopy size={14} />
              Paste Media Here
            </button>
          )}

          <button
            type="button"
            onClick={handlePasteButtonClick}
            className="px-3 py-1.5 bg-neutral-900 border border-white/10 hover:border-brand-green text-brand-green font-bold text-xs uppercase rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
            title="Paste from clipboard or focus to press Ctrl+V"
          >
            <Copy size={13} />
            Paste (Ctrl+V)
          </button>

          <input
            ref={pasteInputRef}
            type="text"
            onPaste={handlePaste}
            placeholder="Click & press Ctrl+V to paste here"
            className="w-44 bg-neutral-950 border border-white/10 rounded px-2 py-1 text-[10px] text-neutral-300 font-mono focus:outline-none focus:border-brand-green placeholder:text-neutral-600"
          />

          <button
            type="button"
            onClick={() => setShowRawText(!showRawText)}
            className="px-2.5 py-1.5 bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white font-bold text-[9px] uppercase rounded-lg cursor-pointer transition-all"
          >
            {showRawText ? "Hide URLs" : "Bulk Edit URLs"}
          </button>
        </div>
      </div>

      {/* Manual URL input bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddManualUrl();
            }
          }}
          placeholder="Paste image or video URL (YouTube, Vimeo, MP4, WebM, PNG, etc.)"
          className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-green font-mono"
        />
        <button
          type="button"
          onClick={handleAddManualUrl}
          className="px-3.5 py-1.5 bg-brand-green hover:bg-brand-green/90 text-neutral-950 font-bold text-xs rounded-lg cursor-pointer transition-all shrink-0 flex items-center gap-1.5 shadow-md uppercase"
        >
          <Plus size={14} />
          Add Link / Video
        </button>
      </div>

      {/* Raw Textarea fallback */}
      {showRawText && (
        <div className="flex flex-col gap-1.5 animate-fade-in">
          <label className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
            Row Raw Comma-Separated Image URLs
          </label>
          <textarea
            rows={2}
            value={images.join(", ")}
            onChange={(e) => {
              const imagesArr = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
              onUpdateRowImages(imagesArr);
            }}
            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-brand-green"
          />
        </div>
      )}

      {/* COLUMN WIDTH / IMAGE SIZE CONTROL (Available for 1 or multiple images) */}
      {onUpdateSingleImageColumns && (
        <div className="flex items-center gap-2.5 bg-brand-green/10 border border-brand-green/30 p-2.5 rounded-xl my-1 text-xs flex-wrap sm:flex-nowrap">
          <span className="text-brand-green font-bold uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1">
            📐 Row Width Scale / Division:
          </span>
          <select
            value={singleImageColumns || 1}
            onChange={(e) => onUpdateSingleImageColumns(Number(e.target.value))}
            className="bg-neutral-900 border border-white/20 text-white rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer focus:outline-none focus:border-brand-green"
          >
            <option value={1}>1 Column (100% Full Width)</option>
            <option value={2}>2 Columns (50% Half Scale)</option>
            <option value={3}>3 Columns (33.3% One-Third Scale)</option>
            <option value={4}>4 Columns (25% One-Fourth Scale)</option>
            <option value={5}>5 Columns (20% One-Fifth Scale)</option>
            <option value={6}>6 Columns (16.6% One-Sixth Scale)</option>
          </select>
          <span className="text-[10px] text-neutral-400">
            (Scales row width as if divided into {singleImageColumns || 1} columns, keeping images horizontal)
          </span>
        </div>
      )}

      {/* Row Live Image Thumbnails Preview */}
      {images.length > 0 && (
        <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between">
            <label className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
              Row Layout Preview ({images.length} item{images.length === 1 ? "" : "s"} - Equal {calcPercentage()})
            </label>
            <button
              type="button"
              onClick={() => onUpdateRowImages([])}
              className="text-[9px] text-red-400 hover:text-red-300 font-bold uppercase"
            >
              Clear Row Images
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
            {images.map((imgUrl, imgIdx) => (
              <div
                key={imgIdx}
                className={`group relative aspect-video bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center transition-all ${
                  imageClipboard && imageClipboard.imgUrl === imgUrl
                    ? imageClipboard.mode === "copy"
                      ? "border-2 border-brand-green shadow-lg shadow-brand-green/20 ring-2 ring-brand-green/50"
                      : "border-2 border-purple-500 shadow-lg shadow-purple-500/20 ring-2 ring-purple-500/50 opacity-80"
                    : "border border-white/10"
                }`}
              >
                {imageClipboard && imageClipboard.imgUrl === imgUrl && (
                  <div
                    className={`absolute top-1 right-1 px-1.5 py-0.5 text-[8px] font-extrabold rounded uppercase shadow-md z-10 flex items-center gap-0.5 ${
                      imageClipboard.mode === "copy"
                        ? "bg-brand-green text-black"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    {imageClipboard.mode === "copy" ? "COPIED" : "CUT"}
                  </div>
                )}
                <ImageFallback
                  src={imgUrl}
                  alt={`Row item ${imgIdx + 1}`}
                  gifMode={Boolean(gifModes?.[imgUrl])}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />

                <div className="absolute top-1 left-1 px-1 py-0.2 bg-black/80 text-brand-green text-[8px] font-mono font-bold rounded border border-brand-green/30">
                  #{imgIdx + 1}
                </div>

                {gifModes?.[imgUrl] && (
                  <div className="absolute bottom-1 right-1 px-1 py-0.2 bg-brand-green text-black text-[7px] font-extrabold uppercase rounded shadow z-10">
                    GIF MODE
                  </div>
                )}

                <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1 text-center">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={imgIdx === 0}
                      onClick={() => moveImage(imgIdx, "left")}
                      className="p-1 bg-neutral-900 border border-white/20 hover:border-brand-green text-white hover:text-brand-green rounded disabled:opacity-20 cursor-pointer"
                      title="Move Left"
                    >
                      <ArrowUp size={11} className="-rotate-90" />
                    </button>
                    <button
                      type="button"
                      disabled={imgIdx === images.length - 1}
                      onClick={() => moveImage(imgIdx, "right")}
                      className="p-1 bg-neutral-900 border border-white/20 hover:border-brand-green text-white hover:text-brand-green rounded disabled:opacity-20 cursor-pointer"
                      title="Move Right"
                    >
                      <ArrowDown size={11} className="-rotate-90" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(imgIdx)}
                      className="p-1 bg-red-500/20 border border-red-500/40 hover:bg-red-500 text-red-400 hover:text-black rounded cursor-pointer transition-all"
                      title="Delete Image"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>

                  {/* Toggle GIF Mode Button */}
                  {onToggleGifMode && (
                    <button
                      type="button"
                      onClick={() => onToggleGifMode(imgUrl)}
                      className={`w-full py-1 px-1 text-[7.5px] font-bold uppercase rounded flex items-center justify-center gap-1 transition-all cursor-pointer border mt-0.5 ${
                        gifModes?.[imgUrl]
                          ? "bg-brand-green text-black border-brand-green font-extrabold shadow-sm"
                          : "bg-black/80 text-neutral-300 border-white/20 hover:border-brand-green hover:text-white"
                      }`}
                      title="Display as Animated GIF (Muted Autoplay Loop)"
                    >
                      {gifModes?.[imgUrl] ? "✓ GIF Mode Active" : "Display as Animated GIF"}
                    </button>
                  )}

                  {/* Quick Copy / Move Buttons for Clipboard Transfer */}
                  {onCopyImage && (
                    <div className="flex items-center gap-1 w-full mt-1">
                      <button
                        type="button"
                        onClick={() => onCopyImage(imgUrl, "copy", currentSectionIdx ?? 0, currentRowIdx ?? 0, imgIdx)}
                        className="flex-1 py-1 px-1 bg-brand-green/20 border border-brand-green/40 hover:bg-brand-green hover:text-black text-brand-green text-[8px] font-bold uppercase rounded flex items-center justify-center gap-0.5 transition-all cursor-pointer shadow"
                        title="Copy image to clipboard"
                      >
                        <Copy size={9} /> Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => onCopyImage(imgUrl, "move", currentSectionIdx ?? 0, currentRowIdx ?? 0, imgIdx)}
                        className="flex-1 py-1 px-1 bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500 hover:text-white text-purple-300 text-[8px] font-bold uppercase rounded flex items-center justify-center gap-0.5 transition-all cursor-pointer shadow"
                        title="Cut / Move image"
                      >
                        <Scissors size={9} /> Move
                      </button>
                    </div>
                  )}

                  <span className="text-[7px] text-neutral-400 font-mono truncate max-w-full px-1 mt-0.5">
                    {imgUrl.split("/").pop()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CMSGallerySectionEditor({
  sec,
  sIdx,
  canMoveUp,
  canMoveDown,
  onMoveSec,
  allSections,
  allTransferTargets,
  imageClipboard,
  onUpdateSec,
  onRemoveSec,
  onTransferImageAcrossSections,
  onCopyImage,
  onPasteImage,
}: {
  sec: { type: "grid" | "row"; label: string; images: string[]; gifModes?: Record<string, boolean>; rows?: { id?: string; images: string[]; singleImageColumns?: number; gifModes?: Record<string, boolean> }[] };
  sIdx: number;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveSec?: (direction: "up" | "down") => void;
  allSections?: { sIdx: number; label: string }[];
  allTransferTargets?: { secIdx: number; rowIdx: number; label: string }[];
  imageClipboard?: { imgUrl: string; mode: "copy" | "move"; sourceSecIdx: number; sourceRowIdx: number; sourceImgIdx: number } | null;
  onUpdateSec: (updated: { type: "grid" | "row"; label: string; images: string[]; gifModes?: Record<string, boolean>; rows?: { id?: string; images: string[]; singleImageColumns?: number; gifModes?: Record<string, boolean> }[] }) => void;
  onRemoveSec: () => void;
  onTransferImageAcrossSections?: (sourceSecIdx: number, sourceRowIdx: number, imgIdx: number, targetSecIdx: number, targetRowIdx: number, mode: "copy" | "move") => void;
  onCopyImage?: (imgUrl: string, mode: "copy" | "move", sourceSecIdx: number, sourceRowIdx: number, sourceImgIdx: number) => void;
  onPasteImage?: (targetSecIdx: number, targetRowIdx: number) => void;
}) {
  // Ensure rows array exists for grid type sections
  const rows: { id?: string; images: string[]; singleImageColumns?: number; gifModes?: Record<string, boolean> }[] =
    sec.rows && sec.rows.length > 0
      ? sec.rows
      : [{ id: "row-1", images: sec.images || [], gifModes: sec.gifModes }];

  const handleUpdateRowImages = (rIdx: number, newImgs: string[]) => {
    const updatedRows = [...rows];
    updatedRows[rIdx] = { ...updatedRows[rIdx], images: newImgs };
    const allFlatImages = updatedRows.flatMap((r) => r.images);
    onUpdateSec({
      ...sec,
      rows: updatedRows,
      images: allFlatImages,
    });
  };

  const handleToggleRowGifMode = (rIdx: number, imgUrl: string) => {
    const updatedRows = [...rows];
    const currentModes = updatedRows[rIdx].gifModes || {};
    const isCurrentlyGif = Boolean(currentModes[imgUrl]);
    const newModes = { ...currentModes, [imgUrl]: !isCurrentlyGif };
    updatedRows[rIdx] = { ...updatedRows[rIdx], gifModes: newModes };
    onUpdateSec({
      ...sec,
      rows: updatedRows,
      images: updatedRows.flatMap((r) => r.images),
    });
  };

  const handleToggleSectionGifMode = (imgUrl: string) => {
    const currentModes = sec.gifModes || {};
    const isCurrentlyGif = Boolean(currentModes[imgUrl]);
    const newModes = { ...currentModes, [imgUrl]: !isCurrentlyGif };
    onUpdateSec({
      ...sec,
      gifModes: newModes,
    });
  };

  const handleUpdateRowSingleImageColumns = (rIdx: number, cols: number) => {
    const updatedRows = [...rows];
    updatedRows[rIdx] = { ...updatedRows[rIdx], singleImageColumns: cols };
    onUpdateSec({
      ...sec,
      rows: updatedRows,
      images: updatedRows.flatMap((r) => r.images),
    });
  };

  const handleAddRow = () => {
    const updatedRows = [...rows, { id: `row-${Date.now()}`, images: [] }];
    onUpdateSec({
      ...sec,
      rows: updatedRows,
      images: updatedRows.flatMap((r) => r.images),
    });
  };

  const handleRemoveRow = (rIdx: number) => {
    const updatedRows = rows.filter((_, idx) => idx !== rIdx);
    const finalRows = updatedRows.length > 0 ? updatedRows : [{ id: `row-${Date.now()}`, images: [] }];
    onUpdateSec({
      ...sec,
      rows: finalRows,
      images: finalRows.flatMap((r) => r.images),
    });
  };

  const handleMoveRow = (rIdx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? rIdx - 1 : rIdx + 1;
    if (targetIdx < 0 || targetIdx >= rows.length) return;
    const updatedRows = [...rows];
    const temp = updatedRows[rIdx];
    updatedRows[rIdx] = updatedRows[targetIdx];
    updatedRows[targetIdx] = temp;
    onUpdateSec({
      ...sec,
      rows: updatedRows,
      images: updatedRows.flatMap((r) => r.images),
    });
  };

  return (
    <div className="p-4 bg-neutral-900/90 border border-white/10 rounded-2xl flex flex-col gap-4 shadow-xl">
      {/* Header controls: Label, Type, Delete */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/5 pb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            value={sec.label}
            onChange={(e) => onUpdateSec({ ...sec, label: e.target.value.toUpperCase() })}
            placeholder="SECTION LABEL (E.G. STORYBOARD)"
            className="bg-neutral-950 border border-white/10 rounded px-3 py-1.5 text-xs font-bold text-white uppercase focus:outline-none focus:border-brand-green tracking-wider"
          />
          <select
            value={sec.type}
            onChange={(e) => onUpdateSec({ ...sec, type: e.target.value as any })}
            className="bg-neutral-950 border border-white/10 rounded px-3 py-1.5 text-[11px] font-bold text-neutral-300 cursor-pointer focus:outline-none focus:border-brand-green"
          >
            <option value="grid">Grid (Multi-Row / Responsive Columns)</option>
            <option value="row">Row (Full Widescreen 16:9 Layout)</option>
          </select>
          <span className="text-[10px] text-brand-green font-mono font-bold bg-brand-green/10 px-2.5 py-1 rounded border border-brand-green/20">
            {sec.images.length} Total Image{sec.images.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onMoveSec && canMoveUp && (
            <button
              type="button"
              onClick={() => onMoveSec("up")}
              className="p-1.5 bg-neutral-950 border border-white/10 hover:border-brand-green text-white hover:text-brand-green rounded cursor-pointer flex items-center gap-1 text-[11px] font-bold uppercase"
              title="Move Section / Gallery Up"
            >
              <ArrowUp size={14} />
              <span className="hidden sm:inline">Move Up</span>
            </button>
          )}
          {onMoveSec && canMoveDown && (
            <button
              type="button"
              onClick={() => onMoveSec("down")}
              className="p-1.5 bg-neutral-950 border border-white/10 hover:border-brand-green text-white hover:text-brand-green rounded cursor-pointer flex items-center gap-1 text-[11px] font-bold uppercase"
              title="Move Section / Gallery Down"
            >
              <ArrowDown size={14} />
              <span className="hidden sm:inline">Move Down</span>
            </button>
          )}
          <button
            type="button"
            onClick={onRemoveSec}
            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold uppercase"
            title="Remove section"
          >
            <Trash2 size={14} />
            <span>Delete Section</span>
          </button>
        </div>
      </div>

      {sec.type === "grid" ? (
        /* GRID MODE: MULTI-ROW EDITOR WITH ADD ROW BUTTON */
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Grid Image Rows ({rows.length} Row{rows.length === 1 ? "" : "s"})
              </span>
              <span className="text-[10px] text-neutral-400">
                (Images inside each row auto-resize equally to leave room for new images!)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {imageClipboard && onPasteImage && (
                <button
                  type="button"
                  onClick={() => onPasteImage(sIdx, -1)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-lg animate-pulse"
                  title="Create a new row and paste copied image into it"
                >
                  <ClipboardCopy size={15} />
                  + Paste into New Row
                </button>
              )}

              <button
                type="button"
                onClick={handleAddRow}
                className="px-3.5 py-2 bg-brand-green hover:bg-brand-green/90 text-neutral-950 font-bold text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-lg"
              >
                <Plus size={15} />
                + Add New Row to Grid
              </button>
            </div>
          </div>

          {/* List of Rows */}
          <div className="flex flex-col gap-3">
            {rows.map((rowItem, rIdx) => (
              <CMSSingleRowEditor
                key={rowItem.id || rIdx}
                rowTitle={`ROW #${rIdx + 1}`}
                images={rowItem.images}
                singleImageColumns={rowItem.singleImageColumns}
                gifModes={rowItem.gifModes}
                allSections={allSections}
                allTransferTargets={allTransferTargets}
                imageClipboard={imageClipboard}
                currentSectionIdx={sIdx}
                currentRowIdx={rIdx}
                onUpdateRowImages={(newImgs) => handleUpdateRowImages(rIdx, newImgs)}
                onUpdateSingleImageColumns={(cols) => handleUpdateRowSingleImageColumns(rIdx, cols)}
                onToggleGifMode={(imgUrl) => handleToggleRowGifMode(rIdx, imgUrl)}
                onTransferImage={(imgIdx, targetSecIdx, targetRowIdx, mode) => {
                  if (onTransferImageAcrossSections) {
                    onTransferImageAcrossSections(sIdx, rIdx, imgIdx, targetSecIdx, targetRowIdx, mode);
                  }
                }}
                onCopyImage={onCopyImage}
                onPasteImage={onPasteImage}
                onDeleteRow={() => handleRemoveRow(rIdx)}
                onMoveRow={(dir) => handleMoveRow(rIdx, dir)}
                canDelete={rows.length > 1 || rowItem.images.length > 0}
                canMoveUp={rIdx > 0}
                canMoveDown={rIdx < rows.length - 1}
              />
            ))}
          </div>
        </div>
      ) : (
        /* SINGLE WIDESCREEN ROW MODE */
        <CMSSingleRowEditor
          rowTitle="WIDESCREEN ROW"
          images={sec.images}
          gifModes={sec.gifModes}
          allSections={allSections}
          allTransferTargets={allTransferTargets}
          imageClipboard={imageClipboard}
          currentSectionIdx={sIdx}
          currentRowIdx={0}
          onUpdateRowImages={(newImgs) => onUpdateSec({ ...sec, images: newImgs })}
          onToggleGifMode={handleToggleSectionGifMode}
          onTransferImage={(imgIdx, targetSecIdx, targetRowIdx, mode) => {
            if (onTransferImageAcrossSections) {
              onTransferImageAcrossSections(sIdx, 0, imgIdx, targetSecIdx, targetRowIdx, mode);
            }
          }}
          onCopyImage={onCopyImage}
          onPasteImage={onPasteImage}
          onDeleteRow={onRemoveSec}
          canDelete={false}
        />
      )}
    </div>
  );
}

export function AdminCMS() {
  const { data, updateData, uploadFile, restoreBackup, resetToDefaultData, clearAllSiteStorage, logout } = useCMS();
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "home"
    | "projects"
    | "about"
    | "services"
    | "contact"
    | "nav-footer"
    | "design"
    | "media"
    | "docs"
  >("dashboard");

  // Local Notifications state
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // ══════════════════════════════════════════
  // MEDIA LIBRARY UPLOAD / STATE
  // ══════════════════════════════════════════
  const [mediaSearch, setMediaSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const buildAssetMapping = (siteData: CMSSiteData) => {
    const assetMap = new Map<string, { pathInZip: string; cleanPathInTs: string }>();
    let count = 1;

    const scan = (obj: any) => {
      if (!obj) return;
      if (typeof obj === "string") {
        const str = obj.trim();
        if (
          str.startsWith("data:image/") ||
          str.startsWith("data:video/") ||
          str.includes("/uploads/") ||
          str.startsWith("uploads/")
        ) {
          if (!assetMap.has(str)) {
            let fileName = "";
            if (str.startsWith("data:")) {
              const mimeMatch = str.match(/data:(?:image|video)\/([a-zA-Z0-9+-]+);/);
              let ext = mimeMatch ? (mimeMatch[1] === "svg+xml" ? "svg" : mimeMatch[1]) : "png";
              if (ext === "jpeg") ext = "jpg";
              fileName = `uploaded_asset_${count}.${ext}`;
              count++;
            } else {
              fileName = str.split("/").pop() || `uploaded_asset_${count}.png`;
              count++;
            }
            const cleanPathInTs = `src/assets/images/${fileName}`;
            const pathInZip = `src/assets/images/${fileName}`;
            assetMap.set(str, { pathInZip, cleanPathInTs });
          }
        }
      } else if (Array.isArray(obj)) {
        obj.forEach(scan);
      } else if (typeof obj === "object") {
        Object.keys(obj).forEach((key) => {
          if (key === "activityLogs") return;
          scan(obj[key]);
        });
      }
    };

    scan(siteData);
    return assetMap;
  };

  // We can scan siteData to discover what images/thumbnails currently exist on the site
  // and dynamically construct the media library gallery, plus add new uploaded files.
  const getDiscoveredMedia = () => {
    const mediaSet = new Set<string>();
    
    // Add default images
    mediaSet.add("/src/assets/images/MyPicture.jpg");
    mediaSet.add("/src/assets/images/HeroImage.svg");
    mediaSet.add("/src/assets/images/showreel-Thumbnail.png");

    // Add projects images
    (data?.projects || []).forEach((p) => {
      if (p?.thumbnail) mediaSet.add(p.thumbnail);
    });
    (data?.allProjects || []).forEach((p) => {
      if (p?.thumbnail) mediaSet.add(p.thumbnail);
    });
    (data?.projectDetails || []).forEach((d) => {
      if (d?.heroImage) mediaSet.add(d.heroImage);
      (d?.sections || []).forEach((s) => {
        (s?.images || []).forEach((img) => mediaSet.add(img));
      });
    });

    // Add any dynamic uploaded files directly present in site data
    const assetMap = buildAssetMapping(data);
    for (const [url] of assetMap.entries()) {
      mediaSet.add(url);
    }

    return Array.from(mediaSet);
  };

  const [discoveredMedia, setDiscoveredMedia] = useState<string[]>(getDiscoveredMedia());

  const handleMediaUpload = async (file: File) => {
    try {
      showNotification("Uploading media file...", "info");
      const fileUrl = await uploadFile(file);
      setDiscoveredMedia((prev) => [fileUrl, ...prev]);
      
      // Log upload action
      await updateData(
        (prev) => prev,
        "Media Uploaded",
        `Uploaded physical file ${file.name} directly to server static URL: ${fileUrl}`
      );
      
      showNotification("Uploaded successfully!", "success");
    } catch (err) {
      showNotification("Failed to upload file.", "error");
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const onDragLeave = () => {
    setIsDraggingFile(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleMediaUpload(e.dataTransfer.files[0]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification("Copied path to clipboard!", "success");
  };

  // ══════════════════════════════════════════
  // PROJECTS STATE / MANAGEMENT
  // ══════════════════════════════════════════
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectEditForm, setProjectEditForm] = useState<Partial<Project & ProjectDetail> | null>(null);
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);

  // IMAGE COPY / MOVE CLIPBOARD STATE
  const [imageClipboard, setImageClipboard] = useState<{
    imgUrl: string;
    mode: "copy" | "move";
    gifMode?: boolean;
    sourceSecIdx: number;
    sourceRowIdx: number;
    sourceImgIdx: number;
  } | null>(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryOldName, setEditingCategoryOldName] = useState<string | null>(null);
  const [editingCategoryNewName, setEditingCategoryNewName] = useState("");
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const trimmed = newCategoryName.trim();
    const currentCategories = data.projectCategories && data.projectCategories.length > 0
      ? data.projectCategories
      : ["Explainer", "Brand", "Broadcast", "UI Motion", "Event", "Showreel"];

    if (currentCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showNotification("This category already exists", "error");
      return;
    }

    updateData((prev) => {
      const prevCats = prev.projectCategories && prev.projectCategories.length > 0
        ? prev.projectCategories
        : ["Explainer", "Brand", "Broadcast", "UI Motion", "Event", "Showreel"];
      return {
        ...prev,
        projectCategories: [...prevCats, trimmed],
      };
    }, "Added project category: " + trimmed);

    setNewCategoryName("");
    showNotification(`Category "${trimmed}" added successfully!`, "success");
  };

  const handleRenameCategory = (oldName: string, newName: string) => {
    const trimmedNew = newName.trim();
    if (!trimmedNew || trimmedNew === oldName) {
      setEditingCategoryOldName(null);
      return;
    }

    updateData((prev) => {
      const prevCats = prev.projectCategories && prev.projectCategories.length > 0
        ? prev.projectCategories
        : ["Explainer", "Brand", "Broadcast", "UI Motion", "Event", "Showreel"];

      const updatedCats = prevCats.map((c) => (c === oldName ? trimmedNew : c));

      const updateProjectTags = (p: any) => {
        let updatedCatsArr = p.categories && Array.isArray(p.categories)
          ? p.categories.map((cat: string) => (cat === oldName ? trimmedNew : cat))
          : p.category
          ? p.category
              .split(",")
              .map((s: string) => s.trim())
              .map((cat: string) => (cat === oldName ? trimmedNew : cat))
          : [];
        return {
          ...p,
          categories: updatedCatsArr,
          category: updatedCatsArr.join(", "),
        };
      };

      const updatedAllProjects = (prev.allProjects || []).map(updateProjectTags);
      const updatedProjects = (prev.projects || []).map(updateProjectTags);
      const updatedProjectDetails = (prev.projectDetails || []).map(updateProjectTags);

      return {
        ...prev,
        projectCategories: updatedCats,
        allProjects: updatedAllProjects,
        projects: updatedProjects,
        projectDetails: updatedProjectDetails,
      };
    }, `Renamed category "${oldName}" to "${trimmedNew}"`);

    setEditingCategoryOldName(null);
    showNotification(`Renamed "${oldName}" to "${trimmedNew}" everywhere!`, "success");
  };

  const handleDeleteCategory = (catToDelete: string) => {
    updateData((prev) => {
      const prevCats = prev.projectCategories && prev.projectCategories.length > 0
        ? prev.projectCategories
        : ["Explainer", "Brand", "Broadcast", "UI Motion", "Event", "Showreel"];
      return {
        ...prev,
        projectCategories: prevCats.filter((c) => c !== catToDelete),
      };
    }, "Deleted project category: " + catToDelete);

    showNotification(`Category "${catToDelete}" removed.`, "success");
  };

  const startEditProject = (id: number) => {
    const briefProj = data.allProjects.find((p) => p.id === id);
    const detailProj = data.projectDetails.find((p) => p.id === id);
    if (briefProj) {
      const initialCategories = briefProj.categories || detailProj?.categories || 
        (briefProj.category ? briefProj.category.split(",").map((s) => s.trim()).filter(Boolean) : ["Explainer"]);

      const initialCustomFields = detailProj?.customFields && detailProj.customFields.length > 0
        ? detailProj.customFields
        : [
            { id: "field-role", label: "ROLE", value: detailProj?.role || (briefProj as any)?.role || "STORYBOARD & ANIMATION" },
            { id: "field-client", label: "CLIENT BRAND NAME", value: detailProj?.client || (briefProj as any)?.client || "CLIENT" },
          ];

      setProjectEditForm({
        ...briefProj,
        ...detailProj,
        categories: initialCategories,
        videoUrl: detailProj?.videoUrl || "",
        shortDescription: detailProj?.shortDescription || (briefProj as any).description || "",
        customFields: initialCustomFields,
        gifModes: detailProj?.gifModes || (briefProj as any)?.gifModes || {},
      });
      setSelectedProjectId(id);
      setIsCreatingNewProject(false);
    }
  };

  const startCreateProject = () => {
    const newId = Math.max(...(data?.allProjects || []).map((p) => p.id), 0) + 1;
    const defaultCat = (data.projectCategories && data.projectCategories.length > 0)
      ? data.projectCategories[0]
      : "Explainer";
    setProjectEditForm({
      id: newId,
      title: "New Custom Motion Project",
      category: defaultCat,
      categories: [defaultCat],
      description: "Short catalog description.",
      shortDescription: "Short detail description next to video header.",
      videoUrl: "",
      thumbnail: "/src/assets/images/showreel-Thumbnail.png",
      heroImage: "/src/assets/images/showreel-Thumbnail.png",
      link: "#",
      role: "STORYBOARD & ANIMATION",
      client: "SELF WORK",
      isPublished: true,
      isFeatured: false,
      customFields: [
        { id: "field-role", label: "ROLE", value: "STORYBOARD & ANIMATION" },
        { id: "field-client", label: "CLIENT BRAND NAME", value: "SELF WORK" },
      ],
      sections: [],
    } as any);
    setSelectedProjectId(null);
    setIsCreatingNewProject(true);
  };

  const handleTransferImageAcrossSections = (
    sourceSecIdx: number,
    sourceRowIdx: number,
    imgIdx: number,
    targetSecIdx: number,
    targetRowIdx: number,
    mode: "copy" | "move"
  ) => {
    if (!projectEditForm || !projectEditForm.sections) return;
    const secs = JSON.parse(JSON.stringify(projectEditForm.sections));
    const sourceSec = secs[sourceSecIdx];
    const targetSec = secs[targetSecIdx];
    if (!sourceSec || !targetSec) return;

    let imgUrl = "";
    if (sourceSec.type === "grid" && sourceSec.rows && sourceSec.rows[sourceRowIdx]) {
      imgUrl = sourceSec.rows[sourceRowIdx].images[imgIdx];
      if (mode === "move") {
        sourceSec.rows[sourceRowIdx].images.splice(imgIdx, 1);
        sourceSec.images = sourceSec.rows.flatMap((r: any) => r.images);
      }
    } else if (sourceSec.images && sourceSec.images[imgIdx]) {
      imgUrl = sourceSec.images[imgIdx];
      if (mode === "move") {
        sourceSec.images.splice(imgIdx, 1);
      }
    }

    if (!imgUrl) return;

    if (targetSec.type === "grid") {
      if (!targetSec.rows) targetSec.rows = [];
      if (targetRowIdx === -1 || targetSec.rows.length === 0) {
        targetSec.rows.push({ id: `row-${Date.now()}`, images: [imgUrl] });
      } else {
        const actualRowIdx = Math.min(targetRowIdx, targetSec.rows.length - 1);
        if (!targetSec.rows[actualRowIdx].images) targetSec.rows[actualRowIdx].images = [];
        targetSec.rows[actualRowIdx].images.push(imgUrl);
      }
      targetSec.images = targetSec.rows.flatMap((r: any) => r.images);
    } else {
      if (!targetSec.images) targetSec.images = [];
      targetSec.images.push(imgUrl);
    }

    setProjectEditForm((prev: any) => ({ ...prev, sections: secs }));

    const targetRowLabel = targetRowIdx === -1 ? "New Row" : `Row #${targetRowIdx + 1}`;
    showNotification(
      `${mode === "copy" ? "Copied" : "Moved"} image to ${targetSec.label || `Section #${targetSecIdx + 1}`} (${targetRowLabel})`,
      "success"
    );
  };

  const handleCopyImageToClipboard = (
    imgUrl: string,
    mode: "copy" | "move",
    sourceSecIdx: number,
    sourceRowIdx: number,
    sourceImgIdx: number
  ) => {
    setImageClipboard({ imgUrl, mode, sourceSecIdx, sourceRowIdx, sourceImgIdx });
    showNotification(
      mode === "copy"
        ? "Copied image! Now click 'Paste Image Here' on your target section or row."
        : "Cut image for move! Now click 'Paste Image Here' on your target section or row.",
      "info"
    );
  };

  const handleCopyMediaToClipboard = (
    imgUrl: string,
    mode: "copy" | "move" = "copy",
    gifMode?: boolean
  ) => {
    if (!imgUrl) return;
    setImageClipboard({
      imgUrl,
      mode,
      gifMode,
      sourceSecIdx: -1,
      sourceRowIdx: -1,
      sourceImgIdx: -1,
    });
    showNotification(
      mode === "copy"
        ? "Copied media path to clipboard! Click 'Paste Media' on any field or row."
        : "Cut media path for move! Click 'Paste Media' on any field or row.",
      "info"
    );
  };

  const handleToggleProjectMediaGifMode = (imgUrl: string) => {
    if (!imgUrl) return;
    setProjectEditForm((prev: any) => {
      const currentModes = { ...(prev?.gifModes || {}) };
      currentModes[imgUrl] = !currentModes[imgUrl];
      return { ...prev, gifModes: currentModes };
    });
    showNotification("Toggled GIF Mode preview status", "info");
  };

  const handlePasteImageFromClipboard = (targetSecIdx: number, targetRowIdx: number) => {
    if (!imageClipboard) return;
    handleTransferImageAcrossSections(
      imageClipboard.sourceSecIdx,
      imageClipboard.sourceRowIdx,
      imageClipboard.sourceImgIdx,
      targetSecIdx,
      targetRowIdx,
      imageClipboard.mode
    );
    setImageClipboard(null);
  };

  const handleSaveProject = async () => {
    if (!projectEditForm || !projectEditForm.id) return;

    const id = projectEditForm.id;
    const title = projectEditForm.title || "Untitled Project";

    try {
      await updateData(
        (prev) => {
          // Update basic project lists
          let allProjects = [...(prev.allProjects || [])];
          let featuredProjects = [...(prev.projects || [])];
          let projectDetails = [...(prev.projectDetails || [])];

          const briefIndex = allProjects.findIndex((p) => p.id === id);
          const detailedIndex = projectDetails.findIndex((p) => p.id === id);
          const featuredIndex = featuredProjects.findIndex((p) => p.id === id);

          const categories = projectEditForm.categories && projectEditForm.categories.length > 0
            ? projectEditForm.categories
            : (projectEditForm.category ? projectEditForm.category.split(",").map((c: string) => c.trim()).filter(Boolean) : ["Explainer"]);

          const categoryStr = categories.join(", ");

          const projectBrief: any = {
            id: projectEditForm.id,
            title: projectEditForm.title,
            category: categoryStr,
            categories: categories,
            thumbnail: projectEditForm.thumbnail,
            link: projectEditForm.link,
            hoverGif: projectEditForm.hoverGif,
            hoverVideo: projectEditForm.hoverVideo,
            isPublished: projectEditForm.isPublished,
            gifModes: projectEditForm.gifModes || {},
          };

          const projectDetail: any = {
            id: projectEditForm.id,
            title: projectEditForm.title?.toUpperCase(),
            shortDescription: projectEditForm.shortDescription || projectEditForm.description || "",
            heroImage: projectEditForm.heroImage || projectEditForm.thumbnail,
            role: projectEditForm.role?.toUpperCase() || "CREATIVE DIRECTION",
            client: projectEditForm.client?.toUpperCase() || "CLIENT",
            description: projectEditForm.description || "",
            videoUrl: projectEditForm.videoUrl || "",
            categories: categories,
            sections: projectEditForm.sections || [],
            date: projectEditForm.date || "2026",
            softwareUsed: projectEditForm.softwareUsed || [],
            behanceLink: projectEditForm.behanceLink || "",
            externalLink: projectEditForm.externalLink || "",
            customFields: projectEditForm.customFields || [],
            gifModes: projectEditForm.gifModes || {},
          };

          // If featured toggle is enabled
          const isFeatured = projectEditForm.isFeatured;
          const featuredBrief: any = {
            ...projectBrief,
            description: projectEditForm.description,
            imageLeft: featuredIndex !== -1 ? featuredProjects[featuredIndex].imageLeft : true,
          };

          // Modify or insert briefs
          if (briefIndex !== -1) {
            allProjects[briefIndex] = projectBrief;
          } else {
            allProjects.push(projectBrief);
          }

          // Modify or insert details
          if (detailedIndex !== -1) {
            projectDetails[detailedIndex] = projectDetail;
          } else {
            projectDetails.push(projectDetail);
          }

          // Manage featured work list
          if (isFeatured) {
            if (featuredIndex !== -1) {
              featuredProjects[featuredIndex] = featuredBrief;
            } else {
              featuredBrief.imageLeft = featuredProjects.length % 2 === 0;
              featuredProjects.push(featuredBrief);
            }
          } else {
            if (featuredIndex !== -1) {
              featuredProjects.splice(featuredIndex, 1);
            }
          }

          return {
            ...prev,
            allProjects,
            projects: featuredProjects,
            projectDetails,
          };
        },
        isCreatingNewProject ? "Project Created" : "Project Updated",
        `Saved changes for project: ${title} (ID: ${id})`
      );

      showNotification(`Saved project: ${title} successfully!`, "success");
    } catch (err) {
      console.error("Project save error:", err);
      showNotification(`Saved project: ${title} with local memory fallback`, "success");
    } finally {
      setIsCreatingNewProject(false);
      setProjectEditForm(null);
      setSelectedProjectId(null);
    }
  };

  const handleDuplicateProject = async (id: number) => {
    const srcBrief = (data?.allProjects || []).find((p) => p.id === id);
    const srcDetail = (data?.projectDetails || []).find((p) => p.id === id);
    if (!srcBrief) return;

    const newId = Math.max(...(data?.allProjects || []).map((p) => p.id), 0) + 1;
    const title = `${srcBrief.title} (Copy)`;

    await updateData(
      (prev) => {
        const duplicatedBrief = {
          ...srcBrief,
          id: newId,
          title,
        };
        const duplicatedDetail = srcDetail
          ? {
              ...srcDetail,
              id: newId,
              title: title.toUpperCase(),
            }
          : {
              id: newId,
              title: title.toUpperCase(),
              shortDescription: srcBrief.category,
              heroImage: srcBrief.thumbnail,
              role: "CREATIVE DIRECTION",
              client: "CLONE",
              description: "",
              sections: [],
            };

        return {
          ...prev,
          allProjects: [...prev.allProjects, duplicatedBrief],
          projectDetails: [...prev.projectDetails, duplicatedDetail],
        };
      },
      "Project Cloned",
      `Duplicated project ID ${id} into new project ID ${newId}`
    );

    showNotification(`Duplicated project successfully! ID: ${newId}`);
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm("Are you absolutely sure you want to delete this project? This is irreversible.")) return;

    const brief = data.allProjects.find((p) => p.id === id);
    const title = brief?.title || `ID ${id}`;

    await updateData(
      (prev) => ({
        ...prev,
        allProjects: prev.allProjects.filter((p) => p.id !== id),
        projects: prev.projects.filter((p) => p.id !== id),
        projectDetails: prev.projectDetails.filter((p) => p.id !== id),
      }),
      "Project Deleted",
      `Removed project: ${title} (ID: ${id}) entirely.`
    );

    setProjectEditForm(null);
    setSelectedProjectId(null);
    showNotification(`Deleted project: ${title}`);
  };

  const moveProject = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.allProjects.length) return;

    await updateData(
      (prev) => {
        const reordered = [...prev.allProjects];
        const temp = reordered[index];
        reordered[index] = reordered[targetIndex];
        reordered[targetIndex] = temp;
        return {
          ...prev,
          allProjects: reordered,
        };
      },
      "Projects Reordered",
      "Reordered project list indices."
    );

    showNotification("Projects reordered!");
  };

  // Backup file logic
  const handleBackupDownload = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-cms-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification("Downloaded JSON site backup!", "success");
  };

  const handleDownloadDefaultDataTs = () => {
    const assetMap = buildAssetMapping(data);

    const cleanObject = (obj: any): any => {
      if (!obj) return obj;
      if (typeof obj === "string") {
        const str = obj.trim();
        if (assetMap.has(str)) {
          return assetMap.get(str)!.cleanPathInTs;
        }
        return obj;
      } else if (Array.isArray(obj)) {
        return obj.map(cleanObject);
      } else if (typeof obj === "object") {
        const result: Record<string, any> = {};
        Object.keys(obj).forEach((key) => {
          if (key === "activityLogs") return;
          result[key] = cleanObject(obj[key]);
        });
        return result;
      }
      return obj;
    };

    const cleanData = cleanObject(data);
    const fileContent = `import { CMSSiteData } from "./types/cms";\n\nexport const defaultSiteData: CMSSiteData = ${JSON.stringify(cleanData, null, 2)};\n`;
    const blob = new Blob([fileContent], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "defaultData.ts";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("تم تحميل ملف defaultData.ts النظيف (مفصول عن Base64 وموجه لـ src/assets/images) بنجاح!", "success");
  };

  const handleResetData = async () => {
    if (
      window.confirm(
        "هل أنت تأكد من أنك تريد مسح الذاكرة المؤقتة للمتصفح (LocalStorage) وإعادة تحميل البيانات الأصلية من ملف defaultData.ts؟\n\n(Are you sure you want to clear local cache and reset to defaultData.ts?)"
      )
    ) {
      await resetToDefaultData();
      showNotification("تمت إعادة تعيين البيانات لنسخة defaultData.ts الأصلية بنجاح!", "success");
    }
  };

  const handleClearSiteData = async () => {
    if (
      window.confirm(
        "هل أنت تأكد من أنك تريد مسح جميع بيانات الموقع والتخزين المؤقت بالكامل (Clear Site Data & LocalStorage & Cache Storage)؟\nسيتم تنظيف المتصفح وإعادة تحميل الصفحة فوراً."
      )
    ) {
      showNotification("جاري مسح بيانات الموقع والتخزين المؤقت بالكامل...", "info");
      setTimeout(() => {
        clearAllSiteStorage();
      }, 400);
    }
  };

  const [isZippingAssets, setIsZippingAssets] = useState(false);

  const handleDownloadAssetsZip = async () => {
    setIsZippingAssets(true);
    showNotification("جاري تجميع الصور والـ GIFs المرفوعة إلى مجلد src/assets/images في ملف ZIP...", "info");

    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      const assetMap = buildAssetMapping(data);

      if (assetMap.size === 0) {
        showNotification("لم يتم العثور على وسائط مرفوعة مخصصة (Base64) بـ CMS لتصديرها.", "info");
        setIsZippingAssets(false);
        return;
      }

      let successCount = 0;
      const manifest: Record<string, string> = {};

      for (const [assetUrl, meta] of assetMap.entries()) {
        try {
          if (assetUrl.startsWith("data:")) {
            const parts = assetUrl.split(",");
            if (parts.length === 2) {
              const base64Data = parts[1];
              zip.file(meta.pathInZip, base64Data, { base64: true });
              manifest[meta.pathInZip] = "Base64 Asset";
              successCount++;
            }
          } else {
            const targetUrl = fixAssetUrl(assetUrl);
            const response = await fetch(targetUrl);
            if (response.ok) {
              const blob = await response.blob();
              zip.file(meta.pathInZip, blob);
              manifest[meta.pathInZip] = assetUrl;
              successCount++;
            }
          }
        } catch (err) {
          console.warn(`Failed to bundle asset ${assetUrl}:`, err);
        }
      }

      zip.file(
        "README_INSTRUCTIONS.txt",
        `تعليمات الاستخدام لقاعدة بيانات GitHub:
=======================================
1. قم بفك ضغط هذا الملف ZIP داخل مجلد مشروعك على الكمبيوتر (المجلد الرئيسي للمشروع).
2. سيتم نقل جميع الصور والـ GIFs المرفوعة تلقائياً إلى المسار الخاص بك: src/assets/images/
3. قم بنسخ ملف defaultData.ts المُنزل ومستخرج من CMS وضعه في مجلد src/defaultData.ts
4. ارفع التغييرات إلى GitHub بكل سهولة وبحجم ملف صغير جداً!`
      );

      const content = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `cms-src-assets-images-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      showNotification(`تم حفظ ${successCount} صور و GIFs داخل ZIP في المجلد src/assets/images/`, "success");
    } catch (error) {
      console.error("Error creating assets zip archive:", error);
      showNotification("حدث خطأ أثناء إنشاء ملف ZIP للوسائط.", "error");
    } finally {
      setIsZippingAssets(false);
    }
  };

  const handleBackupUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.name && parsed.allProjects && parsed.design) {
          const success = await restoreBackup(parsed);
          if (success) {
            showNotification("Backup restored successfully!", "success");
          }
        } else {
          showNotification("Invalid file schema. Backup must be a valid CMS JSON.", "error");
        }
      } catch (err) {
        showNotification("Failed to parse file JSON.", "error");
      }
    };
    reader.readAsText(file);
  };

  const adminStyleVars = {
    "--brand-green": "#8cff2e",
    "--brand-black": "#131313",
    "--brand-white": "#ffffff",
    "--brand-card": "#1a1a1a",
    "--brand-footer": "#c8c5ae",
    "--brand-accent": "#8cff2e",
    "--brand-border": "#262626",
    "--brand-button-bg": "#8cff2e",
    "--brand-button-text": "#131313",
    "--brand-muted": "#a3a3a3",
    "--brand-nav-bg": "#131313",
    "--brand-nav-text": "#ffffff",
    "--brand-badge-bg": "#262626",
    "--brand-badge-text": "#8cff2e",
  } as React.CSSProperties;

  return (
    <div
      style={adminStyleVars}
      className="flex min-h-screen bg-[#0d0d0d] text-neutral-100 font-grotesk overflow-x-hidden select-none selection:bg-brand-green selection:text-brand-black"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-9999 px-5 py-4 rounded-xl shadow-2xl border flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-brand-black border-brand-green/30 text-brand-green"
                : notification.type === "error"
                ? "bg-neutral-900 border-red-500/30 text-red-500"
                : "bg-neutral-900 border-neutral-700 text-neutral-300"
            }`}
          >
            {notification.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
            <span className="text-xs font-bold uppercase tracking-wider">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT NAVIGATION SIDEBAR */}
      <aside className="w-[280px] bg-neutral-950/60 border-r border-white/5 flex flex-col pt-8">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-white/5 flex items-center justify-center text-brand-green">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="font-bebas text-xl tracking-widest text-white leading-none">
              YOUSSEF ABAALI
            </h2>
            <p className="text-[9px] text-brand-green tracking-widest uppercase font-bold mt-1">
              • CUSTOM CMS
            </p>
          </div>
        </div>

        {/* Tab Selection List */}
        <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "home", label: "Home Page", icon: HomeIcon },
            { id: "projects", label: "Projects & Works", icon: Briefcase },
            { id: "about", label: "About Me Page", icon: UserIcon },
            { id: "services", label: "Services & Skills", icon: Sliders },
            { id: "contact", label: "Contact Info", icon: Mail },
            { id: "nav-footer", label: "Footer & Copyright", icon: MenuIcon },
            { id: "design", label: "Layout & Spacing", icon: Palette },
            { id: "media", label: "Media Library", icon: ImageIcon },
            { id: "docs", label: "Help & Guidelines", icon: BookOpen },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setSelectedProjectId(null);
                  setProjectEditForm(null);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-brand-green text-brand-black shadow-lg"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-neutral-950 text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer"
          >
            <LogOut size={14} />
            LOG OUT SYSTEM
          </button>
        </div>
      </aside>

      {/* MAIN DATA SPACE */}
      <main className="flex-1 flex flex-col bg-neutral-900/40 overflow-y-auto h-screen relative">
        {/* Dynamic header banner */}
        <header className="sticky top-0 z-10 px-8 py-4 bg-neutral-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-ping" />
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
              Live Connection Established • server database operational
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadAssetsZip}
              disabled={isZippingAssets}
              title="تحميل جميع الصور والـ GIFs المرفوعة في CMS في ملف ZIP واحد لنقلها إلى Github بسهولة"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/40 hover:border-blue-400 text-[10px] text-blue-400 hover:text-blue-300 tracking-widest uppercase font-bold transition-all cursor-pointer bg-blue-950/30 shadow-sm disabled:opacity-50"
            >
              {isZippingAssets ? <Loader2 size={12} className="animate-spin" /> : <FolderDown size={12} />}
              DOWNLOAD ASSETS ZIP
            </button>

            <button
              onClick={handleClearSiteData}
              title="مسح جميع بيانات الموقع والتخزين المؤقت بالكامل (Clear Site Data & LocalStorage & Caches)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 hover:border-amber-400 text-[10px] text-amber-400 hover:text-amber-300 tracking-widest uppercase font-bold transition-all cursor-pointer bg-amber-950/30 shadow-sm"
            >
              <Trash2 size={12} />
              CLEAR SITE DATA
            </button>

            <button
              onClick={handleResetData}
              title="مسح الذاكرة المؤقتة للمتصفح (LocalStorage) لإظهار التعديلات البرمجية في ملف defaultData.ts"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 hover:border-red-500 text-[10px] text-red-400 hover:text-red-300 tracking-widest uppercase font-bold transition-all cursor-pointer bg-red-950/30"
            >
              <RotateCcw size={12} />
              RESET TO defaultData.ts
            </button>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-brand-green text-[10px] text-neutral-400 hover:text-brand-green tracking-widest uppercase font-bold transition-all"
            >
              PREVIEW PORTFOLIO
              <ExternalLink size={12} />
            </a>
          </div>
        </header>

        <div className="p-8 max-w-6xl w-full mx-auto pb-24">
          <AnimatePresence mode="wait">
            {/* ══════════════════════════════════════════
                 TAB: DASHBOARD HOME
               ══════════════════════════════════════════ */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-8 text-left"
              >
                <div>
                  <h1 className="font-bebas text-4xl tracking-widest text-white">
                    WELCOME BACK, YOUSSEF
                  </h1>
                  <p className="text-neutral-400 text-xs tracking-wider uppercase mt-1">
                    Manage and control every aspect of your motion portfolio from one centralized hub.
                  </p>
                </div>

                {/* Dashboard Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-neutral-950/40 border border-white/5 p-5 rounded-2xl">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Total Works</span>
                    <p className="text-3xl font-bold font-mono text-brand-green mt-1">{(data?.allProjects || []).length}</p>
                  </div>
                  <div className="bg-neutral-950/40 border border-white/5 p-5 rounded-2xl">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Featured Slides</span>
                    <p className="text-3xl font-bold font-mono text-brand-green mt-1">{(data?.projects || []).length}</p>
                  </div>
                  <div className="bg-neutral-950/40 border border-white/5 p-5 rounded-2xl">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Toolbox Techs</span>
                    <p className="text-3xl font-bold font-mono text-brand-green mt-1">{(data?.aboutMe?.skills || []).length}</p>
                  </div>
                  <div className="bg-neutral-950/40 border border-white/5 p-5 rounded-2xl">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Expertises</span>
                    <p className="text-3xl font-bold font-mono text-brand-green mt-1">{(data?.services || []).length}</p>
                  </div>
                </div>

                {/* CMS Database Backups & Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Backup actions */}
                  <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
                        System Backup & Restore
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed uppercase mb-6">
                        Instantly backup your whole website as a single portable JSON file, or restore from a previously saved backup file.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleDownloadDefaultDataTs}
                        className="w-full bg-brand-green hover:bg-brand-green/90 text-brand-black text-xs font-bold uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg"
                      >
                        <FileText size={14} />
                        DOWNLOAD defaultData.ts (FOR GITHUB)
                      </button>

                      <button
                        onClick={handleDownloadAssetsZip}
                        disabled={isZippingAssets}
                        className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/40 hover:border-blue-400 text-blue-400 text-xs font-bold uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-50"
                        title="تجميع وتحميل جميع الصور والـ GIFs المرفوعة في CMS في أرشيف ZIP جاهز لنقله لمشروع GitHub"
                      >
                        {isZippingAssets ? <Loader2 size={14} className="animate-spin" /> : <FolderDown size={14} />}
                        DOWNLOAD MEDIA ASSETS (ZIP) (تحميل الصور والـ GIFs)
                      </button>

                      <button
                        onClick={handleClearSiteData}
                        className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-400 text-xs font-bold uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                        title="Clear site storage, LocalStorage, Cache Storage, Service Worker registrations & reload"
                      >
                        <Trash2 size={14} />
                        CLEAR SITE DATA (مسح الذاكرة والتخزين بالكامل)
                      </button>

                      <button
                        onClick={handleResetData}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 text-red-400 text-xs font-bold uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <RotateCcw size={14} />
                        RESET TO defaultData.ts (CLEAR LOCAL CACHE)
                      </button>

                      <button
                        onClick={handleBackupDownload}
                        className="w-full bg-neutral-900 border border-white/10 hover:border-brand-green hover:text-brand-green text-xs font-bold uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all text-neutral-300"
                      >
                        <Copy size={14} />
                        DOWNLOAD JSON BACKUP
                      </button>

                      <label className="w-full bg-neutral-900 border border-white/10 hover:border-brand-green hover:text-brand-green text-xs font-bold uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all text-neutral-300 text-center">
                        <Upload size={14} />
                        UPLOAD JSON RESTORE
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleBackupUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Quick tips */}
                  <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6 lg:col-span-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                      Administrative Guidelines
                    </h3>
                    <ul className="text-xs text-neutral-400 space-y-3.5 uppercase leading-relaxed font-semibold">
                      <li className="flex items-start gap-2.5">
                        <span className="text-brand-green">•</span>
                        <span>Any edits made to the CMS will instantly refresh on the development/production applets without building code.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-brand-green">•</span>
                        <span>The design system customization lets you change colors, padding scales, and body fonts using Range Sliders.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-brand-green">•</span>
                        <span>Use the media library tab to upload photos or videos directly and copy their server paths to use as Thumbnails.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-brand-green">•</span>
                        <span>To make projects visible on the public page, ensure the "Is Published" toggle is switched ON.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Audit Logs / Activity Track */}
                <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                    <CheckSquare size={16} className="text-brand-green" />
                    Security Audit Trail Logs
                  </h3>
                  <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
                    {data.activityLogs?.map((log) => (
                      <div key={log.id} className="p-3 bg-neutral-900/50 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-white uppercase tracking-wider">{log.action}</span>
                          <span className="text-neutral-400 text-[11px] uppercase">{log.details}</span>
                        </div>
                        <span className="font-mono text-neutral-500 text-[10px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                 TAB: HOME PAGE
               ══════════════════════════════════════════ */}
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6 text-left"
              >
                <div>
                  <h1 className="font-bebas text-4xl tracking-widest text-white">HOME VIEW CONTROLLER</h1>
                  <p className="text-neutral-400 text-xs tracking-wider uppercase mt-1">Manage Hero Section, Contact CTA Graphics (myInfo.jpg & myInfo-Mobile.png), Showreel parameters, and Home Page Social Icons.</p>
                </div>

                <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
                  {/* SECTION VISIBILITY TOGGLES */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-green mb-1">
                      1. HOME PAGE SECTIONS VISIBILITY (SHOW / HIDE)
                    </h3>
                    <p className="text-neutral-400 text-[10px] uppercase tracking-wider mb-4">
                      Toggle sections on or off. Spacing and gaps will update automatically.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {[
                        { key: "hero", label: "HERO GRAPHIC" },
                        { key: "showreel", label: "SHOWREEL" },
                        { key: "featuredWork", label: "FEATURED WORK" },
                        { key: "services", label: "SERVICES" },
                        { key: "contactCta", label: "CONTACT CTA" },
                        { key: "socials", label: "SOCIALS" },
                      ].map((sec) => {
                        const isVisible = (data.homeVisibility || {})[sec.key as keyof import("../types/cms").HomeSectionVisibility] !== false;
                        return (
                          <label
                            key={sec.key}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                              isVisible
                                ? "bg-brand-green/10 border-brand-green/40 text-white"
                                : "bg-neutral-900/40 border-white/5 text-neutral-500"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isVisible}
                              onChange={(e) => {
                                const val = e.target.checked;
                                updateData((prev) => ({
                                  ...prev,
                                  homeVisibility: { ...(prev.homeVisibility || {}), [sec.key]: val },
                                }), "Toggle Section", `Set ${sec.label} visibility to ${val}`);
                              }}
                              className="accent-brand-green w-4 h-4 rounded cursor-pointer"
                            />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-center">{sec.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECTION TITLES EDITOR */}
                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-green mb-1">
                      2. HOME PAGE SECTION HEADINGS
                    </h3>
                    <p className="text-neutral-400 text-[10px] uppercase tracking-wider mb-4">
                      Customize section header titles displayed on the home view.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">SHOWREEL TITLE (OPTIONAL)</label>
                        <input
                          type="text"
                          value={data.homeTitles?.showreel || ""}
                          placeholder="Optional title above showreel"
                          onChange={(e) => {
                            const val = e.target.value;
                            updateData((prev) => ({
                              ...prev,
                              homeTitles: { ...(prev.homeTitles || {}), showreel: val },
                            }), "Edit Section Title", `Updated Showreel title to ${val}`);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">FEATURED WORK TITLE</label>
                        <input
                          type="text"
                          value={data.homeTitles?.featuredWork ?? "FEATURED WORK"}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateData((prev) => ({
                              ...prev,
                              homeTitles: { ...(prev.homeTitles || {}), featuredWork: val },
                            }), "Edit Section Title", `Updated Featured Work title to ${val}`);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">SERVICES & EXPERTISE TITLE</label>
                        <input
                          type="text"
                          value={data.homeTitles?.services ?? "SERVICES & EXPERTISE"}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateData((prev) => ({
                              ...prev,
                              homeTitles: { ...(prev.homeTitles || {}), services: val },
                            }), "Edit Section Title", `Updated Services title to ${val}`);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">SOCIALS SECTION TITLE</label>
                        <input
                          type="text"
                          value={data.homeTitles?.socials ?? "I'M ALL OVER THE INTERNET"}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateData((prev) => ({
                              ...prev,
                              homeTitles: { ...(prev.homeTitles || {}), socials: val },
                            }), "Edit Section Title", `Updated Socials title to ${val}`);
                          }}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* HERO GRAPHICS */}
                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-green mb-3">3. HERO GRAPHICS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <CMSImageField
                        label="HERO GRAPHIC PATH (Desktop SVG/PNG)"
                        value={data.heroImage || ""}
                        onChange={(val) => updateData((prev) => ({ ...prev, heroImage: val }), "Hero Image Edit", `Updated hero image path to ${val}`)}
                        recommendedText="Recommended: Widescreen vector SVG or high-res PNG transparency"
                      />
                      <CMSImageField
                        label="HERO MOBILE GRAPHIC PATH (Mobile PNG)"
                        value={data.heroImageMobile || ""}
                        onChange={(val) => updateData((prev) => ({ ...prev, heroImageMobile: val }), "Hero Mobile Edit", `Updated hero mobile graphic path to ${val}`)}
                        recommendedText="Recommended: Portrait/mobile ratio PNG graphic"
                      />
                    </div>
                  </div>

                  {/* CONTACT CTA GRAPHICS (myInfo.jpg & myInfo-Mobile.png) */}
                  <div className="pt-4 border-t border-white/5">
                    <div className="mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-green">4. CONTACT CTA GRAPHICS (myInfo.jpg & myInfo-Mobile.png)</h3>
                      <p className="text-neutral-400 text-[10px] uppercase tracking-wider mt-0.5">Control the contact section graphic displayed on the Home Page. Upload new images or change paths directly.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <CMSImageField
                        label="DESKTOP CONTACT GRAPHIC (myInfo.jpg)"
                        value={data.myInfo || ""}
                        onChange={(val) => updateData((prev) => ({ ...prev, myInfo: val }), "Contact Graphic Edit", `Updated contact graphic path to ${val}`)}
                        recommendedText="Recommended: Widescreen info graphic layout (1200px+ width)"
                      />
                      <CMSImageField
                        label="MOBILE CONTACT GRAPHIC (myInfo-Mobile.png)"
                        value={data.myInfoMobile || ""}
                        onChange={(val) => updateData((prev) => ({ ...prev, myInfoMobile: val }), "Contact Mobile Graphic Edit", `Updated contact mobile graphic path to ${val}`)}
                        recommendedText="Recommended: Mobile portrait layout (640px max-width breakpoint)"
                      />
                    </div>
                  </div>

                  {/* SHOWREEL VIDEO & COVER */}
                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-green mb-3">5. SHOWREEL VIDEO & THUMBNAIL</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">SHOWREEL VIDEO URL (Vimeo/YouTube)</label>
                        <input
                          type="text"
                          value={data.showreel.videoUrl}
                          onChange={(e) => updateData((prev) => ({ ...prev, showreel: { ...prev.showreel, videoUrl: e.target.value } }), "Showreel Video Edit", "Modified Vimeo/YT showreel URL")}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-green font-mono text-xs"
                        />
                      </div>
                      <CMSImageField
                        label="SHOWREEL THUMBNAIL COVER PATH"
                        value={data.showreel.thumbnail || ""}
                        onChange={(val) => updateData((prev) => ({ ...prev, showreel: { ...prev.showreel, thumbnail: val } }), "Showreel Cover Edit", "Modified showreel image cover")}
                      />
                    </div>
                  </div>

                  {/* HOME PAGE SOCIAL LINKS */}
                  <div className="flex flex-col gap-4 pt-5 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-green">6. HOME PAGE SOCIAL MEDIA LINKS & ICONS</h3>
                        <p className="text-neutral-400 text-[10px] uppercase tracking-wider mt-0.5">Control social networks shown specifically on the Main/Home page ("I'm All Over The Internet").</p>
                      </div>
                      <button
                        onClick={() => {
                          const newLink = { name: "New Social", href: "https://", icon: "/src/assets/Icons/Icon-LinkedIn-Color.svg", iconBW: "/src/assets/Icons/Icon-LinkedIn-BW.svg" };
                          updateData((prev) => ({ ...prev, socials: [...(prev.socials || []), newLink] }), "Add Home Social", "Appended a new social network profile to home page");
                        }}
                        className="px-3 py-1.5 text-[10px] bg-brand-green/10 border border-brand-green/20 text-brand-green hover:bg-brand-green hover:text-brand-black uppercase font-bold rounded-lg cursor-pointer transition-all"
                      >
                        + Add Home Social Link
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(data.socials || []).map((soc, sIdx) => (
                        <div key={sIdx} className="bg-neutral-900/60 border border-white/5 p-4 rounded-xl flex flex-col gap-3 relative">
                          <button
                            onClick={() => {
                              const list = [...data.socials];
                              list.splice(sIdx, 1);
                              updateData((prev) => ({ ...prev, socials: list }), "Delete Home Social", `Deleted social link ${soc.name}`);
                            }}
                            className="absolute top-4 right-4 text-neutral-500 hover:text-red-400 cursor-pointer transition-colors"
                            title="Delete Social Link"
                          >
                            <Trash2 size={14} />
                          </button>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] text-neutral-400 font-bold uppercase">Network Name</label>
                              <input
                                type="text"
                                value={soc.name}
                                onChange={(e) => {
                                  const list = [...data.socials];
                                  list[sIdx] = { ...list[sIdx], name: e.target.value };
                                  updateData((prev) => ({ ...prev, socials: list }));
                                }}
                                className="w-full bg-neutral-950 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] text-neutral-400 font-bold uppercase">URL / href</label>
                              <input
                                type="text"
                                value={soc.href}
                                onChange={(e) => {
                                  const list = [...data.socials];
                                  list[sIdx] = { ...list[sIdx], href: e.target.value };
                                  updateData((prev) => ({ ...prev, socials: list }));
                                }}
                                className="w-full bg-neutral-950 border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <CMSImageField
                              label="Social Icon Path"
                              value={soc.icon || ""}
                              onChange={(val) => {
                                const list = [...data.socials];
                                list[sIdx] = { ...list[sIdx], icon: val };
                                updateData((prev) => ({ ...prev, socials: list }));
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                 TAB: PROJECTS SYSTEM
               ══════════════════════════════════════════ */}
            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6 text-left"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-bebas text-4xl tracking-widest text-white">PROJECTS MANAGEMENT</h1>
                    <p className="text-neutral-400 text-xs tracking-wider uppercase mt-1">Create, edit, reorder, and control individual subpages of your motion designs.</p>
                  </div>
                  {!projectEditForm && (
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => setShowCategoryManager(!showCategoryManager)}
                        className="bg-neutral-900 border border-white/15 hover:border-brand-green text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Tag size={15} className="text-brand-green" />
                        {showCategoryManager ? "HIDE CATEGORIES" : "MANAGE CATEGORIES"}
                      </button>
                      <button
                        onClick={startCreateProject}
                        className="bg-brand-green text-brand-black px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-103 cursor-pointer"
                      >
                        <Plus size={15} />
                        CREATE NEW WORK
                      </button>
                    </div>
                  )}
                </div>

                {/* CATEGORY TAGS MANAGER BOX */}
                {!projectEditForm && showCategoryManager && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-neutral-950/60 border border-brand-green/30 rounded-2xl p-6 flex flex-col gap-5"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Tag className="text-brand-green" size={18} />
                        <div>
                          <h3 className="font-bebas text-xl text-white tracking-wider">PROJECT CATEGORY TAGS MANAGER</h3>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Add custom category tags or rename existing tags. Renaming automatically updates all projects using that tag.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowCategoryManager(false)}
                        className="text-xs text-neutral-400 hover:text-white uppercase font-bold tracking-wider"
                      >
                        Close
                      </button>
                    </div>

                    {/* Add New Category Input Form */}
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddCategory();
                        }}
                        placeholder="Type new category tag (e.g. 3D Animation, Commercial, Social)..."
                        className="flex-1 bg-neutral-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand-green font-semibold"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="bg-brand-green text-brand-black px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Plus size={14} />
                        ADD CATEGORY
                      </button>
                    </div>

                    {/* Existing Categories List */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                        EXISTING CATEGORIES ({((data.projectCategories && data.projectCategories.length > 0) ? data.projectCategories : ["Explainer", "Brand", "Broadcast", "UI Motion", "Event", "Showreel"]).length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {((data.projectCategories && data.projectCategories.length > 0)
                          ? data.projectCategories
                          : ["Explainer", "Brand", "Broadcast", "UI Motion", "Event", "Showreel"]
                        ).map((cat, idx) => {
                          const isEditing = editingCategoryOldName === cat;
                          return (
                            <div
                              key={idx}
                              className="bg-neutral-900/80 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-2"
                            >
                              {isEditing ? (
                                <div className="flex items-center gap-1.5 flex-1">
                                  <input
                                    type="text"
                                    value={editingCategoryNewName}
                                    onChange={(e) => setEditingCategoryNewName(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") handleRenameCategory(cat, editingCategoryNewName);
                                      if (e.key === "Escape") setEditingCategoryOldName(null);
                                    }}
                                    autoFocus
                                    className="w-full bg-neutral-950 border border-brand-green rounded px-2.5 py-1 text-xs text-white font-semibold focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleRenameCategory(cat, editingCategoryNewName)}
                                    className="p-1 rounded bg-brand-green text-brand-black hover:opacity-90 transition-all cursor-pointer"
                                    title="Save Rename"
                                  >
                                    <Check size={13} />
                                  </button>
                                  <button
                                    onClick={() => setEditingCategoryOldName(null)}
                                    className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
                                    title="Cancel"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="w-2 h-2 rounded-full bg-brand-green shrink-0" />
                                    <span className="text-xs font-bold text-white uppercase tracking-wide truncate">
                                      {cat}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => {
                                        setEditingCategoryOldName(cat);
                                        setEditingCategoryNewName(cat);
                                      }}
                                      className="p-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-brand-green transition-all cursor-pointer"
                                      title="Rename Category"
                                    >
                                      <Edit2 size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCategory(cat)}
                                      className="p-1.5 rounded-lg bg-neutral-800/80 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-all cursor-pointer"
                                      title="Delete Category"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* If Editing a project */}
                {projectEditForm ? (
                  <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <span className="text-[11px] text-brand-green font-bold uppercase tracking-widest">
                        {isCreatingNewProject ? "⚡ Creating New Workspace Project" : `📝 Custom Project Editor — ID: ${projectEditForm.id}`}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setProjectEditForm(null);
                            setSelectedProjectId(null);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-[10px] text-neutral-400 hover:text-white uppercase font-bold tracking-wider cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProject}
                          className="px-3.5 py-1.5 rounded-lg bg-brand-green text-brand-black text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:opacity-90 flex items-center gap-1"
                        >
                          <Save size={12} />
                          Save Project
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">PROJECT NAME</label>
                        <input
                          type="text"
                          value={projectEditForm.title || ""}
                          onChange={(e) => setProjectEditForm((prev: any) => ({ ...prev, title: e.target.value }))}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-green font-semibold"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">DIRECT URL LINK (OPTIONAL)</label>
                        <input
                          type="text"
                          value={projectEditForm.link || ""}
                          onChange={(e) => setProjectEditForm((prev: any) => ({ ...prev, link: e.target.value }))}
                          placeholder="e.g. https://behance.net/..."
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-green font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    {/* DYNAMIC METADATA FIELDS EDITOR (Header Titles & Content Values) */}
                    <div className="flex flex-col gap-3 p-4 bg-neutral-900/60 border border-brand-green/20 rounded-xl">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2.5 flex-wrap gap-2">
                        <div className="flex flex-col">
                          <label className="text-[10px] text-brand-green font-bold uppercase tracking-wider">
                            PROJECT SUBPAGE INFO FIELDS (DYNAMIC HEADER LABELS & VALUES)
                          </label>
                          <span className="text-[9px] text-neutral-400">
                            You can edit field titles (e.g. ROLE, CLIENT BRAND NAME, DATE) and input values below. Add new fields or delete any field dynamically.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const current = projectEditForm.customFields && projectEditForm.customFields.length > 0
                              ? projectEditForm.customFields
                              : [
                                  { id: "field-role", label: "ROLE", value: projectEditForm.role || "" },
                                  { id: "field-client", label: "CLIENT BRAND NAME", value: projectEditForm.client || "" },
                                ];
                            const updated = [...current, { id: `field-${Date.now()}`, label: "NEW HEADER TITLE", value: "" }];
                            setProjectEditForm((prev: any) => ({ ...prev, customFields: updated }));
                          }}
                          className="px-3.5 py-1.5 bg-brand-green text-brand-black text-[10px] font-bold uppercase rounded-lg hover:opacity-90 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Plus size={13} />
                          Add Info Field
                        </button>
                      </div>

                      <div className="flex flex-col gap-3">
                        {(
                          projectEditForm.customFields && projectEditForm.customFields.length > 0
                            ? projectEditForm.customFields
                            : [
                                { id: "field-role", label: "ROLE", value: projectEditForm.role || "" },
                                { id: "field-client", label: "CLIENT BRAND NAME", value: projectEditForm.client || "" },
                              ]
                        ).map((field, fIdx, fieldsArr) => (
                          <div key={field.id || fIdx} className="flex items-center gap-3 bg-neutral-950 p-3 rounded-xl border border-white/5 flex-wrap sm:flex-nowrap">
                            {/* Header Title Input Box */}
                            <div className="flex flex-col gap-1 w-full sm:w-1/3">
                              <label className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                                Header Title #{fIdx + 1}
                              </label>
                              <input
                                type="text"
                                value={field.label}
                                onChange={(e) => {
                                  const updated = [...fieldsArr];
                                  updated[fIdx] = { ...updated[fIdx], label: e.target.value };
                                  setProjectEditForm((prev: any) => ({
                                    ...prev,
                                    customFields: updated,
                                    role: updated.find((f) => f.label.toUpperCase().includes("ROLE"))?.value || prev.role,
                                    client: updated.find((f) => f.label.toUpperCase().includes("CLIENT"))?.value || prev.client,
                                  }));
                                }}
                                placeholder="e.g. ROLE, CLIENT, DATE"
                                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white uppercase focus:outline-none focus:border-brand-green"
                              />
                            </div>

                            {/* Content Value Input Box (Supports Multiline text / Newlines) */}
                            <div className="flex flex-col gap-1 flex-1 w-full sm:w-2/3">
                              <label className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                                Content Value
                              </label>
                              <textarea
                                rows={2}
                                value={field.value}
                                onChange={(e) => {
                                  const updated = [...fieldsArr];
                                  updated[fIdx] = { ...updated[fIdx], value: e.target.value };
                                  setProjectEditForm((prev: any) => ({
                                    ...prev,
                                    customFields: updated,
                                    role: updated.find((f) => f.label.toUpperCase().includes("ROLE"))?.value || prev.role,
                                    client: updated.find((f) => f.label.toUpperCase().includes("CLIENT"))?.value || prev.client,
                                  }));
                                }}
                                placeholder="e.g. STORYBOARD, ILLUSTRATION&#10;SECOND LINE OF TEXT"
                                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-green resize-y min-h-[38px]"
                              />
                            </div>

                            {/* Delete Field */}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = fieldsArr.filter((_, idx) => idx !== fIdx);
                                setProjectEditForm((prev: any) => ({ ...prev, customFields: updated }));
                              }}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer shrink-0 self-end mb-0.5"
                              title="Delete field"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CATEGORIES SELECTION (MULTIPLE CATEGORY TAGS SUPPORT) */}
                    <div className="flex flex-col gap-2.5 p-4 bg-neutral-900/60 border border-white/5 rounded-xl">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-brand-green font-bold uppercase tracking-wider">
                          CATEGORY TAGS (SELECT ONE OR MULTIPLE CATEGORIES)
                        </label>
                        <span className="text-[10px] text-neutral-400">Checked: {(projectEditForm.categories || []).join(", ") || "None"}</span>
                      </div>

                      {/* Preset category checkboxes */}
                      <div className="flex flex-wrap gap-2 items-center">
                        {((data.projectCategories && data.projectCategories.length > 0)
                          ? data.projectCategories
                          : ["Explainer", "Brand", "Broadcast", "UI Motion", "Event", "Showreel"]
                        ).map((catTag) => {
                          const currentCats: string[] = projectEditForm.categories || 
                            (projectEditForm.category ? projectEditForm.category.split(",").map((s: string) => s.trim()).filter(Boolean) : []);
                          const isSelected = currentCats.some((c) => c.toLowerCase() === catTag.toLowerCase());

                          return (
                            <button
                              key={catTag}
                              type="button"
                              onClick={() => {
                                let updated: string[];
                                if (isSelected) {
                                  updated = currentCats.filter((c) => c.toLowerCase() !== catTag.toLowerCase());
                                } else {
                                  updated = [...currentCats, catTag];
                                }
                                setProjectEditForm((prev: any) => ({
                                  ...prev,
                                  categories: updated,
                                  category: updated.join(", "),
                                }));
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-brand-green text-brand-black border-brand-green shadow-sm"
                                  : "bg-neutral-900 text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
                              }`}
                            >
                              {isSelected ? `✓ ${catTag}` : `+ ${catTag}`}
                            </button>
                          );
                        })}

                        {/* Quick Add New Category inside Project Editor */}
                        <div className="flex items-center gap-1.5 ml-1">
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddCategory();
                              }
                            }}
                            placeholder="+ Add new tag..."
                            className="bg-neutral-950 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand-green font-semibold w-32 sm:w-40"
                          />
                          <button
                            type="button"
                            onClick={handleAddCategory}
                            className="px-2.5 py-1 rounded-lg bg-brand-green/20 text-brand-green hover:bg-brand-green hover:text-brand-black text-[11px] font-bold uppercase transition-all cursor-pointer whitespace-nowrap"
                          >
                            + Tag
                          </button>
                        </div>
                      </div>

                      {/* Custom Category Tag Input */}
                      <div className="flex flex-col gap-1 mt-1">
                        <label className="text-[9px] text-neutral-400 uppercase font-semibold">CUSTOM / COMBINED CATEGORY TEXT</label>
                        <input
                          type="text"
                          value={projectEditForm.category || (projectEditForm.categories || []).join(", ")}
                          onChange={(e) => {
                            const val = e.target.value;
                            const splitArr = val.split(",").map((s) => s.trim()).filter(Boolean);
                            setProjectEditForm((prev: any) => ({
                              ...prev,
                              category: val,
                              categories: splitArr,
                            }));
                          }}
                          placeholder="e.g. Explainer, Brand, 3D Motion"
                          className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green"
                        />
                      </div>
                    </div>

                    {/* PROJECT SUBPAGE SPECIFIC CONTENT (HERO VIDEO & SUBPAGE SHORT DESCRIPTION) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-neutral-900/60 border border-brand-green/20 rounded-xl">
                      <CMSImageField
                        label="PROJECT SUBPAGE HERO VIDEO SHOWREEL URL (FIRST VIDEO SHOWN IN DETAILS)"
                        value={projectEditForm.videoUrl || ""}
                        onChange={(val) => setProjectEditForm((prev: any) => ({ ...prev, videoUrl: val }))}
                        gifMode={Boolean(projectEditForm.gifModes?.[projectEditForm.videoUrl])}
                        onToggleGifMode={() => handleToggleProjectMediaGifMode(projectEditForm.videoUrl)}
                        onCopy={() => handleCopyMediaToClipboard(projectEditForm.videoUrl, "copy", Boolean(projectEditForm.gifModes?.[projectEditForm.videoUrl]))}
                        onCut={() => {
                          handleCopyMediaToClipboard(projectEditForm.videoUrl, "move", Boolean(projectEditForm.gifModes?.[projectEditForm.videoUrl]));
                          setProjectEditForm((prev: any) => ({ ...prev, videoUrl: "" }));
                        }}
                        onPaste={() => {
                          if (imageClipboard?.imgUrl) {
                            const pastUrl = imageClipboard.imgUrl;
                            setProjectEditForm((prev: any) => {
                              const newModes = { ...(prev.gifModes || {}) };
                              if (imageClipboard.gifMode !== undefined) {
                                newModes[pastUrl] = imageClipboard.gifMode;
                              }
                              return { ...prev, videoUrl: pastUrl, gifModes: newModes };
                            });
                            if (imageClipboard.mode === "move") setImageClipboard(null);
                          }
                        }}
                        imageClipboard={imageClipboard}
                        recommendedText="Subpage header main video / showreel (YouTube, Vimeo, MP4, WebM)"
                      />

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-brand-green font-bold uppercase tracking-wider">
                          SUBPAGE PARAGRAPH NEXT TO TITLE (HERO DESCRIPTION)
                        </label>
                        <textarea
                          rows={4}
                          value={projectEditForm.shortDescription || ""}
                          onChange={(e) => setProjectEditForm((prev: any) => ({ ...prev, shortDescription: e.target.value }))}
                          placeholder="e.g. 247 MAINTENANCE IS A SMART APP THAT CONNECTS YOU WITH EXPERT TECHNICIANS..."
                          className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-green"
                        />
                        <span className="text-[9px] text-neutral-400 uppercase">Text paragraph displayed next to the main project title at top of subpage.</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <CMSImageField
                        label="THUMBNAIL IMAGE / VIDEO PATH"
                        value={projectEditForm.thumbnail || ""}
                        onChange={(val) => setProjectEditForm((prev: any) => ({ ...prev, thumbnail: val }))}
                        gifMode={Boolean(projectEditForm.gifModes?.[projectEditForm.thumbnail])}
                        onToggleGifMode={() => handleToggleProjectMediaGifMode(projectEditForm.thumbnail)}
                        onCopy={() => handleCopyMediaToClipboard(projectEditForm.thumbnail, "copy", Boolean(projectEditForm.gifModes?.[projectEditForm.thumbnail]))}
                        onCut={() => {
                          handleCopyMediaToClipboard(projectEditForm.thumbnail, "move", Boolean(projectEditForm.gifModes?.[projectEditForm.thumbnail]));
                          setProjectEditForm((prev: any) => ({ ...prev, thumbnail: "" }));
                        }}
                        onPaste={() => {
                          if (imageClipboard?.imgUrl) {
                            const pastUrl = imageClipboard.imgUrl;
                            setProjectEditForm((prev: any) => {
                              const newModes = { ...(prev.gifModes || {}) };
                              if (imageClipboard.gifMode !== undefined) {
                                newModes[pastUrl] = imageClipboard.gifMode;
                              }
                              return { ...prev, thumbnail: pastUrl, gifModes: newModes };
                            });
                            if (imageClipboard.mode === "move") setImageClipboard(null);
                          }
                        }}
                        imageClipboard={imageClipboard}
                        recommendedText="Main grid thumbnail (Image, GIF, MP4, YouTube, Vimeo)"
                      />

                      <CMSImageField
                        label="COVER HERO PATH (SUBPAGE)"
                        value={projectEditForm.heroImage || ""}
                        onChange={(val) => setProjectEditForm((prev: any) => ({ ...prev, heroImage: val }))}
                        gifMode={Boolean(projectEditForm.gifModes?.[projectEditForm.heroImage])}
                        onToggleGifMode={() => handleToggleProjectMediaGifMode(projectEditForm.heroImage)}
                        onCopy={() => handleCopyMediaToClipboard(projectEditForm.heroImage, "copy", Boolean(projectEditForm.gifModes?.[projectEditForm.heroImage]))}
                        onCut={() => {
                          handleCopyMediaToClipboard(projectEditForm.heroImage, "move", Boolean(projectEditForm.gifModes?.[projectEditForm.heroImage]));
                          setProjectEditForm((prev: any) => ({ ...prev, heroImage: "" }));
                        }}
                        onPaste={() => {
                          if (imageClipboard?.imgUrl) {
                            const pastUrl = imageClipboard.imgUrl;
                            setProjectEditForm((prev: any) => {
                              const newModes = { ...(prev.gifModes || {}) };
                              if (imageClipboard.gifMode !== undefined) {
                                newModes[pastUrl] = imageClipboard.gifMode;
                              }
                              return { ...prev, heroImage: pastUrl, gifModes: newModes };
                            });
                            if (imageClipboard.mode === "move") setImageClipboard(null);
                          }
                        }}
                        imageClipboard={imageClipboard}
                        recommendedText="Subpage header cover (Image, GIF, MP4, YouTube, Vimeo)"
                      />

                      <CMSImageField
                        label="HOVER GIF / VIDEO PATH (PREVIEW)"
                        value={projectEditForm.hoverGif || ""}
                        onChange={(val) => setProjectEditForm((prev: any) => ({ ...prev, hoverGif: val }))}
                        gifMode={Boolean(projectEditForm.gifModes?.[projectEditForm.hoverGif])}
                        onToggleGifMode={() => handleToggleProjectMediaGifMode(projectEditForm.hoverGif)}
                        onCopy={() => handleCopyMediaToClipboard(projectEditForm.hoverGif, "copy", Boolean(projectEditForm.gifModes?.[projectEditForm.hoverGif]))}
                        onCut={() => {
                          handleCopyMediaToClipboard(projectEditForm.hoverGif, "move", Boolean(projectEditForm.gifModes?.[projectEditForm.hoverGif]));
                          setProjectEditForm((prev: any) => ({ ...prev, hoverGif: "" }));
                        }}
                        onPaste={() => {
                          if (imageClipboard?.imgUrl) {
                            const pastUrl = imageClipboard.imgUrl;
                            setProjectEditForm((prev: any) => {
                              const newModes = { ...(prev.gifModes || {}) };
                              if (imageClipboard.gifMode !== undefined) {
                                newModes[pastUrl] = imageClipboard.gifMode;
                              }
                              return { ...prev, hoverGif: pastUrl, gifModes: newModes };
                            });
                            if (imageClipboard.mode === "move") setImageClipboard(null);
                          }
                        }}
                        imageClipboard={imageClipboard}
                        recommendedText="Card hover animation (GIF, MP4, WebM, YouTube, Vimeo)"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">CATALOG DESCRIPTION (MAIN BODY TEXT)</label>
                      <textarea
                        rows={3}
                        value={projectEditForm.description || ""}
                        onChange={(e) => setProjectEditForm((prev: any) => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    {/* Checkboxes: Published / Featured */}
                    <div className="flex gap-6 py-2 border-t border-b border-white/5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs uppercase font-bold tracking-wider">
                        <input
                          type="checkbox"
                          checked={!!projectEditForm.isPublished}
                          onChange={(e) => setProjectEditForm((prev: any) => ({ ...prev, isPublished: e.target.checked }))}
                          className="accent-brand-green w-4 h-4 cursor-pointer"
                        />
                        Publish Project (Visible on work page)
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs uppercase font-bold tracking-wider">
                        <input
                          type="checkbox"
                          checked={!!projectEditForm.isFeatured}
                          onChange={(e) => setProjectEditForm((prev: any) => ({ ...prev, isFeatured: e.target.checked }))}
                          className="accent-brand-green w-4 h-4 cursor-pointer"
                        />
                        Featured Slider (Show on Home section)
                      </label>
                    </div>

                    {/* STICKY CLIPBOARD BAR WHEN IMAGE IS COPIED/CUT */}
                    {imageClipboard && (
                      <div className="sticky top-2 z-40 p-3.5 bg-neutral-900 border-2 border-brand-green rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-in slide-in-from-top duration-200 my-2">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 bg-neutral-950 rounded-lg overflow-hidden border border-brand-green/50 flex-shrink-0">
                            <img
                              src={imageClipboard.imgUrl}
                              alt="Clipboard preview"
                              className="w-full h-full object-cover"
                            />
                            <div
                              className={`absolute top-0 right-0 px-1 py-0.2 text-[7px] font-black uppercase ${
                                imageClipboard.mode === "copy"
                                  ? "bg-brand-green text-black"
                                  : "bg-purple-600 text-white"
                              }`}
                            >
                              {imageClipboard.mode}
                            </div>
                          </div>
                          <div className="flex flex-col text-left">
                            <div className="flex items-center gap-2">
                              {imageClipboard.mode === "copy" ? (
                                <span className="px-2 py-0.5 bg-brand-green/20 text-brand-green rounded border border-brand-green/40 text-[9px] font-extrabold flex items-center gap-1">
                                  <Copy size={10} /> COPY MODE ACTIVE
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded border border-purple-500/40 text-[9px] font-extrabold flex items-center gap-1">
                                  <Scissors size={10} /> MOVE (CUT) MODE ACTIVE
                                </span>
                              )}
                              <span className="text-xs font-bold text-white uppercase tracking-wider">Image Ready to Paste!</span>
                            </div>
                            <span className="text-[11px] text-neutral-300 mt-1">
                              Navigate to any Section or Row below and click <strong className="text-brand-green uppercase font-black">"Paste Image Here"</strong> or <strong className="text-purple-300 uppercase font-black">"+ Paste into New Row"</strong>.
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setImageClipboard(null)}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-all border border-white/10 shrink-0"
                          title="Cancel Clipboard"
                        >
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    )}

                    {/* Portfolio Project details sections editing */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                          Subpage Image Sections (Storyboard, styleframes, etc)
                        </label>
                        <button
                          onClick={() =>
                            setProjectEditForm((prev: any) => ({
                              ...prev,
                              sections: [
                                ...(prev.sections || []),
                                { type: "grid", label: "STORYBOARD", images: [] },
                              ],
                            }))
                          }
                          className="px-3 py-1.5 rounded bg-neutral-900 border border-white/10 hover:border-brand-green text-[10px] text-neutral-400 hover:text-brand-green uppercase font-bold cursor-pointer"
                        >
                          + ADD NEW GALLERY SECTION
                        </button>
                      </div>

                      <div className="space-y-4">
                        {(() => {
                          const allTransferTargets: { secIdx: number; rowIdx: number; label: string }[] = [];
                          (projectEditForm.sections || []).forEach((s: any, sIdx: number) => {
                            const sLabel = s.label || `Section #${sIdx + 1}`;
                            if (s.type === "grid") {
                              const rList = s.rows && s.rows.length > 0 ? s.rows : [{ images: s.images || [] }];
                              rList.forEach((_: any, rIdx: number) => {
                                allTransferTargets.push({
                                  secIdx: sIdx,
                                  rowIdx: rIdx,
                                  label: `${sLabel} › Row #${rIdx + 1}`,
                                });
                              });
                              allTransferTargets.push({
                                secIdx: sIdx,
                                rowIdx: -1,
                                label: `${sLabel} › [ + New Row ]`,
                              });
                            } else {
                              allTransferTargets.push({
                                secIdx: sIdx,
                                rowIdx: 0,
                                label: `${sLabel} › Widescreen Row`,
                              });
                            }
                          });

                          return projectEditForm.sections?.map((sec, sIdx) => (
                            <CMSGallerySectionEditor
                              key={sec.id || sIdx}
                              sec={sec}
                              sIdx={sIdx}
                              canMoveUp={sIdx > 0}
                              canMoveDown={sIdx < (projectEditForm.sections?.length || 0) - 1}
                              onMoveSec={(dir) => {
                                const targetIdx = dir === "up" ? sIdx - 1 : sIdx + 1;
                                const updatedSecs = [...(projectEditForm.sections || [])];
                                if (targetIdx < 0 || targetIdx >= updatedSecs.length) return;
                                const temp = updatedSecs[sIdx];
                                updatedSecs[sIdx] = updatedSecs[targetIdx];
                                updatedSecs[targetIdx] = temp;
                                setProjectEditForm((prev: any) => ({ ...prev, sections: updatedSecs }));
                              }}
                              allSections={(projectEditForm.sections || []).map((s: any, idx: number) => ({
                                sIdx: idx,
                                label: s.label || `Section #${idx + 1}`,
                              }))}
                              allTransferTargets={allTransferTargets}
                              imageClipboard={imageClipboard}
                              onUpdateSec={(updated) => {
                                const updatedSecs = [...(projectEditForm.sections || [])];
                                updatedSecs[sIdx] = updated;
                                setProjectEditForm((prev: any) => ({ ...prev, sections: updatedSecs }));
                              }}
                              onRemoveSec={() => {
                                const updatedSecs = [...(projectEditForm.sections || [])];
                                updatedSecs.splice(sIdx, 1);
                                setProjectEditForm((prev: any) => ({ ...prev, sections: updatedSecs }));
                              }}
                              onTransferImageAcrossSections={handleTransferImageAcrossSections}
                              onCopyImage={handleCopyImageToClipboard}
                              onPasteImage={handlePasteImageFromClipboard}
                            />
                          ));
                        })()}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                      <button
                        onClick={() => handleDeleteProject(projectEditForm.id!)}
                        className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-neutral-950 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                      >
                        Delete Project Entirely
                      </button>
                      <button
                        onClick={handleSaveProject}
                        className="px-6 py-2.5 rounded-xl bg-brand-green text-brand-black text-xs font-bold uppercase tracking-widest transition-all hover:scale-103 cursor-pointer"
                      >
                        SAVE PROJECT DATA
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-950/40 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-neutral-950 border-b border-white/5 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                            <th className="py-4 px-6">Reorder</th>
                            <th className="py-4 px-6">Preview</th>
                            <th className="py-4 px-6">Title</th>
                            <th className="py-4 px-6">Category</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6">Home Featured</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-semibold">
                          {data.allProjects.map((p, idx) => {
                            const isFeatured = data.projects.some((fp) => fp.id === p.id);
                            return (
                              <tr key={p.id} className="hover:bg-white/1 animate-fade-in uppercase">
                                <td className="py-4 px-6">
                                  <div className="flex gap-1">
                                    <button
                                      disabled={idx === 0}
                                      onClick={() => moveProject(idx, "up")}
                                      className="p-1 rounded bg-neutral-900 border border-white/5 hover:border-brand-green text-neutral-400 hover:text-brand-green disabled:opacity-30 disabled:hover:text-neutral-400 cursor-pointer"
                                    >
                                      <ArrowUp size={12} />
                                    </button>
                                    <button
                                      disabled={idx === data.allProjects.length - 1}
                                      onClick={() => moveProject(idx, "down")}
                                      className="p-1 rounded bg-neutral-900 border border-white/5 hover:border-brand-green text-neutral-400 hover:text-brand-green disabled:opacity-30 disabled:hover:text-neutral-400 cursor-pointer"
                                    >
                                      <ArrowDown size={12} />
                                    </button>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="w-14 aspect-video rounded overflow-hidden border border-white/10 bg-neutral-900">
                                    <img
                                      src={p.thumbnail}
                                      alt=""
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                </td>
                                <td className="py-4 px-6 font-bold text-white">{p.title}</td>
                                <td className="py-4 px-6">{p.category}</td>
                                <td className="py-4 px-6">
                                  <button
                                    onClick={() =>
                                      updateData(
                                        (prev) => {
                                          const index = prev.allProjects.findIndex((ap) => ap.id === p.id);
                                          if (index !== -1) {
                                            const curr = !!prev.allProjects[index].isPublished;
                                            prev.allProjects[index].isPublished = !curr;
                                          }
                                          return { ...prev };
                                        },
                                        "Toggle Publish",
                                        `Toggled publication of project: ${p.title}`
                                      )
                                    }
                                    className={`px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider cursor-pointer ${
                                      p.isPublished
                                        ? "bg-brand-green/20 text-brand-green"
                                        : "bg-neutral-800 text-neutral-400"
                                    }`}
                                  >
                                    {p.isPublished ? "Published" : "Draft"}
                                  </button>
                                </td>
                                <td className="py-4 px-6">
                                  <button
                                    onClick={() =>
                                      updateData(
                                        (prev) => {
                                          let featured = [...prev.projects];
                                          const featuredIdx = featured.findIndex((fp) => fp.id === p.id);
                                          if (featuredIdx !== -1) {
                                            featured.splice(featuredIdx, 1);
                                          } else {
                                            const ap = prev.allProjects.find((ap) => ap.id === p.id);
                                            if (ap) {
                                              featured.push({
                                                ...ap,
                                                description: "Custom slide description.",
                                                imageLeft: featured.length % 2 === 0,
                                              } as any);
                                            }
                                          }
                                          return { ...prev, projects: featured };
                                        },
                                        "Toggle Featured",
                                        `Toggled featured status of project: ${p.title}`
                                      )
                                    }
                                    className={`px-2.5 py-1 rounded text-[9px] font-bold tracking-wider cursor-pointer ${
                                      isFeatured
                                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/20"
                                        : "bg-neutral-800 text-neutral-400 border border-transparent"
                                    }`}
                                  >
                                    {isFeatured ? "★ Featured" : "☆ Standard"}
                                  </button>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => handleDuplicateProject(p.id)}
                                      className="p-1.5 rounded bg-neutral-900 border border-white/5 hover:border-brand-green hover:text-brand-green text-neutral-400 transition-all cursor-pointer"
                                      title="Duplicate Project"
                                    >
                                      <Copy size={13} />
                                    </button>
                                    <button
                                      onClick={() => startEditProject(p.id)}
                                      className="px-3 py-1.5 rounded bg-brand-green text-brand-black hover:opacity-90 font-bold tracking-wider text-[10px] uppercase cursor-pointer transition-all"
                                    >
                                      EDIT SUBPAGE
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                 TAB: ABOUT ME
               ══════════════════════════════════════════ */}
            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6 text-left"
              >
                <div>
                  <h1 className="font-bebas text-4xl tracking-widest text-white">ABOUT ME CONFIGURATION</h1>
                  <p className="text-neutral-400 text-xs tracking-wider uppercase mt-1">Control your biography paragraphs, technical skills bars, profile photo, and About page social media links.</p>
                </div>

                <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
                  {/* Photo Path & Headline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <CMSImageField
                      label="PROFILE IMAGE PATH"
                      value={data.aboutMe.profileImage || ""}
                      onChange={(val) =>
                        updateData(
                          (prev) => ({ ...prev, aboutMe: { ...prev.aboutMe, profileImage: val } }),
                          "Profile Photo Edit",
                          `Changed profile picture to ${val}`
                        )
                      }
                      recommendedText="Recommended: Square portrait photo"
                    />

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">CREATIVE HEADLINE</label>
                      <textarea
                        rows={3}
                        value={data.aboutMe.creativeHeadline}
                        onChange={(e) =>
                          updateData(
                            (prev) => ({ ...prev, aboutMe: { ...prev.aboutMe, creativeHeadline: e.target.value } }),
                            "Headline Edit",
                            "Modified creative toolbox title headline"
                          )
                        }
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    {/* PROFILE PHOTO DISPLAY DIMENSIONS CONTROLS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-neutral-900/60 border border-brand-green/20 rounded-xl col-span-full">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] text-brand-green font-bold uppercase tracking-wider">
                            PROFILE IMAGE DESKTOP WIDTH (PX)
                          </label>
                          <span className="text-xs font-mono font-bold text-white">
                            {data.aboutMe.profileImageWidthDesktop || 440}px
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={250}
                            max={650}
                            step={10}
                            value={data.aboutMe.profileImageWidthDesktop || 440}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updateData(
                                (prev) => ({
                                  ...prev,
                                  aboutMe: { ...prev.aboutMe, profileImageWidthDesktop: val },
                                }),
                                "Profile Photo Desktop Width",
                                `Set desktop profile photo width to ${val}px`
                              );
                            }}
                            className="flex-1 accent-brand-green h-1.5 bg-neutral-950 rounded cursor-pointer"
                          />
                          <input
                            type="number"
                            min={200}
                            max={800}
                            value={data.aboutMe.profileImageWidthDesktop || 440}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updateData(
                                (prev) => ({
                                  ...prev,
                                  aboutMe: { ...prev.aboutMe, profileImageWidthDesktop: val },
                                }),
                                "Profile Photo Desktop Width",
                                `Set desktop profile photo width to ${val}px`
                              );
                            }}
                            className="w-20 bg-neutral-950 border border-white/10 rounded px-2 py-1 text-xs text-center font-mono text-white focus:outline-none focus:border-brand-green"
                          />
                        </div>
                        <span className="text-[9px] text-neutral-400">
                          Maintains vertical alignment with top logo ("YA.") while scaling photo on desktop.
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] text-brand-green font-bold uppercase tracking-wider">
                            PROFILE IMAGE MOBILE / TABLET MAX WIDTH (PX)
                          </label>
                          <span className="text-xs font-mono font-bold text-white">
                            {data.aboutMe.profileImageWidthMobile || 380}px
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={200}
                            max={500}
                            step={10}
                            value={data.aboutMe.profileImageWidthMobile || 380}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updateData(
                                (prev) => ({
                                  ...prev,
                                  aboutMe: { ...prev.aboutMe, profileImageWidthMobile: val },
                                }),
                                "Profile Photo Mobile Width",
                                `Set mobile profile photo width to ${val}px`
                              );
                            }}
                            className="flex-1 accent-brand-green h-1.5 bg-neutral-950 rounded cursor-pointer"
                          />
                          <input
                            type="number"
                            min={150}
                            max={600}
                            value={data.aboutMe.profileImageWidthMobile || 380}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updateData(
                                (prev) => ({
                                  ...prev,
                                  aboutMe: { ...prev.aboutMe, profileImageWidthMobile: val },
                                }),
                                "Profile Photo Mobile Width",
                                `Set mobile profile photo width to ${val}px`
                              );
                            }}
                            className="w-20 bg-neutral-950 border border-white/10 rounded px-2 py-1 text-xs text-center font-mono text-white focus:outline-none focus:border-brand-green"
                          />
                        </div>
                        <span className="text-[9px] text-neutral-400">
                          Maintains vertical alignment with top logo ("YA.") while scaling photo on mobile.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RESUME PDF & BUTTON TEXT */}
                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-green mb-3">MY RESUME (PDF DOCUMENT & BUTTON)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">RESUME BUTTON TEXT</label>
                        <input
                          type="text"
                          value={data.aboutMe.resumeButtonText || "My Resume"}
                          onChange={(e) =>
                            updateData(
                              (prev) => ({ ...prev, aboutMe: { ...prev.aboutMe, resumeButtonText: e.target.value } }),
                              "Resume Label Edit",
                              `Changed resume button text to ${e.target.value}`
                            )
                          }
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-green"
                        />
                      </div>

                      <CMSImageField
                        label="RESUME PDF FILE UPLOAD OR URL"
                        value={data.aboutMe.resumeUrl || ""}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, aboutMe: { ...prev.aboutMe, resumeUrl: val } }),
                            "Resume PDF Edit",
                            `Updated resume PDF document path to ${val}`
                          )
                        }
                        recommendedText="Upload a PDF file or provide direct link to resume"
                      />
                    </div>
                  </div>

                  {/* Bio Paragraphs list */}
                  <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Biography Paragraphs list</label>
                      <button
                        onClick={() =>
                          updateData(
                            (prev) => ({
                              ...prev,
                              aboutMe: {
                                ...prev.aboutMe,
                                paragraphs: [...prev.aboutMe.paragraphs, "A new story paragraph about my motion animations."],
                              },
                            }),
                            "Add Biography Paragraph",
                            "Appended a blank line to personal bio list"
                          )
                        }
                        className="px-3 py-1 text-[10px] bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white uppercase font-bold rounded cursor-pointer"
                      >
                        + Add Paragraph
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {data.aboutMe.paragraphs.map((pText, pIdx) => (
                        <div key={pIdx} className="flex gap-2 items-start bg-neutral-900/50 p-2 rounded-xl border border-white/5">
                          <textarea
                            rows={3}
                            value={pText}
                            onChange={(e) => {
                              const updatedBio = [...data.aboutMe.paragraphs];
                              updatedBio[pIdx] = e.target.value;
                              updateData(
                                (prev) => ({ ...prev, aboutMe: { ...prev.aboutMe, paragraphs: updatedBio } }),
                                "Modify Paragraph",
                                `Edited biography line entry ${pIdx}`
                              );
                            }}
                            className="w-full bg-transparent border-none text-xs text-neutral-300 focus:outline-none resize-y py-1 px-2"
                          />
                          <button
                            onClick={() => {
                              const updatedBio = [...data.aboutMe.paragraphs];
                              updatedBio.splice(pIdx, 1);
                              updateData(
                                (prev) => ({ ...prev, aboutMe: { ...prev.aboutMe, paragraphs: updatedBio } }),
                                "Delete Paragraph",
                                "Removed a paragraph block from bio list"
                              );
                            }}
                            className="text-red-400 hover:text-red-500 p-2 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Editor */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Toolbox software percentages</label>
                      <button
                        onClick={() =>
                          updateData(
                            (prev) => ({
                              ...prev,
                              aboutMe: {
                                ...prev.aboutMe,
                                skills: [
                                  ...prev.aboutMe.skills,
                                  { name: "Unreal Engine", desc: "Real-time 3D creation tool", percent: 50 },
                                ],
                              },
                            }),
                            "Add Tech Skill",
                            "Added technology skill to profile list"
                          )
                        }
                        className="px-3 py-1 text-[10px] bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white uppercase font-bold rounded cursor-pointer"
                      >
                        + Add Software Skill
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.aboutMe.skills.map((skill, sIdx) => (
                        <div key={sIdx} className="p-4 bg-neutral-900/50 border border-white/5 rounded-xl flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => {
                                const list = [...data.aboutMe.skills];
                                list[sIdx].name = e.target.value;
                                updateData((prev) => ({ ...prev, aboutMe: { ...prev.aboutMe, skills: list } }));
                              }}
                              className="bg-transparent border-b border-white/15 focus:border-brand-green text-xs font-bold text-white focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const list = [...data.aboutMe.skills];
                                list.splice(sIdx, 1);
                                updateData((prev) => ({ ...prev, aboutMe: { ...prev.aboutMe, skills: list } }));
                              }}
                              className="text-red-400 hover:text-red-500 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <input
                            type="text"
                            value={skill.desc}
                            onChange={(e) => {
                              const list = [...data.aboutMe.skills];
                              list[sIdx].desc = e.target.value;
                              updateData((prev) => ({ ...prev, aboutMe: { ...prev.aboutMe, skills: list } }));
                            }}
                            placeholder="Software details description"
                            className="bg-transparent text-[11px] text-neutral-400 focus:outline-none"
                          />

                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={skill.percent}
                              onChange={(e) => {
                                const list = [...data.aboutMe.skills];
                                list[sIdx].percent = parseInt(e.target.value, 10);
                                updateData((prev) => ({ ...prev, aboutMe: { ...prev.aboutMe, skills: list } }));
                              }}
                              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-green"
                            />
                            <span className="text-xs font-bold text-brand-green w-8 text-right">{skill.percent}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ABOUT ME PAGE SOCIAL LINKS */}
                  <div className="flex flex-col gap-4 pt-5 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-green">ABOUT ME PAGE SOCIAL MEDIA LINKS & ICONS</h3>
                        <p className="text-neutral-400 text-[10px] uppercase tracking-wider mt-0.5">Control social networks shown specifically on the About Me page. Completely independent from the Home Page!</p>
                      </div>
                      <button
                        onClick={() => {
                          const newLink = { name: "New Social", href: "https://", icon: "/src/assets/Icons/Icon-LinkedIn-Color.svg", iconBW: "/src/assets/Icons/Icon-LinkedIn-BW.svg" };
                          updateData((prev) => ({ ...prev, aboutSocials: [...(prev.aboutSocials || prev.socials || []), newLink] }), "Add About Social", "Appended a new social network profile to about page");
                        }}
                        className="px-3 py-1.5 text-[10px] bg-brand-green/10 border border-brand-green/20 text-brand-green hover:bg-brand-green hover:text-brand-black uppercase font-bold rounded-lg cursor-pointer transition-all"
                      >
                        + Add About Social Link
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(data.aboutSocials || data.socials || []).map((soc, sIdx) => (
                        <div key={sIdx} className="bg-neutral-900/60 border border-white/5 p-4 rounded-xl flex flex-col gap-3 relative">
                          <button
                            onClick={() => {
                              const list = [...(data.aboutSocials || data.socials || [])];
                              list.splice(sIdx, 1);
                              updateData((prev) => ({ ...prev, aboutSocials: list }), "Delete About Social", `Deleted about social link ${soc.name}`);
                            }}
                            className="absolute top-4 right-4 text-neutral-500 hover:text-red-400 cursor-pointer transition-colors"
                            title="Delete Social Link"
                          >
                            <Trash2 size={14} />
                          </button>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] text-neutral-400 font-bold uppercase">Network Name</label>
                              <input
                                type="text"
                                value={soc.name}
                                onChange={(e) => {
                                  const list = [...(data.aboutSocials || data.socials || [])];
                                  list[sIdx] = { ...list[sIdx], name: e.target.value };
                                  updateData((prev) => ({ ...prev, aboutSocials: list }));
                                }}
                                className="w-full bg-neutral-950 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] text-neutral-400 font-bold uppercase">URL / href</label>
                              <input
                                type="text"
                                value={soc.href}
                                onChange={(e) => {
                                  const list = [...(data.aboutSocials || data.socials || [])];
                                  list[sIdx] = { ...list[sIdx], href: e.target.value };
                                  updateData((prev) => ({ ...prev, aboutSocials: list }));
                                }}
                                className="w-full bg-neutral-950 border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <CMSImageField
                              label="Color Icon Path"
                              value={soc.icon || ""}
                              onChange={(val) => {
                                const list = [...(data.aboutSocials || data.socials || [])];
                                list[sIdx] = { ...list[sIdx], icon: val };
                                updateData((prev) => ({ ...prev, aboutSocials: list }));
                              }}
                            />
                            <CMSImageField
                              label="B&W / Dark Icon Path (Optional)"
                              value={soc.iconBW || ""}
                              onChange={(val) => {
                                const list = [...(data.aboutSocials || data.socials || [])];
                                list[sIdx] = { ...list[sIdx], iconBW: val };
                                updateData((prev) => ({ ...prev, aboutSocials: list }));
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                 TAB: SERVICES & EXPERTISE
                ══════════════════════════════════════════ */}
            {activeTab === "services" && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-bebas text-4xl tracking-widest text-white">SERVICES & EXPERTISES</h1>
                    <p className="text-neutral-400 text-xs tracking-wider uppercase mt-1">Manage, add, or alter service listings shown in the home view grid.</p>
                  </div>
                  <button
                    onClick={() =>
                      updateData(
                        (prev) => ({
                          ...prev,
                          services: [...prev.services, { title: "3D CHARACTER MODELING", items: ["CINEMA 4D", "BLENDER"] }],
                        }),
                        "Service Added",
                        "Created new service column listing"
                      )
                    }
                    className="bg-brand-green text-brand-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all hover:scale-103"
                  >
                    <Plus size={14} />
                    ADD SERVICE
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {data.services.map((service, sIdx) => (
                    <div key={sIdx} className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => {
                              const list = [...data.services];
                              list[sIdx].title = e.target.value.toUpperCase();
                              updateData((prev) => ({ ...prev, services: list }), "Edit Service Title", "Updated title parameter on service block");
                            }}
                            className="bg-transparent border-b border-white/10 font-bebas text-lg text-white focus:outline-none focus:border-brand-green py-1"
                          />
                          <button
                            onClick={() => {
                              const list = [...data.services];
                              list.splice(sIdx, 1);
                              updateData((prev) => ({ ...prev, services: list }), "Delete Service", `Deleted service block: ${service.title}`);
                            }}
                            className="text-red-400 hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Items in services */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Features list (comma-separated)</span>
                          <textarea
                            rows={3}
                            value={service.items.join(", ")}
                            onChange={(e) => {
                              const arr = e.target.value.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
                              const list = [...data.services];
                              list[sIdx].items = arr;
                              updateData((prev) => ({ ...prev, services: list }));
                            }}
                            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                 TAB: CONTACT PANEL
               ══════════════════════════════════════════ */}
            {activeTab === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6 text-left"
              >
                <div>
                  <h1 className="font-bebas text-4xl tracking-widest text-white">CONTACT INFORMATION</h1>
                  <p className="text-neutral-400 text-xs tracking-wider uppercase mt-1">Alter details like hours, phone numbers, and location queries.</p>
                </div>

                <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        value={data.contact?.email || data.email || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateData(
                            (prev) => ({
                              ...prev,
                              email: val,
                              contact: { ...(prev.contact || {}), email: val },
                            }),
                            "Contact Email Edit",
                            `Changed contact email to ${val}`
                          );
                        }}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-green font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">TELEPHONE CELLPHONE</label>
                      <input
                        type="text"
                        value={data.contact?.phone || ""}
                        onChange={(e) =>
                          updateData(
                            (prev) => ({ ...prev, contact: { ...(prev.contact || {}), phone: e.target.value } }),
                            "Phone Edit",
                            `Changed contact phone to ${e.target.value}`
                          )
                        }
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                 TAB: MENU & FOOTER
               ══════════════════════════════════════════ */}
            {activeTab === "nav-footer" && (
              <motion.div
                key="nav-footer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6 text-left"
              >
                <div>
                  <h1 className="font-bebas text-4xl tracking-widest text-white">MENU & FOOTER PARAMETERS</h1>
                  <p className="text-neutral-400 text-xs tracking-wider uppercase mt-1">Configure footer copyrights and social profile links.</p>
                </div>

                <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
                  <div>
                    {/* Copyright */}
                    <div className="flex flex-col gap-2 max-w-md">
                      <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">FOOTER COPYRIGHT TEXT</label>
                      <input
                        type="text"
                        value={data.footer.copyrightText || ""}
                        onChange={(e) =>
                          updateData(
                            (prev) => ({ ...prev, footer: { ...prev.footer, copyrightText: e.target.value } }),
                            "Footer Copyright Edit",
                            "Modified footer brand text"
                          )
                        }
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Footer Social Media Links & Visibility Manager */}
                  <div className="flex flex-col gap-4 pt-5 border-t border-white/5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className="text-xs font-bold text-brand-green uppercase tracking-wider">
                          FOOTER SOCIAL MEDIA LINKS & VISIBILITY
                        </label>
                        <p className="text-[10px] text-neutral-400 uppercase mt-0.5">
                          Control social links displayed in the footer, edit their destination URLs, and toggle visibility on or off.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const currentSocials = data.footer.footerSocials && data.footer.footerSocials.length > 0
                            ? data.footer.footerSocials
                            : data.socials.map((s) => ({ label: s.name, href: s.href, isVisible: true }));
                          const updated = [...currentSocials, { label: "NEW SOCIAL", href: "https://", isVisible: true }];
                          updateData(
                            (prev) => ({
                              ...prev,
                              footer: { ...prev.footer, footerSocials: updated },
                            }),
                            "Add Footer Social",
                            "Added a new social media link to footer"
                          );
                        }}
                        className="px-3.5 py-2 rounded-xl bg-brand-green text-brand-black text-[11px] uppercase font-bold cursor-pointer hover:scale-105 transition-all self-start sm:self-auto flex items-center gap-1.5"
                      >
                        <Plus size={14} /> Add Social Link
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {((data.footer.footerSocials && data.footer.footerSocials.length > 0)
                        ? data.footer.footerSocials
                        : data.socials.map((s) => ({ label: s.name, href: s.href, isVisible: true }))
                      ).map((soc, sIdx) => {
                        const isVis = soc.isVisible !== false;
                        return (
                          <div key={sIdx} className="bg-neutral-900/60 border border-white/10 p-4 rounded-xl flex flex-col gap-3 relative">
                            <button
                              onClick={() => {
                                const currentSocials = data.footer.footerSocials && data.footer.footerSocials.length > 0
                                  ? data.footer.footerSocials
                                  : data.socials.map((s) => ({ label: s.name, href: s.href, isVisible: true }));
                                const updated = currentSocials.filter((_, idx) => idx !== sIdx);
                                updateData(
                                  (prev) => ({
                                    ...prev,
                                    footer: { ...prev.footer, footerSocials: updated },
                                  }),
                                  "Delete Footer Social",
                                  `Deleted footer social: ${soc.label}`
                                );
                              }}
                              className="absolute top-3.5 right-3.5 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete Social Link"
                            >
                              <Trash2 size={14} />
                            </button>

                            {/* Visibility toggle + state */}
                            <div className="flex items-center gap-3 pr-8">
                              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase text-white select-none">
                                <input
                                  type="checkbox"
                                  checked={isVis}
                                  onChange={(e) => {
                                    const currentSocials = data.footer.footerSocials && data.footer.footerSocials.length > 0
                                      ? data.footer.footerSocials
                                      : data.socials.map((s) => ({ label: s.name, href: s.href, isVisible: true }));
                                    const updated = [...currentSocials];
                                    updated[sIdx] = { ...updated[sIdx], isVisible: e.target.checked };
                                    updateData(
                                      (prev) => ({
                                        ...prev,
                                        footer: { ...prev.footer, footerSocials: updated },
                                      }),
                                      "Toggle Footer Social Visibility",
                                      `Toggled visibility for ${soc.label}`
                                    );
                                  }}
                                  className="accent-brand-green w-4 h-4 cursor-pointer"
                                />
                                <span className={isVis ? "text-brand-green" : "text-neutral-500 line-through"}>
                                  {isVis ? "Visible in Footer" : "Hidden in Footer"}
                                </span>
                              </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-neutral-400 font-bold uppercase">Name / Label</label>
                                <input
                                  type="text"
                                  value={soc.label}
                                  onChange={(e) => {
                                    const currentSocials = data.footer.footerSocials && data.footer.footerSocials.length > 0
                                      ? data.footer.footerSocials
                                      : data.socials.map((s) => ({ label: s.name, href: s.href, isVisible: true }));
                                    const updated = [...currentSocials];
                                    updated[sIdx] = { ...updated[sIdx], label: e.target.value.toUpperCase() };
                                    updateData(
                                      (prev) => ({
                                        ...prev,
                                        footer: { ...prev.footer, footerSocials: updated },
                                      }),
                                      "Edit Footer Social Label",
                                      `Updated label to ${e.target.value}`
                                    );
                                  }}
                                  placeholder="e.g. INSTAGRAM"
                                  className="w-full bg-neutral-950 border border-white/10 rounded px-3 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-brand-green font-mono"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] text-neutral-400 font-bold uppercase">Target URL (href)</label>
                                <input
                                  type="text"
                                  value={soc.href}
                                  onChange={(e) => {
                                    const currentSocials = data.footer.footerSocials && data.footer.footerSocials.length > 0
                                      ? data.footer.footerSocials
                                      : data.socials.map((s) => ({ label: s.name, href: s.href, isVisible: true }));
                                    const updated = [...currentSocials];
                                    updated[sIdx] = { ...updated[sIdx], href: e.target.value };
                                    updateData(
                                      (prev) => ({
                                        ...prev,
                                        footer: { ...prev.footer, footerSocials: updated },
                                      }),
                                      "Edit Footer Social URL",
                                      `Updated URL for ${soc.label}`
                                    );
                                  }}
                                  placeholder="https://..."
                                  className="w-full bg-neutral-950 border border-white/10 rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-brand-green"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                 TAB: GLOBAL DESIGN SYSTEM
               ══════════════════════════════════════════ */}
            {activeTab === "design" && (
              <motion.div
                key="design"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6 text-left"
              >
                <div>
                  <h1 className="font-bebas text-4xl tracking-widest text-white">GLOBAL DESIGN SYSTEM</h1>
                  <p className="text-neutral-400 text-xs tracking-wider uppercase mt-1">
                    Instantly customize colors, font weight layouts, spacing paddings and elements gaps without editing CSS.
                  </p>
                </div>

                <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
                  {/* Global theme colors */}
                  <div>
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                        <Palette size={14} className="text-brand-green" />
                        التحكم الشامل بكل ألوان الموقع (DYNAMIC COLOR PALETTE - HEX CODES ONLY)
                      </h3>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        يمكنك اختيار ألوان الموقع بالكامل أو لصق أي كود لون ينتهي أو يبدأ بـ #HEX مباشرة
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* 1. Primary Highlight */}
                      <HexColorPickerItem
                        label="PRIMARY HIGHLIGHT"
                        arabicLabel="اللون الرئيسي للموقع"
                        description="اللون الأخضر المضيء للتميزات والمؤشرات"
                        value={data.design.colors.primary || "#8cff2e"}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, primary: val } } }),
                            "Primary Color Edit",
                            `Updated primary color to ${val}`
                          )
                        }
                      />

                      {/* 2. Main Canvas Background */}
                      <HexColorPickerItem
                        label="CANVAS BACKGROUND"
                        arabicLabel="خلفية الموقع الرئيسية"
                        description="خلفية جميع صفحات الموقع"
                        value={data.design.colors.background || "#131313"}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, background: val } } }),
                            "Background Color Edit",
                            `Updated canvas background to ${val}`
                          )
                        }
                      />

                      {/* 3. Main Text */}
                      <HexColorPickerItem
                        label="MAIN TEXT & HEADINGS"
                        arabicLabel="لون النصوص والعناوين"
                        description="لون الخط الرئيسي في المحتوى"
                        value={data.design.colors.text || "#ffffff"}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, text: val } } }),
                            "Text Color Edit",
                            `Updated text color to ${val}`
                          )
                        }
                      />

                      {/* 4. Card Shells */}
                      <HexColorPickerItem
                        label="CARD SHELLS"
                        arabicLabel="خلفية البطاقات والخدمات"
                        description="خلفية مربعات المشاريع والخدمات"
                        value={data.design.colors.card || "#1a1a1a"}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, card: val } } }),
                            "Card Color Edit",
                            `Updated card background to ${val}`
                          )
                        }
                      />

                      {/* 5. Footer Background */}
                      <HexColorPickerItem
                        label="FOOTER BACKGROUND"
                        arabicLabel="خلفية الفوتر السفلي"
                        description="خلفية قسم الفوتر أسفل الموقع"
                        value={data.design.colors.footer || "#c8c5ae"}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, footer: val } } }),
                            "Footer Color Edit",
                            `Updated footer background to ${val}`
                          )
                        }
                      />

                      {/* 6. Accent Color */}
                      <HexColorPickerItem
                        label="ACCENT HIGHLIGHT"
                        arabicLabel="لون التأكيد والتفاعل"
                        description="تأثيرات التمرير والتميزات الثانوية"
                        value={data.design.colors.accent || data.design.colors.primary || "#8cff2e"}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, accent: val } } }),
                            "Accent Color Edit",
                            `Updated accent color to ${val}`
                          )
                        }
                      />

                      {/* 7. Borders & Dividers */}
                      <HexColorPickerItem
                        label="BORDERS & DIVIDERS"
                        arabicLabel="لون الحدود والفاصل"
                        description="حدود البطاقات والخطوط الفاصلة"
                        value={data.design.colors.border || "#262626"}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, border: val } } }),
                            "Border Color Edit",
                            `Updated border color to ${val}`
                          )
                        }
                      />

                      {/* 8. Button Background */}
                      <HexColorPickerItem
                        label="BUTTON BACKGROUND"
                        arabicLabel="خلفية الأزرار الرئيسية"
                        description="خلفية أزرار التواصل والمشاهدة"
                        value={data.design.colors.buttonBg || data.design.colors.primary || "#8cff2e"}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, buttonBg: val } } }),
                            "Button Bg Color Edit",
                            `Updated button background to ${val}`
                          )
                        }
                      />

                      {/* 9. Button Text Color */}
                      <HexColorPickerItem
                        label="BUTTON TEXT COLOR"
                        arabicLabel="لون نص الأزرار"
                        description="لون النص المكتوب داخل الأزرار"
                        value={data.design.colors.buttonText || "#131313"}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, buttonText: val } } }),
                            "Button Text Color Edit",
                            `Updated button text color to ${val}`
                          )
                        }
                      />

                      {/* 10. Muted / Secondary Text */}
                      <HexColorPickerItem
                        label="MUTED TEXT"
                        arabicLabel="لون النصوص الفرعية"
                        description="الوصف الفرعي والتفاصيل الثانوية"
                        value={data.design.colors.mutedText || "#a3a3a3"}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, mutedText: val } } }),
                            "Muted Text Edit",
                            `Updated muted text color to ${val}`
                          )
                        }
                      />

                      {/* 11. Navbar Background */}
                      <HexColorPickerItem
                        label="NAVBAR BACKGROUND"
                        arabicLabel="خلفية الهيدر العلوي"
                        description="خلفية شريط القائمة الرئيسي"
                        value={data.design.colors.navBg || data.design.colors.background || "#131313"}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, navBg: val } } }),
                            "Navbar Bg Edit",
                            `Updated navbar background to ${val}`
                          )
                        }
                      />

                      {/* 12. Navbar Links */}
                      <HexColorPickerItem
                        label="NAVBAR LINKS"
                        arabicLabel="لون روابط الهيدر"
                        description="لون نصوص وأزرار القائمة"
                        value={data.design.colors.navText || data.design.colors.text || "#ffffff"}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, navText: val } } }),
                            "Navbar Link Edit",
                            `Updated navbar text color to ${val}`
                          )
                        }
                      />

                      {/* 13. Category Badges Background */}
                      <HexColorPickerItem
                        label="BADGE BACKGROUND"
                        arabicLabel="خلفية الوسوم والتصنيفات"
                        description="خلفية تصنيفات المشاريع والمهارات"
                        value={data.design.colors.badgeBg || "#262626"}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, badgeBg: val } } }),
                            "Badge Bg Edit",
                            `Updated badge background to ${val}`
                          )
                        }
                      />

                      {/* 14. Category Badges Text */}
                      <HexColorPickerItem
                        label="BADGE TEXT COLOR"
                        arabicLabel="لون خط الوسوم والتصنيفات"
                        description="لون النص داخل بطاقات التصنيف"
                        value={data.design.colors.badgeText || data.design.colors.primary || "#8cff2e"}
                        onChange={(val) =>
                          updateData(
                            (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, badgeText: val } } }),
                            "Badge Text Edit",
                            `Updated badge text color to ${val}`
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Typography select */}
                  <div className="border-t border-white/5 pt-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-brand-green" />
                      Typography Pairing Controls
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2 bg-neutral-900/50 p-4 rounded-xl border border-white/5">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase">HEADING DISPLAY FONT</label>
                        <select
                          value={data.design.typography.headingFont}
                          onChange={(e) =>
                            updateData(
                              (prev) => ({ ...prev, design: { ...prev.design, typography: { ...prev.design.typography, headingFont: e.target.value } } }),
                              "Heading Font Edit",
                              `Switched titles font to ${e.target.value}`
                            )
                          }
                          className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white cursor-pointer"
                        >
                          <option value="Bebas Neue">Bebas Neue (Swiss Tech Bold)</option>
                          <option value="Space Grotesk">Space Grotesk (Neo-Brutalist)</option>
                          <option value="Inter">Inter (Swiss Minimalist)</option>
                          <option value="JetBrains Mono">JetBrains Mono (Developer Technical)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2 bg-neutral-900/50 p-4 rounded-xl border border-white/5">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase">BODY GENERAL CODES FONT</label>
                        <select
                          value={data.design.typography.bodyFont}
                          onChange={(e) =>
                            updateData(
                              (prev) => ({ ...prev, design: { ...prev.design, typography: { ...prev.design.typography, bodyFont: e.target.value } } }),
                              "Body Font Edit",
                              `Switched paragraphs font to ${e.target.value}`
                            )
                          }
                          className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white cursor-pointer"
                        >
                          <option value="Space Grotesk">Space Grotesk (Standard Body)</option>
                          <option value="Inter">Inter (Swiss Minimalist)</option>
                          <option value="JetBrains Mono">JetBrains Mono (Developer Technical)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Layout spacing control sliders */}
                  <div className="border-t border-white/5 pt-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
                      <Sliders size={14} className="text-brand-green" />
                      Dynamic Spacing Layout Sliders
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Section Padding Top/Bottom Y */}
                      <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold uppercase">
                          <span>SECTION PADDING Y (PX)</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="500"
                              value={data.design?.layout?.paddingTop ?? 128}
                              onChange={(e) => {
                                const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                                const clamped = isNaN(val) ? 0 : val;
                                updateData((prev) => ({
                                  ...prev,
                                  design: {
                                    ...prev.design,
                                    layout: { ...prev.design.layout, paddingTop: clamped, paddingBottom: clamped },
                                  },
                                }));
                              }}
                              className="w-16 bg-neutral-950 border border-white/20 rounded px-1.5 py-0.5 text-xs text-brand-green font-mono font-bold text-right focus:outline-none focus:border-brand-green"
                            />
                            <span className="text-brand-green font-mono text-xs font-bold">px</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="250"
                          value={data.design?.layout?.paddingTop ?? 128}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            updateData((prev) => ({
                              ...prev,
                              design: {
                                ...prev.design,
                                layout: { ...prev.design.layout, paddingTop: val, paddingBottom: val },
                              },
                            }));
                          }}
                          className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-green"
                        />
                        <span className="text-[9px] text-neutral-400 uppercase">Top & Bottom section padding</span>
                      </div>

                      {/* Section gap Desktop / Laptop */}
                      <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold uppercase">
                          <span>SECTION GAP - LAPTOP / DESKTOP (PX)</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="800"
                              value={data.design?.layout?.sectionGap ?? 250}
                              onChange={(e) => {
                                const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                                const clamped = isNaN(val) ? 0 : val;
                                updateData((prev) => ({
                                  ...prev,
                                  design: {
                                    ...prev.design,
                                    layout: { ...prev.design.layout, sectionGap: clamped },
                                  },
                                }));
                              }}
                              className="w-16 bg-neutral-950 border border-white/20 rounded px-1.5 py-0.5 text-xs text-brand-green font-mono font-bold text-right focus:outline-none focus:border-brand-green"
                            />
                            <span className="text-brand-green font-mono text-xs font-bold">px</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="500"
                          value={data.design?.layout?.sectionGap ?? 250}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            updateData((prev) => ({
                              ...prev,
                              design: {
                                ...prev.design,
                                layout: { ...prev.design.layout, sectionGap: val },
                              },
                            }));
                          }}
                          className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-green"
                        />
                        <span className="text-[9px] text-neutral-400 uppercase">Spacing on screens ≥ 768px</span>
                      </div>

                      {/* Section gap Mobile / Tablet */}
                      <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold uppercase">
                          <span>SECTION GAP - PHONE / TABLET (PX)</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="400"
                              value={data.design?.layout?.sectionGapMobile ?? 100}
                              onChange={(e) => {
                                const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                                const clamped = isNaN(val) ? 0 : val;
                                updateData((prev) => ({
                                  ...prev,
                                  design: {
                                    ...prev.design,
                                    layout: { ...prev.design.layout, sectionGapMobile: clamped },
                                  },
                                }));
                              }}
                              className="w-16 bg-neutral-950 border border-white/20 rounded px-1.5 py-0.5 text-xs text-brand-green font-mono font-bold text-right focus:outline-none focus:border-brand-green"
                            />
                            <span className="text-brand-green font-mono text-xs font-bold">px</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="250"
                          value={data.design?.layout?.sectionGapMobile ?? 100}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            updateData((prev) => ({
                              ...prev,
                              design: {
                                ...prev.design,
                                layout: { ...prev.design.layout, sectionGapMobile: val },
                              },
                            }));
                          }}
                          className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-green"
                        />
                        <span className="text-[9px] text-neutral-400 uppercase">Spacing on screens &lt; 768px</span>
                      </div>

                      {/* Paragraph Spacing Gap */}
                      <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold uppercase">
                          <span>PARAGRAPH SPACING GAP (PX)</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="200"
                              value={data.design?.layout?.paragraphGap ?? 24}
                              onChange={(e) => {
                                const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                                const clamped = isNaN(val) ? 0 : val;
                                updateData((prev) => ({
                                  ...prev,
                                  design: {
                                    ...prev.design,
                                    layout: { ...prev.design.layout, paragraphGap: clamped },
                                  },
                                }));
                              }}
                              className="w-16 bg-neutral-950 border border-white/20 rounded px-1.5 py-0.5 text-xs text-brand-green font-mono font-bold text-right focus:outline-none focus:border-brand-green"
                            />
                            <span className="text-brand-green font-mono text-xs font-bold">px</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="8"
                          max="120"
                          value={data.design?.layout?.paragraphGap ?? 24}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            updateData((prev) => ({
                              ...prev,
                              design: {
                                ...prev.design,
                                layout: { ...prev.design.layout, paragraphGap: val },
                              },
                            }));
                          }}
                          className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-green"
                        />
                        <span className="text-[9px] text-neutral-400 uppercase">Distance between biography/text paragraphs</span>
                      </div>

                      {/* Heading Spacing Gap - Laptop/Desktop */}
                      <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold uppercase">
                          <span>TITLE / HEADING SPACING GAP - LAPTOP / DESKTOP (PX)</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="200"
                              value={data.design?.layout?.headingGap ?? 24}
                              onChange={(e) => {
                                const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                                const clamped = isNaN(val) ? 0 : val;
                                updateData((prev) => ({
                                  ...prev,
                                  design: {
                                    ...prev.design,
                                    layout: { ...prev.design.layout, headingGap: clamped },
                                  },
                                }));
                              }}
                              className="w-16 bg-neutral-950 border border-white/20 rounded px-1.5 py-0.5 text-xs text-brand-green font-mono font-bold text-right focus:outline-none focus:border-brand-green"
                            />
                            <span className="text-brand-green font-mono text-xs font-bold">px</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="8"
                          max="150"
                          value={data.design?.layout?.headingGap ?? 24}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            updateData((prev) => ({
                              ...prev,
                              design: {
                                ...prev.design,
                                layout: { ...prev.design.layout, headingGap: val },
                              },
                            }));
                          }}
                          className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-green"
                        />
                        <span className="text-[9px] text-neutral-400 uppercase">Distance between headings and content on desktop</span>
                      </div>

                      {/* Heading Spacing Gap - Phone/Tablet */}
                      <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold uppercase">
                          <span>TITLE / HEADING SPACING GAP - PHONE / TABLET (PX)</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="150"
                              value={data.design?.layout?.headingGapMobile ?? 16}
                              onChange={(e) => {
                                const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                                const clamped = isNaN(val) ? 0 : val;
                                updateData((prev) => ({
                                  ...prev,
                                  design: {
                                    ...prev.design,
                                    layout: { ...prev.design.layout, headingGapMobile: clamped },
                                  },
                                }));
                              }}
                              className="w-16 bg-neutral-950 border border-white/20 rounded px-1.5 py-0.5 text-xs text-brand-green font-mono font-bold text-right focus:outline-none focus:border-brand-green"
                            />
                            <span className="text-brand-green font-mono text-xs font-bold">px</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="100"
                          value={data.design?.layout?.headingGapMobile ?? 16}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            updateData((prev) => ({
                              ...prev,
                              design: {
                                ...prev.design,
                                layout: { ...prev.design.layout, headingGapMobile: val },
                              },
                            }));
                          }}
                          className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-green"
                        />
                        <span className="text-[9px] text-neutral-400 uppercase">Distance between headings and content on screens &lt; 768px</span>
                      </div>
                    </div>
                  </div>

                  {/* Password settings security */}
                  <div className="border-t border-white/5 pt-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
                      <Settings size={14} className="text-brand-green" />
                      CMS Security Settings
                    </h3>
                    <div className="flex flex-col gap-2 bg-neutral-900/50 p-4 rounded-xl border border-white/5 max-w-md">
                      <label className="text-[10px] text-neutral-400 font-bold uppercase">CUSTOM SECURE PASSCODE</label>
                      <input
                        type="text"
                        value={data.settings?.passcode || "admin"}
                        onChange={(e) =>
                          updateData(
                            (prev) => ({ ...prev, settings: { ...prev.settings, passcode: e.target.value } }),
                            "Passcode Change",
                            "Changed secure CMS workspace passkey"
                          )
                        }
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-brand-green"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                 TAB: MEDIA LIBRARY
               ══════════════════════════════════════════ */}
            {activeTab === "media" && (
              <motion.div
                key="media"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6 text-left"
              >
                <div>
                  <h1 className="font-bebas text-4xl tracking-widest text-white">PORTFOLIO MEDIA LIBRARY</h1>
                  <p className="text-neutral-400 text-xs tracking-wider uppercase mt-1">
                    Upload physical files directly. Copy their static paths to use inside thumbnails, gallery layouts, or hero banners.
                  </p>
                </div>

                {/* Drag Drop Area */}
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                    isDraggingFile
                      ? "border-brand-green bg-brand-green/5 shadow-[0_0_30px_rgba(140,255,46,0.1)]"
                      : "border-white/10 hover:border-brand-green/40 hover:bg-white/2"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        await handleMediaUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-xl bg-neutral-950 flex items-center justify-center text-brand-green mb-4 border border-white/5">
                    <Upload size={20} className="animate-bounce" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-1">
                    Drag and drop media file here
                  </h3>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                    Or click to browse local files (Supports JPEG, PNG, WEBP, GIF, SVG, MP4)
                  </p>
                </div>

                {/* Search / Filter Media list */}
                <div className="flex items-center gap-3 bg-neutral-950/40 border border-white/5 p-4 rounded-xl">
                  <Search size={16} className="text-neutral-500" />
                  <input
                    type="text"
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    placeholder="Search discovered media files..."
                    className="bg-transparent text-xs text-white outline-none w-full font-mono uppercase"
                  />
                </div>

                {/* Media Gallery List */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {discoveredMedia
                    .filter((m) => m.toLowerCase().includes(mediaSearch.toLowerCase()))
                    .map((path, idx) => (
                      <div
                        key={idx}
                        className="bg-neutral-950/40 border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between gap-3 group overflow-hidden"
                      >
                        <div className="aspect-[16/11] rounded-lg overflow-hidden bg-neutral-900 border border-white/10 flex items-center justify-center relative">
                          <img
                            src={path}
                            alt=""
                            className="w-full h-full object-cover select-none pointer-events-none"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-mono text-neutral-400 select-all font-bold break-all bg-neutral-950/80 px-2 py-1 rounded truncate leading-none uppercase">
                            {path}
                          </span>
                          <button
                            onClick={() => copyToClipboard(path)}
                            className="w-full bg-neutral-900 border border-white/10 hover:border-brand-green/30 hover:text-brand-green text-[9px] font-bold uppercase tracking-widest py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Copy size={11} />
                            COPY PATH URL
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                 TAB: CMS GUIDELINES & ARABIC HELP MANUAL
               ══════════════════════════════════════════ */}
            {activeTab === "docs" && (
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-8 text-right"
                dir="rtl"
              >
                {/* Section Header */}
                <div className="flex flex-col gap-2 border-b border-white/10 pb-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-green/20 border border-brand-green/40 flex items-center justify-center text-brand-green">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h1 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white">
                          دليل التحكم والتعليمات الشاملة (HELP & GUIDELINES)
                        </h1>
                        <p className="text-neutral-400 text-xs font-sans mt-0.5">
                          تعليمات تفصيلية باللغة العربية للحفاظ على كافة محتويات وصور وإعدادات الموقع عند التعامل مع الذكاء الاصطناعي و GitHub Pages.
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-brand-green/10 border border-brand-green/30 text-brand-green text-[11px] font-bold rounded-lg font-mono">
                      نسخة دليلك الشامل v2.0
                    </span>
                  </div>
                </div>

                {/* Main Instruction Cards Stack */}
                <div className="flex flex-col gap-6 text-sm font-sans text-neutral-200 leading-relaxed">
                  
                  {/* CARD 1: Why changes reset on fresh sessions / GitHub Pages explanation */}
                  <div className="bg-neutral-950/60 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-brand-green" />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-brand-green shrink-0">
                        <AlertCircle size={18} />
                      </div>
                      <h2 className="text-lg font-bold text-white tracking-wide">
                        🔍 سبب ظهور التعديلات في متصفحك فقط وكيف يعمل النظام؟
                      </h2>
                    </div>

                    <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                      سبب هذه الظاهرة هو أن استضافة <strong className="text-brand-green">GitHub Pages</strong> هي استضافة للملفات الثابتة (<span className="font-mono text-neutral-300">Static Site Hosting</span>)، أي لا يوجد سيرفر أو قاعدة بيانات سحابية (<span className="font-mono text-neutral-300">Backend Server</span>) تعمل في الخلفية لحفظ البيانات وتمريرها تلقائياً لكل الزوار الجدد.
                    </p>

                    <div className="bg-neutral-900/90 border border-white/5 rounded-xl p-4 flex flex-col gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-brand-green mt-1.5 shrink-0" />
                        <div>
                          <strong className="text-white block mb-0.5">التعديل المحلي (LocalStorage):</strong>
                          <span className="text-neutral-400">عندما تقوم بالتعديل عبر لوحة التحكم <code className="bg-black/60 text-brand-green px-1.5 py-0.5 rounded font-mono">#admin</code> في متصفحك، يتم حفظ التعديلات فوراً في الذاكرة المحلية لمتصفحك فقط (<span className="font-mono">LocalStorage</span>).</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-brand-green mt-1.5 shrink-0" />
                        <div>
                          <strong className="text-white block mb-0.5">القراءة عند الزوار الجدد:</strong>
                          <span className="text-neutral-400">عند فتح الموقع من نافذة جديدة أو متصفح آخر أو جهاز آخر، يقوم الموقع بقراءة البيانات الافتراضية المرفوعة في ملف <code className="bg-black/60 text-brand-green px-1.5 py-0.5 rounded font-mono">src/defaultData.ts</code> المرفوع على GitHub.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: Prompt instructions for Google AI Studio & AI tools */}
                  <div className="bg-neutral-950/60 border border-brand-green/30 rounded-2xl p-6 flex flex-col gap-4 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-green/20 border border-brand-green/40 flex items-center justify-center text-brand-green shrink-0">
                          <Sparkles size={18} />
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-wide">
                          🤖 طريقة توجيه الذكاء الاصطناعي (Google AI Studio أو أي أداة أخرى) للحفاظ على المحتوى
                        </h2>
                      </div>
                      <span className="px-2.5 py-1 bg-brand-green/10 text-brand-green text-[10px] font-bold rounded-full font-mono uppercase">
                        هام للتحديثات المستقبلية
                      </span>
                    </div>

                    <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                      عند استخدام <strong className="text-white">Google AI Studio</strong> أو أي أداة ذكاء اصطناعي أخرى لتطوير الموقع أو إضافة أجزاء ومميزات جديدة في المستقبل، اتبع الخطوات التالية للحفاظ على جميع المشاريع، النصوص، والصور المرفوعة:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-neutral-900/80 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                        <span className="text-brand-green font-bold text-xs font-mono">01. تقديم ملف البيانات</span>
                        <p className="text-neutral-400 text-xs">
                          قم بتحميل ملف البيانات <code className="text-brand-green font-mono">defaultData.ts</code> من خيار <strong className="text-white">Dashboard Home</strong> وقدمه للذكاء الاصطناعي كمرجع أساسي.
                        </p>
                      </div>

                      <div className="bg-neutral-900/80 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                        <span className="text-brand-green font-bold text-xs font-mono">02. التأكيد في المطالبة</span>
                        <p className="text-neutral-400 text-xs">
                          اطلب صراحةً من الذكاء الاصطناعي الاعتماد على <code className="text-brand-green font-mono">src/defaultData.ts</code> وعدم إعادة كتابة أو مسح المحتوى القديم.
                        </p>
                      </div>

                      <div className="bg-neutral-900/80 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                        <span className="text-brand-green font-bold text-xs font-mono">03. حفظ الصور في المشروع</span>
                        <p className="text-neutral-400 text-xs">
                          ضع ملفات الصور الجديدة في مجلد <code className="text-brand-green font-mono">src/assets/images/</code> داخل مشروعك واستخدم مساراتها النسبية المباشرة.
                        </p>
                      </div>
                    </div>

                    {/* Copyable Prompt Box for User */}
                    <div className="bg-neutral-900/90 border border-brand-green/40 rounded-xl p-4 flex flex-col gap-3 mt-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-brand-green uppercase tracking-wider flex items-center gap-1.5 font-mono">
                          <Copy size={13} />
                          نص المطالبة الجاهز للنسخ والتقديم للذكاء الاصطناعي (PROMPT TEMPLATE):
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const promptText = `أريد إجراء التعديلات التالية على الموقع الإلكتروني الخاص بي: [اكتب التعديلات المطلوبة هنا].\n\nتنبيه هام جداً ورئيسي:\nيجب الحفاظ التام والكامل على جميع البيانات والمشاريع والصور والنصوص الموجودة داخل ملف src/defaultData.ts وملف src/data.ts دون حذف أو تغيير أي محتوى سابق، واعتماد هذه البيانات الحالية كمرجع أساسي لكل التعديلات البرمجية والتصميمية الجديدة.`;
                            copyToClipboard(promptText);
                          }}
                          className="px-3 py-1.5 bg-brand-green hover:bg-brand-green/90 text-neutral-950 font-bold text-xs rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-md shrink-0"
                        >
                          <Copy size={13} />
                          نسخ النص للذكاء الاصطناعي
                        </button>
                      </div>

                      <div className="bg-black/80 border border-white/10 rounded-lg p-3.5 text-xs text-neutral-200 font-sans leading-relaxed text-right select-all">
                        "أريد إجراء التعديلات التالية على الموقع الإلكتروني الخاص بي: <span className="text-brand-green font-bold">[اكتب التعديلات المطلوبة هنا]</span>.
                        <br /><br />
                        <strong className="text-white">تنبيه هام جداً ورئيسي:</strong>
                        <br />
                        يجب الحفاظ التام والكامل على جميع البيانات والمشاريع والصور والنصوص الموجودة داخل ملف <code className="text-brand-green font-mono">src/defaultData.ts</code> وملف <code className="text-brand-green font-mono">src/data.ts</code> دون حذف أو تغيير أي محتوى سابق، واعتماد هذه البيانات الحالية كمرجع أساسي لكل التعديلات البرمجية والتصميمية الجديدة."
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: Step by Step Guide to Permanently Save on GitHub */}
                  <div className="bg-neutral-950/60 border border-white/10 rounded-2xl p-6 flex flex-col gap-5 shadow-xl">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-brand-green shrink-0">
                        <FileText size={18} />
                      </div>
                      <h2 className="text-lg font-bold text-white tracking-wide">
                        💡 كيف تجعل التعديلات دائمة للجميع على GitHub؟ (خطوة بخطوة)
                      </h2>
                    </div>

                    <div className="flex flex-col gap-4 text-xs sm:text-sm">
                      {/* Step 1 */}
                      <div className="bg-neutral-900/60 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-brand-green text-neutral-950 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                            1
                          </span>
                          <strong className="text-white text-sm">الخطوة الأولى: استخراج التعديلات من لوحة التحكم</strong>
                        </div>
                        <ul className="space-y-2 pr-8 text-neutral-300 text-xs leading-relaxed">
                          <li>• قم بإجراء جميع التعديلات التي تريدها داخل لوحة التحكم <code className="text-brand-green bg-black/60 px-1.5 py-0.5 rounded font-mono">#admin</code>.</li>
                          <li>• في الصفحة الرئيسية للوحة التحكم (<strong className="text-white">Dashboard Home</strong>)، ستجد زراً باللون الأخضر باسم:</li>
                          <li className="pt-1">
                            <button
                              type="button"
                              onClick={handleDownloadDefaultDataTs}
                              className="px-4 py-2 bg-brand-green text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-md hover:scale-102"
                            >
                              <FileText size={14} />
                              DOWNLOAD defaultData.ts (FOR GITHUB)
                            </button>
                          </li>
                          <li className="text-neutral-400 pt-1">
                            • سيتم تحميل ملف بلمح البصر باسم <code className="text-brand-green font-mono">defaultData.ts</code> يحتوي على كل بياناتك وتعديلاتك وصورك الحالية.
                          </li>
                        </ul>
                      </div>

                      {/* Step 2 */}
                      <div className="bg-neutral-900/60 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-brand-green text-neutral-950 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                            2
                          </span>
                          <strong className="text-white text-sm">الخطوة الثانية: تحديث الملف والصور على GitHub</strong>
                        </div>
                        <ul className="space-y-2 pr-8 text-neutral-300 text-xs leading-relaxed">
                          <li>• اذهب إلى مستودعك على GitHub (مثال: <code className="text-brand-green font-mono">myweb</code>).</li>
                          <li>• ادخل إلى مجلد <code className="text-brand-green font-mono">src</code> ثم اضغط على ملف <code className="text-brand-green font-mono">defaultData.ts</code>.</li>
                          <li>• اضغط على زر التعديل (أيقونة القلم ✏️) وانسخ محتوى الملف الذي حملته بدلاً من القديم، أو اضغط على <strong className="text-white font-mono">Add file -&gt; Upload files</strong> وارفع ملف <code className="text-brand-green font-mono">defaultData.ts</code> الجديد فوق القديم.</li>
                          <li>• بالنسبة للصور الجديدة: قم بوضع الصور في مجلد <code className="text-brand-green font-mono">src/assets/images/</code> في مشروعك واستخدم مسارها (مثال: <code className="text-brand-green font-mono">src/assets/images/my-photo.jpg</code>).</li>
                          <li>• اضغط على <strong className="text-white font-mono">Commit changes</strong>.</li>
                        </ul>
                      </div>

                      {/* Conclusion banner */}
                      <div className="bg-brand-green/10 border border-brand-green/30 rounded-xl p-4 flex items-center gap-3">
                        <Check size={20} className="text-brand-green shrink-0" />
                        <p className="text-xs text-brand-green font-bold leading-relaxed">
                          بمجرد اكتمال الرفع على GitHub، سيقوم GitHub Actions بإعادة بناء الموقع وتحديثه تلقائياً خلال ثوانٍ معدودة، وتصبح جميع التعديلات والصور جديدة ومرئية بشكل دائم لكل الزوار ومن أي متصفح أو جهاز!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CARD 4: Quick Summary Checklist */}
                  <div className="bg-neutral-950/60 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-bebas text-lg">
                      <CheckSquare size={16} className="text-brand-green" />
                      ملخص سريع وخطوات الوصول المباشر
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
                      <div className="bg-neutral-900/50 p-3.5 rounded-xl border border-white/5 flex flex-col gap-1">
                        <strong className="text-white">رابط لوحة التحكم:</strong>
                        <span className="text-neutral-400 font-mono text-left dir-ltr">#admin</span>
                      </div>
                      <div className="bg-neutral-900/50 p-3.5 rounded-xl border border-white/5 flex flex-col gap-1">
                        <strong className="text-white">كلمة المرور الافتراضية:</strong>
                        <span className="text-brand-green font-mono font-bold">admin</span> (يمكن تغييرها من إعدادات التصميم)
                      </div>
                      <div className="bg-neutral-900/50 p-3.5 rounded-xl border border-white/5 flex flex-col gap-1">
                        <strong className="text-white">تحميل نسخة البيانات:</strong>
                        <span className="text-neutral-400">Dashboard Home -&gt; DOWNLOAD defaultData.ts</span>
                      </div>
                      <div className="bg-neutral-900/50 p-3.5 rounded-xl border border-white/5 flex flex-col gap-1">
                        <strong className="text-white">تعديل الملف على GitHub:</strong>
                        <span className="text-neutral-400">src/defaultData.ts</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
