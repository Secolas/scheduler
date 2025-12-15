import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  X,
  Calendar,
  GripVertical,
  Edit2,
  Check,
  Trash2,
  LayoutGrid,
  Columns,
  RotateCcw,
  Eraser,
  CalendarDays,
  PlusCircle,
  Save,
  Moon,
  Sun,
  Download,
  Upload,
  Clock,
  ArrowRight,
  Tag,
  PartyPopper,
  GalleryHorizontal,
  FileJson,
  ChevronDown,
  RefreshCw,
  Trophy,
  Zap,
  Crown,
  History,
  ScrollText,
  ChevronRight,
  Settings,
  Palette,
  LogOut,
  Lock,
  User,
  Menu,
  Layers,
  ArrowRightCircle,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";

// --- YOUR FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyD86RWMHQRYr1ZdHIjEThIzTc0_mH-B5Zw",
  authDomain: "scheduler-cbbf2.firebaseapp.com",
  projectId: "scheduler-cbbf2",
  storageBucket: "scheduler-cbbf2.firebasestorage.app",
  messagingSenderId: "406081401604",
  appId: "1:406081401604:web:c85e75b00a973542391651",
  measurementId: "G-3RGXBEJKLR",
};

// Initialize Firebase
let db = null;
let auth = null;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase Initialization Error:", e);
}

// --- ANIMATED SHIBA COMPONENT ---
const ShibaAvatar = ({
  eyePosition = 50,
  isHiding = false,
  isPeeking = false,
  isBarking = false,
  isSad = false,
  size = "large",
  className = "mx-auto mb-6",
}) => {
  // Map eye position (0-100) to movement range (-8px to +8px)
  const eyeOffset = (eyePosition / 100) * 16 - 8;

  // Size Logic
  const containerClass = size === "small" ? "w-20 h-16" : "w-40 h-32"; // Made small size slightly larger
  const scale = size === "small" ? 1 : 1;

  // Position Config
  const jumpOffset = -15; // Visible height for jumping

  return (
    <div
      className={`${containerClass} relative transition-all duration-300 z-10 flex items-center justify-center ${className}`}
    >
      {/* Barking Bubble - Now on the RIGHT side */}
      {isBarking && (
        <div className="absolute top-2 -right-24 bg-white border-2 border-indigo-100 text-indigo-600 font-bold px-3 py-1.5 rounded-xl rounded-bl-none shadow-md animate-bounce z-20 whitespace-nowrap text-sm flex items-center gap-1">
          Woof! <span className="text-lg">🦴</span>
        </div>
      )}

      <svg
        viewBox="0 0 120 120"
        className="w-full h-full overflow-visible drop-shadow-lg"
        style={{ transform: `scale(${scale})` }}
      >
        <defs>
          <clipPath id="face-clip">
            <circle cx="60" cy="70" r="45" />
          </clipPath>
        </defs>

        {/* --- HEAD --- */}
        {/* Ears */}
        <path
          d="M20 45 L10 15 Q30 20 45 35"
          fill="#E8A358"
          stroke="#D18A3F"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M100 45 L110 15 Q90 20 75 35"
          fill="#E8A358"
          stroke="#D18A3F"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Face Base */}
        <circle
          cx="60"
          cy="70"
          r="45"
          fill="#E8A358"
          stroke="#D18A3F"
          strokeWidth="2"
        />

        {/* White Markings */}
        <path
          d="M60 70 Q25 70 20 85 Q15 100 60 112 Q105 100 100 85 Q95 70 60 70"
          fill="#FFFDF5"
        />

        {/* Eyebrows */}
        <g
          className="transition-transform duration-300"
          style={{ transformOrigin: "center" }}
        >
          <ellipse
            cx="40"
            cy="55"
            rx="4"
            ry="2"
            fill="#FFFDF5"
            opacity="0.8"
            style={{
              transform: isSad
                ? "rotate(-20deg) translate(0, 5px)"
                : "rotate(0deg)",
              transformOrigin: "40px 55px",
            }}
          />
          <ellipse
            cx="80"
            cy="55"
            rx="4"
            ry="2"
            fill="#FFFDF5"
            opacity="0.8"
            style={{
              transform: isSad
                ? "rotate(20deg) translate(0, 5px)"
                : "rotate(0deg)",
              transformOrigin: "80px 55px",
            }}
          />
        </g>

        {/* --- EYES (Animated) --- */}
        <g
          transform={`translate(${eyeOffset}, 0)`}
          className="transition-transform duration-150 ease-out"
        >
          {/* Left Eye */}
          <circle cx="42" cy="65" r="5" fill="#3E2723" />
          <circle cx="44" cy="63" r="2" fill="white" />

          {/* Right Eye */}
          <circle cx="78" cy="65" r="5" fill="#3E2723" />
          <circle cx="80" cy="63" r="2" fill="white" />
        </g>

        {/* Snout/Mouth */}
        <ellipse cx="60" cy="82" rx="7" ry="5" fill="#3E2723" />

        {/* Animated Mouth State */}
        {isSad ? (
          // Sad Frown
          <path
            d="M50 92 Q60 88 70 92"
            fill="none"
            stroke="#3E2723"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-in fade-in duration-300"
          />
        ) : (
          // Happy 'w' Mouth
          <path
            d="M60 82 L60 92 M60 92 Q52 98 48 88 M60 92 Q68 98 72 88"
            fill="none"
            stroke="#3E2723"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* Cheeks (Blush) */}
        <circle cx="28" cy="85" r="5" fill="#FFAB91" opacity="0.5" />
        <circle cx="92" cy="85" r="5" fill="#FFAB91" opacity="0.5" />

        {/* Sad Tear */}
        {isSad && (
          <path
            d="M40 70 Q40 80 35 80 Q30 80 30 70 L35 60 Z"
            fill="#4FC3F7"
            stroke="#039BE5"
            strokeWidth="0.5"
            className="animate-pulse origin-top"
            style={{ transform: "translateY(5px)" }}
          />
        )}

        {/* --- ANIMATED PAWS --- */}
        {/* Left Paw */}
        <g
          className={`transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${
            isBarking ? "animate-bounce" : ""
          }`}
          style={{
            transform: isHiding
              ? `translate(12px, -45px)` // Exactly covers left eye
              : isBarking
              ? `translate(0, ${jumpOffset}px) rotate(-10deg)`
              : "translate(0, 10px)", // Neutral: close to head
          }}
        >
          <circle
            cx="30"
            cy="110"
            r="14"
            fill="#FFFDF5"
            stroke="#D18A3F"
            strokeWidth="2"
          />
          <path
            d="M24 108 L24 116 M30 106 L30 116 M36 108 L36 116"
            stroke="#D18A3F"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Right Paw */}
        <g
          className={`transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${
            isBarking ? "animate-bounce" : ""
          }`}
          style={{
            transform: isHiding
              ? isPeeking
                ? "translate(12px, -20px) rotate(0deg)"
                : `translate(-12px, -45px)` // Exactly covers right eye
              : isBarking
              ? `translate(0, ${jumpOffset}px) rotate(10deg)`
              : "translate(0, 10px)", // Neutral: close to head
          }}
        >
          <circle
            cx="90"
            cy="110"
            r="14"
            fill="#FFFDF5"
            stroke="#D18A3F"
            strokeWidth="2"
          />
          <path
            d="M84 108 L84 116 M90 106 L90 116 M96 108 L96 116"
            stroke="#D18A3F"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};

