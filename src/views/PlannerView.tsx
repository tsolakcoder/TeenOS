import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, Bell, Check, X, Tag } from 'lucide-react';
import { PlannerEvent, EventCategory } from '../types.ts';
import { audioManager } from '../utils/audio.ts';

interface PlannerViewProps {
  events: PlannerEvent[];
  onAddEvent: (event: PlannerEvent) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ events, onAddEvent }) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-25');
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [eventTime, setEventTime] = useState('04:00 PM');
  const [eventDate, setEventDate] = useState('2026-10-25');
  const [category, setCategory] = useState<EventCategory>('school');
  const [location, setLocation] = useState('');
  const [reminder, setReminder] = useState(true);

  // 7-day dynamic calendar strip
  const daysOfWeek = [
    { dayName: 'Mon', num: 24, fullDate: '2026-10-24' },
    { dayName: 'Tue', num: 25, fullDate: '2026-10-25' },
    { dayName: 'Wed', num: 26, fullDate: '2026-10-26' },
    { dayName: 'Thu', num: 27, fullDate: '2026-10-27' },
    { dayName: 'Fri', num: 28, fullDate: '2026-10-28' },
    { dayName: 'Sat', num: 29, fullDate: '2026-10-29' },
    { dayName: 'Sun', num: 30, fullDate: '2026-10-30' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvent: PlannerEvent = {
      id: `ev-${Date.now()}`,
      title: title.trim(),
      date: eventDate,
      time: eventTime,
      category,
      location: location.trim() || undefined,
      reminder
    };

    onAddEvent(newEvent);
    audioManager.playSuccessChime();
    setTitle('');
    setLocation('');
    setIsAddModalOpen(false);
  };

  const getCategoryColor = (cat: EventCategory) => {
    switch (cat) {
      case 'school': return 'bg-rose-500 text-rose-500';
      case 'sports': return 'bg-emerald-500 text-emerald-500';
      case 'music': return 'bg-purple-500 text-purple-500';
      case 'social': return 'bg-amber-500 text-amber-500';
      case 'study': return 'bg-blue-500 text-blue-500';
      default: return 'bg-indigo-500 text-indigo-500';
    }
  };

  const filteredEvents = events.filter(ev => {
    const matchesDate = viewMode === 'month' ? true : ev.date === selectedDate;
    const matchesCat = filterCategory === 'all' || ev.category === filterCategory;
    return matchesDate && matchesCat;
  });

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Planner & Schedule
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            October 2026 · Week 43
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px]">
          {(['day', 'week', 'month'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2.5 py-1 rounded-lg capitalize font-bold transition-all ${
                viewMode === mode
                  ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Week Day Selector Strip */}
      <div className="grid grid-cols-7 gap-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-2.5 shadow-xs">
        {daysOfWeek.map((day) => {
          const isSelected = selectedDate === day.fullDate;
          const hasEvents = events.some(e => e.date === day.fullDate);

          return (
            <button
              key={day.fullDate}
              onClick={() => setSelectedDate(day.fullDate)}
              className={`flex flex-col items-center py-2.5 px-1 rounded-2xl transition-all ${
                isSelected
                  ? 'bg-brand-600 text-white font-bold shadow-md shadow-brand-500/25 scale-[1.03]'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                {day.dayName}
              </span>
              <span className="text-sm font-extrabold mt-0.5 font-mono">
                {day.num}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 transition-colors ${
                isSelected ? 'bg-white' : hasEvents ? 'bg-brand-500' : 'bg-transparent'
              }`} />
            </button>
          );
        })}
      </div>

      {/* Actions & Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
          {['all', 'school', 'sports', 'music', 'social', 'study'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-xl font-semibold capitalize whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setEventDate(selectedDate);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0 ml-2"
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </div>

      {/* Agenda for Date */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {viewMode === 'month' ? 'All Month Events' : `Events for ${selectedDate}`}
          </span>
          <span className="text-xs text-slate-400">
            {filteredEvents.length} items
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 space-y-2">
            <Calendar size={28} className="mx-auto text-slate-400 opacity-60" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Clear Schedule for this day
            </h4>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              No tests, practices, or appointments scheduled. Tap "+ Add" above to schedule study sessions or events.
            </p>
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-2 h-10 rounded-full shrink-0 ${getCategoryColor(ev.category).split(' ')[0]}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {ev.title}
                    </h4>
                    <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                      {ev.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{ev.time}</span>
                    </span>
                    {ev.location && (
                      <span className="flex items-center gap-1 truncate font-sans">
                        <MapPin size={12} />
                        <span className="truncate">{ev.location}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {ev.reminder && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-1 rounded-lg shrink-0">
                  <Bell size={12} />
                  <span>Alert</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Schedule New Event
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. History Midterm Exam, Varsity Soccer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    placeholder="04:30 PM"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  >
                    <option value="school">School 📚</option>
                    <option value="sports">Sports ⚽</option>
                    <option value="music">Music 🎵</option>
                    <option value="social">Social 🎉</option>
                    <option value="study">Study Session 🧠</option>
                    <option value="personal">Personal 🌱</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Room 204 / Field"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                  Push Reminder Notification
                </span>
                <button
                  type="button"
                  onClick={() => setReminder(!reminder)}
                  className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                    reminder ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${reminder ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
