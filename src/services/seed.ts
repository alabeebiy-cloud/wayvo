/**
 * Demo data. Accounts are clearly labelled demo accounts and the password is public (see README).
 */
import { Booking } from '../types/booking';
import { generateId } from '../utils/id';
import { generateReference } from '../utils/generateReference';
import { getDistanceKm } from './mockLocations';
import { calculateFare, estimateDurationMinutes } from './pricing';
import { getUserById, registerUser } from './authService';
import { getBookings } from './bookingService';
import { markDemoVerified, saveRiderVehicle, setAvailability } from './riderService';
import { readCollection, readSettings, STORAGE_KEYS, writeCollection, writeSettings } from './storage';
import { isUser } from './guards';

export const DEMO_PASSWORD = 'WayvoDemo1!';
export const DEMO_CUSTOMER_EMAIL = 'customer@wayvo.demo';
export const DEMO_RIDER_EMAIL = 'rider@wayvo.demo';

function makeBooking(customerId: string, riderId: string | null, from: string, to: string, rideType: Booking['rideType'], status: Booking['status'], daysAgo: number): Booking {
  const km = getDistanceKm(from, to) ?? 5;
  const fare = calculateFare(rideType, km);
  const created = new Date(Date.now() - daysAgo * 86400000 - 3600000).toISOString();
  const finished = new Date(Date.now() - daysAgo * 86400000).toISOString();
  return {
    id: generateId(), reference: generateReference(), customerId, riderId,
    pickupLocation: from, destination: to, rideType,
    distanceKm: km, estimatedDurationMinutes: estimateDurationMinutes(km),
    baseFare: fare.baseFare, pricePerKm: fare.pricePerKm, totalFare: fare.total,
    status, declinedByRiderIds: [], createdAt: created, updatedAt: finished,
    ...(riderId ? { acceptedAt: created } : {}),
    ...(status === 'completed' ? { arrivedAt: created, startedAt: created, completedAt: finished } : {}),
  };
}

/** Creates the demo accounts and a few sample bookings. Safe to call more than once. */
export async function seedDemoData(): Promise<{ created: boolean }> {
  const users = readCollection(STORAGE_KEYS.users, isUser);
  if (users.some((u) => u.email === DEMO_CUSTOMER_EMAIL)) return { created: false };

  const base = { password: DEMO_PASSWORD, confirmPassword: DEMO_PASSWORD, acceptedTerms: true };
  const customer = await registerUser(
    { ...base, fullName: 'Demo Customer', email: DEMO_CUSTOMER_EMAIL, phone: '08011111111', role: 'customer' },
    { startSession: false },
  );
  const rider = await registerUser(
    { ...base, fullName: 'Demo Rider', email: DEMO_RIDER_EMAIL, phone: '08022222222', role: 'rider' },
    { startSession: false },
  );
  if (!customer.ok || !rider.ok) return { created: false };

  saveRiderVehicle(rider.data.id, {
    vehicleType: 'standard', vehicleMake: 'Toyota', vehicleModel: 'Corolla',
    vehicleRegistration: 'DEMO-123', passengerCapacity: 4,
  });
  markDemoVerified(rider.data.id);
  setAvailability(rider.data.id, 'online');

  const samples: Booking[] = [
    makeBooking(customer.data.id, rider.data.id, 'ikeja', 'maryland', 'standard', 'completed', 2),
    makeBooking(customer.data.id, rider.data.id, 'yaba', 'vi', 'comfort', 'completed', 1),
    makeBooking(customer.data.id, null, 'lekki', 'ikoyi', 'standard', 'pending', 0),
  ];
  writeCollection(STORAGE_KEYS.bookings, [...getBookings(), ...samples]);

  const settings = readSettings();
  writeSettings({ ...settings, seeded: true });
  return { created: getUserById(customer.data.id) !== null };
}