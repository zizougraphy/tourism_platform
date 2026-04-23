import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      {/* ── Brand ── */}
      <Link to="/" className={styles.brand}>
        🌍 The Horizon
      </Link>

      {/* ── Navigation links ── */}
      <div className={styles.links}>
        <Link to="/" className={styles.link}>Home</Link>
        <Link to="/services" className={styles.link}>Services</Link>

        {isAuthenticated ? (
          <>
            <Link to="/bookings" className={styles.link}>Bookings</Link>
            <Link to="/favorites" className={styles.link}>Favorites</Link>
            <Link to="/messages" className={styles.link}>Messages</Link>

            {/* Show Dashboard for provider / admin */}
            {(user?.role === 'provider' || user?.role === 'admin') && (
              <Link to="/dashboard" className={styles.link}>Dashboard</Link>
            )}

            <div className={styles.userSection}>
              <span className={styles.greeting}>Hi, {user?.name}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className={styles.authLinks}>
            <Link to="/login" className={styles.link}>Login</Link>
            <Link to="/register" className={styles.registerBtn}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
