import React, { useState } from 'react';
import { 
  BookOpen, Clock, Compass, Target, Wallet, 
  Music, Palette, Sparkles, ChevronRight, Search, 
  Lightbulb, Brain
} from 'lucide-react';

interface ToolsViewProps {
  onOpenTool: (toolId: string) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ onOpenTool }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'study' | 'creative' | 'life'>('all');

  const tools = [
    {
      id: 'homework',
      name: 'Homework & AI Concept Coach',
      description: 'Track assignments, subject priorities, and get Socratic concept hints without cheating.',
      icon: BookOpen,
      category: 'study',
      color: 'from-blue-500 to-indigo-600',
      badge: 'Core School'
    },
    {
      id: 'focus',
      name: 'Focus Mode & Pomodoro',
      description: 'Distraction-free 25/5m timer with synthesized rain and lo-fi ambient focus sounds.',
      icon: Clock,
      category: 'study',
      color: 'from-amber-500 to-orange-500',
      badge: 'Deep Work'
    },
    {
      id: 'study',
      name: 'Study Flashcards',
      description: 'Active recall runner with flip animations for Biology, Spanish, and History.',
      icon: Brain,
      category: 'study',
      color: 'from-purple-600 to-indigo-700',
      badge: 'Active Recall'
    },
    {
      id: 'notes',
      name: 'Notes & Idea Pad',
      description: 'Organize class notes, formulas, and brainstorms with folders, pins, and tags.',
      icon: Compass,
      category: 'study',
      color: 'from-emerald-500 to-teal-600',
      badge: 'Capture'
    },
    {
      id: 'goals',
      name: 'Personal Goals',
      description: 'Set milestones, track consistency, and celebrate progress with zero toxic comparison.',
      icon: Target,
      category: 'life',
      color: 'from-violet-500 to-purple-600',
      badge: 'Growth'
    },
    {
      id: 'money',
      name: 'Money & Allowance',
      description: 'Educational teen budget, savings goals for gadgets, and income/expense ledger.',
      icon: Wallet,
      category: 'life',
      color: 'from-green-500 to-emerald-600',
      badge: 'Finance'
    },
    {
      id: 'music',
      name: 'Music Studio',
      description: 'Lyrics pad, chord progression scratchpad with real audio playback, and instrument timer.',
      icon: Music,
      category: 'creative',
      color: 'from-pink-500 to-rose-600',
      badge: 'Creative'
    },
    {
      id: 'creative',
      name: 'Creative Workspace',
      description: 'Organize video edits, photography albums, writing, and take daily 5-min challenges.',
      icon: Palette,
      category: 'creative',
      color: 'from-cyan-500 to-blue-600',
      badge: 'Projects'
    },
    {
      id: 'skills',
      name: 'Life Skills 101',
      description: 'Bite-sized practical survival guides: 2-minute stress rule, mug breakfast, backpack reset.',
      icon: Lightbulb,
      category: 'life',
      color: 'from-teal-500 to-emerald-600',
      badge: 'Guides'
    }
  ];

  const filtered = tools.filter(tool => {
    const matchesCategory = filter === 'all' || tool.category === filter;
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || 
                          tool.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      <div className="pt-1">
        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Tools & Workspace
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Everything you need for school, creativity, and life skills.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search tools, timers, formulas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
          {[
            { id: 'all', label: 'All Tools' },
            { id: 'study', label: '📚 Study & School' },
            { id: 'creative', label: '🎨 Creative & Music' },
            { id: 'life', label: '🌱 Life Skills & Money' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                filter === cat.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tools List */}
      <div className="space-y-2.5">
        {filtered.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => onOpenTool(tool.id)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs hover:border-brand-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shrink-0 shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {tool.name}
                    </h3>
                    <span className="text-[9px] font-bold uppercase text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-full shrink-0">
                      {tool.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {tool.description}
                  </p>
                </div>
              </div>

              <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
