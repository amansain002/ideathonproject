import { useState } from 'react';
import {
  Flame, Zap, Coins, Check, Sparkles, ChevronRight, Plus, Pencil, Trash2, X,
  Wrench, Users, BookOpen, CalendarDays,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { RingProgress } from '@/components/RingProgress';
import { Modal } from '@/components/Modal';
import { EmptyState } from '@/components/ui';
import {
  daysOfWeek, todayShort, skillColor, difficultyXp,
  type TabId, type Task, type Difficulty,
} from '@/types';

export function HomeTab({ onNavigate }: { onNavigate: (t: TabId) => void }) {
  const {
    level, xp, xpToNext, coins, streak, rankName, quests, toggleQuest, floats,
    tasks, toggleTask, addTask, updateTask, deleteTask, skills, userType,
  } = useGame();
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const xpPct = Math.min(100, (xp / xpToNext) * 100);
  const doneCount = quests.filter((q) => q.done).length;
  const dayPct = quests.length > 0 ? (doneCount / quests.length) * 100 : 0;

  const today = todayShort();
  const todayTasks = tasks.filter((t) => t.day === today || t.day === 'Today');
  const taskDone = todayTasks.filter((t) => t.done).length;

  return (
    <div className="animate-slideUp space-y-5 px-5 pb-6 pt-8">
      {/* Greeting + streak */}
      <div className="flex items-start justify-between">
        <div>
          <p className="muted-sm">Good morning, Scholar</p>
          <h1 className="heading-xl">Let's lock in.</h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-2xl border border-neon-amber/40 bg-neon-amber/10 px-3 py-2">
          <Flame size={18} className="text-neon-amber" />
          <div className="leading-none">
            <p className="font-display text-base font-bold text-white">{streak}</p>
            <p className="text-[9px] uppercase tracking-wider text-white/50">day streak</p>
          </div>
        </div>
      </div>

      {/* Level / XP bar */}
      <div className="card card-pad">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue text-sm font-bold text-white shadow-glow-blue">
              {level}
            </span>
            <div>
              <p className="text-sm font-bold text-white">Level {level} · Scholar-Athlete</p>
              <p className="muted-sm">{rankName}</p>
            </div>
          </div>
          <span className="chip border border-neon-emerald/40 bg-neon-emerald/10 text-neon-emerald">
            <Coins size={12} /> {coins}
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-surface2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-blue transition-all duration-700"
            style={{ width: `${xpPct}%`, boxShadow: '0 0 10px rgba(139,92,246,0.6)' }}
          />
        </div>
        <p className="mt-1.5 text-right text-[11px] tabular-nums text-white/40">
          {xp.toLocaleString()} / {xpToNext.toLocaleString()} XP
        </p>
      </div>

      {/* Daily progress ring */}
      <div className="card card-pad flex items-center gap-4">
        <RingProgress value={dayPct} size={88} stroke={8} color="#8B5CF6" />
        <div className="flex-1">
          <p className="heading-md">Today's Plan</p>
          <p className="muted-sm">{doneCount} of {quests.length} quests · {taskDone}/{todayTasks.length} tasks</p>
          <button onClick={() => onNavigate('progress')} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-neon-purple">
            View progress <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Floating XP reward */}
      <div className="pointer-events-none fixed left-1/2 top-24 z-50 -translate-x-1/2">
        {floats.map((f) => (
          <div key={f.id} className="animate-floatUp flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-bold shadow-card">
            <Zap size={14} className="text-neon-purple" />
            <span className="text-neon-purple">+{f.xp} XP</span>
            {f.coins > 0 && <span className="text-neon-emerald">+{f.coins}</span>}
          </div>
        ))}
      </div>

      {/* My Tasks */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="heading-md">My Tasks</h2>
          <button onClick={() => setShowAdd(true)} className="flex h-8 w-8 items-center justify-center rounded-xl bg-neon-purple text-white transition active:scale-90">
            <Plus size={18} />
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <EmptyState icon={<BookOpen size={24} />} title="No tasks for today" subtitle="Add your first task or auto-plan your week from the Timetable tab." />
        ) : (
          <div className="space-y-2.5">
            {todayTasks.map((t) => {
              const color = skillColor(t.skill);
              const xpVal = difficultyXp[t.difficulty];
              return (
                <div
                  key={t.id}
                  className={`flex items-center gap-3 rounded-2xl border p-3.5 transition-all ${t.done ? 'border-neon-emerald/40' : 'border-edge bg-surface'}`}
                  style={t.done ? { background: 'rgba(16,185,129,0.06)' } : undefined}
                >
                  <button onClick={() => toggleTask(t.id)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition" style={{ borderColor: t.done ? '#10B981' : 'rgba(255,255,255,0.12)', background: t.done ? '#10B981' : 'transparent' }}>
                    {t.done && <Check size={16} strokeWidth={3} className="text-white" />}
                  </button>
                  <span className="flex-1">
                    <span className={`block text-sm font-semibold ${t.done ? 'text-white/50 line-through' : 'text-white'}`}>{t.title}</span>
                    <span className="flex items-center gap-2 text-[11px] text-white/40">
                      <span style={{ color }}>{t.skill}</span>
                      <span>· {t.time} · {t.duration}m · +{xpVal} XP</span>
                    </span>
                  </span>
                  <button onClick={() => setEditTask(t)} className="text-white/30 transition hover:text-white/70"><Pencil size={14} /></button>
                  <button onClick={() => deleteTask(t.id)} className="text-white/30 transition hover:text-neon-crimson"><Trash2 size={14} /></button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legacy quests */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="heading-md">Daily Quests</h2>
          <span className="muted-sm">{doneCount}/{quests.length} done</span>
        </div>
        <div className="space-y-2.5">
          {quests.map((q) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[q.icon] ?? Icons.Circle;
            const accent = q.pillar === 'mind' ? '#8B5CF6' : q.pillar === 'wealth' ? '#10B981' : '#F59E0B';
            return (
              <button
                key={q.id}
                onClick={() => toggleQuest(q.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all active:scale-[0.98] ${q.done ? 'border-neon-emerald/40' : 'border-edge bg-surface'}`}
                style={q.done ? { background: 'rgba(16,185,129,0.06)' } : undefined}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${accent}1f`, color: accent }}>
                  <Icon size={18} />
                </span>
                <span className="flex-1">
                  <span className={`block text-sm font-semibold ${q.done ? 'text-white/50 line-through' : 'text-white'}`}>{q.label}</span>
                  <span className="text-[11px] text-white/40">+{q.xp} XP · +{q.coins} coins · {q.pillar}</span>
                </span>
                <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${q.done ? 'border-neon-emerald bg-neon-emerald text-white' : 'border-edge2 text-transparent'}`}>
                  <Check size={16} strokeWidth={3} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onNavigate('learn')} className="card card-pad flex items-center gap-3 transition active:scale-[0.98]">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-purple/15 text-neon-purple"><BookOpen size={18} /></span>
          <div className="text-left">
            <p className="text-sm font-bold text-white">Learn</p>
            <p className="muted-sm">Resources</p>
          </div>
        </button>
        <button onClick={() => onNavigate('timetable')} className="card card-pad flex items-center gap-3 transition active:scale-[0.98]">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-sky/15 text-neon-sky"><CalendarDays size={18} /></span>
          <div className="text-left">
            <p className="text-sm font-bold text-white">Timetable</p>
            <p className="muted-sm">Weekly plan</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onNavigate('tools')} className="btn-secondary !h-12">
          <Wrench size={16} /> AI Tools
        </button>
        <button onClick={() => onNavigate('friends')} className="btn-secondary !h-12">
          <Users size={16} /> Friends
        </button>
      </div>

      <button onClick={() => onNavigate('tools')} className="btn-primary">
        <Sparkles size={20} /> Open AI Tools
      </button>

      {/* Add/Edit task modal */}
      {showAdd && (
        <TaskModal
          skills={skills}
          title="New Task"
          onClose={() => setShowAdd(false)}
          onSave={(t) => { addTask({ ...t, day: t.day || today }); setShowAdd(false); }}
        />
      )}
      {editTask && (
        <TaskModal
          skills={skills}
          title="Edit Task"
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={(t) => { updateTask(editTask.id, t); setEditTask(null); }}
        />
      )}
    </div>
  );
}

export function TaskModal({ skills, title, task, onClose, onSave }: {
  skills: string[];
  title: string;
  task?: Task;
  onClose: () => void;
  onSave: (t: Omit<Task, 'id' | 'done'>) => void;
}) {
  const [taskTitle, setTaskTitle] = useState(task?.title ?? '');
  const [skill, setSkill] = useState(task?.skill ?? skills[0] ?? 'General');
  const [day, setDay] = useState(task?.day ?? todayShort());
  const [time, setTime] = useState(task?.time ?? '18:00');
  const [duration, setDuration] = useState(task?.duration ?? 30);
  const [difficulty, setDifficulty] = useState<Difficulty>(task?.difficulty ?? 'medium');

  function save() {
    if (!taskTitle.trim()) return;
    onSave({ title: taskTitle.trim(), skill, day, time, duration, difficulty });
  }

  const diffs: { id: Difficulty; label: string; xp: number }[] = [
    { id: 'easy', label: 'Easy', xp: 10 },
    { id: 'medium', label: 'Medium', xp: 25 },
    { id: 'hard', label: 'Hard', xp: 50 },
  ];

  return (
    <Modal open onClose={onClose} title={title}>
      <div className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input className="input" value={taskTitle} maxLength={60} placeholder="e.g. Study Algebra chapter 3" onChange={(e) => setTaskTitle(e.target.value)} autoFocus />
        </div>

        <div>
          <label className="label">Skill</label>
          <select className="input" value={skill} onChange={(e) => setSkill(e.target.value)}>
            {skills.map((s) => <option key={s} value={s}>{s}</option>)}
            <option value="General">General</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Day</label>
            <select className="input" value={day} onChange={(e) => setDay(e.target.value)}>
              {daysOfWeek.map((d) => <option key={d} value={d}>{d}</option>)}
              <option value="Today">Today</option>
            </select>
          </div>
          <div>
            <label className="label">Time</label>
            <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Duration (min)</label>
            <input className="input" type="number" min={5} max={300} step={5} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Difficulty</label>
            <div className="flex gap-1.5">
              {diffs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`flex-1 rounded-xl border px-2 py-2.5 text-xs font-bold transition ${difficulty === d.id ? 'border-neon-purple bg-neon-purple/15 text-neon-purple' : 'border-edge bg-surface text-white/50'}`}
                >
                  {d.label}
                  <span className="block text-[10px] text-white/40">+{d.xp} XP</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={save} disabled={!taskTitle.trim()} className="btn-primary w-full">
          {task ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </Modal>
  );
}
