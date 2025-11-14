export interface DailyStats {
  date: Date;
  minutesStudied: number;
  sessionsCompleted: number;
  pomodorosCompleted: number;
}

export interface SubjectStats {
  subjectId: string;
  subjectName: string;
  totalMinutes: number;
  sessionsCompleted: number;
  color: string;
}

export interface WeeklyStats {
  days: DailyStats[];
  totalMinutes: number;
  totalSessions: number;
}
