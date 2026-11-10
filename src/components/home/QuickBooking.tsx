import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { PlaceSearch } from '../common/PlaceSearch';
import { Card } from '../common/Card';
import { RIDE_TYPE_LIST } from '../../config/pricing.config';
import { RideType } from '../../types/booking';
import { getDistanceKm } from '../../services/mockLocations';
import { calculateFare, estimateDurationMinutes } from '../../services/pricing';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDuration } from '../../utils/formatDate';
import { cx } from '../../utils/cx';

/** Quick fare check on the landing page. Booking itself happens on /customer/book. */
export const QuickBooking: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [rideType, setRideType] = useState<RideType>('standard');
  const [error, setError] = useState('');

  const estimate = useMemo(() => {
    if (!pickup || !destination) return null;
    const km = getDistanceKm(pickup, destination);
    return km === null ? null : { km, fare: calculateFare(rideType, km), minutes: estimateDurationMinutes(km) };
  }, [pickup, destination, rideType]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && user.role === 'rider') {
      setError('You are signed in as a rider. Use a customer account to book rides.');
      return;
    }
    if (!pickup || !destination) {
      setError('Choose a pickup and a destination first.');
      return;
    }
    setError('');
    const query = new URLSearchParams({ pickup, destination, type: rideType }).toString();
    navigate(`/customer/book?${query}`);
  };

  return (
    <Card className="shadow-pop">
      <form onSubmit={onSubmit} noValidate className="space-y-4" aria-label="Quick fare estimate">
        <h2 className="text-lg font-bold">Check your fare</h2>
        <PlaceSearch
          label="Pickup"
          placeholder="Search a town, area or state"
          value={pickup}
          excludeId={destination}
          onChange={(id) => { setPickup(id); setError(''); if (id === destination) setDestination(''); }}
        />
        <PlaceSearch
          label="Destination"
          placeholder="Where are you going?"
          value={destination}
          excludeId={pickup}
          onChange={(id) => { setDestination(id); setError(''); }}
        />

        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold text-ink-700">Ride type</legend>
          <div className="grid grid-cols-3 gap-2">
            {RIDE_TYPE_LIST.map((r) => (
              <label key={r.id} className="relative cursor-pointer">
                <input type="radio" name="quick-ride-type" value={r.id} checked={rideType === r.id} onChange={() => setRideType(r.id)} className="peer sr-only" />
                <span className={cx('block rounded-xl border border-ink-200 bg-white py-2 text-center text-sm font-semibold transition-colors hover:border-ink-300', 'peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-checked:text-brand-800 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500')}>
                  {r.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="rounded-xl bg-ink-50 p-4" aria-live="polite">
          {estimate ? (
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-ink-500">Estimated fare</p>
                <p className="font-display text-2xl font-bold">{formatCurrency(estimate.fare.total)}</p>
              </div>
              <p className="text-sm text-ink-500">about {estimate.km} km, {formatDuration(estimate.minutes)}</p>
            </div>
          ) : (
            <p className="text-sm text-ink-500">Pick two places in Nigeria to see an estimate.</p>
          )}
        </div>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <Button type="submit" size="lg" fullWidth>Book this ride <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
      </form>
    </Card>
  );
};