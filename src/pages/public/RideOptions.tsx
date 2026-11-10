import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, CarFront, Sparkles } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Reveal } from '../../components/common/Reveal';
import { RIDE_TYPE_LIST } from '../../config/pricing.config';
import { calculateFare } from '../../services/pricing';
import { RideType } from '../../types/booking';
import { formatCurrency } from '../../utils/formatCurrency';

const RIDE_ICONS: Record<RideType, React.ReactNode> = {
  standard: <CarFront className="h-6 w-6" aria-hidden="true" />,
  comfort: <Sparkles className="h-6 w-6" aria-hidden="true" />,
  xl: <Bus className="h-6 w-6" aria-hidden="true" />,
};

const btn = 'inline-flex h-12 items-center justify-center rounded-xl px-6 text-base font-semibold transition-colors';

const RideOptions: React.FC = () => (
  <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
    <Reveal>
      <h1 className="text-4xl font-bold sm:text-5xl">Ride options</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-500">Demonstration prices in naira. Fare = base fare + distance x rate per km.</p>
    </Reveal>

    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {RIDE_TYPE_LIST.map((r, i) => (
        <Reveal key={r.id} delay={i * 0.06} className="h-full">
          <Card className="flex h-full flex-col">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ink-900 text-white">{RIDE_ICONS[r.id]}</span>
            <h2 className="text-xl font-bold">{r.label}</h2>
            <p className="mt-1 text-sm text-ink-500">{r.description}</p>
            <dl className="mt-5 space-y-2 border-t border-ink-100 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-ink-500">Seats</dt><dd className="font-semibold">Up to {r.capacity}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Base fare</dt><dd className="font-semibold">{formatCurrency(r.baseFare)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Per km</dt><dd className="font-semibold">{formatCurrency(r.pricePerKm)}</dd></div>
              <div className="flex justify-between border-t border-ink-100 pt-2"><dt className="text-ink-500">Example: 5 km</dt><dd className="font-bold">{formatCurrency(calculateFare(r.id, 5).total)}</dd></div>
            </dl>
          </Card>
        </Reveal>
      ))}
    </div>

    <div className="mt-12 flex flex-wrap gap-3">
      <Link to="/register?role=customer" className={`${btn} bg-brand-600 text-white hover:bg-brand-700`}>Book a ride</Link>
      <Link to="/how-it-works" className={`${btn} border border-ink-200 bg-white hover:bg-ink-50`}>How it works</Link>
    </div>
  </div>
);

export default RideOptions;