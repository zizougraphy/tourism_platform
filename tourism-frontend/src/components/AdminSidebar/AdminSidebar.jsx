import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard, Users, Briefcase, MapPin,
  CalendarCheck, Star, BarChart3, LogOut, Shield, Sun, Moon
} from 'lucide-react';

const navItems = [
  { name: 'Overview',  path: '/admin',            icon: LayoutDashboard },
  { name: 'Users',     path: '/admin/users',       icon: Users },
  { name: 'Providers', path: '/admin/providers',   icon: Briefcase },
  { name: 'Services',  path: '/admin/services',    icon: MapPin },
  { name: 'Bookings',  path: '/admin/bookings',    icon: CalendarCheck },
  { name: 'Reviews',   path: '/admin/reviews',     icon: Star },
  { name: 'Analytics', path: '/admin/analytics',   icon: BarChart3 },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) =>
    path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(path);

  return (
    <aside className="w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand */}
      <div className="p-8 border-b border-slate-200 dark:border-slate-800">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="bg-rose-600 p-2 rounded-xl">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tighter font-heading text-slate-900 dark:text-white">Admin</span>
            <span className="block text-xs text-slate-400 dark:text-slate-500 font-medium">Control Panel</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-grow p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group',
              isActive(item.path)
                ? 'bg-rose-600/10 dark:bg-rose-600/20 text-rose-600 dark:text-rose-400'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <item.icon className={cn(
              'w-5 h-5 shrink-0',
              isActive(item.path)
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-white'
            )} />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>

        <Link to="/" className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
          ← Back to Horizon
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-rose-950 hover:text-red-600 dark:hover:text-rose-400 transition-all group"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
