import React from 'react';
import { cn } from '@/lib/utils/validation';

interface ProgressProps {
  value: number; // 0-100
  max?: number;
  className?: string;
  color?: 'blue' | 'purple' | 'green' | 'yellow';
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  color = 'blue',
  showLabel = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-600 mt-1 text-right">
          {value} / {max}
        </p>
      )}
    </div>
  );
};

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};
