import { useState, useEffect, useRef } from 'react';
import { usePersistentState } from './usePersistentState';
import { PomodoroSession, PomodoroStats, PomodoroPreset, PomodoroPhase } from '@/types/pomodoro';
import { STORAGE_KEYS } from '@/lib/storage/storageService';
import { generateId } from '@/lib/utils/validation';
import { isSameDay } from '@/lib/utils/dateUtils';

const PRESET_CONFIGS = {
  '25-5': { focus: 25, break: 5 },
  '40-10': { focus: 40, break: 10 },
  '50-10': { focus: 50, break: 10 },
  custom: { focus: 25, break: 5 },
};

/**
 * Hook pour gérer le timer Pomodoro
 */
export function usePomodoro() {
  const [currentSession, setCurrentSession] = usePersistentState<PomodoroSession | null>(
    STORAGE_KEYS.CURRENT_POMODORO,
    null
  );
  const [stats, setStats] = usePersistentState<PomodoroStats>(
    STORAGE_KEYS.POMODORO_STATS,
    {
      dailyCount: 0,
      totalCompleted: 0,
      longestStreak: 0,
      currentStreak: 0,
    }
  );

  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Démarrer un nouveau Pomodoro
  const startPomodoro = (
    preset: PomodoroPreset,
    sessionId?: string,
    customFocus?: number,
    customBreak?: number
  ) => {
    const config =
      preset === 'custom' && customFocus && customBreak
        ? { focus: customFocus, break: customBreak }
        : PRESET_CONFIGS[preset];

    const newSession: PomodoroSession = {
      id: generateId(),
      preset,
      focusDuration: config.focus,
      breakDuration: config.break,
      currentPhase: 'focus',
      remainingTime: config.focus * 60,
      sessionId,
      startedAt: new Date(),
    };

    setCurrentSession(newSession);
    setIsRunning(true);
  };

  // Pause
  const pausePomodoro = () => {
    setIsRunning(false);
    if (currentSession) {
      setCurrentSession({ ...currentSession, currentPhase: 'paused' });
    }
  };

  // Reprendre
  const resumePomodoro = () => {
    setIsRunning(true);
    if (currentSession && currentSession.currentPhase === 'paused') {
      setCurrentSession({
        ...currentSession,
        currentPhase: currentSession.remainingTime > 0 ? 'focus' : 'break',
      });
    }
  };

  // Arrêter
  const stopPomodoro = () => {
    setIsRunning(false);
    setCurrentSession(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Compléter le Pomodoro
  const completePomodoro = (xp?: number) => {
    if (!currentSession) return;

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Mettre à jour les stats
    const updatedStats = { ...stats };
    updatedStats.totalCompleted += 1;

    // Vérifier si c'est aujourd'hui
    if (
      stats.lastCompletedDate &&
      isSameDay(new Date(stats.lastCompletedDate), now)
    ) {
      updatedStats.dailyCount += 1;
    } else {
      updatedStats.dailyCount = 1;
    }

    // Gérer le streak
    if (stats.lastCompletedDate) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      if (isSameDay(new Date(stats.lastCompletedDate), yesterday)) {
        updatedStats.currentStreak += 1;
        updatedStats.longestStreak = Math.max(
          updatedStats.longestStreak,
          updatedStats.currentStreak
        );
      } else if (!isSameDay(new Date(stats.lastCompletedDate), now)) {
        updatedStats.currentStreak = 1;
      }
    } else {
      updatedStats.currentStreak = 1;
      updatedStats.longestStreak = 1;
    }

    updatedStats.lastCompletedDate = now;
    setStats(updatedStats);

    // Compléter la session
    setCurrentSession({
      ...currentSession,
      completedAt: now,
      xpEarned: xp,
    });

    setIsRunning(false);
    return updatedStats;
  };

  // Timer
  useEffect(() => {
    if (isRunning && currentSession && currentSession.remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentSession((prev) => {
          if (!prev) return prev;

          const newRemaining = prev.remainingTime - 1;

          if (newRemaining <= 0) {
            // Passer à la phase suivante
            if (prev.currentPhase === 'focus') {
              return {
                ...prev,
                currentPhase: 'break',
                remainingTime: prev.breakDuration * 60,
              };
            } else {
              // Fin du cycle complet
              setIsRunning(false);
              return {
                ...prev,
                currentPhase: 'idle',
                remainingTime: 0,
              };
            }
          }

          return {
            ...prev,
            remainingTime: newRemaining,
          };
        });
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isRunning, currentSession?.remainingTime]);

  return {
    currentSession,
    stats,
    isRunning,
    startPomodoro,
    pausePomodoro,
    resumePomodoro,
    stopPomodoro,
    completePomodoro,
  };
}
