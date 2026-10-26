import { RingProgress } from '@/components/RingProgress';

interface ScoreGaugeProps {
  score: number; // 0-100
  size?: number;
  label?: string;
  color?: string;
}

/** Large circular score gauge used on AI scan result screens. */
export function ScoreGauge({ score, size = 160, label = 'Score', color = '#8B5CF6' }: ScoreGaugeProps) {
  return (
    <div className="flex flex-col items-center">
      <RingProgress
        value={score}
        size={size}
        stroke={12}
        color={color}
        sublabel={label}
      />
      <span
        className="mt-1 font-display text-3xl font-extrabold"
        style={{ color, marginTop: '-2.25rem' }}
      >
        {score}
      </span>
    </div>
  );
}

interface BarRowProps {
  label: string;
  value: number; // 0-100
  color?: string;
}

export function BarRow({ label, value, color = '#8B5CF6' }: BarRowProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold text-white/70">{label}</span>
        <span className="tabular-nums text-white/45">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface2">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, background: color, transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </div>
    </div>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="heading-md">{title}</h2>
      {action}
    </div>
  );
}

export function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-edge bg-surface2 text-white/30">
        {icon}
      </div>
      <p className="heading-md text-white/70">{title}</p>
      {subtitle && <p className="muted-sm mt-1 max-w-[240px]">{subtitle}</p>}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}
