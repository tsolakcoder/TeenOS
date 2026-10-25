import React, { useState } from 'react';
import { Palette, Plus, Sparkles, Camera, PenTool, Video, CheckCircle2, ChevronRight, Lightbulb } from 'lucide-react';
import { CreativeProject } from '../types.ts';
import { audioManager } from '../utils/audio.ts';

interface CreativeToolProps {
  projects: CreativeProject[];
  onAddProject: (project: CreativeProject) => void;
}

export const CreativeTool: React.FC<CreativeToolProps> = ({ projects, onAddProject }) => {
  const [filterCat, setFilterCat] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'drawing' | 'photography' | 'video' | 'writing' | 'design'>('photography');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const dailyPrompt = "Capture or sketch high-contrast shadows casting through blinds during the late afternoon.";

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject: CreativeProject = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim(),
      status: 'idea',
      tags: tagsInput.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean)
    };

    onAddProject(newProject);
    audioManager.playSuccessChime();
    setTitle('');
    setDescription('');
    setTagsInput('');
    setIsAdding(false);
  };

  const filtered = projects.filter(p => {
    return filterCat === 'all' || p.category === filterCat;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Creative Workspace
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Brainstorming, video edits, writing drafts & design concepts.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
        >
          <Plus size={14} />
          <span>New Idea</span>
        </button>
      </div>

      {/* Daily Creative Prompt Challenge */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-4 sm:p-5 text-white shadow-md space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-200" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200">
            Daily 5-Minute Challenge
          </span>
        </div>
        <h3 className="text-xs font-bold leading-relaxed">
          "{dailyPrompt}"
        </h3>
        <p className="text-[11px] text-cyan-100">
          Spend 5 minutes sketching or taking 3 photos on your phone. Keep your creative muscle flexed!
        </p>
      </div>

      {/* Add Project Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 border border-brand-500/30 rounded-3xl p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Start New Creative Project
          </h3>

          <input
            type="text"
            placeholder="Project title (e.g. 35mm Skatepark Series, Sci-Fi Short Story)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Medium</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
              >
                <option value="photography">Photography 📷</option>
                <option value="writing">Creative Writing ✍️</option>
                <option value="video">Video Editing 🎬</option>
                <option value="drawing">Drawing & Art 🎨</option>
                <option value="design">Design & Graphics 📐</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tags</label>
              <input
                type="text"
                placeholder="35mm, Vlog, SciFi"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="Describe the mood, shotlist, themes, or color palette..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 resize-none"
          />

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
              Save Project
            </button>
          </div>
        </form>
      )}

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
        {['all', 'photography', 'writing', 'video', 'drawing', 'design'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold capitalize whitespace-nowrap transition-colors ${
              filterCat === cat
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded-full">
                  {proj.category}
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  {proj.title}
                </h3>
              </div>

              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full capitalize">
                {proj.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {proj.description}
            </p>

            {proj.tags && proj.tags.length > 0 && (
              <div className="flex gap-1 overflow-x-auto hide-scrollbar pt-1">
                {proj.tags.map((t, i) => (
                  <span key={i} className="text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-1.5 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
