import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/BrandLogo';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', to: '/how-it-works' },
      { label: 'Ride options', to: '/ride-options' },
      { label: 'FAQ', to: '/#faq' },
    ],
  },
  {
    title: 'Get started',
    links: [
      { label: 'Book a ride', to: '/register?role=customer' },
      { label: 'Become a rider', to: '/register?role=rider' },
      { label: 'Log in', to: '/login' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help centre', to: '/#help' },
      { label: 'Contact us', to: '/#contact' },
      { label: 'Terms and privacy (demo)', to: '/#legal' },
    ],
  },
];

export const Footer: React.FC = () => (
  <footer className="bg-ink-900 text-ink-200">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
      <div>
        <Logo tone="light" />
        <p className="mt-4 max-w-xs text-sm text-ink-300">A ride-booking demo with customer and rider dashboards, built as a frontend project.</p>
        <p className="mt-4 text-sm text-ink-300">support@wayvo.example</p>
        <p className="text-sm text-ink-300">+234 000 000 0000</p>
        <p className="mt-1 text-xs text-ink-500">Placeholder contact details. Nothing here is monitored.</p>
      </div>
      {COLUMNS.map((c) => (
        <nav key={c.title} aria-label={c.title}>
          <h2 className="font-sans text-sm font-bold text-white">{c.title}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {c.links.map((l) => (
              <li key={l.label}><Link to={l.to} className="text-ink-300 hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
    <div className="border-t border-white/10 py-5 text-center text-xs text-ink-500">
      Demonstration project. Payments, tracking and verification are simulated.
    </div>
  </footer>
);