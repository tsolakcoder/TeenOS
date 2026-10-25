import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ArrowLeft, Plus, CheckCircle2, 
  BookOpen, Clock, Compass, Target, Wallet, 
  Music, Palette, Brain, Lightbulb
} from 'lucide-react';
import { 
  Task, PlannerEvent, NoteItem, GoalItem, MoneyEntry, 
  MusicProject, CreativeProject, LifeSkill, Achievement, UserProfile 
} from './types.ts';
import { 
  INITIAL_PROFILE, INITIAL_TASKS, INITIAL_EVENTS, 
  INITIAL_NOTES, INITIAL_GOALS, INITIAL_MONEY, 
  INITIAL_MUSIC, INITIAL_CREATIVE, INITIAL_LIFE_SKILLS, 
  INITIAL_ACHIEVEMENTS 
} from './data/initialData.ts';
import { applyAccentTheme } from './utils/theme.ts';
import { audioManager } from './utils/audio.ts';

// Components
import { Header } from './components/Header.tsx';
import { BottomNav, MainTab } from './components/BottomNav.tsx';
import { AiPlannerModal } from './components/AiPlannerModal.tsx';
import { ConceptExplainerModal } from './components/ConceptExplainerModal.tsx';

// Views
import { HomeView } from './views/HomeView.tsx';
import { ToolsView } from './views/ToolsView.tsx';
import { PlannerView } from './views/PlannerView.tsx';
import { ProfileView } from './views/ProfileView.tsx';

