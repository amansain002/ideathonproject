export type TierName =
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Grandmaster';

export interface Tier {
  name: TierName;
  division: string; // "I", "II", "III"
  color: string; // hex
}

export type TabId =
  | 'home'
  | 'learn'
  | 'timetable'
  | 'progress'
  | 'profile'
  | 'tools'
  | 'friends';

export type ToolPage =
  | 'wallet'
  | 'workout'
  | 'quiz'
  | 'lockin'
  | 'scanner-physique'
  | 'scanner-bank'
  | 'scanner-desk';

export type CompanionId = 'sylphie' | 'aiko' | 'kaelen' | 'ignis' | 'nova';
export type PersonalityTone = 'supportive' | 'hype' | 'strict' | 'calm' | 'savage';

export interface CompanionConfig {
  id: CompanionId;
  customName: string;
  glowColor: string;
  personality: PersonalityTone;
}

// ---- Coach reaction system ----

export type CoachIntensity = 'gentle' | 'balanced' | 'tough' | 'savage';
export type CoachLanguage = 'en' | 'hi' | 'hinglish';

export interface CoachSettings {
  intensity: CoachIntensity;
  praiseOnly: boolean;
  voiceEnabled: boolean;
  voiceVolume: number; // 0-1
  voiceURI: string | null;
  quietHoursStart: string | null; // '22:00'
  quietHoursEnd: string | null; // '07:00'
  reminders: boolean;
  language: CoachLanguage;
  strugglingUntil: number | null; // timestamp until which harsh messages are muted
}

export interface CoachMemory {
  missesInRow: number;
  bestStreak: number;
  weakDay: string | null; // weekday where user most often misses
  favoriteTask: string | null;
  totalMisses: number;
  totalCompletions: number;
  lastTriggerKey: string | null;
}

export interface CompanionPreset {
  id: CompanionId;
  defaultName: string;
  archetype: string;
  gender: 'Female' | 'Male' | 'Creature';
  defaultGlow: string;
  blurb: string;
}

export interface Quest {
  id: string;
  label: string;
  icon: string;
  xp: number;
  coins: number;
  pillar: 'mind' | 'wealth' | 'body';
  done: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  category: 'Food/Canteen' | 'Travel' | 'Tech/Books' | 'Impulse/Fun';
  note: string;
  time: string;
}

export interface SetLog {
  id: string;
  exercise: string;
  weight: number;
  reps: number;
  oneRm: number;
  muscle: string;
  rpGain: number;
}

export interface Subject {
  name: string;
  tier: Tier;
  progress: number; // 0-100 toward next tier
  icon: string;
}

export interface MuscleRank {
  group: string;
  tier: Tier;
  progress: number;
}

export interface ScannerResult {
  score: number;
  lines: string[];
}

export type ScannerType = 'physique' | 'bank' | 'desk';

// ---- mock initial data ----

export const initialQuests: Quest[] = [
  { id: 'q1', label: 'Solve 2 DSA problems', icon: 'Code2', xp: 50, coins: 10, pillar: 'mind', done: false },
  { id: 'q2', label: 'Study Microprocessors 45m', icon: 'Cpu', xp: 40, coins: 8, pillar: 'mind', done: false },
  { id: 'q3', label: 'Log ₹0 canteen impulse spend', icon: 'Wallet', xp: 30, coins: 12, pillar: 'wealth', done: false },
  { id: 'q4', label: 'Track daily budget', icon: 'PiggyBank', xp: 25, coins: 6, pillar: 'wealth', done: false },
  { id: 'q5', label: 'Bench Press 4x8', icon: 'Dumbbell', xp: 45, coins: 10, pillar: 'body', done: false },
  { id: 'q6', label: '50 Push-ups', icon: 'Flame', xp: 35, coins: 8, pillar: 'body', done: false },
];

export const initialExpenses: Expense[] = [
  { id: 'e1', amount: 120, category: 'Food/Canteen', note: 'Canteen lunch', time: '10:24' },
  { id: 'e2', amount: 45, category: 'Travel', note: 'Metro card', time: '08:40' },
  { id: 'e3', amount: 350, category: 'Tech/Books', note: 'DSA workbook', time: 'Yesterday' },
];

