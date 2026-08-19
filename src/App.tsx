import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Book from "./components/Book";
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
  ArrowLeft,
  User,
  Mail,
  LogOut,
  CheckCircle2,
  Key,
  HelpCircle,
  Settings,
  X,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

export interface JournalPage {
  id: string;
  title: string;
  items: ScrapbookItem[];
}

export interface UserProfile {
  email: string;
  name: string;
}

export interface BookDefinition {
  id: "yellow" | "blue" | "red";
  title: string;
  subtitle: string;
  topicTagline: string;
  color: string;
  textColor?: string;
  variant: "stripe" | "simple";
  defaultPassword: string;
  themeIcon: "sun" | "shield" | "heart";
  initialPages: JournalPage[];
}

// 3 INDIVIDUAL BOOKS CONFIGURATION
export const BOOKS_CONFIG: BookDefinition[] = [
  {
    id: "yellow",
    title: "Happiness, Joy & Sunshine",
    subtitle: "Hope, Attention & Caution",
    topicTagline: "A golden journal for positive reflections, bright ideas, and joyful memories.",
    color: "#e5a00d",
    variant: "stripe",
    defaultPassword: "sunshine",
    themeIcon: "sun",
    initialPages: [
      {
        id: "yellow-p1",
        title: "Page 1 - Sunshine & Joy",
        items: [
          {
            id: "y-1",
            type: "note",
            x: 60,
            y: 80,
            width: 210,
            rotation: -2,
            paperStyle: "sticky-yellow",
            title: "Daily Sunshine ☀️",
            content: "Happiness is a choice we make every morning. Hope and joy brighten every day!",
            dateStr: "Aug 19, 2026",
            attachment: "paperclip-pink",
            attachmentPosition: "top-left",
            zIndex: 1,
          },
          {
            id: "y-2",
            type: "note",
            x: 480,
            y: 90,
            width: 230,
            rotation: 3,
            paperStyle: "graph-paper",
            title: "Joy & Attention List",
            content: "1. Sunshine Walks ☀️\n2. Creative Mindset 🎨\n3. Positive Vibes Only",
            dateStr: "Aug 19, 2026",
            attachment: "tape-yellow",
            attachmentPosition: "top-right",
            zIndex: 2,
          },
        ],
      },
    ],
  },
  {
    id: "blue",
    title: "Calm, Peace & Stability",
    subtitle: "Trust, Loyalty & Intelligence",
    topicTagline: "A serene blue notebook for mindfulness, strategic thinking, and deep clarity.",
    color: "#7DC1C1",
    textColor: "white",
    variant: "simple",
    defaultPassword: "peace",
    themeIcon: "shield",
    initialPages: [
      {
        id: "blue-p1",
        title: "Page 1 - Serenity & Trust",
        items: [
          {
            id: "b-1",
            type: "note",
            x: 60,
            y: 80,
            width: 220,
            rotation: -3,
            paperStyle: "lined-notebook",
            title: "Inner Serenity 🌊",
            content: "Peace of mind is true strength. Trust the process, remain calm and focused.",
            dateStr: "Aug 19, 2026",
            attachment: "tape-cyan",
            attachmentPosition: "top-left",
            zIndex: 1,
          },
          {
            id: "b-2",
            type: "note",
            x: 480,
            y: 90,
            width: 230,
            rotation: 2,
            paperStyle: "spiral-pad",
            title: "Strategic Focus",
            content: "Intelligence lies in deep reflection. Loyalty and trust build lasting foundations.",
            dateStr: "Aug 19, 2026",
            attachment: "paperclip-green",
            attachmentPosition: "top-right",
            zIndex: 2,
          },
        ],
      },
    ],
  },
  {
    id: "red",
    title: "Long-Time Dreams & Energy",
    subtitle: "Passion, Love, Power & Courage",
    topicTagline: "A high-energy crimson ledger for ambitious goals, vision boards, and bold dreams.",
    color: "#9D2127",
    variant: "stripe",
    defaultPassword: "dreams",
    themeIcon: "heart",
    initialPages: [
      {
        id: "red-p1",
        title: "Page 1 - Passion & Dreams",
        items: [
          {
            id: "r-1",
            type: "note",
            x: 60,
            y: 80,
            width: 210,
            rotation: -2,
            paperStyle: "sticky-pink",
            title: "Long-Term Vision 🚀",
            content: "Energy, passion, and love drive extraordinary goals. Turn ambition into reality!",
            dateStr: "Aug 19, 2026",
            attachment: "pushpin-red",
            attachmentPosition: "top-center",
            zIndex: 1,
          },
          {
            id: "r-2",
            type: "note",
            x: 480,
            y: 90,
            width: 230,
            rotation: 3,
            paperStyle: "graph-paper",
            title: "Power & Courage Goals",
            content: "Take bold actions daily. Fuel your dreams with unshakeable passion and power!",
            dateStr: "Aug 19, 2026",
            attachment: "tape-pink",
            attachmentPosition: "top-right",
            zIndex: 2,
          },
        ],
      },
    ],
  },
];

