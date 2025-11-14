'use client';

import React from 'react';
import { Chapter, Priority } from '@/types/subject';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ChapterCardProps {
  chapter: Chapter;
  onEdit?: () => void;
  onDelete?: () => void;
}

const priorityConfig: Record<Priority, { label: string; variant: any }> = {
  low: { label: 'Basse', variant: 'default' },
  medium: { label: 'Moyenne', variant: 'warning' },
  high: { label: 'Haute', variant: 'danger' },
};

export const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  onEdit,
  onDelete,
}) => {
  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-xl ${
              i <= chapter.mastery ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-semibold text-gray-900">{chapter.title}</h4>
          <Badge
            variant={priorityConfig[chapter.priority].variant}
            size="sm"
          >
            {priorityConfig[chapter.priority].label}
          </Badge>
        </div>

        {chapter.description && (
          <p className="text-sm text-gray-600 mb-3">{chapter.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Maîtrise</p>
            {renderStars()}
          </div>

          {chapter.examDate && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Examen</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(chapter.examDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Modifier
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Supprimer
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
