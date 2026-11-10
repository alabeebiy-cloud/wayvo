import { AppNotification, NotificationType } from '../types/notification';
import { generateId, nowIso } from '../utils/id';
import { isNotification } from './guards';
import { readCollection, STORAGE_KEYS, writeCollection } from './storage';

const all = (): AppNotification[] => readCollection(STORAGE_KEYS.notifications, isNotification);

export interface NewNotification {
  userId: string;
  bookingId?: string;
  type: NotificationType;
  title: string;
  message: string;
}

export function createNotification(input: NewNotification): AppNotification | null {
  const notification: AppNotification = { id: generateId(), isRead: false, createdAt: nowIso(), ...input };
  const ok = writeCollection(STORAGE_KEYS.notifications, [...all(), notification]);
  return ok ? notification : null;
}

export function getNotificationsForUser(userId: string): AppNotification[] {
  return all()
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getUnreadCount(userId: string): number {
  return all().filter((n) => n.userId === userId && !n.isRead).length;
}

export function markAsRead(notificationId: string, userId: string): boolean {
  const list = all();
  let changed = false;
  const next = list.map((n) => {
    if (n.id === notificationId && n.userId === userId && !n.isRead) {
      changed = true;
      return { ...n, isRead: true };
    }
    return n;
  });
  return changed ? writeCollection(STORAGE_KEYS.notifications, next) : true;
}

export function markAllAsRead(userId: string): boolean {
  const next = all().map((n) => (n.userId === userId ? { ...n, isRead: true } : n));
  return writeCollection(STORAGE_KEYS.notifications, next);
}