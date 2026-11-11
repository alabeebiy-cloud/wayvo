import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, CheckCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { useNotifications } from '../../hooks/useNotifications';
import { AppNotification } from '../../types/notification';
import { cx } from '../../utils/cx';
import { formatDateTime } from '../../utils/formatDate';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const open = (n: AppNotification) => {
    if (!n.isRead) markAsRead(n.id);
    if (n.bookingId) navigate(`/customer/bookings/${n.bookingId}`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="mt-1 text-ink-500">{unreadCount === 0 ? 'You are all caught up.' : `${unreadCount} unread`}</p>
        </div>
        <Button variant="secondary" onClick={markAllAsRead} disabled={unreadCount === 0} leftIcon={<CheckCheck className="h-4 w-4" aria-hidden="true" />}>
          Mark all as read
        </Button>
      </header>

      {notifications.length === 0 ? (
        <EmptyState icon={<BellOff className="h-6 w-6" aria-hidden="true" />} title="No notifications yet" description="Updates about your bookings, like a rider accepting your ride, appear here." />
      ) : (
        <ul className="space-y-3" aria-label="Notifications">
          {notifications.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => open(n)}
                className={cx(
                  'flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors hover:border-ink-200',
                  n.isRead ? 'border-ink-100 bg-white' : 'border-brand-200 bg-brand-50',
                )}
              >
                <span className={cx('mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', n.isRead ? 'bg-ink-100 text-ink-500' : 'bg-brand-600 text-white')}>
                  <Bell className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className={cx('block text-sm', n.isRead ? 'font-semibold' : 'font-bold')}>{n.title}</span>
                    {!n.isRead && <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">New</span>}
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-700">{n.message}</span>
                  <span className="mt-1 block text-xs text-ink-500">{formatDateTime(n.createdAt)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;