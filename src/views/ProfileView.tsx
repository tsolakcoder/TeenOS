import React, { useState } from 'react';
import { 
  User, Palette, Bell, ShieldCheck, Trophy, 
  Sun, Moon, LayoutGrid, Check, CheckCircle2, Lock
} from 'lucide-react';
import { UserProfile, Achievement } from '../types.ts';
import { ACCENT_THEMES } from '../utils/theme.ts';
import { audioManager } from '../utils/audio.ts';

interface ProfileViewProps {
  profile: UserProfile;
  achievements: Achievement[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  achievements,
  onUpdateProfile,
  darkMode,
  onToggleDarkMode,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [tempGrade, setTempGrade] = useState(profile.grade);

  const avatars = ['⚡', '🎧', '🚀', '🎨', '⚽', '🎸', '🌱', '👾', '🏄', '🧠'];

  const availableWidgets = [
    { id: 'aiAssistant', label: 'AI Copilot ("What do you need?")' },
    { id: 'todayPriorities', label: "Today's Priorities Checklist" },
    { id: 'quickTools', label: 'Quick Tool Launch Bar' },
    { id: 'plannerPreview', label: 'Next Upcoming Planner Event' },
    { id: 'goalsProgress', label: 'Active Goals Progress Bar' },
    { id: 'lifeSkillSnippet', label: 'Daily 2-Minute Life Skill Tip' },
  ];

  const handleSaveName = () => {
    onUpdateProfile({ name: tempName.trim() || 'Alex', grade: tempGrade.trim() || '10th Grade' });
    setIsEditingName(false);
    audioManager.playSuccessChime();
  };

  const toggleWidget = (widgetId: string) => {
    const current = profile.enabledWidgets || [];
    const exists = current.includes(widgetId);
    const updated = exists ? current.filter(id => id !== widgetId) : [...current, widgetId];
    onUpdateProfile({ enabledWidgets: updated });
  };

  const toggleNotification = (key: keyof UserProfile['notifications']) => {
    onUpdateProfile({
      notifications: {
        ...profile.notifications,
        [key]: !profile.notifications[key]
      }
    });
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      <div className="pt-1">
        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Personal Profile & OS Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Customize your toolkit, aesthetics, and privacy controls.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs text-center space-y-3">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-950/40 border-2 border-brand-500/30 flex items-center justify-center text-4xl shadow-inner mx-auto">
            {profile.avatar}
          </div>
        </div>

        {isEditingName ? (
          <div className="space-y-2 max-w-xs mx-auto">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full text-center font-bold text-sm bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
            <input
              type="text"
              value={tempGrade}
              onChange={(e) => setTempGrade(e.target.value)}
              className="w-full text-center text-xs bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
            />
            <button
              onClick={handleSaveName}
              className="px-4 py-1.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Save Profile
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center gap-1.5">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {profile.name}
              </h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-[10px] text-brand-600 dark:text-brand-400 font-bold hover:underline"
              >
                (Edit)
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {profile.grade} · High School Toolkit
            </p>
          </div>
        )}

        {/* Quick Avatar Picker */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
            Choose Your Avatar
          </span>
          <div className="flex justify-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
            {avatars.map((av) => (
              <button
                key={av}
                onClick={() => onUpdateProfile({ avatar: av })}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all ${
                  profile.avatar === av
                    ? 'bg-brand-500 text-white scale-110 shadow-md shadow-brand-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appearance & Accent Color */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-brand-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Appearance & Accents
          </h3>
        </div>

        {/* Dark Mode Switch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {darkMode ? <Moon size={16} className="text-brand-400" /> : <Sun size={16} className="text-amber-500" />}
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white block">
                Dark Mode
              </span>
              <span className="text-[10px] text-slate-400">
                {darkMode ? 'Comfortable for nighttime study' : 'Crisp high-contrast day view'}
              </span>
            </div>
          </div>
          <button
            onClick={onToggleDarkMode}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              darkMode ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* 6 User-Selectable Accent Colors */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-800 dark:text-white block mb-1">
            Accent Theme Flavor
          </span>
          <p className="text-[10px] text-slate-400 mb-2.5">
            Personalize buttons, highlights, and focus indicators
          </p>
          <div className="grid grid-cols-6 gap-2">
            {Object.values(ACCENT_THEMES).map((theme) => {
              const isSelected = profile.accentColor === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => onUpdateProfile({ accentColor: theme.id })}
                  style={{ backgroundColor: theme.hex }}
                  className={`h-9 rounded-xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'ring-4 ring-offset-2 ring-brand-500 dark:ring-offset-slate-900 scale-105 shadow-md'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                  title={theme.name}
                >
                  {isSelected && <Check size={14} className="text-white drop-shadow-sm" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Home Screen Personalization */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <LayoutGrid size={16} className="text-brand-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Personalize Home Screen
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose which sections appear on your main dashboard:
        </p>

        <div className="space-y-2">
          {availableWidgets.map((widget) => {
            const isEnabled = (profile.enabledWidgets || []).includes(widget.id);
            return (
              <div
                key={widget.id}
                onClick={() => toggleWidget(widget.id)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {widget.label}
                </span>
                <button
                  type="button"
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    isEnabled
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  {isEnabled && <Check size={12} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-brand-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Notifications & Reminders
          </h3>
        </div>

        <div className="space-y-2">
          {[
            { key: 'homework', label: 'Homework Deadlines' },
            { key: 'exams', label: 'Exam & Test Alerts' },
            { key: 'calendar', label: 'Calendar Event Reminders' },
            { key: 'focus', label: 'Focus & Study Session Breaks' },
            { key: 'goals', label: 'Personal Goal Milestones' },
          ].map((item) => {
            const active = profile.notifications[item.key as keyof UserProfile['notifications']];
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {item.label}
                </span>
                <button
                  onClick={() => toggleNotification(item.key as any)}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                    active ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Private Achievements (Zero Public Comparison) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Personal Milestones
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Lock size={11} />
            <span>100% Private</span>
          </span>
        </div>

        <div className="space-y-2">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xl ${ach.unlocked ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                  🏆
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                    {ach.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {ach.description}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                ach.unlocked
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {ach.unlocked ? 'Unlocked' : 'In Progress'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Privacy Statement */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 rounded-3xl space-y-2">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
          <ShieldCheck size={18} />
          <span>TeenOS Privacy & Safety Charter</span>
        </div>
        <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
          TeenOS is strictly your private space. There are NO public follower feeds, zero advertisement algorithms, no public scoreboards, and no data sharing. Everything stays in your browser.
        </p>
      </div>

    </div>
  );
};
