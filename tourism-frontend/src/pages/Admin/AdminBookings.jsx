import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Calendar, XCircle, CalendarCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import * as api from '../../api/axios';
import { cn } from '../../lib/utils';

const FILTERS = ['all', 'pending', 'confirmed', 'cancelled', 'completed'];

const statusStyle = {
  pending:   'bg-amber-500/10 text-amber-600 border-amber-500/20',
  confirmed: 'bg-green-500/10 text-green-600 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
  completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [busy,     setBusy]     = useState({});

  const load = useCallback(() => {
    setLoading(true);
    api.getAdminBookings({ status: filter })
      .then(res => setBookings(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const cancelBooking = async (id) => {
    if (!confirm('Force cancel this booking?')) return;
    setBusy(b => ({ ...b, [id]: true }));
    try {
      await api.cancelAdminBooking(id);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } finally { setBusy(b => ({ ...b, [id]: false })); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <AdminSidebar />
      <main className="flex-grow p-8 md:p-12 space-y-8 overflow-auto">
        <header>
          <h1 className="text-3xl font-bold tracking-tight font-heading text-slate-900 dark:text-white">Bookings Oversight</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor and force-cancel bookings platform-wide.</p>
        </header>

        <Card className="p-0 border border-slate-200 dark:border-transparent shadow-sm rounded-3xl bg-white dark:bg-slate-900 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 flex-wrap">
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={cn('px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all',
                    f === filter
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}>
                  {f}
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">{bookings.length} bookings</span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-slate-400">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="py-20 text-center">
                <CalendarCheck className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No bookings found</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Guest</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Service</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Check-in</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Total</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bookings.map((bk, i) => (
                    <motion.tr key={bk.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${bk.tourist_name || 'G'}&background=random&size=36`} className="w-9 h-9 rounded-full" alt="" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{bk.tourist_name || 'Anonymous'}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{bk.guests || 1} guest{bk.guests !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{bk.service_name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">{bk.category}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg w-max">
                          <Calendar className="w-3 h-3 text-rose-500" />
                          <span className="text-xs font-bold">{fmtDate(bk.check_in_date)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-slate-900 dark:text-white font-bold">${bk.total_price}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn('px-3 py-1 rounded-xl text-xs font-bold border capitalize', statusStyle[bk.status] || 'bg-slate-100 dark:bg-slate-700 text-slate-500 border-slate-200 dark:border-slate-600')}>
                          {bk.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          {(bk.status === 'pending' || bk.status === 'confirmed') && (
                            <Button variant="ghost" size="sm" disabled={busy[bk.id]} onClick={() => cancelBooking(bk.id)}
                              className="rounded-xl text-xs gap-1.5 text-red-600 hover:bg-red-500/10">
                              <XCircle className="w-4 h-4" /> Force Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
