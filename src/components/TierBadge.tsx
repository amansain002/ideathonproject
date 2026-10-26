import type { Tier } from '@/types';

export function TierBadge({ tier, size = 'md' }: { tier: Tier; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };
  return (
    <span
      className={`chip border ${sizes[size]} font-bold tracking-wide`}
      style={{
        color: tier.color,
        borderColor: `${tier.color}55`,
        background: `${tier.color}14`,
      }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: tier.color, boxShadow: `0 0 6px ${tier.color}` }}
      />
      {tier.name} {tier.division}
    </span>
  );
}

export function tierColor(name: string) {
  return (
    {
      Bronze: '#c47138',
      Silver: '#b8c4d4',
      Gold: '#f5b942',
      Platinum: '#54e6c4',
      Diamond: '#6fb6ff',
      Grandmaster: '#d36bff',
    } as Record<string, string>
  )[name] ?? '#8b5cf6';
}
