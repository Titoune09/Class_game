'use client';

import React from 'react';
import { Goal, TimeFrame } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GoalCardProps {
  goal: Goal;
  taskCount?: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const timeFrameConfig: Record<TimeFrame, { label: string; emoji: string }> = {
  short: { label: 'Court terme', emoji: '🎯' },
  medium: { label: 'Moyen terme', emoji: '🚀' },
  long: { label: 'Long terme', emoji: '🏆' },
};

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  taskCount = 0,
  onClick,
  onEdit,
  onDelete,
}) => {
  const daysRemaining = Math.ceil(
    (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isOverdue = daysRemaining < 0 && goal.status === 'active';
  const completedMilestones = goal.milestones.filter((m) => m.completed).length;

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer hover:shadow-lg transition-all ${
        goal.status === 'completed' ? 'opacity-60' : ''
      } ${isOverdue ? 'border-red-300 border-2' : ''}`}
    >
      <div
        className="h-2 rounded-t-xl"
        style={{ backgroundColor: goal.color }}
      />
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{goal.icon || timeFrameConfig[goal.timeFrame].emoji}</span>
            <div>
              <CardTitle className="text-lg">{goal.title}</CardTitle>
              <p className="text-sm text-gray-500">
                {timeFrameConfig[goal.timeFrame].label}
              </p>
            </div>
          </div>
          {goal.status === 'completed' && (
            <span className="text-2xl">✓</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{goal.description}</p>

        {/* Progression */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Progression</span>
            <span className="text-gray-600">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} max={100} color="purple" />
        </div>

        {/* Milestones */}
        {goal.milestones.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">
              Étapes : {completedMilestones}/{goal.milestones.length}
            </p>
            <div className="space-y-1">
              {goal.milestones.slice(0, 3).map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-2 text-sm">
                  <span className={milestone.completed ? 'text-green-500' : 'text-gray-400'}>
                    {milestone.completed ? '✓' : '○'}
                  </span>
                  <span className={milestone.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                    {milestone.title}
                  </span>
                </div>
              ))}
              {goal.milestones.length > 3 && (
                <p className="text-xs text-gray-500 ml-5">
                  +{goal.milestones.length - 3} autre(s)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tâches liées */}
        {taskCount > 0 && (
          <div className="text-sm text-gray-600 mb-3">
            📋 {taskCount} tâche(s) liée(s)
          </div>
        )}

        {/* Date cible */}
        <div className="flex justify-between items-center text-sm">
          <span className={isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}>
            {isOverdue ? '⚠️ En retard' : daysRemaining > 0 ? `${daysRemaining} jours restants` : 'Aujourd\'hui'}
          </span>
          <span className="text-gray-500">
            {new Date(goal.targetDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2 mt-3 pt-3 border-t">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Modifier
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Supprimer
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
