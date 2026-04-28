import { motion } from 'motion/react';
import { Star, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { cn } from '../../lib/utils';

export default function ServiceCard({ service }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(service.id);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group">
      <div className="relative h-64 rounded-2xl overflow-hidden luxury-shadow mb-6">
        <img src={service.image || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white z-10 flex items-center gap-1.5 border border-white/10">
          <Star size={10} className="fill-sunset-gold text-sunset-gold" />
          {service.rating || '4.5'}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); toggleFavorite(service); }}
          className={cn(
            "absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-md border border-white/10",
            favorite ? "bg-sunset-gold text-white" : "bg-black/20 text-white hover:bg-black/40"
          )}
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <Link to={`/services/${service.id}`} className="block px-1">
        <h3 className="text-xl font-serif font-bold text-dark-slate group-hover:text-sunset-gold transition-colors duration-300 truncate mb-2">{service.name}</h3>
        <p className="text-muted-slate text-xs mb-4 flex items-center gap-1.5 font-sans tracking-wide">
          <MapPin size={12} className="text-muted-slate/50" />
          {service.location || service.city_name || 'Unknown Location'}
        </p>
        <div className="flex items-baseline gap-1.5 pt-4 border-t border-soft-border/50">
          <span className="text-sm font-bold text-dark-slate">${service.price}</span>
          <span className="text-[10px] text-muted-slate uppercase tracking-widest font-bold">/ night</span>
        </div>
      </Link>
    </motion.div>
  );
}
