import { useState, useRef } from "react";
import { useCMS } from "../context/CMSContext";
import { CMSSiteData, Project, ProjectDetail, Service, SkillItem, ActivityLog } from "../types/cms";
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
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function CMSImageField({
  label,
  value,
  onChange,
  onUploadSuccess,
  recommendedText,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onUploadSuccess?: (url: string) => void;
  recommendedText?: string;
}) {
  const { uploadFile } = useCMS();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col gap-2 p-3.5 rounded-xl text-left transition-all relative ${
        isDragging
          ? "bg-brand-green/10 border-2 border-dashed border-brand-green shadow-[0_0_15px_rgba(140,255,46,0.2)]"
          : "bg-neutral-900/60 border border-white/5"
      }`}
    >
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-neutral-300 font-bold uppercase tracking-wider">{label}</label>
        <div>
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
            accept="image/*,.svg,.webp,.gif,.jpg,.jpeg,.png,.pdf,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/assets/... or https://..."
        className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green font-mono"
      />

      <div className="flex items-center justify-between gap-2">
        {recommendedText ? (
          <span className="text-[9px] text-neutral-500 uppercase font-semibold">{recommendedText}</span>
        ) : <span />}
        <span className="text-[9px] text-brand-green/80 font-mono italic shrink-0">
          {isDragging ? "Drop file to upload!" : "Drag & drop file here"}
        </span>
      </div>

      {/* Live Preview Box */}
      {value ? (
        <div className="mt-1 bg-black/40 border border-white/10 rounded-lg p-2 flex items-center gap-3">
          <div className="w-16 h-12 rounded bg-neutral-900 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
            {value.toLowerCase().includes(".pdf") || value.startsWith("data:application/pdf") ? (
              <FileText className="text-brand-green w-6 h-6" />
            ) : (
              <img
                src={value}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.opacity = "0.3";
                }}
              />
            )}
          </div>
          <div className="overflow-hidden text-ellipsis flex-1">
            <span className="text-[9px] text-neutral-400 block font-mono truncate">{value}</span>
            <span className="text-[9px] text-brand-green block font-semibold">
              {value.toLowerCase().includes(".pdf") ? "Active PDF Document" : "Active Preview"}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-1 bg-neutral-950/50 border border-dashed border-white/10 rounded-lg p-2 text-center">
          <span className="text-[9px] text-neutral-500 uppercase font-mono">
            {isDragging ? "Release to upload file" : "No file set — Drag & drop image/file here"}
          </span>
        </div>
      )}
    </div>
  );
}

function CMSSingleRowEditor({
  rowTitle,
  images,
  onUpdateRowImages,
  onDeleteRow,
  onMoveRow,
  canDelete,
  canMoveUp,
  canMoveDown,
}: {
  rowTitle: string;
  images: string[];
  onUpdateRowImages: (newImgs: string[]) => void;
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
      f.type.startsWith("image/") || f.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
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
      if (item.type.startsWith("image/")) {
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
            {isDragging ? "Drop image(s) into this row!" : "Drag & Drop, Click Upload, or Copy & Paste (Ctrl+V)"}
          </span>
        </div>

        <p className="text-[10px] text-neutral-400">
          Paste image from clipboard directly (Ctrl+V) or drag & drop / click upload. Images resize dynamically to match!
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
              : "Upload Image File(s)"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.svg,.webp,.gif,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />

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
            {showRawText ? "Hide URLs" : "Raw URLs"}
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
          placeholder="Or paste image URL (e.g. assets/images/photo.png or https://...)"
          className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-green font-mono"
        />
        <button
          type="button"
          onClick={handleAddManualUrl}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-all shrink-0 flex items-center gap-1"
        >
          <Plus size={13} />
          Add URL
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
            {images.map((imgUrl, imgIdx) => (
              <div
                key={imgIdx}
                className="group relative aspect-video bg-neutral-900 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center"
              >
                <img
                  src={imgUrl}
                  alt={`Row item ${imgIdx + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.opacity = "0.3";
                  }}
                />

                <div className="absolute top-1 left-1 px-1 py-0.2 bg-black/80 text-brand-green text-[8px] font-mono font-bold rounded border border-brand-green/30">
                  #{imgIdx + 1}
                </div>

                <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1 text-center">
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
                  <span className="text-[7px] text-neutral-400 font-mono truncate max-w-full px-1">
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
  onUpdateSec,
  onRemoveSec,
}: {
  sec: { type: "grid" | "row"; label: string; images: string[]; rows?: { id?: string; images: string[] }[] };
  sIdx: number;
  onUpdateSec: (updated: { type: "grid" | "row"; label: string; images: string[]; rows?: { id?: string; images: string[] }[] }) => void;
  onRemoveSec: () => void;
}) {
  // Ensure rows array exists for grid type sections
  const rows: { id?: string; images: string[] }[] =
    sec.rows && sec.rows.length > 0
      ? sec.rows
      : [{ id: "row-1", images: sec.images || [] }];

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

            <button
              type="button"
              onClick={handleAddRow}
              className="px-3.5 py-2 bg-brand-green hover:bg-brand-green/90 text-neutral-950 font-bold text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-lg"
            >
              <Plus size={15} />
              + Add New Row to Grid
            </button>
          </div>

          {/* List of Rows */}
          <div className="flex flex-col gap-3">
            {rows.map((rowItem, rIdx) => (
              <CMSSingleRowEditor
                key={rowItem.id || rIdx}
                rowTitle={`ROW #${rIdx + 1}`}
                images={rowItem.images}
                onUpdateRowImages={(newImgs) => handleUpdateRowImages(rIdx, newImgs)}
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
          onUpdateRowImages={(newImgs) => onUpdateSec({ ...sec, images: newImgs })}
          onDeleteRow={onRemoveSec}
          canDelete={false}
        />
      )}
    </div>
  );
}

