'use client';

import React, { useState } from 'react';
import { Dialog, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SubjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, color: string, icon?: string) => void;
  initialData?: {
    name: string;
    color: string;
    icon?: string;
  };
}

const PRESET_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#6366F1',
];

const PRESET_ICONS = ['📚', '🔬', '🎨', '💻', '🌍', '📐', '🏃', '🎵', '📖', '✏️'];

export const SubjectForm: React.FC<SubjectFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [color, setColor] = useState(initialData?.color || PRESET_COLORS[0]);
  const [icon, setIcon] = useState(initialData?.icon || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name, color, icon);
      setName('');
      setColor(PRESET_COLORS[0]);
      setIcon('');
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={initialData ? 'Modifier la matière' : 'Nouvelle matière'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Nom de la matière"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Mathématiques"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur
            </label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-12 h-12 rounded-lg transition-transform ${
                    color === c ? 'ring-4 ring-offset-2 ring-gray-400 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icône (optionnel)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-12 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 text-2xl transition-all ${
                    icon === i ? 'ring-4 ring-offset-2 ring-gray-400 scale-110' : ''
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
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
