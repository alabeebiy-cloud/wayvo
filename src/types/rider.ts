import { RideType } from './booking';

export type VehicleType = RideType;
export type AvailabilityStatus = 'online' | 'offline';
/** Simulated only. Nothing is checked against a real authority. */
export type VerificationStatus = 'unverified' | 'demo_verified';

export interface RiderProfile {
  userId: string;
  vehicleType: VehicleType;
  vehicleMake: string;
  vehicleModel: string;
  vehicleRegistration: string;
  passengerCapacity: number;
  availabilityStatus: AvailabilityStatus;
  verificationStatus: VerificationStatus;
  updatedAt: string;
}