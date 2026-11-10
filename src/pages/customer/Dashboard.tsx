import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CarFront, CheckCircle2, ListChecks, Radio, XCircle } from 'lucide-react';
import { BookingCard } from '../../components/booking/BookingCard';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { StatCard } from '../../components/common/StatCard';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';

const primaryLink = 'inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { myBookings } = useBookings();

  const stats = useMemo(() => ({
    total: myBookings.length,
    active: myBookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled').length,
    completed: myBookings.filter((b) => b.status === 'completed').length,
    cancelled: myBookings.filter((b) => b.status === 'cancelled').length,
  }), [myBookings]);

  const activeBookings = useMemo(
    () => myBookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled'),
    [myBookings],
  );
  const recent = myBookings.slice(0, 4);
  const firstName = user?.fullName.split(' ')[0] ?? '';

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Hello, {firstName}</h1>
          <p className="mt-1 text-ink-500">Here is what is happening with your rides.</p>
        </div>
        <Link to="/customer/book" className={primaryLink}>
          <CarFront className="h-4 w-4" aria-hidden="true" /> Book a ride
        </Link>
      </header>

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<ListChecks className="h-5 w-5" aria-hidden="true" />} label="Total bookings" value={stats.total} />
        <StatCard icon={<Radio className="h-5 w-5" aria-hidden="true" />} label="Active" value={stats.active} />
        <StatCard icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />} label="Completed" value={stats.completed} />
        <StatCard icon={<XCircle className="h-5 w-5" aria-hidden="true" />} label="Cancelled" value={stats.cancelled} />
      </section>

      {activeBookings.length > 0 && (
        <section aria-labelledby="active-heading">
          <h2 id="active-heading" className="mb-3 text-xl font-bold">Active rides</h2>
          <div className="space-y-3">
            {activeBookings.map((b) => <BookingCard key={b.id} booking={b} />)}
          </div>
        </section>
      )}

      <section aria-labelledby="recent-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="recent-heading" className="text-xl font-bold">Recent bookings</h2>
          {myBookings.length > recent.length && (
            <Link to="/customer/history" className="text-sm font-semibold text-brand-700 hover:underline">View all</Link>
          )}
        </div>
        {recent.length === 0 ? (
          <EmptyState
            icon={<CarFront className="h-6 w-6" aria-hidden="true" />}
            title="No bookings yet"
            description="Book your first ride and it will show up here."
            action={<Link to="/customer/book" className={primaryLink}>Book a ride</Link>}
          />
        ) : (
          <div className="space-y-3">{recent.map((b) => <BookingCard key={b.id} booking={b} />)}</div>
        )}
      </section>

      <Card className="bg-ink-900 text-white">
        <p className="text-sm text-ink-300">
          Wayvo is a demonstration app. Fares are simulated estimates, riders are not verified and there is no live tracking.
        </p>
      </Card>
    </div>
  );
};

export default Dashboard;