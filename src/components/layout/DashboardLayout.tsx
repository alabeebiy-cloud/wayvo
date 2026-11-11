import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { Logo } from '../common/BrandLogo';
import { useAuth } from '../../hooks/useAuth';
import { cx } from '../../utils/cx';

export interface NavItem {
  label: string;
  /** A shorter name for the phone tab bar, where space is tight. */
  short?: string;
  to: string;
  icon: React.ReactNode;
  badge?: number;
}

const itemClass = ({ isActive }: { isActive: boolean }): string =>
  cx(
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
    isActive ? 'bg-brand-50 text-brand-800' : 'text-ink-700 hover:bg-ink-100',
  );

const tabClass = ({ isActive }: { isActive: boolean }): string =>
  cx(
    'relative flex h-16 flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold',
    isActive ? 'text-brand-700' : 'text-ink-500',
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

/**
 * Sidebar on desktop. On a phone: a top bar with a menu, plus a tab bar fixed to the bottom
 * so the main pages are one thumb-tap away. Pages render inside <Outlet />.
 */
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
        <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Link to="/" aria-label="Wayvo home"><Logo /></Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="dashboard-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-ink-100"
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
          {open && (
            <div id="dashboard-menu" className="max-h-[calc(100vh-3.5rem)] overflow-y-auto border-t border-ink-100 bg-white p-4">
              <nav aria-label={`${areaLabel} menu`}><NavList items={items} /></nav>
              <div className="mt-4">{account}</div>
            </div>
          )}
        </header>

        <div id="main" className="mx-auto max-w-5xl px-4 py-6 pb-28 sm:px-8 sm:py-10 lg:pb-10">
          <Outlet />
        </div>
      </div>

      {/* Phone tab bar */}
      <nav aria-label={`${areaLabel} tabs`} className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className="mx-auto flex max-w-xl">
          {items.map((item) => (
            <li key={item.to} className="min-w-0 flex-1">
              <NavLink to={item.to} className={tabClass}>
                <span className="relative">
                  {item.icon}
                  {item.badge ? (
                    <span className="absolute -right-2.5 -top-1.5 min-w-[1rem] rounded-full bg-brand-600 px-1 text-center text-[10px] font-bold leading-4 text-white">
                      {item.badge}
                      <span className="sr-only"> unread</span>
                    </span>
                  ) : null}
                </span>
                <span className="max-w-full truncate">{item.short ?? item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};