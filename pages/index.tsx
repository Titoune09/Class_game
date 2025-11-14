'use client';

import React, { useState, useEffect } from 'react';
import { useSubjects } from '@/hooks/useSubjects';
import { usePlanning } from '@/hooks/usePlanning';
import { useXP } from '@/hooks/useXP';
import { useClassMode } from '@/hooks/useClassMode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XPDisplay } from '@/components/gamification/XPDisplay';
import { SessionCard } from '@/components/planning/SessionCard';
import { isSameDay } from '@/lib/utils/dateUtils';
import Link from 'next/link';

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const { subjects } = useSubjects();
  const { sessions } = usePlanning();
  const { progress } = useXP();
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

  const today = new Date();
  const todaySessions = sessions.filter((s) => isSameDay(new Date(s.date), today));
  const completedToday = todaySessions.filter((s) => s.status === 'completed');

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {greeting()} 👋
        </h1>
        <p className="text-gray-600">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>

      {/* XP Display */}
      <div className="mb-8">
        <XPDisplay progress={progress} />
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/pomodoro">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardContent className="py-6 text-center">
              <div className="text-5xl mb-3">⏱️</div>
              <h3 className="font-semibold text-gray-900">Pomodoro</h3>
              <p className="text-sm text-gray-600">Démarrer une session</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/class-mode">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardContent className="py-6 text-center">
              <div className="text-5xl mb-3">🎓</div>
              <h3 className="font-semibold text-gray-900">Mode Classe</h3>
              <p className="text-sm text-gray-600">Suivre un cours</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Sessions du jour */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Aujourd'hui</CardTitle>
            <Link href="/planning">
              <Button variant="ghost" size="sm">
                Voir planning
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {todaySessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-4xl mb-3">📅</p>
              <p>Aucune session prévue aujourd'hui</p>
              <Link href="/planning">
                <Button variant="primary" size="sm" className="mt-4">
                  Planifier une session
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySessions.map((session) => {
                const subject = subjects.find((s) => s.id === session.subjectId);
                return (
                  <SessionCard
                    key={session.id}
                    session={session}
                    subject={subject}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {completedToday.length}
            </p>
            <p className="text-sm text-gray-600">Sessions aujourd'hui</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold text-purple-600">
              {progress.streaks.current}
            </p>
            <p className="text-sm text-gray-600">Jours de suite</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold text-green-600">
              {classStats.totalSessions}
            </p>
            <p className="text-sm text-gray-600">Cours suivis</p>
          </CardContent>
        </Card>
      </div>

      {/* Badges récents */}
      {progress.badges.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Badges récents</CardTitle>
              <Link href="/stats">
                <Button variant="ghost" size="sm">
                  Voir tous
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {progress.badges.slice(-4).map((badge) => (
                <div key={badge.id} className="text-center">
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="text-xs font-medium text-gray-700">
                    {badge.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
