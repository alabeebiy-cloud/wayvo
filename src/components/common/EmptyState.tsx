import React from 'react';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-12 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">{icon}</div>
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);