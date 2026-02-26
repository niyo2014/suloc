import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SystemProvider, useSystemStatus } from './context/SystemContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useLocation } from 'react-router-dom';

// Lazy loading major modules
const Home = lazy(() => import('./pages/Home'));
const Vehicles = lazy(() => import('./pages/Vehicles'));
const VehicleDetail = lazy(() => import('./pages/VehicleDetail'));
const Login = lazy(() => import('./pages/Login'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminVehicles = lazy(() => import('./components/admin/AdminVehicles'));
const VehicleForm = lazy(() => import('./components/admin/VehicleForm'));
const AdminVisas = lazy(() => import('./pages/admin/AdminVisas'));
const VisaForm = lazy(() => import('./components/admin/VisaForm'));
const Visa = lazy(() => import('./pages/Visa'));
const Logistics = lazy(() => import('./pages/Logistics'));
const AdminLogistics = lazy(() => import('./pages/admin/AdminLogistics'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminPaymentServices = lazy(() => import('./pages/admin/AdminPaymentServices'));
const AdminHero = lazy(() => import('./pages/admin/AdminHero'));
const AdminAbout = lazy(() => import('./pages/admin/AdminAbout'));
const AdminContact = lazy(() => import('./pages/admin/AdminContact'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminSystem = lazy(() => import('./pages/admin/AdminSystem'));
const AdminVisaAssistance = lazy(() => import('./pages/admin/AdminVisaAssistance'));
const AdminVisaAssistanceDetail = lazy(() => import('./pages/admin/AdminVisaAssistanceDetail'));
const MoneyTransfer = lazy(() => import('./pages/MoneyTransfer'));
const VisaAssistance = lazy(() => import('./pages/VisaAssistance'));
const Maintenance = lazy(() => import('./pages/Maintenance'));

// Guard component for Maintenance Mode
const MaintenanceGuard = ({ children }) => {
  const { maintenance_mode, loading: systemLoading } = useSystemStatus();
  const { user } = useAuth();
  const location = useLocation();

  if (systemLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-suloc-blue"></div>
      </div>
    );
  }

  // Allow Creator bypass
  const isCreator = user?.role === 'creator';

  // Always allowed paths (login and status)
  const isExcludedPath = location.pathname === '/login' || location.pathname === '/admin/system';

  if (maintenance_mode && !isCreator && !isExcludedPath) {
    return (
      <Suspense fallback={null}>
        <Maintenance />
      </Suspense>
    );
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SystemProvider>
          <MaintenanceGuard>
            <div className="flex flex-col min-h-screen">
              <Routes>
                {/* Admin Routes (Wrapped in Layout, no Header/Footer from main app) */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-screen bg-gray-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-suloc-blue"></div>
                      </div>
                    }>
                      <AdminLayout />
                    </Suspense>
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/admin/vehicles" replace />} />
                  <Route path="dashboard" element={<Navigate to="/admin/vehicles" replace />} />
                  <Route path="vehicles" element={<AdminVehicles />} />
                  <Route path="vehicles/add" element={<VehicleForm />} />
                  <Route path="vehicles/edit/:id" element={<VehicleForm />} />
                  <Route path="visas" element={<AdminVisas />} />
                  <Route path="visas/add" element={<VisaForm />} />

                  <Route path="visas/edit/:id" element={<VisaForm />} />
                  <Route path="visa-assistance" element={<AdminVisaAssistance />} />
                  <Route path="visa-assistance/:id" element={<AdminVisaAssistanceDetail />} />
                  <Route path="logistics" element={<AdminLogistics />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="payments/services" element={<AdminPaymentServices />} />
                  <Route path="hero" element={<AdminHero />} />
                  <Route path="about" element={<AdminAbout />} />
                  <Route path="contact" element={<AdminContact />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="system" element={<AdminSystem />} />
                </Route>

                {/* Public Routes (With Header/Footer) */}
                <Route path="*" element={
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow">
                      <Suspense fallback={
                        <div className="flex items-center justify-center h-64">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-suloc-gold"></div>
                        </div>
                      }>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/vehicles" element={<Vehicles />} />
                          <Route path="/vehicles/:id" element={<VehicleDetail />} />
                          <Route path="/visa" element={<Visa />} />
                          <Route path="/visa-assistance" element={<VisaAssistance />} />
                          <Route path="/logistics" element={<Logistics />} />
                          <Route path="/money-transfer" element={<MoneyTransfer />} />
                          {/* 404 Redirect */}
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } />
              </Routes>
            </div>
            <ChatWidget />
          </MaintenanceGuard>
        </SystemProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
