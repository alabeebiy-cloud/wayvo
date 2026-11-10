import React from 'react';
import { BookingStatus } from '../../types/booking';
import { cx } from '../../utils/cx';

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Waiting for rider',
  accepted: 'Rider assigned',
  arrived: 'Rider arrived',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_CLASSES: Record<BookingStatus, string> = {
  pending: 'bg-amber-50 text-amber-800',
  accepted: 'bg-brand-50 text-brand-700',
  arrived: 'bg-brand-100 text-brand-800',
  in_progress: 'bg-ink-900 text-white',
  completed: 'bg-brand-600 text-white',
  cancelled: 'bg-red-50 text-red-700',
};

export const StatusBadge: React.FC<{ status: BookingStatus; className?: string }> = ({ status, className }) => (
  <span className={cx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', STATUS_CLASSES[status], className)}>
    {STATUS_LABELS[status]}
  </span>
);