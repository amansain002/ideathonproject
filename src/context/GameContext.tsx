import { createContext, useCallback, useContext, useMemo, useState, useEffect, type ReactNode } from 'react';
import {
  initialQuests,
  initialExpenses,
  initialSubjects,
  initialMuscleRanks,
  initialSetLogs,
  defaultCompanion,
  companionPresets,
  autoPlanTasks,
  generateResources,
  type Quest,
  type Expense,
  type Subject,
  type MuscleRank,
  type SetLog,
  type CompanionConfig,
  type CompanionId,
  type PersonalityTone,
  type UserType,
  type Task,
  type TimetableEntry,
  type Resource,
  type Difficulty,
} from '@/types';

interface FloatReward {
  id: number;
  xp: number;
  coins: number;
}

interface GameState {
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  streak: number;
  rankName: string;
  focusMode: boolean;
  quests: Quest[];
  expenses: Expense[];
  subjects: Subject[];
  muscleRanks: MuscleRank[];
  setLogs: SetLog[];
  floats: FloatReward[];
  funWalletUnlocked: boolean;
  screenTimeMinutes: number;
  companion: CompanionConfig;
  levelUpData: { open: boolean; newLevel: number; rankName: string } | null;
  userType: UserType;
  skills: string[];
  tasks: Task[];
  timetable: TimetableEntry[];
  resources: Resource[];
  completedResources: string[];
  setUserType: (t: UserType) => void;
  setSkills: (s: string[]) => void;
  addSkill: (s: string) => void;
  removeSkill: (s: string) => void;
  addTask: (t: Omit<Task, 'id' | 'done'>) => void;
  updateTask: (id: string, t: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTasks: (t: Task[]) => void;
  toggleTask: (id: string) => void;
  autoPlanWeek: () => void;
  addTimetableEntry: (e: Omit<TimetableEntry, 'id'>) => void;
  deleteTimetableEntry: (id: string) => void;
  refreshResources: () => void;
  completeResource: (id: string) => void;
  addXp: (xp: number, coins?: number) => void;
  toggleQuest: (id: string) => void;
  addExpense: (e: Omit<Expense, 'id' | 'time'>) => void;
  logSet: (s: Omit<SetLog, 'id' | 'oneRm' | 'rpGain'>) => void;
  toggleFocus: () => void;
  unlockFunWallet: () => void;
  addScreenTime: (mins: number) => void;
  clearFloat: (id: number) => void;
  bumpSubject: (name: string, amount: number) => void;
  setCompanion: (c: CompanionConfig) => void;
  setCompanionPreset: (id: CompanionId) => void;
  triggerLevelUp: () => void;
  closeLevelUp: () => void;
}

const Ctx = createContext<GameState | null>(null);

export function useGame() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

let floatId = 0;

const LS_KEY = 'skillquest-state-v1';

interface PersistedState {
  userType: UserType;
  skills: string[];
  tasks: Task[];
  timetable: TimetableEntry[];
  completedResources: string[];
}

function loadPersisted(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<PersistedState>;
  } catch {
    return {};
  }
}

