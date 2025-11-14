'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Stat {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

interface StatsOverviewProps {
  stats: Stat[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="py-6">
            <div className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <p className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
