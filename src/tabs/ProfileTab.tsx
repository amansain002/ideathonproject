import { useState } from 'react';
import * as Icons from 'lucide-react';
import {
  Settings, Bell, Shield, Moon, HelpCircle, LogOut, ChevronRight,
  Crown, Sparkles, Heart, Zap, Palette, Wand2, Check, Coins, Flame, RotateCcw,
  Plus, X, GraduationCap, Volume2, VolumeX, Play, AlertTriangle, HandHeart,
  type LucideIcon,
} from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { CompanionAvatar } from '@/components/CompanionAvatar';
import {
  companionPresets, userTypeOptions, skillSuggestions, skillColor,
  personalityLabels, intensityLabels,
  type PersonalityTone, type UserType, type CoachIntensity, type CoachLanguage,
} from '@/types';
import { useCoachVoice } from '@/coach/useCoachVoice';

const glowSwatches = [
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Sky', hex: '#38BDF8' },
  { name: 'Crimson', hex: '#EF4444' },
  { name: 'Gold', hex: '#F59E0B' },
  { name: 'Pink', hex: '#EC4899' },
];

const personalityIcons: Record<PersonalityTone, LucideIcon> = {
  supportive: Heart,
  hype: Zap,
  strict: Shield,
  calm: HandHeart,
  savage: AlertTriangle,
};

const intensityOrder: CoachIntensity[] = ['gentle', 'balanced', 'tough', 'savage'];
const languageOptions: { id: CoachLanguage; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'Hindi' },
  { id: 'hinglish', label: 'Hinglish' },
];

const previewLines: Record<PersonalityTone, string> = {
  supportive: 'You did it! Every step counts toward the legend you are becoming.',
  hype: 'SUGOI! You absolutely CLUTCHED that! Nobody can keep up with you!',
  strict: 'Good. But one task is not a victory — it is a minimum. Back to work.',
  calm: 'A small step today is enough. There is no rush — just a gentle next move.',
  savage: 'The to-do list is side-eyeing you. Maybe give it some attention today.',
};

const settingsRows = [
  { icon: Bell, label: 'Notifications', desc: 'Quest reminders & alerts' },
  { icon: Shield, label: 'Privacy', desc: 'Data & visibility' },
  { icon: Moon, label: 'Appearance', desc: 'Dark mode (always on)' },
  { icon: HelpCircle, label: 'Help & Support', desc: 'FAQ & contact' },
  { icon: LogOut, label: 'Sign Out', desc: 'See you back soon' },
];

