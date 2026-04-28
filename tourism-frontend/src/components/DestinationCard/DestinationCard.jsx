import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DestinationCard({ destination }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative rounded-2xl overflow-hidden aspect-[4/5] group luxury-shadow"
    >
      <img src={destination.image} alt={destination.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-slate/80 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white group-hover:pb-8 transition-all duration-500">
        <h3 className="text-xl font-serif font-bold mb-1 text-white leading-tight">{destination.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{destination.stats || destination.country}</span>
          <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
            <Star size={10} className="fill-sunset-gold text-sunset-gold" />
            <span className="text-[10px] font-bold tracking-widest">{destination.rating || '4.8'}</span>
          </div>
        </div>
      </div>
      <Link to={`/services?city=${destination.name}`} className="absolute inset-0 z-10" />
    </motion.div>
  );
}
