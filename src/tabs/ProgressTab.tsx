import { TrendingUp, Trophy, Award, Brain, Dumbbell, Wallet, Target } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { RadarChart } from '@/components/RadarChart';
import { TierBadge } from '@/components/TierBadge';
import { SectionHeader } from '@/components/ui';
import { bossTracker } from '@/types';

const weeklyScores = [
  { day: 'M', value: 62 },
  { day: 'T', value: 71 },
  { day: 'W', value: 58 },
  { day: 'T', value: 79 },
  { day: 'F', value: 84 },
  { day: 'S', value: 68 },
  { day: 'S', value: 88 },
];

const streakHistory = [
  { day: 'M', value: 40 },
  { day: 'T', value: 55 },
  { day: 'W', value: 45 },
  { day: 'T', value: 70 },
  { day: 'F', value: 65 },
  { day: 'S', value: 50 },
  { day: 'S', value: 80 },
];

const achievements = [
  { icon: 'Flame', title: '18-Day Streak', desc: 'Showed up 18 days straight', color: '#F59E0B' },
  { icon: 'Trophy', title: 'Diamond Rank', desc: 'Reached Diamond II', color: '#6fb6ff' },
  { icon: 'Brain', title: 'Quiz Master', desc: 'Cleared 10 coding sprints', color: '#38BDF8' },
  { icon: 'Wallet', title: 'Emerald Saver', desc: 'Saved ₹850 this month', color: '#10B981' },
  { icon: 'Dumbbell', title: 'Iron Will', desc: 'Logged 50 workout sets', color: '#F59E0B' },
  { icon: 'Target', title: 'Lock-In Pro', desc: 'Blocked 100 distractions', color: '#EF4444' },
];

export function ProgressTab() {
  const { subjects, muscleRanks, level, xp } = useGame();
  const stats = [
    { label: 'Disc', value: 82 },
    { label: 'Intel', value: 76 },
    { label: 'Fin', value: 68 },
    { label: 'Str', value: 74 },
    { label: 'Vit', value: 71 },
  ];

  return (
    <div className="animate-slideUp space-y-5 px-5 pb-6 pt-8">
      <div>
        <p className="muted-sm">Your growth, tracked</p>
        <h1 className="heading-xl">Progress</h1>
      </div>

      {/* level badge */}
      <div className="card card-pad flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue font-display text-2xl font-extrabold text-white shadow-glow-blue">
          {level}
        </div>
        <div className="flex-1">
          <p className="heading-md">Level {level}</p>
          <p className="muted-sm">{xp.toLocaleString()} total XP</p>
          <div className="mt-2 flex items-center gap-1.5">
            <Trophy size={14} className="text-neon-amber" />
            <span className="text-xs font-semibold text-neon-amber">Diamond II</span>
          </div>
        </div>
      </div>

      {/* weekly score chart */}
      <div className="card card-pad">
        <SectionHeader title="Weekly Scores" action={<TrendingUp size={16} className="text-neon-purple" />} />
        <div className="flex h-32 items-end justify-between gap-2">
          {weeklyScores.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-neon-purple to-neon-blue transition-all duration-700"
                  style={{ height: `${d.value}%`, boxShadow: '0 0 8px rgba(139,92,246,0.4)' }}
                />
              </div>
              <span className="text-[10px] font-semibold text-white/40">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* streak history */}
      <div className="card card-pad">
        <SectionHeader title="Streak History" action={<Award size={16} className="text-neon-amber" />} />
        <div className="flex h-28 items-end justify-between gap-2">
          {streakHistory.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-lg bg-neon-amber/80 transition-all duration-700"
                  style={{ height: `${d.value}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-white/40">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* character radar */}
      <div className="card card-pad">
        <SectionHeader title="Character Rating" />
        <div className="flex justify-center">
          <RadarChart stats={stats} rating="8.4" size={220} />
        </div>
        <div className="mt-2 grid grid-cols-5 gap-1.5">
          {[
            { l: 'Discipline', v: 82 }, { l: 'Intelligence', v: 76 },
            { l: 'Financial IQ', v: 68 }, { l: 'Strength', v: 74 }, { l: 'Vitality', v: 71 },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-display text-sm font-bold text-white">{s.v}</p>
              <p className="text-[8px] uppercase tracking-tight text-white/40">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* skill tree */}
      <div className="card card-pad">
        <SectionHeader title="Skill Tree" />
        <div className="space-y-2.5">
          {subjects.map((s) => (
            <div key={s.name}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{s.name}</span>
                <TierBadge tier={s.tier} size="sm" />
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface2">
                <div className="h-full rounded-full" style={{ width: `${s.progress}%`, background: s.tier.color, transition: 'width 0.7s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* boss tracker */}
      <div className="card card-pad">
        <SectionHeader title="Syllabus Boss Tracker" />
        <div className="space-y-3">
          {bossTracker.map((b) => (
            <div key={b.title}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{b.title}</span>
                <span className="text-[11px] text-white/45">{b.date} · {b.days}d</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface2">
                <div className={`h-full rounded-full ${b.progress >= 80 ? 'bg-neon-emerald' : b.progress >= 50 ? 'bg-neon-amber' : 'bg-neon-crimson'}`} style={{ width: `${b.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* achievements */}
      <div className="card card-pad">
        <SectionHeader title="Achievements" />
        <div className="grid grid-cols-2 gap-2.5">
          {achievements.map((a) => (
            <div key={a.title} className="rounded-xl border border-edge bg-surface2 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${a.color}1f`, color: a.color }}>
                <Trophy size={16} />
              </span>
              <p className="mt-2 text-sm font-bold text-white">{a.title}</p>
              <p className="text-[11px] text-white/40">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