export function ProfileTab({ onRestart }: { onRestart: () => void }) {
  const {
    companion, setCompanion, setCompanionPreset, level, xp, coins, streak, rankName, triggerLevelUp,
    userType, setUserType, skills, addSkill, removeSkill,
    coachSettings, setCoachSettings, markStruggling, coachMemory,
  } = useGame();
  const voice = useCoachVoice(companion.personality);
  const [nameDraft, setNameDraft] = useState(companion.customName);
  const [customSkill, setCustomSkill] = useState('');
  const [showSavageWarn, setShowSavageWarn] = useState(false);
  const activePreset = companionPresets.find((p) => p.id === companion.id)!;
  const utLabel = userTypeOptions.find((u) => u.id === userType)?.label ?? 'Learner';
  const isStruggling = coachSettings.strugglingUntil !== null && Date.now() < coachSettings.strugglingUntil;

  function applyName() {
    const trimmed = nameDraft.trim();
    setCompanion({ ...companion, customName: trimmed || activePreset.defaultName });
  }

  function selectPersonality(p: PersonalityTone) {
    if (p === 'savage' && coachSettings.intensity !== 'savage') {
      setShowSavageWarn(true);
      return;
    }
    setCompanion({ ...companion, personality: p });
  }

  function selectIntensity(i: CoachIntensity) {
    if (i === 'savage') {
      setShowSavageWarn(true);
      return;
    }
    setCoachSettings({ intensity: i });
  }

  function confirmSavage() {
    setShowSavageWarn(false);
    setCoachSettings({ intensity: 'savage' });
    setCompanion({ ...companion, personality: 'savage' });
  }

  function previewPersonality(p: PersonalityTone) {
    voice.preview(p, previewLines[p]);
  }

  return (
    <div className="animate-slideUp space-y-5 px-5 pb-6 pt-8">
      <div>
        <p className="muted-sm">Your account</p>
        <h1 className="heading-xl">Profile</h1>
      </div>

      {/* profile header */}
      <div className="card card-pad flex flex-col items-center text-center">
        <div className="relative mb-3">
          <CompanionAvatar id={companion.id} glow={companion.glowColor} size={84} floating />
        </div>
        <p className="heading-md">Scholar-Athlete</p>
        <p className="muted-sm">{rankName}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="chip border border-neon-purple/40 bg-neon-purple/15 text-neon-purple">
            <Sparkles size={12} /> Lvl {level}
          </span>
          <span className="chip border border-neon-emerald/40 bg-neon-emerald/10 text-neon-emerald">
            <Coins size={12} /> {coins}
          </span>
          <span className="chip border border-neon-amber/40 bg-neon-amber/10 text-neon-amber">
            <Flame size={12} /> {streak}
          </span>
        </div>
        <p className="mt-2 text-xs text-white/45">{xp.toLocaleString()} total XP</p>
        <button onClick={triggerLevelUp} className="btn-secondary !h-10 mt-3 w-44">
          <Sparkles size={14} /> Trigger Level-Up
        </button>
      </div>

      {/* free badge */}
      <div className="card card-pad border-neon-emerald/30">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-emerald to-neon-sky text-white shadow-glow-emerald">
            <Crown size={20} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">UpLevel Free</p>
            <p className="text-[11px] text-white/45">All features unlocked · no payment</p>
          </div>
          <span className="chip border border-neon-emerald/50 bg-neon-emerald/10 text-neon-emerald">FREE</span>
        </div>
      </div>

      {/* user type */}
      <div className="card card-pad space-y-3">
        <h2 className="heading-md flex items-center gap-2"><GraduationCap size={16} className="text-neon-purple" /> Your Profile</h2>
        <p className="muted-sm">Currently: <span className="font-semibold text-white">{utLabel}</span></p>
        <div className="grid grid-cols-2 gap-2">
          {userTypeOptions.map((opt) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[opt.icon] ?? Icons.Circle;
            const isActive = userType === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setUserType(opt.id as UserType)}
                className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition active:scale-[0.98] ${isActive ? 'border-neon-purple bg-neon-purple/10' : 'border-edge bg-surface'}`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-neon-purple text-white' : 'bg-surface2 text-white/50'}`}>
                  <Icon size={16} />
                </span>
                <span className="min-w-0">
                  <span className={`block text-xs font-bold ${isActive ? 'text-neon-purple' : 'text-white'}`}>{opt.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* skills */}
      <div className="card card-pad space-y-3">
        <h2 className="heading-md flex items-center gap-2"><Sparkles size={16} className="text-neon-purple" /> My Skills</h2>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => {
              const color = skillColor(s);
              return (
                <span key={s} className="chip border" style={{ borderColor: `${color}55`, background: `${color}14`, color }}>
                  {s}
                  <button onClick={() => removeSkill(s)} className="ml-1 opacity-60"><X size={12} /></button>
                </span>
              );
            })}
          </div>
        ) : (
          <p className="muted-sm">No skills yet. Add some below.</p>
        )}
        <p className="label mt-2">Suggested</p>
        <div className="flex flex-wrap gap-2">
          {skillSuggestions[userType].filter((s) => !skills.includes(s)).map((s) => {
            const color = skillColor(s);
            return (
              <button key={s} onClick={() => addSkill(s)} className="rounded-lg border border-edge bg-surface px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:text-white">
                <Plus size={10} className="mr-1 inline" />{s}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 pt-1">
          <input
            className="input flex-1"
            value={customSkill}
            maxLength={24}
            placeholder="Add your own skill..."
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { addSkill(customSkill); setCustomSkill(''); } }}
          />
          <button onClick={() => { addSkill(customSkill); setCustomSkill(''); }} className="btn-secondary !w-auto !px-4">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* companion customizer */}
      <div className="card card-pad space-y-4">
        <h2 className="heading-md flex items-center gap-2"><Wand2 size={16} className="text-neon-purple" /> Companion</h2>

        {/* presets */}
        <div className="grid grid-cols-5 gap-2">
          {companionPresets.map((p) => {
            const isActive = p.id === companion.id;
            return (
              <button key={p.id} onClick={() => setCompanionPreset(p.id)}
                className={`rounded-xl border p-1.5 text-center transition active:scale-90 ${isActive ? '' : 'border-edge bg-surface'}`}
                style={isActive ? { borderColor: `${p.defaultGlow}66`, background: `${p.defaultGlow}14` } : undefined}
              >
                <div className="flex justify-center"><CompanionAvatar id={p.id} glow={p.defaultGlow} size={40} floating={false} /></div>
                <p className="mt-1 text-[8px] font-semibold text-white/70">{p.defaultName}</p>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-white/40">{activePreset.blurb}</p>

        {/* name */}
        <div>
          <label className="label">Name</label>
          <div className="flex gap-2">
            <input className="input flex-1" value={nameDraft} maxLength={18} placeholder="Enter a name" onChange={(e) => setNameDraft(e.target.value)} />
            <button onClick={applyName} className="btn-secondary !w-auto !px-4">Save</button>
          </div>
        </div>

        {/* glow */}
        <div>
          <label className="label flex items-center gap-1.5"><Palette size={12} /> Glow Color</label>
          <div className="flex flex-wrap gap-2">
            {glowSwatches.map((s) => {
              const isActive = s.hex === companion.glowColor;
              return (
                <button key={s.hex} onClick={() => setCompanion({ ...companion, glowColor: s.hex })}
                  className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition"
                  style={{ borderColor: isActive ? s.hex : 'transparent', background: isActive ? `${s.hex}1f` : 'rgba(255,255,255,0.03)', color: isActive ? s.hex : 'rgba(255,255,255,0.6)' }}
                >
                  <span className="h-4 w-4 rounded-full" style={{ background: s.hex, boxShadow: `0 0 8px ${s.hex}` }} />
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* personality with preview */}
        <div>
          <label className="label">Personality</label>
          <div className="space-y-2">
            {(Object.keys(personalityLabels) as PersonalityTone[]).map((p) => {
              const PIcon = personalityIcons[p];
              const isActive = companion.personality === p;
              return (
                <div key={p} className={`flex items-center gap-2 rounded-xl border p-3 transition ${isActive ? 'border-neon-purple/60 bg-neon-purple/15' : 'border-edge bg-surface'}`}>
                  <button
                    onClick={() => selectPersonality(p)}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive ? 'bg-neon-purple text-white' : 'bg-surface2 text-white/50'}`}>
                      <PIcon size={14} />
                    </span>
                    <span className="flex-1">
                      <span className={`block text-sm font-semibold ${isActive ? 'text-neon-purple' : 'text-white'}`}>{personalityLabels[p].label}</span>
                      <span className="block text-[11px] text-white/40">{personalityLabels[p].desc}</span>
                    </span>
                    {isActive && <Check size={16} className="text-neon-purple" strokeWidth={3} />}
                  </button>
                  {voice.supported && coachSettings.voiceEnabled && (
                    <button
                      onClick={() => previewPersonality(p)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-edge2 bg-surface2 text-white/50 transition hover:text-white"
                      aria-label="preview voice"
                    >
                      <Play size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* coach settings */}
      <div className="card card-pad space-y-4">
        <h2 className="heading-md flex items-center gap-2"><Zap size={16} className="text-neon-purple" /> Coach Settings</h2>

        {/* intensity slider */}
        <div>
          <label className="label">Intensity</label>
          <div className="flex gap-1.5">
            {intensityOrder.map((i) => {
              const isActive = coachSettings.intensity === i;
              return (
                <button
                  key={i}
                  onClick={() => selectIntensity(i)}
                  className={`flex-1 rounded-xl border px-2 py-2.5 text-[11px] font-bold transition ${isActive ? 'border-neon-purple bg-neon-purple/15 text-neon-purple' : 'border-edge bg-surface text-white/50'}`}
                >
                  {intensityLabels[i].label}
                </button>
              );
            })}
          </div>
          <p className="muted-sm mt-1.5">{intensityLabels[coachSettings.intensity].desc}</p>
        </div>

        {/* voice toggle + volume + voice picker */}
        <div>
          <label className="label">Voice</label>
          {!voice.supported ? (
            <p className="muted-sm rounded-xl border border-edge bg-surface p-3">Voice not supported on this device. Showing text reactions only.</p>
          ) : (
            <div className="space-y-2.5">
              <button
                onClick={() => setCoachSettings({ voiceEnabled: !coachSettings.voiceEnabled })}
                className="flex w-full items-center justify-between rounded-xl border border-edge bg-surface p-3 transition"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  {coachSettings.voiceEnabled ? <Volume2 size={16} className="text-neon-emerald" /> : <VolumeX size={16} className="text-white/40" />}
                  {coachSettings.voiceEnabled ? 'Voice on' : 'Voice off'}
                </span>
                <span className={`flex h-6 w-11 items-center rounded-full p-0.5 transition ${coachSettings.voiceEnabled ? 'bg-neon-emerald' : 'bg-surface2'}`}>
                  <span className={`h-5 w-5 rounded-full bg-white transition ${coachSettings.voiceEnabled ? 'translate-x-5' : ''}`} />
                </span>
              </button>

              {coachSettings.voiceEnabled && (
                <>
                  <div>
                    <p className="muted-sm mb-1">Volume: {Math.round(coachSettings.voiceVolume * 100)}%</p>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={coachSettings.voiceVolume}
                      onChange={(e) => setCoachSettings({ voiceVolume: Number(e.target.value) })}
                      className="w-full accent-neon-purple"
                    />
                  </div>
                  <div>
                    <p className="muted-sm mb-1">System voice</p>
                    <select
                      className="input"
                      value={coachSettings.voiceURI ?? ''}
                      onChange={(e) => setCoachSettings({ voiceURI: e.target.value || null })}
                    >
                      <option value="">Default voice</option>
                      {voice.voices.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* praise-only toggle */}
        <button
          onClick={() => setCoachSettings({ praiseOnly: !coachSettings.praiseOnly })}
          className="flex w-full items-center justify-between rounded-xl border border-edge bg-surface p-3 transition"
        >
          <span className="text-sm font-semibold text-white">Praise only mode</span>
          <span className={`flex h-6 w-11 items-center rounded-full p-0.5 transition ${coachSettings.praiseOnly ? 'bg-neon-emerald' : 'bg-surface2'}`}>
            <span className={`h-5 w-5 rounded-full bg-white transition ${coachSettings.praiseOnly ? 'translate-x-5' : ''}`} />
          </span>
        </button>

        {/* quiet hours */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Quiet from</label>
            <input
              className="input"
              type="time"
              value={coachSettings.quietHoursStart ?? ''}
              onChange={(e) => setCoachSettings({ quietHoursStart: e.target.value || null })}
            />
          </div>
          <div>
            <label className="label">Quiet until</label>
            <input
              className="input"
              type="time"
              value={coachSettings.quietHoursEnd ?? ''}
              onChange={(e) => setCoachSettings({ quietHoursEnd: e.target.value || null })}
            />
          </div>
        </div>

        {/* reminders toggle */}
        <button
          onClick={() => setCoachSettings({ reminders: !coachSettings.reminders })}
          className="flex w-full items-center justify-between rounded-xl border border-edge bg-surface p-3 transition"
        >
          <span className="text-sm font-semibold text-white">Task reminders</span>
          <span className={`flex h-6 w-11 items-center rounded-full p-0.5 transition ${coachSettings.reminders ? 'bg-neon-emerald' : 'bg-surface2'}`}>
            <span className={`h-5 w-5 rounded-full bg-white transition ${coachSettings.reminders ? 'translate-x-5' : ''}`} />
          </span>
        </button>

        {/* language */}
        <div>
          <label className="label">Language</label>
          <div className="flex gap-1.5">
            {languageOptions.map((l) => {
              const isActive = coachSettings.language === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => setCoachSettings({ language: l.id })}
                  className={`flex-1 rounded-xl border px-2 py-2.5 text-xs font-bold transition ${isActive ? 'border-neon-purple bg-neon-purple/15 text-neon-purple' : 'border-edge bg-surface text-white/50'}`}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* struggling button */}
        <button
          onClick={markStruggling}
          className="btn-secondary !h-12"
          style={isStruggling ? { borderColor: '#10B98166', background: '#10B98114', color: '#10B981' } : undefined}
        >
          <HandHeart size={16} />
          {isStruggling ? 'Struggling mode active (24h)' : "I'm struggling — lighten my plan"}
        </button>
        {isStruggling && (
          <p className="muted-sm">Harsh messages are muted for 24 hours and your plan has been lightened. Be kind to yourself.</p>
        )}

        {/* coach memory stats */}
        <div className="rounded-xl border border-edge bg-surface2 p-3">
          <p className="label mb-2">Coach memory</p>
          <div className="grid grid-cols-2 gap-y-1.5 text-xs">
            <span className="text-white/45">Completions</span>
            <span className="text-right font-semibold text-neon-emerald">{coachMemory.totalCompletions}</span>
            <span className="text-white/45">Total misses</span>
            <span className="text-right font-semibold text-neon-crimson">{coachMemory.totalMisses}</span>
            <span className="text-white/45">Misses in a row</span>
            <span className="text-right font-semibold text-neon-amber">{coachMemory.missesInRow}</span>
            <span className="text-white/45">Best streak</span>
            <span className="text-right font-semibold text-white">{coachMemory.bestStreak} days</span>
          </div>
        </div>
      </div>

      {/* settings */}
      <div className="card card-pad">
        <h2 className="heading-md mb-3 flex items-center gap-2"><Settings size={16} className="text-white/50" /> Settings</h2>
        <div className="space-y-1">
          {settingsRows.map((r) => {
            const Icon = r.icon;
            const isSignOut = r.label === 'Sign Out';
            return (
              <button
                key={r.label}
                onClick={isSignOut ? onRestart : undefined}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-surface2"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isSignOut ? 'bg-neon-crimson/15 text-neon-crimson' : 'bg-surface2 text-white/50'}`}>
                  <Icon size={16} />
                </span>
                <span className="flex-1">
                  <span className={`block text-sm font-semibold ${isSignOut ? 'text-neon-crimson' : 'text-white'}`}>{r.label}</span>
                  <span className="block text-[11px] text-white/40">{r.desc}</span>
                </span>
                <ChevronRight size={16} className="text-white/25" />
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={onRestart} className="btn-primary !h-12">
        <RotateCcw size={18} /> Logout & Restart App
      </button>

      <p className="pt-2 text-center text-[11px] text-white/30">UpLevel · Learn. Earn. Grow. · v1.0</p>

      {/* savage warning modal */}
      {showSavageWarn && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/90 backdrop-blur-lg" onClick={() => setShowSavageWarn(false)} />
          <div className="relative w-full max-w-[340px] card card-pad animate-flyIn" style={{ boxShadow: '0 0 0 1px #EF444455, 0 0 40px #EF444444' }}>
            <div className="flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neon-crimson/15 text-neon-crimson mb-3">
                <AlertTriangle size={26} />
              </span>
              <h2 className="heading-lg mb-1">Savage Roast mode</h2>
              <p className="muted mb-5 max-w-[260px]">
                Your coach will use playful, behavior-focused roasts. They aim at your habits, never your appearance, intelligence, or worth. Every harsh message is followed by a supportive recovery line and a "Fix it now" button.
              </p>
              <div className="w-full space-y-2">
                <button onClick={confirmSavage} className="btn-primary" style={{ background: 'linear-gradient(to right, #EF4444, #F59E0B)' }}>
                  I understand — enable Savage
                </button>
                <button onClick={() => setShowSavageWarn(false)} className="btn-secondary !h-11">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
