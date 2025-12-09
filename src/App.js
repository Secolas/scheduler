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
  MoreVertical,
  FileJson,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

export default function WeeklyScheduler() {
  // --- State Management ---
  const [viewMode, setViewMode] = useState("landscape"); // 'grid' | 'landscape' | 'slide'
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

  // Load Dark Mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setIsDarkMode(true);
  }, []);

  // Persist Data
  useEffect(() => {
    localStorage.setItem("mySchedule", JSON.stringify(schedule));
  }, [schedule]);

  // Persist Theme
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // --- UI State ---
  const [activeModal, setActiveModal] = useState({
    isOpen: false,
    mode: "add",
    day: null,
    item: null,
  });

  // Dropdown Menus State
  const [openMenu, setOpenMenu] = useState(null); // 'reset' | 'data' | null

  // Form Inputs
  const [modalInput, setModalInput] = useState("");
  const [modalTime, setModalTime] = useState("");
  const [modalColor, setModalColor] = useState("default");
  const modalInputRef = useRef(null);

  // Plan Renaming
  const [editingPlan, setEditingPlan] = useState(null);
  const [editPlanValue, setEditPlanValue] = useState("");

  // Drag & Drop
  const dragItem = useRef(null);
  const dragNode = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dayRefs = useRef({});

  // Render Order
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

  const colors = {
    default: {
      bg: "bg-gray-100",
      border: "border-gray-200",
      dot: "bg-gray-400",
    },
    red: { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500" },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      dot: "bg-green-500",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      dot: "bg-orange-500",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      dot: "bg-purple-500",
    },
  };

  // --- Helper Functions ---

  // Auto-Scroll to Today
  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    setTimeout(() => {
      if (dayRefs.current[today]) {
        dayRefs.current[today].scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
      }
    }, 300);
  }, [viewMode]);

  const getProgress = (items) => {
    if (!items || items.length === 0) return 0;
    const completed = items.filter((i) => i.completed).length;
    return Math.round((completed / items.length) * 100);
  };

  // --- File Backup System ---
  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(schedule));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "my_schedule_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setOpenMenu(null);
  };

  const handleImport = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      try {
        const importedSchedule = JSON.parse(e.target.result);
        if (importedSchedule && importedSchedule.Monday) {
          if (
            window.confirm(
              "This will overwrite your current schedule. Are you sure?"
            )
          ) {
            setSchedule(importedSchedule);
          }
        } else {
          alert("Invalid file format");
        }
      } catch (err) {
        alert("Error reading file");
      }
    };
    setOpenMenu(null);
  };

  // --- Logic: Reset & Clear ---
  const handleStartNewWeek = () => {
    if (!window.confirm("Start a new WEEK? This unchecks daily tasks.")) return;
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      Object.keys(newSchedule).forEach((dayKey) => {
        if (dayKey === "Monthly") return;
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
    if (!window.confirm("Start a new MONTH? This unchecks monthly tasks."))
      return;
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
    if (currentDayIndex === -1 || currentDayIndex >= daysOrder.length - 1) {
      alert("Cannot move further.");
      return;
    }

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

  // --- Modal Logic ---
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

      const itemData = {
        text: modalInput,
        time: modalTime,
        color: modalColor,
      };

      let newItems;
      if (mode === "add") {
        newItems = [
          ...activePlan.items,
          { id: Date.now(), ...itemData, completed: false },
        ];
      } else {
        newItems = activePlan.items.map((i) =>
          i.id === item.id ? { ...i, ...itemData } : i
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
    if (!activeModal.item || !activeModal.day) return;
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

  // --- Plan Management ---
  const handleAddPlan = (day) => {
    setSchedule((prev) => {
      const dayData = prev[day];
      const newPlanIndex = dayData.plans.length;
      const nextChar = String.fromCharCode(65 + newPlanIndex);
      return {
        ...prev,
        [day]: {
          ...dayData,
          activePlanIndex: newPlanIndex,
          plans: [
            ...dayData.plans,
            { id: `p${Date.now()}`, name: `Plan ${nextChar}`, items: [] },
          ],
        },
      };
    });
  };

  const handleRemovePlan = (day, planIndex, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this plan?")) return;
    setSchedule((prev) => {
      const dayData = prev[day];
      const newPlans = dayData.plans.filter((_, idx) => idx !== planIndex);
      let newActiveIndex = dayData.activePlanIndex;
      if (planIndex === dayData.activePlanIndex)
        newActiveIndex = Math.max(0, planIndex - 1);
      else if (planIndex < dayData.activePlanIndex)
        newActiveIndex = dayData.activePlanIndex - 1;
      return {
        ...prev,
        [day]: { ...dayData, activePlanIndex: newActiveIndex, plans: newPlans },
      };
    });
  };

  const setActivePlan = (day, index) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], activePlanIndex: index },
    }));
  };

  const startEditingPlan = (day, planIndex, currentName) => {
    setEditingPlan({ day, planIndex });
    setEditPlanValue(currentName);
  };

  const savePlanEdit = () => {
    if (!editingPlan || !editPlanValue.trim()) {
      setEditingPlan(null);
      return;
    }
    setSchedule((prev) => {
      const { day, planIndex } = editingPlan;
      const updatedPlans = [...prev[day].plans];
      updatedPlans[planIndex] = {
        ...updatedPlans[planIndex],
        name: editPlanValue,
      };
      return { ...prev, [day]: { ...prev[day], plans: updatedPlans } };
    });
    setEditingPlan(null);
  };

  // --- Drag and Drop ---
  const handleDragStart = (e, item, day, planIndex, itemIndex) => {
    dragItem.current = { item, day, planIndex, itemIndex };
    dragNode.current = e.target;
    setTimeout(() => setIsDragging(true), 0);
  };

  const handleDragEnter = (e, targetDay, targetPlanIndex, targetItemIndex) => {
    if (!dragItem.current) return;
    const source = dragItem.current;
    if (
      source.day === targetDay &&
      source.planIndex === targetPlanIndex &&
      source.itemIndex === targetItemIndex
    )
      return;

    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const sourceItems = [
        ...newSchedule[source.day].plans[source.planIndex].items,
      ];
      const [removed] = sourceItems.splice(source.itemIndex, 1);
      newSchedule[source.day].plans[source.planIndex].items = sourceItems;

      const targetItems =
        source.day === targetDay && source.planIndex === targetPlanIndex
          ? sourceItems
          : [...newSchedule[targetDay].plans[targetPlanIndex].items];

      targetItems.splice(targetItemIndex, 0, removed);
      newSchedule[targetDay].plans[targetPlanIndex].items = targetItems;

      dragItem.current = {
        ...dragItem.current,
        day: targetDay,
        planIndex: targetPlanIndex,
        itemIndex: targetItemIndex,
      };
      return newSchedule;
    });
  };

  const handleDropOnEmpty = (e, targetDay) => {
    e.preventDefault();
    if (!dragItem.current) return;
    const targetPlanIndex = schedule[targetDay].activePlanIndex;
    if (schedule[targetDay].plans[targetPlanIndex].items.length > 0) return;
    const source = dragItem.current;
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const sourceItems = [
        ...newSchedule[source.day].plans[source.planIndex].items,
      ];
      const [removed] = sourceItems.splice(source.itemIndex, 1);
      newSchedule[source.day].plans[source.planIndex].items = sourceItems;
      newSchedule[targetDay].plans[targetPlanIndex].items = [removed];
      return newSchedule;
    });
    dragItem.current = {
      ...dragItem.current,
      day: targetDay,
      planIndex: targetPlanIndex,
      itemIndex: 0,
    };
  };

  const handleDragEnd = () => setIsDragging(false);

  // --- Styles ---
  const containerClasses =
    viewMode === "landscape" || viewMode === "slide"
      ? `flex flex-row gap-4 overflow-x-auto pb-8 snap-x ${
          viewMode === "slide" ? "snap-mandatory" : ""
        } px-4`
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4";

  const cardClasses = (day) => `
    flex flex-col rounded-2xl shadow-sm border transition-all duration-300 relative overflow-hidden
    ${viewMode === "landscape" ? "min-w-[280px] w-[280px] snap-center" : ""}
    ${viewMode === "slide" ? "min-w-full w-full snap-center" : ""}
    ${viewMode === "grid" ? "w-full" : ""}
    ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}
  `;

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
      {/* --- Minimalist Header --- */}
      <div className="max-w-[1600px] mx-auto p-4 mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 bg-opacity-90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl shadow-sm ${
              isDarkMode
                ? "bg-indigo-900 text-indigo-300"
                : "bg-white text-indigo-600"
            }`}
          >
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Schedule</h1>
            <p
              className={`text-xs ${
                isDarkMode ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Plan your success
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Theme */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "bg-slate-700 hover:bg-slate-600"
                : "bg-white hover:bg-gray-100 shadow-sm"
            }`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* View Mode Toggle */}
          <div
            className={`flex p-1 rounded-lg ${
              isDarkMode ? "bg-slate-800" : "bg-gray-200"
            }`}
          >
            <button
              onClick={() => setViewMode("slide")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "slide"
                  ? isDarkMode
                    ? "bg-slate-600 text-white"
                    : "bg-white shadow-sm text-indigo-600"
                  : "text-gray-400"
              }`}
              title="Slide View"
            >
              <GalleryHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("landscape")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "landscape"
                  ? isDarkMode
                    ? "bg-slate-600 text-white"
                    : "bg-white shadow-sm text-indigo-600"
                  : "text-gray-400"
              }`}
              title="Landscape View"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "grid"
                  ? isDarkMode
                    ? "bg-slate-600 text-white"
                    : "bg-white shadow-sm text-indigo-600"
                  : "text-gray-400"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300 mx-1 opacity-50"></div>

          {/* Backup Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(openMenu === "data" ? null : "data");
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-white hover:bg-gray-100 shadow-sm"
              }`}
            >
              <FileJson className="w-4 h-4" />
              <span className="hidden sm:inline">Data</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
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
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <Download className="w-4 h-4" /> Download Backup
                </button>
                <label
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-opacity-50 ${
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <Upload className="w-4 h-4" /> Import Backup
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

          {/* Reset Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(openMenu === "reset" ? null : "reset");
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                isDarkMode
                  ? "bg-indigo-900/50 text-indigo-300 hover:bg-indigo-900"
                  : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
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
                  <RotateCcw className="w-4 h-4 text-indigo-500" /> Start New
                  Week
                </button>
                <button
                  onClick={handleStartNewMonth}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-opacity-50 ${
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <CalendarDays className="w-4 h-4 text-blue-500" /> Start New
                  Month
                </button>
                <div
                  className={`h-px ${
                    isDarkMode ? "bg-slate-700" : "bg-gray-100"
                  }`}
                ></div>
                <button
                  onClick={handleClearAll}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-opacity-50 ${
                    isDarkMode
                      ? "hover:bg-red-900/20 text-red-400"
                      : "hover:bg-red-50 text-red-600"
                  }`}
                >
                  <Eraser className="w-4 h-4" /> Clear All Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Main Grid --- */}
      <div className={`max-w-[1600px] mx-auto ${containerClasses}`}>
        {daysOrder.map((day) => {
          const dayData = schedule[day];
          const activePlan = dayData.plans[dayData.activePlanIndex];
          const items = activePlan.items;
          const isToday =
            day === new Date().toLocaleDateString("en-US", { weekday: "long" });
          const progress = getProgress(items);
          const isComplete = items.length > 0 && progress === 100;

          return (
            <div
              key={day}
              ref={(el) => (dayRefs.current[day] = el)}
              className={`${cardClasses(day)} ${
                isDragging ? "opacity-90" : ""
              } ${isToday ? "ring-2 ring-indigo-500" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnEmpty(e, day)}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress Bar */}
              {items.length > 0 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-slate-700">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isComplete ? "bg-yellow-400" : "bg-indigo-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Card Header */}
              <div
                className={`p-4 border-b ${
                  isDarkMode ? "border-slate-700" : "border-gray-100"
                } flex flex-col gap-3`}
              >
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold uppercase tracking-wider text-lg">
                      {day}
                    </h2>
                    {isToday && (
                      <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                    {isComplete && (
                      <PartyPopper className="w-5 h-5 text-yellow-500 animate-bounce" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      isDarkMode ? "bg-slate-700" : "bg-gray-100"
                    }`}
                  >
                    {items.length}
                  </span>
                </div>

                {/* Plan Tabs */}
                <div className="flex flex-wrap gap-1">
                  {dayData.plans.map((plan, idx) => {
                    const isActive = idx === dayData.activePlanIndex;
                    const isEditing =
                      editingPlan?.day === day &&
                      editingPlan?.planIndex === idx;
                    return (
                      <div
                        key={plan.id}
                        className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer border flex items-center gap-1
                          ${
                            isActive
                              ? isDarkMode
                                ? "bg-slate-700 border-slate-600 text-white"
                                : "bg-white border-gray-200 text-gray-800 shadow-sm"
                              : isDarkMode
                              ? "bg-transparent border-transparent text-slate-500 hover:bg-slate-800"
                              : "bg-transparent border-transparent text-gray-400 hover:bg-gray-50"
                          }
                        `}
                        onClick={() => setActivePlan(day, idx)}
                        onDoubleClick={() =>
                          startEditingPlan(day, idx, plan.name)
                        }
                      >
                        {isEditing ? (
                          <input
                            autoFocus
                            className="w-12 bg-transparent outline-none border-b border-indigo-500"
                            value={editPlanValue}
                            onChange={(e) => setEditPlanValue(e.target.value)}
                            onBlur={savePlanEdit}
                            onKeyDown={(e) =>
                              e.key === "Enter" && savePlanEdit()
                            }
                          />
                        ) : (
                          plan.name
                        )}

                        {dayData.plans.length > 1 && (
                          <X
                            onClick={(e) => handleRemovePlan(day, idx, e)}
                            className="w-3 h-3 hover:text-red-500 opacity-50 hover:opacity-100"
                          />
                        )}
                      </div>
                    );
                  })}
                  <button
                    onClick={() => handleAddPlan(day)}
                    className={`p-1 rounded hover:bg-opacity-80 ${
                      isDarkMode
                        ? "text-slate-400 hover:bg-slate-700"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Task List */}
              <div
                className={`flex-grow overflow-y-auto ${
                  viewMode === "landscape" || viewMode === "slide"
                    ? "p-3 max-h-[60vh]"
                    : "p-4 min-h-[150px]"
                }`}
              >
                <ul className="space-y-2">
                  {items.map((item, index) => {
                    const colorStyle = colors[item.color || "default"];
                    return (
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
                          handleDragEnter(
                            e,
                            day,
                            dayData.activePlanIndex,
                            index
                          )
                        }
                        onDragEnd={handleDragEnd}
                        onClick={() => openEditModal(day, item)}
                        className={`
                          group flex items-start gap-2 p-3 rounded-xl border shadow-sm cursor-pointer transition-all duration-200 active:scale-95
                          ${
                            isDarkMode
                              ? "bg-slate-700 border-slate-600 hover:bg-slate-650"
                              : "bg-white border-gray-100 hover:border-indigo-100 hover:shadow-md"
                          }
                          ${item.completed ? "opacity-60" : "opacity-100"}
                        `}
                      >
                        <div className="flex flex-col gap-1 mt-1">
                          <GripVertical
                            className={`w-4 h-4 ${
                              isDarkMode ? "text-slate-500" : "text-gray-300"
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
                          className={`
                            mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all
                            ${
                              item.completed
                                ? "bg-green-500 border-green-500 text-white"
                                : isDarkMode
                                ? "border-slate-500 hover:border-slate-400"
                                : "border-gray-300 hover:border-indigo-400"
                            }
                          `}
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

                          {(item.time ||
                            (item.color && item.color !== "default")) && (
                            <div className="flex items-center gap-2 mt-1.5">
                              {item.time && (
                                <span
                                  className={`text-[10px] flex items-center gap-1 px-1.5 py-0.5 rounded ${
                                    isDarkMode
                                      ? "bg-slate-600 text-slate-300"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  <Clock className="w-3 h-3" /> {item.time}
                                </span>
                              )}
                              {item.color && item.color !== "default" && (
                                <div
                                  className={`w-2 h-2 rounded-full ${colorStyle.dot}`}
                                  title={item.color}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {items.length === 0 && (
                  <div
                    className={`text-center py-8 italic text-xs ${
                      isDarkMode ? "text-slate-600" : "text-gray-300"
                    }`}
                  >
                    No tasks yet
                  </div>
                )}
              </div>

              {/* Add Button Footer */}
              <div
                className={`p-3 mt-auto border-t ${
                  isDarkMode
                    ? "border-slate-700"
                    : "border-gray-50 bg-gray-50/50"
                }`}
              >
                <button
                  onClick={() => openAddModal(day)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 font-medium rounded-xl transition-all duration-200 text-sm active:scale-95
                    ${
                      isDarkMode
                        ? "bg-slate-700 hover:bg-slate-600 text-indigo-300"
                        : "bg-white hover:bg-white text-indigo-600 shadow-sm border border-gray-200 hover:shadow-md"
                    }
                  `}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Unified Modal (Add/Edit) --- */}
      {activeModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
              isDarkMode ? "bg-slate-800" : "bg-white"
            }`}
          >
            <div
              className={`p-4 border-b flex items-center justify-between ${
                isDarkMode
                  ? "border-slate-700 bg-slate-800"
                  : "border-gray-100 bg-gray-50/80"
              }`}
            >
              <h3 className="font-bold text-lg">
                {activeModal.mode === "add"
                  ? `Add to ${activeModal.day}`
                  : "Edit Task"}
              </h3>
              <button
                onClick={closeModal}
                className={`p-1 rounded-full ${
                  isDarkMode
                    ? "hover:bg-slate-700 text-slate-400"
                    : "hover:bg-gray-200 text-gray-400"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
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
                className={`w-full text-lg px-4 py-3 rounded-xl border focus:ring-4 outline-none transition-all resize-none
                  ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-700 focus:border-indigo-500 focus:ring-indigo-900/50 text-white placeholder-slate-600"
                      : "bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-50 placeholder-gray-300 text-gray-800"
                  }
                `}
              />

              <div className="flex gap-3">
                <div
                  className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-700"
                      : "bg-white border-gray-200"
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
                    isDarkMode
                      ? "bg-slate-900 border-slate-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Tag className="w-4 h-4 text-gray-400" />
                  <select
                    value={modalColor}
                    onChange={(e) => setModalColor(e.target.value)}
                    className="bg-transparent outline-none text-sm text-gray-500 appearance-none cursor-pointer"
                  >
                    <option value="default">Default</option>
                    <option value="red">Urgent 🔴</option>
                    <option value="blue">Work 🔵</option>
                    <option value="green">Personal 🟢</option>
                    <option value="orange">Home 🟠</option>
                    <option value="purple">Fun 🟣</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                {activeModal.mode === "edit" ? (
                  <>
                    <button
                      onClick={handleModalSave}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={moveTaskToNextDay}
                        className={`flex-1 py-3 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 border ${
                          isDarkMode
                            ? "border-slate-600 hover:bg-slate-700"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <ArrowRight className="w-4 h-4" /> Tomorrow
                      </button>
                      <button
                        onClick={handleModalDelete}
                        className="flex-1 py-3 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-red-500 border border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={closeModal}
                      className={`flex-1 py-3 font-medium rounded-xl transition-colors ${
                        isDarkMode
                          ? "text-slate-400 hover:bg-slate-700"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleModalSave}
                      disabled={!modalInput.trim()}
                      className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50"
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
