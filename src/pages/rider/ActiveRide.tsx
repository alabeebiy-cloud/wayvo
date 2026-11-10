import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MapPin, Phone } from 'lucide-react';
import { TripProgress } from '../../components/booking/TripProgress';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { RouteMap } from '../../components/common/RouteMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useBookings } from '../../hooks/useBookings';
import { useToast } from '../../hooks/useToast';
import { getUserById } from '../../services/authService';
import { getLocationName } from '../../services/mockLocations';
import { BookingStatus } from '../../types/booking';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDuration } from '../../utils/formatDate';

type TripStep = 'arrived' | 'in_progress' | 'completed';

// What the rider can do next, depending on where the trip is.
const NEXT: Partial<Record<BookingStatus, { step: TripStep; label: string; done: string }>> = {
  accepted: { step: 'arrived', label: 'I have arrived at the pickup', done: 'Customer told you have arrived.' },
  arrived: { step: 'in_progress', label: 'Start trip', done: 'Trip started.' },
  in_progress: { step: 'completed', label: 'Complete trip', done: 'Trip completed.' },
};

const ActiveRide: React.FC = () => {
  const { bookingId } = useParams();
  const toast = useToast();
  const { myBookings, advanceBooking } = useBookings();
  const [busy, setBusy] = useState(false);
  const [confirmComplete, setConfirmComplete] = useState(false);

  const booking = myBookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <EmptyState
        icon={<MapPin className="h-6 w-6" aria-hidden="true" />}
        title="Ride not found"
        description="This ride does not exist, or it belongs to another rider."
        action={<Link to="/rider/dashboard" className="inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">Back to dashboard</Link>}
      />
    );
  }

  const customer = getUserById(booking.customerId);
  const next = NEXT[booking.status];

  const advance = () => {
    if (!next || busy) return;
    // Completing a trip cannot be undone, so it takes a second tap.
    if (next.step === 'completed' && !confirmComplete) {
      setConfirmComplete(true);
      return;
    }
    setBusy(true);
    const result = advanceBooking(booking.id, next.step);
    setBusy(false);
    setConfirmComplete(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(next.done);
  };

  return (
    <div className="space-y-6">
      <Link to="/rider/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-500 hover:text-ink-900"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Dashboard</Link>

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Active ride</h1>
          <p className="mt-1 text-ink-500">{booking.reference}</p>
        </div>
        <StatusBadge status={booking.status} />
      </header>

      {booking.status === 'completed' ? (
        <Card className="border-brand-200 bg-brand-50 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-brand-600" aria-hidden="true" />
          <h2 className="mt-3 text-xl font-bold">Trip completed</h2>
          <p className="mt-1 text-ink-700">You earned <strong>{formatCurrency(booking.totalFare)}</strong> (simulated).</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/rider/requests" className="inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">Find another ride</Link>
            <Link to="/rider/earnings" className="inline-flex h-11 items-center rounded-xl border border-ink-200 bg-white px-5 text-sm font-semibold hover:bg-ink-50">See earnings</Link>
          </div>
        </Card>
      ) : next ? (
        <Card className="space-y-3">
          <Button size="lg" fullWidth onClick={advance} loading={busy} variant={confirmComplete ? 'danger' : 'primary'}>
            {confirmComplete ? 'Tap again to confirm: complete trip' : next.label}
          </Button>
          {confirmComplete && <Button variant="ghost" fullWidth onClick={() => setConfirmComplete(false)}>Not yet</Button>}
        </Card>
      ) : null}

      <RouteMap pickup={booking.pickupLocation} destination={booking.destination} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-lg font-bold">Trip</h2>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-ink-500">Pickup</dt><dd className="font-semibold">{getLocationName(booking.pickupLocation)}</dd></div>
            <div><dt className="text-ink-500">Destination</dt><dd className="font-semibold">{getLocationName(booking.destination)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-500">Distance</dt><dd className="font-semibold">{booking.distanceKm} km</dd></div>
            <div className="flex justify-between"><dt className="text-ink-500">Estimated time</dt><dd className="font-semibold">{formatDuration(booking.estimatedDurationMinutes)}</dd></div>
            <div className="flex justify-between border-t border-ink-100 pt-2"><dt className="text-ink-500">Fare (simulated)</dt><dd className="font-display text-lg font-bold">{formatCurrency(booking.totalFare)}</dd></div>
          </dl>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-lg font-bold">Customer</h2>
          <p className="font-semibold">{customer ? customer.fullName : 'Customer'}</p>
          {customer && (
            <a href={`tel:${customer.phone}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">
              <Phone className="h-4 w-4" aria-hidden="true" /> {customer.phone}
            </a>
          )}
          <h2 className="pt-2 text-lg font-bold">Progress</h2>
          <TripProgress booking={booking} />
        </Card>
      </div>
    </div>
  );
};

export default ActiveRide;