function savePersisted(s: PersistedState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState(14);
  const [xp, setXp] = useState(3950);
  const [xpToNext] = useState(4000);
  const [coins, setCoins] = useState(420);
  const [streak] = useState(18);
  const [focusMode, setFocusMode] = useState(false);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [muscleRanks, setMuscleRanks] = useState<MuscleRank[]>(initialMuscleRanks);
  const [setLogs, setSetLogs] = useState<SetLog[]>(initialSetLogs);
  const [floats, setFloats] = useState<FloatReward[]>([]);
  const [funWalletUnlocked, setFunWalletUnlocked] = useState(false);
  const [screenTimeMinutes, setScreenTimeMinutes] = useState(0);
  const [companion, setCompanionState] = useState<CompanionConfig>(defaultCompanion);
  const [levelUpData, setLevelUpData] = useState<{ open: boolean; newLevel: number; rankName: string } | null>(null);

  const persisted = loadPersisted();
  const [userType, setUserType] = useState<UserType>(persisted.userType ?? 'college');
  const [skills, setSkills] = useState<string[]>(persisted.skills ?? ['Coding', 'Data Analysis']);
  const [tasks, setTasks] = useState<Task[]>(persisted.tasks ?? []);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(persisted.timetable ?? []);
  const [completedResources, setCompletedResources] = useState<string[]>(persisted.completedResources ?? []);
  const [resources, setResources] = useState<Resource[]>([]);

  const doLevelUp = useCallback(() => {
    setLevel((l) => {
      const newLevel = l + 1;
      setLevelUpData({ open: true, newLevel, rankName: 'Diamond II' });
      return newLevel;
    });
  }, []);

  function addXp(amount: number, coinAmount = 0) {
    setXp((prev) => {
      const next = prev + amount;
      if (next >= xpToNext) {
        doLevelUp();
        return next - xpToNext;
      }
      return next;
    });
    if (coinAmount) setCoins((c) => c + coinAmount);
    const id = ++floatId;
    setFloats((f) => [...f, { id, xp: amount, coins: coinAmount }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1300);
  }

  function toggleQuest(id: string) {
    setQuests((qs) =>
      qs.map((q) => {
        if (q.id !== id) return q;
        if (!q.done) {
          addXp(q.xp, q.coins);
        }
        return { ...q, done: !q.done };
      })
    );
  }

  function addExpense(e: Omit<Expense, 'id' | 'time'>) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setExpenses((prev) => [{ ...e, id: `e${Date.now()}`, time }, ...prev]);
  }

  function logSet(s: Omit<SetLog, 'id' | 'oneRm' | 'rpGain'>) {
    const oneRm = Math.round(s.weight * (1 + s.reps / 30));
    const rpGain = Math.max(6, Math.round(s.weight / 6 + s.reps));
    const newLog: SetLog = { ...s, id: `s${Date.now()}`, oneRm, rpGain };
    setSetLogs((prev) => [newLog, ...prev].slice(0, 8));
    setMuscleRanks((prev) =>
      prev.map((m) =>
        m.group === s.muscle
          ? { ...m, progress: Math.min(100, m.progress + Math.round(rpGain / 6)) }
          : m
      )
    );
    addXp(40, 8);
  }

  function toggleFocus() {
    setFocusMode((f) => !f);
  }

  function unlockFunWallet() {
    setFunWalletUnlocked(true);
    setScreenTimeMinutes(30);
  }

  function addScreenTime(mins: number) {
    setScreenTimeMinutes((m) => Math.max(0, m + mins));
  }

  function bumpSubject(name: string, amount: number) {
    setSubjects((prev) =>
      prev.map((s) =>
        s.name === name ? { ...s, progress: Math.min(100, s.progress + amount) } : s
      )
    );
  }

  function setCompanion(c: CompanionConfig) {
    setCompanionState(c);
  }

  function setCompanionPreset(id: CompanionId) {
    const preset = companionPresets.find((p) => p.id === id)!;
    setCompanionState((prev) => ({
      ...prev,
      id,
      customName: preset.defaultName,
      glowColor: preset.defaultGlow,
    }));
  }

  function triggerLevelUp() {
    // Force to just over the threshold so the demo always fires, regardless of current xp.
    setXp(() => {
      doLevelUp();
      return 0;
    });
  }

  function closeLevelUp() {
    setLevelUpData(null);
  }

  // ---- new feature methods ----

  useEffect(() => {
    savePersisted({ userType, skills, tasks, timetable, completedResources });
  }, [userType, skills, tasks, timetable, completedResources]);

  useEffect(() => {
    setResources(generateResources(skills, level, userType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSetUserType(t: UserType) {
    setUserType(t);
  }

  function handleSetSkills(s: string[]) {
    setSkills(s);
  }

  function addSkill(s: string) {
    const trimmed = s.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setSkills((prev) => [...prev, trimmed]);
  }

  function removeSkill(s: string) {
    setSkills((prev) => prev.filter((x) => x !== s));
  }

  function addTask(t: Omit<Task, 'id' | 'done'>) {
    setTasks((prev) => [...prev, { ...t, id: `task-${Date.now()}`, done: false }]);
  }

  function updateTask(id: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (!t.done) {
          const xpVal = t.difficulty === 'easy' ? 10 : t.difficulty === 'medium' ? 25 : 50;
          addXp(xpVal, 5);
        }
        return { ...t, done: !t.done };
      })
    );
  }

  function autoPlanWeek() {
    const planned = autoPlanTasks(userType, skills);
    setTasks((prev) => [...prev.filter((t) => !t.suggested), ...planned]);
    setTimetable((prev) => [
      ...prev,
      ...planned.map((p) => ({ id: p.id, title: p.title, skill: p.skill, day: p.day, time: p.time, duration: p.duration })),
    ]);
  }

  function addTimetableEntry(e: Omit<TimetableEntry, 'id'>) {
    setTimetable((prev) => [...prev, { ...e, id: `tt-${Date.now()}` }]);
  }

  function deleteTimetableEntry(id: string) {
    setTimetable((prev) => prev.filter((e) => e.id !== id));
  }

  function refreshResources() {
    setResources(generateResources(skills, level, userType));
  }

  function completeResource(id: string) {
    if (completedResources.includes(id)) return;
    setCompletedResources((prev) => [...prev, id]);
    addXp(15, 3);
  }

  const value = useMemo<GameState>(
    () => ({
      level,
      xp,
      xpToNext,
      coins,
      streak,
      rankName: 'Diamond II',
      focusMode,
      quests,
      expenses,
      subjects,
      muscleRanks,
      setLogs,
      floats,
      funWalletUnlocked,
      screenTimeMinutes,
      companion,
      levelUpData,
      userType,
      skills,
      tasks,
      timetable,
      resources,
      completedResources,
      setUserType: handleSetUserType,
      setSkills: handleSetSkills,
      addSkill,
      removeSkill,
      addTask,
      updateTask,
      deleteTask,
      setTasks,
      toggleTask,
      autoPlanWeek,
      addTimetableEntry,
      deleteTimetableEntry,
      refreshResources,
      completeResource,
      addXp,
      toggleQuest,
      addExpense,
      logSet,
      toggleFocus,
      unlockFunWallet,
      addScreenTime,
      clearFloat: (id: number) => setFloats((f) => f.filter((x) => x.id !== id)),
      bumpSubject,
      setCompanion,
      setCompanionPreset,
      triggerLevelUp,
      closeLevelUp,
    }),
    [level, xp, xpToNext, coins, streak, focusMode, quests, expenses, subjects, muscleRanks, setLogs, floats, funWalletUnlocked, screenTimeMinutes, companion, levelUpData, userType, skills, tasks, timetable, resources, completedResources]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
