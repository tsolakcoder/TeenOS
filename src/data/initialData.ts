import { Task, PlannerEvent, NoteItem, GoalItem, MoneyEntry, MusicProject, CreativeProject, LifeSkill, Achievement, UserProfile } from '../types.ts';

export const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  grade: '10th Grade',
  avatar: '⚡',
  theme: 'dark',
  accentColor: 'violet',
  enabledWidgets: ['aiAssistant', 'todayPriorities', 'quickTools', 'plannerPreview', 'goalsProgress', 'lifeSkillSnippet'],
  notifications: {
    homework: true,
    exams: true,
    focus: true,
    goals: true,
    calendar: true
  }
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Review Biology Ch. 4 (Cell division & mitosis stages)',
    subject: 'Biology',
    dueDate: '2026-10-25',
    dueTime: '4:30 PM',
    priority: 'high',
    completed: false,
    notes: 'Focus on prophase vs metaphase spindle fibers. Diagrams on page 142.'
  },
  {
    id: 't-2',
    title: 'Spanish vocabulary quiz prep (Units 3 & 4)',
    subject: 'Spanish',
    dueDate: '2026-10-25',
    dueTime: 'Done earlier',
    priority: 'medium',
    completed: true,
    notes: 'Verbs like gustar, encantar and reflexive pronouns.'
  },
  {
    id: 't-3',
    title: 'Geometry proof worksheet #4 (Questions 1–8)',
    subject: 'Math',
    dueDate: '2026-10-26',
    dueTime: '6:00 PM',
    priority: 'medium',
    completed: false,
    notes: 'Alternate interior angles theorem and triangle congruency.'
  },
  {
    id: 't-4',
    title: 'Football practice gear & water bottle prep',
    subject: 'Sports',
    dueDate: '2026-10-25',
    dueTime: '5:00 PM',
    priority: 'high',
    completed: false,
    notes: 'Pack cleats, ankle brace, and electrolyte packet.'
  },
  {
    id: 't-5',
    title: 'Clean guitar fretboard & practice barre chord transitions',
    subject: 'Music',
    dueDate: '2026-10-26',
    dueTime: '7:30 PM',
    priority: 'low',
    completed: false,
    notes: 'Transition cleanly from C major to F barre without pause.'
  }
];

export const INITIAL_EVENTS: PlannerEvent[] = [
  {
    id: 'e-1',
    title: 'Football Practice & Scrimmage',
    date: '2026-10-25',
    time: '05:30 PM',
    category: 'sports',
    reminder: true,
    location: 'School Main Turf'
  },
  {
    id: 'e-2',
    title: 'AP European History Test (Renaissance & Reformation)',
    date: '2026-10-30',
    time: '09:15 AM',
    category: 'school',
    reminder: true,
    location: 'Room 204'
  },
  {
    id: 'e-3',
    title: 'Acoustic Guitar Rehearsal with Jordan',
    date: '2026-10-26',
    time: '04:00 PM',
    category: 'music',
    reminder: true,
    location: 'Garage Studio'
  },
  {
    id: 'e-4',
    title: 'Science Fair Project Proposal Due',
    date: '2026-10-28',
    time: '03:00 PM',
    category: 'school',
    reminder: true,
    location: 'Science Lab B'
  },
  {
    id: 'e-5',
    title: "Maya's 16th Birthday Celebration",
    date: '2026-10-31',
    time: '07:00 PM',
    category: 'social',
    reminder: true,
    location: 'Community Center'
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'n-1',
    title: 'Photosynthesis Core Formula & Stages',
    folder: 'School',
    tags: ['Biology', 'ExamPrep', 'Mitochondria'],
    isPinned: true,
    content: 'Formula: 6CO2 + 6H2O + Light -> C6H12O6 + 6O2\n\nLight-dependent reaction: occurs in thylakoid membranes, splits water, produces ATP & NADPH.\n\nLight-independent (Calvin cycle): occurs in the stroma, fixes CO2 into glucose using RuBisCO enzyme.',
    updatedAt: '2 hours ago'
  },
  {
    id: 'n-2',
    title: 'Song Bridge Idea: "Yellow Lights"',
    folder: 'Music',
    tags: ['Songwriting', 'Indie', 'Acoustic'],
    isPinned: false,
    content: 'Tempo: ~92 BPM\nProgression: Em7 -> Cadd9 -> G -> D/F#\n\nLyrics:\n"Running through yellow lights before the streetlamps wake up\nCounting all the things we never quite said\nTurn the volume past ten till the speakers break up\nLiving in the middle of a thought in my head."',
    updatedAt: 'Yesterday'
  },
  {
    id: 'n-3',
    title: 'Skatepark Autumn Video Edit Shotlist',
    folder: 'Creative',
    tags: ['Video', 'Editing', '35mm'],
    isPinned: false,
    content: '1. Low angle slow-mo kickflip on the concrete pyramid\n2. Golden hour silhouette roll-in\n3. Macro shot: wheels spinning on grip tape\n4. Fast snap-zoom cut to music beat drop (0:42)\n5. Color grade: warm amber tones with slight 16mm grain',
    updatedAt: 'Oct 23'
  },
  {
    id: 'n-4',
    title: 'Sophomore Year Goals & College Prep Brainstorm',
    folder: 'Personal',
    tags: ['Planning', 'Future', 'Clubs'],
    isPinned: false,
    content: '- Join Robotics Club or Coding League this semester\n- Volunteer at animal shelter on two Saturdays a month\n- Keep GPA above 3.8\n- Read 1 non-fiction book every month',
    updatedAt: 'Oct 20'
  }
];

