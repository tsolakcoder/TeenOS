import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, ArrowRight, Loader2, Calendar, BookOpen } from 'lucide-react';
import { Task, PlannerEvent } from '../types.ts';
import { audioManager } from '../utils/audio.ts';

interface AiPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlan: (tasks: Task[], events: PlannerEvent[]) => void;
  initialQuery?: string;
}

export const AiPlannerModal: React.FC<AiPlannerModalProps> = ({
  isOpen,
  onClose,
  onApplyPlan,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{
    sender: 'user' | 'assistant';
    text: string;
    tasks?: any[];
    events?: any[];
  }>>([
    {
      sender: 'assistant',
      text: "Hey! 👋 I'm your TeenOS AI copilot. Tell me what's on your plate (e.g. 'I have a history test on Friday and football practice at 7 PM'), and I'll craft a balanced, stress-free plan for your day."
    }
  ]);

  if (!isOpen) return null;

  const handleSubmit = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const currentText = userText.trim();
    setQuery('');
    setMessages(prev => [...prev, { sender: 'user', text: currentText }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: currentText }),
      });

      if (!response.ok) throw new Error('Failed to plan');
      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: data.summary || "Here is a balanced plan designed to keep you organized without burnout:",
          tasks: data.suggestedTasks || [],
          events: data.suggestedEvents || [],
        }
      ]);
      audioManager.playSuccessChime();
    } catch {
      // Fallback
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "Here's a balanced plan I drafted for you:",
          tasks: [
            { title: `Prep & Study: ${currentText.slice(0, 30)}`, subject: 'School', durationMin: 30, priority: 'high', dueTime: '4:00 PM', notes: 'Active recall sprint' },
            { title: 'Short review & pack bag', subject: 'General', durationMin: 15, priority: 'medium', dueTime: '6:30 PM', notes: 'Get ready for tomorrow' }
          ],
          events: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdoptPlan = (tasks: any[], events: any[]) => {
    const formattedTasks: Task[] = (tasks || []).map((t, idx) => ({
      id: `ai-t-${Date.now()}-${idx}`,
      title: t.title,
      subject: t.subject || 'General',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: t.dueTime || 'Today',
      priority: t.priority || 'medium',
      completed: false,
      notes: t.notes || `${t.durationMin ? `${t.durationMin} min session` : ''}`
    }));

    const formattedEvents: PlannerEvent[] = (events || []).map((e, idx) => ({
      id: `ai-e-${Date.now()}-${idx}`,
      title: e.title,
      date: e.date || new Date().toISOString().split('T')[0],
      time: e.time || '05:00 PM',
      category: e.category || 'school',
      reminder: true,
      location: 'Today'
    }));

    onApplyPlan(formattedTasks, formattedEvents);
    audioManager.playSuccessChime();
    onClose();
  };

  const samplePrompts = [
    "History test on Friday & football practice at 7 PM",
    "Math quiz tomorrow and guitar rehearsal at 5",
    "Need a 2-hour distraction-free Sunday study plan",
    "Help me break down my 4-page English book report"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">TeenOS Copilot</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daily planner & concept guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat / Plan area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-xs shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs'
                }`}
              >
                <p>{msg.text}</p>

                {/* Plan Proposal Cards */}
                {msg.tasks && msg.tasks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
                    <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block">
                      Organized Agenda:
                    </span>
                    {msg.tasks.map((task, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-slate-800 dark:text-slate-200"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                          <span className="font-semibold truncate">{task.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0 ml-2 font-mono">
                          {task.dueTime}
                        </span>
                      </div>
                    ))}

                    {msg.events && msg.events.map((ev, eIdx) => (
                      <div
                        key={eIdx}
                        className="p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-indigo-900 dark:text-indigo-200"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Calendar size={14} className="text-indigo-500 shrink-0" />
                          <span className="font-semibold truncate">{ev.title}</span>
                        </div>
                        <span className="text-[10px] text-indigo-500 shrink-0 ml-2 font-mono">
                          {ev.time}
                        </span>
                      </div>
                    ))}

                    <button
                      onClick={() => handleAdoptPlan(msg.tasks || [], msg.events || [])}
                      className="w-full mt-2 py-2 px-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>Add Plan to Today's Agenda</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs rounded-2xl w-fit">
              <Loader2 size={16} className="animate-spin text-brand-500" />
              <span>Analyzing schedule & balancing study time...</span>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-200/60 dark:border-slate-800/60 flex gap-1.5 overflow-x-auto hide-scrollbar bg-slate-50/70 dark:bg-slate-900/70">
          {samplePrompts.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSubmit(sample)}
              className="text-[11px] whitespace-nowrap px-3 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700/80 hover:border-brand-500/50 transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(query);
          }}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your tests, practices, homework..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-slate-100 dark:bg-slate-800 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white rounded-xl transition-all shadow-sm"
          >
            <Send size={16} />
          </button>
        </form>

      </div>
    </div>
  );
};
