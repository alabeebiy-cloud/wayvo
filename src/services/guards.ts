import { User, Session } from '../types/user';
import { Booking, BookingStatus } from '../types/booking';
import { RiderProfile } from '../types/rider';
import { AppNotification } from '../types/notification';
import { isRideType } from '../config/pricing.config';

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isOptStr = (v: unknown): boolean => v === undefined || isStr(v);

const STATUSES: BookingStatus[] = ['pending', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled'];
const NOTIFICATION_TYPES = ['booking_created', 'booking_accepted', 'rider_arrived', 'trip_started', 'trip_completed', 'booking_cancelled'];

export function isUser(v: unknown): v is User {
  return isObj(v) && isStr(v.id) && isStr(v.fullName) && isStr(v.email) && isStr(v.phone)
    && (v.role === 'customer' || v.role === 'rider')
    && isStr(v.passwordHash) && isStr(v.passwordSalt) && isStr(v.createdAt);
}

export function isSession(v: unknown): v is Session {
  return isObj(v) && isStr(v.userId) && isStr(v.createdAt) && typeof v.remember === 'boolean';
}

export function isRiderProfile(v: unknown): v is RiderProfile {
  return isObj(v) && isStr(v.userId) && isRideType(v.vehicleType)
    && isStr(v.vehicleMake) && isStr(v.vehicleModel) && isStr(v.vehicleRegistration)
    && isNum(v.passengerCapacity)
    && (v.availabilityStatus === 'online' || v.availabilityStatus === 'offline')
    && (v.verificationStatus === 'unverified' || v.verificationStatus === 'demo_verified')
    && isStr(v.updatedAt);
}

export function isBooking(v: unknown): v is Booking {
  return isObj(v) && isStr(v.id) && isStr(v.reference) && isStr(v.customerId)
    && (v.riderId === null || isStr(v.riderId))
    && isStr(v.pickupLocation) && isStr(v.destination) && isRideType(v.rideType)
    && isNum(v.distanceKm) && isNum(v.estimatedDurationMinutes)
    && isNum(v.baseFare) && isNum(v.pricePerKm) && isNum(v.totalFare)
    && isStr(v.status) && STATUSES.indexOf(v.status as BookingStatus) !== -1
    && Array.isArray(v.declinedByRiderIds) && v.declinedByRiderIds.every(isStr)
    && isStr(v.createdAt) && isStr(v.updatedAt)
    && isOptStr(v.acceptedAt) && isOptStr(v.arrivedAt) && isOptStr(v.startedAt)
    && isOptStr(v.completedAt) && isOptStr(v.cancelledAt);
}

export function isNotification(v: unknown): v is AppNotification {
  return isObj(v) && isStr(v.id) && isStr(v.userId) && isOptStr(v.bookingId)
    && isStr(v.title) && isStr(v.message)
    && isStr(v.type) && NOTIFICATION_TYPES.indexOf(v.type) !== -1
    && typeof v.isRead === 'boolean' && isStr(v.createdAt);
}