export const INITIAL_GOALS: GoalItem[] = [
  {
    id: 'g-1',
    title: 'Master Barre Chords on Guitar',
    category: 'Music',
    deadline: 'Nov 15, 2026',
    progress: 67,
    milestones: [
      { id: 'm-1', title: 'Clean F-major without string buzz', completed: true },
      { id: 'm-2', title: 'Transition from C to F chord in 1 beat', completed: true },
      { id: 'm-3', title: 'Play entire rhythm of "Where Is My Mind" without stopping', completed: false }
    ]
  },
  {
    id: 'g-2',
    title: 'Score an A in Chemistry Midterm',
    category: 'School',
    deadline: 'Nov 20, 2026',
    progress: 50,
    milestones: [
      { id: 'm-4', title: 'Complete periodic trends flashcards (50 terms)', completed: true },
      { id: 'm-5', title: 'Practice 20 stoichiometry balancing equations', completed: true },
      { id: 'm-6', title: 'Take 1 timed practice test with review', completed: false },
      { id: 'm-7', title: 'Attend teacher office hours for lab report review', completed: false }
    ]
  },
  {
    id: 'g-3',
    title: 'Save $120 for Studio Monitor Headphones',
    category: 'Money',
    deadline: 'Dec 05, 2026',
    progress: 75,
    milestones: [
      { id: 'm-8', title: 'Save $40 from lawn mowing and chores', completed: true },
      { id: 'm-9', title: 'Set aside $50 from birthday gift', completed: true },
      { id: 'm-10', title: 'Earn remaining $30 from math peer tutoring', completed: false }
    ]
  }
];

export const INITIAL_MONEY: MoneyEntry[] = [
  { id: 'm-1', title: 'Weekly Allowance', amount: 20.00, type: 'income', category: 'Allowance', date: 'Oct 24' },
  { id: 'm-2', title: 'Dog Walking (Mrs. Henderson)', amount: 25.00, type: 'income', category: 'Jobs', date: 'Oct 23' },
  { id: 'm-3', title: 'Boba tea with friends', amount: 6.75, type: 'expense', category: 'Snacks & Food', date: 'Oct 24' },
  { id: 'm-4', title: 'Pack of D-Addario Guitar Picks', amount: 8.50, type: 'expense', category: 'Hobbies', date: 'Oct 22' },
  { id: 'm-5', title: 'Movie ticket with friends', amount: 12.00, type: 'expense', category: 'Entertainment', date: 'Oct 19' },
  { id: 'm-6', title: 'Math Peer Tutoring Session', amount: 15.00, type: 'income', category: 'Jobs', date: 'Oct 18' }
];

