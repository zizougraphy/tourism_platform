import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Star, MapPin, Share2, Heart, Check, Users, 
  Calendar as CalendarIcon, Info, MessageCircle,
  Wifi, Coffee, Utensils, Waves, Car, Camera, ArrowLeft, Send
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import * as api from '../../api/axios';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { DatePicker } from '../../components/ui/DatePicker';
import { GuestSelector } from '../../components/ui/GuestSelector';
import { format } from 'date-fns';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking state
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [bookingMsg, setBookingMsg] = useState('');
  
  // Review state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated, user } = useAuth();
  
  const fetchServiceData = () => {
    setLoading(true);
    api.getServiceById(id)
      .then(res => setService(res.data.data || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
      
    api.getServiceReviews(id)
      .then(res => setReviews(res.data.data || res.data.reviews || res.data || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchServiceData();
  }, [id]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!dateRange?.from || !dateRange?.to) {
      setBookingMsg('Please select dates');
      return;
    }
    try {
      await api.createBooking({ 
        service_id: service.id, 
        check_in_date: format(dateRange.from, 'yyyy-MM-dd'), 
        check_out_date: format(dateRange.to, 'yyyy-MM-dd'),
        guests: guests.adults + guests.children
      });
      setBookingMsg('Booking confirmed!');
      setTimeout(() => navigate('/bookings'), 2000);
    } catch (err) {
      setBookingMsg(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleReviewSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) return;
    
    setReviewLoading(true);
    try {
      await api.createReview({
        service_id: service.id,
        rating: newRating,
        comment: newComment
      });
      setNewComment('');
      setShowReviewForm(false);
      fetchServiceData(); // Refresh reviews
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Navigate to messages with provider
    navigate('/messages', { 
      state: { 
        provider_id: service.provider_id, 
        provider_name: service.provider_name || 'Service Provider'
      } 
    });
  };

  if (loading) return <div className="pt-40 pb-20 text-center text-slate-500 dark:text-slate-400 min-h-screen font-medium dark:bg-slate-950">Loading service details...</div>;
  if (!service) return <div className="pt-40 pb-20 text-center text-slate-500 dark:text-slate-400 min-h-screen font-medium dark:bg-slate-950">Service not found</div>;

  const favorite = isFavorite(service.id);
  const amenityIcons = {
    'Pool': Waves, 'Spa': Coffee, 'Free WiFi': Wifi, 'Breakfast Included': Utensils, 'Ocean View': Camera, 'Valet Parking': Car,
  };
  const amenitiesList = service.amenities || ['Free WiFi', 'Breakfast Included', 'Pool', 'Spa', 'Ocean View', 'Valet Parking'].slice(0, 4);

  return (
    <div className="pt-24 pb-24 min-h-screen dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>
      </div>

      {/* Photo Gallery */}
      <section className="px-6 mb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[300px] md:h-[500px]">
          <div className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden relative group">
            <img src={service.image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={service.name} />
          </div>
          {/* Using same image for gallery if secondary ones are missing */}
          {[1, 2, 3].map((i) => (
            <div key={i} className={`hidden md:block rounded-3xl overflow-hidden relative group bg-slate-100 dark:bg-slate-800 ${i === 3 ? 'md:col-span-2' : ''}`}>
              <img src={service.image_url || `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" alt={`Gallery ${i}`} />
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Title & Info */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                {service.category || 'Premium'}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-bold dark:text-slate-200">{Number(service.rating).toFixed(1) || '4.8'}</span>
                <span className="text-slate-400 font-medium">({reviews.length} reviews)</span>
              </div>
            </div>

            <div className="flex justify-between items-start gap-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-heading dark:text-white">{service.name}</h1>
              <div className="flex gap-2 shrink-0">
                <Button variant="secondary" size="icon" className="rounded-2xl" onClick={() => toggleFavorite(service)}>
                  <Heart className="w-5 h-5" fill={favorite ? "currentColor" : "none"} color={favorite ? "#ef4444" : "currentColor"} />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-2xl">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium pb-8 border-b border-slate-100 dark:border-slate-700">
              <MapPin className="w-5 h-5 text-brand-500" />
              <span>{service.city_name || 'Global Destination'}</span>
            </div>
          </div>

          {/* Description */}
          <section>
            <h3 className="text-2xl font-bold mb-4 font-heading dark:text-white">About this {service.category || 'experience'}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-loose text-lg">
              {service.description || 'Experience luxury and comfort in our meticulously designed spaces.'}
            </p>
          </section>

          {/* Reviews */}
          <section className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold font-heading dark:text-white">Guest Reviews</h3>
              {!showReviewForm && isAuthenticated && (
                <Button variant="outline" onClick={() => setShowReviewForm(true)}>Write a Review</Button>
              )}
            </div>

            {showReviewForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} onClick={() => setNewRating(star)} className={`w-6 h-6 cursor-pointer transition-colors ${star <= newRating ? 'fill-accent text-accent' : 'text-slate-200 dark:text-slate-600 hover:text-accent/50'}`} />
                    ))}
                  </div>
                </div>
                <textarea 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)} 
                  className="w-full min-h-[120px] p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                  placeholder="Tell others about your experience..."
                />
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setShowReviewForm(false)}>Cancel</Button>
                  <Button onClick={handleReviewSubmit} disabled={reviewLoading || !newComment}>
                    {reviewLoading ? 'Submitting...' : 'Post Review'}
                  </Button>
                </div>
              </motion.div>
            )}

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map(review => (
                  <Card key={review.id} className="p-8 border-none bg-slate-50/50 dark:bg-slate-800/50 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <img src={`https://ui-avatars.com/api/?name=${review.reviewer_name}&background=random`} className="w-10 h-10 rounded-full" alt="" />
                        <div>
                          <div className="font-bold text-sm dark:text-slate-200">{review.reviewer_name}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recent'}</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-accent text-accent' : 'text-slate-200 dark:text-slate-600'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">"{review.comment}"</p>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] text-slate-400 font-medium italic">No reviews yet. Be the first to share your thoughts!</div>
            )}
          </section>
        </div>

        {/* Booking Sidebar */}
        <aside>
          <div className="sticky top-28">
            <Card className="p-8 border-none shadow-2xl space-y-8 rounded-[2.5rem] !overflow-visible">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-3xl font-bold dark:text-white">${service.price}</span>
                  <span className="text-slate-400 font-medium"> / night</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-1 rounded-[1.5rem] bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 flex flex-col gap-1">
                  <DatePicker date={dateRange} setDate={setDateRange} placeholder="Select dates" align="right" />
                </div>
                <div className="p-1 rounded-[1.5rem] bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 flex flex-col gap-1">
                  <GuestSelector guests={guests} setGuests={setGuests} align="right" />
                </div>
              </div>

              {bookingMsg && (
                <div className={`p-3 rounded-xl text-sm font-bold text-center ${bookingMsg.includes('confirmed') ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                  {bookingMsg}
                </div>
              )}

              <Button size="lg" className="w-full h-16 text-lg rounded-2xl" onClick={handleBooking}>
                {isAuthenticated ? 'Reserve Now' : 'Login to Book'}
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-sm cursor-pointer hover:underline" onClick={handleContact}>
                <MessageCircle className="w-4 h-4" /> Contact Provider
              </div>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
