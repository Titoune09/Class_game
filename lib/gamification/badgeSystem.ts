import { Badge } from '@/types/xp';

/**
 * Système de badges et conditions de déblocage
 */

export const ALL_BADGES: Omit<Badge, 'unlockedAt'>[] = [
  // Catégorie Débutant
  {
    id: 'first_pomodoro',
    name: 'Première étape',
    description: 'Compléter votre premier Pomodoro',
    icon: '🎯',
    category: 'beginner',
    condition: 'pomodoro_count >= 1',
  },
  {
    id: 'first_session',
    name: 'Organisé',
    description: 'Compléter votre première session de planning',
    icon: '📚',
    category: 'beginner',
    condition: 'session_count >= 1',
  },
  {
    id: 'first_class',
    name: 'Élève attentif',
    description: 'Suivre votre premier cours en mode classe',
    icon: '🏫',
    category: 'beginner',
    condition: 'class_count >= 1',
  },
  {
    id: 'first_mastery',
    name: 'Progression',
    description: 'Maîtriser complètement un chapitre',
    icon: '⭐',
    category: 'beginner',
    condition: 'mastery_5_count >= 1',
  },
  
  // Catégorie Assiduité
  {
    id: 'streak_3',
    name: 'Régulier',
    description: '3 jours de suite avec une activité',
    icon: '🔥',
    category: 'consistency',
    condition: 'streak >= 3',
  },
  {
    id: 'streak_7',
    name: 'Déterminé',
    description: '7 jours de suite avec une activité',
    icon: '🔥🔥',
    category: 'consistency',
    condition: 'streak >= 7',
  },
  {
    id: 'streak_30',
    name: 'Invincible',
    description: '30 jours de suite avec une activité',
    icon: '🔥🔥🔥',
    category: 'consistency',
    condition: 'streak >= 30',
  },
  
  // Catégorie Pomodoro
  {
    id: 'pomodoro_10',
    name: 'Timer débutant',
    description: 'Compléter 10 Pomodoros',
    icon: '⏱️',
    category: 'pomodoro',
    condition: 'pomodoro_count >= 10',
  },
  {
    id: 'pomodoro_50',
    name: 'Timer confirmé',
    description: 'Compléter 50 Pomodoros',
    icon: '⏱️⏱️',
    category: 'pomodoro',
    condition: 'pomodoro_count >= 50',
  },
  {
    id: 'pomodoro_100',
    name: 'Timer expert',
    description: 'Compléter 100 Pomodoros',
    icon: '⏱️⏱️⏱️',
    category: 'pomodoro',
    condition: 'pomodoro_count >= 100',
  },
  
  // Catégorie Classe (NEW)
  {
    id: 'class_high_attention',
    name: 'Concentré',
    description: 'Obtenir une note d\'attention >= 8',
    icon: '🎓',
    category: 'class',
    condition: 'class_best_attention >= 8',
  },
  {
    id: 'class_zero_distraction',
    name: 'Zéro distraction',
    description: 'Terminer un cours sans aucune distraction',
    icon: '🎓🎓',
    category: 'class',
    condition: 'class_zero_distraction >= 1',
  },
  {
    id: 'class_streak_5',
    name: 'Série en classe',
    description: 'Suivre 5 cours d\'affilée',
    icon: '🎓🎓🎓',
    category: 'class',
    condition: 'class_streak >= 5',
  },
  {
    id: 'class_challenges_10',
    name: 'Challenger',
    description: 'Réussir 10 micro-défis',
    icon: '🧠',
    category: 'class',
    condition: 'class_challenges >= 10',
  },
  {
    id: 'class_perfect',
    name: 'Perfection',
    description: 'Cours avec 10/10, défi réussi et 0 distraction',
    icon: '🏆',
    category: 'class',
    condition: 'class_perfect >= 1',
  },
  
  // Catégorie Maîtrise
  {
    id: 'mastery_5',
    name: 'Compétent',
    description: 'Maîtriser 5 chapitres',
    icon: '📖',
    category: 'mastery',
    condition: 'mastery_5_count >= 5',
  },
  {
    id: 'mastery_20',
    name: 'Expert',
    description: 'Maîtriser 20 chapitres',
    icon: '📖📖',
    category: 'mastery',
    condition: 'mastery_5_count >= 20',
  },
  {
    id: 'mastery_50',
    name: 'Maître',
    description: 'Maîtriser 50 chapitres',
    icon: '📖📖📖',
    category: 'mastery',
    condition: 'mastery_5_count >= 50',
  },
];

export interface BadgeCheckContext {
  pomodoroCount: number;
  sessionCount: number;
  classCount: number;
  mastery5Count: number;
  streak: number;
  classBestAttention: number;
  classZeroDistractionCount: number;
  classStreak: number;
  classChallengesCompleted: number;
  classPerfectCount: number;
}

export function checkBadgeUnlock(badgeId: string, context: BadgeCheckContext): boolean {
  switch (badgeId) {
    // Débutant
    case 'first_pomodoro':
      return context.pomodoroCount >= 1;
    case 'first_session':
      return context.sessionCount >= 1;
    case 'first_class':
      return context.classCount >= 1;
    case 'first_mastery':
      return context.mastery5Count >= 1;
    
    // Assiduité
    case 'streak_3':
      return context.streak >= 3;
    case 'streak_7':
      return context.streak >= 7;
    case 'streak_30':
      return context.streak >= 30;
    
    // Pomodoro
    case 'pomodoro_10':
      return context.pomodoroCount >= 10;
    case 'pomodoro_50':
      return context.pomodoroCount >= 50;
    case 'pomodoro_100':
      return context.pomodoroCount >= 100;
    
    // Classe
    case 'class_high_attention':
      return context.classBestAttention >= 8;
    case 'class_zero_distraction':
      return context.classZeroDistractionCount >= 1;
    case 'class_streak_5':
      return context.classStreak >= 5;
    case 'class_challenges_10':
      return context.classChallengesCompleted >= 10;
    case 'class_perfect':
      return context.classPerfectCount >= 1;
    
    // Maîtrise
    case 'mastery_5':
      return context.mastery5Count >= 5;
    case 'mastery_20':
      return context.mastery5Count >= 20;
    case 'mastery_50':
      return context.mastery5Count >= 50;
    
    default:
      return false;
  }
}

export function checkAllBadges(context: BadgeCheckContext, currentBadges: Badge[]): Badge[] {
  const newlyUnlocked: Badge[] = [];
  const unlockedIds = new Set(currentBadges.map(b => b.id));
  
  for (const badge of ALL_BADGES) {
    if (!unlockedIds.has(badge.id) && checkBadgeUnlock(badge.id, context)) {
      newlyUnlocked.push({
        ...badge,
        unlockedAt: new Date(),
      });
    }
  }
  
  return newlyUnlocked;
}
