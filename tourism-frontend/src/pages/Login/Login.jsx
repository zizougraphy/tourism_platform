import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Left — decorative panel */}
      <div className={styles.heroPanel}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome Back</h1>
          <p className={styles.heroSubtitle}>
            Sign in to continue your journey and access exclusive curated experiences around the world.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.badge}>🌍 200+ Destinations</span>
            <span className={styles.badge}>⭐ 4.9 Avg Rating</span>
            <span className={styles.badge}>🔒 Secure Booking</span>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className={styles.formPanel}>
        <div className={styles.formWrapper}>
          <Link to="/" className={styles.brand}>🌍 The Horizon</Link>

          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Sign In</h2>
            <p className={styles.formSubtitle}>
              Enter your credentials to access your account
            </p>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="login-email" className={styles.label}>Email Address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="login-password" className={styles.label}>Password</label>
              <input
                id="login-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={styles.input}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.switchLink}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
