import React, { useState } from 'react';
import { Target, Plus, CheckCircle2, Circle, Trophy, Calendar, Sparkles } from 'lucide-react';
import { GoalItem } from '../types.ts';
import { audioManager } from '../utils/audio.ts';

interface GoalsToolProps {
  goals: GoalItem[];
  onUpdateGoals: (updated: GoalItem[]) => void;
}

export const GoalsTool: React.FC<GoalsToolProps> = ({ goals, onUpdateGoals }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Music');
  const [deadline, setDeadline] = useState('Dec 01, 2026');
  const [milestonesInput, setMilestonesInput] = useState('');

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const updated = goals.map(g => {
      if (g.id === goalId) {
        const newMilestones = g.milestones.map(m => {
          if (m.id === milestoneId) {
            return { ...m, completed: !m.completed };
          }
          return m;
        });

        const completedCount = newMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / newMilestones.length) * 100);

        return {
          ...g,
          milestones: newMilestones,
          progress
        };
      }
      return g;
    });

    onUpdateGoals(updated);
    audioManager.playSuccessChime();
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedMilestones = milestonesInput
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map((text, i) => ({
        id: `ms-${Date.now()}-${i}`,
        title: text,
        completed: false
      }));

    const newGoal: GoalItem = {
      id: `g-${Date.now()}`,
      title: title.trim(),
      category,
      deadline,
      progress: 0,
      milestones: parsedMilestones.length > 0 ? parsedMilestones : [
        { id: `ms-1`, title: 'Define first step', completed: false }
      ]
    };

    onUpdateGoals([newGoal, ...goals]);
    audioManager.playSuccessChime();
    setTitle('');
    setMilestonesInput('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Personal Goals & Milestones
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Healthy personal growth. No leaderboards or pressure.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
        >
          <Plus size={14} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Positive Statement Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-4 text-white shadow-md">
        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-200">
          Private · Step-by-Step
        </span>
        <h3 className="text-sm font-bold mt-0.5">
          Break Big Dreams into Daily Steps
        </h3>
        <p className="text-xs text-violet-100/90 mt-1 leading-relaxed">
          Whether it's learning an instrument or hitting a target grade, progress happens when you conquer small milestones.
        </p>
      </div>

      {/* Add Goal Modal / Form */}
      {isAdding && (
        <form onSubmit={handleAddGoal} className="bg-white dark:bg-slate-900 border border-brand-500/30 rounded-3xl p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Create Personal Goal
          </h3>

          <input
            type="text"
            placeholder="Goal name (e.g. Master Barre Chords, Save $120)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
              >
                <option value="Music">Music 🎵</option>
                <option value="School">School 📚</option>
                <option value="Money">Money 💰</option>
                <option value="Creative">Creative 🎨</option>
                <option value="Fitness">Fitness ⚽</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Target Deadline</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="Dec 15, 2026"
                className="w-full bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Milestone Steps (1 per line)
            </label>
            <textarea
              rows={3}
              placeholder="Step 1: Practice 10 min daily&#10;Step 2: Clean chord transition&#10;Step 3: Play full song"
              value={milestonesInput}
              onChange={(e) => setMilestonesInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-xl"
            >
              Save Goal
            </button>
          </div>
        </form>
      )}

      {/* Goals Cards List */}
      <div className="space-y-3">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-full">
                  {goal.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {goal.title}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Target: {goal.deadline}
                </span>
              </div>

              <div className="text-right">
                <span className="text-base font-black text-brand-600 dark:text-brand-400 font-mono">
                  {goal.progress}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${goal.progress}%` }}
              />
            </div>

            {/* Milestones checklist */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                Milestone Steps:
              </span>
              {goal.milestones.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleMilestone(goal.id, m.id)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <button
                    type="button"
                    aria-label={m.completed ? "Mark milestone incomplete" : "Mark milestone complete"}
                    className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                      m.completed
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {m.completed && <CheckCircle2 size={12} />}
                  </button>
                  <span className={`text-xs ${m.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {m.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