export const initialSubjects: Subject[] = [
  { name: 'Python & AI', tier: { name: 'Diamond', division: 'I', color: '#6fb6ff' }, progress: 72, icon: 'BrainCircuit' },
  { name: 'Data Structures', tier: { name: 'Platinum', division: 'III', color: '#54e6c4' }, progress: 38, icon: 'Binary' },
  { name: 'Microcontrollers & IoT', tier: { name: 'Gold', division: 'II', color: '#f5b942' }, progress: 54, icon: 'Cpu' },
  { name: 'DBMS', tier: { name: 'Platinum', division: 'I', color: '#54e6c4' }, progress: 19, icon: 'Database' },
  { name: 'Operating Systems', tier: { name: 'Gold', division: 'III', color: '#f5b942' }, progress: 64, icon: 'Terminal' },
];

export const initialMuscleRanks: MuscleRank[] = [
  { group: 'Chest', tier: { name: 'Gold', division: 'I', color: '#f5b942' }, progress: 80 },
  { group: 'Back', tier: { name: 'Platinum', division: 'II', color: '#54e6c4' }, progress: 45 },
  { group: 'Legs', tier: { name: 'Silver', division: 'III', color: '#b8c4d4' }, progress: 30 },
  { group: 'Core', tier: { name: 'Gold', division: 'III', color: '#f5b942' }, progress: 60 },
  { group: 'Arms', tier: { name: 'Platinum', division: 'I', color: '#54e6c4' }, progress: 55 },
];

export const initialSetLogs: SetLog[] = [
  { id: 's1', exercise: 'Bench Press', weight: 70, reps: 8, oneRm: 87, muscle: 'Chest', rpGain: 18 },
  { id: 's2', exercise: 'Squat', weight: 90, reps: 6, oneRm: 106, muscle: 'Legs', rpGain: 12 },
];

export const blockedApps = [
  { name: 'Instagram', icon: 'Camera', color: '#d36bff' },
  { name: 'YouTube', icon: 'Youtube', color: '#ef4444' },
  { name: 'Gaming', icon: 'Gamepad2', color: '#8b5cf6' },
];

export const leaderboard = [
  { rank: 1, name: 'Aarav K.', level: 16, xp: 5210, tier: 'Diamond II', you: false },
  { rank: 2, name: 'Meera S.', level: 15, xp: 4780, tier: 'Diamond IV', you: false },
  { rank: 3, name: 'You', level: 14, xp: 3450, tier: 'Diamond II', you: true },
  { rank: 4, name: 'Rohan P.', level: 13, xp: 3120, tier: 'Platinum I', you: false },
  { rank: 5, name: 'Ishita R.', level: 12, xp: 2890, tier: 'Platinum III', you: false },
];

export const quizQuestions = [
  {
    q: 'Which data structure gives O(1) average lookup?',
    options: ['Array', 'Hash Map', 'Linked List', 'Binary Tree'],
    answer: 1,
  },
  {
    q: 'Big-O of binary search on a sorted array?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    answer: 1,
  },
];

export const bossTracker = [
  { title: 'DBMS Mid-Sem', date: 'Nov 8', progress: 60, days: 13 },
  { title: 'Microprocessors End-Sem', date: 'Nov 22', progress: 32, days: 27 },
  { title: 'DSA Assignment 4', date: 'Oct 30', progress: 85, days: 4 },
];

