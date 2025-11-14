import { useSubjects } from './useSubjects';
import { usePlanning } from './usePlanning';
import { useClassMode } from './useClassMode';
import { DailyStats, SubjectStats, WeeklyStats } from '@/types/stats';
import { getStartOfDay, isSameDay, getWeekDays } from '@/lib/utils/dateUtils';

/**
 * Hook pour calculer les statistiques
 */
export function useStats() {
  const { subjects } = useSubjects();
  const { sessions } = usePlanning();
  const { getSessionHistory } = useClassMode();

  // Statistiques quotidiennes
  const getDailyStats = (date: Date): DailyStats => {
    const daySessions = sessions.filter(
      (s) => s.status === 'completed' && isSameDay(new Date(s.date), date)
    );

    const minutesStudied = daySessions.reduce(
      (total, s) => total + s.duration,
      0
    );

    return {
      date: getStartOfDay(date),
      minutesStudied,
      sessionsCompleted: daySessions.length,
      pomodorosCompleted: 0, // À compléter avec stats pomodoro
    };
  };

  // Statistiques hebdomadaires
  const getWeeklyStats = (weekStart: Date): WeeklyStats => {
    const weekDays = getWeekDays(weekStart);
    const days = weekDays.map((day) => getDailyStats(day));

    const totalMinutes = days.reduce((sum, day) => sum + day.minutesStudied, 0);
    const totalSessions = days.reduce(
      (sum, day) => sum + day.sessionsCompleted,
      0
    );

    return {
      days,
      totalMinutes,
      totalSessions,
    };
  };

  // Répartition par matière
  const getSubjectDistribution = (): SubjectStats[] => {
    const distribution: SubjectStats[] = [];

    subjects.forEach((subject) => {
      const subjectSessions = sessions.filter(
        (s) => s.subjectId === subject.id && s.status === 'completed'
      );

      const totalMinutes = subjectSessions.reduce(
        (total, s) => total + s.duration,
        0
      );

      if (totalMinutes > 0) {
        distribution.push({
          subjectId: subject.id,
          subjectName: subject.name,
          totalMinutes,
          sessionsCompleted: subjectSessions.length,
          color: subject.color,
        });
      }
    });

    return distribution.sort((a, b) => b.totalMinutes - a.totalMinutes);
  };

  // Taux de complétion du planning
  const getCompletionRate = (): number => {
    if (sessions.length === 0) return 0;

    const completed = sessions.filter((s) => s.status === 'completed').length;
    return Math.round((completed / sessions.length) * 100);
  };

  // Tendance attention en classe
  const getAttentionTrend = (days: number = 7): number[] => {
    const history = getSessionHistory();
    const recentSessions = history
      .slice(-days)
      .map((s) => s.evaluation.attentionScore);

    return recentSessions;
  };

  // Minutes totales étudiées
  const getTotalMinutesStudied = (): number => {
    return sessions
      .filter((s) => s.status === 'completed')
      .reduce((total, s) => total + s.duration, 0);
  };

  return {
    getDailyStats,
    getWeeklyStats,
    getSubjectDistribution,
    getCompletionRate,
    getAttentionTrend,
    getTotalMinutesStudied,
  };
}
