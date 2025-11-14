'use client';

import React from 'react';
import { PlanningSession } from '@/types/session';
import { Subject } from '@/types/subject';
import { getDayNameShort, isSameDay } from '@/lib/utils/dateUtils';
import { SessionCard } from './SessionCard';
import { Button } from '@/components/ui/button';

interface WeeklyGridProps {
  weekDays: Date[];
  sessions: PlanningSession[];
  subjects: Subject[];
  onAddSession: (date: Date) => void;
  onEditSession: (session: PlanningSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onCompleteSession: (sessionId: string) => void;
}

export const WeeklyGrid: React.FC<WeeklyGridProps> = ({
  weekDays,
  sessions,
  subjects,
  onAddSession,
  onEditSession,
  onDeleteSession,
  onCompleteSession,
}) => {
  const getSessionsForDay = (day: Date) => {
    return sessions.filter((s) => isSameDay(new Date(s.date), day));
  };

  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <div className="grid grid-cols-7 gap-3">
      {weekDays.map((day) => {
        const daySessions = getSessionsForDay(day);
        const today = isToday(day);

        return (
          <div
            key={day.toISOString()}
            className={`bg-white rounded-xl p-3 min-h-[200px] ${
              today ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="mb-3">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  {getDayNameShort(day)}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    today ? 'text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {day.getDate()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {daySessions.map((session) => {
                const subject = subjects.find((s) => s.id === session.subjectId);
                return (
                  <SessionCard
                    key={session.id}
                    session={session}
                    subject={subject}
                    onEdit={() => onEditSession(session)}
                    onDelete={() => onDeleteSession(session.id)}
                    onComplete={() => onCompleteSession(session.id)}
                  />
                );
              })}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-xs"
              onClick={() => onAddSession(day)}
            >
              + Ajouter
            </Button>
          </div>
        );
      })}
    </div>
  );
};
