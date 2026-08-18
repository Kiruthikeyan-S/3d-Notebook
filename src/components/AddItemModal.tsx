import React, { useState } from "react";
import {
  X,
  FileText,
  Image as ImageIcon,
  Calendar,
  Clock,
  Upload,
  Plus,
} from "lucide-react";
import type {
  ScrapbookItem,
  PaperStyle,
  AttachmentType,
} from "./ScrapbookCanvas";

export const AddItemModal = ({
  isOpen,
  onClose,
  onAddItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<ScrapbookItem, "id" | "x" | "y" | "zIndex">) => void;
}) => {
  const [activeTab, setActiveTab] = useState<"note" | "photo">("note");

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [paperStyle, setPaperStyle] = useState<PaperStyle>("lined-notebook");
  const [attachment, setAttachment] = useState<AttachmentType>("paperclip-pink");
  const attachmentPosition = "top-left";
  const [dateStr, setDateStr] = useState(
    new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  );
  const [timeStr, setTimeStr] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  // Photo State
  const [photoUrl, setPhotoUrl] = useState<string>(
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
  );
  const [photoCaption, setPhotoCaption] = useState("Summer Memories ✨");

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = `${dateStr} • ${timeStr}`;

    if (activeTab === "note") {
      onAddItem({
        type: "note",
        width: paperStyle.startsWith("sticky") ? 210 : 240,
        rotation: Math.floor(Math.random() * 12) - 6,
        paperStyle,
        title: title.trim() || "Untitled Note",
        content: content.trim() || "Remember to keep creativity flowing everyday!",
        dateStr: formattedDate,
        attachment,
        attachmentPosition,
      });
    } else {
      onAddItem({
        type: "photo",
        width: 220,
        rotation: Math.floor(Math.random() * 14) - 7,
        paperStyle: "polaroid",
        title: photoCaption.trim() || "Captured Moment",
        imageUrl: photoUrl,
        dateStr: formattedDate,
        attachment,
        attachmentPosition,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              +
            </div>
            <h2 className="font-bold text-base text-slate-900">Add to Scrapbook</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 p-2 bg-slate-100/60 gap-2 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("note")}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "note"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-4 h-4 text-amber-500" />
            Notice / Note Paper
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("photo")}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "photo"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ImageIcon className="w-4 h-4 text-cyan-500" />
            Photo Frame
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-5">
          {/* TAB 1: NOTE PAPER */}
          {activeTab === "note" && (
            <>
              {/* Paper Style Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-700">Select Paper Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "lined-notebook", label: "Lined Notebook", bg: "bg-white border-slate-300 text-slate-800" },
                    { id: "graph-paper", label: "Graph Grid", bg: "bg-slate-50 border-slate-300 text-slate-800" },
                    { id: "spiral-pad", label: "Spiral Notepad", bg: "bg-white border-slate-300 text-slate-800" },
                    { id: "sticky-yellow", label: "Yellow Sticky", bg: "bg-yellow-200 border-yellow-300 text-yellow-900" },
                    { id: "sticky-green", label: "Green Sticky", bg: "bg-green-200 border-green-300 text-green-900" },
                    { id: "sticky-pink", label: "Pink Sticky", bg: "bg-pink-200 border-pink-300 text-pink-900" },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setPaperStyle(style.id as PaperStyle)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${style.bg} ${
                        paperStyle === style.id ? "ring-2 ring-amber-500 scale-[1.02]" : "hover:opacity-90"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Content */}
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title / Notice Heading..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note body text..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </>
          )}

          {/* TAB 2: PHOTO FRAME */}
          {activeTab === "photo" && (
            <>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-slate-700">Upload Photo or Pick Preset</label>
                
                {/* File Upload Input */}
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-cyan-400 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100/60 transition-all text-slate-500">
                  <Upload className="w-6 h-6 text-cyan-500 mb-1" />
                  <span className="text-xs font-medium">Click to upload photo from your device</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                {/* Photo Preview & Caption Input */}
                <div className="flex items-center gap-4 bg-slate-100 p-3 rounded-2xl">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="Photo caption..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>
            </>
          )}

          {/* DATE & TIME PICKER */}
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full bg-transparent text-slate-800 font-mono text-[11px] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="w-full bg-transparent text-slate-800 font-mono text-[11px] focus:outline-none"
              />
            </div>
          </div>

          {/* ATTACHMENT ACCESSORIES (PAPERCLIP, WASHI TAPE, PUSHPIN) */}
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Attachment Accessory (Pins & Tapes)</span>
              <span className="text-[11px] text-slate-400 font-mono">Select clip or tape</span>
            </label>

            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "paperclip-pink", label: "Pink Clip", icon: "📎" },
                { id: "paperclip-green", label: "Green Clip", icon: "📎" },
                { id: "paperclip-yellow", label: "Yellow Clip", icon: "📎" },
                { id: "tape-cyan", label: "Cyan Tape", icon: "🩹" },
                { id: "tape-pink", label: "Pink Tape", icon: "🩹" },
                { id: "pushpin-red", label: "Red Pin", icon: "📌" },
                { id: "pushpin-yellow", label: "Yellow Pin", icon: "📌" },
                { id: "none", label: "None", icon: "❌" },
              ].map((att) => (
                <button
                  key={att.id}
                  type="button"
                  onClick={() => setAttachment(att.id as AttachmentType)}
                  className={`p-2 rounded-xl border text-[11px] flex flex-col items-center gap-1 transition-all ${
                    attachment === att.id
                      ? "bg-slate-900 text-white font-medium border-slate-900 shadow-md"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-base">{att.icon}</span>
                  <span className="truncate w-full text-center">{att.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item to Page</span>
          </button>
        </form>
      </div>
    </div>
  );
};