// AI scanner mock results
export function runScanner(type: ScannerType): ScannerResult {
  if (type === 'physique') {
    return {
      score: 78,
      lines: [
        'Shoulders slightly rounded — add rear-delt fly volume.',
        'Right side lat dominance detected. Balance with unilateral rows.',
        'Core symmetry: solid. Keep bracing on heavy compounds.',
        'Posture lean forward on squat — film form at 70% 1RM.',
      ],
    };
  }
  if (type === 'bank') {
    return {
      score: 64,
      lines: [
        '₹1,180 on canteen snacks this week. Brutal. That is 28% of allowance.',
        '3 impulse gaming purchases. Your wallet is crying.',
        'Travel spending is lean — good discipline there.',
        'Forecast: ₹850 savable if you skip 4 canteen runs. Lock in.',
      ],
    };
  }
  return {
    score: 71,
    lines: [
      'Phone visible on desk — focus threat level: HIGH.',
      'Lighting below 300 lux. Eye strain risk on long sessions.',
      'Syllabus coverage 62% — DBMS lagging behind schedule.',
      'Add a 25-min Pomodoro block before the next exam.',
    ],
  };
}

// ---- Companion system ----

export const companionPresets: CompanionPreset[] = [
  {
    id: 'sylphie',
    defaultName: 'Sylphie',
    archetype: 'Wind Elf Girl',
    gender: 'Female',
    defaultGlow: '#10B981',
    blurb: 'A gentle flying elf with fluttering emerald wings and drifting leaf particles.',
  },
  {
    id: 'aiko',
    defaultName: 'Aiko',
    archetype: 'Cyber-Anime Girl',
    gender: 'Female',
    defaultGlow: '#8B5CF6',
    blurb: 'Neon twin-tails and pure hype energy. Drops Japanese/English anime voice lines.',
  },
  {
    id: 'kaelen',
    defaultName: 'Kaelen',
    archetype: 'Shadow Warrior',
    gender: 'Male',
    defaultGlow: '#38BDF8',
    blurb: 'A stoic Solo-Leveling-style warrior wrapped in blue lightning aura.',
  },
  {
    id: 'ignis',
    defaultName: 'Ignis',
    archetype: 'Astral Dragon',
    gender: 'Creature',
    defaultGlow: '#EF4444',
    blurb: 'A flying astral dragon wreathed in crimson flame particles.',
  },
  {
    id: 'nova',
    defaultName: 'Nova',
    archetype: 'Radiant Fairy',
    gender: 'Female',
    defaultGlow: '#F59E0B',
    blurb: 'A radiant golden fairy trailing shimmering stardust.',
  },
];

export const defaultCompanion: CompanionConfig = {
  id: 'sylphie',
  customName: 'Sylphie',
  glowColor: '#10B981',
  personality: 'supportive',
};

export const defaultCoachSettings: CoachSettings = {
  intensity: 'balanced',
  praiseOnly: false,
  voiceEnabled: true,
  voiceVolume: 0.8,
  voiceURI: null,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  reminders: true,
  language: 'en',
  strugglingUntil: null,
};

export const defaultCoachMemory: CoachMemory = {
  missesInRow: 0,
  bestStreak: 0,
  weakDay: null,
  favoriteTask: null,
  totalMisses: 0,
  totalCompletions: 0,
  lastTriggerKey: null,
};

export const personalityLabels: Record<PersonalityTone, { label: string; desc: string }> = {
  supportive: { label: 'Friendly', desc: 'Gentle, encouraging' },
  hype: { label: 'Funny Buddy', desc: 'High-energy hype lines' },
  strict: { label: 'Strict Mentor', desc: 'No excuses, disciplined' },
  calm: { label: 'Calm Guide', desc: 'Soft, steady, patient' },
  savage: { label: 'Savage Roast', desc: 'Playful roasts (opt-in)' },
};

export const intensityLabels: Record<CoachIntensity, { label: string; desc: string }> = {
  gentle: { label: 'Gentle', desc: 'Soft support only' },
  balanced: { label: 'Balanced', desc: 'Mix of hype and honesty' },
  tough: { label: 'Tough Love', desc: 'Firm, no-nonsense' },
  savage: { label: 'Savage Roast', desc: 'Playful roasts (opt-in)' },
};

