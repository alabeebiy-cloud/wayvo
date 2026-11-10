import { Booking, BookingStatus, RideType } from '../types/booking';
import { isRideType } from '../config/pricing.config';
import { fail, ok, Result, STORAGE_ERROR } from '../utils/result';
import { generateId, nowIso } from '../utils/id';
import { generateReference } from '../utils/generateReference';
import { toDateKey } from '../utils/formatDate';
import { getUserById } from './authService';
import { isBooking } from './guards';
import { getDistanceKm, getLocation, getLocationName } from './mockLocations';
import { createNotification } from './notificationService';
import { calculateFare, estimateDurationMinutes } from './pricing';
import { getRiderProfile } from './riderService';
import { readCollection, STORAGE_KEYS, writeCollection } from './storage';

/**
 * Every mutation re-reads the latest bookings from storage before changing them, so a stale tab cannot
 * overwrite newer data. This is best-effort: two tabs acting in the same instant could still race.
 * True atomic guarantees need a backend.
 */

const DUPLICATE_WINDOW_MS = 5000;
const ACTIVE_STATUSES: BookingStatus[] = ['accepted', 'arrived', 'in_progress'];

/** Allowed status changes. Anything not listed here is rejected. */
export const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['accepted', 'cancelled'],
  accepted: ['arrived'],
  arrived: ['in_progress'],
  in_progress: ['completed'],
  completed: [],
  cancelled: [],
};

export const getBookings = (): Booking[] => readCollection(STORAGE_KEYS.bookings, isBooking);
const saveBookings = (list: Booking[]): boolean => writeCollection(STORAGE_KEYS.bookings, list);
const byNewest = (a: Booking, b: Booking): number => b.createdAt.localeCompare(a.createdAt);

export function getBookingById(id: string): Booking | null {
  return getBookings().find((b) => b.id === id) ?? null;
}

export const getBookingsForCustomer = (customerId: string): Booking[] =>
  getBookings().filter((b) => b.customerId === customerId).sort(byNewest);

export const getBookingsForRider = (riderId: string): Booking[] =>
  getBookings().filter((b) => b.riderId === riderId).sort(byNewest);

/** Pending requests this rider has not hidden. The UI should also require the rider to be online. */
export const getPendingRequestsForRider = (riderId: string): Booking[] =>
  getBookings()
    .filter((b) => b.status === 'pending' && b.declinedByRiderIds.indexOf(riderId) === -1)
    .sort(byNewest);

export function getActiveBookingForRider(riderId: string): Booking | null {
  return getBookings().find((b) => b.riderId === riderId && ACTIVE_STATUSES.indexOf(b.status) !== -1) ?? null;
}

// ---------- create ----------
export interface CreateBookingInput {
  customerId: string;
  pickupLocation: string;
  destination: string;
  rideType: RideType;
  /** Road distance from the map, when it is known. It is checked against the estimate before use. */
  distanceKm?: number;
}

/** Uses the map's road distance only when it is believable next to our own estimate. *
function trustedDistance(mapKm: number | undefined, estimatedKm: number): number {
  if (typeof mapKm !== 'number' || !Number.isFinite(mapKm) || mapKm <= 0) return estimatedKm;
  if (mapKm < estimatedKm * 0.5 || mapKm > estimatedKm * 2.5) return estimatedKm;
  return Math.max(1, Math.round(mapKm));
}*/

