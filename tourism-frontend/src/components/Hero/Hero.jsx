import { motion } from 'motion/react';
import SearchBar from '../SearchBar/SearchBar';
import { Star, ShieldCheck, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Hero() {
  return (
    <section className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden">
      <div className="grain absolute inset-0 z-20 pointer-events-none opacity-[0.05]"></div>
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2400"
          alt="Luxury Tropical Horizon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-slate/90 via-dark-slate/30 to-ivory"></div>
      </motion.div>

      <div className="relative z-30 text-center px-6 max-w-[1440px] mx-auto pt-32 md:pt-48">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-[120px] font-serif font-bold leading-[0.9] mb-12 text-white tracking-tighter drop-shadow-2xl italic">
            Beyond <span className="not-italic text-sunset-gold">Discovery</span>. <br />
            Explore The <span className="not-italic text-sunset-gold">Horizon.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-20 leading-relaxed font-sans font-light tracking-wide">
            Curated journeys, trusted stays, and unforgettable memories for the modern explorer.
          </p>

          <div className="w-full max-w-5xl mx-auto mb-24">
            <SearchBar />
          </div>

          <div className="flex flex-wrap justify-center gap-16 md:gap-32">
            {[
              { icon: Star, label: '4.9 Rating', sub: 'From 15k+ reviews', primary: true },
              { icon: Users, label: '50k+ Travelers', sub: 'Happy explorers' },
              { icon: ShieldCheck, label: 'Verified Partners', sub: 'Trusted worldwide' }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                  stat.primary ? "bg-sunset-gold text-white luxury-shadow-gold" : "bg-white/5 backdrop-blur-md border border-white/10 text-sunset-gold group-hover:bg-white/10"
                )}>
                  <stat.icon size={24} className={stat.primary ? "fill-white" : ""} />
                </div>
                <div className="text-left">
                  <p className="text-xl font-serif font-bold text-white leading-none mb-1.5">{stat.label}</p>
                  <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
