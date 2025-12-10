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
  Image as ImageIcon,
} from "lucide-react";

export default function WeeklyScheduler() {
  // --- State Management ---
  const [viewMode, setViewMode] = useState("slide");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [wallpaper, setWallpaper] = useState("default");

  // MULTI-TAB Settings (Array of objects)
  const [tabSettings, setTabSettings] = useState(() => {
    const saved = localStorage.getItem("tabSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: Handle old single-object format if it exists
      if (!Array.isArray(parsed) && parsed.name) {
        return [{ id: Date.now(), name: parsed.name, days: parsed.days || [] }];
      }
      return Array.isArray(parsed) ? parsed : [];
    }
    // Default example if nothing saved
    return [
      {
        id: 1,
        name: "Work",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
    ];
  });

  // Initial Data Configuration
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

  const [schedule, setSchedule] = useState(() => {
    const savedSchedule = localStorage.getItem("mySchedule");
    return savedSchedule ? JSON.parse(savedSchedule) : initialSchedule;
  });

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("myHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Load Preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setIsDarkMode(true);
    const savedWallpaper = localStorage.getItem("wallpaper");
    if (savedWallpaper) setWallpaper(savedWallpaper);
  }, []);

  // Persist Data
  useEffect(() => {
    localStorage.setItem("mySchedule", JSON.stringify(schedule));
  }, [schedule]);
  useEffect(() => {
    localStorage.setItem("myHistory", JSON.stringify(history));
  }, [history]);
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);
  useEffect(() => {
    localStorage.setItem("wallpaper", wallpaper);
  }, [wallpaper]);
  useEffect(() => {
    localStorage.setItem("tabSettings", JSON.stringify(tabSettings));
  }, [tabSettings]);

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

  // --- Themes & Wallpapers ---
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
        light: "bg-white border-gray-200 hover:border-indigo-200",
        dark: "bg-slate-700 border-slate-600 hover:border-slate-500",
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

  // --- Helper Functions ---
  useEffect(() => {
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
  }, [viewMode]);

  const getProgress = (items) => {
    if (!items || items.length === 0) return 0;
    const completed = items.filter((i) => i.completed).length;
    return Math.round((completed / items.length) * 100);
  };

  // --- Archive Logic ---
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

  // --- Reset Logic with MULTI-TABS ---
  const handleStartNewWeek = () => {
    if (
      !window.confirm(
        "Start new WEEK? This saves history, resets items, and applies your Tab Settings."
      )
    )
      return;

    // Archive
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

    // Reset & Rebuild
    setSchedule((prev) => {
      const newSchedule = {};

      daysOrder.forEach((dayKey) => {
        if (dayKey === "Monthly") {
          newSchedule[dayKey] = prev[dayKey];
          return;
        }

        // 1. Always create Main plan
        const plans = [{ id: `p_${dayKey}_main`, name: "Main", items: [] }];

        // 2. Loop through User Settings and add custom tabs
        tabSettings.forEach((setting, index) => {
          if (setting.days.includes(dayKey)) {
            plans.push({
              id: `p_${dayKey}_custom_${setting.id}`,
              name: setting.name,
              items: [],
            });
          }
        });

        newSchedule[dayKey] = {
          activePlanIndex: 0,
          plans: plans,
        };
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
    if (!window.confirm("Delete ALL tasks?")) return;
    setSchedule(initialSchedule);
    setOpenMenu(null);
  };

  // --- Export/Import ---
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
  const handleImport = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (data.schedule && window.confirm("Overwrite current data?")) {
          setSchedule(data.schedule);
          if (data.history) setHistory(data.history);
          if (data.tabSettings) setTabSettings(data.tabSettings);
        }
      } catch (err) {
        alert("Error");
      }
    };
    setOpenMenu(null);
  };

  // --- Tab Settings Handlers ---
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

  // --- Core Task Logic ---
  const toggleCompletion = (day, planIndex, itemId) => {
    setSchedule((prev) => {
      const dayData = prev[day];
      const plan = dayData.plans[planIndex];
      const updatedItems = plan.items.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
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

  // Drag logic omitted for brevity
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

  // --- Render ---
  const containerClasses =
    viewMode === "landscape" || viewMode === "slide"
      ? `flex flex-row gap-4 overflow-x-auto pb-8 snap-x ${
          viewMode === "slide" ? "snap-mandatory" : ""
        } px-4`
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4";

  // UPDATED: Added h-[70vh] md:h-[80vh] to force height on desktop
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
      {/* Header */}
      <div className="max-w-[1600px] mx-auto p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 bg-opacity-90 backdrop-blur-md">
        <div className="flex items-center gap-4 flex-grow">
          <div
            className={`p-2.5 rounded-full shadow-md border-2 ${
              isDarkMode
                ? "bg-indigo-900 border-indigo-700 text-yellow-400"
                : "bg-white border-indigo-100 text-yellow-500"
            }`}
          >
            <Crown className="w-6 h-6" fill="currentColor" />
          </div>
          <div className="flex flex-col flex-grow max-w-md">
            <div className="flex justify-between items-end mb-1">
              <span
                className={`text-xs font-bold uppercase tracking-widest ${baseTextColor}`}
              >
                Week Level {weeklyStats.level}
              </span>
              <span className={`text-[10px] font-medium ${mutedTextColor}`}>
                {weeklyStats.currentXP} XP
              </span>
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

        <div className="flex gap-2 items-center">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowWallpapers(!showWallpapers);
              }}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? "bg-slate-700" : "bg-white/80 shadow-sm"
              }`}
              title="Wallpapers"
            >
              <Palette className="w-5 h-5 text-pink-500" />
            </button>
            {showWallpapers && (
              <div
                className={`absolute right-0 mt-2 w-40 rounded-xl shadow-xl z-50 border overflow-hidden p-2 grid grid-cols-1 gap-1 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <button
                  onClick={() => setWallpaper("default")}
                  className="px-2 py-2 text-sm text-left rounded hover:bg-gray-100 dark:hover:bg-slate-700 flex gap-2 items-center"
                >
                  <div className="w-4 h-4 rounded-full border bg-gray-100"></div>{" "}
                  Default
                </button>
                <button
                  onClick={() => setWallpaper("nature")}
                  className="px-2 py-2 text-sm text-left rounded hover:bg-gray-100 dark:hover:bg-slate-700 flex gap-2 items-center"
                >
                  <div className="w-4 h-4 rounded-full bg-green-600"></div>{" "}
                  Nature
                </button>
                <button
                  onClick={() => setWallpaper("ocean")}
                  className="px-2 py-2 text-sm text-left rounded hover:bg-gray-100 dark:hover:bg-slate-700 flex gap-2 items-center"
                >
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div> Ocean
                </button>
                <button
                  onClick={() => setWallpaper("sunset")}
                  className="px-2 py-2 text-sm text-left rounded hover:bg-gray-100 dark:hover:bg-slate-700 flex gap-2 items-center"
                >
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>{" "}
                  Sunset
                </button>
                <button
                  onClick={() => setWallpaper("fall")}
                  className="px-2 py-2 text-sm text-left rounded hover:bg-gray-100 dark:hover:bg-slate-700 flex gap-2 items-center"
                >
                  <div className="w-4 h-4 rounded-full bg-red-700"></div> Fall
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "bg-slate-700" : "bg-white/80 shadow-sm"
            }`}
            title="Settings"
          >
            <Settings className="w-5 h-5 text-slate-500" />
          </button>

          <button
            onClick={() => setShowHistory(true)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "bg-slate-700" : "bg-white/80 shadow-sm"
            }`}
            title="View History"
          >
            <ScrollText className="w-5 h-5 text-indigo-500" />
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "bg-slate-700" : "bg-white/80 shadow-sm"
            }`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          <div
            className={`flex p-1 rounded-lg ${
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

          <div className="relative">
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
              <RefreshCw className="w-4 h-4" /> Reset{" "}
              <ChevronDown className="w-3 h-3" />
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

      {/* --- Main Content --- */}
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
                          className="w-12 bg-transparent outline-none border-b border-indigo-500"
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
                      onClick={() => openEditModal(day, item)}
                      className={`group flex gap-2 p-3 rounded-xl border shadow-sm cursor-pointer active:scale-95 transition-all ${getTaskStyles(
                        item.color,
                        isDarkMode
                      )} ${item.completed ? "opacity-60" : ""}`}
                    >
                      <GripVertical
                        className={`w-4 h-4 mt-1 ${
                          isDarkMode ? "text-slate-500" : "text-gray-400"
                        }`}
                      />
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

      {/* --- Settings Modal --- */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col ${
              isDarkMode ? "bg-slate-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div
              className={`p-4 border-b flex justify-between items-center ${
                isDarkMode ? "border-slate-700" : "border-gray-100"
              }`}
            >
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Settings className="w-5 h-5" /> Settings
              </h3>
              <button onClick={() => setShowSettings(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="mb-6">
                <h4 className="font-bold mb-1">Auto-Create Tabs</h4>
                <p className="text-xs opacity-60 mb-4">
                  Tabs to automatically create when you start a new week.
                </p>

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
                              ? "bg-slate-800 border-slate-600"
                              : "bg-white border-gray-300"
                          }`}
                          placeholder="Tab Name (e.g. Work)"
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
                  + Add Another Tab Rule
                </button>
              </div>
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
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- History Modal --- */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] ${
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
              <h3 className="font-bold text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" /> Past Success
              </h3>
              <button onClick={() => setShowHistory(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-grow space-y-3">
              {history.length === 0 ? (
                <div className="text-center py-10 text-gray-400 italic">
                  No history yet.
                </div>
              ) : (
                history.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-3 rounded-xl border ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() =>
                        setExpandedHistoryId(
                          expandedHistoryId === entry.id ? null : entry.id
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            entry.type === "week"
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {entry.type === "week" ? (
                            <RotateCcw className="w-4 h-4" />
                          ) : (
                            <CalendarDays className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{entry.name}</div>
                          <div className="text-[10px] opacity-60">
                            {entry.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-xs font-bold">
                            {entry.score}%
                          </div>
                          <div
                            className={`w-16 h-1.5 rounded-full bg-gray-200 mt-1`}
                          >
                            <div
                              className={`h-full rounded-full ${
                                entry.score === 100
                                  ? "bg-green-500"
                                  : "bg-indigo-500"
                              }`}
                              style={{ width: `${entry.score}%` }}
                            ></div>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            expandedHistoryId === entry.id ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </div>
                    {expandedHistoryId === entry.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200/20 text-xs opacity-80 pl-2 border-l-2 border-indigo-200 ml-2">
                        <div className="grid grid-cols-2 gap-2">
                          {Object.keys(entry.data).map((day) => {
                            const items = entry.data[day].plans[0].items || [];
                            if (items.length === 0) return null;
                            const done = items.filter(
                              (i) => i.completed
                            ).length;
                            return (
                              <div key={day}>
                                <span className="font-bold">{day}:</span> {done}
                                /{items.length} done
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
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
                  placeholder="Type task..."
                  rows={3}
                  className={`w-full text-lg px-4 py-3 rounded-xl border focus:ring-4 outline-none resize-none ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-700 focus:ring-indigo-900/50"
                      : "bg-white focus:ring-indigo-50"
                  }`}
                />
                {activeModal.mode === "add" && (
                  <p className="text-xs mt-1 text-gray-400">
                    💡 Tip: Type multiple lines to add multiple tasks.
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
                    className="bg-transparent outline-none w-full text-sm text-gray-500"
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
                    className="bg-transparent outline-none text-sm text-gray-500 cursor-pointer"
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
                      <Save className="w-4 h-4" /> Save
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
