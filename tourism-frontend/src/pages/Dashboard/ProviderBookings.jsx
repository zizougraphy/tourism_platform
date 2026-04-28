import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Search, Calendar, CheckCircle, XCircle, Clock, MoreVertical, MessageSquare, MapPin } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/utils';
import * as api from '../../api/axios';

export default function ProviderBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getBookings();
      setBookings(res.data.data || (Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      if (status === 'confirmed') await api.confirmBooking(id);
      fetchBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter(b => 
    filter === 'all' || b.status === filter
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 md:p-12 space-y-10 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-heading">Booking Management</h1>
            <p className="text-slate-500 mt-2">Manage your incoming reservations and past bookings.</p>
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
            {['all', 'pending', 'confirmed', 'cancelled'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setFilter(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                  tab === filter ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <Card className="p-0 border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-slate-500 font-medium">Fetching reservations...</div>
            ) : filteredBookings.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Guest / Service</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Total</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((bk) => (
                    <tr key={bk.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={`https://ui-avatars.com/api/?name=${bk.tourist_name || 'Guest'}&background=random`} className="w-12 h-12 rounded-2xl shadow-sm" alt="Guest" />
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm mb-1 font-heading">{bk.tourist_name || 'Anonymous Guest'}</h4>
                            <div className="flex items-center gap-3">
                              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-brand-500" />
                                {bk.service_name}
                              </p>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                {bk.guests || 1} Guests
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm text-slate-700 font-medium bg-slate-100/50 px-3 py-1.5 rounded-lg w-fit border border-slate-100">
                          <Calendar size={14} className="text-brand-500" />
                          {bk.check_in_date || bk.created_at ? new Date(bk.check_in_date || bk.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-lg font-bold text-slate-900 font-heading">${bk.total_price}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 w-fit",
                          bk.status === 'confirmed' ? "bg-green-50 text-green-600 border-green-100" :
                          bk.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                          "bg-slate-50 text-slate-500 border-slate-200"
                        )}>
                          {bk.status === 'pending' && <Clock size={12} />}
                          {bk.status === 'confirmed' && <CheckCircle size={12} />}
                          {bk.status === 'cancelled' && <XCircle size={12} />}
                          {bk.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button onClick={() => navigate('/dashboard/messages', { state: { provider_id: bk.tourist_id, provider_name: bk.tourist_name || 'Guest' } })} variant="ghost" size="icon" className="h-10 w-10 text-brand-600 hover:bg-brand-50 rounded-xl">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          {bk.status === 'pending' && (
                            <Button 
                              onClick={() => handleStatusUpdate(bk.id, 'confirmed')}
                              size="sm"
                              className="font-bold text-xs px-4"
                            >
                              Confirm
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">No Bookings Yet</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
                  {filter === 'all' 
                    ? "Reservations for your services will appear here once they start coming in." 
                    : `You don't have any ${filter} bookings.`}
                </p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
