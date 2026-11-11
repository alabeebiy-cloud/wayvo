import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CarFront, Clock, Hourglass, MapPin, Phone } from 'lucide-react';
import { TripProgress } from '../../components/booking/TripProgress';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { RouteMap } from '../../components/common/RouteMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RIDE_TYPES } from '../../config/pricing.config';
import { useBookings } from '../../hooks/useBookings';
import { useToast } from '../../hooks/useToast';
import { getUserById } from '../../services/authService';
import { getLocationName } from '../../services/mockLocations';
import { getRiderProfile } from '../../services/riderService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime, formatDuration } from '../../utils/formatDate';

const BookingDetails: React.FC = () => {
  const { bookingId } = useParams();
  const toast = useToast();
  const { myBookings, cancelBooking } = useBookings();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  // myBookings only holds this customer's bookings, so nobody can open another person's booking.
  const booking = myBookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <EmptyState
        icon={<MapPin className="h-6 w-6" aria-hidden="true" />}
        title="Booking not found"
        description="This booking does not exist, or it belongs to another account."
        action={<Link to="/customer/history" className="inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">View my rides</Link>}
      />
    );
  }

  const rider = booking.riderId ? getUserById(booking.riderId) : null;
  const vehicle = booking.riderId ? getRiderProfile(booking.riderId) : null;
  const distanceFare = booking.totalFare - booking.baseFare;

  const cancel = () => {
    if (busy) return;
    setBusy(true);
    const result = cancelBooking(booking.id);
    setBusy(false);
    setConfirming(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('Booking cancelled.');
  };

  return (
    <div className="space-y-6">
      <Link to="/customer/history" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-500 hover:text-ink-900"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> My rides</Link>

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Booking details</h1>
          <p className="mt-1 text-ink-500">{booking.reference} · {formatDateTime(booking.createdAt)}</p>
        </div>
        <StatusBadge status={booking.status} />
      </header>

      {booking.status === 'pending' && (
        <Card className="space-y-4 border-amber-200 bg-amber-50">
          <p className="flex items-center gap-2 font-semibold text-amber-900"><Hourglass className="h-5 w-5" aria-hidden="true" /> Waiting for a rider to accept</p>
          <p className="text-sm text-amber-800">This page updates by itself. You can cancel until a rider accepts.</p>
          {confirming ? (
            <div className="flex flex-wrap gap-3">
              <Button variant="danger" onClick={cancel} loading={busy}>Yes, cancel this booking</Button>
              <Button variant="ghost" onClick={() => setConfirming(false)}>Keep it</Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setConfirming(true)}>Cancel booking</Button>
          )}
        </Card>
      )}

      <RouteMap pickup={booking.pickupLocation} destination={booking.destination} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="space-y-3">
            <h2 className="text-lg font-bold">Trip</h2>
            <dl className="space-y-2 text-sm">
              <div><dt className="text-ink-500">Pickup</dt><dd className="font-semibold">{getLocationName(booking.pickupLocation)}</dd></div>
              <div><dt className="text-ink-500">Destination</dt><dd className="font-semibold">{getLocationName(booking.destination)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Ride type</dt><dd className="font-semibold">{RIDE_TYPES[booking.rideType].label}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Distance</dt><dd className="font-semibold">{booking.distanceKm} km</dd></div>
              <div className="flex justify-between"><dt className="flex items-center gap-1 text-ink-500"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> Estimated time</dt><dd className="font-semibold">{formatDuration(booking.estimatedDurationMinutes)}</dd></div>
            </dl>
          </Card>

          <Card className="space-y-3">
            <h2 className="text-lg font-bold">Fare</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink-500">Base fare</dt><dd className="font-semibold">{formatCurrency(booking.baseFare)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Distance ({booking.distanceKm} km x {formatCurrency(booking.pricePerKm)})</dt><dd className="font-semibold">{formatCurrency(distanceFare)}</dd></div>
              <div className="flex items-end justify-between border-t border-ink-100 pt-3"><dt className="text-ink-500">Total</dt><dd className="font-display text-2xl font-bold">{formatCurrency(booking.totalFare)}</dd></div>
            </dl>
            <p className="text-xs text-ink-500">Simulated fare. No payment is taken.</p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-3">
            <h2 className="text-lg font-bold">Your rider</h2>
            {booking.riderId && rider ? (
              <>
                <p className="font-semibold">{rider.fullName}</p>
                <a href={`tel:${rider.phone}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">
                  <Phone className="h-4 w-4" aria-hidden="true" /> {rider.phone}
                </a>
                {vehicle && (
                  <p className="flex items-center gap-2 text-sm text-ink-700">
                    <CarFront className="h-4 w-4 text-ink-500" aria-hidden="true" />
                    {vehicle.vehicleMake} {vehicle.vehicleModel} · {vehicle.vehicleRegistration}
                  </p>
                )}
                <p className="text-xs text-ink-500">Wayvo is a demo. Rider details are not verified.</p>
              </>
            ) : (
              <p className="text-sm text-ink-500">{booking.status === 'cancelled' ? 'No rider was assigned.' : 'A rider will appear here once your booking is accepted.'}</p>
            )}
          </Card>

          <Card className="space-y-3">
            <h2 className="text-lg font-bold">Progress</h2>
            <TripProgress booking={booking} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;