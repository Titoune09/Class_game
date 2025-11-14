export type PomodoroPreset = '25-5' | '40-10' | '50-10' | 'custom';
export type PomodoroPhase = 'focus' | 'break' | 'paused' | 'idle';

export interface PomodoroSession {
  id: string;
  preset: PomodoroPreset;
  focusDuration: number; // En minutes
  breakDuration: number;
  currentPhase: PomodoroPhase;
  remainingTime: number; // En secondes
  sessionId?: string;
  startedAt?: Date;
  completedAt?: Date;
  xpEarned?: number;
}

export interface PomodoroStats {
  dailyCount: number;
  totalCompleted: number;
  longestStreak: number;
  currentStreak: number;
  lastCompletedDate?: Date;
}
