import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import * as React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DestinationsPage from './pages/DestinationsPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import BookingsPage from './pages/BookingsPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/provider/DashboardPage';
import AddServicePage from './pages/provider/AddServicePage';
import EditServicePage from './pages/provider/EditServicePage';
import AnalyticsPage from './pages/provider/AnalyticsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './contexts/AuthContext';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isDashboard = location.pathname.startsWith('/provider');

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!isAuthPage && !isDashboard && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Provider Routes */}
          <Route path="/provider" element={<DashboardPage />} />
          <Route path="/provider/add" element={<AddServicePage />} />
          <Route path="/provider/edit/:id" element={<EditServicePage />} />
          <Route path="/provider/analytics" element={<AnalyticsPage />} />
          
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAuthPage && !isDashboard && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
