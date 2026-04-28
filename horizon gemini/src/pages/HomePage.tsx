import { motion } from 'motion/react';
import { Search, MapPin, Calendar, Users, Star, ArrowRight, ShieldCheck, Globe, Clock, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DESTINATIONS, SERVICES } from '../data/mockData';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center pt-20 px-6 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover brightness-75"
            alt="Paradise Island"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-bold mb-6"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Logged in as {user.displayName || user.email}
              </motion.div>
            )}
            <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter leading-none mb-6">
              Discover Your <br />
              <span className="text-brand-400">Next Horizon</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto font-light mb-8">
              Curated journeys, trusted stays, and unforgettable memories tailored for the world's most curious souls.
            </p>
            
            {user && (
              <div className="flex justify-center gap-4 mb-4">
                <Link to="/provider">
                  <Button size="lg" className="h-14 px-8 rounded-2xl bg-brand-500 hover:bg-brand-600">
                    <LayoutDashboard className="w-5 h-5 mr-3" />
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-2 md:p-4 rounded-3xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto border border-white/20 glass-morphism"
          >
            <div className="flex-1 w-full flex items-center gap-3 px-6 py-2 border-b md:border-b-0 md:border-r border-slate-100">
              <MapPin className="text-brand-500 w-5 h-5 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Where to next?" 
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>
            <div className="flex-1 w-full flex items-center gap-3 px-6 py-2 border-b md:border-b-0 md:border-r border-slate-100">
              <Calendar className="text-brand-500 w-5 h-5 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Add dates" 
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>
            <div className="flex-1 w-full flex items-center gap-3 px-6 py-2">
              <Users className="text-brand-500 w-5 h-5 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="2 Guests" 
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>
            <Button size="lg" className="w-full md:w-auto h-14 px-10">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8"
          >
            {[
              { label: 'Rating', value: '4.9/5', icon: Star },
              { label: 'Travelers', value: '50K+', icon: Globe },
              { label: 'Partners', value: '1.2K', icon: ShieldCheck }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 text-white drop-shadow-md">
                <stat.icon className="w-5 h-5 text-brand-400" />
                <div className="text-left">
                  <div className="font-bold leading-none">{stat.value}</div>
                  <div className="text-xs opacity-90 uppercase tracking-widest">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Popular Destinations</h2>
              <p className="text-slate-500 max-w-xl">Explore our hand-picked selection of the world's most captivating places.</p>
            </div>
            <Link to="/destinations">
              <Button variant="outline" className="hidden md:flex">
                View All Destinations
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {DESTINATIONS.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group cursor-pointer aspect-[3/4] relative overflow-hidden rounded-3xl border-none">
                  <img 
                    src={dest.image} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={dest.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">{dest.name}</h3>
                    <p className="text-sm opacity-80 mb-4 line-clamp-2">{dest.description}</p>
                    <div className="text-xs font-semibold uppercase tracking-widest text-brand-400">
                      {dest.serviceCount} Services
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Why Travelers <br />
              <span className="text-gradient underline decoration-brand-200">Trust Horizon</span>
            </h2>
            <div className="space-y-8">
              {[
                { title: 'Hand-picked Excellence', desc: 'Every hotel, restaurant, and tour is personally vetted by our local experts to ensure premium quality.', icon: Star },
                { title: 'Global Reach, Local Depth', desc: 'Operating in 50 countries with deep connections to authentic local experiences you won\'t find elsewhere.', icon: Globe },
                { title: 'Seamless Booking', desc: 'A frictionless experience from discovery to destination. Everything you need in one powerful platform.', icon: ShieldCheck },
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="bg-brand-50 p-4 rounded-2xl h-fit">
                    <item.icon className="w-8 h-8 text-brand-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-[600px] object-cover"
                alt="Travel experiences"
              />
            </motion.div>
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl max-w-[280px] hidden md:block">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div className="font-bold">Lightning Fast</div>
              </div>
              <p className="text-sm text-slate-500">Book your entire dream trip in less than 5 minutes. No hassle, just horizons.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-brand-600 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter">Ready to start your <br /> next adventure?</h2>
            <p className="text-xl text-brand-100 font-light">Join 50,000+ travelers exploring the world's most stunning horizons.</p>
            <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
              <Button variant="accent" size="lg" className="px-12 bg-white text-brand-600 hover:bg-slate-100">
                Register Now
              </Button>
              <Button variant="outline" size="lg" className="px-12 border-white text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
