export type SessionStatus = 'planned' | 'completed' | 'skipped';

export interface PlanningSession {
  id: string;
  subjectId: string;
  chapterId: string;
  date: Date;
  duration: number; // En minutes
  status: SessionStatus;
  completedAt?: Date;
  pomodoroId?: string;
  xpEarned?: number;
}
