'use client';

import React, { useState, useEffect } from 'react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useXP } from '@/hooks/useXP';
import { TimerDisplay } from '@/components/pomodoro/TimerDisplay';
import { TimerControls } from '@/components/pomodoro/TimerControls';
import { PresetSelector } from '@/components/pomodoro/PresetSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PomodoroPreset } from '@/types/pomodoro';
import { XP_REWARDS } from '@/lib/gamification/xpCalculator';

export default function PomodoroPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PomodoroPreset>('25-5');

  const {
    currentSession,
    stats,
    isRunning,
    startPomodoro,
    pausePomodoro,
    resumePomodoro,
    stopPomodoro,
    completePomodoro,
  } = usePomodoro();

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

  const handleStart = () => {
    startPomodoro(selectedPreset);
  };

  const handleComplete = () => {
    const xpGained = XP_REWARDS.POMODORO_COMPLETED;
    completePomodoro(xpGained);
    addXP(xpGained, 'Pomodoro complété');
    incrementStat('totalPomodoros');
    incrementStat('totalMinutesStudied', currentSession?.focusDuration || 25);
  };

  const isPaused = currentSession?.currentPhase === 'paused';
  const isIdle = !currentSession || currentSession.currentPhase === 'idle';
  const canComplete =
    currentSession &&
    (currentSession.currentPhase === 'break' ||
      currentSession.remainingTime === 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pomodoro ⏱️
        </h1>
        <p className="text-gray-600">Restez concentré et productif</p>
      </div>

      {/* Présets (si pas de session active) */}
      {isIdle && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Choisissez un preset
          </h2>
          <PresetSelector
            selectedPreset={selectedPreset}
            onSelect={setSelectedPreset}
          />
        </div>
      )}

      {/* Timer */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <TimerDisplay
          remainingTime={currentSession?.remainingTime || 0}
          totalTime={
            currentSession
              ? currentSession.currentPhase === 'focus' ||
                currentSession.currentPhase === 'paused'
                ? currentSession.focusDuration * 60
                : currentSession.breakDuration * 60
              : 25 * 60
          }
          phase={currentSession?.currentPhase || 'idle'}
        />
      </div>

      {/* Contrôles */}
      <div className="flex justify-center mb-8">
        <TimerControls
          isRunning={isRunning}
          isPaused={isPaused}
          onStart={handleStart}
          onPause={pausePomodoro}
          onResume={resumePomodoro}
          onStop={stopPomodoro}
          onComplete={handleComplete}
          canComplete={!!canComplete}
        />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.dailyCount}</p>
            <p className="text-sm text-gray-600">Aujourd'hui</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold text-purple-600">
              {stats.totalCompleted}
            </p>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold text-green-600">
              {stats.currentStreak}
            </p>
            <p className="text-sm text-gray-600">Série</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
