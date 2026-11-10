import React from 'react';
import { Card } from './Card';

export const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; hint?: string }> = ({ icon, label, value, hint }) => (
  <Card className="flex items-start gap-4">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">{icon}</div>
    <div className="min-w-0">
      <p className="text-sm text-ink-500">{label}</p>
      <p className="font-display text-2xl font-bold leading-tight">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-500">{hint}</p>}
    </div>
  </Card>
);