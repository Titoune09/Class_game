'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Subject } from '@/types/subject';
import { ClassObjective, MicroChallenge, ObjectiveType } from '@/types/classMode';
import { generateId } from '@/lib/utils/validation';

interface BeforeClassProps {
  subjects: Subject[];
  challenge: MicroChallenge;
  onStart: (subjectId: string, chapterId: string, objectives: ClassObjective[]) => void;
  onChangeChallenge: () => void;
}

const PRESET_OBJECTIVES: { type: ObjectiveType; description: string }[] = [
  { type: 'concentration', description: 'Rester concentré 20 min d\'affilée' },
  { type: 'participation', description: 'Participer au moins 1 fois' },
  { type: 'notes', description: 'Prendre des notes claires' },
  { type: 'concentration', description: 'Comprendre le concept principal' },
  { type: 'notes', description: 'Noter tous les exemples importants' },
  { type: 'participation', description: 'Poser 1 question' },
];

export const BeforeClass: React.FC<BeforeClassProps> = ({
  subjects,
  challenge,
  onStart,
  onChangeChallenge,
}) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedObjectives, setSelectedObjectives] = useState<number[]>([]);

  const subject = subjects.find((s) => s.id === selectedSubject);
  const chapters = subject?.chapters || [];

  const toggleObjective = (index: number) => {
    if (selectedObjectives.includes(index)) {
      setSelectedObjectives(selectedObjectives.filter((i) => i !== index));
    } else {
      if (selectedObjectives.length < 3) {
        setSelectedObjectives([...selectedObjectives, index]);
      }
    }
  };

  const handleStart = () => {
    if (selectedSubject && selectedChapter) {
      const objectives: ClassObjective[] = selectedObjectives.map((index) => ({
        id: generateId(),
        type: PRESET_OBJECTIVES[index].type,
        description: PRESET_OBJECTIVES[index].description,
        completed: false,
      }));

      onStart(selectedSubject, selectedChapter, objectives);
    }
  };

  const canStart = selectedSubject && selectedChapter && selectedObjectives.length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🏫 Préparer le cours
        </h1>
        <p className="text-gray-600">
          Définissez vos objectifs pour rester motivé et concentré
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Quel cours allez-vous suivre ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="Matière"
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedChapter('');
            }}
            options={[
              { value: '', label: 'Choisir une matière...' },
              ...subjects.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />

          {selectedSubject && (
            <Select
              label="Chapitre"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              options={[
                { value: '', label: 'Choisir un chapitre...' },
                ...chapters.map((c) => ({ value: c.id, label: c.title })),
              ]}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Choisissez vos objectifs (1-3)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {PRESET_OBJECTIVES.map((obj, index) => (
              <button
                key={index}
                onClick={() => toggleObjective(index)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedObjectives.includes(index)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedObjectives.includes(index)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedObjectives.includes(index) && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <span className="font-medium text-gray-900">
                    {obj.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {selectedObjectives.length}/3 objectifs sélectionnés
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Votre micro-défi du jour 🎯</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {challenge.description}
            </p>
            <p className="text-sm text-gray-600">+{challenge.points} XP bonus</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onChangeChallenge}
            className="mt-3"
          >
            Changer de défi
          </Button>
        </CardContent>
      </Card>

      <Button
        variant="primary"
        size="lg"
        onClick={handleStart}
        disabled={!canStart}
        className="w-full"
      >
        Commencer le cours 🚀
      </Button>
    </div>
  );
};
