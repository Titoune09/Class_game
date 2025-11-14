'use client';

import React from 'react';
import { PlanningSession } from '@/types/session';
import { Subject } from '@/types/subject';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SessionCardProps {
  session: PlanningSession;
  subject?: Subject;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  subject,
  onEdit,
  onDelete,
  onComplete,
}) => {
  const statusConfig = {
    planned: { label: 'Prévu', color: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Fait ✓', color: 'bg-green-100 text-green-700' },
    skipped: { label: 'Sauté', color: 'bg-gray-100 text-gray-700' },
  };

  const chapter = subject?.chapters.find((c) => c.id === session.chapterId);

  return (
    <Card className="mb-2">
      <CardContent className="py-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            {subject && (
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: subject.color }}
                />
                <span className="text-xs font-medium text-gray-600">
                  {subject.name}
                </span>
              </div>
            )}
            <h5 className="text-sm font-semibold text-gray-900">
              {chapter?.title || 'Chapitre inconnu'}
            </h5>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[session.status].color}`}>
            {statusConfig[session.status].label}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>⏱️ {session.duration} min</span>
          {session.xpEarned && <span className="text-blue-600">+{session.xpEarned} XP</span>}
        </div>

        {session.status === 'planned' && (
          <div className="mt-2 flex gap-2">
            {onComplete && (
              <button
                onClick={onComplete}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Marquer fait
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-xs text-blue-600 hover:text-blue-700"
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
        )}
      </CardContent>
    </Card>
  );
};
