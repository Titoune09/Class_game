export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TimeFrame = 'short' | 'medium' | 'long'; // Court: 0-2 semaines, Moyen: 2-8 semaines, Long: 2+ mois

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  goalId?: string; // Lié à un objectif
  subjectId?: string; // Lié à une matière
  chapterId?: string; // Lié à un chapitre
  dueDate?: Date;
  completedAt?: Date;
  estimatedMinutes?: number;
  actualMinutes?: number;
  subtasks: SubTask[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  timeFrame: TimeFrame;
  targetDate: Date;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'abandoned';
  milestones: Milestone[];
  linkedTaskIds: string[];
  color: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

export interface TasksStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  completionRate: number;
  totalMinutesSpent: number;
  tasksCompletedThisWeek: number;
  tasksCompletedThisMonth: number;
}
