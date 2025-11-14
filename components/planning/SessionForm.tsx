'use client';

import React, { useState } from 'react';
import { Dialog, DialogFooter } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Subject } from '@/types/subject';

interface SessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subjectId: string, chapterId: string, duration: number) => void;
  subjects: Subject[];
  preSelectedDate?: Date;
}

export const SessionForm: React.FC<SessionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  subjects,
  preSelectedDate,
}) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [duration, setDuration] = useState(30);

  const subject = subjects.find((s) => s.id === selectedSubject);
  const chapters = subject?.chapters || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubject && selectedChapter) {
      onSubmit(selectedSubject, selectedChapter, duration);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setSelectedSubject('');
    setSelectedChapter('');
    setDuration(30);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Nouvelle session">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {preSelectedDate && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                📅 {new Date(preSelectedDate).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>
          )}

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
            required
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
              required
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée : {duration} minutes
            </label>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>15 min</span>
              <span>120 min</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            Créer
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
