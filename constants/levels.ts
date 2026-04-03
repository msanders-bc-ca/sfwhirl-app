// XP thresholds per level. Level 1 = 0 XP, Level 2 = 100 XP, etc.
export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 6000];

export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}

export function getXPForNextLevel(level: number): number {
  return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Med Device Novice',
  2: 'Prototype Builder',
  3: 'Regulatory Rookie',
  4: 'Clinical Analyst',
  5: 'Market Strategist',
  6: 'Reimbursement Pro',
  7: 'Device Architect',
  8: 'Commercialization Expert',
  9: 'FDA Whisperer',
  10: 'Med Device Master',
};
