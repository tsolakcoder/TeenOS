import React, { useState } from 'react';
import { Lightbulb, CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';
import { LifeSkill } from '../types.ts';
import { audioManager } from '../utils/audio.ts';

interface LifeSkillsToolProps {
  skills: LifeSkill[];
  onUpdateSkills: (updated: LifeSkill[]) => void;
}

export const LifeSkillsTool: React.FC<LifeSkillsToolProps> = ({ skills, onUpdateSkills }) => {
  const [expandedId, setExpandedId] = useState<string>(skills[0]?.id || '');

  const toggleStep = (skillId: string, stepId: string) => {
    const updated = skills.map(s => {
      if (s.id === skillId) {
        const newSteps = s.steps.map(step => {
          if (step.id === stepId) {
            const nextDone = !step.done;
            if (nextDone) audioManager.playSuccessChime();
            return { ...step, done: nextDone };
          }
          return step;
        });
        return { ...s, steps: newSteps };
      }
      return s;
    });

    onUpdateSkills(updated);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
          Life Skills 101
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Practical high school survival tips. Under 2 minutes, zero lecture.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="space-y-3">
        {skills.map((skill) => {
          const isExpanded = expandedId === skill.id;
          const completedSteps = skill.steps.filter(st => st.done).length;

          return (
            <div
              key={skill.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-2.5 transition-all"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? '' : skill.id)}
                className="flex items-start justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      {skill.category}
                    </span>
                    <span className="text-[10px] text-slate-400">· {skill.timeToRead}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {skill.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    {completedSteps}/{skill.steps.length} done
                  </span>
                  {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {skill.summary}
              </p>

              {/* Interactive checklist */}
              {isExpanded && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 animate-fade-in">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                    Interactive Checklist:
                  </span>
                  {skill.steps.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => toggleStep(skill.id, st.id)}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <button
                        type="button"
                        aria-label={st.done ? "Mark step incomplete" : "Mark step complete"}
                        className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                          st.done
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {st.done && <CheckCircle2 size={12} />}
                      </button>
                      <span className={`text-xs ${st.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {st.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
