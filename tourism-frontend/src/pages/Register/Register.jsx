import { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Mail, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [role, setRole] = useState('tourist');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await register({ name, email, password, role });
      navigate(data.user?.role === 'service_provider' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">
      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white dark:bg-slate-950 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm space-y-10 py-12"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-heading dark:text-white">Create your account</h1>
            <p className="text-slate-500 dark:text-slate-400">Already have an account? <Link to="/login" className="text-brand-600 font-bold hover:underline">Sign in</Link></p>
            {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
          </div>

          <div className="space-y-6">
            {/* Role Selector */}
            <div className="flex p-1 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setRole('tourist')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                  role === 'tourist' ? 'bg-white dark:bg-slate-800 shadow-sm text-brand-600 dark:text-brand-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <User className="w-4 h-4" />
                Tourist
              </button>
              <button 
                onClick={() => setRole('service_provider')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                  role === 'service_provider' ? 'bg-white dark:bg-slate-800 shadow-sm text-brand-600 dark:text-brand-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Provider
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleRegister}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    placeholder="John Doe" 
                    className="pl-12 h-14 rounded-2xl" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-12 h-14 rounded-2xl" 
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
                    className="pl-12 h-14 rounded-2xl" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500" required />
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
                  I agree to the <a href="#" className="font-bold text-slate-700 dark:text-slate-300 hover:underline">Terms of Service</a> and <a href="#" className="font-bold text-slate-700 dark:text-slate-300 hover:underline">Privacy Policy</a>.
                </p>
              </div>

              <Button size="lg" className="w-full h-14 rounded-2xl text-lg font-bold" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Image Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0 text-white">
          <img 
            src="https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay scale-110"
            alt="Travel background"
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-brand-900/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-lg space-y-8 text-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20">
              <Compass className="w-10 h-10 text-white" />
            </div>
            <span className="text-4xl font-bold tracking-tighter font-heading">Horizon</span>
          </Link>
          
          <div className="space-y-4">
            <h2 className="text-5xl font-bold leading-tight font-heading">Join the world's most elite travel network.</h2>
            <p className="text-brand-100/70 text-xl font-light leading-relaxed">
              Unlock exclusive destinations, manage your provider dashboard, and connect with millions of luxury travelers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold text-brand-400 font-heading">50K+</div>
              <div className="text-sm text-brand-100/60 uppercase tracking-widest font-bold">Travelers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-400 font-heading">120+</div>
              <div className="text-sm text-brand-100/60 uppercase tracking-widest font-bold">Destinations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
