import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Users, Calendar, 
  DollarSign, ArrowUpRight, ArrowDownRight,
  MoreVertical, Star
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import Sidebar from '../../components/Sidebar/Sidebar';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import * as api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getBookings().catch(() => ({ data: [] })),
      api.getProviderServices().catch(() => ({ data: [] }))
    ]).then(([bookingsRes, servicesRes]) => {
      setBookings(bookingsRes.data.data || bookingsRes.data.bookings || (Array.isArray(bookingsRes.data) ? bookingsRes.data : []));
      setServices(servicesRes.data.data || servicesRes.data.services || (Array.isArray(servicesRes.data) ? servicesRes.data : []));
    }).finally(() => setLoading(false));
  }, []);

  const totalRevenue = bookings.reduce((s, b) => s + (Number(b.total_price || b.price) || 0), 0);
  const activeBookings = bookings.filter(b => b.status !== 'cancelled').length;
  
  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', isUp: true, icon: DollarSign },
    { label: 'Active Bookings', value: String(activeBookings), change: '+8.2%', isUp: true, icon: Calendar },
    { label: 'My Services', value: String(services.length), change: '+3.1%', isUp: true, icon: Users },
    { label: 'Avg Rating', value: '4.85', change: '+0.1%', isUp: true, icon: Star },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      
      <main className="flex-grow p-8 md:p-12 space-y-10">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-heading">Dashboard Overview</h1>
            <p className="text-slate-500">Welcome back, {user?.name || 'Provider'}. Here's what's happening today.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">Download Report</Button>
            <Link to="/dashboard/add-service">
              <Button variant="primary">Add New Service</Button>
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 border-none shadow-sm space-y-4 rounded-3xl">
                <div className="flex justify-between items-start">
                  <div className="bg-brand-50 p-3 rounded-2xl">
                    <stat.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div className={cn(
                    "flex items-center text-xs font-bold px-2 py-1 rounded-lg",
                    stat.isUp ? "bg-green-50 text-green-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {stat.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                  <div className="text-3xl font-bold tracking-tight font-heading">{stat.value}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-3 p-8 border-none shadow-sm space-y-8 rounded-3xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl font-heading">Recent Activity</h3>
              <Link to="/dashboard/bookings">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>

            <div className="space-y-6">
              {bookings.slice(0, 5).map((booking, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-colors">
                  <img src={`https://ui-avatars.com/api/?name=${booking.service_name || 'Service'}&background=random`} className="w-10 h-10 rounded-full" alt="Service" />
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-sm tracking-tight">
                        {booking.service_name || `Service #${booking.service_id}`} 
                        <span className="text-slate-400 font-normal ml-2">by {booking.tourist_name || 'Guest'}</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">${booking.total_price || booking.price || '0'}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-slate-400 font-medium">Status: <span className={booking.status === 'confirmed' ? 'text-green-500' : 'text-amber-500'}>{booking.status}</span></div>
                      <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{booking.check_in_date || booking.created_at ? new Date(booking.check_in_date || booking.created_at).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && !loading && (
                <div className="text-center text-slate-500 py-8">No recent bookings</div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