export const INITIAL_MUSIC: MusicProject = {
  id: 'mus-1',
  title: 'Yellow Lights (Indie Acoustic Demo)',
  lyrics: `[Verse 1]
Skateboards rattling on the cracked sidewalk
Waiting for the afternoon clouds to turn gold
Got my headphones humming through the quiet talk
Living stories that haven't yet been told.

[Chorus]
Running through yellow lights before the town wakes up
Counting every little promise that we said
Turn the melody up till the speakers break up
Living in the middle of a melody in my head.

[Bridge]
Maybe tomorrow comes with answers
Maybe today is all we need to know.`,
  chords: ['Em7', 'Cadd9', 'G', 'D/F#', 'Am', 'Dsus4'],
  instrument: 'Acoustic Guitar',
  practiceMinutes: 45
};

export const INITIAL_CREATIVE: CreativeProject[] = [
  {
    id: 'c-1',
    title: '35mm Film Series: Autumn Shadows in Suburbia',
    category: 'photography',
    description: 'Documenting light shafts through maple trees, skatepark silhouettes, and foggy school football stands at 6 AM.',
    status: 'in-progress',
    tags: ['Photography', 'Analogue', 'GoldenHour']
  },
  {
    id: 'c-2',
    title: 'Short Sci-Fi Story: "Transmission 9"',
    category: 'writing',
    description: 'A teenager tinkering with an old shortwave radio accidentally catches a delayed audio transmission from an abandoned Mars station.',
    status: 'in-progress',
    tags: ['Fiction', 'SciFi', 'CreativeWriting']
  },
  {
    id: 'c-3',
    title: 'Robotics Team Sticker & Merch Badge',
    category: 'design',
    description: 'Minimalist vector illustration badge featuring a geometric gear and electric circuit bird for the high school robotics club.',
    status: 'idea',
    tags: ['GraphicDesign', 'Vector', 'Club']
  }
];

export const INITIAL_LIFE_SKILLS: LifeSkill[] = [
  {
    id: 'ls-1',
    title: 'The 2-Minute Stress Cleanser',
    category: 'Time Management',
    timeToRead: '2 min',
    summary: 'If a small chore takes less than 120 seconds (putting your sneakers in the closet, clearing your desk, replying to a club coach), do it immediately. Eliminates 70% of mental background friction.',
    steps: [
      { id: 's-1', text: 'Notice when a small task pops in your head', done: true },
      { id: 's-2', text: 'Estimate: does this take under 2 minutes?', done: true },
      { id: 's-3', text: 'Execute right now instead of filing it on a mental to-do list', done: false }
    ]
  },
  {
    id: 'ls-2',
    title: 'Microwave Power Scramble in a Mug',
    category: 'Nutrition & Cooking',
    timeToRead: '3 min',
    summary: 'Whisk 2 eggs in a microwave mug with a splash of milk, cheddar, and salsa. Microwave 60s, stir, microwave 30s. Perfect high-protein brain food before morning exams.',
    steps: [
      { id: 's-4', text: 'Spray a microwave-safe mug with olive oil or butter', done: false },
      { id: 's-5', text: 'Crack 2 eggs, pinch of salt, 1 tbsp milk; whisk with fork', done: false },
      { id: 's-6', text: 'Microwave 60 seconds, stir with fork, add cheese, microwave 30 more seconds', done: false }
    ]
  },
  {
    id: 'ls-3',
    title: 'The Sunday Night Backpack & Tech Audit',
    category: 'Organization',
    timeToRead: '2 min',
    summary: 'Empty your school bag completely every Sunday at 8 PM. Throw out snack wrappers, file loose handouts, and plug in laptop, phone, and calculator chargers.',
    steps: [
      { id: 's-7', text: 'Dump backpack completely onto a flat desk', done: true },
      { id: 's-8', text: 'Sort worksheets into subject folders; recycle old flyers', done: true },
      { id: 's-9', text: 'Restock 2 working pens, pencils, and pack chargers', done: false }
    ]
  },
  {
    id: 'ls-4',
    title: 'Navigating Group Projects Without the Drama',
    category: 'Communication',
    timeToRead: '3 min',
    summary: 'Pick roles on Day 1 (Researcher, Slide Designer, Presenter). Set deadline 24h before teacher due date so nobody is scrambling at 2 AM.',
    steps: [
      { id: 's-10', text: 'Create one shared cloud document immediately in class', done: false },
      { id: 's-11', text: 'Assign specific slides or sections to names with dates', done: false },
      { id: 's-12', text: 'Keep all chat friendly and focused on the shared doc', done: false }
    ]
  },
  {
    id: 'ls-5',
    title: 'The 50/30/20 Teen Money Formula',
    category: 'Money Basics',
    timeToRead: '2 min',
    summary: '50% on real needs (bus pass, school lunch, sports tape), 30% on fun (movies, boba, games), and 20% strictly into your savings stash for big future goals.',
    steps: [
      { id: 's-13', text: 'Track every dollar that comes in for 2 weeks', done: true },
      { id: 's-14', text: 'Immediately move 20% into your savings jar/account', done: false },
      { id: 's-15', text: 'Spend the remaining fun budget with zero guilt', done: false }
    ]
  }
];

