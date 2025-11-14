import { Subject } from '@/types/subject';
import { generateId } from './validation';

/**
 * Données de démonstration pour tester rapidement l'application
 * À utiliser uniquement en développement
 */

export const DEMO_SUBJECTS: Subject[] = [
  {
    id: generateId(),
    name: 'Mathématiques',
    color: '#3B82F6',
    icon: '📐',
    chapters: [
      {
        id: generateId(),
        subjectId: '',
        title: 'Les dérivées',
        description: 'Calcul différentiel et applications',
        priority: 'high',
        mastery: 3,
        examDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        subjectId: '',
        title: 'Les intégrales',
        description: 'Calcul intégral',
        priority: 'medium',
        mastery: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        subjectId: '',
        title: 'Limites et continuité',
        description: '',
        priority: 'low',
        mastery: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Physique',
    color: '#10B981',
    icon: '🔬',
    chapters: [
      {
        id: generateId(),
        subjectId: '',
        title: 'Mécanique newtonienne',
        description: 'Forces, mouvement et énergie',
        priority: 'high',
        mastery: 2,
        examDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        subjectId: '',
        title: 'Électromagnétisme',
        description: 'Champs électriques et magnétiques',
        priority: 'medium',
        mastery: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Histoire',
    color: '#F59E0B',
    icon: '📚',
    chapters: [
      {
        id: generateId(),
        subjectId: '',
        title: 'La Révolution française',
        description: '1789-1799',
        priority: 'medium',
        mastery: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        subjectId: '',
        title: 'Première Guerre mondiale',
        description: '1914-1918',
        priority: 'high',
        mastery: 3,
        examDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Initialiser les données de démo dans localStorage
 * ⚠️ Écrasera les données existantes !
 */
export function initDemoData() {
  if (typeof window === 'undefined') return;

  const confirmed = confirm(
    '⚠️ Cela va écraser vos données actuelles ! Continuer ?'
  );

  if (!confirmed) return;

  // Fixer les IDs de subjectId dans les chapitres
  const subjects = DEMO_SUBJECTS.map((subject) => ({
    ...subject,
    chapters: subject.chapters.map((chapter) => ({
      ...chapter,
      subjectId: subject.id,
    })),
  }));

  // Sauvegarder dans localStorage
  localStorage.setItem('app_subjects', JSON.stringify(subjects));

  // Initialiser les autres données vides
  localStorage.setItem('app_planning_sessions', JSON.stringify([]));
  localStorage.setItem(
    'app_pomodoro_stats',
    JSON.stringify({
      dailyCount: 0,
      totalCompleted: 0,
      longestStreak: 0,
      currentStreak: 0,
    })
  );
  localStorage.setItem(
    'app_user_progress',
    JSON.stringify({
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
    })
  );
  localStorage.setItem('app_class_sessions', JSON.stringify([]));
  localStorage.setItem(
    'app_class_stats',
    JSON.stringify({
      totalSessions: 0,
      averageAttention: 0,
      totalDistractionsAvoided: 0,
      bestAttentionScore: 0,
      currentStreak: 0,
      challengesCompleted: 0,
    })
  );

  alert('✅ Données de démo initialisées ! Rechargez la page.');
  window.location.reload();
}

/**
 * Nettoyer toutes les données
 */
export function clearAllData() {
  if (typeof window === 'undefined') return;

  const confirmed = confirm(
    '⚠️ Cela va supprimer TOUTES vos données ! Êtes-vous sûr ?'
  );

  if (!confirmed) return;

  // Supprimer toutes les clés app_*
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith('app_')) {
      localStorage.removeItem(key);
    }
  });

  alert('✅ Toutes les données ont été supprimées ! Rechargez la page.');
  window.location.reload();
}

// Exposer les fonctions globalement pour debug (dev only)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).initDemoData = initDemoData;
  (window as any).clearAllData = clearAllData;
}
