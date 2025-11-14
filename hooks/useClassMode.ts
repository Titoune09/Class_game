import { usePersistentState } from './usePersistentState';
import { ClassSession, ClassModeStats, ClassObjective, MicroChallenge, ClassPhase } from '@/types/classMode';
import { STORAGE_KEYS } from '@/lib/storage/storageService';
import { generateId } from '@/lib/utils/validation';
import { generateRandomChallenge } from '@/lib/class/challengeGenerator';

/**
 * Hook pour gérer le mode classe
 */
export function useClassMode() {
  const [activeSession, setActiveSession] = usePersistentState<ClassSession | null>(
    STORAGE_KEYS.ACTIVE_CLASS_SESSION,
    null
  );

  const [allSessions, setAllSessions] = usePersistentState<ClassSession[]>(
    STORAGE_KEYS.CLASS_SESSIONS,
    []
  );

  const [stats, setStats] = usePersistentState<ClassModeStats>(
    STORAGE_KEYS.CLASS_STATS,
    {
      totalSessions: 0,
      averageAttention: 0,
      totalDistractionsAvoided: 0,
      bestAttentionScore: 0,
      currentStreak: 0,
      challengesCompleted: 0,
    }
  );

  // Démarrer une nouvelle session (Phase 1)
  const startClassSession = (subjectId: string, chapterId: string) => {
    const newSession: ClassSession = {
      id: generateId(),
      subjectId,
      chapterId,
      phase: 'before',
      objectives: [],
      challenge: generateRandomChallenge(),
      attentionLevel: 3,
      distractionCount: 0,
      quickNotes: [],
      duration: 0,
      evaluation: {
        attentionScore: 0,
        summary: '',
        toReview: '',
        challengeCompleted: false,
        objectivesCompleted: 0,
      },
      startedAt: new Date(),
    };

    setActiveSession(newSession);
    return newSession;
  };

  // Définir les objectifs (Phase 1)
  const setObjectives = (objectives: ClassObjective[]) => {
    if (!activeSession) return;

    setActiveSession({
      ...activeSession,
      objectives,
    });
  };

  // Définir le challenge (Phase 1)
  const setChallenge = (challenge: MicroChallenge) => {
    if (!activeSession) return;

    setActiveSession({
      ...activeSession,
      challenge,
    });
  };

  // Commencer le cours (Phase 2)
  const startClass = () => {
    if (!activeSession) return;

    setActiveSession({
      ...activeSession,
      phase: 'during',
      startedAt: new Date(),
    });
  };

  // Mettre à jour le niveau d'attention
  const updateAttention = (level: number) => {
    if (!activeSession || activeSession.phase !== 'during') return;

    setActiveSession({
      ...activeSession,
      attentionLevel: Math.max(0, Math.min(5, level)),
    });
  };

  // Ajouter une distraction
  const addDistraction = () => {
    if (!activeSession || activeSession.phase !== 'during') return;

    setActiveSession({
      ...activeSession,
      distractionCount: activeSession.distractionCount + 1,
    });
  };

  // Ajouter une note rapide
  const addQuickNote = (note: string) => {
    if (!activeSession || activeSession.phase !== 'during') return;

    setActiveSession({
      ...activeSession,
      quickNotes: [...activeSession.quickNotes, note],
    });
  };

  // Terminer le cours et passer à l'évaluation (Phase 3)
  const endClass = () => {
    if (!activeSession || activeSession.phase !== 'during') return;

    // Calculer la durée
    const duration = Math.floor(
      (new Date().getTime() - new Date(activeSession.startedAt).getTime()) / 60000
    );

    setActiveSession({
      ...activeSession,
      phase: 'after',
      duration,
    });
  };

  // Compléter l'évaluation (Phase 3)
  const completeClass = (
    attentionScore: number,
    summary: string,
    toReview: string,
    challengeCompleted: boolean
  ) => {
    if (!activeSession || activeSession.phase !== 'after') return;

    const objectivesCompleted = activeSession.objectives.filter(
      (o) => o.completed
    ).length;

    const completedSession: ClassSession = {
      ...activeSession,
      phase: 'completed',
      evaluation: {
        attentionScore,
        summary,
        toReview,
        challengeCompleted,
        objectivesCompleted,
      },
      completedAt: new Date(),
    };

    // Mettre à jour les stats
    const newStats = { ...stats };
    newStats.totalSessions += 1;
    newStats.averageAttention =
      (newStats.averageAttention * (newStats.totalSessions - 1) +
        attentionScore) /
      newStats.totalSessions;
    newStats.bestAttentionScore = Math.max(
      newStats.bestAttentionScore,
      attentionScore
    );

    if (activeSession.distractionCount === 0) {
      newStats.totalDistractionsAvoided += 1;
    }

    if (challengeCompleted) {
      newStats.challengesCompleted += 1;
    }

    // Gérer le streak (simplifié)
    newStats.currentStreak += 1;

    setStats(newStats);
    setAllSessions([...allSessions, completedSession]);
    setActiveSession(null);

    return { session: completedSession, stats: newStats };
  };

  // Annuler la session en cours
  const cancelSession = () => {
    setActiveSession(null);
  };

  // Toggle un objectif
  const toggleObjective = (objectiveId: string) => {
    if (!activeSession) return;

    setActiveSession({
      ...activeSession,
      objectives: activeSession.objectives.map((o) =>
        o.id === objectiveId ? { ...o, completed: !o.completed } : o
      ),
    });
  };

  // Récupérer l'historique des sessions
  const getSessionHistory = () => {
    return allSessions.filter((s) => s.phase === 'completed');
  };

  return {
    activeSession,
    stats,
    startClassSession,
    setObjectives,
    setChallenge,
    startClass,
    updateAttention,
    addDistraction,
    addQuickNote,
    endClass,
    completeClass,
    cancelSession,
    toggleObjective,
    getSessionHistory,
  };
}
