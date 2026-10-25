export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  priority: Priority;
  completed: boolean;
  notes?: string;
}

export type EventCategory = 'school' | 'sports' | 'music' | 'social' | 'personal' | 'study';

export interface PlannerEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  category: EventCategory;
  reminder: boolean;
  recurring?: string;
  location?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  folder: 'School' | 'Music' | 'Creative' | 'Personal';
  tags: string[];
  isPinned: boolean;
  updatedAt: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface GoalItem {
  id: string;
  title: string;
  category: string;
  deadline: string;
  progress: number;
  milestones: GoalMilestone[];
}

export interface MoneyEntry {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface MusicProject {
  id: string;
  title: string;
  lyrics: string;
  chords: string[];
  instrument: string;
  practiceMinutes: number;
}

export interface CreativeProject {
  id: string;
  title: string;
  category: 'music' | 'drawing' | 'photography' | 'video' | 'writing' | 'design';
  description: string;
  status: 'idea' | 'in-progress' | 'completed';
  tags: string[];
}

export interface LifeSkill {
  id: string;
  title: string;
  category: string;
  timeToRead: string;
  summary: string;
  steps: { id: string; text: string; done: boolean }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  name: string;
  grade: string;
  avatar: string;
  theme: 'dark' | 'light';
  accentColor: string;
  enabledWidgets: string[];
  notifications: {
    homework: boolean;
    exams: boolean;
    focus: boolean;
    goals: boolean;
    calendar: boolean;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  planBreakdown?: {
    task: string;
    duration: string;
    category: string;
  }[];
  timestamp: string;
}
