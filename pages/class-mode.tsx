'use client';

import React, { useState, useEffect } from 'react';
import { useSubjects } from '@/hooks/useSubjects';
import { useClassMode } from '@/hooks/useClassMode';
import { useXP } from '@/hooks/useXP';
import { BeforeClass } from '@/components/class-mode/BeforeClass';
import { DuringClass } from '@/components/class-mode/DuringClass';
import { AfterClass } from '@/components/class-mode/AfterClass';
import { Button } from '@/components/ui/button';
import { ClassObjective } from '@/types/classMode';
import { generateRandomChallenge } from '@/lib/class/challengeGenerator';
import { calculateClassXP } from '@/lib/gamification/xpCalculator';

export default function ClassModePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(
    generateRandomChallenge()
  );

  const { subjects } = useSubjects();
  const {
    activeSession,
    startClassSession,
    setObjectives,
    setChallenge,
    startClass,
    updateAttention,
    addDistraction,
    addQuickNote,
    endClass,
    completeClass,
    cancelSession,
    toggleObjective,
  } = useClassMode();

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

  const handleStart = (
    subjectId: string,
    chapterId: string,
    objectives: ClassObjective[]
  ) => {
    const session = startClassSession(subjectId, chapterId);
    if (session) {
      setObjectives(objectives);
      setChallenge(currentChallenge);
      startClass();
    }
  };

  const handleChangeChallenge = () => {
    setCurrentChallenge(generateRandomChallenge());
  };

  const handleComplete = (
    attentionScore: number,
    summary: string,
    toReview: string,
    challengeCompleted: boolean
  ) => {
    if (!activeSession) return;

    const result = completeClass(
      attentionScore,
      summary,
      toReview,
      challengeCompleted
    );

    if (result) {
      const xpGained = calculateClassXP(
        attentionScore,
        activeSession.distractionCount,
        challengeCompleted,
        result.session.evaluation.objectivesCompleted
      );

      addXP(xpGained, 'Cours terminé');
      incrementStat('totalClassSessions');
      incrementStat('totalMinutesStudied', activeSession.duration);

      // TODO: Afficher un récapitulatif
      alert(`Cours terminé ! +${xpGained} XP`);
    }
  };

  const subject = subjects.find((s) => s.id === activeSession?.subjectId);

  // Phase AVANT
  if (!activeSession || activeSession.phase === 'before') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-6 pb-24">
        <BeforeClass
          subjects={subjects}
          challenge={currentChallenge}
          onStart={handleStart}
          onChangeChallenge={handleChangeChallenge}
        />
      </div>
    );
  }

  // Phase PENDANT
  if (activeSession.phase === 'during') {
    return (
      <DuringClass
        session={activeSession}
        subject={subject}
        onUpdateAttention={updateAttention}
        onAddDistraction={addDistraction}
        onAddQuickNote={addQuickNote}
        onEnd={endClass}
        onCancel={cancelSession}
      />
    );
  }

  // Phase APRÈS
  if (activeSession.phase === 'after') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-6 pb-24">
        <AfterClass session={activeSession} onComplete={handleComplete} />
      </div>
    );
  }

  return null;
}
