import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Flame, Award, Sparkles, Coffee } from 'lucide-react';
import { audioManager } from '../utils/audio.ts';

interface FocusToolProps {
  onSessionComplete: (minutes: number) => void;
}

export const FocusTool: React.FC<FocusToolProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [ambientActive, setAmbientActive] = useState<'rain' | 'lofi' | 'cafe' | null>(null);

  // Focus statistics
  const [todayMin, setTodayMin] = useState(50);
  const [weeklyHours, setWeeklyHours] = useState(6.5);
  const [sessionsCount, setSessionsCount] = useState(3);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(sec => sec - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false);
      audioManager.playSuccessChime();
      const minutesCompleted = mode === 'pomodoro' ? 25 : mode === 'shortBreak' ? 5 : 15;
      setTodayMin(m => m + minutesCompleted);
      setSessionsCount(s => s + 1);
      onSessionComplete(minutesCompleted);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, mode, onSessionComplete]);

  const switchMode = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak', minutes: number) => {
    setIsActive(false);
    setMode(newMode);
    setSecondsLeft(minutes * 60);
  };

  const handleToggleAmbient = (type: 'rain' | 'lofi' | 'cafe') => {
    if (ambientActive === type) {
      audioManager.stopAmbient();
      setAmbientActive(null);
    } else {
      audioManager.stopAmbient();
      const started = audioManager.toggleAmbient(type);
      if (started) {
        setAmbientActive(type);
      }
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalModeSeconds = mode === 'pomodoro' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
  const progressPercent = ((totalModeSeconds - secondsLeft) / totalModeSeconds) * 100;

  return (
    <div className="space-y-5 animate-fade-in text-center max-w-sm mx-auto">
      <div>
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
          Focus & Pomodoro Timer
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter deep focus. Lock in for 25 minutes, then recharge.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
        {[
          { id: 'pomodoro' as const, label: 'Study 25m', mins: 25 },
          { id: 'shortBreak' as const, label: 'Break 5m', mins: 5 },
          { id: 'longBreak' as const, label: 'Rest 15m', mins: 15 },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id, m.mins)}
            className={`flex-1 py-1.5 rounded-xl font-bold transition-all ${
              mode === m.id
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Big Circular Focus Dial */}
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
        {/* Ambient Pulsing Aura */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
            isActive ? 'bg-brand-500/25 scale-105' : 'bg-transparent'
          }`}
        />

        {/* SVG Progress Ring */}
        <svg className="w-60 h-60 -rotate-90">
          <circle
            cx="120"
            cy="120"
            r="105"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-100 dark:text-slate-800/80 fill-transparent"
          />
          <circle
            cx="120"
            cy="120"
            r="105"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 105}
            strokeDashoffset={2 * Math.PI * 105 * (1 - progressPercent / 100)}
            strokeLinecap="round"
            className="text-brand-500 transition-all duration-300 fill-transparent"
          />
        </svg>

        {/* Core Center Display */}
        <div className="absolute inset-4 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center p-4 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            {isActive ? 'Session Active' : 'Ready'}
          </span>
          <span className="text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {timeFormatted}
          </span>
          <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-2">
            {mode === 'pomodoro' ? 'No distractions • Locked in' : 'Hydrate & stretch 💧'}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className="px-8 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all active:scale-95"
        >
          {isActive ? <Pause size={18} /> : <Play size={18} className="fill-current" />}
          <span>{isActive ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button
          onClick={() => {
            setIsActive(false);
            setSecondsLeft(mode === 'pomodoro' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60);
          }}
          className="p-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-2xl transition-all"
          title="Reset timer"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Procedural Ambient Soundscapes (Real Web Audio synthesizer) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 text-left space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
            <Volume2 size={14} className="text-brand-500" />
            <span>Ambient Sound Generator</span>
          </span>
          {ambientActive && (
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              Playing
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'rain' as const, label: '🌧️ Rain Storm' },
            { id: 'lofi' as const, label: '🎧 Lo-Fi Noise' },
            { id: 'cafe' as const, label: '☕ Cozy Cafe' },
          ].map((snd) => (
            <button
              key={snd.id}
              onClick={() => handleToggleAmbient(snd.id)}
              className={`p-2 rounded-xl text-xs font-semibold text-center transition-all ${
                ambientActive === snd.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {snd.label}
            </button>
          ))}
        </div>
      </div>

      {/* Focus Stats Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Today</span>
          <span className="text-base font-black text-slate-900 dark:text-white font-mono">
            {todayMin}m
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Weekly</span>
          <span className="text-base font-black text-slate-900 dark:text-white font-mono">
            {weeklyHours}h
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Streaks</span>
          <span className="text-base font-black text-brand-500 font-mono flex items-center justify-center gap-1">
            <span>{sessionsCount}</span>
            <Flame size={14} className="text-amber-500 fill-amber-500" />
          </span>
        </div>
      </div>
    </div>
  );
};