export function createBooking(input: CreateBookingInput): Result<Booking> {
  const { customerId, pickupLocation, destination, rideType } = input;
  if (!customerId) return fail('You need to be signed in to book a ride.');
  if (!pickupLocation) return fail('Choose a pickup location.');
  if (!destination) return fail('Choose a destination.');
  if (pickupLocation === destination) return fail('Pickup and destination must be different.');
  if (!isRideType(rideType)) return fail('Choose a ride type.');
  if (!getLocation(pickupLocation) || !getLocation(destination)) return fail('Choose locations from the list.');
  const distanceKm = getDistanceKm(pickupLocation, destination);
  if (distanceKm === null) return fail('We do not cover this route yet. Try a different pickup or destination.');

  const bookings = getBookings();
  const now = Date.now();

  // Repeated clicks: return the booking that was just created instead of making a duplicate.
  const duplicate = bookings.find(
    (b) => b.customerId === customerId && b.status === 'pending' && b.pickupLocation === pickupLocation
      && b.destination === destination && b.rideType === rideType
      && now - Date.parse(b.createdAt) < DUPLICATE_WINDOW_MS,
  );
  if (duplicate) return ok(duplicate);

  const fare = calculateFare(rideType, distanceKm);
  let reference = generateReference();
  while (bookings.some((b) => b.reference === reference)) reference = generateReference();

  const timestamp = nowIso();
  const booking: Booking = {
    id: generateId(),
    reference,
    customerId,
    riderId: null,
    pickupLocation,
    destination,
    rideType,
    distanceKm,
    estimatedDurationMinutes: estimateDurationMinutes(distanceKm),
    baseFare: fare.baseFare,
    pricePerKm: fare.pricePerKm,
    totalFare: fare.total,
    status: 'pending',
    declinedByRiderIds: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  if (!saveBookings([...bookings, booking])) return fail(STORAGE_ERROR);

  createNotification({
    userId: customerId,
    bookingId: booking.id,
    type: 'booking_created',
    title: 'Booking created',
    message: `Your ${booking.reference} request is waiting for a rider.`,
  });
  return ok(booking);
}

// ---------- customer actions ----------
export function cancelBooking(bookingId: string, customerId: string): Result<Booking> {
  const bookings = getBookings();
  const current = bookings.find((b) => b.id === bookingId);
  if (!current || current.customerId !== customerId) return fail('Booking not found.');
  if (current.status !== 'pending') return fail('Only bookings still waiting for a rider can be cancelled.');

  const timestamp = nowIso();
  const updated: Booking = { ...current, status: 'cancelled', cancelledAt: timestamp, updatedAt: timestamp };
  if (!saveBookings(bookings.map((b) => (b.id === bookingId ? updated : b)))) return fail(STORAGE_ERROR);

  createNotification({
    userId: customerId,
    bookingId,
    type: 'booking_cancelled',
    title: 'Booking cancelled',
    message: `You cancelled ${updated.reference}.`,
  });
  return ok(updated);
}

// ---------- rider actions ----------
export function acceptBooking(bookingId: string, riderId: string): Result<Booking> {
  const profile = getRiderProfile(riderId);
  if (!profile) return fail('Set up your rider profile first.');
  if (profile.availabilityStatus !== 'online') return fail('Go online to accept ride requests.');

  const bookings = getBookings(); // latest state, not what the UI last rendered
  const current = bookings.find((b) => b.id === bookingId);
  if (!current) return fail('This request no longer exists.');
  if (current.status !== 'pending' || current.riderId !== null) {
    return fail('This ride was already taken or cancelled.');
  }
  if (bookings.some((b) => b.riderId === riderId && ACTIVE_STATUSES.indexOf(b.status) !== -1)) {
    return fail('Finish your current ride before accepting another.');
  }

  const timestamp = nowIso();
  const updated: Booking = { ...current, riderId, status: 'accepted', acceptedAt: timestamp, updatedAt: timestamp };
  if (!saveBookings(bookings.map((b) => (b.id === bookingId ? updated : b)))) return fail(STORAGE_ERROR);

  const rider = getUserById(riderId);
  createNotification({
    userId: current.customerId,
    bookingId,
    type: 'booking_accepted',
    title: 'Rider accepted',
    message: `${rider ? rider.fullName : 'A rider'} accepted ${updated.reference} and is heading to ${getLocationName(updated.pickupLocation)}.`,
  });
  return ok(updated);
}

/** Hides the request for this rider only. The booking stays pending for everyone else. */
export function declineBooking(bookingId: string, riderId: string): Result<Booking> {
  const bookings = getBookings();
  const current = bookings.find((b) => b.id === bookingId);
  if (!current) return fail('This request no longer exists.');
  if (current.status !== 'pending') return fail('This request is no longer available.');
  if (current.declinedByRiderIds.indexOf(riderId) !== -1) return ok(current);

  const updated: Booking = { ...current, declinedByRiderIds: [...current.declinedByRiderIds, riderId] };
  return saveBookings(bookings.map((b) => (b.id === bookingId ? updated : b))) ? ok(updated) : fail(STORAGE_ERROR);
}

type TripStep = 'arrived' | 'in_progress' | 'completed';

const STEP_DETAILS: Record<TripStep, { stamp: 'arrivedAt' | 'startedAt' | 'completedAt'; type: 'rider_arrived' | 'trip_started' | 'trip_completed'; title: string; message: (ref: string) => string }> = {
  arrived: { stamp: 'arrivedAt', type: 'rider_arrived', title: 'Your rider has arrived', message: (r) => `Your rider is at the pickup point for ${r}.` },
  in_progress: { stamp: 'startedAt', type: 'trip_started', title: 'Trip started', message: (r) => `Your trip ${r} is underway.` },
  completed: { stamp: 'completedAt', type: 'trip_completed', title: 'Trip completed', message: (r) => `Your trip ${r} is complete. Thanks for riding with Wayvo.` },
};

export function advanceBooking(bookingId: string, riderId: string, next: TripStep): Result<Booking> {
  const bookings = getBookings();
  const current = bookings.find((b) => b.id === bookingId);
  if (!current || current.riderId !== riderId) return fail('Ride not found.');
  if (ALLOWED_TRANSITIONS[current.status].indexOf(next) === -1) {
    return fail(`This ride cannot move from "${current.status}" to "${next}".`);
  }

  const details = STEP_DETAILS[next];
  const timestamp = nowIso();
  const updated: Booking = { ...current, status: next, updatedAt: timestamp };
  updated[details.stamp] = timestamp;
  if (!saveBookings(bookings.map((b) => (b.id === bookingId ? updated : b)))) return fail(STORAGE_ERROR);

  createNotification({
    userId: current.customerId,
    bookingId,
    type: details.type,
    title: details.title,
    message: details.message(updated.reference),
  });
  return ok(updated);
}

// ---------- statistics (always computed from stored bookings) ----------
export interface CustomerStats { total: number; active: number; completed: number; cancelled: number }

export function getCustomerStats(customerId: string): CustomerStats {
  const mine = getBookingsForCustomer(customerId);
  return {
    total: mine.length,
    active: mine.filter((b) => b.status !== 'completed' && b.status !== 'cancelled').length,
    completed: mine.filter((b) => b.status === 'completed').length,
    cancelled: mine.filter((b) => b.status === 'cancelled').length,
  };
}

export interface EarningsSummary {
  total: number;
  completedCount: number;
  average: number;
  byDay: Array<{ date: string; total: number; trips: number }>;
}

/** Simulated earnings: the sum of completed fares. These are not real payments. */
export function getRiderEarnings(riderId: string, days = 7): EarningsSummary {
  const completed = getBookingsForRider(riderId).filter((b) => b.status === 'completed');
  const total = completed.reduce((sum, b) => sum + b.totalFare, 0);

  const byDay: EarningsSummary['byDay'] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const key = toDateKey(day);
    const rides = completed.filter((b) => b.completedAt && toDateKey(b.completedAt) === key);
    byDay.push({ date: key, total: rides.reduce((s, b) => s + b.totalFare, 0), trips: rides.length });
  }
  return {
    total,
    completedCount: completed.length,
    average: completed.length ? Math.round(total / completed.length) : 0,
    byDay,
  };
}