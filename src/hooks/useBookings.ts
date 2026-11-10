import { useContext } from 'react';
import { BookingContext, BookingContextValue } from '../context/BookingContext';

export function useBookings(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be used inside <BookingProvider>.');
  return ctx;
}