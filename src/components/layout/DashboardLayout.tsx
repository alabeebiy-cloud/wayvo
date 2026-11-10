import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { Logo } from '../common/BrandLogo';
import { useAuth } from '../../hooks/useAuth';
import { cx } from '../../utils/cx';

export interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  badge?: number;
}

const itemClass = ({ isActive }: { isActive: boolean }): string =>
  cx(
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
    isActive ? 'bg-brand-50 text-brand-800' : 'text-ink-700 hover:bg-ink-100',
  );

const NavList: React.FC<{ items: NavItem[] }> = ({ items }) => (
  <ul className="space-y-1">
    {items.map((item) => (
      <li key={item.to}>
        <NavLink to={item.to} className={itemClass}>
          {item.icon}
          <span className="flex-1">{item.label}</span>
          {item.badge ? (
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
              {item.badge}
              <span className="sr-only"> unread</span>
            </span>
          ) : null}
        </NavLink>
      </li>
    ))}
  </ul>
);

/** Sidebar on desktop, collapsible menu on mobile. Pages render inside <Outlet />. */
export const DashboardLayout: React.FC<{ items: NavItem[]; areaLabel: string }> = ({ items, areaLabel }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const account = (
    <div className="border-t border-ink-100 pt-4">
      <p className="truncate text-sm font-semibold">{user?.fullName}</p>
      <p className="truncate text-xs text-ink-500">{user?.email}</p>
      <button
        type="button"
        onClick={logout}
        className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-50 lg:grid lg:grid-cols-[256px_1fr]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>

      <aside className="hidden border-r border-ink-100 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:p-4">
        <Link to="/" aria-label="Wayvo home" className="px-2 py-2"><Logo /></Link>
        <nav aria-label={areaLabel} className="mt-6 flex-1 overflow-y-auto"><NavList items={items} /></nav>
        {account}
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/95 backdrop-blur lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Link to="/" aria-label="Wayvo home"><Logo /></Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="dashboard-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-ink-100"
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
          {open && (
            <div id="dashboard-menu" className="max-h-[calc(100vh-3.5rem)] overflow-y-auto border-t border-ink-100 bg-white p-4">
              <nav aria-label={areaLabel}><NavList items={items} /></nav>
              <div className="mt-4">{account}</div>
            </div>
          )}
        </header>

        <div id="main" className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};