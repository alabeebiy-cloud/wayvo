import { UserRole } from '../types/user';

export const dashboardPath = (role: UserRole): string =>
  role === 'customer' ? '/customer/dashboard' : '/rider/dashboard';

/** Riders go to their profile first so they can add vehicle details. */
export const postRegisterPath = (role: UserRole): string =>
  role === 'customer' ? '/customer/dashboard' : '/rider/profile';

/** A "return to" path is only honoured if it belongs to the user's own area. */
export const safeReturnPath = (from: string | undefined, role: UserRole): string =>
  from && from.indexOf(`/${role}/`) === 0 ? from : dashboardPath(role);