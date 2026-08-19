import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Image as ImageIcon,
  Calendar,
  Clock,
  Upload,
  Plus,
  Check,
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
  editItem,
  onUpdateItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<ScrapbookItem, "id" | "x" | "y" | "zIndex">) => void;
  editItem?: ScrapbookItem | null;
  onUpdateItem?: (updated: ScrapbookItem) => void;
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

  // Populate state when editItem changes
  useEffect(() => {
    if (editItem) {
      setActiveTab(editItem.type);
      setTitle(editItem.title || "");
      setContent(editItem.content || "");
      setPaperStyle(editItem.paperStyle || "lined-notebook");
      setAttachment(editItem.attachment || "paperclip-pink");
      if (editItem.imageUrl) setPhotoUrl(editItem.imageUrl);
      if (editItem.type === "photo") setPhotoCaption(editItem.title || "");
    } else {
      setTitle("");
      setContent("");
      setPaperStyle("lined-notebook");
      setAttachment("paperclip-pink");
    }
  }, [editItem, isOpen]);

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

    if (editItem && onUpdateItem) {
      if (activeTab === "note") {
        onUpdateItem({
          ...editItem,
          paperStyle,
          title: title.trim() || "Untitled Note",
          content: content.trim() || "",
          attachment,
        });
      } else {
        onUpdateItem({
          ...editItem,
          title: photoCaption.trim() || "Captured Moment",
          imageUrl: photoUrl,
          attachment,
        });
      }
    } else {
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
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
              ✨
            </div>
            <h2 className="font-bold text-base text-slate-900">
              {editItem ? "Edit Item" : "Add to Journal"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Selection (Note vs Photo) */}
        {!editItem && (
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
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              Notice Paper / Note
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
              <ImageIcon className="w-3.5 h-3.5 text-cyan-500" />
              Photo Frame
            </button>
          </div>
        )}

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4 flex-1">
          {activeTab === "note" ? (
            <>
              {/* Paper Texture Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Select Paper Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "lined-notebook", label: "Notebook" },
                      { id: "sticky-yellow", label: "Yellow Sticky" },
                      { id: "sticky-green", label: "Green Sticky" },
                      { id: "sticky-pink", label: "Pink Sticky" },
                      { id: "graph-paper", label: "Graph Grid" },
                      { id: "spiral-pad", label: "Spiral Pad" },
                    ] as const
                  ).map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setPaperStyle(style.id)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        paperStyle === style.id
                          ? "bg-amber-600 text-white border-amber-600 shadow"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Note Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Morning Reflections"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Content Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Message / Body Text</label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your notice or thought here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition-all font-sans resize-none"
                />
              </div>
            </>
          ) : (
            <>
              {/* Photo Upload / Image Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Photo Image</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-all">
                    <Upload className="w-4 h-4 text-amber-600" />
                    <span>Upload Image File</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Photo Caption Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Photo Caption</label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="Caption for this photo..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </>
          )}

          {/* Decorative Accessory Attachment Picker */}
          <div className="flex flex-col gap-1.5 pt-1">
            <label className="text-xs font-semibold text-slate-700">Clip / Tape Attachment</label>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { id: "paperclip-pink", label: "📎 Pink Clip" },
                  { id: "paperclip-green", label: "📎 Green Clip" },
                  { id: "tape-cyan", label: "🩹 Cyan Tape" },
                  { id: "tape-yellow", label: "🩹 Yellow Tape" },
                  { id: "pushpin-red", label: "📌 Red Pin" },
                  { id: "pushpin-yellow", label: "📌 Yellow Pin" },
                  { id: "none", label: "❌ None" },
                ] as const
              ).map((att) => (
                <button
                  key={att.id}
                  type="button"
                  onClick={() => setAttachment(att.id)}
                  className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition-all ${
                    attachment === att.id
                      ? "bg-slate-900 text-white border-slate-900 shadow"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {att.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time Inputs */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-500">Date Stamp</label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-700"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-500">Time Stamp</label>
              <div className="relative flex items-center">
                <Clock className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            {editItem ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{editItem ? "Save Changes" : "Pin to Journal Page"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
