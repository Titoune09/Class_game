'use client';

import React, { useState, useEffect } from 'react';
import { useSubjects } from '@/hooks/useSubjects';
import { useXP } from '@/hooks/useXP';
import { useStats } from '@/hooks/useStats';
import { useClassMode } from '@/hooks/useClassMode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XPDisplay } from '@/components/gamification/XPDisplay';
import { BadgeCard } from '@/components/gamification/BadgeCard';
import { StatsOverview } from '@/components/stats/StatsOverview';
import { ALL_BADGES } from '@/lib/gamification/badgeSystem';

export default function StatsPage() {
  const [isMounted, setIsMounted] = useState(false);

  const { subjects } = useSubjects();
  const { progress } = useXP();
  const { getTotalMinutesStudied, getSubjectDistribution } = useStats();
  const { stats: classStats } = useClassMode();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Chargement...</div>
      </div>
    );
  }

  const totalMinutes = getTotalMinutesStudied();
  const hours = Math.floor(totalMinutes / 60);
  const subjectDistribution = getSubjectDistribution();

  const stats = [
    {
      label: 'Minutes étudiées',
      value: totalMinutes,
      icon: '⏱️',
      color: '#3B82F6',
    },
    {
      label: 'Sessions',
      value: progress.statistics.totalSessions,
      icon: '📚',
      color: '#8B5CF6',
    },
    {
      label: 'Cours suivis',
      value: progress.statistics.totalClassSessions,
      icon: '🎓',
      color: '#10B981',
    },
    {
      label: 'Série',
      value: progress.streaks.current,
      icon: '🔥',
      color: '#F59E0B',
    },
  ];

  const unlockedBadgeIds = new Set(progress.badges.map((b) => b.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Statistiques 📊
        </h1>
        <p className="text-gray-600">Votre progression et vos succès</p>
      </div>

      {/* XP */}
      <div className="mb-8">
        <XPDisplay progress={progress} />
      </div>

      {/* Vue d'ensemble */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Vue d'ensemble
        </h2>
        <StatsOverview stats={stats} />
      </div>

      {/* Répartition par matière */}
      {subjectDistribution.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Répartition par matière</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectDistribution.map((item) => {
                const percentage =
                  (item.totalMinutes / totalMinutes) * 100 || 0;
                return (
                  <div key={item.subjectId}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{item.subjectName}</span>
                      <span className="text-gray-600">
                        {item.totalMinutes} min ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats mode classe */}
      {classStats.totalSessions > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mode Classe 🎓</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {classStats.averageAttention.toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">Attention moyenne</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {classStats.bestAttentionScore}
                </p>
                <p className="text-sm text-gray-600">Meilleur score</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {classStats.challengesCompleted}
                </p>
                <p className="text-sm text-gray-600">Défis réussis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badges */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Badges ({progress.badges.length}/{ALL_BADGES.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ALL_BADGES.map((badge) => {
            const unlockedBadge = progress.badges.find(
              (b) => b.id === badge.id
            );
            return (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isUnlocked={unlockedBadgeIds.has(badge.id)}
                unlockedAt={unlockedBadge?.unlockedAt}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