// Sub-Tools
import { HomeworkTool } from './tools/HomeworkTool.tsx';
import { NotesTool } from './tools/NotesTool.tsx';
import { FocusTool } from './tools/FocusTool.tsx';
import { GoalsTool } from './tools/GoalsTool.tsx';
import { MoneyTool } from './tools/MoneyTool.tsx';
import { MusicTool } from './tools/MusicTool.tsx';
import { CreativeTool } from './tools/CreativeTool.tsx';
import { StudyModeTool } from './tools/StudyModeTool.tsx';
import { LifeSkillsTool } from './tools/LifeSkillsTool.tsx';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // Responsive Phone Frame vs Full Viewport
  const [isExpanded, setIsExpanded] = useState(false);

  // Persistent User Profile & Theme
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('teenos_profile_v2');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('teenos_dark_v2');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Data Collections with Persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('teenos_tasks_v2');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [events, setEvents] = useState<PlannerEvent[]>(() => {
    const saved = localStorage.getItem('teenos_events_v2');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('teenos_notes_v2');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [goals, setGoals] = useState<GoalItem[]>(() => {
    const saved = localStorage.getItem('teenos_goals_v2');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [moneyEntries, setMoneyEntries] = useState<MoneyEntry[]>(() => {
    const saved = localStorage.getItem('teenos_money_v2');
    return saved ? JSON.parse(saved) : INITIAL_MONEY;
  });

  const [musicProject, setMusicProject] = useState<MusicProject>(() => {
    const saved = localStorage.getItem('teenos_music_v2');
    return saved ? JSON.parse(saved) : INITIAL_MUSIC;
  });

  const [creativeProjects, setCreativeProjects] = useState<CreativeProject[]>(() => {
    const saved = localStorage.getItem('teenos_creative_v2');
    return saved ? JSON.parse(saved) : INITIAL_CREATIVE;
  });

  const [lifeSkills, setLifeSkills] = useState<LifeSkill[]>(() => {
    const saved = localStorage.getItem('teenos_skills_v2');
    return saved ? JSON.parse(saved) : INITIAL_LIFE_SKILLS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('teenos_achievements_v2');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [focusMinutesToday, setFocusMinutesToday] = useState(45);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState('');
  const [explainingTask, setExplainingTask] = useState<Task | null>(null);

  // Sync Theme & Accents
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('teenos_dark_v2', JSON.stringify(darkMode));
    applyAccentTheme(profile.accentColor);
  }, [darkMode, profile.accentColor]);

  // Sync Local Storage
  useEffect(() => { localStorage.setItem('teenos_profile_v2', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('teenos_tasks_v2', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('teenos_events_v2', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('teenos_notes_v2', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem('teenos_goals_v2', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('teenos_money_v2', JSON.stringify(moneyEntries)); }, [moneyEntries]);
  useEffect(() => { localStorage.setItem('teenos_music_v2', JSON.stringify(musicProject)); }, [musicProject]);
  useEffect(() => { localStorage.setItem('teenos_creative_v2', JSON.stringify(creativeProjects)); }, [creativeProjects]);
  useEffect(() => { localStorage.setItem('teenos_skills_v2', JSON.stringify(lifeSkills)); }, [lifeSkills]);
  useEffect(() => { localStorage.setItem('teenos_achievements_v2', JSON.stringify(achievements)); }, [achievements]);

  // Actions
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddEvent = (newEvent: PlannerEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const handleApplyAiPlan = (newTasks: Task[], newEvents: PlannerEvent[]) => {
    if (newTasks.length > 0) {
      setTasks(prev => [...newTasks, ...prev]);
    }
    if (newEvents.length > 0) {
      setEvents(prev => [...prev, ...newEvents]);
    }
  };

  const handleOpenAiPlanner = (query?: string) => {
    setAiInitialQuery(query || '');
    setIsAiModalOpen(true);
  };

  const handleSelectTab = (tab: MainTab) => {
    setActiveTab(tab);
    setActiveTool(null);
  };

  const handleOpenTool = (toolId: string) => {
    setActiveTool(toolId);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-4 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white">
      
      {/* Device Shell Container */}
      <div className={`w-full transition-all duration-300 flex flex-col bg-slate-50 dark:bg-slate-950 shadow-2xl overflow-hidden border border-slate-700/50 ${
        isExpanded
          ? 'max-w-4xl min-h-[92vh] rounded-2xl'
          : 'max-w-md h-screen sm:h-[880px] rounded-none sm:rounded-[42px]'
      }`}>
        
        {/* Top App Header */}
        <Header
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          isExpanded={isExpanded}
          onToggleExpanded={() => setIsExpanded(!isExpanded)}
          onOpenAi={() => handleOpenAiPlanner()}
          onOpenStudy={() => setActiveTool('study')}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-4 pt-3 hide-scrollbar relative">
          
          {/* Sub-tool Header if a specific tool is active */}
          {activeTool && (
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md py-2 z-20 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveTool(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to Hub</span>
              </button>
              <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-0.5 rounded-full">
                {activeTool}
              </span>
            </div>
          )}

          {/* ACTIVE TOOL ROUTING */}
          {activeTool ? (
            <div>
              {activeTool === 'homework' && (
                <HomeworkTool
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  onExplainConcept={(t) => setExplainingTask(t)}
                />
              )}

              {activeTool === 'notes' && (
                <NotesTool
                  notes={notes}
                  onAddNote={(n) => setNotes([n, ...notes])}
                  onUpdateNote={(n) => setNotes(notes.map(item => item.id === n.id ? n : item))}
                  onDeleteNote={(id) => setNotes(notes.filter(item => item.id !== id))}
                />
              )}

              {activeTool === 'focus' && (
                <FocusTool
                  onSessionComplete={(min) => setFocusMinutesToday(prev => prev + min)}
                />
              )}

              {activeTool === 'goals' && (
                <GoalsTool
                  goals={goals}
                  onUpdateGoals={(updated) => setGoals(updated)}
                />
              )}

              {activeTool === 'money' && (
                <MoneyTool
                  entries={moneyEntries}
                  onAddEntry={(m) => setMoneyEntries([m, ...moneyEntries])}
                />
              )}

              {activeTool === 'music' && (
                <MusicTool
                  music={musicProject}
                  onUpdateMusic={(updated) => setMusicProject(prev => ({ ...prev, ...updated }))}
                />
              )}

              {activeTool === 'creative' && (
                <CreativeTool
                  projects={creativeProjects}
                  onAddProject={(p) => setCreativeProjects([p, ...creativeProjects])}
                />
              )}

              {activeTool === 'study' && (
                <StudyModeTool />
              )}

              {activeTool === 'skills' && (
                <LifeSkillsTool
                  skills={lifeSkills}
                  onUpdateSkills={(updated) => setLifeSkills(updated)}
                />
              )}
            </div>
          ) : (
            /* PRIMARY TAB VIEWS */
            <div>
              {activeTab === 'home' && (
                <HomeView
                  profile={profile}
                  tasks={tasks}
                  events={events}
                  goals={goals}
                  lifeSkills={lifeSkills}
                  focusMinutesToday={focusMinutesToday}
                  onToggleTask={handleToggleTask}
                  onOpenTool={handleOpenTool}
                  onOpenAiPlanner={handleOpenAiPlanner}
                  onOpenAddTaskModal={() => setActiveTool('homework')}
                />
              )}

              {activeTab === 'tools' && (
                <ToolsView onOpenTool={handleOpenTool} />
              )}

              {activeTab === 'planner' && (
                <PlannerView
                  events={events}
                  onAddEvent={handleAddEvent}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView
                  profile={profile}
                  achievements={achievements}
                  onUpdateProfile={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
                  darkMode={darkMode}
                  onToggleDarkMode={() => setDarkMode(!darkMode)}
                />
              )}
            </div>
          )}

        </main>

        {/* FLOATING ACTION COPILOT BUTTON */}
        {!activeTool && (
          <button
            onClick={() => handleOpenAiPlanner()}
            className="fixed bottom-20 right-6 sm:absolute sm:right-6 sm:bottom-20 z-40 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white py-3 px-4 rounded-2xl shadow-xl shadow-brand-500/30 flex items-center gap-2 border border-white/20 transition-all active:scale-95 group"
          >
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-bold tracking-wide">TeenOS AI</span>
          </button>
        )}

        {/* BOTTOM NAVIGATION BAR */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          activeTool={activeTool}
        />

        {/* MODALS */}
        <AiPlannerModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onApplyPlan={handleApplyAiPlan}
          initialQuery={aiInitialQuery}
        />

        <ConceptExplainerModal
          isOpen={explainingTask !== null}
          onClose={() => setExplainingTask(null)}
          task={explainingTask}
        />

      </div>
    </div>
  );
}
