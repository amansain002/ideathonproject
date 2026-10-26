interface RingProgressProps {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  color: string;
  label?: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export function RingProgress({
  value,
  size = 120,
  stroke = 10,
  color,
  label,
  sublabel,
  icon,
}: RingProgressProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (clamped / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)',
            filter: `drop-shadow(0 0 6px ${color}aa)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {icon}
        <span className="font-display text-lg font-bold text-white">{label ?? `${Math.round(clamped)}%`}</span>
        {sublabel && <span className="text-[10px] uppercase tracking-wider text-white/45">{sublabel}</span>}
      </div>
    </div>
  );
}
