import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Star, MapPin, Share2, Heart, Check, Users, 
  Calendar as CalendarIcon, Info, MessageCircle, ChevronRight,
  Wifi, Coffee, Utensils, Waves, Car, Camera
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SERVICES, REVIEWS } from '../data/mockData';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const service = SERVICES.find(s => s.id === id) || SERVICES[0];

  const amenityIcons: Record<string, any> = {
    'Pool': Waves,
    'Spa': Coffee,
    'Free WiFi': Wifi,
    'Breakfast Included': Utensils,
    'Ocean View': Camera,
    'Valet Parking': Car,
  };

  return (
    <div className="pt-24 pb-24">
      {/* Photo Gallery */}
      <section className="px-6 mb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[300px] md:h-[500px]">
          <div className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden relative group">
            <img src={service.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={service.title} />
          </div>
          <div className="hidden md:block rounded-3xl overflow-hidden relative group">
            <img src={service.images[1] || service.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 2" />
          </div>
          <div className="hidden md:block rounded-3xl overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 3" />
          </div>
          <div className="hidden md:block md:col-span-2 rounded-3xl overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 4" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Title & Info */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="bg-brand-50 text-brand-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                {service.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-bold">{service.rating}</span>
                <span className="text-slate-400 font-medium">({service.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex justify-between items-start gap-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{service.title}</h1>
              <div className="flex gap-2">
                <Button variant="secondary" size="icon" className="rounded-2xl">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-2xl">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-medium pb-8 border-b border-slate-100">
              <MapPin className="w-5 h-5 text-brand-500" />
              <span>{service.location}</span>
            </div>
          </div>

          {/* Description */}
          <section>
            <h3 className="text-2xl font-bold mb-4">About this {service.category}</h3>
            <p className="text-slate-600 leading-loose text-lg">
              {service.description}
            </p>
          </section>

          {/* Amenities */}
          <section>
            <h3 className="text-2xl font-bold mb-6">What this place offers</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {service.amenities.map(amenity => {
                const Icon = amenityIcons[amenity] || Check;
                return (
                  <div key={amenity} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                    <Icon className="w-5 h-5 text-brand-600" />
                    <span className="text-slate-700 font-medium">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold">Reviews</h3>
              <Button variant="outline">Write a Review</Button>
            </div>
            <div className="space-y-8">
              {REVIEWS.map(review => (
                <div key={review.id} className="p-8 rounded-[2rem] bg-slate-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img src={review.userAvatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt={review.userName} />
                      <div>
                        <div className="font-bold">{review.userName}</div>
                        <div className="text-xs text-slate-400">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-accent text-accent' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 italic leading-relaxed">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Booking Card */}
        <aside>
          <div className="sticky top-28">
            <Card className="p-8 border-none shadow-2xl space-y-8 rounded-[2.5rem]">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-3xl font-bold">${service.price}</span>
                  <span className="text-slate-400 font-medium"> / night</span>
                </div>
                <div className="text-slate-400 text-sm font-bold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  {service.rating}
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Dates</label>
                  <div className="flex justify-between items-center font-medium">
                    <span>Aug 12 - Aug 18</span>
                    <CalendarIcon className="w-4 h-4 text-brand-500" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Guests</label>
                  <div className="flex justify-between items-center font-medium">
                    <span>2 Guests</span>
                    <Users className="w-4 h-4 text-brand-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>${service.price} x 6 nights</span>
                  <span>${service.price * 6}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Cleaning fee</span>
                  <span>$45</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Service fee</span>
                  <span>$82</span>
                </div>
                <div className="h-px bg-slate-100 my-4" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${service.price * 6 + 127}</span>
                </div>
              </div>

              <Button className="w-full h-16 text-lg rounded-2xl">Confirm Booking</Button>
              
              <p className="text-center text-xs text-slate-400">You won't be charged yet</p>

              <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-2xl border border-brand-100">
                <Info className="w-5 h-5 text-brand-600" />
                <p className="text-xs text-brand-800 font-medium leading-relaxed">
                  Trusted Partner. All bookings are protected by our Horizon Guarantee.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-brand-600 font-bold text-sm cursor-pointer hover:underline underline-offset-4">
                <MessageCircle className="w-4 h-4" />
                Contact Provider
              </div>
            </Card>

            <Link to="/provider" className="block text-center mt-8 text-slate-400 hover:text-brand-600 transition-colors text-sm font-medium">
              Report this service
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
