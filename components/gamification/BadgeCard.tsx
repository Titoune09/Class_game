'use client';

import React from 'react';
import { Badge as BadgeType } from '@/types/xp';
import { Card, CardContent } from '@/components/ui/card';

interface BadgeCardProps {
  badge: Omit<BadgeType, 'unlockedAt'>;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  isUnlocked,
  unlockedAt,
}) => {
  return (
    <Card
      className={`transition-all ${
        isUnlocked
          ? 'hover:scale-105 cursor-pointer'
          : 'opacity-50 grayscale'
      }`}
    >
      <CardContent className="text-center py-6">
        <div className={`text-5xl mb-3 ${!isUnlocked && 'filter blur-sm'}`}>
          {badge.icon}
        </div>
        <h4 className="font-semibold text-gray-900 mb-1">{badge.name}</h4>
        <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
        {isUnlocked && unlockedAt && (
          <p className="text-xs text-green-600 font-medium">
            Débloqué le {new Date(unlockedAt).toLocaleDateString('fr-FR')}
          </p>
        )}
        {!isUnlocked && (
          <p className="text-xs text-gray-400">🔒 Verrouillé</p>
        )}
      </CardContent>
    </Card>
  );
};
