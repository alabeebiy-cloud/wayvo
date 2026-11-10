import { useContext } from 'react';
import { NotificationContext, NotificationContextValue } from '../context/NotificationContext';

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationProvider>.');
  return ctx;
}