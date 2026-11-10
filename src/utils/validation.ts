import { UserRole } from '../types/user';

export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^(?:\+234|234|0)\d{10}$/;
const REG_RE = /^[A-Za-z0-9 -]{5,12}$/;

export const MIN_PASSWORD_LENGTH = 8;

export function validateFullName(v: string): string | null {
  const t = v.trim();
  if (!t) return 'Enter your full name.';
  if (t.length < 2 || !/[A-Za-z]/.test(t)) return 'Enter a valid name.';
  return null;
}

export function validateEmail(v: string): string | null {
  const t = v.trim();
  if (!t) return 'Enter your email address.';
  if (!EMAIL_RE.test(t)) return 'Enter a valid email address, like name@example.com.';
  return null;
}

export function validatePhone(v: string): string | null {
  const t = v.replace(/[\s-]/g, '');
  if (!t) return 'Enter your phone number.';
  if (!PHONE_RE.test(t)) return 'Enter a valid Nigerian number, like 0801 234 5678.';
  return null;
}

export function validatePassword(v: string): string | null {
  if (!v) return 'Enter a password.';
  if (v.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  return null;
}

function collect(entries: Array<[string, string | null]>): FieldErrors {
  const errors: FieldErrors = {};
  entries.forEach(([field, message]) => {
    if (message) errors[field] = message;
  });
  return errors;
}

export interface RegistrationValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole | '';
  acceptedTerms: boolean;
}

export function validateRegistration(v: RegistrationValues): FieldErrors {
  return collect([
    ['fullName', validateFullName(v.fullName)],
    ['email', validateEmail(v.email)],
    ['phone', validatePhone(v.phone)],
    ['password', validatePassword(v.password)],
    ['confirmPassword', !v.confirmPassword ? 'Confirm your password.' : v.password !== v.confirmPassword ? 'Passwords do not match.' : null],
    ['role', v.role ? null : 'Choose an account type.'],
    ['acceptedTerms', v.acceptedTerms ? null : 'Accept the terms to continue.'],
  ]);
}

export function validateLogin(v: { email: string; password: string }): FieldErrors {
  return collect([
    ['email', validateEmail(v.email)],
    ['password', v.password ? null : 'Enter your password.'],
  ]);
}

export function validateProfile(v: { fullName: string; phone: string }): FieldErrors {
  return collect([
    ['fullName', validateFullName(v.fullName)],
    ['phone', validatePhone(v.phone)],
  ]);
}

export interface VehicleValues {
  vehicleMake: string;
  vehicleModel: string;
  vehicleRegistration: string;
  passengerCapacity: number;
}

export function validateVehicle(v: VehicleValues): FieldErrors {
  return collect([
    ['vehicleMake', v.vehicleMake.trim() ? null : 'Enter the vehicle make.'],
    ['vehicleModel', v.vehicleModel.trim() ? null : 'Enter the vehicle model.'],
    ['vehicleRegistration', !v.vehicleRegistration.trim() ? 'Enter the registration number.' : !REG_RE.test(v.vehicleRegistration.trim()) ? 'Use 5 to 12 letters, numbers, spaces or dashes.' : null],
    ['passengerCapacity', Number.isInteger(v.passengerCapacity) && v.passengerCapacity >= 1 && v.passengerCapacity <= 8 ? null : 'Enter a capacity from 1 to 8.'],
  ]);
}

export function validateContact(v: { name: string; email: string; message: string }): FieldErrors {
  return collect([
    ['name', validateFullName(v.name)],
    ['email', validateEmail(v.email)],
    ['message', v.message.trim().length >= 10 ? null : 'Write at least 10 characters.'],
  ]);
}