'use client';

import React, { useState, useEffect } from 'react';
import { useSubjects } from '@/hooks/useSubjects';
import { usePlanning } from '@/hooks/usePlanning';
import { useXP } from '@/hooks/useXP';
import { WeeklyGrid } from '@/components/planning/WeeklyGrid';
import { SessionForm } from '@/components/planning/SessionForm';
import { Button } from '@/components/ui/button';
import { getStartOfWeek, addDays, getWeekDays } from '@/lib/utils/dateUtils';
import { XP_REWARDS } from '@/lib/gamification/xpCalculator';

export default function PlanningPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getStartOfWeek(new Date())
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { subjects } = useSubjects();
  const { sessions, createSession, deleteSession, markCompleted } = usePlanning();
  const { addXP, incrementStat } = useXP();

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

  const weekDays = getWeekDays(currentWeekStart);
  const weeklySessions = sessions.filter((s) => {
    const sessionDate = new Date(s.date);
    return weekDays.some(
      (day) =>
        day.getFullYear() === sessionDate.getFullYear() &&
        day.getMonth() === sessionDate.getMonth() &&
        day.getDate() === sessionDate.getDate()
    );
  });

  const handlePreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const handleToday = () => {
    setCurrentWeekStart(getStartOfWeek(new Date()));
  };

  const handleAddSession = (date: Date) => {
    setSelectedDate(date);
    setIsFormOpen(true);
  };

  const handleCreateSession = (
    subjectId: string,
    chapterId: string,
    duration: number
  ) => {
    if (selectedDate) {
      createSession(subjectId, chapterId, selectedDate, duration);
      setIsFormOpen(false);
      setSelectedDate(null);
    }
  };

  const handleCompleteSession = (sessionId: string) => {
    const xpGained = XP_REWARDS.SESSION_COMPLETED;
    markCompleted(sessionId, xpGained);
    addXP(xpGained, 'Session complétée');
    incrementStat('totalSessions');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Planning 📅
          </h1>
          <p className="text-gray-600">
            Semaine du{' '}
            {currentWeekStart.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
      </div>

      {/* Navigation semaine */}
      <div className="flex gap-3 mb-6">
        <Button variant="outline" onClick={handlePreviousWeek}>
          ← Semaine précédente
        </Button>
        <Button variant="default" onClick={handleToday}>
          Aujourd'hui
        </Button>
        <Button variant="outline" onClick={handleNextWeek}>
          Semaine suivante →
        </Button>
      </div>

      {/* Grid hebdomadaire */}
      <WeeklyGrid
        weekDays={weekDays}
        sessions={weeklySessions}
        subjects={subjects}
        onAddSession={handleAddSession}
        onEditSession={(session) => {
          // TODO: Implement edit
        }}
        onDeleteSession={deleteSession}
        onCompleteSession={handleCompleteSession}
      />

      {/* Formulaire */}
      <SessionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedDate(null);
        }}
        onSubmit={handleCreateSession}
        subjects={subjects}
        preSelectedDate={selectedDate || undefined}
      />
    </div>
  );
}
