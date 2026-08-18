import { useState, useEffect } from "react";
import AIOrbFace from "./components/AIOrbFace";
import { type AIState, useSimulatedAmplitude } from "./components/ai-core";
import {
  ScrapbookCard,
  type ScrapbookItem,
} from "./components/ScrapbookCanvas";
import { AddItemModal } from "./components/AddItemModal";
import {
  Lock,
  KeyRound,
  Sparkles,
  Plus,
  AlertCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  Trash2,
  BookMarked,
} from "lucide-react";

const PAGES_STORAGE_KEY = "ai_journal_pages_v4";

export interface JournalPage {
  id: string;
  title: string;
  items: ScrapbookItem[];
}

const DEFAULT_PAGE_1_ITEMS: ScrapbookItem[] = [
  {
    id: "default-1",
    type: "note",
    x: 60,
    y: 80,
    width: 200,
    rotation: -2,
    paperStyle: "sticky-yellow",
    title: "Welcome to your Journal 📖",
    content:
      "Tap '+' at the bottom to add notes, photos, pins, paperclips & washi tape!",
    dateStr: "Aug 18, 2026",
    attachment: "paperclip-pink",
    attachmentPosition: "top-left",
    zIndex: 1,
  },
  {
    id: "default-2",
    type: "note",
    x: 480,
    y: 90,
    width: 230,
    rotation: 3,
    paperStyle: "graph-paper",
    title: "Multi-Page Notebook",
    content:
      "Use '+ Add Page' in the top bar to create new pages and flip between them!",
    dateStr: "Aug 18, 2026",
    attachment: "tape-cyan",
    attachmentPosition: "top-right",
    zIndex: 2,
  },
];

const DEFAULT_PAGES: JournalPage[] = [
  {
    id: "page-1",
    title: "Page 1 - Chapter One",
    items: DEFAULT_PAGE_1_ITEMS,
  },
];