export default function WeeklyScheduler() {
  // --- Auth State ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("schedulerUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'

  // Login Animation State
  const [eyePosition, setEyePosition] = useState(50);
  const [isHiding, setIsHiding] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [shibaState, setShibaState] = useState("idle"); // For internal logic

  // Dashboard Shiba State
  const [isBarking, setIsBarking] = useState(false);

  // --- App State ---
  const [viewMode, setViewMode] = useState("slide");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [wallpaper, setWallpaper] = useState("default");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Multi-Tab Settings
  const [tabSettings, setTabSettings] = useState(() => {
    const saved = localStorage.getItem("tabSettings");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Work",
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          },
        ];
  });

  // Initial Empty State
  const initialSchedule = {
    Monday: {
      activePlanIndex: 0,
      plans: [{ id: "p1", name: "Main", items: [] }],
    },
    Tuesday: {
      activePlanIndex: 0,
      plans: [{ id: "p1", name: "Main", items: [] }],
    },
    Wednesday: {
      activePlanIndex: 0,
      plans: [{ id: "p1", name: "Main", items: [] }],
    },
    Thursday: {
      activePlanIndex: 0,
      plans: [{ id: "p1", name: "Main", items: [] }],
    },
    Friday: {
      activePlanIndex: 0,
      plans: [
        { id: "p1", name: "Plan A", items: [] },
        { id: "p2", name: "Plan B", items: [] },
      ],
    },
    Saturday: {
      activePlanIndex: 0,
      plans: [{ id: "p1", name: "Main", items: [] }],
    },
    Sunday: {
      activePlanIndex: 0,
      plans: [{ id: "p1", name: "Main", items: [] }],
    },
    Monthly: {
      activePlanIndex: 0,
      plans: [{ id: "p1", name: "Main", items: [] }],
    },
  };

  const [schedule, setSchedule] = useState(initialSchedule);
  const [history, setHistory] = useState([]);

  // --- NOTIFICATION STATE ---
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- DATA LOADING & SYNC ---
  useEffect(() => {
    if (!user) return;
    setIsDataLoaded(false); // Reset load state on user change

    if (!db) {
      // Fallback to local storage if DB fails
      const localData = localStorage.getItem(`data_${user.username}`);
      if (localData) {
        const parsed = JSON.parse(localData);
        if (parsed.pin === user.pin) {
          setSchedule(parsed.schedule || initialSchedule);
          setHistory(parsed.history || []);
          setTabSettings(parsed.tabSettings || []);
          setWallpaper(parsed.wallpaper || "default");
          if (parsed.isDarkMode !== undefined) setIsDarkMode(parsed.isDarkMode);
        }
      }
      setIsDataLoaded(true); // Enable saving
      return;
    }

    const initAuth = async () => {
      if (auth && !auth.currentUser) await signInAnonymously(auth);
    };
    initAuth();

    const docRef = doc(db, "schedules", user.username);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.pin === user.pin) {
          if (data.schedule) setSchedule(data.schedule);
          if (data.history) setHistory(data.history);
          if (data.tabSettings) setTabSettings(data.tabSettings);
          if (data.wallpaper) setWallpaper(data.wallpaper);
          if (data.isDarkMode !== undefined) setIsDarkMode(data.isDarkMode);
        }
      }
      setIsDataLoaded(true); // CRITICAL: Only allow saving after this fires
    });
    return () => unsubscribe();
  }, [user]);

  // --- DATA SAVING ---
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!user || !isDataLoaded) return; // CRITICAL FIX: Do not save if data hasn't loaded yet

    const dataToSave = {
      pin: user.pin,
      schedule,
      history,
      tabSettings,
      wallpaper,
      isDarkMode,
      lastUpdated: new Date().toISOString(),
    };

    // Save to Local Storage as Backup
    localStorage.setItem(`data_${user.username}`, JSON.stringify(dataToSave));

    if (db) {
      const saveData = setTimeout(async () => {
        try {
          const docRef = doc(db, "schedules", user.username);
          await setDoc(docRef, dataToSave, { merge: true });
        } catch (e) {
          console.error("Sync error", e);
        }
      }, 1000);
      return () => clearTimeout(saveData);
    }
  }, [
    schedule,
    history,
    tabSettings,
    wallpaper,
    isDarkMode,
    user,
    isDataLoaded,
  ]);

  useEffect(() => {
    if (!user) {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") setIsDarkMode(true);
    }
  }, [user]);

  // --- Statistics Logic ---
  const XP_PER_TASK = 50;
  const calculateWeeklyStats = () => {
    let totalTasks = 0;
    let completedTasks = 0;
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].forEach((dayKey) => {
      const day = schedule[dayKey];
      if (day) {
        day.plans.forEach((plan) => {
          totalTasks += plan.items.length;
          completedTasks += plan.items.filter((i) => i.completed).length;
        });
      }
    });
    const currentXP = completedTasks * XP_PER_TASK;
    const level = Math.floor(currentXP / 300) + 1;
    const nextLevelXP = level * 300;
    const prevLevelXP = (level - 1) * 300;
    const progressToNext =
      ((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;
    return { level, currentXP, nextLevelXP, progressToNext };
  };
  const calculateMonthlyStats = () => {
    const monthlyData = schedule["Monthly"];
    let total = 0;
    let completed = 0;
    if (monthlyData) {
      monthlyData.plans.forEach((plan) => {
        total += plan.items.length;
        completed += plan.items.filter((i) => i.completed).length;
      });
    }
    return { percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
  };
  const weeklyStats = calculateWeeklyStats();
  const monthlyStats = calculateMonthlyStats();

  // --- UI State ---
  const [activeModal, setActiveModal] = useState({
    isOpen: false,
    mode: "add",
    day: null,
    item: null,
  });
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWallpapers, setShowWallpapers] = useState(false);
  const [settingsTab, setSettingsTab] = useState("appearance");
  const [openMenu, setOpenMenu] = useState(null);
  const [modalInput, setModalInput] = useState("");
  const [modalTime, setModalTime] = useState("");
  const [modalColor, setModalColor] = useState("default");
  const modalInputRef = useRef(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editPlanValue, setEditPlanValue] = useState("");
  const dragItem = useRef(null);
  const dragNode = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dayRefs = useRef({});
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "Monthly",
  ];

  // --- Themes & Helpers ---
  const wallpapers = {
    default: isDarkMode ? "bg-slate-900" : "bg-stone-50",
    nature: "bg-gradient-to-br from-emerald-800 to-green-600",
    ocean: "bg-gradient-to-br from-blue-900 to-cyan-600",
    sunset: "bg-gradient-to-br from-indigo-900 via-purple-800 to-orange-500",
    fall: "bg-gradient-to-br from-red-900 via-orange-800 to-yellow-600",
  };
  const isWallpaperActive = wallpaper !== "default";
  const baseTextColor = isWallpaperActive
    ? "text-white"
    : isDarkMode
    ? "text-slate-100"
    : "text-gray-900";
  const mutedTextColor = isWallpaperActive
    ? "text-white/70"
    : isDarkMode
    ? "text-slate-400"
    : "text-gray-500";
  const getTaskStyles = (colorKey, isDark) => {
    const styles = {
      default: {
        light: "bg-white border-gray-200 hover:border-indigo-200 text-gray-900",
        dark: "bg-slate-700 border-slate-600 hover:border-slate-500 text-white",
      },
      red: {
        light: "bg-red-50 border-red-200 text-red-900",
        dark: "bg-red-900/20 border-red-800/50 text-red-100",
      },
      blue: {
        light: "bg-blue-50 border-blue-200 text-blue-900",
        dark: "bg-blue-900/20 border-blue-800/50 text-blue-100",
      },
      green: {
        light: "bg-green-50 border-green-200 text-green-900",
        dark: "bg-green-900/20 border-green-800/50 text-green-100",
      },
      yellow: {
        light: "bg-yellow-50 border-yellow-200 text-yellow-900",
        dark: "bg-yellow-900/20 border-yellow-800/50 text-yellow-100",
      },
      orange: {
        light: "bg-orange-50 border-orange-200 text-orange-900",
        dark: "bg-orange-900/20 border-orange-800/50 text-orange-100",
      },
    };
    return isDark
      ? styles[colorKey || "default"].dark
      : styles[colorKey || "default"].light;
  };

  useEffect(() => {
    if (!user) return;
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    setTimeout(() => {
      if (dayRefs.current[today]) {
        dayRefs.current[today].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, 300);
  }, [viewMode, user]);

  const getProgress = (items) => {
    if (!items || items.length === 0) return 0;
    const completed = items.filter((i) => i.completed).length;
    return Math.round((completed / items.length) * 100);
  };
  const saveToHistory = (type, name, data, score) => {
    const newEntry = {
      id: Date.now(),
      type,
      name,
      date: new Date().toLocaleDateString(),
      score,
      data,
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  // --- Auth Handlers ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError("");
    const form = e.target;
    const username = form.username.value.trim().toLowerCase();
    const pin = form.pin.value.trim();

    if (!username || !pin) {
      setAuthError("Enter username & PIN");
      setIsAuthLoading(false);
      return;
    }

    const completeLogin = () => {
      const userData = { username, pin };
      setUser(userData);
      localStorage.setItem("schedulerUser", JSON.stringify(userData));
      setIsAuthLoading(false);

      // Trigger Bark on successful login/signup
      setIsBarking(true);
      setTimeout(() => setIsBarking(false), 3000);
    };

    if (db) {
      try {
        const docRef = doc(db, "schedules", username);
        const docSnap = await getDoc(docRef);

        if (authMode === "login") {
          // --- LOGIN MODE ---
          if (docSnap.exists()) {
            if (docSnap.data().pin === pin) {
              completeLogin();
            } else {
              setAuthError("Incorrect PIN");
            }
          } else {
            setAuthError("User not found. Please create an account.");
          }
        } else {
          // --- SIGN UP MODE ---
          if (docSnap.exists()) {
            setAuthError("Username taken. Please login.");
          } else {
            // Auto Create
            const localData = localStorage.getItem(`data_${username}`);
            let initialData = {
              pin,
              schedule: initialSchedule,
              history: [],
              tabSettings: [
                {
                  id: 1,
                  name: "Work",
                  days: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                },
              ],
              createdAt: new Date().toISOString(),
              migratedFromLocal: false,
            };

            if (localData) {
              try {
                const parsed = JSON.parse(localData);
                if (parsed.pin === pin) {
                  initialData = {
                    ...initialData,
                    ...parsed,
                    migratedFromLocal: true,
                  };
                }
              } catch (e) {
                console.warn("Failed to migrate local data", e);
              }
            }

            await setDoc(docRef, initialData);

            // Set state immediately from the data we just created/migrated
            setSchedule(initialData.schedule);
            setHistory(initialData.history);
            setTabSettings(initialData.tabSettings);
            completeLogin();
          }
        }
      } catch (err) {
        console.error(err);
        setAuthError("Connection Error");
      }
    } else {
      // Local Storage Fallback
      const localData = localStorage.getItem(`data_${username}`);
      if (authMode === "login") {
        if (localData) {
          const parsed = JSON.parse(localData);
          if (parsed.pin === pin) {
            completeLogin();
          } else {
            setAuthError("Incorrect PIN");
          }
        } else {
          setAuthError("User not found locally.");
        }
      } else {
        if (localData) {
          setAuthError("User already exists.");
        } else {
          setSchedule(initialSchedule);
          completeLogin();
        }
      }
    }
    setIsAuthLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("schedulerUser");
    setSchedule(initialSchedule);
  };

  // --- Handlers (Reset, Export, Import) ---
  const handleStartNewWeek = () => {
    if (!window.confirm("Start new WEEK? Saves history & resets tasks."))
      return;
    const weeklySnapshot = {};
    daysOrder.forEach((d) => {
      if (d !== "Monthly") weeklySnapshot[d] = schedule[d];
    });
    saveToHistory(
      "week",
      `Week of ${new Date().toLocaleDateString()}`,
      weeklySnapshot,
      weeklyStats.totalProgress || 0
    );
    setSchedule((prev) => {
      const newSchedule = {};
      daysOrder.forEach((dayKey) => {
        if (dayKey === "Monthly") {
          newSchedule[dayKey] = prev[dayKey];
          return;
        }
        const plans = [{ id: `p_${dayKey}_main`, name: "Main", items: [] }];
        tabSettings.forEach((setting) => {
          if (setting.days.includes(dayKey)) {
            plans.push({
              id: `p_${dayKey}_custom_${setting.id}`,
              name: setting.name,
              items: [],
            });
          }
        });
        newSchedule[dayKey] = { activePlanIndex: 0, plans: plans };
      });
      newSchedule["Monthly"] = prev["Monthly"];
      return newSchedule;
    });
    setOpenMenu(null);
  };
  const handleStartNewMonth = () => {
    const monthName = prompt(
      "Name this month:",
      new Date().toLocaleString("default", { month: "long" })
    );
    if (!monthName) return;
    saveToHistory(
      "month",
      monthName,
      { Monthly: schedule.Monthly },
      monthlyStats.percent
    );
    setSchedule((prev) => ({
      ...prev,
      Monthly: {
        activePlanIndex: 0,
        plans: [{ id: "m1", name: "Main", items: [] }],
      },
    }));
    setOpenMenu(null);
  };
  const handleClearAll = () => {
    if (!window.confirm("Delete ALL data?")) return;
    setSchedule(initialSchedule);
    setOpenMenu(null);
  };
  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ schedule, history, tabSettings }));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = "scheduler_backup.json";
    a.click();
    a.remove();
    setOpenMenu(null);
  };

  // --- ROBUST IMPORT HANDLER ---
  const handleImport = (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        let newSchedule = { ...initialSchedule }; // Start with defaults to be safe
        let newHistory = [];
        let newTabSettings = tabSettings;

        let importSuccess = false;

        if (parsed.schedule) {
          // Standard backup format
          newSchedule = { ...newSchedule, ...parsed.schedule }; // Merge to ensure all days exist
          newHistory = parsed.history || [];
          if (parsed.tabSettings) newTabSettings = parsed.tabSettings;
          importSuccess = true;
        } else if (parsed.Monday) {
          // Legacy format
          newSchedule = { ...newSchedule, ...parsed };
          importSuccess = true;
        }

        if (importSuccess) {
          // 1. Update State
          setSchedule(newSchedule);
          setHistory(newHistory);
          setTabSettings(newTabSettings);

          // 2. Direct Database Save (Crucial fix for "disappearing tasks")
          if (user && db) {
            const docRef = doc(db, "schedules", user.username);
            // We use setDoc with merge:true to ensure we don't blow away other fields like 'createdAt'
            await setDoc(
              docRef,
              {
                schedule: newSchedule,
                history: newHistory,
                tabSettings: newTabSettings,
                lastUpdated: new Date().toISOString(),
              },
              { merge: true }
            );
          }

          showNotification("success", "Success! Schedule restored.");
        } else {
          showNotification("error", "Invalid file format.");
        }
      } catch (err) {
        console.error(err);
        showNotification("error", "Error reading file.");
      }
    };
    setOpenMenu(null);
  };

  // --- Tab/Task Handlers ---
  const addTabSetting = () => {
    setTabSettings([
      ...tabSettings,
      { id: Date.now(), name: "New Tab", days: [] },
    ]);
  };
  const updateTabSetting = (id, field, value) => {
    setTabSettings(
      tabSettings.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };
  const toggleTabDay = (id, day) => {
    setTabSettings(
      tabSettings.map((t) => {
        if (t.id !== id) return t;
        const newDays = t.days.includes(day)
          ? t.days.filter((d) => d !== day)
          : [...t.days, day];
        return { ...t, days: newDays };
      })
    );
  };
  const deleteTabSetting = (id) => {
    setTabSettings(tabSettings.filter((t) => t.id !== id));
  };
  const toggleCompletion = (day, planIndex, itemId) => {
    // 1. Update State
    setSchedule((prev) => {
      const dayData = prev[day];
      const plan = dayData.plans[planIndex];
      const updatedItems = plan.items.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );

      // Check if item was JUST completed
      const isNowComplete = updatedItems.find((i) => i.id === itemId).completed;
      if (isNowComplete) {
        setIsBarking(true);
        setTimeout(() => setIsBarking(false), 2000); // Stop barking after 2s
      }

      const updatedPlans = [...dayData.plans];
      updatedPlans[planIndex] = { ...plan, items: updatedItems };
      return { ...prev, [day]: { ...dayData, plans: updatedPlans } };
    });
  };

  const moveTaskToNextDay = () => {
    if (!activeModal.item || !activeModal.day) return;
    const currentDayIndex = daysOrder.indexOf(activeModal.day);
    if (currentDayIndex === -1 || currentDayIndex >= daysOrder.length - 1)
      return;
    const nextDay = daysOrder[currentDayIndex + 1];
    setSchedule((prev) => {
      const newState = { ...prev };
      const currentDayData = newState[activeModal.day];
      const currentPlan = currentDayData.plans[currentDayData.activePlanIndex];
      currentPlan.items = currentPlan.items.filter(
        (i) => i.id !== activeModal.item.id
      );
      const nextDayData = newState[nextDay];
      const nextPlanIndex = nextDayData.activePlanIndex;
      const nextPlan = nextDayData.plans[nextPlanIndex];
      nextPlan.items = [
        ...nextPlan.items,
        { ...activeModal.item, completed: false },
      ];
      return newState;
    });
    closeModal();
  };
  const openAddModal = (day) => {
    setModalInput("");
    setModalTime("");
    setModalColor("default");
    setActiveModal({ isOpen: true, mode: "add", day, item: null });
  };
  const openEditModal = (day, item) => {
    setModalInput(item.text);
    setModalTime(item.time || "");
    setModalColor(item.color || "default");
    setActiveModal({ isOpen: true, mode: "edit", day, item });
  };
  const closeModal = () => {
    setActiveModal({ isOpen: false, mode: "add", day: null, item: null });
  };

  const handleModalSave = () => {
    if (!modalInput.trim() || !activeModal.day) return;
    const { day, mode, item } = activeModal;
    setSchedule((prev) => {
      const dayData = prev[day];
      const activePlan = dayData.plans[dayData.activePlanIndex];
      const updatedPlans = [...dayData.plans];
      let newItems = [...activePlan.items];
      const commonData = { time: modalTime, color: modalColor };

      if (mode === "add") {
        if (modalInput.includes("\n")) {
          modalInput.split("\n").forEach((line, index) => {
            if (line.trim())
              newItems.push({
                id: Date.now() + index,
                text: line.trim(),
                ...commonData,
                completed: false,
              });
          });
        } else {
          newItems.push({
            id: Date.now(),
            text: modalInput.trim(),
            ...commonData,
            completed: false,
          });
        }
      } else {
        newItems = activePlan.items.map((i) =>
          i.id === item.id ? { ...i, text: modalInput, ...commonData } : i
        );
      }

      // Sort items: items with time first (sorted ascending), then items without time
      newItems.sort((a, b) => {
        if (a.time && !b.time) return -1;
        if (!a.time && b.time) return 1;
        if (a.time && b.time) return a.time.localeCompare(b.time);
        return 0;
      });

      updatedPlans[dayData.activePlanIndex] = {
        ...activePlan,
        items: newItems,
      };
      return { ...prev, [day]: { ...dayData, plans: updatedPlans } };
    });
    closeModal();
  };

  const handleModalDelete = () => {
    const { day, item } = activeModal;
    setSchedule((prev) => {
      const dayData = prev[day];
      const activePlan = dayData.plans[dayData.activePlanIndex];
      const updatedPlans = [...dayData.plans];
      updatedPlans[dayData.activePlanIndex] = {
        ...activePlan,
        items: activePlan.items.filter((i) => i.id !== item.id),
      };
      return { ...prev, [day]: { ...dayData, plans: updatedPlans } };
    });
    closeModal();
  };
  const handleAddPlan = (day) => {
    setSchedule((prev) => {
      const d = prev[day];
      return {
        ...prev,
        [day]: {
          ...d,
          activePlanIndex: d.plans.length,
          plans: [
            ...d.plans,
            {
              id: `p${Date.now()}`,
              name: `Plan ${String.fromCharCode(65 + d.plans.length)}`,
              items: [],
            },
          ],
        },
      };
    });
  };
  const handleRemovePlan = (day, idx, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete plan?")) return;
    setSchedule((prev) => {
      const d = prev[day];
      const newP = d.plans.filter((_, i) => i !== idx);
      return { ...prev, [day]: { ...d, activePlanIndex: 0, plans: newP } };
    });
  };
  const setActivePlan = (day, idx) =>
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], activePlanIndex: idx },
    }));
  const startEditingPlan = (day, idx, name) => {
    setEditingPlan({ day, planIndex: idx });
    setEditPlanValue(name);
  };
  const savePlanEdit = () => {
    if (editingPlan) {
      setSchedule((prev) => {
        const d = prev[editingPlan.day];
        const newP = [...d.plans];
        newP[editingPlan.planIndex].name = editPlanValue;
        return { ...prev, [editingPlan.day]: { ...d, plans: newP } };
      });
      setEditingPlan(null);
    }
  };

  // --- DESKTOP DRAG & DROP ---
  const handleDragStart = (e, item, day, planIndex, itemIndex) => {
    dragItem.current = { item, day, planIndex, itemIndex };
    dragNode.current = e.target;
    setTimeout(() => setIsDragging(true), 0);
  };
  const handleDragEnter = (e, tDay, tPlan, tIdx) => {
    if (!dragItem.current) return;
    const s = dragItem.current;
    if (s.day === tDay && s.planIndex === tPlan && s.itemIndex === tIdx) return;
    setSchedule((prev) => {
      const newState = { ...prev };
      const sList = newState[s.day].plans[s.planIndex].items;
      const [removed] = sList.splice(s.itemIndex, 1);
      const tList =
        s.day === tDay && s.planIndex === tPlan
          ? sList
          : newState[tDay].plans[tPlan].items;
      tList.splice(tIdx, 0, removed);
      dragItem.current = { ...s, day: tDay, planIndex: tPlan, itemIndex: tIdx };
      return newState;
    });
  };
  const handleDropOnEmpty = (e, tDay) => {
    e.preventDefault();
    if (!dragItem.current) return;
    const tPlan = schedule[tDay].activePlanIndex;
    if (schedule[tDay].plans[tPlan].items.length > 0) return;
    setSchedule((prev) => {
      const newState = { ...prev };
      const s = dragItem.current;
      const [removed] = newState[s.day].plans[s.planIndex].items.splice(
        s.itemIndex,
        1
      );
      newState[tDay].plans[tPlan].items = [removed];
      dragItem.current = { ...s, day: tDay, planIndex: tPlan, itemIndex: 0 };
      return newState;
    });
  };
  const handleDragEnd = () => setIsDragging(false);

  // --- TOUCH DRAG & DROP (MOBILE) ---
  const handleTouchStart = (e, item, day, planIndex, itemIndex) => {
    // Only allow dragging from the handle to prevent accidental drags while scrolling
    const isHandle = e.target.closest(".drag-handle");
    if (!isHandle) return;

    dragItem.current = { item, day, planIndex, itemIndex };
    dragNode.current = e.target;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!dragItem.current) return;

    // Stop scrolling
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    if (!target) return;

    const li = target.closest("li");
    if (!li) return; // Not hovering over a task

    // Extract data from the LI
    const { day, planIndex, itemIndex } = li.dataset;

    if (!day || !planIndex || !itemIndex) return;

    const tDay = day;
    const tPlan = parseInt(planIndex);
    const tIdx = parseInt(itemIndex);

    // Swap logic (same as desktop)
    const s = dragItem.current;
    if (s.day === tDay && s.planIndex === tPlan && s.itemIndex === tIdx) return;

    setSchedule((prev) => {
      const newState = { ...prev };
      const sList = newState[s.day].plans[s.planIndex].items;
      // Safety check
      if (!sList[s.itemIndex]) return prev;

      const [removed] = sList.splice(s.itemIndex, 1);

      const tList =
        s.day === tDay && s.planIndex === tPlan
          ? sList
          : newState[tDay].plans[tPlan].items;
      tList.splice(tIdx, 0, removed);

      // Update ref reference
      dragItem.current = { ...s, day: tDay, planIndex: tPlan, itemIndex: tIdx };
      return newState;
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    dragItem.current = null;
  };

  // --- RENDER LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-indigo-500 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-orange-500 blur-3xl"></div>
        </div>

        <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-8 relative z-10 border border-white/50 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight">
              Shiba Schedule
            </h1>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mt-2">
              {authMode === "login" ? "Welcome Back!" : "Create New Account"}
            </p>
          </div>

          <ShibaAvatar
            eyePosition={eyePosition}
            isHiding={isHiding}
            isPeeking={showPin}
            isSad={!!authError}
          />

          <form onSubmit={handleAuth} className="space-y-4">
            {/* Username Input - Eyes Watch */}
            <div className="relative group">
              <User className="absolute left-4 top-4 w-5 h-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
              <input
                name="username"
                type="text"
                placeholder="Username"
                autoComplete="off"
                onFocus={() => {
                  setIsHiding(false);
                }}
                onChange={(e) => {
                  // Update eye position based on text length (0 to 100%)
                  const len = e.target.value.length;
                  const percent = Math.min(len * 5, 100);
                  setEyePosition(percent);
                }}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-transparent bg-gray-50 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all placeholder-gray-400 font-medium text-gray-700"
              />
            </div>

            {/* PIN Input - Paws Hide Eyes */}
            <div className="relative group">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
              <input
                name="pin"
                type={showPin ? "text" : "password"}
                placeholder="PIN Code"
                maxLength="4"
                onFocus={() => {
                  setIsHiding(true);
                }}
                onBlur={() => {
                  setIsHiding(false);
                  setShowPin(false);
                }}
                className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-transparent bg-gray-50 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all placeholder-gray-400 font-bold text-lg tracking-widest text-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-4 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {showPin ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {authError && (
              <div className="text-red-500 text-xs text-center font-bold bg-red-50 py-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] hover:shadow-xl disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2 group"
            >
              {isAuthLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {authMode === "login" ? "Login" : "Create Account"}
                  <ArrowRightCircle className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setAuthMode(authMode === "login" ? "signup" : "login");
                setAuthError("");
              }}
              className="text-indigo-600 text-sm font-bold hover:underline transition-all"
            >
              {authMode === "login"
                ? "Don't have an account? Create one"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Render (MAIN APP) ---
  const containerClasses =
    viewMode === "landscape" || viewMode === "slide"
      ? `flex flex-row gap-4 overflow-x-auto pb-8 snap-x ${
          viewMode === "slide" ? "snap-mandatory" : ""
        } px-4`
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4";
  const cardClasses = (day) =>
    `flex flex-col rounded-2xl shadow-sm border transition-all duration-300 relative overflow-hidden ${
      viewMode === "landscape"
        ? "min-w-[280px] w-[280px] snap-center h-[70vh] md:h-[80vh]"
        : ""
    } ${
      viewMode === "slide"
        ? "min-w-full w-full snap-center h-[70vh] md:h-[80vh]"
        : ""
    } ${viewMode === "grid" ? "w-full" : ""} ${
      isDarkMode
        ? "bg-slate-800 border-slate-700"
        : "bg-white/90 backdrop-blur-sm border-white/50"
    }`;

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 bg-cover bg-center bg-fixed ${
        wallpapers[wallpaper] || wallpapers.default
      }`}
      onClick={() => {
        if (editingPlan) savePlanEdit();
        if (openMenu) setOpenMenu(null);
        if (showWallpapers) setShowWallpapers(false);
      }}
    >
      {/* --- NOTIFICATION BUBBLE --- */}
      {notification && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-300 font-bold ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="max-w-[1600px] mx-auto p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 bg-opacity-90 backdrop-blur-md">
        <div className="flex items-center gap-4 flex-grow">
          {/* DASHBOARD SHIBA (REPLACES CROWN) */}
          <ShibaAvatar
            eyePosition={50}
            isHiding={false}
            isPeeking={false}
            isBarking={isBarking}
            size="small"
            className="mx-0"
          />

          <div className="flex flex-col flex-grow max-w-md">
            <div className="flex justify-between items-end mb-1">
              <span
                className={`text-xs font-bold uppercase tracking-widest ${baseTextColor}`}
              >
                Level {weeklyStats.level}
              </span>
              <div className="flex gap-2 items-center">
                <span className={`text-[10px] font-medium ${mutedTextColor}`}>
                  {weeklyStats.currentXP} XP
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold uppercase`}
                >
                  {user.username}
                </span>
              </div>
            </div>
            <div
              className={`h-2.5 w-full rounded-full overflow-hidden ${
                isDarkMode ? "bg-black/30" : "bg-white/50"
              }`}
            >
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
                style={{ width: `${Math.max(weeklyStats.progressToNext, 5)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center justify-end w-full md:w-auto">
          <div className="relative shrink-0">
            <button
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-lg shrink-0 transition-colors ${
                isDarkMode ? "bg-slate-700" : "bg-white/80 shadow-sm"
              }`}
              title="System Settings"
            >
              <Settings className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="h-6 w-px bg-gray-300 mx-1 opacity-50 shrink-0"></div>
          <div
            className={`flex p-1 rounded-lg shrink-0 ${
              isDarkMode ? "bg-slate-800" : "bg-white/80 shadow-sm"
            }`}
          >
            <button
              onClick={() => setViewMode("slide")}
              className={`p-1.5 rounded-md ${
                viewMode === "slide"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-400"
              }`}
            >
              <GalleryHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("landscape")}
              className={`p-1.5 rounded-md ${
                viewMode === "landscape"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-400"
              }`}
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md ${
                viewMode === "grid"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-400"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(openMenu === "reset" ? null : "reset");
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold ${
                isDarkMode
                  ? "bg-indigo-900/80 text-indigo-300"
                  : "bg-white/80 shadow-sm text-indigo-600"
              }`}
            >
              <RefreshCw className="w-4 h-4" />{" "}
              <span className="hidden sm:inline">Reset</span>{" "}
              <ChevronDown className="w-3 h-3 opacity-50" />
            </button>
            {openMenu === "reset" && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl z-50 border overflow-hidden ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <button
                  onClick={handleStartNewWeek}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-opacity-50 ${
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <RotateCcw className="w-4 h-4 text-indigo-500" /> New Week
                </button>
                <button
                  onClick={handleStartNewMonth}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-opacity-50 ${
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <CalendarDays className="w-4 h-4 text-blue-500" /> New Month
                </button>
                <div className="h-px bg-gray-200 dark:bg-slate-700"></div>
                <button
                  onClick={handleClearAll}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-opacity-50 ${
                    isDarkMode
                      ? "hover:bg-red-900/20 text-red-400"
                      : "hover:bg-red-50 text-red-600"
                  }`}
                >
                  <Eraser className="w-4 h-4" /> Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ... (Main Grid, History, Modals - Same as before) ... */}
      <div className={`max-w-[1600px] mx-auto ${containerClasses}`}>
        {daysOrder.map((day) => {
          const dayData = schedule[day];
          const items = dayData.plans[dayData.activePlanIndex].items;
          const isToday =
            day === new Date().toLocaleDateString("en-US", { weekday: "long" });
          const progress = getProgress(items);
          const isComplete = items.length > 0 && progress === 100;
          const isMonthly = day === "Monthly";

          return (
            <div
              key={day}
              ref={(el) => (dayRefs.current[day] = el)}
              className={`${cardClasses(day)} ${
                isDragging ? "opacity-90" : ""
              } ${isToday ? "ring-4 ring-indigo-400/50" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnEmpty(e, day)}
            >
              {items.length > 0 && (
                <div
                  className={`p-2 border-b ${
                    isDarkMode
                      ? "bg-slate-900/50 border-slate-700"
                      : "bg-gray-50/50 border-gray-100"
                  }`}
                >
                  <div className="w-full h-2 rounded-full overflow-hidden relative shadow-inner bg-gray-200/50">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end ${
                        isComplete
                          ? "bg-yellow-400"
                          : isMonthly
                          ? "bg-blue-500"
                          : "bg-indigo-500"
                      }`}
                      style={{ width: `${Math.max(progress, 5)}%` }}
                    />
                  </div>
                </div>
              )}
              {/* ... (Rest of Card Content) ... */}
              <div
                className={`p-4 border-b ${
                  isDarkMode ? "border-slate-700" : "border-gray-100"
                } bg-opacity-50`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h2
                    className={`font-bold uppercase tracking-wider text-lg flex items-center gap-2 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {day}
                    {isToday && (
                      <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                    {isComplete && (
                      <Trophy
                        className="w-5 h-5 text-yellow-500 animate-bounce"
                        fill="currentColor"
                      />
                    )}
                  </h2>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      isDarkMode ? "bg-slate-700" : "bg-gray-100"
                    }`}
                  >
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {dayData.plans.map((plan, idx) => (
                    <div
                      key={plan.id}
                      className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer border flex gap-1 items-center ${
                        idx === dayData.activePlanIndex
                          ? isDarkMode
                            ? "bg-slate-700 border-slate-600"
                            : "bg-white shadow-sm border-gray-200"
                          : "border-transparent text-gray-400"
                      }`}
                      onClick={() => setActivePlan(day, idx)}
                      onDoubleClick={() =>
                        startEditingPlan(day, idx, plan.name)
                      }
                    >
                      {editingPlan?.day === day &&
                      editingPlan?.planIndex === idx ? (
                        <input
                          autoFocus
                          className={`w-12 bg-transparent outline-none border-b border-indigo-500 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                          value={editPlanValue}
                          onChange={(e) => setEditPlanValue(e.target.value)}
                          onBlur={savePlanEdit}
                          onKeyDown={(e) => e.key === "Enter" && savePlanEdit()}
                        />
                      ) : (
                        plan.name
                      )}
                      {dayData.plans.length > 1 && (
                        <X
                          onClick={(e) => handleRemovePlan(day, idx, e)}
                          className="w-3 h-3 opacity-50 hover:opacity-100 hover:text-red-500"
                        />
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddPlan(day)}
                    className="p-1 rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div
                className={`flex-grow overflow-y-auto ${
                  viewMode === "landscape" || viewMode === "slide"
                    ? "p-3"
                    : "p-4 min-h-[150px]"
                }`}
              >
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li
                      key={item.id}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(
                          e,
                          item,
                          day,
                          dayData.activePlanIndex,
                          index
                        )
                      }
                      onDragEnter={(e) =>
                        handleDragEnter(e, day, dayData.activePlanIndex, index)
                      }
                      onDragEnd={handleDragEnd}
                      // --- MOBILE TOUCH EVENTS ---
                      onTouchStart={(e) =>
                        handleTouchStart(
                          e,
                          item,
                          day,
                          dayData.activePlanIndex,
                          index
                        )
                      }
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      data-day={day}
                      data-plan-index={dayData.activePlanIndex}
                      data-item-index={index}
                      onClick={() => openEditModal(day, item)}
                      className={`group flex gap-2 p-3 rounded-xl border shadow-sm cursor-pointer active:scale-95 transition-all ${getTaskStyles(
                        item.color,
                        isDarkMode
                      )} ${item.completed ? "opacity-60" : ""}`}
                    >
                      <div className="drag-handle touch-none mt-1 p-1 -m-1">
                        <GripVertical
                          className={`w-4 h-4 ${
                            isDarkMode ? "text-slate-500" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompletion(
                            day,
                            dayData.activePlanIndex,
                            item.id
                          );
                        }}
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center ${
                          item.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        <Check
                          className={`w-3.5 h-3.5 ${
                            item.completed ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </button>
                      <div className="flex-grow min-w-0">
                        <div
                          className={`text-sm font-medium leading-snug break-words ${
                            item.completed ? "line-through opacity-70" : ""
                          }`}
                        >
                          {item.text}
                        </div>
                        {item.time && (
                          <div
                            className={`text-[10px] mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${
                              isDarkMode ? "bg-black/20" : "bg-white/50"
                            }`}
                          >
                            {day === "Monthly" ? (
                              <CalendarDays className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}{" "}
                            {item.time}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={`p-3 mt-auto border-t ${
                  isDarkMode
                    ? "border-slate-700"
                    : "border-gray-50 bg-gray-50/50"
                }`}
              >
                <button
                  onClick={() => openAddModal(day)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 font-medium rounded-xl text-sm active:scale-95 transition-all ${
                    isDarkMode
                      ? "bg-slate-700 text-indigo-300"
                      : "bg-white shadow-sm text-indigo-600 border border-gray-200"
                  }`}
                >
                  <PlusCircle className="w-4 h-4" /> Add Task
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Unified System Settings Modal --- */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${
              isDarkMode ? "bg-slate-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div
              className={`p-4 border-b flex justify-between items-center ${
                isDarkMode ? "border-slate-700" : "border-gray-100"
              }`}
            >
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Settings className="w-5 h-5" /> System Settings
              </h3>
              <button onClick={() => setShowSettings(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs Header */}
            <div
              className={`flex border-b ${
                isDarkMode
                  ? "border-slate-700 bg-slate-900/50"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              {["appearance", "data", "tabs", "account"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSettingsTab(tab)}
                  className={`flex-1 py-3 text-sm font-bold capitalize transition-colors ${
                    settingsTab === tab
                      ? isDarkMode
                        ? "text-indigo-400 border-b-2 border-indigo-500"
                        : "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                      : "text-gray-400 hover:text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto">
              {/* --- APPEARANCE TAB --- */}
              {settingsTab === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold mb-3 text-sm uppercase tracking-wider opacity-60">
                      Theme Mode
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsDarkMode(false)}
                        className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 ${
                          !isDarkMode
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-gray-200"
                        }`}
                      >
                        <Sun className="w-5 h-5" /> Light
                      </button>
                      <button
                        onClick={() => setIsDarkMode(true)}
                        className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 ${
                          isDarkMode
                            ? "border-indigo-500 bg-indigo-900/30 text-indigo-300"
                            : "border-gray-200"
                        }`}
                      >
                        <Moon className="w-5 h-5" /> Dark
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-3 text-sm uppercase tracking-wider opacity-60">
                      Wallpaper
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(wallpapers).map((w) => (
                        <button
                          key={w}
                          onClick={() => setWallpaper(w)}
                          className={`px-4 py-3 text-sm text-left rounded-xl border flex gap-2 items-center capitalize transition-all ${
                            wallpaper === w
                              ? "border-indigo-500 ring-2 ring-indigo-200"
                              : isDarkMode
                              ? "border-slate-600 hover:bg-slate-700"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border ${
                              w === "default" ? "bg-gray-100" : ""
                            } ${w === "nature" ? "bg-green-600" : ""} ${
                              w === "ocean" ? "bg-blue-600" : ""
                            } ${w === "sunset" ? "bg-orange-500" : ""} ${
                              w === "fall" ? "bg-red-700" : ""
                            }`}
                          ></div>{" "}
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* --- DATA TAB --- */}
              {settingsTab === "data" && (
                <div className="space-y-4">
                  <button
                    onClick={handleExport}
                    className={`w-full py-4 px-4 rounded-xl border flex items-center gap-3 transition-all ${
                      isDarkMode
                        ? "border-slate-600 hover:bg-slate-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Download className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Download Backup</div>
                      <div className="text-xs opacity-60">
                        Save schedule to file
                      </div>
                    </div>
                  </button>
                  <label
                    className={`w-full py-4 px-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      isDarkMode
                        ? "border-slate-600 hover:bg-slate-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Import Data</div>
                      <div className="text-xs opacity-60">
                        Restore from file
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".json"
                      onChange={handleImport}
                    />
                  </label>
                </div>
              )}

              {/* --- TABS TAB --- */}
              {settingsTab === "tabs" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-bold">Auto-Generated Tabs</h4>
                      <p className="text-xs opacity-60">
                        Created on new week start.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {tabSettings.map((tab, idx) => (
                      <div
                        key={tab.id}
                        className={`p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-slate-900 border-slate-700"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={tab.name}
                            onChange={(e) =>
                              updateTabSetting(tab.id, "name", e.target.value)
                            }
                            className={`flex-grow p-2 rounded text-sm font-bold border ${
                              isDarkMode
                                ? "bg-slate-800 border-slate-600 text-white"
                                : "bg-white border-gray-300"
                            }`}
                            placeholder="Tab Name"
                          />
                          <button
                            onClick={() => deleteTabSetting(tab.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {daysOrder
                            .filter((d) => d !== "Monthly")
                            .map((day) => (
                              <button
                                key={day}
                                onClick={() => toggleTabDay(tab.id, day)}
                                className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                                  tab.days.includes(day)
                                    ? "bg-indigo-500 text-white border-indigo-600"
                                    : isDarkMode
                                    ? "bg-slate-800 border-slate-600 hover:bg-slate-700"
                                    : "bg-white border-gray-300 hover:bg-gray-100"
                                }`}
                              >
                                {day.slice(0, 3)}
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addTabSetting}
                    className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-400 font-bold rounded-xl mt-3 hover:bg-gray-50 hover:text-gray-500 transition-colors"
                  >
                    + Add Tab
                  </button>
                </div>
              )}

              {/* --- ACCOUNT TAB --- */}
              {settingsTab === "account" && (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      isDarkMode
                        ? "border-slate-700 bg-slate-900"
                        : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 text-indigo-700 rounded-full">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold">{user.username}</div>
                        <div className="text-xs opacity-60">Logged In</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200"
                    >
                      Sign Out
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      setShowHistory(true);
                    }}
                    className={`w-full py-4 px-4 rounded-xl border flex items-center gap-3 transition-all ${
                      isDarkMode
                        ? "border-slate-600 hover:bg-slate-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <History className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">View History</div>
                      <div className="text-xs opacity-60">See past weeks</div>
                    </div>
                    <ChevronRight className="w-5 h-5 ml-auto opacity-30" />
                  </button>
                </div>
              )}
            </div>
            <div
              className={`p-4 border-t ${
                isDarkMode ? "border-slate-700" : "border-gray-100"
              }`}
            >
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Add/Edit Modal (Existing) --- */}
      {activeModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
              isDarkMode ? "bg-slate-800" : "bg-white"
            }`}
          >
            <div
              className={`p-4 border-b flex justify-between items-center ${
                isDarkMode
                  ? "border-slate-700 bg-slate-800"
                  : "border-gray-100 bg-gray-50/80"
              }`}
            >
              <h3 className="font-bold text-lg">
                {activeModal.mode === "add" ? "Add Task" : "Edit Task"}
              </h3>
              <button onClick={closeModal}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <textarea
                  ref={modalInputRef}
                  value={modalInput}
                  onChange={(e) => setModalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleModalSave();
                    }
                  }}
                  placeholder="What needs to be done?"
                  rows={3}
                  className={`w-full text-lg px-4 py-3 rounded-xl border focus:ring-4 outline-none resize-none ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-700 focus:ring-indigo-900/50 text-white"
                      : "bg-white focus:ring-indigo-50"
                  }`}
                />
                {activeModal.mode === "add" && (
                  <p className="text-xs mt-1 text-gray-400">
                    💡 Tip: Paste a list or type multiple lines to add distinct
                    tasks.
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <div
                  className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border ${
                    isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white"
                  }`}
                >
                  {activeModal.day === "Monthly" ? (
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400" />
                  )}
                  <input
                    type={activeModal.day === "Monthly" ? "date" : "time"}
                    value={modalTime}
                    onChange={(e) => setModalTime(e.target.value)}
                    className={`bg-transparent outline-none w-full text-sm ${
                      isDarkMode ? "text-slate-200" : "text-gray-500"
                    }`}
                  />
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                    isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white"
                  }`}
                >
                  <Tag className="w-4 h-4 text-gray-400" />
                  <select
                    value={modalColor}
                    onChange={(e) => setModalColor(e.target.value)}
                    className={`bg-transparent outline-none text-sm cursor-pointer ${
                      isDarkMode ? "text-slate-200" : "text-gray-500"
                    }`}
                  >
                    <option value="default">Default</option>
                    <option value="red">Urgent 🔴</option>
                    <option value="blue">Work 🔵</option>
                    <option value="green">Home 🟢</option>
                    <option value="yellow">Fun 🟡</option>
                    <option value="orange">Personal 🟠</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {activeModal.mode === "edit" ? (
                  <>
                    <button
                      onClick={handleModalSave}
                      className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg active:scale-95 flex justify-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                    <div className="flex gap-2">
                      {activeModal.day !== "Monthly" && (
                        <button
                          onClick={moveTaskToNextDay}
                          className={`flex-1 py-3 font-medium rounded-xl border flex justify-center gap-2 ${
                            isDarkMode ? "border-slate-600" : "border-gray-200"
                          }`}
                        >
                          <ArrowRight className="w-4 h-4" /> Tomorrow
                        </button>
                      )}
                      <button
                        onClick={handleModalDelete}
                        className="flex-1 py-3 font-medium rounded-xl text-red-500 border border-red-200 flex justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={closeModal}
                      className="flex-1 py-3 font-medium rounded-xl text-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleModalSave}
                      disabled={!modalInput.trim()}
                      className="flex-[2] py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg active:scale-95 disabled:opacity-50"
                    >
                      Add Task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
