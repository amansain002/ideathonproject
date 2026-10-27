import { useState } from 'react';
import { Copy, Share2, Trophy, Check, Users } from 'lucide-react';
import { leaderboard } from '@/types';
import { EmptyState } from '@/components/ui';

export function FriendsTab() {
  const [copied, setCopied] = useState(false);
  const inviteCode = 'SKQ-LOCK-X7F2';

  function copy() {
    navigator.clipboard?.writeText(inviteCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: 'UpLevel — Learn. Earn. Grow.', text: `Join me on UpLevel! Use my invite code: ${inviteCode}` }).catch(() => {});
    } else {
      copy();
    }
  }

  return (
    <div className="animate-slideUp space-y-5 px-5 pb-6 pt-8">
      <div>
        <p className="muted-sm">Compete with your circle</p>
        <h1 className="heading-xl">Friends</h1>
      </div>

      {/* invite code */}
      <div className="card card-pad">
        <div className="mb-3 flex items-center gap-2">
          <Users size={16} className="text-neon-purple" />
          <h2 className="heading-md">Invite Code</h2>
        </div>
        <div className="mb-3 flex items-center justify-between rounded-2xl border border-edge2 bg-surface2 px-4 py-3">
          <span className="font-display text-base font-bold tracking-wider text-white">{inviteCode}</span>
          {copied && <span className="chip border border-neon-emerald/50 bg-neon-emerald/15 text-neon-emerald"><Check size={12} /> Copied</span>}
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={copy} className="btn-secondary">
            <Copy size={16} /> {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={share} className="btn-primary !h-12">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      {/* leaderboard */}
      <div className="card card-pad">
        <div className="mb-3 flex items-center gap-2">
          <Trophy size={16} className="text-neon-amber" />
          <h2 className="heading-md">Campus Leaderboard</h2>
        </div>
        <div className="space-y-2">
          {leaderboard.map((p) => (
            <div
              key={p.rank}
              className={`flex items-center gap-3 rounded-2xl border p-3 ${p.you ? 'border-neon-purple/50 bg-neon-purple/10' : 'border-edge bg-surface2'}`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl font-display text-sm font-bold ${
                p.rank === 1 ? 'bg-neon-amber/20 text-neon-amber' : p.rank === 2 ? 'bg-white/10 text-white/80' : p.rank === 3 ? 'bg-neon-amber/10 text-neon-amber/70' : 'bg-surface text-white/50'
              }`}>
                {p.rank}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-bold ${p.you ? 'text-neon-purple' : 'text-white'}`}>
                  {p.name} {p.you && <span className="text-[10px]">(You)</span>}
                </p>
                <p className="text-[11px] text-white/40">Lvl {p.level} · {p.tier}</p>
              </div>
              <span className="font-display text-sm font-bold tabular-nums text-white">{p.xp.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* empty friend requests */}
      <div className="card card-pad">
        <EmptyState icon={<Users size={24} />} title="No friend requests" subtitle="Share your invite code to add friends and climb the ranks together." />
      </div>
    </div>
  );
}
