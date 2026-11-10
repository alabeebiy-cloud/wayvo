import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { PublicUser } from '../types/user';
import { Result } from '../utils/result';
import {
  getCurrentUser, loginUser, logoutUser, registerUser, RegisterInput, updateProfile as updateProfileService,
} from '../services/authService';
import { STORAGE_KEYS, subscribe } from '../services/storage';

export interface AuthContextValue {
  user: PublicUser | null;
  register: (input: RegisterInput, remember?: boolean) => Promise<Result<PublicUser>>;
  login: (email: string, password: string, remember: boolean) => Promise<Result<PublicUser>>;
  logout: () => void;
  updateProfile: (input: { fullName: string; phone: string }) => Result<PublicUser>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The session is restored synchronously from storage, so a refresh never flashes a logged-out state.
  const [user, setUser] = useState<PublicUser | null>(() => getCurrentUser());

  useEffect(() => {
    const sync = () => setUser(getCurrentUser());
    const offSession = subscribe(STORAGE_KEYS.session, sync);
    const offUsers = subscribe(STORAGE_KEYS.users, sync);
    return () => { offSession(); offUsers(); };
  }, []);

  const register = useCallback(async (input: RegisterInput, remember = false) => {
    const result = await registerUser(input, { remember });
    if (result.ok) setUser(result.data);
    return result;
  }, []);

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    const result = await loginUser(email, password, remember);
    if (result.ok) setUser(result.data);
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const updateProfile = useCallback((input: { fullName: string; phone: string }): Result<PublicUser> => {
    if (!user) return { ok: false, error: 'You need to be signed in.' };
    const result = updateProfileService(user.id, input);
    if (result.ok) setUser(result.data);
    return result;
  }, [user]);

  const value = useMemo(() => ({ user, register, login, logout, updateProfile }), [user, register, login, logout, updateProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};