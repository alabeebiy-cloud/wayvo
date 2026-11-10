import React from 'react';
import { Link } from 'react-router-dom';
import { Route, ShieldCheck, Wallet } from 'lucide-react';
import { Logo } from '../common/BrandLogo';

const POINTS = [
  { icon: <Wallet className="h-5 w-5" aria-hidden="true" />, text: 'See the fare before you confirm a booking.' },
  { icon: <Route className="h-5 w-5" aria-hidden="true" />, text: 'Customers book, riders accept, and both see every status change.' },
  { icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />, text: 'Manage every trip from one dashboard.' },
];

export interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({ title, subtitle, children, footer }) => (
  <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
    <aside className="hidden flex-col justify-between bg-ink-900 p-10 text-white lg:flex">
      <Link to="/" aria-label="Wayvo home"><Logo tone="light" /></Link>
      <div>
        <h2 className="max-w-md text-4xl font-bold leading-tight">Book the ride. Keep track of every step.</h2>
        <ul className="mt-8 space-y-4">
          {POINTS.map((p) => (
            <li key={p.text} className="flex items-start gap-3 text-ink-200">
              <span className="mt-0.5 text-brand-300">{p.icon}</span>
              <span className="max-w-sm">{p.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-ink-300">Wayvo is a demonstration app. Accounts and bookings are stored in this browser only.</p>
    </aside>

    <main className="flex flex-col justify-center px-5 py-10 sm:px-10">
      <div className="mx-auto w-full max-w-md">
        <Link to="/" aria-label="Wayvo home" className="mb-8 inline-block lg:hidden"><Logo /></Link>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-ink-500">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-6 text-center text-sm text-ink-500">{footer}</div>
      </div>
    </main>
  </div>
);