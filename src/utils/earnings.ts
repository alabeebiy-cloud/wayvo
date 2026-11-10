import { Booking } from '../types/booking';
import { toDateKey } from './formatDate';

export interface DayTotal {
  /** Local day, e.g. 2026-03-12 */
  date: string;
  total: number;
  trips: number;
}

/**
 * Simulated earnings per day for the last `days` days (oldest first, today last).
 * Only completed trips count. These amounts are not real payments.
 */
export function dailyTotals(completed: Booking[], days: number, now: Date = new Date()): DayTotal[] {
  const result: DayTotal[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = toDateKey(day);
    const rides = completed.filter((b) => b.status === 'completed' && b.completedAt && toDateKey(b.completedAt) === key);
    result.push({ date: key, total: rides.reduce((sum, b) => sum + b.totalFare, 0), trips: rides.length });
  }
  return result;
}