// Level-up dialogue lines per personality
export const levelUpLines: Record<PersonalityTone, string[]> = {
  supportive: [
    'You did it! Every quest you finish is a step toward the legend you are becoming.',
    'Look at that XP fly! I am so proud of you — keep this streak alive!',
    'Another level climbed. Rest a moment, then let us chase the next one together.',
  ],
  hype: [
    'SUGOI! You absolutely CLUTCHED that level-up! Nobody can keep up with you!',
    'LEVEL UP, SENPAI! That grind is unmatched — let us keep the streak BURNING!',
    'YOSHA! The rank speaks for itself! Time to flex on the whole campus!',
  ],
  strict: [
    'Good. But one level is not a victory — it is a minimum. Back to the quest board.',
    'Acceptable. Do not let it inflate you. Discipline compounds; laziness compounds faster.',
    'Level logged. Now prove it was not luck. Next quest. No excuses.',
  ],
  calm: [
    'A new level, gently earned. Take a breath — the next step will wait for you.',
    'You climbed again. No rush, no pressure. Just steady progress, one breath at a time.',
    'Level up. Notice how far consistency has carried you. Rest, then continue.',
  ],
  savage: [
    'Level up. The rank finally caught up to your potential — try not to waste it.',
    'New level. The leaderboard stopped laughing. Keep it that way.',
    'Level up. Somewhere, your procrastination habit is filing for unemployment.',
  ],
};

export const tipLines: Record<PersonalityTone, string[]> = {
  supportive: [
    'Tiny steps count. Even 10 minutes of study moves the Mind ring.',
    'Remember to hydrate — your Body ring loves water as much as macros.',
    'Skipping the canteen today? That is ₹80 straight into your savings streak.',
  ],
  hype: [
    'LOCK IN, senpai! The Diamond rank is RIGHT there — do not drop it!',
    'Your streak is fire! Do not let 18 days burn out over one lazy morning!',
    'One more rep. ONE MORE. That is how Grandmaster Arms get forged!',
  ],
  strict: [
    'Instagram is still locked. Finish a quest before you even think about it.',
    'Your Wealth ring is at risk. Skip the snack. Log the budget. Move.',
    'Complacency is the enemy of rank. Open SkillQuest and study now.',
  ],
  calm: [
    'A small step today is enough. There is no rush — just a gentle next move.',
    'Breathe. The plan will wait for you. One task, done calmly, is plenty.',
    'Hydrate and pause. Steady rhythm beats frantic effort every time.',
  ],
  savage: [
    'The to-do list is side-eyeing you. Maybe give it some attention today.',
    'Your streak is one skipped task from writing its will. Just saying.',
    'The Diamond rank does not wait for "later." Clock\'s ticking.',
  ],
};

export function pickLine(lines: string[]): string {
  return lines[Math.floor(Math.random() * lines.length)];
}

// ---- Onboarding ----

export interface OnboardingQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: { label: string; desc?: string; icon: string }[];
}

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: 'goals',
    question: "What's your main goal right now?",
    subtitle: 'Pick the one that matters most today.',
    options: [
      { label: 'Ace my academics', desc: 'Master subjects & rank up', icon: 'GraduationCap' },
      { label: 'Get financially fit', desc: 'Budget, save & track UPI', icon: 'Wallet' },
      { label: 'Build my physique', desc: 'Climb the gym ranks', icon: 'Dumbbell' },
      { label: 'All of the above', desc: 'Full self-improvement', icon: 'Sparkles' },
    ],
  },
  {
    id: 'habits',
    question: 'How consistent are your current habits?',
    subtitle: 'Be honest — your plan adapts to this.',
    options: [
      { label: 'Just getting started', desc: 'Need a system', icon: 'Sprout' },
      { label: 'Inconsistent', desc: 'Some days on, many off', icon: 'Shuffle' },
      { label: 'Fairly consistent', desc: 'Hold a routine most weeks', icon: 'CalendarCheck' },
      { label: 'Highly disciplined', desc: 'Rarely miss a day', icon: 'Shield' },
    ],
  },
  {
    id: 'improve',
    question: 'Which area needs the most work?',
    subtitle: 'Your AI coach will focus here first.',
    options: [
      { label: 'Focus & discipline', desc: 'Beat distractions', icon: 'Lock' },
      { label: 'Spending control', desc: 'Stop impulse buys', icon: 'PiggyBank' },
      { label: 'Study consistency', desc: 'Stick to syllabus', icon: 'BookOpen' },
      { label: 'Workout volume', desc: 'Show up to the gym', icon: 'Flame' },
    ],
  },
  {
    id: 'intensity',
    question: 'How intense should your plan be?',
    subtitle: 'You can dial this up later.',
    options: [
      { label: 'Gentle start', desc: '2-3 tasks / day', icon: 'Feather' },
      { label: 'Balanced', desc: '4-5 tasks / day', icon: 'Scale' },
      { label: 'Hard mode', desc: '6+ tasks / day', icon: 'Swords' },
    ],
  },
];

