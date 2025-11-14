'use client';

import React from 'react';
import { UserProgress } from '@/types/xp';
import { Progress } from '@/components/ui/progress';

interface XPDisplayProps {
  progress: UserProgress;
  variant?: 'full' | 'compact';
}

export const XPDisplay: React.FC<XPDisplayProps> = ({
  progress,
  variant = 'full',
}) => {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-sm">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
          {progress.xp.level}
        </div>
        <div className="flex-1 min-w-[120px]">
          <Progress
            value={progress.xp.currentLevelXP}
            max={progress.xp.currentLevelXP + progress.xp.xpToNextLevel}
            color="purple"
          />
        </div>
        <span className="text-xs text-gray-600 font-medium">
          {progress.xp.totalXP} XP
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm opacity-90 mb-1">Niveau</p>
          <p className="text-5xl font-bold">{progress.xp.level}</p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90 mb-1">XP Total</p>
          <p className="text-2xl font-bold">{progress.xp.totalXP}</p>
        </div>
      </div>

      <div className="bg-white bg-opacity-20 rounded-lg p-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Progression vers niveau {progress.xp.level + 1}</span>
          <span className="font-semibold">
            {progress.xp.currentLevelXP} / {progress.xp.currentLevelXP + progress.xp.xpToNextLevel}
          </span>
        </div>
        <div className="w-full bg-white bg-opacity-30 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{
              width: `${
                (progress.xp.currentLevelXP /
                  (progress.xp.currentLevelXP + progress.xp.xpToNextLevel)) *
                100
              }%`,
            }}
          />
        </div>
        <p className="text-xs opacity-80 mt-2">
          Plus que {progress.xp.xpToNextLevel} XP pour level up !
        </p>
      </div>
    </div>
  );
};
