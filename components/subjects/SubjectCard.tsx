'use client';

import React from 'react';
import { Subject } from '@/types/subject';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SubjectCardProps {
  subject: Subject;
  onClick?: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick }) => {
  const masteredCount = subject.chapters.filter(c => c.mastery === 5).length;
  const totalChapters = subject.chapters.length;

  return (
    <Card onClick={onClick} className="cursor-pointer hover:scale-105 transition-transform">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-4 h-full rounded-l-xl absolute left-0 top-0 bottom-0"
          style={{ backgroundColor: subject.color }}
        />
        {subject.icon && <span className="text-3xl ml-2">{subject.icon}</span>}
        <div className="flex-1">
          <CardTitle className="text-xl">{subject.name}</CardTitle>
        </div>
      </div>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {totalChapters} chapitre{totalChapters !== 1 ? 's' : ''}
          </span>
          {masteredCount > 0 && (
            <Badge variant="success" size="sm">
              {masteredCount} maîtrisé{masteredCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
