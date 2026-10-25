import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, Plus, Volume2, Mic, Clock, Sparkles } from 'lucide-react';
import { MusicProject } from '../types.ts';
import { audioManager } from '../utils/audio.ts';

interface MusicToolProps {
  music: MusicProject;
  onUpdateMusic: (updated: Partial<MusicProject>) => void;
}

export const MusicTool: React.FC<MusicToolProps> = ({ music, onUpdateMusic }) => {
  const [lyrics, setLyrics] = useState(music.lyrics);
  const [chords, setChords] = useState(music.chords);
  const [instrument, setInstrument] = useState(music.instrument);
  
  // Practice session timer
  const [practiceSec, setPracticeSec] = useState(0);
  const [isPracticing, setIsPracticing] = useState(false);
  const [totalPracticeMin, setTotalPracticeMin] = useState(music.practiceMinutes || 45);

  useEffect(() => {
    let interval: any = null;
    if (isPracticing) {
      interval = setInterval(() => {
        setPracticeSec(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPracticing]);

  const handleTogglePractice = () => {
    if (isPracticing) {
      const addedMin = Math.round(practiceSec / 60);
      setTotalPracticeMin(prev => prev + addedMin);
      onUpdateMusic({ practiceMinutes: totalPracticeMin + addedMin });
      audioManager.playSuccessChime();
      setIsPracticing(false);
      setPracticeSec(0);
    } else {
      audioManager.playSuccessChime();
      setIsPracticing(true);
    }
  };

  const handlePlayChord = (chord: string) => {
    audioManager.playChord(chord);
  };

  const handleAddChord = () => {
    const defaultAvailable = ['Am', 'F', 'G', 'Cadd9', 'Em7', 'D', 'Dsus4'];
    const nextChord = defaultAvailable.find(c => !chords.includes(c)) || 'Am';
    const updated = [...chords, nextChord];
    setChords(updated);
    onUpdateMusic({ chords: updated });
    audioManager.playChord(nextChord);
  };

  const handleLyricsChange = (text: string) => {
    setLyrics(text);
    onUpdateMusic({ lyrics: text });
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
          Music Studio & Rehearsal Hub
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Capture riffs, write lyrics, and log your instrument practice time.
        </p>
      </div>

      {/* Practice Session Card */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-600 to-purple-600 rounded-3xl p-4 sm:p-5 text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-200 block">
            {instrument} Practice
          </span>
          <div className="text-3xl font-black font-mono tracking-tight mt-1">
            {formatTimer(practiceSec)}
          </div>
          <span className="text-[11px] text-pink-100 mt-0.5 block">
            Total logged this week: <strong className="font-mono">{totalPracticeMin}m</strong>
          </span>
        </div>

        <button
          onClick={handleTogglePractice}
          className="px-5 py-2.5 bg-white text-rose-600 hover:bg-rose-50 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
        >
          {isPracticing ? <Pause size={15} /> : <Play size={15} className="fill-current" />}
          <span>{isPracticing ? 'Finish' : 'Start Practice'}</span>
        </button>
      </div>

      {/* Interactive Chord Progression Pad */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-brand-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Chord Progression Scratchpad
            </h3>
          </div>
          <button
            onClick={handleAddChord}
            className="text-[11px] text-brand-600 dark:text-brand-400 font-bold bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-xl hover:bg-brand-100"
          >
            + Add Chord
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Tap each chord to hear the acoustic notes:
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {chords.map((chord, i) => (
            <button
              key={i}
              onClick={() => handlePlayChord(chord)}
              className="py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-brand-500 text-center font-bold text-sm text-slate-800 dark:text-slate-100 transition-all active:scale-95 shadow-xs"
            >
              <span className="font-mono">{chord}</span>
              <span className="block text-[9px] text-slate-400 font-normal">Play 🎵</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lyrics & Verse Pad */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic size={15} className="text-brand-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Song Lyrics & Rhythms: "{music.title}"
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Auto-saved</span>
        </div>

        <textarea
          rows={7}
          value={lyrics}
          onChange={(e) => handleLyricsChange(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed focus:outline-none border border-slate-200/60 dark:border-slate-700/60 resize-none"
        />
      </div>
    </div>
  );
};
