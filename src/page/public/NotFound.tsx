import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { dashboardPath } from '../../routes/paths';

const primary = 'inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700';
const secondary = 'inline-flex h-11 items-center rounded-xl border border-ink-200 bg-white px-5 text-sm font-semibold hover:bg-ink-50';

const NotFound: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:py-24">
      <p className="mb-4 text-center font-display text-6xl font-bold text-brand-600" aria-hidden="true">404</p>
      <EmptyState
        icon={<MapPinOff className="h-6 w-6" aria-hidden="true" />}
        title="We could not find that page"
        description="The link may be wrong, or the page may have moved. Let us get you back on route."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/" className={primary}>Back to home</Link>
            {user ? <Link to={dashboardPath(user.role)} className={secondary}>My dashboard</Link> : <Link to="/login" className={secondary}>Log in</Link>}
            <Link to="/help" className={secondary}>Help</Link>
          </div>
        }
      />
    </div>
  );
};

export default NotFound;