export function AdminCMS() {
  const { data, updateData, uploadFile, restoreBackup, logout } = useCMS();
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

  // We can scan siteData to discover what images/thumbnails currently exist on the site
  // and dynamically construct the media library gallery, plus add new uploaded files.
  const getDiscoveredMedia = () => {
    const mediaSet = new Set<string>();
    
    // Add default images
    mediaSet.add("/src/assets/images/MyPicture.jpg");
    mediaSet.add("/src/assets/images/HeroImage.svg");
    mediaSet.add("/src/assets/images/showreel-Thumbnail.png");

    // Add projects images
    data.projects.forEach((p) => {
      if (p.thumbnail) mediaSet.add(p.thumbnail);
    });
    data.allProjects.forEach((p) => {
      if (p.thumbnail) mediaSet.add(p.thumbnail);
    });
    data.projectDetails.forEach((d) => {
      if (d.heroImage) mediaSet.add(d.heroImage);
      d.sections.forEach((s) => {
        s.images.forEach((img) => mediaSet.add(img));
      });
    });

    // Add any dynamic uploads from logs
    data.activityLogs.forEach((log) => {
      if (log.details && log.details.includes("/uploads/")) {
        const match = log.details.match(/\/uploads\/[a-zA-Z0-9.\-_]+/);
        if (match) mediaSet.add(match[0]);
      }
    });

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

      setProjectEditForm({
        ...briefProj,
        ...detailProj,
        categories: initialCategories,
        videoUrl: detailProj?.videoUrl || "",
        shortDescription: detailProj?.shortDescription || (briefProj as any).description || "",
      });
      setSelectedProjectId(id);
      setIsCreatingNewProject(false);
    }
  };

  const startCreateProject = () => {
    const newId = Math.max(...data.allProjects.map((p) => p.id), 0) + 1;
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
      sections: [],
    } as any);
    setSelectedProjectId(null);
    setIsCreatingNewProject(true);
  };

  const handleSaveProject = async () => {
    if (!projectEditForm || !projectEditForm.id) return;

    const id = projectEditForm.id;
    const title = projectEditForm.title || "Untitled Project";

    await updateData(
      (prev) => {
        // Update basic project lists
        let allProjects = [...prev.allProjects];
        let featuredProjects = [...prev.projects];
        let projectDetails = [...prev.projectDetails];

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

    setIsCreatingNewProject(false);
    setProjectEditForm(null);
    setSelectedProjectId(null);
    showNotification(`Saved project: ${title} successfully!`);
  };

  const handleDuplicateProject = async (id: number) => {
    const srcBrief = data.allProjects.find((p) => p.id === id);
    const srcDetail = data.projectDetails.find((p) => p.id === id);
    if (!srcBrief) return;

    const newId = Math.max(...data.allProjects.map((p) => p.id), 0) + 1;
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
    const fileContent = `import { CMSSiteData } from "./types/cms";\n\nexport const defaultSiteData: CMSSiteData = ${JSON.stringify(data, null, 2)};\n`;
    const blob = new Blob([fileContent], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "defaultData.ts";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification("Downloaded defaultData.ts file for GitHub!", "success");
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

  return (
    <div className="flex min-h-screen bg-[#0d0d0d] text-neutral-100 font-grotesk overflow-x-hidden select-none selection:bg-brand-green selection:text-brand-black">
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

          <div className="flex items-center gap-4">
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
                    <p className="text-3xl font-bold font-mono text-brand-green mt-1">{data.allProjects.length}</p>
                  </div>
                  <div className="bg-neutral-950/40 border border-white/5 p-5 rounded-2xl">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Featured Slides</span>
                    <p className="text-3xl font-bold font-mono text-brand-green mt-1">{data.projects.length}</p>
                  </div>
                  <div className="bg-neutral-950/40 border border-white/5 p-5 rounded-2xl">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Toolbox Techs</span>
                    <p className="text-3xl font-bold font-mono text-brand-green mt-1">{data.aboutMe.skills.length}</p>
                  </div>
                  <div className="bg-neutral-950/40 border border-white/5 p-5 rounded-2xl">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Expertises</span>
                    <p className="text-3xl font-bold font-mono text-brand-green mt-1">{data.services.length}</p>
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
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">CLIENT BRAND NAME</label>
                        <input
                          type="text"
                          value={projectEditForm.client || ""}
                          onChange={(e) => setProjectEditForm((prev: any) => ({ ...prev, client: e.target.value }))}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-green"
                        />
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
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-brand-green font-bold uppercase tracking-wider">
                          PROJECT SUBPAGE HERO VIDEO SHOWREEL URL (FIRST VIDEO SHOWN IN DETAILS)
                        </label>
                        <input
                          type="text"
                          value={projectEditForm.videoUrl || ""}
                          onChange={(e) => setProjectEditForm((prev: any) => ({ ...prev, videoUrl: e.target.value }))}
                          placeholder="e.g. https://player.vimeo.com/video/123456789 or https://youtube.com/watch?v=..."
                          className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-green font-mono text-[11px]"
                        />
                        <span className="text-[9px] text-neutral-400 uppercase">Leave empty to use main portfolio showreel video.</span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-brand-green font-bold uppercase tracking-wider">
                          SUBPAGE PARAGRAPH NEXT TO TITLE (HERO DESCRIPTION)
                        </label>
                        <textarea
                          rows={3}
                          value={projectEditForm.shortDescription || ""}
                          onChange={(e) => setProjectEditForm((prev: any) => ({ ...prev, shortDescription: e.target.value }))}
                          placeholder="e.g. 247 MAINTENANCE IS A SMART APP THAT CONNECTS YOU WITH EXPERT TECHNICIANS..."
                          className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-green"
                        />
                        <span className="text-[9px] text-neutral-400 uppercase">Text paragraph displayed next to the main project title at top of subpage.</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">ROLE ON PROJECT</label>
                        <input
                          type="text"
                          value={projectEditForm.role || ""}
                          onChange={(e) => setProjectEditForm((prev: any) => ({ ...prev, role: e.target.value }))}
                          placeholder="e.g. STORYBOARD, ILLUSTRATION & ANIMATION"
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-green"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">DIRECT URL LINK (OPTIONAL)</label>
                        <input
                          type="text"
                          value={projectEditForm.link || ""}
                          onChange={(e) => setProjectEditForm((prev: any) => ({ ...prev, link: e.target.value }))}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-green font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <CMSImageField
                        label="THUMBNAIL IMAGE PATH"
                        value={projectEditForm.thumbnail || ""}
                        onChange={(val) => setProjectEditForm((prev: any) => ({ ...prev, thumbnail: val }))}
                      />

                      <CMSImageField
                        label="COVER HERO PATH (SUBPAGE)"
                        value={projectEditForm.heroImage || ""}
                        onChange={(val) => setProjectEditForm((prev: any) => ({ ...prev, heroImage: val }))}
                      />

                      <CMSImageField
                        label="HOVER GIF PATH (PREVIEW)"
                        value={projectEditForm.hoverGif || ""}
                        onChange={(val) => setProjectEditForm((prev: any) => ({ ...prev, hoverGif: val }))}
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
                        {projectEditForm.sections?.map((sec, sIdx) => (
                          <CMSGallerySectionEditor
                            key={sIdx}
                            sec={sec}
                            sIdx={sIdx}
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
                          />
                        ))}
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

                  {/* Social links URL manager */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Social profile URLs</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.socials.map((soc, sIdx) => (
                        <div key={sIdx} className="bg-neutral-900/50 border border-white/5 p-4 rounded-xl flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider">{soc.name} URL</span>
                          <input
                            type="text"
                            value={soc.href}
                            onChange={(e) => {
                              const list = [...data.socials];
                              list[sIdx].href = e.target.value;
                              updateData((prev) => ({ ...prev, socials: list }), "Social Link Edit", `Updated URL for ${soc.name}`);
                            }}
                            className="w-full bg-neutral-950 border border-white/15 rounded px-3 py-2 text-xs font-mono"
                          />
                        </div>
                      ))}
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
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
                      <Palette size={14} className="text-brand-green" />
                      Dynamic Color Palette Picks
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Primary brand green */}
                      <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 flex flex-col gap-2">
                        <span className="text-[10px] text-neutral-400 font-bold uppercase">PRIMARY HIGHLIGHT</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={data.design.colors.primary}
                            onChange={(e) =>
                              updateData(
                                (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, primary: e.target.value } } }),
                                "Primary Color Edit",
                                `Updated highlight color to ${e.target.value}`
                              )
                            }
                            className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                          />
                          <span className="text-xs font-mono font-bold text-white uppercase">{data.design.colors.primary}</span>
                        </div>
                      </div>

                      {/* Main Background */}
                      <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 flex flex-col gap-2">
                        <span className="text-[10px] text-neutral-400 font-bold uppercase">CANVAS BACKGROUND</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={data.design.colors.background}
                            onChange={(e) =>
                              updateData(
                                (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, background: e.target.value } } }),
                                "Background Color Edit",
                                "Modified site main background color"
                              )
                            }
                            className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                          />
                          <span className="text-xs font-mono font-bold text-white uppercase">{data.design.colors.background}</span>
                        </div>
                      </div>

                      {/* Body Texts */}
                      <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 flex flex-col gap-2">
                        <span className="text-[10px] text-neutral-400 font-bold uppercase">PARAGRAPH TEXTS</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={data.design.colors.text}
                            onChange={(e) =>
                              updateData(
                                (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, text: e.target.value } } }),
                                "Text Color Edit",
                                "Modified global text color parameter"
                              )
                            }
                            className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                          />
                          <span className="text-xs font-mono font-bold text-white uppercase">{data.design.colors.text}</span>
                        </div>
                      </div>

                      {/* Card Boxes */}
                      <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 flex flex-col gap-2">
                        <span className="text-[10px] text-neutral-400 font-bold uppercase">CARD SHELLS</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={data.design.colors.card}
                            onChange={(e) =>
                              updateData(
                                (prev) => ({ ...prev, design: { ...prev.design, colors: { ...prev.design.colors, card: e.target.value } } }),
                                "Card Color Edit",
                                "Modified dashboard portfolio card shell colors"
                              )
                            }
                            className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                          />
                          <span className="text-xs font-mono font-bold text-white uppercase">{data.design.colors.card}</span>
                        </div>
                      </div>
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
                                    layout: { ...prev.design.layout, paddingTop: clamped, paddingBottom: Math.round(clamped * 0.75) },
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
                                layout: { ...prev.design.layout, paddingTop: val, paddingBottom: Math.round(val * 0.75) },
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
                 TAB: CMS GUIDELINES (DOCUMENTATION)
               ══════════════════════════════════════════ */}
            {activeTab === "docs" && (
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6 text-left"
              >
                <div>
                  <h1 className="font-bebas text-4xl tracking-widest text-white">CMS GUIDELINES & MANUAL</h1>
                  <p className="text-neutral-400 text-xs tracking-wider uppercase mt-1">A simple reference for managing the website, zero programming knowledge required.</p>
                </div>

                <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6 space-y-6 text-xs uppercase leading-relaxed text-neutral-300 font-semibold">
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="text-brand-green font-bold text-sm tracking-wider mb-2">1. How everything works</h3>
                    <p className="text-neutral-400">
                      The portfolio has been transformed from hardcoded values into a dynamic, content-driven website. All contents (texts, project details, margins, skills, and image paths) are loaded directly from a local database server file. When you alter any text, slide, or slider, the change is saved into <code className="font-mono text-neutral-200">data.json</code> on the physical server, instantly applying the update.
                    </p>
                  </div>

                  <div className="border-b border-white/5 pb-4">
                    <h3 className="text-brand-green font-bold text-sm tracking-wider mb-2">2. How to create new projects</h3>
                    <p className="text-neutral-400">
                      Go to the <strong className="text-white">"Projects System"</strong> tab. Use <strong className="text-white">"MANAGE CATEGORIES"</strong> to add new custom category tags or rename existing tags across all projects. Click the <strong className="text-white">"+ CREATE NEW WORK"</strong> button to add a project. Enter the title, select one or more categories, role descriptions, client tags, and thumbnail URLs. Enable the <strong className="text-white">"Publish Project"</strong> checkbox. If you want the project to also appear in the homepage slider, check <strong className="text-white">"Featured Slider"</strong>. Save changes, and the subpage will be automatically created.
                    </p>
                  </div>

                  <div className="border-b border-white/5 pb-4">
                    <h3 className="text-brand-green font-bold text-sm tracking-wider mb-2">3. Media library uploads</h3>
                    <p className="text-neutral-400">
                      Navigate to the <strong className="text-white">"Media Library"</strong> tab. Drag and drop any image/video from your desktop or select files to upload them directly to the server. Under the uploaded card, copy the generated URL path (e.g. <code className="font-mono text-neutral-200">/uploads/file.png</code>) and paste it into any thumbnail, section cover, or hero input fields inside the editor.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-brand-green font-bold text-sm tracking-wider mb-2">4. Backing up and restoring</h3>
                    <p className="text-neutral-400">
                      To keep your data safe, regularly navigate to <strong className="text-white">"Dashboard Home"</strong> and download your database backup file (<code className="font-mono text-neutral-200">portfolio-cms-backup.json</code>). You can transfer this backup file onto any machine or use the <strong className="text-white">"Upload JSON Restore"</strong> file loader to instantly recover your pages and settings.
                    </p>
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
