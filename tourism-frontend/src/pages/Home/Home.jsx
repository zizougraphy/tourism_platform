import { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, ArrowRight, ShieldCheck, Globe, Clock, LayoutDashboard } from 'lucide-react';
import { cn } from '../../lib/utils';
import * as api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

// Lazy load Spline to prevent blocking the main thread
const Spline = lazy(() => import('@splinetool/react-spline'));

export default function Home() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [services, setServices] = useState([]);
  const [splineLoaded, setSplineLoaded] = useState(false);

  useEffect(() => {
    api.getCities().then(res => setCities(res.data.data || res.data || [])).catch(() => { });
    api.getServices({ limit: 4 }).then(res => setServices(res.data.data || res.data.services || res.data || [])).catch(() => { });
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center pt-20 px-6 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="./dist/assets/travel-bg1.jpg"
            className="w-full h-full object-cover brightness-75"
            alt="Nature Landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-auto"
          >
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-bold mb-6"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Logged in as {user.name || user.email}
              </motion.div>
            )}
            <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter leading-none mb-6 font-heading">
              Discover Your <br />
              <span className="text-brand-400">Next Horizon</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto font-light mb-8">
              Curated journeys, trusted stays, and unforgettable memories tailored for the world's most curious souls.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-2 md:p-4 rounded-3xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto border border-white/20 glass-morphism pointer-events-auto"
          >
            <div className="flex-1 w-full flex items-center gap-3 px-6 py-2 border-b md:border-b-0 md:border-r border-slate-100">
              <MapPin className="text-brand-500 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where to next?"
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 font-medium outline-none"
              />
            </div>
            <div className="flex-1 w-full flex items-center gap-3 px-6 py-2 border-b md:border-b-0 md:border-r border-slate-100">
              <Calendar className="text-brand-500 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Add dates"
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 font-medium outline-none"
              />
            </div>
            <div className="flex-1 w-full flex items-center gap-3 px-6 py-2">
              <Users className="text-brand-500 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                placeholder="2 Guests"
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 font-medium outline-none"
              />
            </div>
            <Link to={`/services${searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : ''}`} className="w-full md:w-auto">
              <Button size="lg" className="w-full h-14 px-10">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </Link>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 pointer-events-auto"
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
      {cities.length > 0 && (
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Popular Destinations</h2>
                <p className="text-slate-500 max-w-xl">Explore our hand-picked selection of the world's most captivating places.</p>
              </div>
              <Link to="/services">
                <Button variant="outline" className="hidden md:flex border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                  View All Destinations
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {cities.slice(0, 4).map((dest, i) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group cursor-pointer aspect-[3/4] relative overflow-hidden rounded-3xl border-none">
                    <img
                      src={dest.images || 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800'}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={dest.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h3 className="text-2xl font-bold mb-2 font-heading">{dest.name}</h3>
                      <p className="text-sm opacity-80 mb-4 line-clamp-2">{dest.description || 'Discover amazing experiences here.'}</p>
                      <div className="text-xs font-semibold uppercase tracking-widest text-brand-400">
                        {dest.weather || 'Perfect Weather'}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight font-heading">
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
                    <h4 className="text-xl font-bold mb-2 font-heading">{item.title}</h4>
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
                <div className="font-bold font-heading">Lightning Fast</div>
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
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter font-heading">Ready to start your <br /> next adventure?</h2>
            <p className="text-xl text-brand-100 font-light">Join 50,000+ travelers exploring the world's most stunning horizons.</p>
            <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
              <Link to="/register">
                <Button variant="accent" size="lg" className="px-12 bg-white text-brand-600 hover:bg-slate-100">
                  Register Now
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="px-12 border-white text-white hover:bg-white/10">
                  Explore Catalog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
