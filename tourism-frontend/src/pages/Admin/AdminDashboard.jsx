import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, MapPin, CalendarCheck, DollarSign, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import * as api from '../../api/axios';
import { cn } from '../../lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminStats()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Users',      value: stats.total_users,           icon: Users,         color: 'text-blue-500',    bg: 'bg-blue-500/10' },
    { label: 'Active Providers', value: stats.total_providers,       icon: Briefcase,     color: 'text-violet-500',  bg: 'bg-violet-500/10' },
    { label: 'Active Services',  value: stats.total_active_services, icon: MapPin,        color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Bookings',   value: stats.total_bookings,        icon: CalendarCheck, color: 'text-amber-500',   bg: 'bg-amber-500/10' },
    { label: 'Revenue',          value: `$${Number(stats.total_revenue).toLocaleString()}`, icon: DollarSign, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ] : [];

  const statusConfig = {
    pending:   { icon: Clock,       color: 'text-amber-500', bg: 'bg-amber-500/10',  label: 'Pending' },
    confirmed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-500/10',  label: 'Confirmed' },
    cancelled: { icon: XCircle,     color: 'text-red-500',   bg: 'bg-red-500/10',    label: 'Cancelled' },
    completed: { icon: CheckCircle, color: 'text-blue-600',  bg: 'bg-blue-500/10',   label: 'Completed' },
  };

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <AdminSidebar />
      <main className="flex-grow p-8 md:p-12 space-y-10 overflow-auto">
        <header>
          <h1 className="text-3xl font-bold tracking-tight font-heading text-slate-900 dark:text-white">Platform Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time visibility across all platform entities.</p>
        </header>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-900 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {statCards.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Card className="p-6 border border-slate-200 dark:border-transparent shadow-sm rounded-3xl bg-white dark:bg-slate-900">
                  <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center mb-4', stat.bg)}>
                    <stat.icon className={cn('w-5 h-5', stat.color)} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white font-heading">{stat.value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Booking Status Breakdown */}
        {stats?.bookings_by_status?.length > 0 && (
          <Card className="p-8 border border-slate-200 dark:border-transparent shadow-sm rounded-3xl bg-white dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 font-heading">Booking Status Breakdown</h2>
            <div className="flex flex-wrap gap-4">
              {stats.bookings_by_status.map(bs => {
                const cfg = statusConfig[bs.status] || { icon: Clock, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', label: bs.status };
                const Ic = cfg.icon;
                return (
                  <div key={bs.status} className={cn('flex items-center gap-3 px-5 py-3 rounded-2xl', cfg.bg)}>
                    <Ic className={cn('w-4 h-4', cfg.color)} />
                    <span className={cn('font-bold capitalize text-sm', cfg.color)}>{cfg.label}</span>
                    <span className="text-slate-900 dark:text-white font-bold text-lg">{bs.count}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <Card className="p-8 border border-slate-200 dark:border-transparent shadow-sm rounded-3xl bg-white dark:bg-slate-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Recent Bookings</h2>
              <Link to="/admin/bookings"><Button variant="ghost" size="sm" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">View all <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
            </div>
            <div className="space-y-3">
              {(stats?.recent_bookings || []).map(bk => (
                <div key={bk.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{bk.service_name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">by {bk.tourist_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">${bk.total_price}</p>
                    <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full capitalize',
                      bk.status === 'confirmed' ? 'bg-green-500/10 text-green-600' :
                      bk.status === 'pending'   ? 'bg-amber-500/10 text-amber-600' :
                      'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    )}>{bk.status}</span>
                  </div>
                </div>
              ))}
              {!loading && !stats?.recent_bookings?.length && (
                <p className="text-slate-400 text-sm text-center py-6">No bookings yet</p>
              )}
            </div>
          </Card>

          {/* Recent Users */}
          <Card className="p-8 border border-slate-200 dark:border-transparent shadow-sm rounded-3xl bg-white dark:bg-slate-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Recent Users</h2>
              <Link to="/admin/users"><Button variant="ghost" size="sm" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">View all <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
            </div>
            <div className="space-y-3">
              {(stats?.recent_users || []).map(u => (
                <div key={u.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <img src={`https://ui-avatars.com/api/?name=${u.name}&background=random&size=40`} className="w-10 h-10 rounded-full" alt={u.name} />
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{u.email}</p>
                  </div>
                  <span className={cn('text-xs font-bold px-2 py-1 rounded-xl capitalize shrink-0',
                    u.role === 'admin'            ? 'bg-rose-500/10 text-rose-600' :
                    u.role === 'service_provider' ? 'bg-violet-500/10 text-violet-600' :
                    'bg-blue-500/10 text-blue-600'
                  )}>{u.role === 'service_provider' ? 'Provider' : u.role}</span>
                </div>
              ))}
              {!loading && !stats?.recent_users?.length && (
                <p className="text-slate-400 text-sm text-center py-6">No users yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-8 border border-slate-200 dark:border-transparent shadow-sm rounded-3xl bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 font-heading">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/providers"><Button variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Review Pending Providers</Button></Link>
            <Link to="/admin/reviews"><Button variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Moderate Reviews</Button></Link>
            <Link to="/admin/services"><Button variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Manage Services</Button></Link>
            <Link to="/admin/analytics"><Button variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">View Analytics</Button></Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
