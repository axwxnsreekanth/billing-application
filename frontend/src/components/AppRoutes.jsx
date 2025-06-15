import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from '../context/authContext';
import Login from '../pages/LoginPage';

import DashboardLayout from './DashboardLayout';

import BillingScreen from '../pages/BillingPage';
import VehicleMake from '../pages/VehicleMake';
import VehicleModel from '../pages/Vehiclemodel';
// ... other pages

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === null) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes with layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
           <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<BillingScreen />} />
        <Route path="vehicle/make" element={<VehicleMake />} />
        {/* Add rest of routes here */}
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Route>
    </Routes>
  );
}