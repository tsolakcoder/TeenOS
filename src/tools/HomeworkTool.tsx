import React, { useState } from 'react';
import { Plus, BookOpen, CheckCircle2, Circle, Lightbulb, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Task, Priority } from '../types.ts';
import { audioManager } from '../utils/audio.ts';

interface HomeworkToolProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onExplainConcept: (task: Task) => void;
}

export const HomeworkTool: React.FC<HomeworkToolProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onExplainConcept,
}) => {
  const [filterSubject, setFilterSubject] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Math');
  const [dueTime, setDueTime] = useState('05:00 PM');
  const [priority, setPriority] = useState<Priority>('medium');
  const [notes, setNotes] = useState('');

  const subjects = ['All', 'Math', 'Biology', 'Spanish', 'History', 'English', 'Music', 'Sports'];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      subject,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime,
      priority,
      completed: false,
      notes: notes.trim() || undefined
    };

    onAddTask(newTask);
    audioManager.playSuccessChime();
    setTitle('');
    setNotes('');
    setIsAdding(false);
  };

  const handleToggle = (task: Task) => {
    if (!task.completed) {
      audioManager.playSuccessChime();
    }
    onToggleTask(task.id);
  };

  const filteredTasks = tasks.filter(t => {
    return filterSubject === 'All' || t.subject.toLowerCase() === filterSubject.toLowerCase();
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Homework & Concept Coach
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Never get stuck. Ask for concept breakdowns and step hints.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
        >
          <Plus size={14} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Add Task Card */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 border border-brand-500/30 rounded-3xl p-4 shadow-sm space-y-3 animate-fade-in">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            New Homework Assignment
          </h3>

          <input
            type="text"
            placeholder="e.g. Calculus Problem Set #4 (Odd problems 1-15)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 px-2.5 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
              >
                {subjects.filter(s => s !== 'All').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Due Time</label>
              <input
                type="text"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                placeholder="5:00 PM"
                className="w-full bg-slate-50 dark:bg-slate-800 px-2.5 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-50 dark:bg-slate-800 px-2.5 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
              >
                <option value="high">High 🔥</option>
                <option value="medium">Medium ⚡</option>
                <option value="low">Low ☕</option>
              </select>
            </div>
          </div>

          <textarea
            rows={2}
            placeholder="Extra notes or instructions from teacher..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none resize-none"
          />

          <div className="flex justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Save Assignment
            </button>
          </div>
        </form>
      )}

      {/* Subject Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setFilterSubject(sub)}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
              filterSubject.toLowerCase() === sub.toLowerCase()
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 space-y-2">
            <BookOpen size={28} className="mx-auto text-slate-400 opacity-60" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No assignments in this category
            </h4>
            <p className="text-[11px] text-slate-400">
              You're all caught up for {filterSubject}!
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <button
                    onClick={() => handleToggle(task)}
                    className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {task.completed ? <CheckCircle2 size={14} /> : <Circle size={14} className="opacity-0" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h4 className={`text-xs font-bold leading-snug ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {task.title}
                    </h4>
                    {task.notes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {task.subject}
                  </span>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Bottom bar with AI Explainer trigger */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                <span className="text-slate-400 font-mono flex items-center gap-1">
                  <Clock size={12} />
                  <span>{task.dueTime}</span>
                </span>

                <button
                  onClick={() => onExplainConcept(task)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/40 rounded-xl font-bold transition-all"
                >
                  <Lightbulb size={13} className="text-amber-500" />
                  <span>Explain Concept & Hints</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
