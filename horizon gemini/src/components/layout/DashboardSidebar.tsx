import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, PlusCircle, 
  Settings, MessageSquare, BarChart3, 
  Calendar, CreditCard, LogOut, Compass
} from 'lucide-react';
import { cn } from '../../lib/utils';

const DashboardSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/provider' },
    { name: 'My Services', icon: Package, path: '/provider/services' },
    { name: 'Add Service', icon: PlusCircle, path: '/provider/add' },
    { name: 'Bookings', icon: Calendar, path: '/provider/bookings' },
    { name: 'Messages', icon: MessageSquare, path: '/provider/messages' },
    { name: 'Analytics', icon: BarChart3, path: '/provider/analytics' },
    { name: 'Payments', icon: CreditCard, path: '/provider/payments' },
    { name: 'Settings', icon: Settings, path: '/provider/settings' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-brand-600 p-2 rounded-xl">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">Horizon</span>
        </Link>
      </div>

      <nav className="flex-grow px-4 pb-8 overflow-y-auto space-y-1">
        <div className="px-4 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Main Menu
        </div>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group',
              location.pathname === item.path 
                ? 'bg-brand-50 text-brand-600' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              location.pathname === item.path ? "text-brand-600" : "text-slate-400 group-hover:text-slate-900"
            )} />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-50">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all group">
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-600" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
