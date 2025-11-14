'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/input';
import { ClassSession } from '@/types/classMode';
import { Subject } from '@/types/subject';

interface DuringClassProps {
  session: ClassSession;
  subject?: Subject;
  onUpdateAttention: (level: number) => void;
  onAddDistraction: () => void;
  onAddQuickNote: (note: string) => void;
  onEnd: () => void;
  onCancel: () => void;
}

export const DuringClass: React.FC<DuringClassProps> = ({
  session,
  subject,
  onUpdateAttention,
  onAddDistraction,
  onAddQuickNote,
  onEnd,
  onCancel,
}) => {
  const [duration, setDuration] = useState(0);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const chapter = subject?.chapters.find((c) => c.id === session.chapterId);

  // Timer pour la durée
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((d) => d + 1);
    }, 60000); // Chaque minute

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0
      ? `${hours}h ${mins.toString().padStart(2, '0')}min`
      : `${mins} min`;
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddQuickNote(noteText.trim());
      setNoteText('');
      setShowNoteDialog(false);
    }
  };

  const handleExitAttempt = () => {
    setShowExitConfirm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {subject?.icon && <span className="text-2xl">{subject.icon}</span>}
                <h2 className="text-2xl font-bold text-gray-900">
                  {subject?.name}
                </h2>
              </div>
              <p className="text-gray-600">{chapter?.title}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Durée</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatDuration(duration)}
              </p>
            </div>
          </div>
        </div>

        {/* Objectifs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">🎯 Objectifs</h3>
          <div className="space-y-2">
            {session.objectives.map((obj) => (
              <div
                key={obj.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    obj.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300'
                  }`}
                />
                <span className="text-sm text-gray-700">{obj.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Micro-défi */}
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">🏆 Défi</h3>
          <p className="text-gray-800">{session.challenge.description}</p>
        </div>

        {/* Attention & Distractions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              ⚡ Niveau d'attention
            </h3>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => onUpdateAttention(level)}
                  className={`w-12 h-12 rounded-full transition-all ${
                    session.attentionLevel >= level
                      ? 'bg-blue-500 text-white scale-110'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-center text-gray-500">
              Ajustez discrètement votre niveau
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              💭 Distractions
            </h3>
            <div className="text-center mb-4">
              <p className="text-5xl font-bold text-red-500">
                {session.distractionCount}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddDistraction}
              className="w-full"
            >
              J'ai décroché
            </Button>
          </div>
        </div>

        {/* Notes rapides */}
        {session.quickNotes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">📝 Notes rapides</h3>
            <ul className="space-y-2">
              {session.quickNotes.map((note, index) => (
                <li key={index} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-blue-500">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowNoteDialog(true)}
            className="flex-1"
          >
            📝 Note rapide
          </Button>
          <Button variant="primary" size="lg" onClick={onEnd} className="flex-1">
            Terminer le cours
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleExitAttempt}
          className="w-full mt-3"
        >
          Annuler
        </Button>
      </div>

      {/* Dialog Note */}
      <Dialog
        isOpen={showNoteDialog}
        onClose={() => setShowNoteDialog(false)}
        title="Note rapide"
      >
        <Textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Notez rapidement une idée importante..."
          rows={3}
          autoFocus
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowNoteDialog(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleAddNote}>
            Ajouter
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog Confirmation Sortie */}
      <Dialog
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        title="Quitter le cours ?"
      >
        <p className="text-gray-600 mb-4">
          Êtes-vous sûr de vouloir annuler ce cours ? Votre progression ne sera pas
          sauvegardée.
        </p>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowExitConfirm(false)}>
            Continuer le cours
          </Button>
          <Button variant="danger" onClick={onCancel}>
            Oui, annuler
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
