import { usePersistentState } from './usePersistentState';
import { Goal, Milestone, TimeFrame } from '@/types/task';
import { generateId } from '@/lib/utils/validation';

/**
 * Hook pour gérer les objectifs (court, moyen, long terme)
 */
export function useGoals() {
  const [goals, setGoals] = usePersistentState<Goal[]>(
    'app_goals' as any,
    []
  );

  // Récupérer tous les objectifs
  const getGoals = () => goals;

  // Récupérer un objectif
  const getGoal = (id: string): Goal | undefined => {
    return goals.find((g) => g.id === id);
  };

  // Récupérer par timeframe
  const getGoalsByTimeFrame = (timeFrame: TimeFrame): Goal[] => {
    return goals.filter((g) => g.timeFrame === timeFrame && g.status === 'active');
  };

  // Récupérer objectifs actifs
  const getActiveGoals = (): Goal[] => {
    return goals.filter((g) => g.status === 'active');
  };

  // Créer un objectif
  const createGoal = (
    title: string,
    description: string,
    timeFrame: TimeFrame,
    targetDate: Date,
    color: string = '#3B82F6',
    icon?: string
  ): Goal => {
    const newGoal: Goal = {
      id: generateId(),
      title,
      description,
      timeFrame,
      targetDate,
      progress: 0,
      status: 'active',
      milestones: [],
      linkedTaskIds: [],
      color,
      icon,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setGoals([...goals, newGoal]);
    return newGoal;
  };

  // Mettre à jour un objectif
  const updateGoal = (
    id: string,
    updates: Partial<Omit<Goal, 'id' | 'createdAt' | 'milestones' | 'linkedTaskIds'>>
  ) => {
    setGoals(
      goals.map((g) =>
        g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g
      )
    );
  };

  // Supprimer un objectif
  const deleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  // Marquer comme complété
  const completeGoal = (id: string) => {
    setGoals(
      goals.map((g) =>
        g.id === id
          ? {
              ...g,
              status: 'completed',
              progress: 100,
              completedAt: new Date(),
              updatedAt: new Date(),
            }
          : g
      )
    );
  };

  // Abandonner un objectif
  const abandonGoal = (id: string) => {
    setGoals(
      goals.map((g) =>
        g.id === id
          ? { ...g, status: 'abandoned', updatedAt: new Date() }
          : g
      )
    );
  };

  // Gestion des milestones
  const addMilestone = (goalId: string, title: string) => {
    setGoals(
      goals.map((g) => {
        if (g.id === goalId) {
          const newMilestone: Milestone = {
            id: generateId(),
            title,
            completed: false,
          };
          return {
            ...g,
            milestones: [...g.milestones, newMilestone],
            updatedAt: new Date(),
          };
        }
        return g;
      })
    );
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(
      goals.map((g) => {
        if (g.id === goalId) {
          const updatedMilestones = g.milestones.map((m) =>
            m.id === milestoneId
              ? {
                  ...m,
                  completed: !m.completed,
                  completedAt: !m.completed ? new Date() : undefined,
                }
              : m
          );

          // Recalculer la progression basée sur les milestones
          const completedCount = updatedMilestones.filter((m) => m.completed).length;
          const newProgress =
            updatedMilestones.length > 0
              ? Math.round((completedCount / updatedMilestones.length) * 100)
              : 0;

          return {
            ...g,
            milestones: updatedMilestones,
            progress: newProgress,
            updatedAt: new Date(),
          };
        }
        return g;
      })
    );
  };

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    setGoals(
      goals.map((g) => {
        if (g.id === goalId) {
          const updatedMilestones = g.milestones.filter((m) => m.id !== milestoneId);
          
          // Recalculer la progression
          const completedCount = updatedMilestones.filter((m) => m.completed).length;
          const newProgress =
            updatedMilestones.length > 0
              ? Math.round((completedCount / updatedMilestones.length) * 100)
              : 0;

          return {
            ...g,
            milestones: updatedMilestones,
            progress: newProgress,
            updatedAt: new Date(),
          };
        }
        return g;
      })
    );
  };

  // Lier une tâche à un objectif
  const linkTask = (goalId: string, taskId: string) => {
    setGoals(
      goals.map((g) => {
        if (g.id === goalId && !g.linkedTaskIds.includes(taskId)) {
          return {
            ...g,
            linkedTaskIds: [...g.linkedTaskIds, taskId],
            updatedAt: new Date(),
          };
        }
        return g;
      })
    );
  };

  const unlinkTask = (goalId: string, taskId: string) => {
    setGoals(
      goals.map((g) => {
        if (g.id === goalId) {
          return {
            ...g,
            linkedTaskIds: g.linkedTaskIds.filter((id) => id !== taskId),
            updatedAt: new Date(),
          };
        }
        return g;
      })
    );
  };

  // Mettre à jour manuellement la progression
  const updateProgress = (goalId: string, progress: number) => {
    setGoals(
      goals.map((g) =>
        g.id === goalId
          ? { ...g, progress: Math.min(Math.max(progress, 0), 100), updatedAt: new Date() }
          : g
      )
    );
  };

  // Calculer le temps restant
  const getDaysRemaining = (goalId: string): number | null => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal || !goal.targetDate) return null;

    const now = new Date();
    const target = new Date(goal.targetDate);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  return {
    goals,
    getGoals,
    getGoal,
    getGoalsByTimeFrame,
    getActiveGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
    abandonGoal,
    addMilestone,
    toggleMilestone,
    deleteMilestone,
    linkTask,
    unlinkTask,
    updateProgress,
    getDaysRemaining,
  };
}
