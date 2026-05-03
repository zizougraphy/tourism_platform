import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader/Loader';
import { useAuth } from '../context/AuthContext';

// Lazy loading pages for performance
const Home            = lazy(() => import('../pages/Home/Home'));
const Login           = lazy(() => import('../pages/Login/Login'));
const Register        = lazy(() => import('../pages/Register/Register'));
const Services        = lazy(() => import('../pages/Services/Services'));
const ServiceDetail   = lazy(() => import('../pages/ServiceDetail/ServiceDetail'));
const Favorites       = lazy(() => import('../pages/Favorites/Favorites'));
const Bookings        = lazy(() => import('../pages/Bookings/Bookings'));
const Messages        = lazy(() => import('../pages/Messages/Messages'));
const Profile         = lazy(() => import('../pages/Profile/Profile'));
const Dashboard       = lazy(() => import('../pages/Dashboard/Dashboard'));
const ProviderServices= lazy(() => import('../pages/Dashboard/ProviderServices'));
const ProviderBookings= lazy(() => import('../pages/Dashboard/ProviderBookings'));
const AddService      = lazy(() => import('../pages/AddService/AddService'));
const EditService     = lazy(() => import('../pages/EditService/EditService'));
const About           = lazy(() => import('../pages/About/About'));
const NotFound        = lazy(() => import('../pages/NotFound/NotFound'));

// Admin pages
const AdminDashboard  = lazy(() => import('../pages/Admin/AdminDashboard'));
const AdminUsers      = lazy(() => import('../pages/Admin/AdminUsers'));
const AdminProviders  = lazy(() => import('../pages/Admin/AdminProviders'));
const AdminServices   = lazy(() => import('../pages/Admin/AdminServices'));
const AdminBookings   = lazy(() => import('../pages/Admin/AdminBookings'));
const AdminReviews    = lazy(() => import('../pages/Admin/AdminReviews'));
const AdminAnalytics  = lazy(() => import('../pages/Admin/AdminAnalytics'));

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

/** Redirect to /login if not authenticated */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

/** Redirect to / if not an admin */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<Loader />}>
      <AnimatePresence mode="wait">
        <Routes location={location}>
          {/* Public Routes with Main Layout */}
          <Route path="/"           element={<MainLayout><Home /></MainLayout>} />
          <Route path="/services"   element={<MainLayout><Services /></MainLayout>} />
          <Route path="/services/:id" element={<MainLayout><ServiceDetail /></MainLayout>} />
          <Route path="/about"      element={<MainLayout><About /></MainLayout>} />

          {/* Auth Routes - No Layout */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Routes with Main Layout */}
          <Route path="/favorites" element={<ProtectedRoute><MainLayout><Favorites /></MainLayout></ProtectedRoute>} />
          <Route path="/bookings"  element={<ProtectedRoute><MainLayout><Bookings /></MainLayout></ProtectedRoute>} />
          <Route path="/messages"  element={<ProtectedRoute><MainLayout><Messages /></MainLayout></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />

          {/* Provider Dashboard Routes */}
          <Route path="/dashboard"                        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/add-service"            element={<ProtectedRoute><AddService /></ProtectedRoute>} />
          <Route path="/dashboard/edit-service/:id"       element={<ProtectedRoute><EditService /></ProtectedRoute>} />
          <Route path="/dashboard/services"               element={<ProtectedRoute><ProviderServices /></ProtectedRoute>} />
          <Route path="/dashboard/bookings"               element={<ProtectedRoute><ProviderBookings /></ProtectedRoute>} />
          <Route path="/dashboard/messages"               element={<ProtectedRoute><Messages /></ProtectedRoute>} />

          {/* Admin Routes — role='admin' required */}
          <Route path="/admin"            element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users"      element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/providers"  element={<AdminRoute><AdminProviders /></AdminRoute>} />
          <Route path="/admin/services"   element={<AdminRoute><AdminServices /></AdminRoute>} />
          <Route path="/admin/bookings"   element={<AdminRoute><AdminBookings /></AdminRoute>} />
          <Route path="/admin/reviews"    element={<AdminRoute><AdminReviews /></AdminRoute>} />
          <Route path="/admin/analytics"  element={<AdminRoute><AdminAnalytics /></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
