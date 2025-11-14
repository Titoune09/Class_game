'use client';

import React from 'react';
import { PomodoroPreset } from '@/types/pomodoro';
import { Card, CardContent } from '@/components/ui/card';

interface PresetSelectorProps {
  selectedPreset: PomodoroPreset;
  onSelect: (preset: PomodoroPreset) => void;
}

const presets: { value: PomodoroPreset; label: string; focus: number; break: number }[] = [
  { value: '25-5', label: 'Classique', focus: 25, break: 5 },
  { value: '40-10', label: 'Moyen', focus: 40, break: 10 },
  { value: '50-10', label: 'Long', focus: 50, break: 10 },
];

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  selectedPreset,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {presets.map((preset) => (
        <Card
          key={preset.value}
          onClick={() => onSelect(preset.value)}
          className={`cursor-pointer transition-all ${
            selectedPreset === preset.value
              ? 'ring-4 ring-blue-500 scale-105'
              : 'hover:scale-102'
          }`}
        >
          <CardContent className="text-center py-4">
            <h4 className="font-semibold text-gray-900 mb-1">{preset.label}</h4>
            <p className="text-2xl font-bold text-blue-600 mb-1">
              {preset.focus} min
            </p>
            <p className="text-xs text-gray-500">Pause: {preset.break} min</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
