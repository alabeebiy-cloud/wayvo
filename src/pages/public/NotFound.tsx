import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { dashboardPath } from '../../routes/paths';

/** Basic version. Stage 4 adds the full layout with navigation. */
const NotFound: React.FC = () => {
  const { user } = useAuth();
  const to = user ? dashboardPath(user.role) : '/';
  return (
    <main className="mx-auto max-w-xl p-6 sm:p-10">
      <EmptyState
        icon={<MapPinOff className="h-6 w-6" aria-hidden="true" />}
        title="We could not find that page"
        description="The link may be wrong or the page may have moved."
        action={<Link to={to} className="inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">{user ? 'Back to my dashboard' : 'Back to home'}</Link>}
      />
    </main>
  );
};

export default NotFound;