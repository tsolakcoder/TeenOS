import React from 'react';
import { Sun, Moon, Maximize2, Minimize2, Sparkles, Brain } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onOpenAi: () => void;
  onOpenStudy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  isExpanded,
  onToggleExpanded,
  onOpenAi,
  onOpenStudy,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
      {/* Simulated Phone Status Bar */}
      <div className="w-full pt-2.5 px-6 pb-1.5 flex justify-between items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 select-none">
        <span className="font-mono tracking-tight">9:41</span>
        
        {/* Dynamic Island Pill */}
        <div className="h-4 px-3 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center gap-1.5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
        </div>

        <div className="flex items-center gap-1.5 text-[10px]">
          <span>5G</span>
          <span className="font-mono">100%</span>
        </div>
      </div>

      {/* Primary Top Bar */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/20">
            <span className="text-xs font-black">T</span>
          </div>
          <div>
            <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
              TeenOS
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1.5 font-medium">
              v2.6
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenStudy}
            title="Open Study Mode"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/20 rounded-xl transition-all"
          >
            <Brain size={14} className="text-brand-500" />
            <span className="hidden sm:inline">Study</span>
          </button>

          <button
            onClick={onOpenAi}
            title="TeenOS AI Copilot"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 bg-slate-100 dark:bg-slate-900 rounded-xl transition-all"
          >
            <Sparkles size={16} />
          </button>

          <button
            onClick={onToggleDarkMode}
            title="Toggle Dark/Light Mode"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 rounded-xl bg-slate-100 dark:bg-slate-900 transition-all"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={onToggleExpanded}
            title={isExpanded ? "Mobile Phone Frame" : "Expand to Full Screen"}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-900 transition-all"
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};
