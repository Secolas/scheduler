import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Calendar, GripVertical, Edit2, Check, Trash2, LayoutGrid, Columns, RotateCcw, Eraser, CalendarDays, PlusCircle } from 'lucide-react';

export default function WeeklyScheduler() {
  // --- State Management ---
  
  const [viewMode, setViewMode] = useState('landscape'); // 'grid' | 'landscape'

  // Initial Data Configuration
  const initialSchedule = {
    Sunday: {
      activePlanIndex: 0,
      plans: [{ id: 'p1', name: "Main", items: [
        { id: 1, text: "Church", completed: false },
        { id: 2, text: "Small Group", completed: false },
        { id: 3, text: "Grocery", completed: false },
        { id: 4, text: "Meal prep", completed: false },
        { id: 5, text: "Couple time", completed: false }
      ]}]
    },
    Monday: {
      activePlanIndex: 0,
      plans: [{ id: 'p1', name: "Main", items: [
        { id: 6, text: "Work 4", completed: false },
        { id: 7, text: "Make Food w/ Juliet 5-6", completed: false },
        { id: 8, text: "ASL Class (Leave 6:10)", completed: false },
        { id: 9, text: "Games", completed: false }
      ]}]
    },
    Tuesday: {
      activePlanIndex: 0,
      plans: [{ id: 'p1', name: "Main", items: [
        { id: 10, text: "Work *", completed: false },
        { id: 11, text: "Gym 5-6", completed: false },
        { id: 12, text: "Shower 6-6:10", completed: false },
        { id: 13, text: "Dinner 6:10-6:50", completed: false },
        { id: 14, text: "YA Small group 7:30", completed: false }
      ]}]
    },
    Wednesday: {
      activePlanIndex: 0,
      plans: [{ id: 'p1', name: "Main", items: [
        { id: 15, text: "Work 4", completed: false },
        { id: 16, text: "Gym 5-6", completed: false },
        { id: 17, text: "Volley 6-7", completed: false },
        { id: 18, text: "Dinner 7-8", completed: false },
        { id: 19, text: "Meal prep 8-9", completed: false },
        { id: 20, text: "TV sleep", completed: false }
      ]}]
    },
    Thursday: {
      activePlanIndex: 0,
      plans: [{ id: 'p1', name: "Main", items: [
        { id: 21, text: "Work 4", completed: false },
        { id: 22, text: "Chores 5-7", completed: false },
        { id: 23, text: "Juliet brings food 7", completed: false },
        { id: 24, text: "Movie", completed: false }
      ]}]
    },
    Friday: {
      activePlanIndex: 0,
      plans: [
        { id: 'p1', name: "Plan A", items: [
          { id: 25, text: "Work 2", completed: false },
          { id: 26, text: "Beach/Gym", completed: false },
          { id: 27, text: "Bible Study", completed: false },
          { id: 28, text: "Game", completed: false }
        ]},
        { id: 'p2', name: "Plan B", items: [
          { id: 29, text: "Work 4", completed: false },
          { id: 30, text: "Date", completed: false },
          { id: 31, text: "Bible", completed: false },
          { id: 32, text: "Game w/ J", completed: false }
        ]}
      ]
    },
    Saturday: {
      activePlanIndex: 0,
      plans: [{ id: 'p1', name: "Main", items: [
        { id: 33, text: "Relax", completed: false },
        { id: 34, text: "Bible study", completed: false },
        { id: 35, text: "Career study", completed: false },
        { id: 36, text: "SOCCER 1pm", completed: false },
        { id: 37, text: "Chores *", completed: false },
        { id: 38, text: "Juliet house/Dinner", completed: false }
      ]}]
    },
    Monthly: {
      activePlanIndex: 0,
      plans: [{ id: 'p1', name: "Main", items: [
        { id: 39, text: "Haircut", completed: false },
        { id: 40, text: "Car wash", completed: false },
        { id: 41, text: "Dog wash", completed: false },
        { id: 42, text: "Laundry", completed: false }
      ]}]
    }
  };

  // --- LOAD & SAVE LOGIC ---

  const [schedule, setSchedule] = useState(() => {
    const savedSchedule = localStorage.getItem('mySchedule');
    return savedSchedule ? JSON.parse(savedSchedule) : initialSchedule;
  });

  // Modal State
  const [activeModal, setActiveModal] = useState({ isOpen: false, day: null });
  const [modalInput, setModalInput] = useState("");
  const modalInputRef = useRef(null);

  // Editing States
  const [editingItem, setEditingItem] = useState(null); 
  const [editValue, setEditValue] = useState("");
  const [editingPlan, setEditingPlan] = useState(null); 
  const [editPlanValue, setEditPlanValue] = useState("");

  const dragItem = useRef(null);
  const dragNode = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const dayRefs = useRef({});

  useEffect(() => {
    localStorage.setItem('mySchedule', JSON.stringify(schedule));
  }, [schedule]);

  // Focus modal input when opened
  useEffect(() => {
    if (activeModal.isOpen && modalInputRef.current) {
      setTimeout(() => modalInputRef.current.focus(), 50);
    }
  }, [activeModal.isOpen]);

  // Auto-Focus Today
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    setTimeout(() => {
      if (dayRefs.current[today]) {
        dayRefs.current[today].scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start', 
          inline: 'start' 
        });
      }
    }, 300);
  }, [viewMode]);

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monthly'];

  // --- Helper Functions ---
  const getCardStyle = (day) => {
    const styles = {
      Sunday: "bg-rose-50 border-rose-200 text-rose-900",
      Monday: "bg-orange-50 border-orange-200 text-orange-900",
      Tuesday: "bg-amber-50 border-amber-200 text-amber-900",
      Wednesday: "bg-emerald-50 border-emerald-200 text-emerald-900",
      Thursday: "bg-teal-50 border-teal-200 text-teal-900",
      Friday: "bg-cyan-50 border-cyan-200 text-cyan-900",
      Saturday: "bg-indigo-50 border-indigo-200 text-indigo-900",
      Monthly: "bg-slate-100 border-slate-200 text-slate-800",
    };
    return styles[day] || "bg-white border-gray-200 text-gray-900";
  };

  // --- Reset Logic ---
  const handleStartNewWeek = () => {
    if (!window.confirm("Start a new WEEK? This checks off daily tasks but KEEPS monthly tasks.")) return;
    setSchedule(prev => {
      const newSchedule = { ...prev };
      Object.keys(newSchedule).forEach(dayKey => {
        if (dayKey === 'Monthly') return;
        const day = newSchedule[dayKey];
        newSchedule[dayKey] = {
          ...day,
          plans: day.plans.map(plan => ({
            ...plan,
            items: plan.items.map(item => ({ ...item, completed: false }))
          }))
        };
      });
      return newSchedule;
    });
  };

  const handleStartNewMonth = () => {
    if (!window.confirm("Start a new MONTH? This checks off the Monthly tasks.")) return;
    setSchedule(prev => {
      const newSchedule = { ...prev };
      const monthlyData = newSchedule['Monthly'];
      newSchedule['Monthly'] = {
        ...monthlyData,
        plans: monthlyData.plans.map(plan => ({
          ...plan,
          items: plan.items.map(item => ({ ...item, completed: false }))
        }))
      };
      return newSchedule;
    });
  };

  const handleClearAll = () => {
    if (!window.confirm("⚠️ Are you sure you want to delete ALL tasks? This cannot be undone.")) return;
    setSchedule(prev => {
      const newSchedule = {};
      Object.keys(prev).forEach(dayKey => {
        const day = prev[dayKey];
        newSchedule[dayKey] = { ...day, plans: day.plans.map(plan => ({ ...plan, items: [] })) };
      });
      return newSchedule;
    });
  };

  // --- Task Completion ---
  const toggleCompletion = (day, planIndex, itemId) => {
    setSchedule(prev => {
      const dayData = prev[day];
      const plan = dayData.plans[planIndex];
      const updatedItems = plan.items.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      const updatedPlans = [...dayData.plans];
      updatedPlans[planIndex] = { ...plan, items: updatedItems };
      return { ...prev, [day]: { ...dayData, plans: updatedPlans } };
    });
  };

  // --- Plan Management ---
  const handleAddPlan = (day) => {
    setSchedule(prev => {
      const dayData = prev[day];
      const newPlanIndex = dayData.plans.length;
      const nextChar = String.fromCharCode(65 + newPlanIndex);
      return {
        ...prev,
        [day]: {
          ...dayData,
          activePlanIndex: newPlanIndex,
          plans: [...dayData.plans, { id: `p${Date.now()}`, name: `Plan ${nextChar}`, items: [] }]
        }
      };
    });
  };

  const handleRemovePlan = (day, planIndex, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this plan and all its tasks?")) return;
    setSchedule(prev => {
      const dayData = prev[day];
      const newPlans = dayData.plans.filter((_, idx) => idx !== planIndex);
      let newActiveIndex = dayData.activePlanIndex;
      if (planIndex === dayData.activePlanIndex) newActiveIndex = Math.max(0, planIndex - 1);
      else if (planIndex < dayData.activePlanIndex) newActiveIndex = dayData.activePlanIndex - 1;
      return { ...prev, [day]: { ...dayData, activePlanIndex: newActiveIndex, plans: newPlans } };
    });
  };

  const setActivePlan = (day, index) => {
    setSchedule(prev => ({ ...prev, [day]: { ...prev[day], activePlanIndex: index } }));
  };

  // --- Modal & Item Logic ---
  const openAddModal = (day) => {
    setActiveModal({ isOpen: true, day });
    setModalInput("");
  };

  const closeAddModal = () => {
    setActiveModal({ isOpen: false, day: null });
    setModalInput("");
  };

  const confirmAddFromModal = () => {
    if (!modalInput.trim() || !activeModal.day) return;
    
    const day = activeModal.day;
    setSchedule(prev => {
      const dayData = prev[day];
      const activePlan = dayData.plans[dayData.activePlanIndex];
      const updatedPlans = [...dayData.plans];
      updatedPlans[dayData.activePlanIndex] = {
        ...activePlan,
        items: [...activePlan.items, { id: Date.now(), text: modalInput, completed: false }]
      };
      return { ...prev, [day]: { ...dayData, plans: updatedPlans } };
    });
    
    closeAddModal();
  };

  const handleRemoveItem = (day, itemId) => {
    setSchedule(prev => {
      const dayData = prev[day];
      const activePlan = dayData.plans[dayData.activePlanIndex];
      const updatedPlans = [...dayData.plans];
      updatedPlans[dayData.activePlanIndex] = {
        ...activePlan,
        items: activePlan.items.filter(item => item.id !== itemId)
      };
      return { ...prev, [day]: { ...dayData, plans: updatedPlans } };
    });
  };

  // --- Editing ---
  const startEditing = (day, planIndex, item) => {
    setEditingItem({ day, planIndex, itemId: item.id });
    setEditValue(item.text);
  };

  const saveEdit = () => {
    if (!editingItem || !editValue.trim()) { setEditingItem(null); return; }
    setSchedule(prev => {
      const { day, planIndex, itemId } = editingItem;
      const dayData = prev[day];
      const plan = dayData.plans[planIndex];
      const updatedPlans = [...dayData.plans];
      updatedPlans[planIndex] = {
        ...plan,
        items: plan.items.map(item => item.id === itemId ? { ...item, text: editValue } : item)
      };
      return { ...prev, [day]: { ...dayData, plans: updatedPlans } };
    });
    setEditingItem(null);
  };

  const startEditingPlan = (day, planIndex, currentName) => {
    setEditingPlan({ day, planIndex });
    setEditPlanValue(currentName);
  };

  const savePlanEdit = () => {
    if (!editingPlan || !editPlanValue.trim()) { setEditingPlan(null); return; }
    setSchedule(prev => {
      const { day, planIndex } = editingPlan;
      const dayData = prev[day];
      const updatedPlans = [...dayData.plans];
      updatedPlans[planIndex] = { ...updatedPlans[planIndex], name: editPlanValue };
      return { ...prev, [day]: { ...dayData, plans: updatedPlans } };
    });
    setEditingPlan(null);
  };

  // --- Drag and Drop ---
  const handleDragStart = (e, item, day, planIndex, itemIndex) => {
    dragItem.current = { item, day, planIndex, itemIndex };
    dragNode.current = e.target;
    setTimeout(() => setIsDragging(true), 0);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, targetDay, targetPlanIndex, targetItemIndex) => {
    if (!dragItem.current) return;
    const source = dragItem.current;
    if (source.day === targetDay && source.planIndex === targetPlanIndex && source.itemIndex === targetItemIndex) return;

    setSchedule(prev => {
      const newSchedule = { ...prev };
      const getPlanItems = (d, pIdx) => newSchedule[d].plans[pIdx].items;
      const sourceItems = [...getPlanItems(source.day, source.planIndex)];
      const [removed] = sourceItems.splice(source.itemIndex, 1);
      newSchedule[source.day].plans[source.planIndex].items = sourceItems;

      const targetItems = source.day === targetDay && source.planIndex === targetPlanIndex 
        ? sourceItems : [...getPlanItems(targetDay, targetPlanIndex)];

      targetItems.splice(targetItemIndex, 0, removed);
      newSchedule[targetDay].plans[targetPlanIndex].items = targetItems;

      dragItem.current = { ...dragItem.current, day: targetDay, planIndex: targetPlanIndex, itemIndex: targetItemIndex };
      return newSchedule;
    });
  };

  const handleDropOnEmpty = (e, targetDay) => {
    e.preventDefault();
    if (!dragItem.current) return;
    const targetPlanIndex = schedule[targetDay].activePlanIndex;
    if (schedule[targetDay].plans[targetPlanIndex].items.length > 0) return;
    const source = dragItem.current;
    setSchedule(prev => {
      const newSchedule = { ...prev };
      const sourceItems = [...newSchedule[source.day].plans[source.planIndex].items];
      const [removed] = sourceItems.splice(source.itemIndex, 1);
      newSchedule[source.day].plans[source.planIndex].items = sourceItems;
      newSchedule[targetDay].plans[targetPlanIndex].items = [removed];
      return newSchedule;
    });
    dragItem.current = { ...dragItem.current, day: targetDay, planIndex: targetPlanIndex, itemIndex: 0 };
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    dragItem.current = null;
    dragNode.current = null;
  };

  const containerClasses = viewMode === 'landscape'
    ? "flex flex-row gap-2 overflow-x-auto pb-4 snap-x"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

  const cardClasses = (day) => viewMode === 'landscape'
    ? `min-w-[200px] w-[200px] md:min-w-[240px] md:w-full flex-shrink-0 snap-start rounded-xl shadow-sm border flex flex-col transition-all duration-300 ${getCardStyle(day)}`
    : `rounded-2xl shadow-sm border-2 flex flex-col transition-all duration-300 ${getCardStyle(day)}`;

  const textClasses = viewMode === 'landscape' ? "text-xs" : "text-sm";
  const headerClasses = viewMode === 'landscape' ? "p-2 text-sm" : "p-4 text-lg";
  
  return (
    <div className="min-h-screen bg-stone-50 font-sans p-4" onClick={() => {
      if (editingItem) saveEdit();
      if (editingPlan) savePlanEdit();
    }}>
      {/* Top Control Bar */}
      <div className="max-w-[1600px] mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          <div className="flex items-center">
            <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">My Schedule</h1>
              <p className="text-xs text-gray-500">Drag to reorder • Click text to edit</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:ml-auto">
             <button onClick={handleStartNewWeek} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors" title="Uncheck weekly tasks">
              <RotateCcw className="w-4 h-4" />
              <span>New Week</span>
            </button>
             <button onClick={handleStartNewMonth} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200" title="Uncheck monthly tasks">
              <CalendarDays className="w-4 h-4" />
              <span>New Month</span>
            </button>
            <div className="flex bg-gray-200 p-1 rounded-lg">
              <button onClick={() => setViewMode('landscape')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'landscape' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                <Columns className="w-4 h-4" />
                <span className="hidden sm:inline">Landscape</span>
              </button>
              <button onClick={() => setViewMode('grid')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
             <button onClick={handleClearAll} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete everything">
              <Eraser className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`max-w-[1600px] mx-auto ${containerClasses}`}>
        {daysOrder.map((day) => {
          const dayData = schedule[day];
          const activePlan = dayData.plans[dayData.activePlanIndex];
          const items = activePlan.items;
          const isToday = day === new Date().toLocaleDateString('en-US', { weekday: 'long' });

          return (
            <div 
              key={day}
              ref={el => dayRefs.current[day] = el}
              className={`${cardClasses(day)} ${isDragging ? 'opacity-90' : ''} ${isToday ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnEmpty(e, day)}
              onClick={(e) => e.stopPropagation()} 
            >
              <div className={`${headerClasses} border-b border-black/5 flex flex-col`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold uppercase tracking-wider opacity-90 truncate flex items-center gap-2">
                    {day}
                    {isToday && <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full tracking-normal normal-case">Today</span>}
                  </h2>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/50 border border-black/5">
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {dayData.plans.map((plan, idx) => {
                    const isActive = idx === dayData.activePlanIndex;
                    const isEditingThisPlan = editingPlan?.day === day && editingPlan?.planIndex === idx;
                    return (
                      <div key={plan.id} className={`group relative flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-all border ${isActive ? 'bg-white shadow-sm border-black/10 text-gray-800 z-10' : 'bg-black/5 border-transparent text-gray-500 hover:bg-white/40'}`} onClick={() => setActivePlan(day, idx)} onDoubleClick={() => startEditingPlan(day, idx, plan.name)}>
                        {isEditingThisPlan ? (
                          <input autoFocus type="text" className="w-12 bg-transparent outline-none border-b border-indigo-500 text-base sm:text-sm" value={editPlanValue} onChange={(e) => setEditPlanValue(e.target.value)} onBlur={savePlanEdit} onKeyDown={(e) => e.key === 'Enter' && savePlanEdit()} />
                        ) : (
                          <span className="max-w-[60px] truncate">{plan.name}</span>
                        )}
                        {dayData.plans.length > 1 && (
                          <button onClick={(e) => handleRemovePlan(day, idx, e)} className={`ml-1 hover:text-red-500 ${isActive ? 'block' : 'hidden group-hover:block'}`}>
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <button onClick={() => handleAddPlan(day)} className="flex items-center justify-center w-4 h-4 rounded hover:bg-white/60 text-gray-500 transition-colors" title="Add Plan">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className={`flex-grow overflow-y-auto ${viewMode === 'landscape' ? 'p-2 max-h-[60vh]' : 'p-4 min-h-[150px]'}`}>
                <ul className="space-y-1.5">
                  {items.map((item, index) => {
                    const isEditingThis = editingItem?.itemId === item.id;
                    return (
                      <li key={item.id} draggable={!isEditingThis} onDragStart={(e) => handleDragStart(e, item, day, dayData.activePlanIndex, index)} onDragEnter={(e) => handleDragEnter(e, day, dayData.activePlanIndex, index)} onDragEnd={handleDragEnd} className={`group flex items-start gap-1.5 bg-white/80 rounded-md transition-all duration-200 shadow-sm ${viewMode === 'landscape' ? 'p-1.5' : 'p-3'} ${dragItem.current?.item.id === item.id ? 'opacity-50 bg-indigo-100 scale-95' : 'hover:bg-white hover:scale-[1.02]'} ${isEditingThis ? 'ring-2 ring-indigo-200' : ''}`}>
                        <GripVertical className={`text-gray-400 flex-shrink-0 cursor-grab active:cursor-grabbing ${viewMode === 'landscape' ? 'w-3 h-3 mt-0.5' : 'w-4 h-4 mt-1'}`} />
                        <button onClick={(e) => { e.stopPropagation(); toggleCompletion(day, dayData.activePlanIndex, item.id); }} className={`flex-shrink-0 flex items-center justify-center rounded transition-colors duration-200 border ${viewMode === 'landscape' ? 'w-4 h-4' : 'w-5 h-5'} ${item.completed ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 hover:border-indigo-400 text-transparent'}`}>
                          <Check className={`w-3 h-3 ${item.completed ? 'opacity-100' : 'opacity-0'}`} />
                        </button>
                        <div className="flex-grow min-w-0">
                          {isEditingThis ? (
                            <div className="flex items-center gap-1">
                              <input ref={input => input && input.focus()} type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEdit()} className={`w-full bg-transparent border-b border-indigo-300 focus:border-indigo-500 outline-none px-1 text-base sm:text-sm`} />
                              <button onClick={saveEdit} className="text-green-600 hover:bg-green-50 rounded p-0.5"><Check className="w-3 h-3" /></button>
                            </div>
                          ) : (
                            <span className={`${textClasses} font-medium leading-snug break-words block cursor-text transition-all duration-200 ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`} onDoubleClick={() => startEditing(day, dayData.activePlanIndex, item)}>
                              {item.text}
                            </span>
                          )}
                        </div>
                        {!isEditingThis && (
                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-1">
                             <button onClick={() => startEditing(day, dayData.activePlanIndex, item)} className="text-gray-400 hover:text-indigo-600"><Edit2 className="w-3 h-3" /></button>
                            <button onClick={() => handleRemoveItem(day, item.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Friendly Add Button Footer */}
              <div className={`border-t border-black/5 bg-white/30 rounded-b-xl ${viewMode === 'landscape' ? 'p-2' : 'p-3 mt-auto'}`}>
                <button 
                  onClick={() => openAddModal(day)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-white/50 hover:bg-white text-indigo-600 font-medium rounded-lg transition-all duration-200 shadow-sm border border-transparent hover:border-indigo-100 hover:shadow-md text-sm group"
                >
                  <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- ADD TASK MODAL --- */}
      {activeModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-800">Add to {activeModal.day}</h3>
              <button onClick={closeAddModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <input
                ref={modalInputRef}
                type="text"
                value={modalInput}
                onChange={(e) => setModalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmAddFromModal()}
                placeholder="What do you need to do?"
                className="w-full text-lg px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300 mb-6"
              />
              
              <div className="flex gap-3">
                <button 
                  onClick={closeAddModal}
                  className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmAddFromModal}
                  disabled={!modalInput.trim()}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:shadow-none active:scale-95"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}