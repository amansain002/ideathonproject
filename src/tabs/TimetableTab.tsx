import { useState } from 'react';
import { Plus, Trash2, Zap, CalendarDays, Clock, Check } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { Modal } from '@/components/Modal';
import { EmptyState } from '@/components/ui';
import { TaskModal } from '@/tabs/HomeTab';
import { daysOfWeek, todayShort, skillColor, type TabId } from '@/types';

export function TimetableTab() {
  const { tasks, timetable, addTask, deleteTask, autoPlanWeek, toggleTask, skills, deleteTimetableEntry } = useGame();
  const [activeDay, setActiveDay] = useState<string>(todayShort());
  const [showAdd, setShowAdd] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const today = todayShort();

  // Merge tasks + timetable entries for display
  const dayTasks = tasks.filter((t) => t.day === activeDay);
  const dayTimetable = timetable.filter((e) => e.day === activeDay);

  const allEntries = [
    ...dayTasks.map((t) => ({ id: t.id, title: t.title, skill: t.skill, time: t.time, duration: t.duration, type: 'task' as const, done: t.done })),
    ...dayTimetable.map((e) => ({ id: e.id, title: e.title, skill: e.skill, time: e.time, duration: e.duration, type: 'tt' as const, done: false })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  const totalWeekTasks = tasks.length;
  const completedWeekTasks = tasks.filter((t) => t.done).length;
  const weekXp = tasks.filter((t) => t.done).reduce((sum, t) => {
    const xp = t.difficulty === 'easy' ? 10 : t.difficulty === 'medium' ? 25 : 50;
    return sum + xp;
  }, 0);

  const dayDone = dayTasks.filter((t) => t.done).length;

  return (
    <div className="animate-slideUp space-y-5 px-5 pb-6 pt-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="muted-sm">Weekly schedule</p>
          <h1 className="heading-xl">Timetable</h1>
        </div>
        <button
          onClick={() => setViewMode((v) => v === 'day' ? 'week' : 'day')}
          className="rounded-xl border border-edge bg-surface px-3 py-2 text-xs font-bold text-white/60"
        >
          {viewMode === 'day' ? 'Week Grid' : 'Day View'}
        </button>
      </div>

      {/* weekly summary */}
      <div className="card card-pad">
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays size={16} className="text-neon-purple" />
          <p className="heading-md">This Week</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="font-display text-xl font-bold text-white">{totalWeekTasks}</p>
            <p className="text-[10px] uppercase tracking-wider text-white/40">Planned</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-neon-emerald">{completedWeekTasks}</p>
            <p className="text-[10px] uppercase tracking-wider text-white/40">Completed</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-neon-purple">{weekXp}</p>
            <p className="text-[10px] uppercase tracking-wider text-white/40">XP earned</p>
          </div>
        </div>
        <button onClick={autoPlanWeek} className="btn-secondary !h-10 mt-3 w-full">
          <Zap size={14} /> Auto-plan my week
        </button>
      </div>

      {viewMode === 'day' ? (
        <>
          {/* day tabs */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-1">
            {daysOfWeek.map((d) => {
              const isToday = d === today;
              const isActive = d === activeDay;
              return (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={`relative shrink-0 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${isActive ? 'border-neon-purple bg-neon-purple/15 text-neon-purple' : 'border-edge bg-surface text-white/50'}`}
                >
                  {d}
                  {isToday && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-neon-emerald" />}
                </button>
              );
            })}
          </div>

          {/* day progress */}
          {activeDay === today && dayTasks.length > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-edge bg-surface px-4 py-2.5">
              <p className="text-sm font-semibold text-white">{dayDone}/{dayTasks.length} done today</p>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-surface2">
                <div className="h-full rounded-full bg-neon-emerald transition-all duration-500" style={{ width: `${(dayDone / dayTasks.length) * 100}%` }} />
              </div>
            </div>
          )}

          {/* entries */}
          {allEntries.length === 0 ? (
            <EmptyState
              icon={<CalendarDays size={24} />}
              title="Nothing scheduled"
              subtitle="Tap + to add a task or use Auto-plan to fill your week."
            />
          ) : (
            <div className="space-y-2.5">
              {allEntries.map((e) => {
                const color = skillColor(e.skill);
                return (
                  <div
                    key={e.id}
                    className="flex items-stretch gap-0 rounded-2xl border border-edge bg-surface overflow-hidden"
                  >
                    <div className="w-1.5 shrink-0" style={{ background: color }} />
                    <div className="flex flex-1 items-center gap-3 p-3.5">
                      <div className="w-14 shrink-0 text-center">
                        <p className="font-display text-sm font-bold text-white">{e.time}</p>
                        <p className="text-[10px] text-white/40">{e.duration}m</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold text-white ${e.done ? 'line-through opacity-50' : ''}`}>{e.title}</p>
                        <p className="text-[11px]" style={{ color }}>{e.skill}</p>
                      </div>
                      {e.type === 'task' && !e.done && (
                        <button
                          onClick={() => toggleTask(e.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-edge2 transition hover:border-neon-emerald"
                        >
                          <Check size={14} className="text-transparent" />
                        </button>
                      )}
                      {e.type === 'task' && e.done && (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neon-emerald text-white">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      )}
                      <button
                        onClick={() => { deleteTask(e.id); deleteTimetableEntry(e.id); }}
                        className="text-white/30 transition hover:text-neon-crimson"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* add button */}
          <button onClick={() => setShowAdd(true)} className="btn-secondary !h-12 w-full">
            <Plus size={18} /> Add task to {activeDay}
          </button>
        </>
      ) : (
        /* Week grid view */
        <div className="space-y-2">
          {daysOfWeek.map((d) => {
            const dayItems = tasks.filter((t) => t.day === d).sort((a, b) => a.time.localeCompare(b.time));
            const isToday = d === today;
            return (
              <button key={d} onClick={() => { setActiveDay(d); setViewMode('day'); }} className="card card-pad w-full text-left">
                <div className="mb-2 flex items-center gap-2">
                  <p className="text-sm font-bold text-white">{d}</p>
                  {isToday && <span className="chip border border-neon-emerald/40 bg-neon-emerald/10 text-neon-emerald text-[9px]">TODAY</span>}
                  <span className="ml-auto text-[11px] text-white/40">{dayItems.length} tasks</span>
                </div>
                {dayItems.length === 0 ? (
                  <p className="text-[11px] text-white/30">Free</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {dayItems.slice(0, 4).map((t) => {
                      const color = skillColor(t.skill);
                      return (
                        <span key={t.id} className="chip border text-[10px]" style={{ borderColor: `${color}55`, background: `${color}14`, color }}>
                          <Clock size={9} className="inline" /> {t.time} {t.title}
                        </span>
                      );
                    })}
                    {dayItems.length > 4 && <span className="text-[10px] text-white/40">+{dayItems.length - 4} more</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {showAdd && (
        <TaskModal
          skills={skills}
          title="New Task"
          onClose={() => setShowAdd(false)}
          onSave={(t) => { addTask({ ...t, day: activeDay }); setShowAdd(false); }}
        />
      )}
    </div>
  );
}

// re-export for type safety
export type { TabId };
