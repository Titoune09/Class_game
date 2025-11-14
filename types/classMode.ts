export type ClassPhase = 'before' | 'during' | 'after' | 'completed';
export type ObjectiveType = 'concentration' | 'participation' | 'notes' | 'custom';

export interface ClassObjective {
  id: string;
  type: ObjectiveType;
  description: string;
  completed: boolean;
}

export interface MicroChallenge {
  id: string;
  description: string;
  completed: boolean;
  points: number;
}

export interface ClassSession {
  id: string;
  subjectId: string;
  chapterId: string;
  phase: ClassPhase;
  
  // Phase AVANT
  objectives: ClassObjective[];
  challenge: MicroChallenge;
  
  // Phase PENDANT
  attentionLevel: number; // 0-5
  distractionCount: number;
  quickNotes: string[];
  duration: number; // En minutes
  
  // Phase APRÈS
  evaluation: {
    attentionScore: number; // 0-10
    summary: string;
    toReview: string;
    challengeCompleted: boolean;
    objectivesCompleted: number;
  };
  
  startedAt: Date;
  completedAt?: Date;
  xpEarned?: number;
}

export interface ClassModeStats {
  totalSessions: number;
  averageAttention: number;
  totalDistractionsAvoided: number;
  bestAttentionScore: number;
  currentStreak: number;
  challengesCompleted: number;
}
