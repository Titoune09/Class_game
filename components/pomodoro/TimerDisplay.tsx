'use client';

import React from 'react';
import { CircularProgress } from '@/components/ui/progress';
import { formatTime } from '@/lib/utils/dateUtils';

interface TimerDisplayProps {
  remainingTime: number;
  totalTime: number;
  phase: 'focus' | 'break' | 'paused' | 'idle';
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  remainingTime,
  totalTime,
  phase,
}) => {
  const percentage = ((totalTime - remainingTime) / totalTime) * 100;

  const phaseConfig = {
    focus: { label: 'Focus', color: '#3B82F6', emoji: '🎯' },
    break: { label: 'Pause', color: '#10B981', emoji: '☕' },
    paused: { label: 'En pause', color: '#F59E0B', emoji: '⏸️' },
    idle: { label: 'Prêt', color: '#6B7280', emoji: '⏰' },
  };

  const config = phaseConfig[phase];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4">
        <span className="text-5xl">{config.emoji}</span>
      </div>

      <CircularProgress
        value={percentage}
        size={280}
        strokeWidth={12}
        color={config.color}
      >
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-900 mb-2">
            {formatTime(remainingTime)}
          </div>
          <div className="text-xl text-gray-600">{config.label}</div>
        </div>
      </CircularProgress>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          {phase === 'focus' ? 'Restez concentré' : phase === 'break' ? 'Prenez une pause' : ''}
        </p>
      </div>
    </div>
  );
};
