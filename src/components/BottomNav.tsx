import React from 'react';
import { Home, Compass, Calendar, User } from 'lucide-react';

export type MainTab = 'home' | 'tools' | 'planner' | 'profile';

interface BottomNavProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  activeTool: string | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  activeTool,
}) => {
  const tabs = [
    { id: 'home' as MainTab, label: 'Home', icon: Home },
    { id: 'tools' as MainTab, label: 'Tools', icon: Compass },
    { id: 'planner' as MainTab, label: 'Planner', icon: Calendar },
    { id: 'profile' as MainTab, label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 max-w-md mx-auto transition-all"
    >
      <div className="grid grid-cols-4 items-center h-16 px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = (activeTab === tab.id && !activeTool) || (tab.id === 'tools' && activeTool !== null);

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-all rounded-xl select-none ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400 font-bold scale-[1.04]'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <div className="relative">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-transform"
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-500 dark:bg-brand-400" />
                )}
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
