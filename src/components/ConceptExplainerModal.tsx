import React, { useState, useEffect } from 'react';
import { X, BookOpen, Lightbulb, CheckCircle2, HelpCircle, Loader2 } from 'lucide-react';
import { Task } from '../types.ts';

interface ConceptExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const ConceptExplainerModal: React.FC<ConceptExplainerModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<{
    conceptOverview?: string;
    steps?: string[];
    guidingQuestion?: string;
    encouragement?: string;
  } | null>(null);

  useEffect(() => {
    if (!task || !isOpen) {
      setExplanation(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetch('/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskTitle: task.title,
        subject: task.subject,
        notes: task.notes || ''
      })
    })
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setExplanation(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setExplanation({
            conceptOverview: `In ${task.subject}, focus on breaking problems into core principles. Identify what information is given vs. what you need to discover.`,
            steps: [
              'Re-read the question carefully and highlight key vocabulary.',
              'Recall the primary equation, timeline, or rule taught in class.',
              'Solve one component at a time without jumping ahead.'
            ],
            guidingQuestion: 'What is the very first clue or pattern you observe here?',
            encouragement: "Take your time! Real learning happens when you work through the problem."
          });
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Lightbulb size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Concept Coach</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{task.subject} • Step Hints</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assignment:</span>
            <h3 className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">{task.title}</h3>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 size={24} className="animate-spin text-brand-500" />
              <p className="text-xs">Gathering key concepts & step hints...</p>
            </div>
          ) : explanation ? (
            <div className="space-y-4 text-xs">
              {/* Concept overview */}
              <div>
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1.5">
                  <BookOpen size={15} className="text-brand-500" />
                  <span>The Core Concept</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-brand-50/50 dark:bg-brand-950/20 p-3 rounded-2xl border border-brand-200/40 dark:border-brand-800/40">
                  {explanation.conceptOverview}
                </p>
              </div>

              {/* Step Hints */}
              {explanation.steps && explanation.steps.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    <span>How to Approach This (Step-by-Step)</span>
                  </div>
                  <div className="space-y-2">
                    {explanation.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {idx + 1}
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 leading-snug">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guiding Question */}
              {explanation.guidingQuestion && (
                <div className="p-3 bg-amber-500/10 dark:bg-amber-950/30 rounded-2xl border border-amber-500/20">
                  <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 mb-1">
                    <HelpCircle size={15} />
                    <span>Think About This:</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic">
                    "{explanation.guidingQuestion}"
                  </p>
                </div>
              )}

              {/* Encouragement */}
              {explanation.encouragement && (
                <p className="text-center text-slate-500 dark:text-slate-400 text-[11px] pt-1">
                  ✨ {explanation.encouragement}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Got it, ready to tackle it!
          </button>
        </div>

      </div>
    </div>
  );
};
