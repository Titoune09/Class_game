import { usePersistentState } from './usePersistentState';
import { UserProgress } from '@/types/xp';
import { STORAGE_KEYS } from '@/lib/storage/storageService';
import { updateXPSystem } from '@/lib/gamification/xpCalculator';

/**
 * Hook pour gérer l'XP et la progression utilisateur
 */
export function useXP() {
  const [progress, setProgress] = usePersistentState<UserProgress>(
    STORAGE_KEYS.USER_PROGRESS,
    {
      xp: {
        totalXP: 0,
        level: 1,
        xpToNextLevel: 100,
        currentLevelXP: 0,
      },
      badges: [],
      streaks: {
        current: 0,
        longest: 0,
        lastActivityDate: new Date(),
      },
      statistics: {
        totalMinutesStudied: 0,
        totalSessions: 0,
        totalPomodoros: 0,
        totalClassSessions: 0,
      },
    }
  );

  // Ajouter de l'XP
  const addXP = (amount: number, reason?: string) => {
    const newTotalXP = progress.xp.totalXP + amount;
    const newXPSystem = updateXPSystem(newTotalXP);
    const oldLevel = progress.xp.level;
    const newLevel = newXPSystem.level;

    setProgress({
      ...progress,
      xp: newXPSystem,
    });

    // Retourner si level up
    return {
      leveledUp: newLevel > oldLevel,
      oldLevel,
      newLevel,
      xpGained: amount,
      reason,
    };
  };

  // Ajouter un badge
  const addBadge = (badge: any) => {
    if (progress.badges.some((b) => b.id === badge.id)) {
      return false; // Déjà débloqué
    }

    setProgress({
      ...progress,
      badges: [...progress.badges, badge],
    });

    return true;
  };

  // Mettre à jour le streak
  const updateStreak = (increment: boolean = true) => {
    const newStreaks = { ...progress.streaks };

    if (increment) {
      newStreaks.current += 1;
      newStreaks.longest = Math.max(newStreaks.longest, newStreaks.current);
    } else {
      newStreaks.current = 0;
    }

    newStreaks.lastActivityDate = new Date();

    setProgress({
      ...progress,
      streaks: newStreaks,
    });
  };

  // Mettre à jour les statistiques
  const updateStatistics = (updates: Partial<typeof progress.statistics>) => {
    setProgress({
      ...progress,
      statistics: {
        ...progress.statistics,
        ...updates,
      },
    });
  };

  // Incrémenter une statistique
  const incrementStat = (
    stat: keyof typeof progress.statistics,
    amount: number = 1
  ) => {
    setProgress({
      ...progress,
      statistics: {
        ...progress.statistics,
        [stat]: progress.statistics[stat] + amount,
      },
    });
  };

  return {
    progress,
    addXP,
    addBadge,
    updateStreak,
    updateStatistics,
    incrementStat,
  };
}