export const INITIAL_FLASHCARDS = [
  {
    subject: 'Biology',
    cards: [
      { q: 'What is the primary role of the mitochondria?', a: 'Cellular respiration: converts glucose and oxygen into ATP (adenosine triphosphate) energy.' },
      { q: 'Where do light-dependent reactions of photosynthesis take place?', a: 'Inside the thylakoid membranes within the chloroplast.' },
      { q: 'What occurs during the Anaphase stage of mitosis?', a: 'Sister chromatids are pulled apart by spindle fibers toward opposite poles of the cell.' },
      { q: 'What is the role of DNA Polymerase during replication?', a: 'Synthesizes new DNA strands by matching complementary nucleotides (A-T, C-G) to the template.' }
    ]
  },
  {
    subject: 'Spanish',
    cards: [
      { q: 'How do you say "I realized that" in Spanish?', a: 'Me di cuenta de que...' },
      { q: 'Difference between "por" and "para"?', a: '"Por" is for cause, duration, exchange, or means. "Para" is for destination, recipient, purpose, or deadline.' },
      { q: 'Conjugate "tener" in the Preterite (yo)?', a: 'Tuve (irregular stem: tuv-)' }
    ]
  },
  {
    subject: 'History',
    cards: [
      { q: 'What was the significance of the Peace of Westphalia (1648)?', a: 'Ended the Thirty Years\' War and established the principle of national sovereignty and modern state borders.' },
      { q: 'What was the main purpose of the Edict of Nantes (1598)?', a: 'Granted substantial religious rights and toleration to French Calvinist Protestants (Huguenots).' }
    ]
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', title: 'First Spark', description: 'Completed your first study or homework priority', icon: 'zap', unlocked: true, unlockedAt: 'Oct 24' },
  { id: 'ach-2', title: 'Deep Diver', description: 'Completed a full 25-minute Pomodoro focus session', icon: 'hourglass', unlocked: true, unlockedAt: 'Oct 23' },
  { id: 'ach-3', title: 'Week Architect', description: 'Scheduled events across 5 days on your Planner', icon: 'calendar', unlocked: true, unlockedAt: 'Oct 25' },
  { id: 'ach-4', title: 'Creative Voice', description: 'Drafted song lyrics, a sketch, or story concept', icon: 'music', unlocked: true, unlockedAt: 'Oct 24' },
  { id: 'ach-5', title: 'Master of Steps', description: 'Finished 3 milestones under a personal goal', icon: 'target', unlocked: false },
  { id: 'ach-6', title: 'Money Mindful', description: 'Logged first 5 allowance and budget transactions', icon: 'wallet', unlocked: true, unlockedAt: 'Oct 24' },
  { id: 'ach-7', title: 'Flashcard Champion', description: 'Recalled 10 flashcards in active study mode', icon: 'brain', unlocked: false }
];
