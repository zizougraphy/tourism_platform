import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Menu, X, User as UserIcon, Heart, Calendar, MessageSquare, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const location = useLocation();
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-brand-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span className={cn(
            "text-2xl font-bold tracking-tighter",
            isScrolled || location.pathname !== '/' ? "text-slate-900" : "text-white"
          )}>
            Horizon
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-brand-500',
                isScrolled || location.pathname !== '/' 
                  ? (isActive(link.path) ? 'text-brand-600' : 'text-slate-600')
                  : 'text-white/90'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login">
                <Button variant="ghost" className={cn(
                  isScrolled || location.pathname !== '/' ? "text-slate-600" : "text-white hover:bg-white/10"
                )}>
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Start Journey</Button>
              </Link>
            </>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                id="user-menu-button"
              >
                <span className="text-sm font-bold text-slate-700">{userProfile?.displayName || user.displayName || 'Traveler'}</span>
                {user.photoURL ? (
                  <img src={user.photoURL} className="w-8 h-8 rounded-full border-2 border-white" alt="Profile" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                    {(userProfile?.displayName || user.displayName || 'T')[0]}
                  </div>
                )}
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{userProfile?.role || 'Guest'}</div>
                        <div className="text-sm font-bold truncate">{user.email}</div>
                      </div>
                      
                      {user && (
                        <Link to="/provider" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-brand-500" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                      )}

                      <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 transition-colors">
                        <UserIcon className="w-4 h-4 text-brand-500" />
                        <span className="font-medium">My Profile</span>
                      </Link>
                      <Link to="/bookings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 transition-colors">
                        <Calendar className="w-4 h-4 text-brand-500" />
                        <span className="font-medium">My Bookings</span>
                      </Link>
                      <Link to="/favorites" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 transition-colors">
                        <Heart className="w-4 h-4 text-brand-500" />
                        <span className="font-medium">Favorites</span>
                      </Link>
                      
                      <div className="h-px bg-slate-50 my-1" />
                      
                      <button 
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'text-lg font-medium py-2',
                  isActive(link.path) ? 'text-brand-600' : 'text-slate-600'
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-slate-100 my-2" />
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="secondary" className="w-full">Login</Button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button variant="primary" className="w-full">Register</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
