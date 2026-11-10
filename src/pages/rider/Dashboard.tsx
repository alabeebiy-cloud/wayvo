import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, BadgeCheck, CheckCircle2, Inbox, Navigation, Wallet } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RIDE_TYPES } from '../../config/pricing.config';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import { useRiderProfile } from '../../hooks/useRiderProfile';
import { useToast } from '../../hooks/useToast';
import { getUserById } from '../../services/authService';
import { getLocationName } from '../../services/mockLocations';
import { getProfileCompletion } from '../../services/riderService';
import { Booking } from '../../types/booking';
import { cx } from '../../utils/cx';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime, toDateKey } from '../../utils/formatDate';

const linkBtn = 'inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700';

const TripLine: React.FC<{ booking: Booking }> = ({ booking }) => (
  <p className="font-semibold">
    {getLocationName(booking.pickupLocation)} <ArrowRight className="mx-1 inline h-4 w-4 text-ink-300" aria-label="to" /> {getLocationName(booking.destination)}
  </p>
);

const RiderDashboard: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { myBookings, pendingRequests, activeRide } = useBookings();
  const { profile, setAvailability } = useRiderProfile();

  const online = profile?.availabilityStatus === 'online';
  const completion = profile ? getProfileCompletion(profile) : { percent: 0, missing: [] as string[] };
  const ready = completion.percent === 100;

  // Earnings are simulated: the sum of completed fares. Nothing here is real money.
  const stats = useMemo(() => {
    const completed = myBookings.filter((b) => b.status === 'completed');
    const today = toDateKey(new Date());
    const todayTotal = completed
      .filter((b) => b.completedAt && toDateKey(b.completedAt) === today)
      .reduce((sum, b) => sum + b.totalFare, 0);
    return {
      completedCount: completed.length,
      total: completed.reduce((sum, b) => sum + b.totalFare, 0),
      today: todayTotal,
      recent: completed.slice(0, 3),
    };
  }, [myBookings]);

  const toggleAvailability = () => {
    const result = setAvailability(online ? 'offline' : 'online');
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(online ? 'You are offline. No new requests will show.' : 'You are online. New requests will appear here.');
  };

  const firstName = user?.fullName.split(' ')[0] ?? '';
  const preview = pendingRequests.slice(0, 3);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Hello, {firstName}</h1>
        <p className="mt-1 text-ink-500">Go online to see ride requests. Earnings here are simulated.</p>
      </header>

      {!profile ? (
        <Card role="alert" className="border-red-200 bg-red-50">
          <p className="font-semibold text-red-800">We could not find your rider profile.</p>
          <p className="mt-1 text-sm text-red-700">Open Profile and vehicle to set it up.</p>
        </Card>
      ) : (
        <Card className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className={cx('flex h-12 w-12 items-center justify-center rounded-2xl', online ? 'bg-brand-50 text-brand-700' : 'bg-ink-100 text-ink-500')}>
              <Navigation className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-bold">{online ? 'You are online' : 'You are offline'}</p>
              <p className="text-sm text-ink-500">
                {online ? 'Customers can request rides from you.' : ready ? 'Switch on to start receiving requests.' : 'Add your vehicle details to go online.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={online}
            aria-label="Online status"
            onClick={toggleAvailability}
            className={cx('relative h-8 w-14 shrink-0 rounded-full transition-colors', online ? 'bg-brand-600' : 'bg-ink-300')}
          >
            <span className={cx('absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all', online ? 'left-7' : 'left-1')} />
          </button>
        </Card>
      )}

      {profile && !ready && (
        <Card className="border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900">Finish your vehicle details ({completion.percent}% done)</p>
              <p className="mt-1 text-sm text-amber-800">Still needed: {completion.missing.join(', ')}.</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-amber-100" role="progressbar" aria-valuenow={completion.percent} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completion">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${completion.percent}%` }} />
              </div>
              <Link to="/rider/profile" className={`${linkBtn} mt-4`}>Complete profile</Link>
            </div>
          </div>
        </Card>
      )}

      {profile && ready && (
        <p className="flex items-center gap-2 text-sm text-ink-500">
          {profile.verificationStatus === 'demo_verified'
            ? <><BadgeCheck className="h-4 w-4 text-brand-600" aria-hidden="true" /> Demo verified. This is a simulated badge, not a real check.</>
            : <><AlertCircle className="h-4 w-4 text-ink-500" aria-hidden="true" /> Not verified. You can add the demo badge on your profile.</>}
        </p>
      )}

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Wallet className="h-5 w-5" aria-hidden="true" />} label="Earned today" value={formatCurrency(stats.today)} hint="Simulated" />
        <StatCard icon={<Wallet className="h-5 w-5" aria-hidden="true" />} label="Total earned" value={formatCurrency(stats.total)} hint="Simulated" />
        <StatCard icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />} label="Trips completed" value={stats.completedCount} />
        <StatCard icon={<Inbox className="h-5 w-5" aria-hidden="true" />} label="Open requests" value={online && ready ? pendingRequests.length : 0} hint={online && ready ? undefined : 'Go online to see them'} />
      </section>

      {activeRide && (
        <section aria-labelledby="active-heading">
          <h2 id="active-heading" className="mb-3 text-xl font-bold">Your current ride</h2>
          <Card className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <TripLine booking={activeRide} />
              <p className="mt-1 text-sm text-ink-500">
                {getUserById(activeRide.customerId)?.fullName ?? 'Customer'} · {activeRide.reference} · {formatCurrency(activeRide.totalFare)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={activeRide.status} />
              <Link to={`/rider/active-ride/${activeRide.id}`} className={linkBtn}>Open ride</Link>
            </div>
          </Card>
        </section>
      )}

      <section aria-labelledby="requests-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="requests-heading" className="text-xl font-bold">New requests</h2>
          {online && ready && pendingRequests.length > preview.length && (
            <Link to="/rider/requests" className="text-sm font-semibold text-brand-700 hover:underline">View all {pendingRequests.length}</Link>
          )}
        </div>
        {!online || !ready ? (
          <EmptyState
            icon={<Inbox className="h-6 w-6" aria-hidden="true" />}
            title="You are not receiving requests"
            description={ready ? 'Switch to online above to see ride requests.' : 'Complete your vehicle details, then go online.'}
          />
        ) : preview.length === 0 ? (
          <EmptyState icon={<Inbox className="h-6 w-6" aria-hidden="true" />} title="No requests right now" description="New ride requests appear here as soon as customers book." />
        ) : (
          <div className="space-y-3">
            {preview.map((b) => (
              <Card key={b.id} className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <TripLine booking={b} />
                  <p className="mt-1 text-xs text-ink-500">{b.distanceKm} km · {RIDE_TYPES[b.rideType].label} · {formatDateTime(b.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-bold">{formatCurrency(b.totalFare)}</span>
                  <Link to="/rider/requests" className="inline-flex h-9 items-center rounded-xl border border-ink-200 px-3 text-sm font-semibold hover:bg-ink-50">View</Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="recent-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="recent-heading" className="text-xl font-bold">Recent trips</h2>
          {stats.completedCount > stats.recent.length && (
            <Link to="/rider/history" className="text-sm font-semibold text-brand-700 hover:underline">View all</Link>
          )}
        </div>
        {stats.recent.length === 0 ? (
          <EmptyState icon={<CheckCircle2 className="h-6 w-6" aria-hidden="true" />} title="No completed trips yet" description="Trips you finish will be listed here." />
        ) : (
          <div className="space-y-3">
            {stats.recent.map((b) => (
              <Card key={b.id} className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <TripLine booking={b} />
                  <p className="mt-1 text-xs text-ink-500">{b.reference} · {b.completedAt ? formatDateTime(b.completedAt) : ''}</p>
                </div>
                <span className="font-display text-lg font-bold">{formatCurrency(b.totalFare)}</span>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default RiderDashboard;