import { XPSystem } from '@/types/xp';

/**
 * Calcul du système XP et des niveaux
 */

// XP requis pour atteindre le niveau N = 100 * N
export function calculateXPForLevel(level: number): number {
  return 100 * level;
}

// XP total requis pour atteindre un niveau
export function calculateTotalXPForLevel(level: number): number {
  return (level * (level - 1) * 100) / 2;
}

// Calculer le niveau actuel basé sur l'XP total
export function calculateLevel(totalXP: number): number {
  let level = 1;
  while (calculateTotalXPForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
}

// Calculer l'XP du niveau actuel
export function calculateCurrentLevelXP(totalXP: number): number {
  const level = calculateLevel(totalXP);
  const totalXPForCurrentLevel = calculateTotalXPForLevel(level);
  return totalXP - totalXPForCurrentLevel;
}

// Calculer l'XP restante pour le prochain niveau
export function calculateXPToNextLevel(totalXP: number): number {
  const level = calculateLevel(totalXP);
  const xpForNextLevel = calculateXPForLevel(level + 1);
  const currentLevelXP = calculateCurrentLevelXP(totalXP);
  return xpForNextLevel - currentLevelXP;
}

// Mettre à jour le système XP
export function updateXPSystem(currentXP: number): XPSystem {
  const level = calculateLevel(currentXP);
  const currentLevelXP = calculateCurrentLevelXP(currentXP);
  const xpToNextLevel = calculateXPToNextLevel(currentXP);
  
  return {
    totalXP: currentXP,
    level,
    currentLevelXP,
    xpToNextLevel,
  };
}

// Calculer l'XP gagnée pour différentes actions
export const XP_REWARDS = {
  POMODORO_COMPLETED: 10,
  SESSION_COMPLETED: 15,
  CLASS_BASE: 50,
  CHAPTER_MASTERY_UP: 20,
  STREAK_DAY: 5,
  BADGE_UNLOCKED: 25,
  
  // Bonus mode classe
  CLASS_HIGH_ATTENTION: 20, // Score >= 8
  CLASS_LOW_DISTRACTIONS: 10, // < 3 distractions
  CLASS_CHALLENGE_COMPLETED: 15,
  CLASS_OBJECTIVE_COMPLETED: 10, // Par objectif
} as const;

// Calculer l'XP pour une session de classe
export function calculateClassXP(
  attentionScore: number,
  distractionCount: number,
  challengeCompleted: boolean,
  objectivesCompleted: number
): number {
  let xp = XP_REWARDS.CLASS_BASE;
  
  // Bonus attention
  xp += attentionScore * 3; // 0-30 XP
  
  if (attentionScore >= 8) {
    xp += XP_REWARDS.CLASS_HIGH_ATTENTION;
  }
  
  // Bonus distractions
  if (distractionCount < 3) {
    xp += XP_REWARDS.CLASS_LOW_DISTRACTIONS;
  }
  
  // Bonus défi
  if (challengeCompleted) {
    xp += XP_REWARDS.CLASS_CHALLENGE_COMPLETED;
  }
  
  // Bonus objectifs
  xp += objectivesCompleted * XP_REWARDS.CLASS_OBJECTIVE_COMPLETED;
  
  return xp;
}
