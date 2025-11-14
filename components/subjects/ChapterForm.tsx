'use client';

import React, { useState } from 'react';
import { Dialog, DialogFooter } from '@/components/ui/dialog';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Priority, Mastery } from '@/types/subject';

interface ChapterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    priority: Priority;
    mastery: Mastery;
    examDate?: Date;
  }) => void;
  initialData?: {
    title: string;
    description?: string;
    priority: Priority;
    mastery: Mastery;
    examDate?: Date;
  };
}

export const ChapterForm: React.FC<ChapterFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'medium');
  const [mastery, setMastery] = useState<Mastery>(initialData?.mastery || 0);
  const [examDate, setExamDate] = useState(
    initialData?.examDate
      ? new Date(initialData.examDate).toISOString().split('T')[0]
      : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title,
        description: description || undefined,
        priority,
        mastery,
        examDate: examDate ? new Date(examDate) : undefined,
      });
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setMastery(0);
    setExamDate('');
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Modifier le chapitre' : 'Nouveau chapitre'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Titre du chapitre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Les dérivées"
            required
          />

          <Textarea
            label="Description (optionnel)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Notes sur ce chapitre..."
            rows={3}
          />

          <Select
            label="Priorité"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            options={[
              { value: 'low', label: 'Basse' },
              { value: 'medium', label: 'Moyenne' },
              { value: 'high', label: 'Haute' },
            ]}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau de maîtrise
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setMastery(level as Mastery)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    mastery === level
                      ? 'bg-blue-500 text-white scale-110'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Date d'examen (optionnel)"
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Modifier' : 'Créer'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
