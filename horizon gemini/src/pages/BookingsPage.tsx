import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, ChevronRight, MessageSquare, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MOCK_BOOKINGS } from '../data/mockData';
import { BookingStatus } from '../types';

const BookingsPage = () => {
  const statusColors = {
    [BookingStatus.PENDING]: 'bg-amber-100 text-amber-700',
    [BookingStatus.CONFIRMED]: 'bg-green-100 text-green-700',
    [BookingStatus.CANCELLED]: 'bg-slate-100 text-slate-700',
    [BookingStatus.COMPLETED]: 'bg-brand-100 text-brand-700',
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold">Your Bookings</h1>
            <p className="text-slate-500">Manage your upcoming trips and review your past adventures.</p>
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-100">
            {['All', 'Upcoming', 'Past'].map(tab => (
              <button key={tab} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'All' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="space-y-6">
          {MOCK_BOOKINGS.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-0 border-none shadow-md hover:shadow-lg overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden relative">
                  <img src={booking.serviceImage} className="w-full h-full object-cover" alt={booking.serviceTitle} />
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColors[booking.status]}`}>
                    {booking.status}
                  </div>
                </div>

                <div className="flex-grow p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{booking.serviceTitle}</h3>
                        <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-brand-500" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-brand-500" />
                            <span>Check-in 2:00 PM</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400 font-medium mb-1">Total Paid</div>
                        <div className="text-2xl font-bold text-slate-900">${booking.totalPrice}</div>
                      </div>
                    </div>

                    <div className="flex gap-12">
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Order ID</div>
                        <div className="font-mono text-sm uppercase">{booking.id}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Guests</div>
                        <div className="font-bold">{booking.guests} People</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="font-bold text-brand-600 gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Chat with Provider
                      </Button>
                      <Button variant="ghost" size="sm" className="font-bold text-slate-500 gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View Details
                      </Button>
                    </div>
                    <div className="flex gap-3">
                      {booking.status === BookingStatus.CONFIRMED && (
                        <Button variant="outline" size="sm" className="border-rose-200 text-rose-500 hover:bg-rose-50">Cancel Booking</Button>
                      )}
                      <Button variant="secondary" size="sm">Manage Preferences</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {MOCK_BOOKINGS.length === 0 && (
          <div className="py-24 text-center bg-white rounded-[2rem] border border-slate-100">
            <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
            <p className="text-slate-500">Your upcoming trips will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
