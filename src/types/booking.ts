export type RideType = 'standard' | 'comfort' | 'xl';

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;
  reference: string;
  customerId: string;
  riderId: string | null;
  pickupLocation: string; // location id from mockLocations
  destination: string; // location id from mockLocations
  rideType: RideType;
  distanceKm: number;
  estimatedDurationMinutes: number;
  baseFare: number;
  pricePerKm: number;
  totalFare: number;
  status: BookingStatus;
  /** Riders who hid this request. The booking itself stays pending. */
  declinedByRiderIds: string[];
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
  arrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}