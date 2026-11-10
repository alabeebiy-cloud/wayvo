import React, { useMemo, useState } from 'react';
import { ArrowRight, History as HistoryIcon, Search } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RIDE_TYPES } from '../../config/pricing.config';
import { useBookings } from '../../hooks/useBookings';
import { getLocationName } from '../../services/mockLocations';
import { cx } from '../../utils/cx';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';

type Filter = 'all' | 'completed' | 'active';
const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'active', label: 'In progress' },
];
const PAGE_SIZE = 10;

const RiderHistory: React.FC = () => {
  const { myBookings } = useBookings();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return myBookings.filter((b) => {
      if (filter === 'completed' && b.status !== 'completed') return false;
      if (filter === 'active' && (b.status === 'completed' || b.status === 'cancelled')) return false;
      if (!q) return true;
      return b.reference.toLowerCase().includes(q)
        || getLocationName(b.pickupLocation).toLowerCase().includes(q)
        || getLocationName(b.destination).toLowerCase().includes(q);
    });
  }, [myBookings, filter, query]);

  const completedTotal = useMemo(
    () => myBookings.filter((b) => b.status === 'completed').reduce((sum, b) => sum + b.totalFare, 0),
    [myBookings],
  );
  const shown = filtered.slice(0, visible);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Trip history</h1>
        <p className="mt-1 text-ink-500">
          {myBookings.length} {myBookings.length === 1 ? 'trip' : 'trips'} · {formatCurrency(completedTotal)} earned from completed trips (simulated)
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Filter trips" className="flex flex-wrap gap-2">
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
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative min-w-[12rem] flex-1">
          <label htmlFor="rider-history-search" className="sr-only">Search trips</label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden="true" />
          <input
            id="rider-history-search" type="search" placeholder="Search by place or reference" value={query}
            onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
            className="h-10 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-3 text-sm hover:border-ink-300"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon className="h-6 w-6" aria-hidden="true" />}
          title={myBookings.length === 0 ? 'No trips yet' : 'No trips match'}
          description={myBookings.length === 0 ? 'Rides you accept and finish are listed here.' : 'Try a different filter or search.'}
        />
      ) : (
        <>
          <ul className="space-y-3" aria-label="Trips">
            {shown.map((b) => (
              <li key={b.id}>
                <Card className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {getLocationName(b.pickupLocation)} <ArrowRight className="mx-1 inline h-4 w-4 text-ink-300" aria-label="to" /> {getLocationName(b.destination)}
                    </p>
                    <p className="mt-1 text-xs text-ink-500">
                      {b.reference} · {RIDE_TYPES[b.rideType].label} · {b.distanceKm} km · {formatDateTime(b.completedAt ?? b.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={b.status} />
                    <span className="font-display text-lg font-bold">{formatCurrency(b.totalFare)}</span>
                  </div>
                </Card>
              </li>
            ))}
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

export default RiderHistory;