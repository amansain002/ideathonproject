import { useState } from 'react';
import { ChevronRight, Check, Sparkles, Loader2, Plus, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useGame } from '@/context/GameContext';
import {
  onboardingQuestions,
  userTypeOptions,
  skillSuggestions,
  skillColor,
  autoPlanTasks,
  type OnboardingQuestion,
  type UserType,
} from '@/types';

type Phase = 'quiz' | 'usertype' | 'skills' | 'loading' | 'preview';

export function Onboarding({ onFinish }: { onFinish: () => void }) {
  const { setUserType, setSkills, setTasks, addTask } = useGame();
  const [phase, setPhase] = useState<Phase>('quiz');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const [userType, setUserTypeDraft] = useState<UserType>('college');
  const [chosenSkills, setChosenSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');

  const q: OnboardingQuestion | undefined = onboardingQuestions[step];
  const progress =
    phase === 'quiz'
      ? ((step + (selected !== null ? 1 : 0)) / onboardingQuestions.length) * 100
      : phase === 'usertype'
      ? 40
      : phase === 'skills'
      ? 70
      : 100;

  function next() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (step + 1 < onboardingQuestions.length) {
      setStep(step + 1);
    } else {
      setPhase('usertype');
    }
  }

  function selectUserType(t: UserType) {
    setUserTypeDraft(t);
    const suggested = skillSuggestions[t];
    setChosenSkills(suggested.slice(0, 3));
  }

  function toggleSkill(s: string) {
    setChosenSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function addCustomSkill() {
    const trimmed = customSkill.trim();
    if (!trimmed || chosenSkills.includes(trimmed)) return;
    setChosenSkills((prev) => [...prev, trimmed]);
    setCustomSkill('');
  }

  function finishOnboarding() {
    setUserType(userType);
    setSkills(chosenSkills);
    const planned = autoPlanTasks(userType, chosenSkills);
    setTasks(planned);
    setPhase('loading');
    setTimeout(() => setPhase('preview'), 2600);
  }

  if (phase === 'loading') return <LoadingScreen />;

  if (phase === 'preview') {
    return <PreviewScreen answers={answers} userType={userType} skills={chosenSkills} onContinue={onFinish} />;
  }

  if (phase === 'usertype') {
    return (
      <div className="app-frame flex min-h-screen flex-col px-5 pb-6 pt-6">
        <ProgressBar pct={progress} label="Step 5 of 7" />
        <h1 className="heading-xl mb-2">Which best describes you?</h1>
        <p className="muted mb-6">We'll personalize your plan and suggestions.</p>
        <div className="flex-1 space-y-3">
          {userTypeOptions.map((opt) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[opt.icon] ?? Icons.Circle;
            const isSelected = userType === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => selectUserType(opt.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
                  isSelected ? 'border-neon-purple bg-neon-purple/10' : 'border-edge bg-surface hover:border-edge2'
                }`}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${isSelected ? 'bg-neon-purple text-white' : 'bg-surface2 text-white/50'}`}>
                  <Icon size={22} />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-white">{opt.label}</span>
                  <span className="block text-xs text-white/45">{opt.desc}</span>
                </span>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${isSelected ? 'border-neon-purple bg-neon-purple text-white' : 'border-edge2 text-transparent'}`}>
                  <Check size={14} strokeWidth={3} />
                </span>
              </button>
            );
          })}
        </div>
        <button onClick={() => setPhase('skills')} className="btn-primary mt-6">
          Continue <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  if (phase === 'skills') {
    const suggested = skillSuggestions[userType];
    return (
      <div className="app-frame flex min-h-screen flex-col px-5 pb-6 pt-6">
        <ProgressBar pct={progress} label="Step 6 of 7" />
        <h1 className="heading-xl mb-2">Which skills do you want to learn?</h1>
        <p className="muted mb-5">Tap to select. You can change these later.</p>

        <div className="flex-1">
          {/* suggested skills */}
          <p className="label mb-2">Suggested for you</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {suggested.map((s) => {
              const active = chosenSkills.includes(s);
              const color = skillColor(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSkill(s)}
                  className="rounded-xl border px-3.5 py-2 text-sm font-semibold transition active:scale-95"
                  style={{
                    borderColor: active ? color : 'rgba(255,255,255,0.08)',
                    background: active ? `${color}1f` : 'rgba(255,255,255,0.03)',
                    color: active ? color : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {active && <Check size={12} className="mr-1 inline" strokeWidth={3} />}
                  {s}
                </button>
              );
            })}
          </div>

          {/* chosen skills */}
          {chosenSkills.length > 0 && (
            <>
              <p className="label mb-2">Your skills ({chosenSkills.length})</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {chosenSkills.map((s) => {
                  const color = skillColor(s);
                  return (
                    <span key={s} className="chip border" style={{ borderColor: `${color}55`, background: `${color}14`, color }}>
                      {s}
                      <button onClick={() => toggleSkill(s)} className="ml-1 opacity-60">
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            </>
          )}

          {/* add custom skill */}
          <p className="label mb-2">Add your own</p>
          <div className="flex gap-2">
            <input
              className="input flex-1"
              value={customSkill}
              maxLength={24}
              placeholder="e.g. Guitar, French..."
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
            />
            <button onClick={addCustomSkill} className="btn-secondary !w-auto !px-4">
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        <button onClick={finishOnboarding} disabled={chosenSkills.length === 0} className="btn-primary mt-6">
          Continue <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="app-frame flex min-h-screen flex-col px-5 pb-6 pt-6">
      <ProgressBar pct={progress} label={`Question ${step + 1} of ${onboardingQuestions.length}`} />
      <div className="flex-1">
        <h1 className="heading-xl mb-2">{q!.question}</h1>
        {q!.subtitle && <p className="muted mb-6">{q!.subtitle}</p>}
        <div className="space-y-3">
          {q!.options.map((opt, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[opt.icon] ?? Icons.Circle;
            const isSelected = selected === i;
            return (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
                  isSelected ? 'border-neon-purple bg-neon-purple/10' : 'border-edge bg-surface hover:border-edge2'
                }`}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${isSelected ? 'bg-neon-purple text-white' : 'bg-surface2 text-white/50'}`}>
                  <Icon size={20} />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-white">{opt.label}</span>
                  {opt.desc && <span className="block text-xs text-white/45">{opt.desc}</span>}
                </span>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${isSelected ? 'border-neon-purple bg-neon-purple text-white' : 'border-edge2 text-transparent'}`}>
                  <Check size={14} strokeWidth={3} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <button onClick={next} disabled={selected === null} className="btn-primary mt-6">
        Continue <ChevronRight size={20} />
      </button>
    </div>
  );
}

function ProgressBar({ pct, label }: { pct: number; label: string }) {
  return (
    <div className="mb-8">
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-surface2">
        <div className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-blue transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="muted-sm">{label}</p>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="app-frame flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 -m-4 animate-auraPulse rounded-full border-2 border-neon-purple/40" />
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-neon-purple to-neon-blue shadow-glow-blue">
          <Sparkles size={36} className="text-white" />
        </div>
      </div>
      <h1 className="heading-lg mb-2">Building your personalized plan...</h1>
      <p className="muted max-w-[260px] mb-6">Analyzing your goals and skills to craft the optimal daily quest loadout.</p>
      <div className="h-2 w-56 overflow-hidden rounded-full bg-surface2">
        <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
      </div>
      <Loader2 size={20} className="mt-4 animate-spin text-neon-purple" />
    </div>
  );
}

function PreviewScreen({ answers, userType, skills, onContinue }: { answers: number[]; userType: UserType; skills: string[]; onContinue: () => void }) {
  const goals = onboardingQuestions[0].options[answers[0] ?? 0].label;
  const intensity = onboardingQuestions[3].options[answers[3] ?? 1].label;
  const utLabel = userTypeOptions.find((u) => u.id === userType)?.label ?? 'Learner';

  return (
    <div className="app-frame flex min-h-screen flex-col px-5 pb-6 pt-10">
      <div className="flex flex-1 flex-col items-center text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-neon-purple to-neon-blue shadow-glow-blue">
          <Sparkles size={36} className="text-white" />
        </div>
        <h1 className="heading-xl mb-2">Your plan is ready</h1>
        <p className="muted max-w-[280px] mb-6">
          A <span className="font-semibold text-white">{intensity}</span> plan for a <span className="font-semibold text-white">{utLabel}</span> focused on <span className="font-semibold text-white">{goals}</span>.
        </p>

        <div className="w-full space-y-3 text-left">
          <div className="card card-pad flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface2 text-neon-purple"><Icons.Target size={18} /></span>
            <div>
              <p className="text-sm font-bold text-white">{skills.length} skills selected</p>
              <p className="muted-sm">{skills.slice(0, 4).join(', ')}{skills.length > 4 ? '...' : ''}</p>
            </div>
          </div>
          {[
            { icon: 'GraduationCap', t: 'Ranked skill trees', d: 'Climb tiers in every skill' },
            { icon: 'Wallet', t: 'UPI budget tracking', d: 'Forecast & save automatically' },
            { icon: 'Dumbbell', t: 'Gym rank progression', d: 'Log sets, earn Rank Points' },
            { icon: 'Lock', t: 'Lock-In enforcer', d: 'Block distractions until you earn them' },
          ].map((row) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[row.icon] ?? Icons.Circle;
            return (
              <div key={row.t} className="card card-pad flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface2 text-neon-purple">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{row.t}</p>
                  <p className="muted-sm">{row.d}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={onContinue} className="btn-primary mt-6">
        Start Free <ChevronRight size={20} />
      </button>
    </div>
  );
}
