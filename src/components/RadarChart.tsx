interface RadarStat {
  label: string;
  value: number; // 0-100
}

export function RadarChart({
  stats,
  size = 240,
  accent = '#8B5CF6',
  rating,
}: {
  stats: RadarStat[];
  size?: number;
  accent?: string;
  rating?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 36;
  const n = stats.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const point = (i: number, r: number) => ({
    x: cx + Math.cos(angle(i)) * r,
    y: cy + Math.sin(angle(i)) * r,
  });

  const rings = [0.25, 0.5, 0.75, 1];
  const dataPoints = stats.map((s, i) => point(i, (s.value / 100) * radius));
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const labelPts = stats.map((s, i) => point(i, radius + 18));

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {rings.map((r, idx) => (
          <polygon
            key={idx}
            points={stats.map((_, i) => {
              const p = point(i, radius * r);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1}
          />
        ))}
        {stats.map((_, i) => {
          const p = point(i, radius);
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />;
        })}
        <polygon points={polygon} fill={`${accent}33`} stroke={accent} strokeWidth={2} style={{ filter: `drop-shadow(0 0 8px ${accent}88)` }} />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={accent} stroke="#090A0F" strokeWidth={1.5} />
        ))}
        {stats.map((s, i) => (
          <text
            key={s.label}
            x={labelPts[i].x}
            y={labelPts[i].y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white/55 text-[10px] font-semibold uppercase tracking-wider"
          >
            {s.label}
          </text>
        ))}
      </svg>
      {rating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display text-2xl font-bold text-white">{rating}</span>
          <span className="text-[10px] uppercase tracking-wider text-white/45">Rating</span>
        </div>
      )}
    </div>
  );
}
