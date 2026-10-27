/**
 * Rank & Level configuration for UpLevel.
 * All thresholds and rewards live here so they can be tuned in one place.
 */

export type RankLetter = 'D' | 'C' | 'B' | 'A' | 'S' | 'SS';
export type SubTier = 'III' | 'II' | 'I';

export interface RankConfig {
  letter: RankLetter;
  name: string; // Bronze, Silver, etc.
  title: string; // Rookie, Challenger, etc.
  color: string; // primary hex
  glowColor: string; // glow hex
  minLevel: number;
  maxLevel: number;
  minXp: number;
  maxXp: number;
  emblem: string; // lucide icon name for badge
  rewards: string[];
}

export const RANK_LADDER: RankConfig[] = [
  {
    letter: 'D',
    name: 'Bronze',
    title: 'Rookie',
    color: '#CD7F32',
    glowColor: '#CD7F32',
    minLevel: 1,
    maxLevel: 10,
    minXp: 0,
    maxXp: 1000,
    emblem: 'Shield',
    rewards: ['Basic avatar frame', 'Friendly coach personality'],
  },
  {
    letter: 'C',
    name: 'Silver',
    title: 'Challenger',
    color: '#B8C4D4',
    glowColor: '#B8C4D4',
    minLevel: 11,
    maxLevel: 25,
    minXp: 1000,
    maxXp: 4000,
    emblem: 'Swords',
    rewards: ['Silver avatar frame', 'Funny Buddy personality', 'Harder quests unlocked'],
  },
  {
    letter: 'B',
    name: 'Gold',
    title: 'Achiever',
    color: '#F5B942',
    glowColor: '#F5B942',
    minLevel: 26,
    maxLevel: 45,
    minXp: 4000,
    maxXp: 10000,
    emblem: 'Crown',
    rewards: ['Gold avatar frame', 'Strict Mentor personality', 'Boss Quests unlocked', 'Profile theme: Gold'],
  },
  {
    letter: 'A',
    name: 'Platinum',
    title: 'Elite',
    color: '#5DE0E6',
    glowColor: '#5DE0E6',
    minLevel: 46,
    maxLevel: 70,
    minXp: 10000,
    maxXp: 22000,
    emblem: 'Gem',
    rewards: ['Platinum avatar frame', 'Calm Guide personality', 'Premium quests', 'Profile theme: Platinum'],
  },
  {
    letter: 'S',
    name: 'Diamond',
    title: 'Master',
    color: '#22D3EE',
    glowColor: '#22D3EE',
    minLevel: 71,
    maxLevel: 99,
    minXp: 22000,
    maxXp: 45000,
    emblem: 'Diamond',
    rewards: ['Diamond avatar frame (cyan glow)', 'Savage Roast personality', 'Elite Boss Quests', 'Profile theme: Diamond'],
  },
  {
    letter: 'SS',
    name: 'Legend',
    title: 'Legend',
    color: '#A855F7',
    glowColor: '#F59E0B',
    minLevel: 100,
    maxLevel: 999,
    minXp: 45000,
    maxXp: 999999,
    emblem: 'Star',
    rewards: ['Legend avatar frame (purple-gold animated glow)', 'All coach personalities', 'Legendary Boss Quests', 'Exclusive profile theme', 'All titles unlocked'],
  },
];

/** XP needed to go from `level` to `level + 1`. */
export function xpForLevel(level: number): number {
  return 100 + level * 20;
}

/** Total cumulative XP required to reach a given level (from level 1). */
export function cumulativeXpForLevel(level: number): number {
  let total = 0;
  for (let l = 1; l < level; l++) total += xpForLevel(l);
  return total;
}

/** Convert a level (1-based) into its level-within-rank and sub-tier. */
export function subTierForLevel(level: number, rank: RankConfig): { within: number; sub: SubTier } {
  const span = rank.maxLevel - rank.minLevel + 1; // e.g. 10
  const within = level - rank.minLevel; // 0-based
  const third = span / 3;
  if (within < third) return { within: within + 1, sub: 'III' };
  if (within < third * 2) return { within: within + 1, sub: 'II' };
  return { within: within + 1, sub: 'I' };
}

/** Streak multipliers */
export const STREAK_MULTIPLIERS: { minStreak: number; mult: number }[] = [
  { minStreak: 30, mult: 1.5 },
  { minStreak: 14, mult: 1.25 },
  { minStreak: 7, mult: 1.1 },
];

export function streakMultiplier(streak: number): number {
  for (const s of STREAK_MULTIPLIERS) {
    if (streak >= s.minStreak) return s.mult;
  }
  return 1;
}

/** Promotion quests per rank (field-aware via userType, but we provide generic ones). */
export interface PromotionQuest {
  id: string;
  label: string;
  targetCount: number;
  xp: number;
}

export function promotionQuestForRank(rank: RankConfig): PromotionQuest {
  const map: Record<RankLetter, PromotionQuest> = {
    D: { id: 'promo-d', label: 'Complete 5 tasks in one day', targetCount: 5, xp: 100 },
    C: { id: 'promo-c', label: 'Finish a mini project', targetCount: 1, xp: 150 },
    B: { id: 'promo-b', label: 'Complete 10 tasks in one day', targetCount: 10, xp: 200 },
    A: { id: 'promo-a', label: 'Complete a Boss Quest', targetCount: 1, xp: 300 },
    S: { id: 'promo-s', label: 'Maintain a 14-day streak', targetCount: 14, xp: 500 },
    SS: { id: 'promo-ss', label: 'Maintain a 30-day streak', targetCount: 30, xp: 1000 },
  };
  return map[rank.letter];
}

/** Rank history entry — when a rank was achieved. */
export interface RankHistoryEntry {
  letter: RankLetter;
  date: string; // ISO date
}

/** Weekly league thresholds (top/bottom for promotion/demotion). */
export const LEAGUE_PROMO_TOP = 3;
export const LEAGUE_DEMO_BOTTOM = 2;