const USER_STORAGE_KEY = "ai_journal_active_user_v1";

export default function App() {
  // Account Login Profile State
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"profile" | "password">("profile");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [selectedBookForPassChange, setSelectedBookForPassChange] = useState<"yellow" | "blue" | "red">("yellow");
  const [currentPassInput, setCurrentPassInput] = useState("");
  const [newPassInput, setNewPassInput] = useState("");
  const [confirmNewPassInput, setConfirmNewPassInput] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");
  const [settingsError, setSettingsError] = useState("");

  // Book Navigation & Selection State
  const [activeBookConfig, setActiveBookConfig] = useState<BookDefinition | null>(null);

  // Authentication Mode: "unlock" | "setup" | "forgot"
  const [authMode, setAuthMode] = useState<"unlock" | "setup" | "forgot">("unlock");

  // User-set Passwords for Books (stored per email in localStorage)
  const [userBookPasswords, setUserBookPasswords] = useState<Record<string, string>>({});

  // Form Inputs & Password Eye Toggle Visibility States
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSettingsCurrentPass, setShowSettingsCurrentPass] = useState(false);
  const [showSettingsNewPass, setShowSettingsNewPass] = useState(false);
  const [showSettingsConfirmPass, setShowSettingsConfirmPass] = useState(false);
  const [verifyEmailInput, setVerifyEmailInput] = useState("");
  const [verifyNameInput, setVerifyNameInput] = useState("");
  const [aiState, setAiState] = useState<AIState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Active Book Pages State
  const [pages, setPages] = useState<JournalPage[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [pageDirection, setPageDirection] = useState<number>(1);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScrapbookItem | null>(null);

  // Active Page & Items
  const currentPage = pages[activePageIndex] || pages[0];
  const items = currentPage?.items || [];

  // Swipe gesture ref
  const swipePointerStart = useRef<{ x: number; y: number } | null>(null);
  const amplitude = useSimulatedAmplitude(aiState);

  // Save active user profile & load passwords
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      setEditName(user.name);
      setEditEmail(user.email);
      try {
        const passSaved = localStorage.getItem(`ai_journal_${user.email}_passwords`);
        if (passSaved) {
          setUserBookPasswords(JSON.parse(passSaved));
        } else {
          setUserBookPasswords({});
        }
      } catch {
        setUserBookPasswords({});
      }
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  // Load Book Pages from LocalStorage when activeBookConfig changes
  useEffect(() => {
    if (!activeBookConfig || !user) return;
    const userStorageKey = `ai_journal_${user.email}_${activeBookConfig.id}_pages_v1`;
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPages(parsed);
          setActivePageIndex(0);
          return;
        }
      }
    } catch {
      // fallback
    }
    setPages(activeBookConfig.initialPages);
    setActivePageIndex(0);
  }, [activeBookConfig, user]);

  // Save Book Pages to LocalStorage
  useEffect(() => {
    if (!activeBookConfig || !user || pages.length === 0) return;
    const userStorageKey = `ai_journal_${user.email}_${activeBookConfig.id}_pages_v1`;
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(pages));
    } catch {
      // ignore
    }
  }, [pages, activeBookConfig, user]);

  // Save Passwords to LocalStorage
  const saveUserPasswordForBook = (bookId: string, newPass: string) => {
    if (!user) return;
    const updated = { ...userBookPasswords, [bookId]: newPass };
    setUserBookPasswords(updated);
    try {
      localStorage.setItem(`ai_journal_${user.email}_passwords`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Handle Account Login (Email Only with Account Registry)
  const handleAccountLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setLoginError("Please enter a valid email address");
      return;
    }

    try {
      const dbSaved = localStorage.getItem("ai_journal_accounts_db");
      const accounts: Record<string, UserProfile> = dbSaved ? JSON.parse(dbSaved) : {};

      if (accounts[cleanEmail]) {
        // Existing account found - Log in directly
        setLoginError("");
        setUser(accounts[cleanEmail]);
      } else {
        // New account - Auto-register using email prefix as display name
        const rawPrefix = cleanEmail.split("@")[0];
        const derivedName = rawPrefix.charAt(0).toUpperCase() + rawPrefix.slice(1);
        const newUser: UserProfile = { email: cleanEmail, name: derivedName };
        accounts[cleanEmail] = newUser;
        localStorage.setItem("ai_journal_accounts_db", JSON.stringify(accounts));
        setLoginError("");
        setUser(newUser);
      }
    } catch {
      const rawPrefix = cleanEmail.split("@")[0];
      setUser({ email: cleanEmail, name: rawPrefix });
    }
  };

  // Handle Sign Out
  const handleSignOut = () => {
    setUser(null);
    setActiveBookConfig(null);
    setIsUnlocked(false);
    setLoginEmail("");
    setIsSettingsOpen(false);
  };

  // Save Profile Settings
  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim() || !editEmail.includes("@")) {
      setSettingsError("Please enter valid name and email");
      return;
    }
    setSettingsError("");
    setUser({ name: editName.trim(), email: editEmail.trim().toLowerCase() });
    setSettingsMsg("Profile updated successfully!");
    setTimeout(() => setSettingsMsg(""), 2000);
  };

  // Change Book Password in Settings
  const handleChangePasswordSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const book = BOOKS_CONFIG.find((b) => b.id === selectedBookForPassChange);
    if (!book) return;

    const existingPass = userBookPasswords[book.id] || book.defaultPassword;

    if (currentPassInput.trim() !== existingPass) {
      setSettingsError(`Current password for ${book.title} is incorrect.`);
      return;
    }
    if (!newPassInput.trim() || newPassInput.length < 3) {
      setSettingsError("New password must be at least 3 characters long.");
      return;
    }
    if (newPassInput !== confirmNewPassInput) {
      setSettingsError("New passwords do not match.");
      return;
    }

    setSettingsError("");
    saveUserPasswordForBook(book.id, newPassInput.trim());
    setCurrentPassInput("");
    setNewPassInput("");
    setConfirmNewPassInput("");
    setSettingsMsg(`Password for ${book.title} changed successfully!`);
    setTimeout(() => setSettingsMsg(""), 2500);
  };

  // Select 3D Book
  const handleSelectBook = (book: BookDefinition) => {
    setActiveBookConfig(book);
    setIsUnlocked(false);
    setPassword("");
    setConfirmPassword("");
    setErrorMessage("");
    setSuccessMessage("");
    setAiState("idle");

    const existingPass = userBookPasswords[book.id];
    if (existingPass) {
      setAuthMode("unlock");
    } else {
      setAuthMode("setup");
    }
  };

  // Lock Journal & Return to 3D Books Showcase Page
  const handleLockJournal = () => {
    setIsUnlocked(false);
    setActiveBookConfig(null);
    setPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Password Unlock Submit
  const handlePasswordUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBookConfig || !user) return;

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
      const userSetPass = userBookPasswords[activeBookConfig.id];
      const validPass = userSetPass || activeBookConfig.defaultPassword;

      if (password.trim() === validPass) {
        setAiState("done");
        setTimeout(() => {
          setIsUnlocked(true);
        }, 600);
      } else {
        setAiState("error");
        setErrorMessage("Incorrect password. Click 'Forgot Password?' to reset.");
      }
    }, 900);
  };

  // Password Setup Submit (First Time Setup -> Immediately Unlocks Book!)
  const handlePasswordSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBookConfig) return;

    if (!password.trim() || password.length < 3) {
      setErrorMessage("Password must be at least 3 characters long");
      setAiState("error");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      setAiState("error");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setAiState("thinking");

    setTimeout(() => {
      setIsSubmitting(false);
      saveUserPasswordForBook(activeBookConfig.id, password.trim());
      setAiState("done");
      setSuccessMessage("Password created successfully! Opening book...");

      setTimeout(() => {
        setIsUnlocked(true);
      }, 700);
    }, 900);
  };

  // Forgot Password Reset Submit
  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBookConfig || !user) return;

    if (verifyEmailInput.trim().toLowerCase() !== user.email.toLowerCase()) {
      setErrorMessage("Email address does not match your account profile");
      setAiState("error");
      return;
    }
    if (verifyNameInput.trim().toLowerCase() !== user.name.toLowerCase()) {
      setErrorMessage("Name does not match your account profile");
      setAiState("error");
      return;
    }
    if (!password.trim() || password.length < 3) {
      setErrorMessage("New password must be at least 3 characters long");
      setAiState("error");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("New passwords do not match");
      setAiState("error");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setAiState("thinking");

    setTimeout(() => {
      setIsSubmitting(false);
      saveUserPasswordForBook(activeBookConfig.id, password.trim());
      setAiState("done");
      setSuccessMessage("Password reset successfully! Next time use your new password.");

      setTimeout(() => {
        setAuthMode("unlock");
        setIsUnlocked(true);
      }, 800);
    }, 900);
  };

  // Add Item to Active Page
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

  // Update Item on Active Page
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

  // Delete Item from Active Page
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

  // Page Navigation Handlers
  const goToNextPage = () => {
    if (activePageIndex < pages.length - 1) {
      setPageDirection(1);
      setActivePageIndex((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (activePageIndex > 0) {
      setPageDirection(-1);
      setActivePageIndex((prev) => prev - 1);
    }
  };

  const handleAddNewPage = () => {
    const newPageNum = pages.length + 1;
    const newPage: JournalPage = {
      id: `page-${Date.now()}`,
      title: `Page ${newPageNum}`,
      items: [],
    };
    setPages((prev) => [...prev, newPage]);
    setPageDirection(1);
    setActivePageIndex(pages.length);
  };

  const handleDeleteCurrentPage = () => {
    if (pages.length <= 1) return;
    setPages((prev) => prev.filter((_, idx) => idx !== activePageIndex));
    setActivePageIndex((prev) => Math.max(0, prev - 1));
  };

  // Pointer Swipe Gesture Detection
  const handlePointerDownCanvas = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest(".cursor-grab")) return;
    swipePointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUpCanvas = (e: React.PointerEvent) => {
    if (!swipePointerStart.current) return;
    const dx = e.clientX - swipePointerStart.current.x;
    const dy = e.clientY - swipePointerStart.current.y;
    swipePointerStart.current = null;

    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        goToNextPage();
      } else {
        goToPrevPage();
      }
    }
  };

  // 3D Page Flip Animation Variants
  const pageFlipVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 55 : -55,
      opacity: 0,
      scale: 0.96,
      transformOrigin: direction > 0 ? "right center" : "left center",
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -55 : 55,
      opacity: 0,
      scale: 0.96,
      transformOrigin: direction > 0 ? "left center" : "right center",
    }),
  };

  return (
    <div className="min-h-screen w-full bg-[#18181b] relative overflow-hidden font-sans select-none flex flex-col">
      {/* SCREEN 0: INITIAL EMAIL SIGN IN & NAME SETUP (FIRST SCREEN) */}
      {!user && (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#f8fafc] relative z-30">
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-md w-full bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-lg font-bold text-xl">
              📖
            </div>

            <div className="text-center flex flex-col gap-1">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Sign In to Private 3D Journal
              </h1>
              <p className="text-xs text-slate-500">
                Enter your email address to access or create your private journal account.
              </p>
            </div>

            <form onSubmit={handleAccountLogin} className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. user@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-1"
              >
                <span>Sign In to My Books</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SCREEN 1: CLEAN 3D BOOKS SHOWCASE PAGE (IMAGE 1 & IMAGE 2 CLEANUP) */}
      {user && !activeBookConfig && (
        <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col items-center justify-center p-6 sm:p-10 relative z-20">
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* TOP RIGHT CORNER SETTINGS & PROFILE PILL (IMAGE 1 CLEANUP) */}
          <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm backdrop-blur-sm flex items-center gap-2 transition-all"
              title="Open Settings & Change Password"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span>{user.name}</span>
              <Settings className="w-3.5 h-3.5 text-slate-500 hover:rotate-90 transition-transform" />
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-12 max-w-5xl w-full">
            {/* CLEAN 3D BOOKS GRID SHOWCASE (IMAGE 2 CLEANUP: TEXT CLUTTER REMOVED) */}
            <div className="flex min-h-[380px] flex-wrap items-center justify-center gap-12 sm:gap-16">
              {BOOKS_CONFIG.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleSelectBook(book)}
                  className="cursor-pointer group relative flex flex-col items-center transition-transform duration-300 hover:-translate-y-4"
                  title={`Click to open ${book.title}`}
                >
                  {/* Clean Lock Icon Badge */}
                  <div className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border border-amber-500/30">
                    <Lock className="w-4 h-4" />
                  </div>

                  {/* 3D Book Component Instance */}
                  <Book
                    title={book.title}
                    color={book.color}
                    textColor={book.textColor}
                    variant={book.variant}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 2: AUTHENTICATION / PASSWORD SCREEN (IMAGE 3 CLEANUP: TEXT CLUTTER REMOVED) */}
      {user && activeBookConfig && !isUnlocked && (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#f8fafc] relative z-20">
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-5 max-w-md w-full bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Back Button */}
            <button
              onClick={() => setActiveBookConfig(null)}
              className="self-start inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to 3D Books Showcase</span>
            </button>

            {/* AI Guardian Orb Character */}
            <div className="flex flex-col items-center gap-2 my-1">
              <AIOrbFace amplitude={amplitude} size={130} state={aiState} />
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                AI Guardian:{" "}
                <strong className="text-slate-700 font-semibold">
                  {aiState}
                </strong>
              </span>
            </div>

            {/* Selected Book Header */}
            <div className="text-center flex flex-col gap-1.5">
              <h2 className="text-lg font-bold text-slate-900">
                {activeBookConfig.title}
              </h2>
            </div>

            {/* MODE 1: FIRST-TIME PASSWORD SETUP (CREATE & CONFIRM -> IMMEDIATELY OPENS BOOK) */}
            {authMode === "setup" && (
              <form onSubmit={handlePasswordSetup} className="w-full flex flex-col gap-3">
                <div className="relative flex items-center">
                  <Key className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (aiState === "idle") setAiState("listening");
                    }}
                    placeholder="Create New Password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Saving Password...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Set Password & Open Book</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* MODE 2: SUBSEQUENT VISIT UNLOCK FORM */}
            {authMode === "unlock" && (
              <form onSubmit={handlePasswordUnlock} className="w-full flex flex-col gap-3">
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (aiState !== "listening" && aiState !== "thinking") {
                        setAiState("listening");
                      }
                    }}
                    placeholder="Enter Book Password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Unlock Book</span>
                    </>
                  )}
                </button>

                {/* FORGOT PASSWORD LINK */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("forgot");
                      setPassword("");
                      setConfirmPassword("");
                      setErrorMessage("");
                      setSuccessMessage("");
                      setVerifyEmailInput(user.email);
                      setVerifyNameInput(user.name);
                    }}
                    className="text-xs text-amber-600 hover:text-amber-700 font-semibold inline-flex items-center gap-1 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Forgot Password?</span>
                  </button>
                </div>
              </form>
            )}

            {/* MODE 3: FORGOT PASSWORD VERIFY & RESET FORM */}
            {authMode === "forgot" && (
              <form onSubmit={handlePasswordReset} className="w-full flex flex-col gap-3">
                <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-900 leading-relaxed font-medium">
                  🔑 Verify your Account Profile ({user.name}) to reset your password.
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">Confirm Account Email</span>
                  <input
                    type="email"
                    value={verifyEmailInput}
                    onChange={(e) => setVerifyEmailInput(e.target.value)}
                    placeholder="Enter account email"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">Confirm Account Name</span>
                  <input
                    type="text"
                    value={verifyNameInput}
                    onChange={(e) => setVerifyNameInput(e.target.value)}
                    placeholder="Enter account name"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900"
                  />
                </div>

                <div className="flex flex-col gap-2 border-t border-slate-100 pt-2">
                  <span className="text-[11px] font-semibold text-slate-700">Create New Password</span>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New Password"
                      className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm New Password"
                      className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("unlock");
                      setErrorMessage("");
                    }}
                    className="w-1/3 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Resetting...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Save New Password & Open</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SCREEN 3: UNLOCKED INDIVIDUAL JOURNAL (IMAGE 4 CLEANUP: CLEAN NAVBAR) */}
      {user && activeBookConfig && isUnlocked && (
        <div
          className="flex-1 w-full h-screen relative overflow-auto bg-[#1c1c1e] flex flex-col items-center"
          onClick={() => setSelectedItemId(null)}
          onPointerDown={handlePointerDownCanvas}
          onPointerUp={handlePointerUpCanvas}
        >
          {/* Top Header Navbar (IMAGE 4 CLEANUP: TEXT CLUTTER REMOVED) */}
          <header className="sticky top-0 z-50 w-full bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xl gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLockJournal}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                title="Back to 3D Books Showcase"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div
                className="w-8 h-8 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-md border border-white/20"
                style={{ backgroundColor: activeBookConfig.color }}
              >
                📖
              </div>
            </div>

            {/* PAGE NAVIGATION CONTROLS */}
            <div className="flex items-center gap-2 bg-zinc-950/90 border border-zinc-800 rounded-2xl p-1.5 shadow-inner">
              <button
                onClick={goToPrevPage}
                disabled={activePageIndex === 0}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-zinc-800 text-white transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Switcher Tabs */}
              <div className="flex items-center gap-1 max-w-[260px] overflow-x-auto no-scrollbar px-1 py-0.5">
                {pages.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPageDirection(idx > activePageIndex ? 1 : -1);
                      setActivePageIndex(idx);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      idx === activePageIndex
                        ? "bg-amber-600 text-white shadow-md scale-105"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                    }`}
                  >
                    Page {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={goToNextPage}
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
                title="Create a new page in this journal"
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
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
                title="Settings & Passwords"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Lock Journal & Return to 3D Books Showcase */}
              <button
                onClick={handleLockJournal}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all border border-amber-500/40"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Journal</span>
              </button>
            </div>
          </header>

          {/* OPEN LEATHER BOOK STAGE */}
          <div className="p-4 sm:p-8 w-full max-w-6xl flex justify-center items-center my-auto [perspective:1200px]">
            {/* Outer Leather Hardcover Wrapping */}
            <div
              className="relative w-full max-w-[940px] min-h-[640px] rounded-[2.5rem] p-3 sm:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border flex justify-center items-center"
              style={{ backgroundColor: activeBookConfig.color, borderColor: `${activeBookConfig.color}dd` }}
            >
              {/* Page Ribbon Bookmark */}
              <div className="absolute top-0 right-16 w-6 h-28 bg-amber-800/90 shadow-lg rounded-b-md z-30 flex items-end justify-center pb-2 border-x border-b border-amber-900/60 pointer-events-none">
                <BookMarked className="w-4 h-4 text-amber-200" />
              </div>

              {/* Leather Edge Stitching Effect */}
              <div className="absolute inset-2 rounded-[2rem] border border-dashed border-white/20 pointer-events-none" />

              {/* Stacked Paper Pages Edge */}
              <div className="relative w-full h-full min-h-[600px] bg-[#f2ebd9] rounded-2xl shadow-inner flex overflow-hidden border border-[#d9ceb5]">
                {/* 3D Page Flip Animated Spread */}
                <AnimatePresence mode="wait" custom={pageDirection}>
                  <motion.div
                    key={currentPage.id}
                    custom={pageDirection}
                    variants={pageFlipVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full h-full min-h-[600px] bg-[#faf6ee] relative flex [transform-style:preserve-3d]"
                    style={{
                      backgroundImage:
                        "linear-gradient(transparent 27px, #e6ded0 28px)",
                      backgroundSize: "100% 28px",
                    }}
                  >
                    {/* Page Header (Clean Mobile & Desktop Layout - Zero Overlap) */}
                    <div className="absolute top-3 left-4 right-4 text-[10px] font-mono text-stone-400 tracking-widest pointer-events-none flex items-center justify-between z-10">
                      <div className="truncate max-w-[48%]">
                        <span className="hidden sm:inline">JOURNAL OF: </span>
                        <span className="font-bold text-amber-900">{user.name.toUpperCase()}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden md:inline">DATE: ________</span>
                        <span className="font-bold text-amber-800/80 bg-amber-100/60 px-2 py-0.5 rounded border border-amber-200/50">
                          PAGE {activePageIndex + 1} OF {pages.length}
                        </span>
                      </div>
                    </div>

                    {/* Center Spine Crease / Binding Fold Shadow */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-black/15 via-black/5 to-black/15 pointer-events-none z-10 border-x border-black/5" />

                    {/* Canvas Items Container */}
                    <div className="relative w-full h-full min-h-[600px]">
                      {items.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 gap-3 pointer-events-none z-0">
                          <BookOpen className="w-12 h-12 opacity-30" />
                          <p className="text-xs font-medium text-stone-500">
                            Page {activePageIndex + 1} is blank. Tap "+" below to add notes!
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
                          onEdit={(itemToEdit) => setEditingItem(itemToEdit)}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* FLOATING ACTION "+" PLUS BUTTON (Bottom Right) */}
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
            <button
              onClick={() => {
                setEditingItem(null);
                setIsAddModalOpen(true);
              }}
              className="w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center border-2 border-white/40 hover:scale-110 active:scale-95 transition-all group"
              style={{ backgroundColor: activeBookConfig.color }}
              title="Add Note Paper, Photo Frame, or Accessories to Current Page"
            >
              <Plus className="w-7 h-7 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          {/* ADD / EDIT ITEM MODAL DRAWER */}
          <AddItemModal
            isOpen={isAddModalOpen || !!editingItem}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingItem(null);
            }}
            onAddItem={handleAddItem}
            editItem={editingItem}
            onUpdateItem={handleUpdateItem}
          />
        </div>
      )}

      {/* SETTINGS MODAL (EDIT PROFILE & CHANGE PASSWORDS) */}
      {user && isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-base text-slate-900">Account & Security Settings</h2>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 p-2 bg-slate-100/60 gap-2 px-6">
              <button
                type="button"
                onClick={() => {
                  setSettingsTab("profile");
                  setSettingsError("");
                  setSettingsMsg("");
                }}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  settingsTab === "profile"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <User className="w-3.5 h-3.5 text-amber-500" />
                Profile Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setSettingsTab("password");
                  setSettingsError("");
                  setSettingsMsg("");
                }}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  settingsTab === "password"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Key className="w-3.5 h-3.5 text-cyan-500" />
                Change Passwords
              </button>
            </div>

            {/* Body Form */}
            <div className="p-6 flex flex-col gap-4">
              {/* TAB 1: EDIT PROFILE */}
              {settingsTab === "profile" && (
                <form onSubmit={handleSaveProfileSettings} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Display Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-mono"
                    />
                  </div>

                  {settingsError && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{settingsError}</span>
                    </div>
                  )}

                  {settingsMsg && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{settingsMsg}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-1/3 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs border border-rose-200 flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>

                    <button
                      type="submit"
                      className="w-2/3 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: CHANGE BOOK PASSWORDS */}
              {settingsTab === "password" && (
                <form onSubmit={handleChangePasswordSettings} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Select Book to Update</label>
                    <div className="grid grid-cols-3 gap-2">
                      {BOOKS_CONFIG.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBookForPassChange(b.id)}
                          className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                            selectedBookForPassChange === b.id
                              ? "bg-slate-900 text-white border-slate-900 shadow"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {b.id === "yellow" ? "Yellow" : b.id === "blue" ? "Blue" : "Red"} Book
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Current Book Password</label>
                    <div className="relative flex items-center">
                      <input
                        type={showSettingsCurrentPass ? "text" : "password"}
                        value={currentPassInput}
                        onChange={(e) => setCurrentPassInput(e.target.value)}
                        placeholder="Current Password"
                        className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSettingsCurrentPass(!showSettingsCurrentPass)}
                        className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        {showSettingsCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">New Book Password</label>
                    <div className="relative flex items-center">
                      <input
                        type={showSettingsNewPass ? "text" : "password"}
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        placeholder="New Password"
                        className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSettingsNewPass(!showSettingsNewPass)}
                        className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        {showSettingsNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Confirm New Password</label>
                    <div className="relative flex items-center">
                      <input
                        type={showSettingsConfirmPass ? "text" : "password"}
                        value={confirmNewPassInput}
                        onChange={(e) => setConfirmNewPassInput(e.target.value)}
                        placeholder="Confirm New Password"
                        className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSettingsConfirmPass(!showSettingsConfirmPass)}
                        className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        {showSettingsConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {settingsError && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{settingsError}</span>
                    </div>
                  )}

                  {settingsMsg && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{settingsMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-1"
                  >
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>Update Password</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
