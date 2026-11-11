import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CarFront, Search } from 'lucide-react';
import { BookingCard } from '../../components/booking/BookingCard';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { useBookings } from '../../hooks/useBookings';
import { getLocationName } from '../../services/mockLocations';
import { cx } from '../../utils/cx';

type Filter = 'all' | 'active' | 'completed' | 'cancelled';
const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];
const PAGE_SIZE = 10;

const CustomerHistory: React.FC = () => {
  const { myBookings } = useBookings();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const matchesFilter = (status: string, f: Filter): boolean => {
    if (f === 'all') return true;
    if (f === 'active') return status !== 'completed' && status !== 'cancelled';
    return status === f;
  };

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { all: 0, active: 0, completed: 0, cancelled: 0 };
    myBookings.forEach((b) => {
      (Object.keys(result) as Filter[]).forEach((f) => { if (matchesFilter(b.status, f)) result[f] += 1; });
    });
    return result;
  }, [myBookings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return myBookings.filter((b) => {
      if (!matchesFilter(b.status, filter)) return false;
      if (!q) return true;
      return b.reference.toLowerCase().includes(q)
        || getLocationName(b.pickupLocation).toLowerCase().includes(q)
        || getLocationName(b.destination).toLowerCase().includes(q);
    });
  }, [myBookings, filter, query]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My rides</h1>
          <p className="mt-1 text-ink-500">Every booking you have made, newest first.</p>
        </div>
        <Link to="/customer/book" className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">
          <CarFront className="h-4 w-4" aria-hidden="true" /> Book a ride
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Filter rides" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => { setFilter(f.id); setVisible(PAGE_SIZE); }}
              className={cx(
                'h-9 rounded-full border px-4 text-sm font-semibold transition-colors',
                filter === f.id ? 'border-brand-600 bg-brand-50 text-brand-800' : 'border-ink-200 bg-white text-ink-700 hover:bg-ink-50',
              )}
            >
              {f.label} <span className="text-ink-500">({counts[f.id]})</span>
            </button>
          ))}
        </div>
        <div className="relative min-w-[12rem] flex-1">
          <label htmlFor="customer-history-search" className="sr-only">Search rides</label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden="true" />
          <input
            id="customer-history-search" type="search" placeholder="Search by place or reference" value={query}
            onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
            className="h-10 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-3 text-sm hover:border-ink-300"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<CarFront className="h-6 w-6" aria-hidden="true" />}
          title={myBookings.length === 0 ? 'No rides yet' : 'No rides match'}
          description={myBookings.length === 0 ? 'Book your first ride and it will be listed here.' : 'Try a different filter or search.'}
          action={myBookings.length === 0 ? <Link to="/customer/book" className="inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">Book a ride</Link> : undefined}
        />
      ) : (
        <>
          <ul className="space-y-3" aria-label="Rides">
            {shown.map((b) => <li key={b.id}><BookingCard booking={b} /></li>)}
          </ul>
          {filtered.length > shown.length && (
            <div className="text-center">
              <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>Show more ({filtered.length - shown.length} left)</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerHistory;