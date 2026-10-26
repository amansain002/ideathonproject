import { useState } from 'react';
import { Sparkles, X, Gift, ChevronUp } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { CompanionAvatar } from '@/components/CompanionAvatar';
import { levelUpLines, pickLine, tipLines } from '@/types';

export function LevelUpOverlay() {
  const { levelUpData, closeLevelUp, companion } = useGame();
  const [claimed, setClaimed] = useState(false);

  if (!levelUpData?.open) return null;

  const { newLevel, rankName } = levelUpData;
  const line = pickLine(levelUpLines[companion.personality]);

  function claim() {
    setClaimed(true);
    setTimeout(() => {
      closeLevelUp();
      setClaimed(false);
    }, 900);
  }

  // sparkle particles
  const sparkles = Array.from({ length: 14 });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-ink/90 backdrop-blur-lg" />

      {/* floating sparkles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {sparkles.map((_, i) => (
          <span
            key={i}
            className="absolute animate-sparkle"
            style={{
              left: `${(i * 7 + 5) % 95}%`,
              top: `${(i * 13 + 8) % 90}%`,
              animationDelay: `${(i % 5) * 0.3}s`,
              color: companion.glowColor,
            }}
          >
            <Sparkles size={i % 3 === 0 ? 22 : 14} />
          </span>
        ))}
      </div>

      {/* main card */}
      <div
        className="relative w-full max-w-[380px] card card-pad animate-flyIn"
        style={{ boxShadow: `0 0 0 1px ${companion.glowColor}55, 0 0 60px ${companion.glowColor}55` }}
      >
        {/* aura rings behind companion */}
        <div className="relative flex flex-col items-center">
          <div className="relative mb-2">
            <span className="absolute inset-0 -m-6 rounded-full border-2 animate-ringExpand" style={{ borderColor: companion.glowColor }} />
            <span className="absolute inset-0 -m-6 rounded-full border animate-ringExpand" style={{ borderColor: companion.glowColor, animationDelay: '0.5s' }} />
            <span className="absolute inset-0 -m-10 rounded-full border opacity-30 animate-auraPulse" style={{ borderColor: companion.glowColor }} />
            <CompanionAvatar id={companion.id} glow={companion.glowColor} size={170} />
          </div>

          {/* level badge */}
          <span className="chip border border-neon-amber/50 bg-neon-amber/15 text-neon-amber font-bold animate-auraPulse">
            <Sparkles size={12} /> LEVEL UP!
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">Level {newLevel}</h2>
          <p className="text-sm text-white/55">{rankName} · Scholar-Athlete</p>

          {/* RPG dialogue box */}
          <div
            className="mt-4 w-full rounded-xl border bg-surface2 p-3.5 text-center"
            style={{ borderColor: `${companion.glowColor}55` }}
          >
            <p className="mb-1 text-[10px] uppercase tracking-widest" style={{ color: companion.glowColor }}>
              {companion.customName}
            </p>
            <p className="text-sm leading-relaxed text-white/85">{line}</p>
          </div>

          {/* claim button */}
          <button
            onClick={claim}
            disabled={claimed}
            className="btn-primary mt-4"
          >
            <Gift size={18} />
            {claimed ? '+100 Coins Claimed!' : 'Claim +100 QuestCoin Bonus'}
          </button>
          <button onClick={() => { closeLevelUp(); setClaimed(false); }} className="mt-2 inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/70">
            <X size={12} /> Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

// Persistent floating mini companion widget (bottom-right)
export function CompanionWidget() {
  const { companion, levelUpData } = useGame();
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState<string | null>(null);

  // hide widget while the level-up overlay is showing the full companion
  if (levelUpData?.open) return null;

  function clickWidget() {
    setOpen((o) => !o);
    setTip(pickLine(tipLines[companion.personality]));
  }

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-2">
      {open && tip && (
        <div
          className="animate-slideUp max-w-[240px] rounded-2xl border bg-surface/95 p-3 backdrop-blur-md"
          style={{ borderColor: `${companion.glowColor}55`, boxShadow: `0 0 18px ${companion.glowColor}44` }}
        >
          <p className="mb-1 text-[10px] uppercase tracking-widest font-bold" style={{ color: companion.glowColor }}>
            {companion.customName}
          </p>
          <p className="text-sm leading-snug text-white/85">{tip}</p>
          <button onClick={() => setOpen(false)} className="mt-2 inline-flex items-center gap-1 text-[11px] text-white/40 hover:text-white/70">
            <ChevronUp size={12} /> Hide tip
          </button>
        </div>
      )}
      <button
        onClick={clickWidget}
        className="relative rounded-full transition active:scale-95"
        aria-label={`${companion.customName} companion`}
      >
        <span className="absolute inset-0 rounded-full animate-auraPulse" style={{ boxShadow: `0 0 16px ${companion.glowColor}aa`, background: `${companion.glowColor}22` }} />
        <CompanionAvatar id={companion.id} glow={companion.glowColor} size={64} floating />
      </button>
    </div>
  );
}
