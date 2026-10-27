import { useEffect, useState } from 'react';
import { X, Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { CompanionAvatar } from '@/components/CompanionAvatar';
import { generateCoachMessage, type CoachContext } from '@/coach/generateCoachMessage';
import { useCoachVoice } from '@/coach/useCoachVoice';
import type { CoachTrigger } from '@/coach/messageBank';

const moodGlow: Record<string, string> = {
  happy: '#10B981',
  proud: '#F59E0B',
  disappointed: '#F59E0B',
  angry: '#EF4444',
  neutral: '#8B5CF6',
};

const moodEmoji: Record<string, string> = {
  happy: ':)',
  proud: 'B)',
  disappointed: ':(',
  angry: '>:(',
  neutral: ':|',
};

export function CoachReactionOverlay() {
  const {
    coachEvent, clearCoachEvent, companion, coachSettings, coachMemory,
    rescheduleTask, tasks, snoozeTask,
  } = useGame();

  const voice = useCoachVoice(companion.personality);
  const [msg, setMsg] = useState<{ text: string; recovery?: string; hasFixIt: boolean; mood: string } | null>(null);
  const [muted, setMuted] = useState(!coachSettings.voiceEnabled);

  useEffect(() => {
    if (!coachEvent) return;
    const ctx: CoachContext = {
      name: companion.customName === 'Sylphie' ? 'Scholar' : companion.customName,
      task: coachEvent.task,
      xp: coachEvent.xp,
      streak: 18,
      weakDay: coachMemory.weakDay,
      missesInRow: coachMemory.missesInRow,
      strugglingMode:
        coachSettings.strugglingUntil !== null &&
        Date.now() < coachSettings.strugglingUntil,
    };
    const generated = generateCoachMessage(
      coachEvent.trigger,
      ctx,
      companion.personality,
      coachSettings.intensity,
    );
    setMsg({ text: generated.text, recovery: generated.recovery, hasFixIt: generated.hasFixIt, mood: generated.mood });
    // speak aloud
    if (voice.supported && coachSettings.voiceEnabled && !muted) {
      voice.speak(generated.text);
    }
    // auto-dismiss after 9s for positives, manual for harsh
    if (generated.isHarsh || generated.recovery) return;
    const t = setTimeout(() => {
      clearCoachEvent();
      setMsg(null);
    }, 9000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coachEvent]);

  if (!coachEvent || !msg) return null;

  const glow = moodGlow[msg.mood] ?? companion.glowColor;
  const trigger = coachEvent.trigger as CoachTrigger;
  const isHarsh = msg.recovery !== undefined;

  // find the task for Fix it now (reschedule)
  const relatedTask = coachEvent.task ? tasks.find((t) => t.title === coachEvent.task) : null;

  function handleFixIt() {
    if (relatedTask) {
      rescheduleTask(relatedTask.id);
    }
    clearCoachEvent();
    setMsg(null);
  }

  function handleDismiss() {
    voice.stop();
    clearCoachEvent();
    setMsg(null);
  }

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      if (next) voice.stop();
      return next;
    });
  }

  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-[55] w-full max-w-[400px] -translate-x-1/2 px-4">
      <div
        className="pointer-events-auto animate-slideUp rounded-2xl border bg-surface/95 p-3.5 backdrop-blur-md"
        style={{ borderColor: `${glow}55`, boxShadow: `0 0 20px ${glow}44` }}
      >
        <div className="flex items-start gap-3">
          {/* avatar with mood */}
          <div className="relative shrink-0">
            <div
              className="absolute inset-0 -m-1 rounded-full animate-auraPulse"
              style={{ background: `${glow}22`, boxShadow: `0 0 12px ${glow}88` }}
            />
            <CompanionAvatar id={companion.id} glow={glow} size={52} floating={false} />
            <span
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold"
              style={{ borderColor: glow, background: '#16161D', color: glow }}
            >
              {moodEmoji[msg.mood]}
            </span>
          </div>

          {/* message */}
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: glow }}>
                {companion.customName}
              </p>
              <div className="flex items-center gap-1">
                {voice.supported && (
                  <button onClick={toggleMute} className="text-white/40 transition hover:text-white/70" aria-label="mute">
                    {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                )}
                <button onClick={handleDismiss} className="text-white/40 transition hover:text-white/70" aria-label="dismiss">
                  <X size={14} />
                </button>
              </div>
            </div>
            <p className="text-sm leading-snug text-white/90">{msg.text}</p>
            {msg.recovery && (
              <p className="mt-1.5 text-xs leading-snug text-white/55">{msg.recovery}</p>
            )}
          </div>
        </div>

        {/* Fix it now / reschedule button */}
        {msg.hasFixIt && relatedTask && (
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleFixIt}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition active:scale-95"
              style={{ borderColor: `${glow}66`, background: `${glow}1f`, color: glow }}
            >
              <RotateCcw size={13} /> Fix it now
            </button>
            <button
              onClick={() => { if (relatedTask) snoozeTask(relatedTask.id); handleDismiss(); }}
              className="rounded-xl border border-edge2 bg-surface2 px-3 py-2 text-xs font-semibold text-white/60 transition active:scale-95"
            >
              Snooze 10m
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-xl border border-edge2 bg-surface2 px-3 py-2 text-xs font-semibold text-white/60 transition active:scale-95"
            >
              Later
            </button>
          </div>
        )}

        {/* sparkles for positive */}
        {!isHarsh && msg.mood === 'happy' && (
          <Sparkles size={10} className="absolute -right-1 -top-1 text-neon-amber animate-sparkle" />
        )}
      </div>
    </div>
  );
}
