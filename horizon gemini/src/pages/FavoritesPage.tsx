import { motion } from 'motion/react';
import { Heart, Search, MapPin, Star, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SERVICES } from '../data/mockData';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const favorites = SERVICES.slice(0, 2);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold">Saved Horizons</h1>
            <p className="text-slate-500">Your personal collection of premium stays, dining, and experiences.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">Clear All</Button>
            <Button variant="primary">Start Booking</Button>
          </div>
        </header>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-none shadow-md hover:shadow-xl group">
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={service.images[0]} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-rose-500 rounded-full text-white shadow-lg">
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">{service.category}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-bold text-sm">{service.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold line-clamp-1">{service.title}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{service.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <div>
                        <span className="text-2xl font-bold text-slate-900">${service.price}</span>
                        <span className="text-slate-400 text-sm font-medium"> / night</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="icon" className="rounded-xl p-2 text-slate-400 hover:text-rose-600">
                          <Trash2 className="w-5 h-5" />
                        </Button>
                        <Link to={`/services/${service.id}`}>
                          <Button size="sm">Book Now</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center space-y-6 bg-white rounded-[3rem] border border-slate-100">
            <div className="inline-flex p-6 bg-rose-50 rounded-full">
              <Heart className="w-12 h-12 text-rose-500" />
            </div>
            <h3 className="text-2xl font-bold">Your list is empty</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Explore our premium destinations and save your favorite services for later.</p>
            <Link to="/services">
              <Button size="lg" className="px-10">Start Exploring</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
