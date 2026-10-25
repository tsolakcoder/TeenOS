import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Natural Language Day/Week Planner API
app.post('/api/ai/plan', async (req, res) => {
  const { input } = req.body;
  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Input prompt is required' });
  }

  if (!aiClient) {
    // Graceful offline heuristic fallback
    const lower = input.toLowerCase();
    const mockTasks = [];
    if (lower.includes('history') || lower.includes('test') || lower.includes('exam')) {
      mockTasks.push(
        { title: 'Study key terms & review flashcards', subject: 'History', durationMin: 30, priority: 'high', dueTime: '4:00 PM', notes: 'Focus on primary sources' },
        { title: 'Create concept summary mindmap', subject: 'History', durationMin: 20, priority: 'medium', dueTime: '6:30 PM', notes: 'Condense notes to 1 sheet' }
      );
    }
    if (lower.includes('football') || lower.includes('soccer') || lower.includes('practice') || lower.includes('sport')) {
      mockTasks.push(
        { title: 'Pack sports gear, cleats & water bottle', subject: 'Sports', durationMin: 15, priority: 'high', dueTime: '5:00 PM', notes: 'Prep early to avoid rushing' }
      );
    }
    if (mockTasks.length === 0) {
      mockTasks.push(
        { title: `Focus Sprint: ${input.slice(0, 32)}`, subject: 'School', durationMin: 25, priority: 'medium', dueTime: 'Today', notes: 'Break into 25-minute pomodoro' }
      );
    }

    return res.json({
      summary: `I've organized a balanced schedule so you can nail your goals without burnout!`,
      suggestedTasks: mockTasks,
      suggestedEvents: lower.includes('practice') ? [{ title: 'Team Practice', time: '07:00 PM', date: '2026-10-25', category: 'sports' }] : []
    });
  }

  try {
    const prompt = `You are TeenOS AI, a supportive, smart, friendly companion for teenagers.
The student typed: "${input}".
Understand their schedule and requirements, then suggest an organized, realistic plan for today/this week.
Break down study times into healthy 20-30 min intervals, include prep time, and keep it encouraging.
Respond ONLY with valid JSON with this schema:
{
  "summary": "Short encouraging 1-sentence note for the student",
  "suggestedTasks": [
    {
      "title": "Clear actionable task name",
      "subject": "e.g. History, Math, Biology, Sports, Music, General",
      "durationMin": 25,
      "priority": "high" | "medium" | "low",
      "dueTime": "e.g. 4:00 PM or Today",
      "notes": "short 1-line study tip"
    }
  ],
  "suggestedEvents": [
    {
      "title": "Event name",
      "time": "e.g. 07:00 PM",
      "date": "2026-10-25",
      "category": "school" | "sports" | "music" | "social" | "personal" | "study"
    }
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    return res.json(parsed);
  } catch (err: any) {
    console.warn('Gemini plan temporary error, falling back to heuristic planner:', err?.message || err);
    
    // Seamless intelligent heuristic breakdown
    const lower = input.toLowerCase();
    const suggestedTasks = [];
    if (lower.includes('history') || lower.includes('test') || lower.includes('exam')) {
      suggestedTasks.push(
        { title: 'Study History Key Concepts & Terms', subject: 'History', durationMin: 30, priority: 'high', dueTime: '4:00 PM', notes: 'Active recall & flashcards' },
        { title: 'Review History Mindmap & Timeline', subject: 'History', durationMin: 20, priority: 'medium', dueTime: '6:00 PM', notes: 'Consolidate key dates' }
      );
    }
    if (lower.includes('football') || lower.includes('soccer') || lower.includes('practice') || lower.includes('sport')) {
      suggestedTasks.push(
        { title: 'Prepare Sports Gear Bag & Water Bottle', subject: 'Sports', durationMin: 15, priority: 'high', dueTime: '6:30 PM', notes: 'Hydrate & pack cleats' }
      );
    }
    if (suggestedTasks.length === 0) {
      suggestedTasks.push(
        { title: `Focus Sprint: ${input.slice(0, 30)}`, subject: 'School', durationMin: 25, priority: 'medium', dueTime: 'Today', notes: '25m pomodoro session' }
      );
    }

    return res.json({
      summary: `I've planned your day with smart time blocks so you can crush your goals without stress!`,
      suggestedTasks,
      suggestedEvents: lower.includes('practice') ? [{ title: 'Team Practice', time: '07:00 PM', date: '2026-10-25', category: 'sports' }] : []
    });
  }
});

