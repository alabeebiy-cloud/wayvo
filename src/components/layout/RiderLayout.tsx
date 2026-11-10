import React from 'react';
import { History, Inbox, LayoutDashboard, Navigation, UserRound, Wallet } from 'lucide-react';
import { DashboardLayout, NavItem } from './DashboardLayout';
import { useBookings } from '../../hooks/useBookings';

export const RiderLayout: React.FC = () => {
  const { pendingRequests, activeRide } = useBookings();
  const icon = 'h-5 w-5';
  const items: NavItem[] = [
    { label: 'Dashboard', to: '/rider/dashboard', icon: <LayoutDashboard className={icon} aria-hidden="true" /> },
    { label: 'Ride requests', to: '/rider/requests', icon: <Inbox className={icon} aria-hidden="true" />, badge: pendingRequests.length },
    // Only shown while a ride is in progress, because the page belongs to that one ride.
    ...(activeRide
      ? [{ label: 'Active ride', to: `/rider/active-ride/${activeRide.id}`, icon: <Navigation className={icon} aria-hidden="true" /> }]
      : []),
    { label: 'Trip history', to: '/rider/history', icon: <History className={icon} aria-hidden="true" /> },
    { label: 'Earnings', to: '/rider/earnings', icon: <Wallet className={icon} aria-hidden="true" /> },
    { label: 'Profile and vehicle', to: '/rider/profile', icon: <UserRound className={icon} aria-hidden="true" /> },
  ];
  return <DashboardLayout items={items} areaLabel="Rider" />;
}; 