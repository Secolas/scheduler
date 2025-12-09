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
  ChevronDown as ChevronDownIcon,
} from "lucide-react";

export default function WeeklyScheduler() {
  // --- State Management ---
  const [viewMode, setViewMode] = useState("slide");
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // --- Statistics Logic ---
  const XP_PER_TASK = 50;

  const calculateWeeklyStats = () => {
    let totalTasks = 0;
    let completedTasks = 0;

    // Only count Mon-Sun
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
    // Level formula: Level 1 = 0-300xp
    const level = Math.floor(currentXP / 300) + 1;
    const nextLevelXP = level * 300;
    const prevLevelXP = (level - 1) * 300;
    const progressToNext =
      ((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;
    const totalProgress =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return {
      level,
      currentXP,
      nextLevelXP,
      progressToNext,
      completedTasks,
      totalTasks,
      totalProgress,
    };
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
    return {
      total,
      completed,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
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

  // Expanded History Item State
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
      type: type, // 'week' or 'month'
      name: name,
      date: new Date().toLocaleDateString(),
      score: score,
      data: data, // Full copy of the relevant tasks
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  // --- Reset Logic ---
  const handleStartNewWeek = () => {
    if (
      !window.confirm(
        "Start new WEEK? This will SAVE your progress to History and reset daily tasks."
      )
    )
      return;

    // 1. Gather weekly data for archive
    const weeklySnapshot = {};
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].forEach((d) => {
      weeklySnapshot[d] = schedule[d];
    });

    // 2. Save to History
    saveToHistory(
      "week",
      `Week of ${new Date().toLocaleDateString()}`,
      weeklySnapshot,
      weeklyStats.totalProgress
    );

    // 3. Reset
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      Object.keys(newSchedule).forEach((dayKey) => {
        if (dayKey === "Monthly") return; // Skip Monthly
        const day = newSchedule[dayKey];
        newSchedule[dayKey] = {
          ...day,
          plans: day.plans.map((plan) => ({
            ...plan,
            items: plan.items.map((item) => ({ ...item, completed: false })),
          })),
        };
      });
      return newSchedule;
    });
    setOpenMenu(null);
  };

  const handleStartNewMonth = () => {
    const monthName = prompt(
      "Name this month for the archive (e.g. 'January Goals'):",
      new Date().toLocaleString("default", { month: "long" })
    );
    if (!monthName) return;

    // 1. Save to History
    saveToHistory(
      "month",
      monthName,
      { Monthly: schedule.Monthly },
      monthlyStats.percent
    );

    // 2. Reset
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const monthlyData = newSchedule["Monthly"];
      newSchedule["Monthly"] = {
        ...monthlyData,
        plans: monthlyData.plans.map((plan) => ({
          ...plan,
          items: plan.items.map((item) => ({ ...item, completed: false })),
        })),
      };
      return newSchedule;
    });
    setOpenMenu(null);
  };

  const handleClearAll = () => {
    if (!window.confirm("⚠️ Delete ALL tasks? Cannot be undone.")) return;
    setSchedule((prev) => {
      const newSchedule = {};
      Object.keys(prev).forEach((dayKey) => {
        const day = prev[dayKey];
        newSchedule[dayKey] = {
          ...day,
          plans: day.plans.map((plan) => ({ ...plan, items: [] })),
        };
      });
      return newSchedule;
    });
    setOpenMenu(null);
  };

  // --- Core Actions ---
  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ schedule, history }));
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
        if (data.schedule) {
          if (window.confirm("Overwrite current schedule?")) {
            setSchedule(data.schedule);
            if (data.history) setHistory(data.history);
          }
        } else if (data.Monday) {
          // Legacy support
          if (window.confirm("Overwrite current schedule?")) setSchedule(data);
        }
      } catch (err) {
        alert("Error reading file");
      }
    };
    setOpenMenu(null);
  };

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

  // ... (Other handlers: moveTaskToNextDay, openAddModal, openEditModal, handleModalSave, handleModalDelete, handleAddPlan, handleRemovePlan, setActivePlan, startEditingPlan, savePlanEdit, drag handlers)
  // Kept concise for brevity, logic remains same as previous version but ensures they use the `schedule` state.
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
      const movedItem = { ...activeModal.item, completed: false };
      nextPlan.items = [...nextPlan.items, movedItem];
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

  // Drag
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
  const cardClasses = (day) =>
    `flex flex-col rounded-2xl shadow-sm border transition-all duration-300 relative overflow-hidden ${
      viewMode === "landscape" ? "min-w-[280px] w-[280px] snap-center" : ""
    } ${viewMode === "slide" ? "min-w-full w-full snap-center" : ""} ${
      viewMode === "grid" ? "w-full" : ""
    } ${
      isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
    }`;

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDarkMode ? "bg-slate-900 text-slate-100" : "bg-stone-50 text-gray-900"
      }`}
      onClick={() => {
        if (editingPlan) savePlanEdit();
        if (openMenu) setOpenMenu(null);
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
                className={`text-xs font-bold uppercase tracking-widest ${
                  isDarkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                Week Level {weeklyStats.level}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {weeklyStats.currentXP} XP
              </span>
            </div>
            <div
              className={`h-2.5 w-full rounded-full overflow-hidden ${
                isDarkMode ? "bg-slate-700" : "bg-gray-200"
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
          {/* History Button */}
          <button
            onClick={() => setShowHistory(true)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "bg-slate-700 hover:bg-slate-600"
                : "bg-white hover:bg-gray-100 shadow-sm"
            }`}
            title="View History"
          >
            <ScrollText className="w-5 h-5 text-indigo-500" />
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "bg-slate-700" : "bg-white shadow-sm"
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
              isDarkMode ? "bg-slate-800" : "bg-gray-200"
            }`}
          >
            <button
              onClick={() => setViewMode("slide")}
              className={`p-1.5 rounded-md ${
                viewMode === "slide"
                  ? isDarkMode
                    ? "bg-slate-600"
                    : "bg-white shadow"
                  : ""
              }`}
            >
              <GalleryHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("landscape")}
              className={`p-1.5 rounded-md ${
                viewMode === "landscape"
                  ? isDarkMode
                    ? "bg-slate-600"
                    : "bg-white shadow"
                  : ""
              }`}
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md ${
                viewMode === "grid"
                  ? isDarkMode
                    ? "bg-slate-600"
                    : "bg-white shadow"
                  : ""
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(openMenu === "data" ? null : "data");
              }}
              className={`p-2 rounded-lg ${
                isDarkMode ? "bg-slate-700" : "bg-white shadow-sm"
              }`}
            >
              <FileJson className="w-5 h-5" />
            </button>
            {openMenu === "data" && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl z-50 border overflow-hidden ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <button
                  onClick={handleExport}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-opacity-50 ${
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <Download className="w-4 h-4" /> Save Backup
                </button>
                <label
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-opacity-50 cursor-pointer ${
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <Upload className="w-4 h-4" /> Load Backup{" "}
                  <input
                    type="file"
                    className="hidden"
                    accept=".json"
                    onChange={handleImport}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(openMenu === "reset" ? null : "reset");
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold ${
                isDarkMode
                  ? "bg-indigo-900/50 text-indigo-300"
                  : "bg-indigo-50 text-indigo-600"
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
                      : "hover:bg-gray-50"
                  }`}
                >
                  <RotateCcw className="w-4 h-4 text-indigo-500" /> New Week
                </button>
                <button
                  onClick={handleStartNewMonth}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-opacity-50 ${
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-200"
                      : "hover:bg-gray-50"
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
                      : "hover:bg-red-50"
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
              } ${isToday ? "ring-2 ring-indigo-500" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnEmpty(e, day)}
            >
              {/* Daily / Monthly Progress Bar */}
              {items.length > 0 && (
                <div
                  className={`p-2 border-b ${
                    isDarkMode
                      ? "bg-slate-900/50 border-slate-700"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                      {isMonthly ? "Month Goal" : "XP Progress"}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        isMonthly ? "text-blue-500" : "text-indigo-500"
                      }`}
                    >
                      {progress}%
                    </span>
                  </div>
                  <div
                    className={`w-full h-3 rounded-full overflow-hidden relative shadow-inner ${
                      isDarkMode ? "bg-slate-700" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end ${
                        isComplete
                          ? "bg-yellow-400"
                          : isMonthly
                          ? "bg-blue-500"
                          : "bg-indigo-500"
                      }`}
                      style={{ width: `${Math.max(progress, 5)}%` }}
                    >
                      {isComplete && (
                        <Zap
                          className="w-2.5 h-2.5 text-white mr-0.5 animate-spin"
                          fill="currentColor"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`p-4 border-b ${
                  isDarkMode ? "border-slate-700" : "border-gray-100"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-bold uppercase tracking-wider text-lg flex items-center gap-2">
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
                    ? "p-3 max-h-[60vh]"
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
                            <Clock className="w-3 h-3" /> {item.time}
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
                  No history yet. Start a new week or month to save progress!
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
                    {/* Expanded Items */}
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
                  <Clock className="w-4 h-4 text-gray-400" />
                  <input
                    type="time"
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
                      <button
                        onClick={moveTaskToNextDay}
                        className={`flex-1 py-3 font-medium rounded-xl border flex justify-center gap-2 ${
                          isDarkMode ? "border-slate-600" : "border-gray-200"
                        }`}
                      >
                        <ArrowRight className="w-4 h-4" /> Tomorrow
                      </button>
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
