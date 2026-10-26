import { useState } from 'react';
import {
  Wallet, Dumbbell, BrainCircuit, Lock, ScanLine, Activity, Receipt, BookOpen,
  ChevronRight, ArrowLeft, Plus, Utensils, Bus, BookMarked, Gamepad2,
  Check, X, Camera, Shield, Play, Timer, Unlock, Flame, TrendingUp, PiggyBank,
} from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { TierBadge } from '@/components/TierBadge';
import { ScoreGauge, BarRow, SectionHeader, EmptyState } from '@/components/ui';
import { Modal } from '@/components/Modal';
import {
  blockedApps, quizQuestions, runScanner, type ToolPage, type ScannerType, type Expense,
} from '@/types';
import * as Icons from 'lucide-react';

const tools: { id: ToolPage; title: string; desc: string; icon: React.ReactNode; color: string }[] = [
  { id: 'wallet', title: 'UPI Budget Tracker', desc: 'Track spending & forecast savings', icon: <Wallet size={22} />, color: '#10B981' },
  { id: 'workout', title: 'Workout Logger', desc: 'Log sets, climb muscle ranks', icon: <Dumbbell size={22} />, color: '#F59E0B' },
  { id: 'quiz', title: 'Coding Sprint Quiz', desc: 'Quick flashcards for XP', icon: <BrainCircuit size={22} />, color: '#38BDF8' },
  { id: 'lockin', title: 'Lock-In Enforcer', desc: 'Block distractions, earn unlocks', icon: <Lock size={22} />, color: '#EF4444' },
  { id: 'scanner-physique', title: 'Physique Scan', desc: 'AI posture & symmetry critique', icon: <Activity size={22} />, color: '#F59E0B' },
  { id: 'scanner-bank', title: 'UPI Audit Roast', desc: 'AI critiques your spending', icon: <Receipt size={22} />, color: '#10B981' },
  { id: 'scanner-desk', title: 'Desk Readiness Scan', desc: 'Score your focus environment', icon: <BookOpen size={22} />, color: '#8B5CF6' },
];

