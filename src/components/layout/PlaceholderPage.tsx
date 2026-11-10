import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, LogOut } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Logo } from '../common/BrandLogo';
import { useAuth } from '../../hooks/useAuth';
import { dashboardPath } from '../../routes/paths';

/** TEMPORARY. Marks routes whose real page arrives in a later stage, so no route is broken in the meantime. */
export const PlaceholderPage: React.FC<{ title: string; stage: number }> = ({ title, stage }) => {
  const { user, logout } = useAuth();
  return (
    <div className="mx-auto max-w-xl p-6 sm:p-10">
      <Link to="/" aria-label="Wayvo home"><Logo /></Link>
      <Card className="mt-8 space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Hammer className="h-6 w-6" aria-hidden="true" /></div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-ink-500">This page is built in Stage {stage}.</p>
        {user ? (
          <div className="rounded-xl bg-ink-50 p-4 text-sm">
            <p>Signed in as <strong>{user.fullName}</strong> ({user.role})</p>
            <p className="text-ink-500">{user.email}</p>
          </div>
        ) : (
          <p className="text-sm text-ink-500">You are not signed in.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {user && <Link to={dashboardPath(user.role)} className="inline-flex h-11 items-center rounded-xl border border-ink-200 px-5 text-sm font-semibold hover:bg-ink-50">My dashboard</Link>}
          {user && <Button variant="ghost" leftIcon={<LogOut className="h-4 w-4" aria-hidden="true" />} onClick={logout}>Log out</Button>}
        </div>
      </Card>
    </div>
  );
};