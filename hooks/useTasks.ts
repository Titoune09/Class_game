import { usePersistentState } from './usePersistentState';
import { Task, SubTask, TaskStatus, TaskPriority, TasksStats } from '@/types/task';
import { STORAGE_KEYS } from '@/lib/storage/storageService';
import { generateId } from '@/lib/utils/validation';
import { isSameDay, getStartOfWeek, getEndOfWeek } from '@/lib/utils/dateUtils';

/**
 * Hook pour gérer les tâches
 */
export function useTasks() {
  const [tasks, setTasks] = usePersistentState<Task[]>(
    'app_tasks' as any,
    []
  );

  // Récupérer toutes les tâches
  const getTasks = () => tasks;

  // Récupérer une tâche
  const getTask = (id: string): Task | undefined => {
    return tasks.find((t) => t.id === id);
  };

  // Récupérer les tâches par statut
  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter((t) => t.status === status);
  };

  // Récupérer les tâches par objectif
  const getTasksByGoal = (goalId: string): Task[] => {
    return tasks.filter((t) => t.goalId === goalId);
  };

  // Récupérer les tâches par matière
  const getTasksBySubject = (subjectId: string): Task[] => {
    return tasks.filter((t) => t.subjectId === subjectId);
  };

  // Récupérer les tâches par date limite
  const getTasksDueToday = (): Task[] => {
    const today = new Date();
    return tasks.filter(
      (t) => t.dueDate && isSameDay(new Date(t.dueDate), today) && t.status !== 'completed'
    );
  };

  const getTasksDueThisWeek = (): Task[] => {
    const now = new Date();
    const weekStart = getStartOfWeek(now);
    const weekEnd = getEndOfWeek(now);
    
    return tasks.filter((t) => {
      if (!t.dueDate || t.status === 'completed') return false;
      const dueDate = new Date(t.dueDate);
      return dueDate >= weekStart && dueDate <= weekEnd;
    });
  };

  const getOverdueTasks = (): Task[] => {
    const now = new Date();
    return tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
    );
  };

  // Créer une tâche
  const createTask = (
    title: string,
    priority: TaskPriority = 'medium',
    options?: {
      description?: string;
      goalId?: string;
      subjectId?: string;
      chapterId?: string;
      dueDate?: Date;
      estimatedMinutes?: number;
      tags?: string[];
    }
  ): Task => {
    const newTask: Task = {
      id: generateId(),
      title,
      description: options?.description,
      status: 'todo',
      priority,
      goalId: options?.goalId,
      subjectId: options?.subjectId,
      chapterId: options?.chapterId,
      dueDate: options?.dueDate,
      estimatedMinutes: options?.estimatedMinutes,
      subtasks: [],
      tags: options?.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks([...tasks, newTask]);
    return newTask;
  };

  // Mettre à jour une tâche
  const updateTask = (
    id: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt' | 'subtasks'>>
  ) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      )
    );
  };

  // Supprimer une tâche
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Changer le statut
  const setTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          const updates: any = { status, updatedAt: new Date() };
          if (status === 'completed') {
            updates.completedAt = new Date();
          }
          return { ...t, ...updates };
        }
        return t;
      })
    );
  };

  // Marquer comme complétée
  const completeTask = (id: string, actualMinutes?: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'completed',
              completedAt: new Date(),
              actualMinutes: actualMinutes || t.actualMinutes,
              updatedAt: new Date(),
            }
          : t
      )
    );
  };

  // Gestion des sous-tâches
  const addSubTask = (taskId: string, title: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const newSubtask: SubTask = {
            id: generateId(),
            title,
            completed: false,
          };
          return {
            ...t,
            subtasks: [...t.subtasks, newSubtask],
            updatedAt: new Date(),
          };
        }
        return t;
      })
    );
  };

  const toggleSubTask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            ),
            updatedAt: new Date(),
          };
        }
        return t;
      })
    );
  };

  const deleteSubTask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.filter((st) => st.id !== subtaskId),
            updatedAt: new Date(),
          };
        }
        return t;
      })
    );
  };

  // Calculer les statistiques
  const getStats = (): TasksStats => {
    const completed = tasks.filter((t) => t.status === 'completed');
    const inProgress = tasks.filter((t) => t.status === 'in_progress');
    
    const now = new Date();
    const weekStart = getStartOfWeek(now);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const completedThisWeek = completed.filter(
      (t) => t.completedAt && new Date(t.completedAt) >= weekStart
    );

    const completedThisMonth = completed.filter(
      (t) => t.completedAt && new Date(t.completedAt) >= monthStart
    );

    const totalMinutes = completed.reduce(
      (sum, t) => sum + (t.actualMinutes || t.estimatedMinutes || 0),
      0
    );

    return {
      totalTasks: tasks.length,
      completedTasks: completed.length,
      inProgressTasks: inProgress.length,
      completionRate: tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0,
      totalMinutesSpent: totalMinutes,
      tasksCompletedThisWeek: completedThisWeek.length,
      tasksCompletedThisMonth: completedThisMonth.length,
    };
  };

  return {
    tasks,
    getTasks,
    getTask,
    getTasksByStatus,
    getTasksByGoal,
    getTasksBySubject,
    getTasksDueToday,
    getTasksDueThisWeek,
    getOverdueTasks,
    createTask,
    updateTask,
    deleteTask,
    setTaskStatus,
    completeTask,
    addSubTask,
    toggleSubTask,
    deleteSubTask,
    getStats,
  };
}
