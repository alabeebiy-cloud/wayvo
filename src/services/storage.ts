import { Session } from '../types/user';
import { isSession } from './guards';

export const STORAGE_KEYS = {
  users: 'wayvo_users',
  session: 'wayvo_session',
  riderProfiles: 'wayvo_rider_profiles',
  bookings: 'wayvo_bookings',
  notifications: 'wayvo_notifications',
  settings: 'wayvo_settings',
} as const;

// ---------- change notification ----------
// The browser "storage" event only fires in OTHER tabs, so we also keep an in-tab emitter.
const listeners: Record<string, Set<() => void>> = {};

function notify(key: string): void {
  const set = listeners[key];
  if (set) set.forEach((cb) => cb());
}

/** Calls cb when `key` changes in this tab or in any other tab. Returns an unsubscribe function. */
export function subscribe(key: string, cb: () => void): () => void {
  if (!listeners[key]) listeners[key] = new Set();
  listeners[key].add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === key || e.key === null) cb();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners[key].delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

// ---------- collections ----------
function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Reads an array from storage. Missing, malformed or wrongly-shaped data never crashes the app:
 * bad JSON resets the key to [], and individual records that fail the guard are dropped.
 */
export function readCollection<T>(key: string, guard: (v: unknown) => v is T): T[] {
  const raw = safeGet(key);
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Expected an array');
    const valid = parsed.filter(guard);
    if (valid.length !== parsed.length) {
      console.warn(`[Wayvo] Dropped ${parsed.length - valid.length} invalid record(s) from ${key}.`);
    }
    return valid;
  } catch {
    console.warn(`[Wayvo] Stored data for ${key} was unreadable and has been reset.`);
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* storage unavailable */
    }
    return [];
  }
}

/** Returns false when storage is full or blocked. */
export function writeCollection<T>(key: string, data: T[]): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
    notify(key);
    return true;
  } catch (err) {
    console.error(`[Wayvo] Could not write ${key}`, err);
    return false;
  }
}

// ---------- session ----------
// "Remember me" keeps the session in localStorage; otherwise it lives in sessionStorage (ends with the tab).
export function readSession(): Session | null {
  const stores: Storage[] = [];
  try {
    stores.push(window.localStorage, window.sessionStorage);
  } catch {
    return null;
  }
  for (const store of stores) {
    try {
      const raw = store.getItem(STORAGE_KEYS.session);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isSession(parsed)) return parsed;
        store.removeItem(STORAGE_KEYS.session);
      }
    } catch {
      try {
        store.removeItem(STORAGE_KEYS.session);
      } catch {
        /* ignore */
      }
    }
  }
  return null;
}

export function writeSession(session: Session): boolean {
  try {
    clearSession();
    const store = session.remember ? window.localStorage : window.sessionStorage;
    store.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    notify(STORAGE_KEYS.session);
    return true;
  } catch {
    return false;
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.session);
    window.sessionStorage.removeItem(STORAGE_KEYS.session);
  } catch {
    /* ignore */
  }
  notify(STORAGE_KEYS.session);
}

// ---------- settings ----------
export interface Settings {
  seeded: boolean;
  version: number;
}
const DEFAULT_SETTINGS: Settings = { seeded: false, version: 1 };

export function readSettings(): Settings {
  const raw = safeGet(STORAGE_KEYS.settings);
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    const p = JSON.parse(raw) as Partial<Settings>;
    return { seeded: p.seeded === true, version: typeof p.version === 'number' ? p.version : 1 };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function writeSettings(settings: Settings): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}