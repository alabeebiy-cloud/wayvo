import { RiderProfile, AvailabilityStatus, VehicleType } from '../types/rider';
import { RIDE_TYPES } from '../config/pricing.config';
import { fail, ok, Result, STORAGE_ERROR } from '../utils/result';
import { nowIso } from '../utils/id';
import { validateVehicle } from '../utils/validation';
import { isRiderProfile } from './guards';
import { readCollection, STORAGE_KEYS, writeCollection } from './storage';

const all = (): RiderProfile[] => readCollection(STORAGE_KEYS.riderProfiles, isRiderProfile);

export function getRiderProfile(userId: string): RiderProfile | null {
  return all().find((p) => p.userId === userId) ?? null;
}

function upsert(profile: RiderProfile): boolean {
  const others = all().filter((p) => p.userId !== profile.userId);
  return writeCollection(STORAGE_KEYS.riderProfiles, [...others, profile]);
}

/** Empty, offline profile created when a rider account is registered. */
export function createDefaultRiderProfile(userId: string): Result<RiderProfile> {
  const profile: RiderProfile = {
    userId,
    vehicleType: 'standard',
    vehicleMake: '',
    vehicleModel: '',
    vehicleRegistration: '',
    passengerCapacity: RIDE_TYPES.standard.capacity,
    availabilityStatus: 'offline',
    verificationStatus: 'unverified',
    updatedAt: nowIso(),
  };
  return upsert(profile) ? ok(profile) : fail(STORAGE_ERROR);
}

export interface VehicleInput {
  vehicleType: VehicleType;
  vehicleMake: string;
  vehicleModel: string;
  vehicleRegistration: string;
  passengerCapacity: number;
}

export function saveRiderVehicle(userId: string, input: VehicleInput): Result<RiderProfile> {
  const errors = validateVehicle(input);
  const first = Object.keys(errors)[0];
  if (first) return fail(errors[first]);
  const current = getRiderProfile(userId);
  if (!current) return fail('Rider profile not found.');
  const next: RiderProfile = {
    ...current,
    vehicleType: input.vehicleType,
    vehicleMake: input.vehicleMake.trim(),
    vehicleModel: input.vehicleModel.trim(),
    vehicleRegistration: input.vehicleRegistration.trim().toUpperCase(),
    passengerCapacity: input.passengerCapacity,
    updatedAt: nowIso(),
  };
  return upsert(next) ? ok(next) : fail(STORAGE_ERROR);
}

export function getProfileCompletion(profile: RiderProfile): { percent: number; missing: string[] } {
  const checks: Array<[string, boolean]> = [
    ['Vehicle make', profile.vehicleMake.trim() !== ''],
    ['Vehicle model', profile.vehicleModel.trim() !== ''],
    ['Registration number', profile.vehicleRegistration.trim() !== ''],
    ['Passenger capacity', profile.passengerCapacity > 0],
  ];
  const missing = checks.filter(([, done]) => !done).map(([label]) => label);
  return { percent: Math.round(((checks.length - missing.length) / checks.length) * 100), missing };
}

export function setAvailability(userId: string, status: AvailabilityStatus): Result<RiderProfile> {
  const profile = getRiderProfile(userId);
  if (!profile) return fail('Rider profile not found.');
  if (status === 'online' && getProfileCompletion(profile).percent < 100) {
    return fail('Complete your vehicle details before going online.');
  }
  const next: RiderProfile = { ...profile, availabilityStatus: status, updatedAt: nowIso() };
  return upsert(next) ? ok(next) : fail(STORAGE_ERROR);
}

/** Demonstration only. Nothing is checked against a real authority. */
export function markDemoVerified(userId: string): Result<RiderProfile> {
  const profile = getRiderProfile(userId);
  if (!profile) return fail('Rider profile not found.');
  if (getProfileCompletion(profile).percent < 100) return fail('Complete your vehicle details first.');
  const next: RiderProfile = { ...profile, verificationStatus: 'demo_verified', updatedAt: nowIso() };
  return upsert(next) ? ok(next) : fail(STORAGE_ERROR);
}