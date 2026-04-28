import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader/Loader';
import { useAuth } from '../context/AuthContext';

// Lazy loading pages for performance
const Home = lazy(() => import('../pages/Home/Home'));
const Login = lazy(() => import('../pages/Login/Login'));
const Register = lazy(() => import('../pages/Register/Register'));
const Services = lazy(() => import('../pages/Services/Services'));
const ServiceDetail = lazy(() => import('../pages/ServiceDetail/ServiceDetail'));
const Favorites = lazy(() => import('../pages/Favorites/Favorites'));
const Bookings = lazy(() => import('../pages/Bookings/Bookings'));
const Messages = lazy(() => import('../pages/Messages/Messages'));
const Profile = lazy(() => import('../pages/Profile/Profile'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const ProviderServices = lazy(() => import('../pages/Dashboard/ProviderServices'));
const ProviderBookings = lazy(() => import('../pages/Dashboard/ProviderBookings'));
const AddService = lazy(() => import('../pages/AddService/AddService'));
const EditService = lazy(() => import('../pages/EditService/EditService'));
const About = lazy(() => import('../pages/About/About'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<Loader />}>
      <AnimatePresence mode="wait">
        <Routes location={location}>
          {/* Public Routes with Main Layout */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
          <Route path="/services/:id" element={<MainLayout><ServiceDetail /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />

          {/* Auth Routes - No Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Routes with Main Layout */}
          <Route path="/favorites" element={<ProtectedRoute><MainLayout><Favorites /></MainLayout></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><MainLayout><Bookings /></MainLayout></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MainLayout><Messages /></MainLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />

          {/* Dashboard Routes - Custom Sidebar inside Component */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/add-service" element={<ProtectedRoute><AddService /></ProtectedRoute>} />
          <Route path="/dashboard/edit-service/:id" element={<ProtectedRoute><EditService /></ProtectedRoute>} />
          <Route path="/dashboard/services" element={<ProtectedRoute><ProviderServices /></ProtectedRoute>} />
          <Route path="/dashboard/bookings" element={<ProtectedRoute><ProviderBookings /></ProtectedRoute>} />
          <Route path="/dashboard/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
