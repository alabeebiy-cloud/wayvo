import React from 'react';
import { Navigation } from 'lucide-react';
import { cx } from '../../utils/cx';

export const Logo: React.FC<{ tone?: 'dark' | 'light'; className?: string }> = ({ tone = 'dark', className }) => (
  <span className={cx('inline-flex items-center gap-2', className)}>
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
      <Navigation className="h-4 w-4" aria-hidden="true" />
    </span>
    <span className={cx('font-display text-xl font-bold tracking-tight', tone === 'light' ? 'text-white' : 'text-ink-900')}>Wayvo</span>
  </span>
);
