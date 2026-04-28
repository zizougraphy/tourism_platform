import { motion } from 'motion/react';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DESTINATIONS } from '../data/mockData';
import { Link } from 'react-router-dom';

const DestinationsPage = () => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">World's Best Destinations</h1>
          <p className="text-slate-500 text-lg">From serene coastlines to bustling metropolitan wonders, explore the horizons we've curated for you.</p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input placeholder="Enter a country, city, or island..." className="pl-12 h-14 rounded-2xl bg-white shadow-sm" />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4">
          {['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania', 'Islands', 'Mountains'].map(cat => (
            <button key={cat} className="px-6 py-2 bg-white border border-slate-100 rounded-full text-sm font-bold text-slate-600 hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm">
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {DESTINATIONS.concat(DESTINATIONS).map((dest, i) => (
            <motion.div
              key={`${dest.id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group h-[500px] border-none overflow-hidden rounded-[2.5rem] relative">
                <img 
                  src={dest.image} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt={dest.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-10 text-white space-y-4">
                  <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-widest">
                    <MapPin className="w-4 h-4" />
                    Global Horizon
                  </div>
                  <h3 className="text-3xl font-bold">{dest.name}</h3>
                  <p className="text-slate-200 line-clamp-2 text-sm leading-relaxed opacity-80">
                    {dest.description}
                  </p>
                  <div className="pt-4 flex items-center justify-between">
                    <div className="text-sm font-bold">
                      <span className="text-xl">{dest.serviceCount}</span>
                      <span className="opacity-60 ml-2">Services</span>
                    </div>
                    <Link to="/services">
                      <Button variant="accent" size="icon" className="rounded-2xl">
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationsPage;
