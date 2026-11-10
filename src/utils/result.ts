export type Result<T> = { ok: true; data: T } | { ok: false; error: string };
export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
export const fail = (error: string): Result<never> => ({ ok: false, error });
export const STORAGE_ERROR = 'Could not save your data. Your browser storage may be full or blocked.';