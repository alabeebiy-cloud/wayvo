import React, { useMemo, useState } from 'react';
import { CheckCircle2, TrendingUp, Wallet } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { useBookings } from '../../hooks/useBookings';
import { cx } from '../../utils/cx';
import { dailyTotals } from '../../utils/earnings';
import { formatCurrency } from '../../utils/formatCurrency';

const PERIODS = [7, 14, 30];

const dayLabel = (key: string): string => new Date(`${key}T00:00:00`).toLocaleDateString('en-NG', { weekday: 'short' });
const fullDay = (key: string): string => new Date(`${key}T00:00:00`).toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' });

const Earnings: React.FC = () => {
  const { myBookings } = useBookings();
  const [days, setDays] = useState(7);

  const data = useMemo(() => {
    const completed = myBookings.filter((b) => b.status === 'completed');
    const perDay = dailyTotals(completed, days);
    const total = perDay.reduce((s, d) => s + d.total, 0);
    const trips = perDay.reduce((s, d) => s + d.trips, 0);
    const best = perDay.reduce((a, d) => (d.total > a.total ? d : a), perDay[0]);
    return {
      perDay,
      total,
      trips,
      average: trips ? Math.round(total / trips) : 0,
      best: best && best.total > 0 ? best : null,
      max: Math.max(...perDay.map((d) => d.total), 0),
      allTime: completed.reduce((s, b) => s + b.totalFare, 0),
    };
  }, [myBookings, days]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Earnings</h1>
        <p className="mt-1 text-ink-500">Simulated amounts from completed trips. No real money moves in this demo.</p>
      </header>

      <div role="group" aria-label="Time period" className="flex gap-2">
        {PERIODS.map((p) => (
          <button
            key={p} type="button" aria-pressed={days === p} onClick={() => setDays(p)}
            className={cx('h-9 rounded-full border px-4 text-sm font-semibold transition-colors', days === p ? 'border-brand-600 bg-brand-50 text-brand-800' : 'border-ink-200 bg-white text-ink-700 hover:bg-ink-50')}
          >
            Last {p} days
          </button>
        ))}
      </div>

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Wallet className="h-5 w-5" aria-hidden="true" />} label={`Last ${days} days`} value={formatCurrency(data.total)} />
        <StatCard icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />} label="Trips" value={data.trips} />
        <StatCard icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />} label="Average per trip" value={formatCurrency(data.average)} />
        <StatCard icon={<Wallet className="h-5 w-5" aria-hidden="true" />} label="All time" value={formatCurrency(data.allTime)} />
      </section>

      <Card className="space-y-4">
        <h2 className="text-lg font-bold">Earnings by day</h2>
        {data.max === 0 ? (
          <p className="py-8 text-center text-sm text-ink-500">No completed trips in this period yet.</p>
        ) : (
          <div className="flex h-48 items-end gap-1 sm:gap-2" role="img" aria-label={`Bar chart of daily earnings for the last ${days} days. Best day: ${data.best ? `${fullDay(data.best.date)}, ${formatCurrency(data.best.total)}` : 'none'}.`}>
            {data.perDay.map((d) => (
              <div key={d.date} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                <div
                  className={cx('w-full rounded-t-md', d.total > 0 ? 'bg-brand-600' : 'bg-ink-100')}
                  style={{ height: `${d.total > 0 ? Math.max((d.total / data.max) * 100, 4) : 2}%` }}
                  title={`${fullDay(d.date)}: ${formatCurrency(d.total)}`}
                />
                {days <= 14 && <span className="text-[10px] text-ink-500">{dayLabel(d.date)}</span>}
              </div>
            ))}
          </div>
        )}
        {data.best && <p className="text-sm text-ink-500">Best day: <strong className="text-ink-900">{fullDay(data.best.date)}</strong> with {formatCurrency(data.best.total)}.</p>}
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-bold">Daily breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[20rem] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-ink-500">
                <th scope="col" className="py-2 pr-4 font-semibold">Day</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Trips</th>
                <th scope="col" className="py-2 text-right font-semibold">Earned</th>
              </tr>
            </thead>
            <tbody>
              {[...data.perDay].reverse().map((d) => (
                <tr key={d.date} className="border-b border-ink-50 last:border-0">
                  <th scope="row" className="py-2 pr-4 font-medium">{fullDay(d.date)}</th>
                  <td className="py-2 pr-4">{d.trips}</td>
                  <td className="py-2 text-right font-semibold">{formatCurrency(d.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Earnings;