import React, { useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, MapPin, Route, Users } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Select } from '../../components/common/Select';
import { isRideType, RIDE_TYPE_LIST, RIDE_TYPES } from '../../config/pricing.config';
import { useBookings } from '../../hooks/useBookings';
import { useToast } from '../../hooks/useToast';
import { getDistanceKm, getLocation, LOCATIONS } from '../../services/mockLocations';
import { calculateFare, estimateDurationMinutes } from '../../services/pricing';
import { RideType } from '../../types/booking';
import { cx } from '../../utils/cx';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDuration } from '../../utils/formatDate';

const toOption = (l: { id: string; name: string }) => ({ value: l.id, label: l.name });

/** Values from the landing page widget are untrusted URL text, so each one is validated before use. */
function readInitial(params: URLSearchParams) {
  const pickup = params.get('pickup') ?? '';
  const destination = params.get('destination') ?? '';
  const type = params.get('type');
  const validPickup = getLocation(pickup) ? pickup : '';
  const validDestination = getLocation(destination) && destination !== validPickup ? destination : '';
  return { pickup: validPickup, destination: validDestination, rideType: isRideType(type) ? type : ('standard' as RideType) };
}

const BookRide: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { createBooking } = useBookings();
  const [searchParams] = useSearchParams();

  const initial = useRef(readInitial(searchParams)).current;
  const [pickup, setPickup] = useState(initial.pickup);
  const [destination, setDestination] = useState(initial.destination);
  const [rideType, setRideType] = useState<RideType>(initial.rideType);
  const [errors, setErrors] = useState<{ pickup?: string; destination?: string; form?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const distanceKm = pickup && destination ? getDistanceKm(pickup, destination) : null;
  const routeUnavailable = Boolean(pickup && destination && distanceKm === null);

  const fares = useMemo(() => {
    if (distanceKm === null) return null;
    return RIDE_TYPE_LIST.map((r) => ({ type: r.id, fare: calculateFare(r.id, distanceKm).total }));
  }, [distanceKm]);

  const breakdown = distanceKm === null ? null : calculateFare(rideType, distanceKm);
  const minutes = distanceKm === null ? null : estimateDurationMinutes(distanceKm);

  const onPickup = (value: string) => {
    setPickup(value);
    if (value === destination) setDestination('');
    setErrors({});
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const next: typeof errors = {};
    if (!pickup) next.pickup = 'Choose a pickup location.';
    if (!destination) next.destination = 'Choose a destination.';
    if (pickup && destination && distanceKm === null) next.form = 'We do not cover this route yet. Try a different pickup or destination.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const result = createBooking({ pickupLocation: pickup, destination, rideType });
    if (!result.ok) {
      setErrors({ form: result.error });
      setSubmitting(false);
      return;
    }
    toast.success(`Ride requested. Reference ${result.data.reference}.`);
    navigate(`/customer/bookings/${result.data.id}`);
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Book a ride</h1>
        <p className="mt-1 text-ink-500">Choose your route and ride type. You can cancel until a rider accepts.</p>
      </header>

      <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-[1.3fr_1fr]" aria-label="Book a ride">
        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold"><MapPin className="h-5 w-5 text-brand-600" aria-hidden="true" /> Route</h2>
            <Select label="Pickup" placeholder="Choose pickup" value={pickup} onChange={(e) => onPickup(e.target.value)} options={LOCATIONS.map(toOption)} error={errors.pickup} />
            <Select
              label="Destination" placeholder="Choose destination" value={destination}
              onChange={(e) => { setDestination(e.target.value); setErrors({}); }}
              options={LOCATIONS.filter((l) => l.id !== pickup).map(toOption)} error={errors.destination}
            />
            {routeUnavailable && <p role="alert" className="text-sm text-red-600">We do not cover this route yet. Try a different pickup or destination.</p>}
          </Card>

          <Card>
            <fieldset>
              <legend className="mb-4 flex items-center gap-2 text-lg font-bold"><Route className="h-5 w-5 text-brand-600" aria-hidden="true" /> Ride type</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {RIDE_TYPE_LIST.map((r) => {
                  const fare = fares?.find((f) => f.type === r.id)?.fare;
                  return (
                    <label key={r.id} className="relative cursor-pointer">
                      <input type="radio" name="ride-type" value={r.id} checked={rideType === r.id} onChange={() => { setRideType(r.id); setErrors({}); }} className="peer sr-only" />
                      <span className={cx(
                        'flex h-full flex-col rounded-xl border border-ink-200 bg-white p-4 transition-colors hover:border-ink-300',
                        'peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500',
                      )}>
                        <span className="font-bold">{r.label}</span>
                        <span className="mt-1 flex items-center gap-1 text-xs text-ink-500"><Users className="h-3.5 w-3.5" aria-hidden="true" /> Up to {r.capacity}</span>
                        <span className="mt-3 font-display text-lg font-bold">{fare === undefined ? 'Pick a route' : formatCurrency(fare)}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-ink-500">{RIDE_TYPES[rideType].description}</p>
            </fieldset>
          </Card>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <Card className="space-y-4" aria-live="polite">
            <h2 className="text-lg font-bold">Trip summary</h2>
            {breakdown && minutes !== null && distanceKm !== null ? (
              <>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-ink-500">Distance</dt><dd className="font-semibold">{distanceKm} km</dd></div>
                  <div className="flex justify-between"><dt className="flex items-center gap-1 text-ink-500"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> Estimated time</dt><dd className="font-semibold">{formatDuration(minutes)}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-500">Base fare</dt><dd className="font-semibold">{formatCurrency(breakdown.baseFare)}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-500">Distance ({distanceKm} km x {formatCurrency(breakdown.pricePerKm)})</dt><dd className="font-semibold">{formatCurrency(breakdown.distanceFare)}</dd></div>
                </dl>
                <div className="flex items-end justify-between border-t border-ink-100 pt-4">
                  <span className="text-sm text-ink-500">Estimated total</span>
                  <span className="font-display text-3xl font-bold">{formatCurrency(breakdown.total)}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-ink-500">Choose a pickup and a destination to see your fare.</p>
            )}

            {errors.form && <p role="alert" className="text-sm text-red-600">{errors.form}</p>}
            <Button type="submit" size="lg" fullWidth loading={submitting} disabled={routeUnavailable}>Confirm booking</Button>
            <p className="text-xs text-ink-500">Simulated fare. No payment is taken.</p>
          </Card>
        </aside>
      </form>
    </div>
  );
};

export default BookRide;