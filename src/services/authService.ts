/**
 * DEMONSTRATION AUTHENTICATION ONLY.
 * Accounts live in this browser's localStorage. Hashing the password with a salt avoids storing plaintext,
 * but anyone with access to the browser can read or edit this data. This is NOT secure authentication.
 */
import { PublicUser, User, UserRole } from '../types/user';
import { fail, ok, Result, STORAGE_ERROR } from '../utils/result';
import { generateId, nowIso } from '../utils/id';
import { validateLogin, validateProfile, validateRegistration } from '../utils/validation';
import { isUser } from './guards';
import { createDefaultRiderProfile } from './riderService';
import { clearSession, readSession, readCollection, STORAGE_KEYS, writeCollection, writeSession } from './storage';

const allUsers = (): User[] => readCollection(STORAGE_KEYS.users, isUser);

export function toPublic(user: User): PublicUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

async function sha256Hex(text: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for insecure contexts (plain http). Even weaker. Demo only.
  let h = 5381;
  for (let i = 0; i < text.length; i += 1) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return 'fallback-' + (h >>> 0).toString(16);
}

const hashPassword = (password: string, salt: string): Promise<string> => sha256Hex(`${salt}:${password}`);

export interface RegisterInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole | '';
  acceptedTerms: boolean;
}

export interface RegisterOptions {
  remember?: boolean;
  /** Set false to create the account without signing in (used by demo seeding). */
  startSession?: boolean;
}

export async function registerUser(input: RegisterInput, options: RegisterOptions = {}): Promise<Result<PublicUser>> {
  const errors = validateRegistration(input);
  const firstError = Object.keys(errors)[0];
  if (firstError) return fail(errors[firstError]);
  if (input.role === '') return fail('Choose an account type.');

  const email = input.email.trim().toLowerCase();
  const users = allUsers();
  if (users.some((u) => u.email === email)) {
    return fail('An account with this email already exists. Log in instead.');
  }

  const salt = generateId();
  const user: User = {
    id: generateId(),
    fullName: input.fullName.trim(),
    email,
    phone: input.phone.replace(/[\s-]/g, ''),
    role: input.role,
    passwordSalt: salt,
    passwordHash: await hashPassword(input.password, salt),
    createdAt: nowIso(),
  };
  if (!writeCollection(STORAGE_KEYS.users, [...users, user])) return fail(STORAGE_ERROR);

  if (user.role === 'rider') {
    const profile = createDefaultRiderProfile(user.id);
    if (!profile.ok) return fail(profile.error);
  }
  if (options.startSession !== false) {
    writeSession({ userId: user.id, createdAt: nowIso(), remember: options.remember === true });
  }
  return ok(toPublic(user));
}

export async function loginUser(email: string, password: string, remember: boolean): Promise<Result<PublicUser>> {
  const errors = validateLogin({ email, password });
  const firstError = Object.keys(errors)[0];
  if (firstError) return fail(errors[firstError]);

  const user = allUsers().find((u) => u.email === email.trim().toLowerCase());
  const genericError = 'Email or password is incorrect.';
  if (!user) return fail(genericError);
  const hash = await hashPassword(password, user.passwordSalt);
  if (hash !== user.passwordHash) return fail(genericError);

  if (!writeSession({ userId: user.id, createdAt: nowIso(), remember })) return fail(STORAGE_ERROR);
  return ok(toPublic(user));
}

export function logoutUser(): void {
  clearSession();
}

export function getUserById(id: string): PublicUser | null {
  const user = allUsers().find((u) => u.id === id);
  return user ? toPublic(user) : null;
}

/** Restores the signed-in user from the stored session, or null (and clears stale sessions). */
export function getCurrentUser(): PublicUser | null {
  const session = readSession();
  if (!session) return null;
  const user = getUserById(session.userId);
  if (!user) clearSession();
  return user;
}

/** Only name and phone can change. Email and role are never editable here. */
export function updateProfile(userId: string, input: { fullName: string; phone: string }): Result<PublicUser> {
  const errors = validateProfile(input);
  const firstError = Object.keys(errors)[0];
  if (firstError) return fail(errors[firstError]);
  const users = allUsers();
  const target = users.find((u) => u.id === userId);
  if (!target) return fail('Account not found.');
  const updated: User = { ...target, fullName: input.fullName.trim(), phone: input.phone.replace(/[\s-]/g, '') };
  const next = users.map((u) => (u.id === userId ? updated : u));
  return writeCollection(STORAGE_KEYS.users, next) ? ok(toPublic(updated)) : fail(STORAGE_ERROR);
}