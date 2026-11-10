import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Inbox, Navigation } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { RIDE_TYPES } from '../../config/pricing.config';
import { useBookings } from '../../hooks/useBookings';
import { useRiderProfile } from '../../hooks/useRiderProfile';
import { useToast } from '../../hooks/useToast';
import { getUserById } from '../../services/authService';
import { getLocationName } from '../../services/mockLocations';
import { getProfileCompletion } from '../../services/riderService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime, formatDuration } from '../../utils/formatDate';

const linkBtn = 'inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700';

const RideRequests: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { pendingRequests, activeRide, acceptBooking, declineBooking } = useBookings();
  const { profile } = useRiderProfile();
  const [busyId, setBusyId] = useState<string | null>(null);

  const online = profile?.availabilityStatus === 'online';
  const ready = profile ? getProfileCompletion(profile).percent === 100 : false;

  const accept = (id: string) => {
    if (busyId) return;
    setBusyId(id);
    const result = acceptBooking(id);
    setBusyId(null);
    if (!result.ok) {
      toast.error(result.error); // for example: another rider took it first
      return;
    }
    toast.success('Ride accepted. Head to the pickup point.');
    navigate(`/rider/active-ride/${result.data.id}`);
  };

  const decline = (id: string) => {
    const result = declineBooking(id);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.info('Request hidden. Other riders can still accept it.');
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Ride requests</h1>
        <p className="mt-1 text-ink-500">New requests appear here by themselves. The first rider to accept gets the ride.</p>
      </header>

      {activeRide && (
        <Card className="flex flex-wrap items-center justify-between gap-3 border-brand-200 bg-brand-50">
          <p className="flex items-center gap-2 font-semibold text-brand-800"><Navigation className="h-5 w-5" aria-hidden="true" /> You have a ride in progress. Finish it before accepting another.</p>
          <Link to={`/rider/active-ride/${activeRide.id}`} className={linkBtn}>Open ride</Link>
        </Card>
      )}

      {!profile || !ready || !online ? (
        <EmptyState
          icon={<Inbox className="h-6 w-6" aria-hidden="true" />}
          title={ready ? 'You are offline' : 'Complete your vehicle details first'}
          description={ready ? 'Go online from your dashboard to see ride requests.' : 'Riders need a complete vehicle profile before they can go online.'}
          action={<Link to={ready ? '/rider/dashboard' : '/rider/profile'} className={linkBtn}>{ready ? 'Go to dashboard' : 'Complete profile'}</Link>}
        />
      ) : pendingRequests.length === 0 ? (
        <EmptyState icon={<Inbox className="h-6 w-6" aria-hidden="true" />} title="No requests right now" description="Stay on this page. New ride requests show up as soon as customers book." />
      ) : (
        <ul className="space-y-4" aria-label="Pending ride requests">
          {pendingRequests.map((b) => {
            const customer = getUserById(b.customerId);
            return (
              <li key={b.id}>
                <Card className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-lg font-bold">
                        {getLocationName(b.pickupLocation)} <ArrowRight className="mx-1 inline h-4 w-4 text-ink-300" aria-label="to" /> {getLocationName(b.destination)}
                      </p>
                      <p className="mt-1 text-sm text-ink-500">
                        {customer ? customer.fullName.split(' ')[0] : 'Customer'} · {formatDateTime(b.createdAt)} · {b.reference}
                      </p>
                    </div>
                    <p className="font-display text-2xl font-bold">{formatCurrency(b.totalFare)}</p>
                  </div>
                  <dl className="grid grid-cols-3 gap-3 rounded-xl bg-ink-50 p-3 text-sm">
                    <div><dt className="text-xs text-ink-500">Distance</dt><dd className="font-semibold">{b.distanceKm} km</dd></div>
                    <div><dt className="text-xs text-ink-500">Time</dt><dd className="font-semibold">{formatDuration(b.estimatedDurationMinutes)}</dd></div>
                    <div><dt className="text-xs text-ink-500">Ride type</dt><dd className="font-semibold">{RIDE_TYPES[b.rideType].label}</dd></div>
                  </dl>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => accept(b.id)} loading={busyId === b.id} disabled={Boolean(activeRide)}>Accept ride</Button>
                    <Button variant="ghost" onClick={() => decline(b.id)} disabled={busyId === b.id}>Decline</Button>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RideRequests;