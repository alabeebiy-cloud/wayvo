import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserRole } from '../types/user';
import { useAuth } from '../hooks/useAuth';
import { dashboardPath } from './paths';

/** Allows one role only. Anyone else is sent to their own dashboard. Use inside ProtectedRoute. */
export const RoleRoute: React.FC<{ role: UserRole }> = ({ role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={dashboardPath(user.role)} replace />;
  return <Outlet />;
};