// ---- User types & skills ----

export type UserType = 'school' | 'college' | 'office' | 'other';

export interface UserTypeOption {
  id: UserType;
  label: string;
  desc: string;
  icon: string;
}

export const userTypeOptions: UserTypeOption[] = [
  { id: 'school', label: 'School Student', desc: 'Classwork & exams', icon: 'School' },
  { id: 'college', label: 'College Student', desc: 'Semesters & placements', icon: 'GraduationCap' },
  { id: 'office', label: 'Office Worker', desc: 'Career & upskilling', icon: 'Briefcase' },
  { id: 'other', label: 'Other', desc: 'Self-improvement', icon: 'Compass' },
];

export const skillSuggestions: Record<UserType, string[]> = {
  school: ['Math', 'Science', 'English', 'Handwriting', 'Public Speaking'],
  college: ['Coding', 'Data Analysis', 'Communication', 'Time Management', 'Exam Prep'],
  office: ['Excel', 'Leadership', 'Writing Emails', 'Presentation', 'Productivity'],
  other: ['Coding', 'Writing', 'Fitness', 'Productivity', 'Communication'],
};

export const skillColors: Record<string, string> = {
  Math: '#8B5CF6',
  Science: '#10B981',
  English: '#38BDF8',
  Handwriting: '#F59E0B',
  'Public Speaking': '#EC4899',
  Coding: '#6fb6ff',
  'Data Analysis': '#54e6c4',
  Communication: '#f5b942',
  'Time Management': '#d36bff',
  'Exam Prep': '#ef4444',
  Excel: '#10B981',
  Leadership: '#8B5CF6',
  'Writing Emails': '#38BDF8',
  Presentation: '#F59E0B',
  Productivity: '#6fb6ff',
  Writing: '#EC4899',
  Fitness: '#ef4444',
};