// 2. Homework Concept Explainer & Step-by-Step Socratic Hints
app.post('/api/ai/explain', async (req, res) => {
  const { taskTitle, subject, notes } = req.body;
  if (!taskTitle) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  if (!aiClient) {
    return res.json({
      conceptOverview: `Key concepts in ${subject || 'this topic'}: Focus on foundational definitions, understand the core relationship between variables, and avoid rushing.`,
      steps: [
        'Break down the prompt into what is known and what needs to be solved.',
        'Write out the relevant formula, theorem, or timeline.',
        'Work through one sub-problem or paragraph at a time.'
      ],
      guidingQuestion: 'What is the very first step or rule you learned in class that connects to this?',
      encouragement: "You've got this! Understanding the 'why' makes exams 10x easier."
    });
  }

  try {
    const prompt = `You are TeenOS AI, a caring, insightful tutor for a teenager.
The student has homework: "${taskTitle}" in subject "${subject || 'General'}".
Extra context: "${notes || ''}".

IMPORTANT RULES FOR TEEN SAFETY & LEARNING:
1. Encourage learning and independence. DO NOT just write the entire essay or solve all math problems for them.
2. Provide a clear, intuitive explanation of the core concept.
3. Break the assignment into 3 or 4 actionable steps.
4. Provide a thought-provoking guiding question to help them reach the answer themselves.
5. End with genuine, warm teen-appropriate encouragement.

Respond ONLY with valid JSON:
{
  "conceptOverview": "2-3 sentence clear intuitive explanation",
  "steps": ["Step 1...", "Step 2...", "Step 3..."],
  "guidingQuestion": "A question that sparks their own thinking",
  "encouragement": "Supportive short note"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    return res.json(parsed);
  } catch (err: any) {
    console.warn('Gemini explain temporary error, falling back:', err?.message || err);
    return res.json({
      conceptOverview: `Key concepts in ${subject || 'this assignment'}: Focus on foundational principles, breakdown the problem, and look for known relationships.`,
      steps: [
        'Identify what is given in the prompt vs. what needs to be solved.',
        'Recall the core formula or rule connected to this topic.',
        'Work through one step at a time without rushing.'
      ],
      guidingQuestion: 'What is the very first step or definition that applies here?',
      encouragement: "You're capable of working this out step-by-step!"
    });
  }
});

// 3. TeenOS Copilot Chat
app.post('/api/ai/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!aiClient) {
    return res.json({
      reply: `Hey! I'm here to help you conquer high school life—from breaking down tough assignments to brainstorming creative beats and balancing your week. What specific project should we tackle next?`
    });
  }

  try {
    const conversation = (history || []).map((h: any) => `${h.sender === 'user' ? 'Student' : 'TeenOS'}: ${h.text}`).join('\n');
    const prompt = `You are TeenOS AI, an all-in-one personal operating system assistant designed specifically for teenagers.
You help with:
- Organizing schoolwork and study schedules
- Explaining concepts (Socratic style, helping them learn instead of cheating)
- Brainstorming creative projects (music lyrics, video concepts, drawing ideas)
- Simple money habits and healthy goal milestones
- Friendly, warm, age-appropriate, uplifting tone (casual but not cringe, respectful, zero condescension).

Previous conversation:
${conversation}

Student: ${message}

TeenOS AI:`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ reply: response.text || "I'm here for you! Let's get things done." });
  } catch (err: any) {
    console.warn('Gemini chat temporary error, falling back:', err?.message || err);
    return res.json({
      reply: `I'm with you! Let's take this one step at a time. What would you like to plan or review first?`
    });
  }
});

// Setup Vite in middleware mode
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TeenOS running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
