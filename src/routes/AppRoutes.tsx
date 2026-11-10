import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { PlaceholderPage } from '../components/layout/PlaceholderPage';
import { PublicLayout } from '../components/layout/PublicLayout';
import { RiderLayout } from '../components/layout/RiderLayout';
import Login from '../pages/auth/Login'; 
import Register from '../pages/auth/Register';
import BookRide from '../pages/customer/BookRide';
import CustomerDashboard from '../pages/customer/Dashboard';
import Home from '../pages/public/Home';
import HowItWorks from '../pages/public/HowItWorks';
import NotFound from '../pages/public/NotFound';
import RideOptions from '../pages/public/RideOptions';
import ActiveRide from '../pages/rider/ActiveRide';
import RiderDashboard from '../pages/rider/Dashboard';
import Earnings from '../pages/rider/Earnings';
import RiderHistory from '../pages/rider/History';
import RiderProfile from '../pages/rider/Profile';
import RideRequests from '../pages/rider/Requests';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/ride-options" element={<RideOptions />} />
      <Route path="/help" element={<Navigate to="/#help" replace />} />
      <Route path="*" element={<NotFound />} />
    </Route>

    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<RoleRoute role="customer" />}>
        <Route element={<CustomerLayout />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/book" element={<BookRide />} />
          <Route path="/customer/bookings/:bookingId" element={<PlaceholderPage title="Booking details" stage={5} />} />
          <Route path="/customer/history" element={<PlaceholderPage title="Ride history" stage={5} />} />
          <Route path="/customer/profile" element={<PlaceholderPage title="Profile" stage={5} />} />
          <Route path="/customer/notifications" element={<PlaceholderPage title="Notifications" stage={5} />} />
        </Route>
      </Route>

      <Route element={<RoleRoute role="rider" />}>
        <Route element={<RiderLayout />}>
          <Route path="/rider/dashboard" element={<RiderDashboard />} />
          <Route path="/rider/requests" element={<RideRequests />} />
          <Route path="/rider/active-ride/:bookingId" element={<ActiveRide />} />
          <Route path="/rider/history" element={<RiderHistory />} />
          <Route path="/rider/earnings" element={<Earnings />} />
          <Route path="/rider/profile" element={<RiderProfile />} />
        </Route>
      </Route>
    </Route>
  </Routes>
);