import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon, Heart, Calendar, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  // On home page and not scrolled = transparent bg with white text
  const isHeroOverlay = location.pathname === '/' && !isScrolled;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm dark:bg-slate-900/80 dark:shadow-slate-950/20'
          : 'bg-transparent'
      )}
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo — Text only */}
        <Link to="/" className="flex items-center group shrink-0">
          <span className={cn(
            "text-2xl font-bold tracking-tighter font-heading transition-colors",
            isHeroOverlay
              ? "text-white"
              : "text-slate-900 dark:text-white"
          )}>
            Horizon
          </span>
        </Link>

        {/* Desktop Links — centered */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-brand-500',
                isHeroOverlay
                  ? 'text-white/90'
                  : (isActive(link.path) ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300')
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side: theme toggle + auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-full transition-colors cursor-pointer",
              isHeroOverlay
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
            )}
            aria-label="Toggle theme"
            id="theme-toggle-button"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button variant="ghost" className={cn(
                  isHeroOverlay ? "text-white hover:bg-white/10" : "text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
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
                className="flex items-center gap-2 p-1 pl-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                id="user-menu-button"
              >
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{user?.name || 'Traveler'}</span>
                {user?.photoURL ? (
                  <img src={user.photoURL} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-700" alt="Profile" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-700">
                    {(user?.name || 'T')[0].toUpperCase()}
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
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-700 mb-1">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user?.role === 'service_provider' ? 'Provider' : 'Guest'}</div>
                        <div className="text-sm font-bold truncate text-slate-700 dark:text-slate-200">{user?.email}</div>
                      </div>
                      
                      {user?.role === 'service_provider' && (
                        <Link to="/dashboard" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-brand-500" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                      )}

                      <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors">
                        <UserIcon className="w-4 h-4 text-brand-500" />
                        <span className="font-medium">My Profile</span>
                      </Link>
                      {user?.role !== 'service_provider' && (
                        <>
                          <Link to="/bookings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors">
                            <Calendar className="w-4 h-4 text-brand-500" />
                            <span className="font-medium">My Bookings</span>
                          </Link>
                          <Link to="/favorites" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors">
                            <Heart className="w-4 h-4 text-brand-500" />
                            <span className="font-medium">Favorites</span>
                          </Link>
                        </>
                      )}
                      
                      <div className="h-px bg-slate-50 dark:bg-slate-700 my-1" />
                      
                      <button 
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition-colors cursor-pointer"
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

        {/* Mobile: theme toggle + menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-lg cursor-pointer",
              isHeroOverlay ? "text-white" : "text-slate-900 dark:text-white"
            )}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            className={cn("p-2 rounded-lg cursor-pointer", isHeroOverlay ? "text-white" : "text-slate-900 dark:text-white")}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-xl p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'text-lg font-medium py-2',
                  isActive(link.path) ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300'
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="secondary" className="w-full dark:bg-slate-800 dark:text-slate-100">Login</Button>
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
