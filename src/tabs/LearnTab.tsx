import { useState } from 'react';
import {
  RefreshCw, ExternalLink, Check, Play, FileText, BookOpen, Dumbbell, Plus, Clock,
} from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { EmptyState } from '@/components/ui';
import { skillColor, type TabId, type ResourceType } from '@/types';

const typeFilters: { id: ResourceType | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'video', label: 'Videos' },
  { id: 'article', label: 'Articles' },
  { id: 'course', label: 'Courses' },
  { id: 'exercise', label: 'Practice' },
];

const typeIcons: Record<ResourceType, typeof Play> = {
  video: Play,
  article: FileText,
  course: BookOpen,
  exercise: Dumbbell,
};

export function LearnTab({ onNavigate }: { onNavigate: (t: TabId) => void }) {
  const { resources, completedResources, completeResource, refreshResources, skills, addTimetableEntry } = useGame();
  const [filter, setFilter] = useState<ResourceType | 'all'>('all');
  const [loading, setLoading] = useState(false);

  function handleRefresh() {
    setLoading(true);
    refreshResources();
    setTimeout(() => setLoading(false), 800);
  }

  const filtered = filter === 'all' ? resources : resources.filter((r) => r.type === filter);
  const completedCount = resources.filter((r) => completedResources.includes(r.id)).length;

  return (
    <div className="animate-slideUp space-y-5 px-5 pb-6 pt-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="muted-sm">Learning resources</p>
          <h1 className="heading-xl">Learn</h1>
        </div>
        <button onClick={handleRefresh} className="flex h-10 w-10 items-center justify-center rounded-xl border border-edge bg-surface text-neon-purple transition active:scale-90">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* summary */}
      <div className="card card-pad flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue text-white">
          <BookOpen size={22} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">{completedCount} / {resources.length} completed</p>
          <p className="muted-sm">+15 XP per resource completed</p>
        </div>
      </div>

      {/* filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {typeFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${filter === f.id ? 'border-neon-purple bg-neon-purple/15 text-neon-purple' : 'border-edge bg-surface text-white/50'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* resources */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={24} />}
          title="No resources yet"
          subtitle={skills.length === 0 ? 'Add skills in Profile to get recommendations' : 'Tap refresh to generate new suggestions'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const Icon = typeIcons[r.type];
            const color = skillColor(r.skill);
            const done = completedResources.includes(r.id);
            return (
              <div key={r.id} className="card overflow-hidden">
                <div className="flex gap-3 p-3.5">
                  {/* thumbnail */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl" style={{ background: `linear-gradient(135deg, ${color}40, ${color}10)` }}>
                    <div className="flex h-full w-full items-center justify-center" style={{ color }}>
                      <Icon size={22} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white leading-snug">{r.title}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-[11px] text-white/40">
                      <span style={{ color }}>{r.skill}</span>
                      <span>· {r.source}</span>
                      <span>· <Clock size={10} className="inline" /> {r.time}</span>
                    </p>

                    <div className="mt-2 flex gap-2">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg border border-edge bg-surface2 px-3 py-1.5 text-[11px] font-bold text-white/80 transition hover:text-white">
                        <ExternalLink size={12} /> Open
                      </a>
                      {!done ? (
                        <button onClick={() => completeResource(r.id)} className="flex items-center gap-1 rounded-lg border border-neon-emerald/40 bg-neon-emerald/10 px-3 py-1.5 text-[11px] font-bold text-neon-emerald transition active:scale-95">
                          <Check size={12} /> +15 XP
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 rounded-lg bg-neon-emerald/15 px-3 py-1.5 text-[11px] font-bold text-neon-emerald">
                          <Check size={12} strokeWidth={3} /> Done
                        </span>
                      )}
                      <button
                        onClick={() => { addTimetableEntry({ title: r.title, skill: r.skill, day: 'Today', time: '18:00', duration: 30 }); onNavigate('timetable'); }}
                        className="flex items-center gap-1 rounded-lg border border-edge bg-surface2 px-3 py-1.5 text-[11px] font-bold text-white/60 transition hover:text-white"
                      >
                        <Plus size={12} /> Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