export default function App() {
  // Authentication State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [aiState, setAiState] = useState<AIState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Multi-Page State with LocalStorage Persistence
  const [pages, setPages] = useState<JournalPage[]>(() => {
    try {
      const saved = localStorage.getItem(PAGES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_PAGES;
  });

  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const amplitude = useSimulatedAmplitude(aiState);

  // Active Page & Items
  const currentPage = pages[activePageIndex] || pages[0];
  const items = currentPage?.items || [];

  // Save pages to LocalStorage whenever pages change
  useEffect(() => {
    try {
      localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pages));
    } catch {
      // ignore
    }
  }, [pages]);

  // Password Submit Handler
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage("Please enter password");
      setAiState("error");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setAiState("thinking");

    setTimeout(() => {
      setIsSubmitting(false);
      if (
        password === "1234" ||
        password.toLowerCase() === "admin" ||
        password.toLowerCase() === "smooth" ||
        password.length >= 4
      ) {
        setAiState("done");
        setTimeout(() => {
          setIsUnlocked(true);
        }, 700);
      } else {
        setAiState("error");
        setErrorMessage("Incorrect password. Hint: Try '1234' or 'admin'");
      }
    }, 1000);
  };

  // Add Item to Current Page
  const handleAddItem = (
    itemData: Omit<ScrapbookItem, "id" | "x" | "y" | "zIndex">
  ) => {
    const maxZ = items.reduce((max, i) => Math.max(max, i.zIndex), 0);
    const newItem: ScrapbookItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      x: 90 + Math.floor(Math.random() * 60),
      y: 100 + Math.floor(Math.random() * 60),
      zIndex: maxZ + 1,
    };

    setPages((prevPages) =>
      prevPages.map((page, idx) =>
        idx === activePageIndex
          ? { ...page, items: [...page.items, newItem] }
          : page
      )
    );
    setSelectedItemId(newItem.id);
  };

  // Update Item on Current Page
  const handleUpdateItem = (updated: ScrapbookItem) => {
    setPages((prevPages) =>
      prevPages.map((page, idx) =>
        idx === activePageIndex
          ? {
              ...page,
              items: page.items.map((i) => (i.id === updated.id ? updated : i)),
            }
          : page
      )
    );
  };

  // Delete Item from Current Page
  const handleDeleteItem = (id: string) => {
    setPages((prevPages) =>
      prevPages.map((page, idx) =>
        idx === activePageIndex
          ? { ...page, items: page.items.filter((i) => i.id !== id) }
          : page
      )
    );
    if (selectedItemId === id) setSelectedItemId(null);
  };

  // Page Operations
  const handleAddNewPage = () => {
    const newPageNum = pages.length + 1;
    const newPage: JournalPage = {
      id: `page-${Date.now()}`,
      title: `Page ${newPageNum}`,
      items: [],
    };
    setPages((prev) => [...prev, newPage]);
    setActivePageIndex(pages.length); // Switch to the new page automatically
  };

  const handleDeleteCurrentPage = () => {
    if (pages.length <= 1) return;
    setPages((prev) => prev.filter((_, idx) => idx !== activePageIndex));
    setActivePageIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen w-full bg-[#18181b] relative overflow-hidden font-sans select-none flex flex-col">
      {/* SCREEN 1: AI ORB GUARDIAN LOCK SCREEN */}
      {!isUnlocked && (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#f8fafc] relative z-20">
          {/* Background Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-md w-full bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* AI Guardian Orb Character */}
            <div className="flex flex-col items-center gap-2 my-2">
              <AIOrbFace amplitude={amplitude} size={135} state={aiState} />
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                AI Guardian:{" "}
                <strong className="text-slate-700 font-semibold">
                  {aiState}
                </strong>
              </span>
            </div>

            {/* Title & Description */}
            <div className="text-center flex flex-col gap-1">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Private Leather Journal & Scrapbook
              </h1>
              <p className="text-xs text-slate-500">
                Move your cursor — it watches. Enter passcode to open notebook.
              </p>
            </div>

            {/* Password Form */}
            <form
              onSubmit={handlePasswordSubmit}
              className="w-full flex flex-col gap-3"
            >
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (aiState !== "listening" && aiState !== "thinking") {
                      setAiState("listening");
                    }
                  }}
                  onFocus={() => {
                    if (aiState === "idle") setAiState("listening");
                  }}
                  placeholder="Enter password (e.g. 1234)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-mono"
                />
              </div>

              {errorMessage && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Unlocking Journal...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Unlock Book</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SCREEN 2: UNLOCKED OPEN LEATHER JOURNAL WITH MULTI-PAGE SYSTEM */}
      {isUnlocked && (
        <div
          className="flex-1 w-full h-screen relative overflow-auto bg-[#1c1c1e] flex flex-col items-center"
          onClick={() => setSelectedItemId(null)}
        >
          {/* Top Header Navbar */}
          <header className="sticky top-0 z-50 w-full bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xl gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold text-sm shadow-md border border-amber-600/40">
                📖
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-white tracking-tight">
                  My Private Leather Journal
                </h1>
                <p className="text-[11px] text-zinc-400">
                  Multi-page journal • Auto-saved to browser
                </p>
              </div>
            </div>

            {/* PAGE NAVIGATION CONTROLS */}
            <div className="flex items-center gap-2 bg-zinc-950/90 border border-zinc-800 rounded-2xl p-1.5 shadow-inner">
              <button
                onClick={() => setActivePageIndex((prev) => Math.max(0, prev - 1))}
                disabled={activePageIndex === 0}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-zinc-800 text-white transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Switcher Tabs */}
              <div className="flex items-center gap-1 max-w-[240px] overflow-x-auto no-scrollbar px-1">
                {pages.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePageIndex(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      idx === activePageIndex
                        ? "bg-amber-600 text-white shadow-md"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                    }`}
                  >
                    Page {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setActivePageIndex((prev) => Math.min(pages.length - 1, prev + 1))
                }
                disabled={activePageIndex === pages.length - 1}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-zinc-800 text-white transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-zinc-800 mx-1" />

              {/* Add New Page Button */}
              <button
                onClick={handleAddNewPage}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all"
                title="Create a new journal page spread"
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>+ Add Page</span>
              </button>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2">
              {pages.length > 1 && (
                <button
                  onClick={handleDeleteCurrentPage}
                  className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs transition-colors"
                  title="Delete Current Page"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setIsUnlocked(false)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all border border-amber-500/40"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Journal</span>
              </button>
            </div>
          </header>

          {/* OPEN LEATHER BOOK STAGE (MATCHING USER REFERENCE IMAGE) */}
          <div className="p-4 sm:p-8 w-full max-w-6xl flex justify-center items-center my-auto">
            {/* Outer Leather Hardcover Wrapping */}
            <div className="relative w-full max-w-[940px] min-h-[640px] bg-[#a67449] rounded-[2.5rem] p-3 sm:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-[#8a5d35] flex justify-center items-center">
              {/* Page Ribbon Bookmark */}
              <div className="absolute top-0 right-16 w-6 h-28 bg-amber-700/80 shadow-lg rounded-b-md z-30 flex items-end justify-center pb-2 border-x border-b border-amber-800/60 pointer-events-none">
                <BookMarked className="w-4 h-4 text-amber-200" />
              </div>

              {/* Leather Edge Stitching Effect */}
              <div className="absolute inset-2 rounded-[2rem] border border-dashed border-[#6e4624]/40 pointer-events-none" />

              {/* Stacked Paper Pages Edge (Left & Right Stack Depth) */}
              <div className="relative w-full h-full min-h-[600px] bg-[#f2ebd9] rounded-2xl shadow-inner flex overflow-hidden border border-[#d9ceb5]">
                {/* Left Page & Right Page Open Spread Background */}
                <div
                  className="w-full h-full min-h-[600px] bg-[#faf6ee] relative flex transition-all duration-300"
                  style={{
                    backgroundImage:
                      "linear-gradient(transparent 27px, #e6ded0 28px)",
                    backgroundSize: "100% 28px",
                  }}
                >
                  {/* Left Page Header DATE */}
                  <div className="absolute top-4 left-6 text-[10px] font-mono text-stone-400 tracking-widest pointer-events-none">
                    DATE: ________________
                  </div>

                  {/* Right Page Header DATE & Page Number */}
                  <div className="absolute top-4 right-6 text-[10px] font-mono text-stone-400 tracking-widest pointer-events-none flex items-center gap-4">
                    <span>DATE: ________________</span>
                    <span className="font-bold text-amber-800/80 bg-amber-100/60 px-2 py-0.5 rounded border border-amber-200/50">
                      PAGE {activePageIndex + 1} OF {pages.length}
                    </span>
                  </div>

                  {/* Center Spine Crease / Binding Fold Shadow */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-black/15 via-black/5 to-black/15 pointer-events-none z-10 border-x border-black/5" />

                  {/* Canvas Items Container */}
                  <div className="relative w-full h-full min-h-[600px]">
                    {items.length === 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 gap-3 pointer-events-none z-0">
                        <BookOpen className="w-12 h-12 opacity-30" />
                        <p className="text-xs font-medium text-stone-500">
                          Page {activePageIndex + 1} is blank. Tap "+" below to add notes, photos & pins!
                        </p>
                      </div>
                    )}

                    {/* Render Scrapbook Notes & Photos for Active Page */}
                    {items.map((item) => (
                      <ScrapbookCard
                        key={item.id}
                        item={item}
                        isSelected={selectedItemId === item.id}
                        onSelect={() => setSelectedItemId(item.id)}
                        onUpdate={handleUpdateItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING ACTION "+" PLUS BUTTON (Bottom Right) */}
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-14 h-14 rounded-full bg-amber-600 hover:bg-amber-500 text-white shadow-2xl flex items-center justify-center border-2 border-white/40 hover:scale-110 active:scale-95 transition-all group"
              title="Add Note Paper, Photo Frame, or Accessories to Current Page"
            >
              <Plus className="w-7 h-7 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          {/* ADD ITEM MODAL DRAWER */}
          <AddItemModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddItem={handleAddItem}
          />
        </div>
      )}
    </div>
  );
}
