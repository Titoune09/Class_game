'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassSession } from '@/types/classMode';

interface AfterClassProps {
  session: ClassSession;
  onComplete: (
    attentionScore: number,
    summary: string,
    toReview: string,
    challengeCompleted: boolean
  ) => void;
}

export const AfterClass: React.FC<AfterClassProps> = ({ session, onComplete }) => {
  const [attentionScore, setAttentionScore] = useState(5);
  const [summary, setSummary] = useState('');
  const [toReview, setToReview] = useState('');
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.trim() && toReview.trim()) {
      onComplete(attentionScore, summary, toReview, challengeCompleted);
    }
  };

  const canSubmit = summary.trim() && toReview.trim();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cours terminé !
        </h1>
        <p className="text-gray-600">
          Prenez 60 secondes pour faire le point
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Score d'attention */}
        <Card>
          <CardHeader>
            <CardTitle>Note d'attention globale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-3 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setAttentionScore(score)}
                  className={`w-12 h-12 rounded-lg font-bold transition-all ${
                    attentionScore === score
                      ? 'bg-blue-500 text-white scale-110 shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500">
              1 = Très distrait • 10 = Parfaitement concentré
            </p>
          </CardContent>
        </Card>

        {/* Résumé */}
        <Card>
          <CardHeader>
            <CardTitle>Résumé en une phrase</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Ex: Nous avons vu les dérivées et leur application..."
              rows={3}
              required
            />
          </CardContent>
        </Card>

        {/* À revoir */}
        <Card>
          <CardHeader>
            <CardTitle>Une chose à revoir avant le prochain cours</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={toReview}
              onChange={(e) => setToReview(e.target.value)}
              placeholder="Ex: Les règles de dérivation des fonctions composées"
              required
            />
          </CardContent>
        </Card>

        {/* Défi */}
        <Card>
          <CardHeader>
            <CardTitle>Micro-défi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{session.challenge.description}</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setChallengeCompleted(true)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  challengeCompleted
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">✅</div>
                <div className="font-semibold">Réussi</div>
                <div className="text-xs text-gray-600">
                  +{session.challenge.points} XP
                </div>
              </button>
              <button
                type="button"
                onClick={() => setChallengeCompleted(false)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  !challengeCompleted
                    ? 'border-gray-400 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">❌</div>
                <div className="font-semibold">Pas fait</div>
                <div className="text-xs text-gray-600">Pas de XP</div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Résumé stats */}
        <Card className="bg-blue-50">
          <CardContent className="py-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Durée</p>
                <p className="text-xl font-bold text-gray-900">
                  {session.duration} min
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Distractions</p>
                <p className="text-xl font-bold text-gray-900">
                  {session.distractionCount}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Notes</p>
                <p className="text-xl font-bold text-gray-900">
                  {session.quickNotes.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!canSubmit}
          className="w-full"
        >
          Valider et gagner de l'XP 🎯
        </Button>
      </form>
    </div>
  );
};
