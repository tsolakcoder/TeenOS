import React, { useState } from 'react';
import { Brain, RotateCw, CheckCircle2, ChevronRight, Sparkles, BookOpen, Clock } from 'lucide-react';
import { INITIAL_FLASHCARDS } from '../data/initialData.ts';
import { audioManager } from '../utils/audio.ts';

interface StudyModeToolProps {
  onSessionFinish?: () => void;
}

export const StudyModeTool: React.FC<StudyModeToolProps> = () => {
  const [selectedSubject, setSelectedSubject] = useState<'Biology' | 'Spanish' | 'History'>('Biology');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);

  const activeSet = INITIAL_FLASHCARDS.find(s => s.subject === selectedSubject)?.cards || INITIAL_FLASHCARDS[0].cards;
  const currentCard = activeSet[cardIndex % activeSet.length];

  const handleNext = (mastered: boolean) => {
    setIsFlipped(false);
    if (mastered) {
      setMasteredCount(c => c + 1);
      audioManager.playSuccessChime();
    }
    setCardIndex(idx => (idx + 1) % activeSet.length);
  };

  return (
    <div className="space-y-4 animate-fade-in text-center max-w-sm mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-bold text-xs mb-1 border border-brand-200/50 dark:border-brand-800/50">
          <Brain size={14} />
          <span>Active Recall Study Mode</span>
        </div>
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
          Flashcard Sprint
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Test your brain before flipping. Spaced repetition for test prep.
        </p>
      </div>

      {/* Subject Selector */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
        {(['Biology', 'Spanish', 'History'] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => {
              setSelectedSubject(sub);
              setCardIndex(0);
              setIsFlipped(false);
            }}
            className={`flex-1 py-1.5 rounded-xl font-bold transition-all ${
              selectedSubject === sub
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Interactive 3D Flip Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-64 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between cursor-pointer shadow-md hover:border-brand-500/50 transition-all select-none relative group"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span className="font-mono">Card {cardIndex + 1} of {activeSet.length}</span>
          <span className="text-brand-500 font-bold flex items-center gap-1">
            <RotateCw size={13} className="group-hover:rotate-180 transition-transform duration-500" />
            <span>Tap to flip</span>
          </span>
        </div>

        <div className="my-auto px-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            {isFlipped ? 'Answer & Explanation' : 'Question / Concept'}
          </span>
          <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
            {isFlipped ? currentCard.a : currentCard.q}
          </p>
        </div>

        <div className="text-[11px] text-slate-400">
          {isFlipped ? 'Did you recall it accurately?' : 'Try answering out loud before flipping!'}
        </div>
      </div>

      {/* Answer Verification Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => handleNext(false)}
          className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl transition-all"
        >
          Still Learning 🔄
        </button>
        <button
          onClick={() => handleNext(true)}
          className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 size={16} />
          <span>Mastered!</span>
        </button>
      </div>

      {/* Study Stats */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Session Progress:</span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
          {masteredCount} terms mastered today 🎉
        </span>
      </div>
    </div>
  );
};
