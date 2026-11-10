import React, { createContext, useCallback, useMemo } from 'react';
import { Booking } from '../types/booking';
import { Result, fail } from '../utils/result';
import {
  acceptBooking as acceptService, advanceBooking as advanceService, cancelBooking as cancelService,
  createBooking as createService, CreateBookingInput, declineBooking as declineService, getBookings,
} from '../services/bookingService';
import { STORAGE_KEYS } from '../services/storage';
import { useAuth } from '../hooks/useAuth';
import { useStorageSync } from '../hooks/useStorageSync';

type TripStep = 'arrived' | 'in_progress' | 'completed';

export interface BookingContextValue {
  /** Every stored booking. Prefer myBookings in pages. */
  bookings: Booking[];
  /** The current customer's bookings, or the current rider's assigned bookings. Newest first. */
  myBookings: Booking[];
  /** Rider only: pending requests this rider has not declined. */
  pendingRequests: Booking[];
  /** Rider only: the ride currently accepted, arrived or in progress. */
  activeRide: Booking | null;
  createBooking: (input: Omit<CreateBookingInput, 'customerId'>) => Result<Booking>;
  cancelBooking: (bookingId: string) => Result<Booking>;
  acceptBooking: (bookingId: string) => Result<Booking>;
  declineBooking: (bookingId: string) => Result<Booking>;
  advanceBooking: (bookingId: string, next: TripStep) => Result<Booking>;
}

export const BookingContext = createContext<BookingContextValue | null>(null);

const NOT_CUSTOMER = 'Only customers can do this.';
const NOT_RIDER = 'Only riders can do this.';
const byNewest = (a: Booking, b: Booking): number => b.createdAt.localeCompare(a.createdAt);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  // Re-reads whenever bookings change in this tab or another tab, so no manual refresh is needed.
  const bookings = useStorageSync([STORAGE_KEYS.bookings], getBookings);

  const myBookings = useMemo(() => {
    if (!user) return [];
    const mine = user.role === 'customer'
      ? bookings.filter((b) => b.customerId === user.id)
      : bookings.filter((b) => b.riderId === user.id);
    return [...mine].sort(byNewest);
  }, [bookings, user]);

  const pendingRequests = useMemo(() => {
    if (!user || user.role !== 'rider') return [];
    return bookings
      .filter((b) => b.status === 'pending' && b.declinedByRiderIds.indexOf(user.id) === -1)
      .sort(byNewest);
  }, [bookings, user]);

  const activeRide = useMemo(() => {
    if (!user || user.role !== 'rider') return null;
    return bookings.find((b) => b.riderId === user.id && (b.status === 'accepted' || b.status === 'arrived' || b.status === 'in_progress')) ?? null;
  }, [bookings, user]);

  const createBooking = useCallback((input: Omit<CreateBookingInput, 'customerId'>) => {
    if (!user || user.role !== 'customer') return fail(NOT_CUSTOMER);
    return createService({ ...input, customerId: user.id });
  }, [user]);

  const cancelBooking = useCallback((id: string) => {
    if (!user || user.role !== 'customer') return fail(NOT_CUSTOMER);
    return cancelService(id, user.id);
  }, [user]);

  const acceptBooking = useCallback((id: string) => {
    if (!user || user.role !== 'rider') return fail(NOT_RIDER);
    return acceptService(id, user.id);
  }, [user]);

  const declineBooking = useCallback((id: string) => {
    if (!user || user.role !== 'rider') return fail(NOT_RIDER);
    return declineService(id, user.id);
  }, [user]);

  const advanceBooking = useCallback((id: string, next: TripStep) => {
    if (!user || user.role !== 'rider') return fail(NOT_RIDER);
    return advanceService(id, user.id, next);
  }, [user]);

  const value = useMemo<BookingContextValue>(() => ({
    bookings, myBookings, pendingRequests, activeRide,
    createBooking, cancelBooking, acceptBooking, declineBooking, advanceBooking,
  }), [bookings, myBookings, pendingRequests, activeRide, createBooking, cancelBooking, acceptBooking, declineBooking, advanceBooking]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};