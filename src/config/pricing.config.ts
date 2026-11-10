import { RideType } from '../types/booking';

export interface RideTypeConfig {
  id: RideType;
  label: string;
  description: string;
  baseFare: number; // NGN
  pricePerKm: number; // NGN
  capacity: number;
}

/** Demonstration prices. Change them here and the whole app follows. */
export const RIDE_TYPES: Record<RideType, RideTypeConfig> = {
  standard: {
    id: 'standard',
    label: 'Standard',
    description: 'Affordable everyday rides.',
    baseFare: 500,
    pricePerKm: 200,
    capacity: 4,
  },
  comfort: {
    id: 'comfort',
    label: 'Comfort',
    description: 'Newer cars with extra legroom.',
    baseFare: 800,
    pricePerKm: 300,
    capacity: 4,
  },
  xl: {
    id: 'xl',
    label: 'XL',
    description: 'Space for bigger groups and luggage.',
    baseFare: 1200,
    pricePerKm: 400,
    capacity: 6,
  },
};

export const RIDE_TYPE_LIST: RideTypeConfig[] = [RIDE_TYPES.standard, RIDE_TYPES.comfort, RIDE_TYPES.xl];

/** Used to turn a distance into an estimated duration (city traffic). */
export const AVERAGE_SPEED_KMH = 25;
export const MIN_DURATION_MINUTES = 3;

export function isRideType(value: unknown): value is RideType {
  return value === 'standard' || value === 'comfort' || value === 'xl';
}