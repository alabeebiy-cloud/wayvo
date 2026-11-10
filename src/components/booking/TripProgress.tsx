import React from 'react';
import { Check, Circle, X } from 'lucide-react';
import { Booking } from '../../types/booking';
import { cx } from '../../utils/cx';
import { formatDateTime } from '../../utils/formatDate';

interface Step { label: string; at?: string; bad?: boolean }

/** The steps of a trip, with the time each one happened. The next step is highlighted. */
export const TripProgress: React.FC<{ booking: Booking }> = ({ booking }) => {
  const cancelled = booking.status === 'cancelled';
  const steps: Step[] = [
    { label: 'Requested', at: booking.createdAt },
    ...(cancelled
      ? [{ label: 'Cancelled', at: booking.cancelledAt, bad: true }]
      : [
        { label: 'Rider accepted', at: booking.acceptedAt },
        { label: 'Rider arrived', at: booking.arrivedAt },
        { label: 'Trip started', at: booking.startedAt },
        { label: 'Trip completed', at: booking.completedAt },
      ]),
  ];
  const nextIndex = steps.findIndex((s) => !s.at);

  return (
    <ol className="space-y-4" aria-label="Trip progress">
      {steps.map((s, i) => {
        const done = Boolean(s.at);
        const isNext = i === nextIndex;
        return (
          <li key={s.label} className="flex items-start gap-3" aria-current={isNext ? 'step' : undefined}>
            <span className={cx(
              'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
              s.bad ? 'bg-red-100 text-red-700' : done ? 'bg-brand-600 text-white' : isNext ? 'border-2 border-brand-600 text-brand-600' : 'border border-ink-200 text-ink-300',
            )}>
              {s.bad ? <X className="h-3.5 w-3.5" aria-hidden="true" /> : done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Circle className="h-2.5 w-2.5" aria-hidden="true" />}
            </span>
            <div>
              <p className={cx('text-sm font-semibold', !done && !isNext && 'text-ink-300')}>{s.label}</p>
              <p className="text-xs text-ink-500">{s.at ? formatDateTime(s.at) : isNext ? 'Waiting' : ''}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
};