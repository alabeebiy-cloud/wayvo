import React from 'react';
import { Bell, CarFront, History, LayoutDashboard, UserRound } from 'lucide-react';
import { DashboardLayout, NavItem } from './DashboardLayout';
import { useNotifications } from '../../hooks/useNotifications';

export const CustomerLayout: React.FC = () => {
  const { unreadCount } = useNotifications();
  const icon = 'h-5 w-5';
  const items: NavItem[] = [
    { label: 'Dashboard', short: 'Home', to: '/customer/dashboard', icon: <LayoutDashboard className={icon} aria-hidden="true" /> },
    { label: 'Book a ride', short: 'Book', to: '/customer/book', icon: <CarFront className={icon} aria-hidden="true" /> },
    { label: 'My rides', short: 'Rides', to: '/customer/history', icon: <History className={icon} aria-hidden="true" /> },
    { label: 'Notifications', short: 'Alerts', to: '/customer/notifications', icon: <Bell className={icon} aria-hidden="true" />, badge: unreadCount },
    { label: 'Profile', short: 'Profile', to: '/customer/profile', icon: <UserRound className={icon} aria-hidden="true" /> },
  ];
  return <DashboardLayout items={items} areaLabel="Customer" />;
};
