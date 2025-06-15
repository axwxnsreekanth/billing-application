import '../src/custom.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './components';
import { AuthProvider, useAuth } from './context/authContext';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/LoginPage';
import Dashboard from './pages/DashBoard';
import BillingScreen from './pages/BillingPage';
import VehicleMake from './pages/VehicleMake';
import VehicleModel from './pages/Vehiclemodel';
import CategoryScreen from './pages/CategoryScreen';
import ItemScreen from './pages/ItemScreen';
import BillReport from './pages/BillReport';
import StockEntry from './pages/StockEntry';
import StockEdit from './pages/StockEdit';
import StockDetails from './pages/StockDetails';
import LabourReport from './pages/LabourReport';
import BillReturn from './pages/BillReturn';
import BillReturnReport from './pages/BillReturnReport';
import SidebarLayout from './components/SideBarLayout';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const location = useLocation();
  const { logout } = useAuth();

  const isLogin = location.pathname === '/login';

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bill" element={<BillingScreen />} />
          <Route path="billreturn" element={<BillReturn />} />

          <Route path="vehicle/make" element={<VehicleMake />} />
          <Route path="vehicle/model" element={<VehicleModel />} />
          <Route path="category" element={<CategoryScreen />} />
          <Route path="item" element={<ItemScreen />} />
          <Route path="reports/bill" element={<BillReport />} />
          <Route path="reports/billreturn" element={<BillReturnReport />} />
          <Route path="reports/labour" element={<LabourReport />} />
          <Route path="stock/add" element={<StockEntry />} />
          <Route path="stock/edit" element={<StockEdit />} />
          <Route path="stock/view" element={<StockDetails />} />
          {/* ...other nested routes */}
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>

        <Router>
          <AppRoutes />
        </Router>

      </AuthProvider>
    </ToastProvider>
  );
}
