'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onComplete: () => void;
  canComplete: boolean;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
  onComplete,
  canComplete,
}) => {
  if (!isRunning && !isPaused) {
    return (
      <Button variant="primary" size="lg" onClick={onStart} className="px-12">
        Démarrer
      </Button>
    );
  }

  return (
    <div className="flex gap-3">
      {isPaused ? (
        <Button variant="primary" size="lg" onClick={onResume}>
          Reprendre
        </Button>
      ) : (
        <Button variant="secondary" size="lg" onClick={onPause}>
          Pause
        </Button>
      )}

      <Button variant="danger" size="lg" onClick={onStop}>
        Arrêter
      </Button>

      {canComplete && (
        <Button variant="default" size="lg" onClick={onComplete}>
          Terminer
        </Button>
      )}
    </div>
  );
};
