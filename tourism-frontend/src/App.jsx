import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';

import Home          from './pages/Home/Home';
import Login         from './pages/Login/Login';
import Register      from './pages/Register/Register';
import Services      from './pages/Services/Services';
import ServiceDetail from './pages/ServiceDetail/ServiceDetail';
import Bookings      from './pages/Bookings/Bookings';
import Favorites     from './pages/Favorites/Favorites';
import Messages      from './pages/Messages/Messages';
import Dashboard     from './pages/Dashboard/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes — accessible by anyone */}
          <Route path="/"             element={<Home />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/services"     element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />

          {/* Protected — requires login */}
          <Route path="/bookings"  element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/messages"  element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
