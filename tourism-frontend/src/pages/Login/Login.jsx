import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login({ email, password });
      const role = data.user?.role;
      navigate(role === 'admin' ? '/admin' : role === 'service_provider' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Optional: implementation for real project if available
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">
      {/* Left Wall - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay scale-110"
            alt="Travel background"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-lg space-y-8 text-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20">
              <Compass className="w-10 h-10 text-white" />
            </div>
            <span className="text-4xl font-bold tracking-tighter font-heading">Horizon</span>
          </Link>
          
          <div className="space-y-4">
            <h2 className="text-5xl font-bold leading-tight font-heading">Welcome back to your global journey.</h2>
            <p className="text-brand-100/70 text-xl font-light leading-relaxed">
              Log in to access your curated bookings, saved horizons, and personal travel preferences.
            </p>
          </div>

          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map(i => (
              <img 
                key={i} 
                src={`https://i.pravatar.cc/150?u=${i}`} 
                className="w-12 h-12 rounded-full border-4 border-brand-900" 
                alt="User" 
              />
            ))}
            <div className="w-12 h-12 rounded-full border-4 border-brand-900 bg-brand-400 flex items-center justify-center text-xs font-bold">
              +12K
            </div>
          </div>
          <p className="text-sm font-medium text-brand-200">Joined by 12,000+ premium travelers worldwide.</p>
        </div>
      </div>

      {/* Right Wall - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white dark:bg-slate-950">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm space-y-12"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-heading dark:text-white">Login to Horizon</h1>
            <p className="text-slate-500 dark:text-slate-400">Don't have an account? <Link to="/register" className="text-brand-600 font-bold hover:underline">Register for free</Link></p>
            {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
          </div>

          <form className="space-y-6" onSubmit={handleEmailLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-12 h-14 rounded-2xl border-slate-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-12 h-14 rounded-2xl border-slate-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-right">
                  <button type="button" className="text-sm font-bold text-brand-600 hover:underline">Forgot password?</button>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full h-14 rounded-2xl text-lg font-bold" disabled={loading}>
              {loading ? 'Signining in...' : 'Sign In'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-950 px-4 text-slate-400 dark:text-slate-500 font-bold tracking-wider">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              size="md" 
              className="h-12 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl dark:hover:bg-slate-800"
              onClick={handleGoogleLogin}
              type="button"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" size="md" className="h-12 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl dark:hover:bg-slate-800" type="button">
              <Github className="w-5 h-5 mr-3" />
              Github
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
