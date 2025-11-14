'use client';

import React from 'react';
import { Task, TaskPriority } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
  onStatusChange?: (status: Task['status']) => void;
}

const priorityConfig: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: 'Basse', color: 'bg-gray-100 text-gray-700' },
  medium: { label: 'Moyenne', color: 'bg-blue-100 text-blue-700' },
  high: { label: 'Haute', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'Urgente', color: 'bg-red-100 text-red-700' },
};

const statusConfig = {
  todo: { label: 'À faire', color: 'bg-gray-100 text-gray-700' },
  in_progress: { label: 'En cours', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Terminé', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700' },
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onComplete,
  onStatusChange,
}) => {
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Card className={`${task.status === 'completed' ? 'opacity-60' : ''} ${isOverdue ? 'border-red-300 border-2' : ''}`}>
      <CardContent className="py-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className={`text-base font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h4>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${priorityConfig[task.priority].color}`}>
              {priorityConfig[task.priority].label}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[task.status].color}`}>
              {statusConfig[task.status].label}
            </span>
          </div>
        </div>

        {/* Sous-tâches */}
        {totalSubtasks > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{completedSubtasks}/{totalSubtasks} sous-tâches</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Date limite */}
        {task.dueDate && (
          <div className={`text-sm mb-2 ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
            📅 {isOverdue && '⚠️ '}{new Date(task.dueDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: task.dueDate && new Date(task.dueDate).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
            })}
          </div>
        )}

        {/* Temps estimé */}
        {task.estimatedMinutes && (
          <div className="text-sm text-gray-600 mb-2">
            ⏱️ {task.estimatedMinutes} min
            {task.actualMinutes && ` (réel: ${task.actualMinutes} min)`}
          </div>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          {task.status !== 'completed' && onComplete && (
            <button
              onClick={onComplete}
              className="text-xs text-green-600 hover:text-green-700 font-medium"
            >
              ✓ Terminer
            </button>
          )}
          {task.status === 'todo' && onStatusChange && (
            <button
              onClick={() => onStatusChange('in_progress')}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              → En cours
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-xs text-gray-600 hover:text-gray-700"
            >
              Modifier
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Supprimer
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
