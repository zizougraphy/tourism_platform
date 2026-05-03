import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Package, PlusCircle, 
  Settings, MessageSquare, BarChart3, 
  Calendar, CreditCard, LogOut, Compass, CircleUser, Map
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Services', icon: Package, path: '/dashboard/services' },
    { name: 'Add Service', icon: PlusCircle, path: '/dashboard/add-service' },
    { name: 'Bookings', icon: Calendar, path: '/dashboard/bookings' },
    { name: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
    { name: 'Profile', icon: CircleUser, path: '/profile' },
  ];

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-brand-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter font-heading text-slate-900 dark:text-white">Horizon</span>
        </Link>
      </div>

      <nav className="flex-grow px-4 pb-8 overflow-y-auto space-y-1">
        <div className="px-4 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Provider Menu
        </div>
        {links.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group',
              location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard')
                ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              location.pathname === item.path ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white"
            )} />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-50 dark:border-slate-800/50">
        <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-600 dark:hover:text-rose-400 transition-all group">
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-600 transition-colors" />
          Logout
        </button>
      </div>
    </aside>
  );
}
