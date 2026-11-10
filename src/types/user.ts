export type UserRole = 'customer' | 'rider';

export interface User {
  id: string;
  fullName: string;
  email: string; // stored lowercase, unique
  phone: string;
  role: UserRole;
  passwordHash: string; // DEMO ONLY: not secure authentication
  passwordSalt: string;
  createdAt: string; // ISO date
}

export type PublicUser = Omit<User, 'passwordHash' | 'passwordSalt'>;

export interface Session {
  userId: string;
  createdAt: string;
  remember: boolean;
}