export interface XPSystem {
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  currentLevelXP: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'beginner' | 'consistency' | 'pomodoro' | 'class' | 'mastery';
  condition: string;
  unlockedAt?: Date;
}

export interface UserProgress {
  xp: XPSystem;
  badges: Badge[];
  streaks: {
    current: number;
    longest: number;
    lastActivityDate: Date;
  };
  statistics: {
    totalMinutesStudied: number;
    totalSessions: number;
    totalPomodoros: number;
    totalClassSessions: number;
  };
}
