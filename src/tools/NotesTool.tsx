import React, { useState } from 'react';
import { Plus, Pin, Trash2, Search, Folder, Tag, CheckSquare, Edit3, Compass } from 'lucide-react';
import { NoteItem } from '../types.ts';
import { audioManager } from '../utils/audio.ts';

interface NotesToolProps {
  notes: NoteItem[];
  onAddNote: (note: NoteItem) => void;
  onUpdateNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesTool: React.FC<NotesToolProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [activeFolder, setActiveFolder] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folder, setFolder] = useState<'School' | 'Music' | 'Creative' | 'Personal'>('School');
  const [tagsInput, setTagsInput] = useState('');

  const folders = ['All', 'School', 'Music', 'Creative', 'Personal'];

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setFolder(activeFolder !== 'All' ? (activeFolder as any) : 'School');
    setTagsInput('');
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: NoteItem) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setFolder(note.folder);
    setTagsInput(note.tags.join(', '));
    setIsEditorOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (editingId) {
      const existing = notes.find(n => n.id === editingId);
      if (existing) {
        onUpdateNote({
          ...existing,
          title: title.trim(),
          content: content.trim(),
          folder,
          tags: parsedTags,
          updatedAt: 'Just now'
        });
      }
    } else {
      const newNote: NoteItem = {
        id: `note-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        folder,
        tags: parsedTags,
        isPinned: false,
        updatedAt: 'Just now'
      };
      onAddNote(newNote);
    }

    audioManager.playSuccessChime();
    setIsEditorOpen(false);
  };

  const togglePin = (note: NoteItem) => {
    onUpdateNote({
      ...note,
      isPinned: !note.isPinned
    });
  };

  const filtered = notes
    .filter(n => {
      const matchesFolder = activeFolder === 'All' || n.folder === activeFolder;
      const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                            n.content.toLowerCase().includes(search.toLowerCase()) ||
                            n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      return matchesFolder && matchesSearch;
    })
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Notes & Ideas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Formulas, songwriting bars, shotlists & checklists.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
        >
          <Plus size={14} />
          <span>New Note</span>
        </button>
      </div>

      {/* Search & Folder Strip */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, formulas, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFolder(f)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                activeFolder === f
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {editingId ? 'Edit Note' : 'Create New Note'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <input
                type="text"
                placeholder="Note Title (e.g. Photosynthesis Formula)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full font-bold text-sm bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Folder</label>
                  <select
                    value={folder}
                    onChange={(e) => setFolder(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  >
                    <option value="School">School 📚</option>
                    <option value="Music">Music 🎵</option>
                    <option value="Creative">Creative 🎨</option>
                    <option value="Personal">Personal 🌱</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Bio, ExamPrep, Lyrics"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <textarea
                rows={6}
                placeholder="Write formulas, poem drafts, video shotlist, brainstorms..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 leading-relaxed focus:outline-none resize-none font-mono"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 space-y-2">
            <Compass size={28} className="mx-auto text-slate-400 opacity-60" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No notes in this folder
            </h4>
            <p className="text-[11px] text-slate-400">
              Tap "+ New Note" above to capture formulas, ideas, or lyrics.
            </p>
          </div>
        ) : (
          filtered.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2 hover:border-brand-500/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-full shrink-0">
                      {note.folder}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {note.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePin(note)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      note.isPinned ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title={note.isPinned ? "Unpin" : "Pin to top"}
                  >
                    <Pin size={13} className={note.isPinned ? 'fill-amber-500' : ''} />
                  </button>
                  <button
                    onClick={() => handleEditNote(note)}
                    className="p-1.5 text-slate-400 hover:text-brand-500 rounded-lg transition-colors"
                    title="Edit note"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                    title="Delete note"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line line-clamp-3 leading-relaxed">
                {note.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
                  {note.tags.map((t, idx) => (
                    <span key={idx} className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
                <span className="shrink-0 ml-2 font-mono">{note.updatedAt}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
