import { usePersistentState } from './usePersistentState';
import { PlanningSession, SessionStatus } from '@/types/session';
import { STORAGE_KEYS } from '@/lib/storage/storageService';
import { generateId } from '@/lib/utils/validation';
import { getStartOfDay, isSameDay, getWeekDays } from '@/lib/utils/dateUtils';

/**
 * Hook pour gérer le planning des sessions
 */
export function usePlanning() {
  const [sessions, setSessions] = usePersistentState<PlanningSession[]>(
    STORAGE_KEYS.PLANNING_SESSIONS,
    []
  );

  // Récupérer toutes les sessions
  const getSessions = () => sessions;

  // Récupérer les sessions d'un jour spécifique
  const getSessionsByDate = (date: Date): PlanningSession[] => {
    return sessions.filter((s) => isSameDay(new Date(s.date), date));
  };

  // Récupérer les sessions d'une semaine
  const getWeeklySessions = (weekStart: Date): PlanningSession[] => {
    const weekDays = getWeekDays(weekStart);
    return sessions.filter((s) => {
      const sessionDate = new Date(s.date);
      return weekDays.some((day) => isSameDay(sessionDate, day));
    });
  };

  // Créer une session
  const createSession = (
    subjectId: string,
    chapterId: string,
    date: Date,
    duration: number
  ): PlanningSession => {
    const newSession: PlanningSession = {
      id: generateId(),
      subjectId,
      chapterId,
      date: getStartOfDay(date),
      duration,
      status: 'planned',
    };

    setSessions([...sessions, newSession]);
    return newSession;
  };

  // Mettre à jour une session
  const updateSession = (
    id: string,
    updates: Partial<Omit<PlanningSession, 'id'>>
  ) => {
    setSessions(sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  // Supprimer une session
  const deleteSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  // Marquer comme complétée
  const markCompleted = (id: string, xp?: number) => {
    setSessions(
      sessions.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'completed',
              completedAt: new Date(),
              xpEarned: xp,
            }
          : s
      )
    );
  };

  // Marquer comme sautée
  const markSkipped = (id: string) => {
    setSessions(
      sessions.map((s) => (s.id === id ? { ...s, status: 'skipped' } : s))
    );
  };

  // Auto-distribuer les chapitres sur la semaine
  const autoDistribute = (
    chapterIds: string[],
    weekStart: Date,
    duration: number = 30
  ) => {
    const weekDays = getWeekDays(weekStart);
    const newSessions: PlanningSession[] = [];

    chapterIds.forEach((chapterId, index) => {
      const dayIndex = index % 7;
      const subjectId = ''; // À récupérer du chapitre

      newSessions.push({
        id: generateId(),
        subjectId,
        chapterId,
        date: getStartOfDay(weekDays[dayIndex]),
        duration,
        status: 'planned',
      });
    });

    setSessions([...sessions, ...newSessions]);
    return newSessions;
  };

  // Récupérer une session
  const getSession = (id: string): PlanningSession | undefined => {
    return sessions.find((s) => s.id === id);
  };

  // Compter les sessions complétées
  const countCompletedSessions = (): number => {
    return sessions.filter((s) => s.status === 'completed').length;
  };

  return {
    sessions,
    getSessions,
    getSessionsByDate,
    getWeeklySessions,
    createSession,
    updateSession,
    deleteSession,
    markCompleted,
    markSkipped,
    autoDistribute,
    getSession,
    countCompletedSessions,
  };
}
