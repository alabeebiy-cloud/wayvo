import { useCallback } from 'react';
import { RiderProfile, AvailabilityStatus } from '../types/rider';
import { Result, fail } from '../utils/result';
import {
  getRiderProfile, markDemoVerified as verifyService, saveRiderVehicle, setAvailability as availabilityService, VehicleInput,
} from '../services/riderService';
import { STORAGE_KEYS } from '../services/storage';
import { useAuth } from './useAuth';
import { useStorageSync } from './useStorageSync';

/** The signed-in rider's profile, kept in sync with storage. Returns null profile for customers. */
export function useRiderProfile() {
  const { user } = useAuth();
  const userId = user && user.role === 'rider' ? user.id : '';
  const profile = useStorageSync<RiderProfile | null>(
    [STORAGE_KEYS.riderProfiles],
    () => (userId ? getRiderProfile(userId) : null),
    userId,
  );

  const saveVehicle = useCallback((input: VehicleInput): Result<RiderProfile> =>
    (userId ? saveRiderVehicle(userId, input) : fail('Only riders have a vehicle profile.')), [userId]);

  const setAvailability = useCallback((status: AvailabilityStatus): Result<RiderProfile> =>
    (userId ? availabilityService(userId, status) : fail('Only riders can change availability.')), [userId]);

  const markDemoVerified = useCallback((): Result<RiderProfile> =>
    (userId ? verifyService(userId) : fail('Only riders can be verified.')), [userId]);

  return { profile, saveVehicle, setAvailability, markDemoVerified };
}