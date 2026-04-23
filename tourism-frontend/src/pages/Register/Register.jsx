import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Register.module.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'tourist',
  });
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
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h1 className={styles.heroTitle}>Start Your Journey</h1>
          <p className={styles.heroSubtitle}>
            Create an account to unlock exclusive curated experiences, connect with verified providers, and book with confidence.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.badge}>Curated Experiences</span>
            <span className={styles.badge}>Direct Messaging</span>
            <span className={styles.badge}>Verified Providers</span>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className={styles.formPanel}>
        <div className={styles.formWrapper}>
          <Link to="/" className={styles.brand}>Tourism Platform</Link>

          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Create Account</h2>
            <p className={styles.formSubtitle}>
              Fill in your details to get started
            </p>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="register-name" className={styles.label}>Full Name</label>
              <input
                id="register-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="register-email" className={styles.label}>Email Address</label>
              <input
                id="register-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="register-phone" className={styles.label}>Phone (optional)</label>
                <input
                  id="register-phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+213 555 0123"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="register-role" className={styles.label}>I am a</label>
                <select
                  id="register-role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="tourist">Tourist</option>
                  <option value="provider">Provider</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="register-password" className={styles.label}>Password</label>
              <input
                id="register-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={styles.input}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
