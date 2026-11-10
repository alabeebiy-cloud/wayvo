import React, { createContext, useCallback, useMemo } from 'react';
import { AppNotification } from '../types/notification';
import { getNotificationsForUser, markAllAsRead as markAllService, markAsRead as markOneService } from '../services/notificationService';
import { STORAGE_KEYS } from '../services/storage';
import { useAuth } from '../hooks/useAuth';
import { useStorageSync } from '../hooks/useStorageSync';

export interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user ? user.id : '';
  const notifications = useStorageSync(
    [STORAGE_KEYS.notifications],
    () => (userId ? getNotificationsForUser(userId) : []),
    userId,
  );

  const markAsRead = useCallback((id: string) => { if (userId) markOneService(id, userId); }, [userId]);
  const markAllAsRead = useCallback(() => { if (userId) markAllService(userId); }, [userId]);

  const value = useMemo<NotificationContextValue>(() => ({
    notifications,
    unreadCount: notifications.filter((n) => !n.isRead).length,
    markAsRead,
    markAllAsRead,
  }), [notifications, markAsRead, markAllAsRead]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};