import React, { useState, useMemo } from 'react';
import { 
  Sparkles, CheckCircle2, Circle, ArrowRight, 
  Calendar, Target, Compass, BookOpen, Clock, 
  Flame, Plus, ChevronRight, Music, Wallet, Palette, Brain, ShieldCheck
} from 'lucide-react';
import { Task, PlannerEvent, GoalItem, UserProfile, LifeSkill } from '../types.ts';
import { audioManager } from '../utils/audio.ts';

interface HomeViewProps {
  profile: UserProfile;
  tasks: Task[];
  events: PlannerEvent[];
  goals: GoalItem[];
  lifeSkills: LifeSkill[];
  focusMinutesToday: number;
  onToggleTask: (taskId: string) => void;
  onOpenTool: (toolId: string) => void;
  onOpenAiPlanner: (initialQuery?: string) => void;
  onOpenAddTaskModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  tasks,
  events,
  goals,
  lifeSkills,
  focusMinutesToday,
  onToggleTask,
  onOpenTool,
  onOpenAiPlanner,
  onOpenAddTaskModal,
}) => {
  const [naturalText, setNaturalText] = useState('');

  // Time-sensitive greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const pendingTasks = tasks.filter(t => !t.completed);
  const primaryGoal = goals[0];
  const nextEvent = events[0];
  const featuredSkill = lifeSkills[0];

  const handleTaskClick = (id: string, currentlyCompleted: boolean) => {
    if (!currentlyCompleted) {
      audioManager.playSuccessChime();
    }
    onToggleTask(id);
  };

  const handleNaturalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (naturalText.trim()) {
      onOpenAiPlanner(naturalText.trim());
      setNaturalText('');
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      
      {/* Personalized Greeting & Streak */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            {todayFormatted}
          </span>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 mt-0.5">
            <span>{greeting}, {profile.name.split(' ')[0]}</span>
            <span className="text-xl">{profile.avatar}</span>
          </h1>
        </div>

        {/* Study Stats Indicator */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          <Flame size={16} className="text-amber-500 shrink-0" />
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Focus</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 font-mono">
              {focusMinutesToday}m
            </span>
          </div>
        </div>
      </div>

      {/* LARGE AI-POWERED BUTTON: "What do you need?" */}
      <div className="bg-gradient-to-br from-brand-500/10 via-purple-500/5 to-indigo-500/10 dark:from-brand-950/40 dark:via-purple-950/20 dark:to-indigo-950/40 rounded-3xl p-4 sm:p-5 border border-brand-500/20 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-brand-500/25">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              TeenOS Daily Copilot
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              What do you need today?
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
          Type your day naturally. For example: <span className="italic">"I have a history test on Friday and football practice at 7 PM."</span>
        </p>

        <form onSubmit={handleNaturalSubmit} className="relative flex items-center">
          <input
            type="text"
            placeholder="Tell TeenOS what to organize..."
            value={naturalText}
            onChange={(e) => setNaturalText(e.target.value)}
            className="w-full pl-3.5 pr-11 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-1.5 p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition-all shadow-sm"
          >
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex gap-1.5 mt-2.5 overflow-x-auto hide-scrollbar">
          {[
            'Plan my evening study',
            'History test review',
            'Football practice gear',
            'Barre chord session'
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onOpenAiPlanner(prompt)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200/50 dark:border-slate-700/50 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS & RECENT TOOLS */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Quick Launch
          </span>
          <button
            onClick={() => onOpenTool('homework')}
            className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline"
          >
            All 9 Tools
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'focus', name: 'Focus', icon: Clock, color: 'from-amber-500 to-orange-500' },
            { id: 'homework', name: 'Homework', icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
            { id: 'notes', name: 'Notes', icon: Compass, color: 'from-emerald-500 to-teal-600' },
            { id: 'music', name: 'Music', icon: Music, color: 'from-purple-500 to-pink-500' },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onOpenTool(tool.id)}
                className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/90 rounded-2xl shadow-xs hover:border-brand-500/40 transition-all text-center group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center mb-1.5 shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform`}>
                  <Icon size={18} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                  {tool.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TODAY'S PRIORITIES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-brand-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Today's Priorities
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded-full">
              {pendingTasks.length} left
            </span>
            <button
              onClick={onOpenAddTaskModal}
              className="p-1 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
              title="Add task"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {tasks.slice(0, 4).map((task) => (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task.id, task.completed)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                task.completed
                  ? 'bg-slate-50/50 dark:bg-slate-900/40 border-transparent opacity-50'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-brand-500/30'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <button
                  type="button"
                  aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                  className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  {task.completed ? <CheckCircle2 size={14} /> : <Circle size={14} className="opacity-0" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-semibold truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span>{task.subject}</span>
                    <span>·</span>
                    <span className="font-mono">{task.dueTime}</span>
                  </div>
                </div>
              </div>

              {task.priority === 'high' && !task.completed && (
                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md shrink-0">
                  High
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* GOAL PROGRESS & UPCOMING EVENT DUAL CARDS */}
      <div className="grid grid-cols-2 gap-3">
        {/* Goal Card */}
        {primaryGoal && (
          <div
            onClick={() => onOpenTool('goals')}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-3.5 shadow-xs cursor-pointer hover:border-brand-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Target size={15} />
                </span>
                <span className="text-xs font-black text-amber-500 font-mono">
                  {primaryGoal.progress}%
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">
                {primaryGoal.title}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Target: {primaryGoal.deadline}
              </p>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${primaryGoal.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Next Calendar Event */}
        {nextEvent && (
          <div
            onClick={() => onOpenTool('planner')}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-3.5 shadow-xs cursor-pointer hover:border-brand-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Calendar size={15} />
                </span>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                  Upcoming
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">
                {nextEvent.title}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                {nextEvent.time} · {nextEvent.location || 'School'}
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] text-brand-600 dark:text-brand-400 font-bold mt-2">
              <span>View Planner</span>
              <ChevronRight size={12} />
            </div>
          </div>
        )}
      </div>

      {/* DAILY LIFE SKILL TIP */}
      {featuredSkill && (
        <div
          onClick={() => onOpenTool('skills')}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xs cursor-pointer hover:border-brand-500/40 transition-all"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Life Skill 101 · {featuredSkill.timeToRead}
            </span>
            <span className="text-[10px] text-slate-400">{featuredSkill.category}</span>
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-white">
            {featuredSkill.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {featuredSkill.summary}
          </p>
        </div>
      )}

    </div>
  );
};
