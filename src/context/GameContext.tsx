import { createContext, useCallback, useContext, useMemo, useState, useEffect, type ReactNode } from 'react';
import {
  initialQuests,
  initialExpenses,
  initialSubjects,
  initialMuscleRanks,
  initialSetLogs,
  defaultCompanion,
  defaultCoachSettings,
  defaultCoachMemory,
  companionPresets,
  autoPlanTasks,
  generateResources,
  difficultyXp,
  todayShort,
  daysOfWeek,
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
  type CoachSettings,
  type CoachMemory,
} from '@/types';
import type { CoachTrigger } from '@/coach/messageBank';

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
  coachSettings: CoachSettings;
  coachMemory: CoachMemory;
  coachEvent: { trigger: CoachTrigger; task?: string; xp?: number } | null;
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
  setCoachSettings: (patch: Partial<CoachSettings>) => void;
  setCoachMemory: (patch: Partial<CoachMemory>) => void;
  triggerCoach: (trigger: CoachTrigger, task?: string, xp?: number) => void;
  clearCoachEvent: () => void;
  skipTask: (id: string) => void;
  snoozeTask: (id: string) => void;
  rescheduleTask: (id: string, day?: string, time?: string) => void;
  markStruggling: () => void;
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
  coachSettings: CoachSettings;
  coachMemory: CoachMemory;
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
  const [coachSettings, setCoachSettingsState] = useState<CoachSettings>(defaultCoachSettings);
  const [coachMemory, setCoachMemoryState] = useState<CoachMemory>(defaultCoachMemory);
  const [coachEvent, setCoachEvent] = useState<{ trigger: CoachTrigger; task?: string; xp?: number } | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ open: boolean; newLevel: number; rankName: string } | null>(null);

  const persisted = loadPersisted();
  // hydrate coach settings/memory from persistence if present
  useEffect(() => {
    if (persisted.coachSettings) setCoachSettingsState({ ...defaultCoachSettings, ...persisted.coachSettings });
    if (persisted.coachMemory) setCoachMemoryState({ ...defaultCoachMemory, ...persisted.coachMemory });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    setTimeout(() => setCoachEvent({ trigger: 'level_up' }), 600);
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
    savePersisted({ userType, skills, tasks, timetable, completedResources, coachSettings, coachMemory });
  }, [userType, skills, tasks, timetable, completedResources, coachSettings, coachMemory]);

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
    setTasks((prev) => {
      let completedTask: Task | null = null;
      const next = prev.map((t) => {
        if (t.id !== id) return t;
        if (!t.done) {
          completedTask = t;
          const xpVal = difficultyXp[t.difficulty];
          addXp(xpVal, 5);
        }
        return { ...t, done: !t.done };
      });
      if (completedTask) {
        const task = completedTask as Task;
        const xpVal = difficultyXp[task.difficulty];
        // Determine coach trigger
        const trigger: CoachTrigger = task.difficulty === 'hard' ? 'hard_task_done' : 'task_completed';
        // update memory: completion count
        setCoachMemoryState((m) => ({
          ...m,
          totalCompletions: m.totalCompletions + 1,
          missesInRow: 0,
          favoriteTask: m.favoriteTask === null ? task.title : m.favoriteTask,
        }));
        // emit coach event (slight delay so float animation isn't interrupted)
        setTimeout(() => setCoachEvent({ trigger, task: task.title, xp: xpVal }), 250);
      }
      return next;
    });
  }

  function skipTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task || task.done) return;
    const xpVal = difficultyXp[task.difficulty];
    const penalty = Math.round(xpVal / 2);
    // deduct XP (penalty)
    setXp((prev) => Math.max(0, prev - penalty));
    const id2 = ++floatId;
    setFloats((f) => [...f, { id: id2, xp: -penalty, coins: 0 }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id2)), 1300);
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: true } : t)));
    setCoachMemoryState((m) => ({
      ...m,
      totalMisses: m.totalMisses + 1,
      missesInRow: m.missesInRow + 1,
    }));
    setCoachEvent({ trigger: 'task_skipped', task: task.title, xp: penalty });
  }

  function snoozeTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    // push time forward by 10 min (simple string increment)
    const [h, m] = task.time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    d.setMinutes(d.getMinutes() + 10);
    const newTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const snoozeCount = (t as Task & { snoozeCount?: number }).snoozeCount ?? 0;
      const next = { ...t, time: newTime, snoozeCount: snoozeCount + 1 } as Task & { snoozeCount?: number };
      if (next.snoozeCount && next.snoozeCount >= 3) {
        const xpVal = difficultyXp[t.difficulty];
        const penalty = Math.round(xpVal / 4);
        setXp((prevXp) => Math.max(0, prevXp - penalty));
        setCoachEvent({ trigger: 'snoozed_3', task: t.title, xp: penalty });
      }
      return next;
    }));
  }

  function rescheduleTask(id: string, day?: string, time?: string) {
    setTasks((prev) => prev.map((t) =>
      t.id === id ? { ...t, day: day ?? t.day, time: time ?? t.time, done: false } : t
    ));
  }

  function markStruggling() {
    setCoachSettingsState((s) => ({ ...s, strugglingUntil: Date.now() + 24 * 60 * 60 * 1000 }));
    // also lighten: reduce today's incomplete tasks to just 1
    const today = todayShort();
    setTasks((prev) => {
      const todays = prev.filter((t) => (t.day === today || t.day === 'Today') && !t.done);
      if (todays.length <= 1) return prev;
      const keepId = todays[0].id;
      return prev.map((t) => {
        if ((t.day === today || t.day === 'Today') && !t.done && t.id !== keepId) {
          // push to tomorrow
          const idx = daysOfWeek.indexOf(t.day);
          const nextDay = daysOfWeek[(idx + 1) % 7];
          return { ...t, day: nextDay };
        }
        return t;
      });
    });
    setCoachEvent({ trigger: 'misses_3_days' });
  }

  function setCoachSettings(patch: Partial<CoachSettings>) {
    setCoachSettingsState((prev) => ({ ...prev, ...patch }));
  }

  function setCoachMemory(patch: Partial<CoachMemory>) {
    setCoachMemoryState((prev) => ({ ...prev, ...patch }));
  }

  function triggerCoach(trigger: CoachTrigger, task?: string, xp?: number) {
    setCoachEvent({ trigger, task, xp });
  }

  function clearCoachEvent() {
    setCoachEvent(null);
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
      coachSettings,
      coachMemory,
      coachEvent,
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
      setCoachSettings,
      setCoachMemory,
      triggerCoach,
      clearCoachEvent,
      skipTask,
      snoozeTask,
      rescheduleTask,
      markStruggling,
      triggerLevelUp,
      closeLevelUp,
    }),
    [level, xp, xpToNext, coins, streak, focusMode, quests, expenses, subjects, muscleRanks, setLogs, floats, funWalletUnlocked, screenTimeMinutes, companion, coachSettings, coachMemory, coachEvent, levelUpData, userType, skills, tasks, timetable, resources, completedResources]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
