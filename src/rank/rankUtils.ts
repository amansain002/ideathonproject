import {
  RANK_LADDER,
  cumulativeXpForLevel,
  xpForLevel,
  subTierForLevel,
  type RankConfig,
  type SubTier,
  type RankLetter,
} from './rankConfig';

export interface RankInfo {
  letter: RankLetter;
  name: string;
  title: string;
  color: string;
  glowColor: string;
  emblem: string;
  level: number;
  sub: SubTier;
  withinRank: number;
  minXp: number;
  maxXp: number;
  rewards: string[];
}

export interface LevelProgress {
  level: number;
  xpIntoLevel: number;
  xpForNext: number;
  pct: number; // 0-100 within current level
  totalXp: number;
}

/** Compute level from total cumulative XP. */
export function levelFromTotalXp(totalXp: number): number {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
    if (level > 999) break;
  }
  return level;
}

/** Compute full level progress from total XP. */
export function levelProgressFromTotalXp(totalXp: number): LevelProgress {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
    if (level > 999) {
      remaining = 0;
      break;
    }
  }
  const need = xpForLevel(level);
  return {
    level,
    xpIntoLevel: remaining,
    xpForNext: need,
    pct: Math.min(100, (remaining / need) * 100),
    totalXp,
  };
}

/** Find the rank config for a given level. */
export function rankForLevel(level: number): RankConfig {
  for (const r of RANK_LADDER) {
    if (level >= r.minLevel && level <= r.maxLevel) return r;
  }
  return RANK_LADDER[RANK_LADDER.length - 1];
}

/** Full rank info for a given level. */
export function rankInfoForLevel(level: number): RankInfo {
  const rank = rankForLevel(level);
  const { sub, within } = subTierForLevel(level, rank);
  return {
    letter: rank.letter,
    name: rank.name,
    title: rank.title,
    color: rank.color,
    glowColor: rank.glowColor,
    emblem: rank.emblem,
    level,
    sub,
    withinRank: within,
    minXp: rank.minXp,
    maxXp: rank.maxXp,
    rewards: rank.rewards,
  };
}

/** Full display string: e.g. "C Rank Silver II" */
export function rankDisplay(info: RankInfo): string {
  return `${info.letter} Rank ${info.name} ${info.sub}`;
}

/** Short display: e.g. "Silver II" */
export function rankShort(info: RankInfo): string {
  return `${info.name} ${info.sub}`;
}

/** Is the user at the last level of their current rank (promotion boundary)? */
export function isAtRankBoundary(level: number): boolean {
  const rank = rankForLevel(level);
  return level === rank.maxLevel;
}

/** The next rank config, or null if already at top. */
export function nextRank(level: number): RankConfig | null {
  const current = rankForLevel(level);
  const idx = RANK_LADDER.findIndex((r) => r.letter === current.letter);
  if (idx + 1 < RANK_LADDER.length) return RANK_LADDER[idx + 1];
  return null;
}

/** The first level of the user's current rank (level protection floor). */
export function rankFloorLevel(level: number): number {
  const rank = rankForLevel(level);
  return rank.minLevel;
}

/** Convert a rank letter + sub to a display string. */
export function rankLetterDisplay(letter: RankLetter, sub: SubTier): string {
  const rank = RANK_LADDER.find((r) => r.letter === letter);
  return `${letter} Rank ${rank?.name ?? ''} ${sub}`;
}
