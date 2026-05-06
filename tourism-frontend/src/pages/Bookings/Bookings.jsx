import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, MessageSquare, ExternalLink, RefreshCcw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../../api/axios';

export default function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    api.getBookings()
      .then(res => setBookings(res.data.data || res.data.bookings || (Array.isArray(res.data) ? res.data : [])))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleCancel = async (id) => {
    try { 
      await api.cancelBooking(id); 
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    confirmed: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    cancelled: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700/30 dark:text-slate-400 dark:border-slate-600',
    completed: 'bg-brand-100 text-brand-700 border-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:border-brand-800',
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Upcoming') return b.status === 'confirmed' || b.status === 'pending';
    if (activeTab === 'Past') return b.status === 'completed' || b.status === 'cancelled';
    return true;
  });

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 dark:border-slate-800 pb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold font-heading dark:text-white">Your Bookings</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your upcoming trips and review your past adventures.</p>
          </div>
          <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            {['All', 'Upcoming', 'Past'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  tab === activeTab ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="text-center py-24 text-slate-500 dark:text-slate-400 font-medium">Loading your bookings...</div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-0 border-none shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden flex flex-col md:flex-row bg-white dark:bg-slate-800 rounded-[2rem]">
                  <div className="w-full md:w-72 h-56 md:h-auto overflow-hidden relative shrink-0">
                    {(() => {
                      const imgString = booking.service_image;
                      const primaryImage = imgString ? imgString.split(',')[0] : 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800';
                      return (
                        <img 
                          src={primaryImage} 
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                          alt={booking.service_name} 
                        />
                      );
                    })()}
                    <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm backdrop-blur-md ${statusColors[booking.status] || statusColors.pending}`}>
                      {booking.status}
                    </div>
                  </div>

                  <div className="flex-grow p-8 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start gap-4 flex-col sm:flex-row">
                        <div>
                          <h3 className="text-2xl font-bold mb-3 font-heading text-slate-900 dark:text-white">{booking.service_name || 'Premium Service'}</h3>
                          <div className="flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-600">
                              <CalendarIcon className="w-4 h-4 text-brand-500 shrink-0" />
                              <span>{booking.check_in_date || booking.created_at ? new Date(booking.check_in_date || booking.created_at).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-600">
                              <Clock className="w-4 h-4 text-brand-500 shrink-0" />
                              <span>Check-in 2:00 PM</span>
                            </div>
                          </div>
                        </div>
                        <div className="sm:text-right bg-brand-50/50 dark:bg-brand-900/20 p-4 rounded-2xl border border-brand-100/50 dark:border-brand-800/50 shrink-0">
                          <div className="text-[10px] uppercase tracking-widest font-bold text-brand-600/70 dark:text-brand-400/70 mb-1">Total Amount</div>
                          <div className="text-2xl font-bold text-brand-900 dark:text-brand-300">${booking.total_price || booking.price || '0'}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-8 pt-4">
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Order Ref</div>
                          <div className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md uppercase">#{booking.id.toString().slice(0,8)}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Guests</div>
                          <div className="font-bold text-slate-700 dark:text-slate-300">{booking.guests || 1} Guests</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button onClick={() => navigate('/messages', { state: { provider_id: booking.provider_id, provider_name: booking.provider_name } })} variant="ghost" size="sm" className="font-bold text-brand-600 dark:text-brand-400 gap-2 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 flex-1 sm:flex-none justify-center">
                          <MessageSquare className="w-4 h-4 shrink-0" />
                          <span className="hidden sm:inline">Contact Host</span>
                          <span className="sm:hidden">Message</span>
                        </Button>
                        <Link to={`/services/${booking.service_id}`} className="flex-1 sm:flex-none">
                          <Button variant="ghost" size="sm" className="font-bold text-slate-600 dark:text-slate-300 gap-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 w-full justify-center">
                            <ExternalLink className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">Details</span>
                          </Button>
                        </Link>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-700 flex-1 sm:flex-none"
                            onClick={() => handleCancel(booking.id)}
                          >
                            Cancel
                          </Button>
                        )}
                        {booking.check_out_date && booking.check_in_date && (
                          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <CalendarIcon className="w-3 h-3 text-brand-500" />
                            {new Date(booking.check_in_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} → {new Date(booking.check_out_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="inline-flex p-6 bg-slate-50 dark:bg-slate-700 rounded-full mb-6">
              <CalendarIcon className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-heading dark:text-white">No bookings found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8">
              {activeTab === 'All' 
                ? "Your upcoming trips and past adventures will appear here." 
                : `You don't have any ${activeTab.toLowerCase()} bookings at the moment.`}
            </p>
            <Link to="/services">
              <Button size="lg" className="px-10">Explore Destinations</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
