import React, { useRef } from "react";
import { Trash2, Move, Sparkles, Pencil } from "lucide-react";

export type PaperStyle =
  | "sticky-yellow"
  | "sticky-green"
  | "sticky-pink"
  | "sticky-blue"
  | "lined-notebook"
  | "graph-paper"
  | "spiral-pad"
  | "torn-paper"
  | "clipboard"
  | "polaroid";

export type AttachmentType =
  | "none"
  | "paperclip-pink"
  | "paperclip-green"
  | "paperclip-yellow"
  | "paperclip-silver"
  | "tape-cyan"
  | "tape-pink"
  | "tape-yellow"
  | "pushpin-red"
  | "pushpin-yellow";

export interface ScrapbookItem {
  id: string;
  type: "note" | "photo";
  x: number;
  y: number;
  width: number;
  rotation: number;
  paperStyle: PaperStyle;
  title?: string;
  content?: string;
  dateStr?: string;
  imageUrl?: string;
  attachment: AttachmentType;
  attachmentPosition: "top-left" | "top-right" | "top-center" | "both-corners";
  zIndex: number;
}

// Render Decorative Attachment SVG (Washi Tape, Paperclip, Pushpin)
export const RenderAttachment = ({
  type,
  position,
}: {
  type: AttachmentType;
  position: "top-left" | "top-right" | "top-center" | "both-corners";
}) => {
  if (type === "none") return null;

  const renderSingleAttachment = (t: AttachmentType, key: string, customClass: string) => {
    if (t.startsWith("tape")) {
      const colorMap: Record<string, string> = {
        "tape-cyan": "bg-cyan-400/70 border-cyan-300",
        "tape-pink": "bg-pink-400/70 border-pink-300",
        "tape-yellow": "bg-yellow-400/70 border-yellow-300",
      };
      const colorClass = colorMap[t] || "bg-pink-400/70 border-pink-300";

      return (
        <div
          key={key}
          className={`absolute h-5 w-16 ${colorClass} border-y border-dashed backdrop-blur-[1px] shadow-sm transform -rotate-12 z-30 pointer-events-none ${customClass}`}
          style={{
            clipPath:
              "polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)",
            opacity: 0.85,
          }}
        />
      );
    }

    if (t.startsWith("paperclip")) {
      const strokeMap: Record<string, string> = {
        "paperclip-pink": "#ec4899",
        "paperclip-green": "#22c55e",
        "paperclip-yellow": "#eab308",
        "paperclip-silver": "#94a3b8",
      };
      const strokeColor = strokeMap[t] || "#ec4899";

      return (
        <div key={key} className={`absolute z-30 pointer-events-none ${customClass}`}>
          <svg width="24" height="42" viewBox="0 0 24 42" fill="none" className="drop-shadow-md">
            <path
              d="M16 8V30C16 34.4183 12.4183 38 8 38C3.58172 38 0 34.4183 0 30V10C0 6.68629 2.68629 4 6 4C9.31371 4 12 6.68629 12 10V28C12 29.1046 11.1046 30 10 30C8.89543 30 8 29.1046 8 28V12"
              stroke={strokeColor}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    }

    if (t.startsWith("pushpin")) {
      const fillMap: Record<string, string> = {
        "pushpin-red": "#ef4444",
        "pushpin-yellow": "#eab308",
      };
      const fillColor = fillMap[t] || "#ef4444";

      return (
        <div key={key} className={`absolute z-30 pointer-events-none ${customClass}`}>
          <div className="relative flex items-center justify-center">
            <div
              className="w-4 h-4 rounded-full shadow-md border-2 border-white/60"
              style={{ backgroundColor: fillColor }}
            />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-white/70 top-0.5 left-0.5" />
          </div>
        </div>
      );
    }

    return null;
  };

  if (position === "top-left") {
    return renderSingleAttachment(type, "tl", "-top-3 -left-3");
  }
  if (position === "top-right") {
    return renderSingleAttachment(type, "tr", "-top-3 -right-3");
  }
  if (position === "top-center") {
    return renderSingleAttachment(type, "tc", "-top-3 left-1/2 -translate-x-1/2");
  }
  if (position === "both-corners") {
    return (
      <>
        {renderSingleAttachment(type, "tl", "-top-3 -left-3")}
        {renderSingleAttachment(type, "tr", "-top-3 -right-3")}
      </>
    );
  }

  return null;
};

// Interactive Scrapbook Card Component
export const ScrapbookCard = ({
  item,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onEdit,
}: {
  item: ScrapbookItem;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updated: ScrapbookItem) => void;
  onDelete: (id: string) => void;
  onEdit?: (item: ScrapbookItem) => void;
}) => {
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const itemStartPos = useRef({ x: item.x, y: item.y });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect();
    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    itemStartPos.current = { x: item.x, y: item.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    onUpdate({
      ...item,
      x: itemStartPos.current.x + dx,
      y: itemStartPos.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging.current) {
      isDragging.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Get paper style classes based on paperStyle type
  const getPaperStyleClasses = () => {
    switch (item.paperStyle) {
      case "sticky-yellow":
        return "bg-[#fef08a] text-slate-800 shadow-md border border-yellow-300 font-sans";
      case "sticky-green":
        return "bg-[#bbf7d0] text-slate-800 shadow-md border border-green-300 font-sans";
      case "sticky-pink":
        return "bg-[#fbcfe8] text-slate-800 shadow-md border border-pink-300 font-sans";
      case "sticky-blue":
        return "bg-[#bae6fd] text-slate-800 shadow-md border border-blue-300 font-sans";
      case "lined-notebook":
        return "bg-white text-slate-800 shadow-lg border border-slate-200 bg-[linear-gradient(transparent_23px,#e2e8f0_24px)] bg-[size:100%_24px]";
      case "graph-paper":
        return "bg-slate-50 text-slate-800 shadow-lg border border-slate-200 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:12px_12px]";
      case "spiral-pad":
        return "bg-white text-slate-800 shadow-xl border border-slate-200 rounded-b-xl";
      case "torn-paper":
        return "bg-amber-50 text-slate-800 shadow-md border border-amber-200/80 [clip-path:polygon(0%_0%,100%_2%,98%_97%,2%_100%)]";
      case "polaroid":
        return "bg-white text-slate-900 shadow-xl p-3 pb-5 border border-slate-200";
      default:
        return "bg-white text-slate-800 shadow-md";
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        transform: `translate3d(${item.x}px, ${item.y}px, 0px) rotate(${item.rotation}deg)`,
        zIndex: item.zIndex + (isSelected ? 50 : 0),
        width: `${item.width}px`,
      }}
      className={`absolute cursor-grab active:cursor-grabbing select-none transition-shadow duration-150 ${
        isSelected ? "ring-2 ring-amber-500 ring-offset-2" : ""
      }`}
    >
      {/* Decorative Attachment (Washi Tape, Paperclip, Pushpin) */}
      <RenderAttachment type={item.attachment} position={item.attachmentPosition} />

      {/* Card Content Container */}
      <div className={`relative p-5 rounded-lg overflow-hidden ${getPaperStyleClasses()}`}>
        {/* Spiral Binder Holes Graphic */}
        {item.paperStyle === "spiral-pad" && (
          <div className="absolute top-0 left-0 right-0 h-7 bg-slate-100 border-b border-slate-200 flex justify-between px-3 items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400 inset-shadow"
              />
            ))}
          </div>
        )}

        {/* Action Controls for Selected Card (MOVE, EDIT, DELETE) */}
        {isSelected && (
          <div className="absolute top-2 right-2 flex items-center gap-1 z-40 bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-full text-white shadow-lg">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                const newRot = (item.rotation + 15) % 360;
                onUpdate({ ...item, rotation: newRot });
              }}
              className="p-1 hover:text-amber-400 transition-colors"
              title="Rotate Item"
            >
              <Move className="w-3.5 h-3.5" />
            </button>
            {onEdit && (
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="p-1 hover:text-cyan-400 transition-colors"
                title="Edit Item"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-1 hover:text-rose-400 transition-colors"
              title="Delete Item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Note Title & Date Header */}
        <div className={`flex flex-col gap-1 ${item.paperStyle === "spiral-pad" ? "pt-5" : ""}`}>
          {item.dateStr && (
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-200/50 pb-1">
              <span>{item.dateStr}</span>
              {item.type === "photo" && <Sparkles className="w-3 h-3 text-amber-500" />}
            </div>
          )}

          {item.title && (
            <h3 className="font-bold text-sm text-slate-900 tracking-tight leading-snug">
              {item.title}
            </h3>
          )}

          {/* Photo Content */}
          {item.type === "photo" && item.imageUrl && (
            <div className="mt-2 relative rounded overflow-hidden bg-slate-100 border border-slate-200 aspect-square">
              <img
                src={item.imageUrl}
                alt={item.title || "Scrapbook Photo"}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          )}

          {/* Text Content */}
          {item.content && (
            <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-sans mt-1">
              {item.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
