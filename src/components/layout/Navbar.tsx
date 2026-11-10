import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from '../common/BrandLogo';
import { Presence } from '../common/Presence';
import { useAuth } from '../../hooks/useAuth';
import { dashboardPath } from '../../routes/paths';

const LINKS = [
  { label: 'Home', to: '/#home' },
  { label: 'About', to: '/#about' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Ride options', to: '/ride-options' },
  { label: 'Help', to: '/#help' },
];

const linkClass = 'rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100';
const primaryClass = 'inline-flex h-10 items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="Wayvo home"><Logo /></Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => <Link key={l.label} to={l.to} className={linkClass}>{l.label}</Link>)}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Link to={dashboardPath(user.role)} className={primaryClass}>Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className={linkClass}>Log in</Link>
              <Link to="/register" className={primaryClass}>Get started</Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-ink-100 md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <Presence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="border-t border-ink-100 bg-white md:hidden"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0 : 0.15 }}
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {LINKS.map((l) => <Link key={l.label} to={l.to} className="rounded-lg px-3 py-3 font-semibold hover:bg-ink-100">{l.label}</Link>)}
              <div className="mt-2 grid gap-2 border-t border-ink-100 pt-3">
                {user ? (
                  <Link to={dashboardPath(user.role)} className={primaryClass}>Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login" className="inline-flex h-10 items-center justify-center rounded-xl border border-ink-200 text-sm font-semibold hover:bg-ink-50">Log in</Link>
                    <Link to="/register" className={primaryClass}>Get started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </Presence>
    </header>
  );
};