export function skillColor(name: string): string {
  if (skillColors[name]) return skillColors[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const colors = ['#8B5CF6', '#10B981', '#38BDF8', '#F59E0B', '#EC4899', '#6fb6ff', '#54e6c4', '#d36bff', '#ef4444'];
  return colors[Math.abs(hash) % colors.length];
}

// ---- Tasks ----

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Task {
  id: string;
  title: string;
  skill: string;
  day: string;
  time: string;
  duration: number;
  difficulty: Difficulty;
  done: boolean;
  suggested?: boolean;
}

export const difficultyXp: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

export const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function todayShort(): string {
  return daysOfWeek[(new Date().getDay() + 6) % 7];
}

// ---- Timetable ----

export interface TimetableEntry {
  id: string;
  title: string;
  skill: string;
  day: string;
  time: string;
  duration: number;
}

// ---- Learning resources ----

export type ResourceType = 'video' | 'article' | 'course' | 'exercise';

export interface Resource {
  id: string;
  title: string;
  skill: string;
  type: ResourceType;
  source: string;
  url: string;
  time: string;
  thumbnail: string;
}

const resourceTemplates: { type: ResourceType; title: (s: string) => string; source: string; url: (s: string) => string; time: string }[] = [
  { type: 'video', title: (s) => `${s} Crash Course — Beginner to Pro`, source: 'YouTube', url: (s) => `https://www.youtube.com/results?search_query=${encodeURIComponent(s + ' tutorial')}`, time: '45 min' },
  { type: 'video', title: (s) => `${s} Masterclass — Full Walkthrough`, source: 'YouTube', url: (s) => `https://www.youtube.com/results?search_query=${encodeURIComponent(s + ' masterclass')}`, time: '1 hr' },
  { type: 'article', title: (s) => `${s}: A Complete Guide`, source: 'Medium', url: (s) => `https://medium.com/search?q=${encodeURIComponent(s)}`, time: '15 min' },
  { type: 'article', title: (s) => `The Ultimate ${s} Cheat Sheet`, source: 'Notion', url: (s) => `https://www.notion.so/search?q=${encodeURIComponent(s)}`, time: '10 min' },
  { type: 'course', title: (s) => `${s} Fundamentals — Free Course`, source: 'Coursera', url: (s) => `https://www.coursera.org/search?query=${encodeURIComponent(s)}`, time: '6 hrs' },
  { type: 'course', title: (s) => `${s} Specialization`, source: 'freeCodeCamp', url: (s) => `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(s)}`, time: '12 hrs' },
  { type: 'exercise', title: (s) => `${s} Practice Problems`, source: 'GeeksforGeeks', url: (s) => `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(s)}`, time: '30 min' },
  { type: 'exercise', title: (s) => `${s} Daily Challenges`, source: 'LeetCode', url: (s) => `https://leetcode.com/problemset/?search=${encodeURIComponent(s)}`, time: '20 min' },
];

let resourceId = 0;
export function generateResources(skills: string[], _level: number, _userType: UserType): Resource[] {
  const out: Resource[] = [];
  for (const skill of skills.slice(0, 6)) {
    const color = skillColor(skill);
    const count = 2 + Math.floor(Math.random() * 2);
    const shuffled = [...resourceTemplates].sort(() => Math.random() - 0.5).slice(0, count);
    for (const t of shuffled) {
      out.push({
        id: `res-${resourceId++}`,
        title: t.title(skill),
        skill,
        type: t.type,
        source: t.source,
        url: t.url(skill),
        time: t.time,
        thumbnail: color,
      });
    }
  }
  return out;
}

// ---- Auto-plan helpers ----

export function autoPlanTasks(userType: UserType, skills: string[]): Task[] {
  const slots: Record<UserType, { day: string; time: string }[]> = {
    school: [
      { day: 'Mon', time: '17:00' }, { day: 'Tue', time: '17:00' }, { day: 'Wed', time: '17:00' },
      { day: 'Thu', time: '17:00' }, { day: 'Fri', time: '17:00' }, { day: 'Sat', time: '10:00' }, { day: 'Sun', time: '10:00' },
    ],
    college: [
      { day: 'Mon', time: '19:00' }, { day: 'Tue', time: '19:00' }, { day: 'Wed', time: '19:00' },
      { day: 'Thu', time: '19:00' }, { day: 'Fri', time: '19:00' }, { day: 'Sat', time: '11:00' }, { day: 'Sun', time: '11:00' },
    ],
    office: [
      { day: 'Mon', time: '07:00' }, { day: 'Tue', time: '12:30' }, { day: 'Wed', time: '07:00' },
      { day: 'Thu', time: '12:30' }, { day: 'Fri', time: '07:00' }, { day: 'Sat', time: '21:00' }, { day: 'Sun', time: '21:00' },
    ],
    other: [
      { day: 'Mon', time: '18:00' }, { day: 'Wed', time: '18:00' }, { day: 'Fri', time: '18:00' },
      { day: 'Sat', time: '14:00' }, { day: 'Sun', time: '14:00' },
    ],
  };
  const times = slots[userType];
  const tasks: Task[] = [];
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  skills.slice(0, times.length).forEach((skill, i) => {
    tasks.push({
      id: `auto-${Date.now()}-${i}`,
      title: `Study ${skill}`,
      skill,
      day: times[i].day,
      time: times[i].time,
      duration: 45,
      difficulty: difficulties[i % 3],
      done: false,
      suggested: true,
    });
  });
  return tasks;
}
