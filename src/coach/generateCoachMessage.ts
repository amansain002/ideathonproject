import type { PersonalityTone } from '@/types';
import {
  type CoachTrigger,
  getBank,
  getSavageBank,
  getRecoveryLine,
  isPositive,
} from './messageBank';

export type CoachIntensity = 'gentle' | 'balanced' | 'tough' | 'savage';

export interface CoachContext {
  name: string;
  task?: string;
  xp?: number;
  streak?: number;
  weakDay?: string | null;
  missesInRow?: number;
  strugglingMode?: boolean;
}

export interface GeneratedMessage {
  text: string;
  mood: 'happy' | 'proud' | 'disappointed' | 'angry' | 'neutral';
  isHarsh: boolean;
  recovery?: string;
  hasFixIt: boolean;
}

// intensity determines which personalities are eligible and whether savage lines appear
const intensityPersonalityMap: Record<CoachIntensity, PersonalityTone[]> = {
  gentle: ['supportive', 'calm'],
  balanced: ['supportive', 'hype', 'strict', 'calm'],
  tough: ['strict', 'hype'],
  savage: ['strict', 'hype', 'savage' as PersonalityTone],
};

const savageTriggers: CoachTrigger[] = [
  'task_skipped', 'task_missed', 'snoozed_3', 'misses_3_days',
  'streak_broken', 'level_down', 'weekly_warning',
];

// Never use harsh messages for these triggers even at high intensity
const alwaysGentleTriggers: CoachTrigger[] = ['misses_3_days', 'comeback', 'monthly_summary'];

// Track last line per (personality+trigger) to avoid back-to-back repeats
const lastLineKey = (p: PersonalityTone, t: CoachTrigger) => `${p}:${t}`;
const lastLines: Map<string, string> = new Map();

function pickUnique(lines: string[], key: string): string {
  if (lines.length === 0) return '';
  if (lines.length === 1) {
    lastLines.set(key, lines[0]);
    return lines[0];
  }
  const last = lastLines.get(key);
  const pool = last ? lines.filter((l) => l !== last) : lines;
  const choice = pool[Math.floor(Math.random() * pool.length)];
  lastLines.set(key, choice);
  return choice;
}

function fill(line: string, ctx: CoachContext): string {
  return line
    .replace(/\{name\}/g, ctx.name || 'friend')
    .replace(/\{task\}/g, ctx.task || 'that task')
    .replace(/\{xp\}/g, String(Math.abs(ctx.xp ?? 0)));
}

/**
 * Generate a coach reaction message.
 *
 * Uses the message bank now; structured so a real AI API can be plugged in
 * later by replacing the body of this function with a fetch + fallback.
 */
export function generateCoachMessage(
  trigger: CoachTrigger,
  userContext: CoachContext,
  personality: PersonalityTone,
  intensity: CoachIntensity,
): GeneratedMessage {
  const positive = isPositive(trigger);
  const mood: GeneratedMessage['mood'] = (
    { happy: 'happy', proud: 'proud', disappointed: 'disappointed', angry: 'angry', neutral: 'neutral' } as const
  )[(
    {
      task_completed: 'happy', hard_task_done: 'proud', early_completion: 'proud',
      streak_7: 'proud', streak_14: 'proud', streak_30: 'proud', weekly_praise: 'proud',
      comeback: 'happy', level_up: 'happy', rank_up: 'proud', promotion_available: 'happy',
      monthly_summary: 'neutral',
      task_skipped: 'disappointed', task_missed: 'disappointed', snoozed_3: 'angry',
      misses_3_days: 'disappointed', rank_danger: 'disappointed',
      streak_broken: 'disappointed', level_down: 'disappointed',
      weekly_warning: 'disappointed',
    } as const
  )[trigger]];

  // --- wellbeing safeguards ---
  // If struggling mode is active, always use supportive tone for negatives
  const struggling = userContext.strugglingMode || (userContext.missesInRow ?? 0) >= 3;
  if (struggling && !positive) {
    const lines = getBank(trigger, 'supportive');
    if (lines.length > 0) {
      const text = fill(pickUnique(lines, lastLineKey('supportive', trigger)), userContext);
      return { text, mood, isHarsh: false, hasFixIt: false };
    }
  }

  // Always-gentle triggers never get harsh treatment
  const forceGentle = alwaysGentleTriggers.includes(trigger);

  // Praise-only mode: if gentle intensity and trigger is negative, soften
  const useSavage = intensity === 'savage' && savageTriggers.includes(trigger) && !forceGentle;

  let lines: string[];
  let effectivePersonality = personality;

  if (useSavage) {
    lines = getSavageBank(trigger);
    effectivePersonality = 'savage' as PersonalityTone;
  } else {
    // If the personality isn't eligible for this intensity, remap
    const eligible = intensityPersonalityMap[intensity];
    if (!eligible.includes(personality)) {
      effectivePersonality = eligible[0];
    }
    lines = getBank(trigger, effectivePersonality);
    // If the personality has no lines for this trigger, fall back to supportive
    if (lines.length === 0) {
      lines = getBank(trigger, 'supportive');
      effectivePersonality = 'supportive';
    }
  }

  if (lines.length === 0) {
    // Last resort fallback
    return {
      text: positive
        ? `Nice work, ${userContext.name}!`
        : `Let's pick this back up, ${userContext.name}.`,
      mood,
      isHarsh: false,
      hasFixIt: !positive,
    };
  }

  const text = fill(pickUnique(lines, lastLineKey(effectivePersonality, trigger)), userContext);

  // Long-term memory personalization: append a weak-day reference for skip/miss
  let finalText = text;
  if (
    !positive &&
    userContext.weakDay &&
    (trigger === 'task_skipped' || trigger === 'task_missed') &&
    Math.random() < 0.4
  ) {
    finalText += ` You tend to slip on ${userContext.weakDay}s — want to lighten that day?`;
  }

  const isHarsh = !positive && (intensity === 'tough' || intensity === 'savage') && !forceGentle;
  const needsRecovery = isHarsh && !useSavage; // savage includes its own soft landing in recovery
  const recovery = needsRecovery
    ? getRecoveryLine(effectivePersonality, userContext.name)
    : useSavage
      ? getRecoveryLine('savage' as PersonalityTone, userContext.name)
      : undefined;

  return {
    text: finalText,
    mood,
    isHarsh,
    recovery,
    hasFixIt: !positive && !forceGentle,
  };
}
