export type NotificationType =
  | 'booking_created'
  | 'booking_accepted'
  | 'rider_arrived'
  | 'trip_started'
  | 'trip_completed'
  | 'booking_cancelled';

export interface AppNotification {
  id: string;
  userId: string;
  bookingId?: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}