import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { RIDE_TYPES } from '../../config/pricing.config';
import { getLocationName } from '../../services/mockLocations';
import { Booking } from '../../types/booking';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';

/** One booking as a tappable row. Used by the dashboard now and by history in Part B. */
export const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
  const from = getLocationName(booking.pickupLocation);
  const to = getLocationName(booking.destination);
  return (
    <Link
      to={`/customer/bookings/${booking.id}`}
      className="group flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-card transition-colors hover:border-ink-200"
    >
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 font-semibold">
          <span className="truncate">{from}</span>
          <ArrowRight className="h-4 w-4 shrink-0 text-ink-300" aria-label="to" />
          <span className="truncate">{to}</span>
        </p>
        <p className="mt-1 text-xs text-ink-500">
          {booking.reference} · {RIDE_TYPES[booking.rideType].label} · {formatDateTime(booking.createdAt)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="font-display font-bold">{formatCurrency(booking.totalFare)}</span>
        <StatusBadge status={booking.status} />
      </div>
      <ChevronRight className="hidden h-5 w-5 shrink-0 text-ink-300 group-hover:text-ink-500 sm:block" aria-hidden="true" />
    </Link>
  );
};