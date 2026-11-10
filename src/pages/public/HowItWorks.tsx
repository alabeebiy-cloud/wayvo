import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, MapPin, Route, Wallet } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Reveal } from '../../components/common/Reveal';

const CUSTOMER_STEPS = [
  { icon: <MapPin className="h-5 w-5" aria-hidden="true" />, title: 'Choose your route', text: 'Pick a pickup point and a destination from the supported locations.' },
  { icon: <Wallet className="h-5 w-5" aria-hidden="true" />, title: 'See the fare', text: 'Compare ride types and check the estimated fare before you commit.' },
  { icon: <ClipboardList className="h-5 w-5" aria-hidden="true" />, title: 'A rider accepts', text: 'Online riders see your request. When one accepts, you see their details.' },
  { icon: <Route className="h-5 w-5" aria-hidden="true" />, title: 'Follow the trip', text: 'Watch the status move from accepted to arrived, in progress and completed.' },
];

const RIDER_STEPS = [
  'Create a rider account and add your vehicle details.',
  'Switch to Online to see pending ride requests.',
  'Accept a ride, then mark it arrived, started and completed.',
  'See your simulated earnings from completed trips.',
];

const btn = 'inline-flex h-12 items-center justify-center rounded-xl px-6 text-base font-semibold transition-colors';

const HowItWorks: React.FC = () => (
  <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
    <Reveal>
      <h1 className="text-4xl font-bold sm:text-5xl">How it works</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-500">From request to drop-off in four steps. Wayvo is a demonstration app, so fares and payments are simulated.</p>
    </Reveal>

    <h2 className="mt-12 text-2xl font-bold">For customers</h2>
    <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {CUSTOMER_STEPS.map((s, i) => (
        <li key={s.title}>
          <Reveal delay={i * 0.06} className="h-full">
            <Card className="h-full">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">{s.icon}</span>
                <span className="font-display text-sm font-bold text-ink-300">0{i + 1}</span>
              </div>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-ink-500">{s.text}</p>
            </Card>
          </Reveal>
        </li>
      ))}
    </ol>

    <h2 className="mt-12 text-2xl font-bold">For riders</h2>
    <Reveal>
      <Card className="mt-6 max-w-2xl">
        <ol className="list-decimal space-y-2 pl-5 text-ink-700">
          {RIDER_STEPS.map((s) => <li key={s}>{s}</li>)}
        </ol>
      </Card>
    </Reveal>

    <div className="mt-12 flex flex-wrap gap-3">
      <Link to="/register?role=customer" className={`${btn} bg-brand-600 text-white hover:bg-brand-700`}>Book a ride</Link>
      <Link to="/ride-options" className={`${btn} border border-ink-200 bg-white hover:bg-ink-50`}>See ride options</Link>
    </div>
  </div>
);

export default HowItWorks;