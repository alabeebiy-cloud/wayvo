import { RideType } from '../types/booking';
import { AVERAGE_SPEED_KMH, MIN_DURATION_MINUTES, RIDE_TYPES } from '../config/pricing.config';

export interface FareBreakdown {
  rideType: RideType;
  distanceKm: number;
  baseFare: number;
  pricePerKm: number;
  distanceFare: number;
  total: number;
}

/**
 * Total fare = base fare + (distance in km x price per km).
 * Rounding policy: the distance charge is rounded to the nearest whole naira; the base fare is already whole.
 * Throws if the distance is not a positive finite number.
 */
export function calculateFare(rideType: RideType, distanceKm: number): FareBreakdown {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    throw new Error('Distance must be a positive number.');
  }
  const config = RIDE_TYPES[rideType];
  const distanceFare = Math.round(distanceKm * config.pricePerKm);
  return {
    rideType,
    distanceKm,
    baseFare: config.baseFare,
    pricePerKm: config.pricePerKm,
    distanceFare,
    total: config.baseFare + distanceFare,
  };
}

/** City driving for the first 30 km, then faster highway speed for the rest of a long trip. */
const CITY_LIMIT_KM = 30;
const HIGHWAY_SPEED_KMH = 60;

export function estimateDurationMinutes(distanceKm: number): number {
  const cityKm = Math.min(distanceKm, CITY_LIMIT_KM);
  const highwayKm = Math.max(0, distanceKm - CITY_LIMIT_KM);
  const hours = cityKm / AVERAGE_SPEED_KMH + highwayKm / HIGHWAY_SPEED_KMH;
  return Math.max(MIN_DURATION_MINUTES, Math.round(hours * 60));
}