export function ToolsTab() {
  const [page, setPage] = useState<ToolPage | null>(null);

  if (page) return <ToolDetail page={page} onBack={() => setPage(null)} />;

  return (
    <div className="animate-slideUp space-y-5 px-5 pb-6 pt-8">
      <div>
        <p className="muted-sm">AI-powered tools</p>
        <h1 className="heading-xl">Tools</h1>
      </div>

      {/* featured scanner trio */}
      <div className="grid grid-cols-3 gap-2.5">
        {([
          { id: 'scanner-physique' as ToolPage, icon: <Activity size={20} />, color: '#F59E0B', label: 'Physique' },
          { id: 'scanner-bank' as ToolPage, icon: <Receipt size={20} />, color: '#10B981', label: 'UPI Audit' },
          { id: 'scanner-desk' as ToolPage, icon: <BookOpen size={20} />, color: '#8B5CF6', label: 'Desk Scan' },
        ]).map((s) => (
          <button
            key={s.id}
            onClick={() => setPage(s.id)}
            className="card card-pad flex flex-col items-center gap-2 transition active:scale-95"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${s.color}1f`, color: s.color }}>
              {s.icon}
            </span>
            <span className="text-[11px] font-semibold text-white">{s.label}</span>
          </button>
        ))}
      </div>

      {/* full tool list */}
      <div className="space-y-2.5">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setPage(t.id)}
            className="card card-pad flex w-full items-center gap-3 text-left transition active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: `${t.color}1f`, color: t.color }}>
              {t.icon}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-bold text-white">{t.title}</span>
              <span className="block text-xs text-white/45">{t.desc}</span>
            </span>
            <ChevronRight size={18} className="text-white/30" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ToolDetail({ page, onBack }: { page: ToolPage; onBack: () => void }) {
  const tool = tools.find((t) => t.id === page)!;
  return (
    <div className="animate-slideInRight min-h-screen">
      {/* header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-edge bg-ink/90 px-4 py-3 backdrop-blur-xl">
        <button onClick={onBack} className="rounded-xl p-1.5 text-white/60 hover:bg-surface2 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${tool.color}1f`, color: tool.color }}>
          {tool.icon}
        </span>
        <div>
          <p className="text-sm font-bold text-white">{tool.title}</p>
          <p className="muted-sm">{tool.desc}</p>
        </div>
      </div>

      <div className="px-5 pb-6 pt-5">
        {page === 'wallet' && <WalletTool />}
        {page === 'workout' && <WorkoutTool />}
        {page === 'quiz' && <QuizTool />}
        {page === 'lockin' && <LockInTool />}
        {(page === 'scanner-physique' || page === 'scanner-bank' || page === 'scanner-desk') && (
          <ScannerTool type={page.replace('scanner-', '') as ScannerType} color={tool.color} icon={tool.icon} title={tool.title} />
        )}
      </div>
    </div>
  );
}

// ---------- UPI Wallet (PocketLedger content, unchanged logic) ----------
function WalletTool() {
  const { expenses, addExpense } = useGame();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Food/Canteen');
  const [note, setNote] = useState('');

  const budget = 6000;
  const spent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budget - spent;
  const spentPct = Math.min(100, (spent / budget) * 100);
  const projectedSave = Math.max(0, remaining - 850);
  const impulseSpent = expenses.filter((e) => e.category === 'Impulse/Fun').reduce((s, e) => s + e.amount, 0);
  const canteenSpent = expenses.filter((e) => e.category === 'Food/Canteen').reduce((s, e) => s + e.amount, 0);

  const categories: { key: Expense['category']; icon: React.ReactNode; color: string }[] = [
    { key: 'Food/Canteen', icon: <Utensils size={14} />, color: '#F59E0B' },
    { key: 'Travel', icon: <Bus size={14} />, color: '#38BDF8' },
    { key: 'Tech/Books', icon: <BookMarked size={14} />, color: '#8B5CF6' },
    { key: 'Impulse/Fun', icon: <Gamepad2 size={14} />, color: '#EF4444' },
  ];

  function submit() {
    const amt = parseInt(amount, 10);
    if (!amt || amt <= 0) return;
    addExpense({ amount: amt, category, note: note || '—' });
    setAmount('');
    setNote('');
  }

  return (
    <div className="space-y-4">
      {/* budget hero */}
      <div className="card card-pad">
        <div className="mb-1 flex items-center justify-between">
          <p className="muted-sm">Monthly Allowance</p>
          <span className={`chip ${remaining > 1500 ? 'text-neon-emerald' : 'text-neon-amber'}`} style={{ background: remaining > 1500 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)' }}>
            ₹{remaining} left
          </span>
        </div>
        <p className="font-display text-3xl font-extrabold text-white">₹{spent.toLocaleString()}</p>
        <p className="muted-sm">of ₹{budget.toLocaleString()}</p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-surface2">
          <div
            className={`h-full rounded-full ${spentPct > 80 ? 'bg-neon-crimson' : spentPct > 60 ? 'bg-neon-amber' : 'bg-neon-emerald'}`}
            style={{ width: `${spentPct}%`, transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)' }}
          />
        </div>
      </div>

      {/* forecast + streak */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="card card-pad">
          <TrendingUp size={16} className="mb-1 text-neon-emerald" />
          <p className="muted-sm">Forecast</p>
          <p className="font-display text-lg font-bold text-neon-emerald">₹{projectedSave}</p>
          <p className="text-[10px] text-white/40">Emerald Saver rank</p>
        </div>
        <div className="card card-pad">
          <PiggyBank size={16} className="mb-1 text-neon-amber" />
          <p className="muted-sm">Savings streak</p>
          <p className="font-display text-lg font-bold text-neon-amber">11 days</p>
          <p className="text-[10px] text-white/40">Stay under budget</p>
        </div>
      </div>

      {/* expense logger */}
      <div className="card card-pad space-y-3">
        <h3 className="heading-md">Add Expense</h3>
        <input className="input" inputMode="numeric" placeholder="Amount ₹" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} />
        <div className="grid grid-cols-2 gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${category === c.key ? '' : 'border-edge bg-surface text-white/60'}`}
              style={category === c.key ? { borderColor: `${c.color}66`, background: `${c.color}1f`, color: c.color } : undefined}
            >
              {c.icon} {c.key}
            </button>
          ))}
        </div>
        <input className="input" placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
        <button onClick={submit} className="btn-primary !h-12"><Plus size={18} /> Log Expense</button>
      </div>

      {/* transactions */}
      <div className="card card-pad">
        <h3 className="heading-md mb-3">Recent</h3>
        <div className="space-y-2">
          {expenses.map((e) => {
            const cat = categories.find((c) => c.key === e.category)!;
            return (
              <div key={e.id} className="flex items-center gap-3 rounded-xl border border-edge bg-surface2 p-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${cat.color}1f`, color: cat.color }}>
                  {cat.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{e.note}</p>
                  <p className="text-[11px] text-white/40">{e.category} · {e.time}</p>
                </div>
                <span className="font-display text-sm font-bold" style={{ color: cat.color }}>−₹{e.amount}</span>
              </div>
            );
          })}
          {expenses.length === 0 && <EmptyState icon={<Wallet size={24} />} title="No expenses yet" />}
        </div>
      </div>

      {/* impulse vault */}
      <div className="card card-pad">
        <h3 className="heading-md mb-3 flex items-center gap-2"><Lock size={16} className="text-neon-crimson" /> Impulse Spend Blocker</h3>
        <div className="space-y-2.5">
          <div className={`rounded-xl border p-3 ${canteenSpent > 400 ? 'border-neon-crimson/50 bg-neon-crimson/10' : 'border-neon-emerald/40 bg-neon-emerald/10'}`}>
            <p className="muted-sm">Canteen / Snacks</p>
            <p className="font-display text-xl font-bold text-white">₹{canteenSpent}</p>
            <p className={`text-[11px] ${canteenSpent > 400 ? 'text-neon-crimson' : 'text-neon-emerald'}`}>
              {canteenSpent > 400 ? 'Over limit — rank dropping' : 'Within limit — XP secured'}
            </p>
          </div>
          <div className="rounded-xl border border-neon-crimson/40 bg-neon-crimson/10 p-3">
            <p className="muted-sm">Fun / Impulse Vault</p>
            <p className="font-display text-xl font-bold text-white">₹{impulseSpent}</p>
            <p className="text-[11px] text-neon-crimson">Locked — complete a Lock-In challenge</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Workout Logger ----------
function WorkoutTool() {
  const { muscleRanks, setLogs, logSet } = useGame();
  const exercises = [
    { name: 'Bench Press', muscle: 'Chest' },
    { name: 'Squat', muscle: 'Legs' },
    { name: 'Pull-ups', muscle: 'Back' },
    { name: 'Push-ups', muscle: 'Arms' },
    { name: 'Plank', muscle: 'Core' },
  ];
  const [exercise, setExercise] = useState(exercises[0].name);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [lastRp, setLastRp] = useState<number | null>(null);
  const active = exercises.find((e) => e.name === exercise)!;

  function submit() {
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    if (!w || !r) return;
    logSet({ exercise, weight: w, reps: r, muscle: active.muscle });
    setLastRp(Math.max(6, Math.round(w / 6 + r)));
    setWeight('');
    setReps('');
    setTimeout(() => setLastRp(null), 3500);
  }

  return (
    <div className="space-y-4">
      {/* muscle ranks */}
      <div className="card card-pad">
        <h3 className="heading-md mb-3">Muscle Ranks</h3>
        <div className="space-y-2.5">
          {muscleRanks.map((m) => (
            <div key={m.group} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{m.group}</span>
                  <TierBadge tier={m.tier} size="sm" />
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface2">
                  <div className="h-full rounded-full" style={{ width: `${m.progress}%`, background: m.tier.color, transition: 'width 0.7s' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* set logger */}
      <div className="card card-pad space-y-3">
        <h3 className="heading-md">Log a Set</h3>
        <div className="grid grid-cols-3 gap-2">
          {exercises.map((e) => (
            <button key={e.name} onClick={() => setExercise(e.name)}
              className={`rounded-xl border px-2 py-2 text-[11px] font-semibold transition ${exercise === e.name ? 'border-neon-amber/60 bg-neon-amber/15 text-neon-amber' : 'border-edge bg-surface text-white/60'}`}>
              {e.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className="input" inputMode="decimal" placeholder="Weight kg" value={weight} onChange={(e) => setWeight(e.target.value.replace(/[^\d.]/g, ''))} />
          <input className="input" inputMode="numeric" placeholder="Reps" value={reps} onChange={(e) => setReps(e.target.value.replace(/\D/g, ''))} />
        </div>
        <button onClick={submit} className="btn-primary !h-12"><Plus size={18} /> Log Set</button>
        {lastRp !== null && (
          <div className="animate-slideUp rounded-xl border border-neon-amber/50 bg-neon-amber/10 p-3 text-center">
            <p className="text-sm font-bold text-neon-amber">+{lastRp} RP toward {active.muscle}!</p>
          </div>
        )}
      </div>

      {/* history */}
      <div className="card card-pad">
        <h3 className="heading-md mb-3">Recent Sets</h3>
        <div className="space-y-2">
          {setLogs.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-edge bg-surface2 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-amber/15 text-neon-amber"><Dumbbell size={16} /></span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{s.exercise}</p>
                <p className="text-[11px] text-white/40">{s.muscle} · {s.weight}kg × {s.reps}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-sm font-bold text-white">1RM {s.oneRm}kg</p>
                <p className="text-[11px] text-neon-amber">+{s.rpGain} RP</p>
              </div>
            </div>
          ))}
          {setLogs.length === 0 && <EmptyState icon={<Dumbbell size={24} />} title="No sets logged" />}
        </div>
      </div>
    </div>
  );
}

// ---------- Quiz ----------
function QuizTool() {
  const { addXp } = useGame();
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  function answer(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === quizQuestions[qIdx].answer) setCorrect((c) => c + 1);
    setTimeout(() => {
      if (qIdx + 1 < quizQuestions.length) { setQIdx(qIdx + 1); setSelected(null); }
      else { setFinished(true); addXp(60, 15); }
    }, 1100);
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon-emerald/20 text-neon-emerald border border-neon-emerald/50">
          <Check size={32} strokeWidth={3} />
        </div>
        <p className="heading-lg">{correct}/{quizQuestions.length} correct</p>
        <p className="muted">+60 XP · +15 coins earned</p>
        <button onClick={() => { setQIdx(0); setSelected(null); setCorrect(0); setFinished(false); }} className="btn-primary !h-12 mt-5 w-48">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="muted-sm">Question {qIdx + 1} of {quizQuestions.length}</p>
      <h2 className="heading-lg">{quizQuestions[qIdx].q}</h2>
      <div className="space-y-2.5">
        {quizQuestions[qIdx].options.map((opt, i) => {
          const isCorrect = i === quizQuestions[qIdx].answer;
          const isPicked = selected === i;
          let style = 'border-edge bg-surface';
          if (selected !== null) {
            if (isCorrect) style = 'border-neon-emerald/60 bg-neon-emerald/15 text-neon-emerald';
            else if (isPicked) style = 'border-neon-crimson/60 bg-neon-crimson/15 text-neon-crimson';
            else style = 'border-edge bg-surface opacity-50';
          }
          return (
            <button key={i} onClick={() => answer(i)} disabled={selected !== null}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-sm font-medium transition ${style}`}>
              <span>{opt}</span>
              {selected !== null && isCorrect && <Check size={16} strokeWidth={3} />}
              {selected !== null && isPicked && !isCorrect && <X size={16} strokeWidth={3} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Lock-In ----------
function LockInTool() {
  const { funWalletUnlocked, unlockFunWallet, screenTimeMinutes, addScreenTime, addXp } = useGame();
  const [verify, setVerify] = useState<'pushup' | 'quiz' | null>(null);
  const [reps, setReps] = useState(0);
  const [quizAns, setQuizAns] = useState<number | null>(null);
  const quizQ = { q: 'You get ₹6000/mo, spent ₹4200 by day 18. Daily budget to save ₹850?', options: ['₹45/day', '₹60/day', '₹75/day', '₹90/day'], answer: 0 };

  function logRep() {
    const n = reps + 1;
    setReps(n);
    if (n >= 15) { unlockFunWallet(); addXp(50, 12); setVerify(null); }
  }
  function answerQuiz(i: number) {
    if (quizAns !== null) return;
    setQuizAns(i);
    setTimeout(() => {
      if (i === quizQ.answer) { unlockFunWallet(); addXp(50, 12); setVerify(null); }
      else setTimeout(() => setQuizAns(null), 1200);
    }, 900);
  }

  return (
    <div className="space-y-4">
      {/* blocked apps */}
      <div className="card card-pad">
        <h3 className="heading-md mb-3 flex items-center gap-2"><Lock size={16} className="text-neon-crimson" /> Blocked Distractions</h3>
        <div className="grid grid-cols-3 gap-3">
          {blockedApps.map((a) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[a.icon] ?? Icons.AppWindow;
            return (
              <div key={a.name} className="relative rounded-xl border border-edge bg-surface p-3 text-center overflow-hidden">
                {!funWalletUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/70 backdrop-blur-[2px]">
                    <Lock size={18} className="text-neon-crimson" />
                  </div>
                )}
                <div className="mx-auto mb-1.5 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${a.color}1f`, color: a.color }}>
                  <Icon size={18} />
                </div>
                <p className="text-xs font-semibold text-white">{a.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* fun wallet */}
      <div className={`card card-pad ${funWalletUnlocked ? 'border-neon-emerald/50' : 'border-neon-crimson/40'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="muted-sm">Weekend Fun Wallet</p>
            <p className="font-display text-2xl font-bold text-white">₹500</p>
          </div>
          {funWalletUnlocked ? (
            <span className="chip border border-neon-emerald/50 bg-neon-emerald/15 text-neon-emerald"><Unlock size={12} /> {screenTimeMinutes}m</span>
          ) : (
            <span className="chip border border-neon-crimson/50 bg-neon-crimson/15 text-neon-crimson"><Lock size={12} /> Locked</span>
          )}
        </div>
      </div>

      {/* unlock challenges */}
      {!funWalletUnlocked ? (
        <div className="card card-pad space-y-3">
          <p className="muted-sm">Complete one challenge to unlock:</p>
          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={() => setVerify('pushup')} className="btn-secondary !border-neon-crimson/40 !text-neon-crimson">
              <Camera size={16} /> Push-Up Verify
            </button>
            <button onClick={() => setVerify('quiz')} className="btn-secondary !border-neon-purple/40 !text-neon-purple">
              <BrainCircuit size={16} /> Academic Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="card card-pad border-neon-emerald/40 bg-neon-emerald/10 text-center">
          <p className="text-sm font-semibold text-neon-emerald">Lock-In cleared! 30 min unlocked.</p>
          <button onClick={() => addScreenTime(-5)} className="btn-ghost mt-2 !w-auto">Use 5 min</button>
        </div>
      )}

      {/* verification modals */}
      <Modal open={verify === 'pushup'} onClose={() => { setVerify(null); setReps(0); }} title="Push-Up Verification" subtitle="15 reps to unlock" accent="#EF4444" icon={<Camera size={18} />}>
        <div className="relative mb-4 aspect-video overflow-hidden rounded-xl border border-neon-crimson/40 bg-surface2">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20">
              <span className="font-display text-3xl font-bold text-white">{reps}</span>
            </div>
            <p className="mt-2 text-xs text-white/60">Simulated viewfinder</p>
          </div>
          <div className="absolute left-3 top-3 chip border border-neon-crimson/50 bg-ink/70 text-neon-crimson text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-crimson animate-pulse" /> REC
          </div>
        </div>
        <button onClick={logRep} disabled={reps >= 15} className="btn-primary !h-12">Log Rep ({reps}/15)</button>
      </Modal>

      <Modal open={verify === 'quiz'} onClose={() => { setVerify(null); setQuizAns(null); }} title="FinTech Challenge" accent="#8B5CF6" icon={<BrainCircuit size={18} />}>
        <p className="mb-4 text-sm font-semibold text-white">{quizQ.q}</p>
        <div className="space-y-2">
          {quizQ.options.map((opt, i) => {
            const isCorrect = i === quizQ.answer;
            const isPicked = quizAns === i;
            let style = 'border-edge bg-surface';
            if (quizAns !== null) {
              if (isCorrect) style = 'border-neon-emerald/60 bg-neon-emerald/15 text-neon-emerald';
              else if (isPicked) style = 'border-neon-crimson/60 bg-neon-crimson/15 text-neon-crimson';
              else style = 'border-edge bg-surface opacity-50';
            }
            return (
              <button key={i} onClick={() => answerQuiz(i)} disabled={quizAns !== null} className={`flex w-full items-center justify-between rounded-xl border p-4 text-sm font-medium ${style}`}>
                <span>{opt}</span>
                {quizAns !== null && isCorrect && <Check size={16} strokeWidth={3} />}
                {quizAns !== null && isPicked && !isCorrect && <X size={16} strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}

// ---------- Scanner ----------
function ScannerTool({ type, color, icon, title }: { type: ScannerType; color: string; icon: React.ReactNode; title: string }) {
  const { addXp } = useGame();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof runScanner> | null>(null);

  function start() {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setResult(runScanner(type));
      setScanning(false);
      addXp(20, 5);
    }, 2200);
  }

  return (
    <div className="space-y-4">
      {!result && !scanning && (
        <div className="card card-pad flex flex-col items-center py-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: `${color}1f`, color }}>
            {icon}
          </div>
          <p className="heading-md">{title}</p>
          <p className="muted max-w-[260px] mt-1">Tap to run a mock AI analysis and get your score.</p>
          <button onClick={start} className="btn-primary !h-12 mt-5 w-48">
            <Play size={18} /> Run Scan
          </button>
        </div>
      )}

      {scanning && (
        <div className="card card-pad flex flex-col items-center py-12">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-2 animate-auraPulse" style={{ borderColor: `${color}55`, background: `${color}0f` }}>
            <ScanLine size={36} className="animate-spinSlow" style={{ color }} />
          </div>
          <p className="heading-md">Analyzing…</p>
          <p className="muted-sm">AI is scanning your data.</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* score gauge */}
          <div className="card card-pad flex flex-col items-center">
            <ScoreGauge score={result.score} color={color} />
            <p className="heading-md mt-1">
              {result.score >= 75 ? 'Solid' : result.score >= 60 ? 'Needs Work' : 'Wake Up'}
            </p>
            <p className="muted-sm">Critique AI verdict · +20 XP</p>
          </div>

          {/* category bars (mock breakdown) */}
          <div className="card card-pad space-y-3">
            <SectionHeader title="Breakdown" />
            <BarRow label={type === 'physique' ? 'Symmetry' : type === 'bank' ? 'Discipline' : 'Focus'} value={result.score} color={color} />
            <BarRow label={type === 'physique' ? 'Posture' : type === 'bank' ? 'Savings rate' : 'Lighting'} value={Math.max(30, result.score - 12)} color={color} />
            <BarRow label={type === 'physique' ? 'Balance' : type === 'bank' ? 'Impulse control' : 'Coverage'} value={Math.max(20, result.score - 25)} color={color} />
          </div>

          {/* what's working / to improve */}
          <div className="card card-pad">
            <SectionHeader title="Critique" />
            <div className="space-y-2">
              {result.lines.map((line, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-xl border border-edge bg-surface2 p-3 text-sm text-white/80">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold" style={{ background: `${color}22`, color }}>
                    {i + 1}
                  </span>
                  {line}
                </div>
              ))}
            </div>
          </div>

          <button onClick={start} className="btn-secondary !h-12">Run Again</button>
        </div>
      )}
    </div>
  );
}
