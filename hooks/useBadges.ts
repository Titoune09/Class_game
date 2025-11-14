import { useXP } from './useXP';
import { useSubjects } from './useSubjects';
import { usePlanning } from './usePlanning';
import { usePomodoro } from './usePomodoro';
import { useClassMode } from './useClassMode';
import { checkAllBadges, BadgeCheckContext } from '@/lib/gamification/badgeSystem';
import { XP_REWARDS } from '@/lib/gamification/xpCalculator';

/**
 * Hook pour gérer les badges et leur déblocage
 */
export function useBadges() {
  const { progress, addBadge, addXP } = useXP();
  const { countMasteredChapters } = useSubjects();
  const { countCompletedSessions } = usePlanning();
  const { stats: pomodoroStats } = usePomodoro();
  const { stats: classStats } = useClassMode();

  // Vérifier et débloquer de nouveaux badges
  const checkAndUnlockBadges = () => {
    const context: BadgeCheckContext = {
      pomodoroCount: pomodoroStats.totalCompleted,
      sessionCount: countCompletedSessions(),
      classCount: classStats.totalSessions,
      mastery5Count: countMasteredChapters(),
      streak: progress.streaks.current,
      classBestAttention: classStats.bestAttentionScore,
      classZeroDistractionCount: classStats.totalDistractionsAvoided,
      classStreak: classStats.currentStreak,
      classChallengesCompleted: classStats.challengesCompleted,
      classPerfectCount: 0, // TODO: Calculer les cours parfaits
    };

    const newBadges = checkAllBadges(context, progress.badges);

    newBadges.forEach((badge) => {
      const added = addBadge(badge);
      if (added) {
        addXP(XP_REWARDS.BADGE_UNLOCKED, `Badge débloqué: ${badge.name}`);
      }
    });

    return newBadges;
  };

  return {
    badges: progress.badges,
    checkAndUnlockBadges,
  };
}
