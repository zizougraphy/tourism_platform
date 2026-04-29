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
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover brightness-[0.6]"
            alt="Horizon Landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-slate-900/90 pointer-events-none" />
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
                Welcome back, {user.name || user.email.split('@')[0]}
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
            <Link to={`/services${searchQuery ? \`?query=\${encodeURIComponent(searchQuery)}\` : ''}`} className="w-full md:w-auto">
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
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading text-slate-900">Popular Destinations</h2>
                <p className="text-slate-500 max-w-xl">Explore our hand-picked selection of the world's most captivating places.</p>
              </div>
              <Link to="/services">
                <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-full px-8">
                  View All Destinations
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {cities.slice(0, 4).map((dest, i) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group cursor-pointer aspect-[3/4] relative overflow-hidden rounded-[2.5rem] border-none shadow-xl">
                    <img
                      src={dest.images || 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800'}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={dest.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-2xl font-bold mb-2 font-heading">{dest.name}</h3>
                      <p className="text-sm opacity-0 group-hover:opacity-80 mb-4 line-clamp-2 transition-opacity duration-300">{dest.description || 'Discover amazing experiences here.'}</p>
                      <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 bg-brand-400/10 backdrop-blur-md w-fit px-3 py-1 rounded-full">
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

      {/* Featured Experiences */}
      {services.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading text-slate-900">Featured Experiences</h2>
                <p className="text-slate-500 max-w-xl">From luxury stays to authentic local tours, find your next adventure.</p>
              </div>
              <Link to="/services">
                <Button variant="accent" className="rounded-full px-8">
                  Browse All Experiences
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.slice(0, 4).map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="flex flex-col h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-[2rem] overflow-hidden bg-white">
                    <Link to={`/services/\${service.id}`} className="relative aspect-video overflow-hidden">
                      <img
                        src={service.image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        alt={service.name}
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-brand-600 uppercase tracking-widest shadow-sm">
                        {service.category}
                      </div>
                    </Link>
                    <div className="p-6 flex flex-col flex-grow space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <Link to={`/services/\${service.id}`}>
                          <h3 className="font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1 font-heading">{service.name}</h3>
                        </Link>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="w-3 h-3 fill-accent text-accent" />
                          <span className="font-bold text-xs">{service.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{service.city_name}</span>
                      </div>
                      <div className="pt-4 mt-auto flex items-center justify-between border-t border-slate-50">
                        <div className="font-bold text-slate-900">\${service.price}</div>
                        <Link to={`/services/\${service.id}`}>
                          <Button size="sm" variant="ghost" className="text-brand-600 font-bold hover:bg-brand-50 rounded-xl">Details</Button>
                        </Link>
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
      <section className="py-24 px-6 bg-slate-900 text-white rounded-[4rem] mx-6 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-10 leading-tight font-heading">
              Why Travelers <br />
              <span className="text-brand-400 underline decoration-brand-400/30">Trust Horizon</span>
            </h2>
            <div className="space-y-10">
              {[
                { title: 'Hand-picked Excellence', desc: 'Every hotel, restaurant, and tour is personally vetted by our local experts to ensure premium quality.', icon: Star },
                { title: 'Global Reach, Local Depth', desc: 'Operating in 50 countries with deep connections to authentic local experiences you won\'t find elsewhere.', icon: Globe },
                { title: 'Seamless Booking', desc: 'A frictionless experience from discovery to destination. Everything you need in one powerful platform.', icon: ShieldCheck },
              ].map((item, i) => (
                <div key={i} className="flex gap-8 group">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-3xl h-fit group-hover:bg-brand-500/20 transition-colors">
                    <item.icon className="w-8 h-8 text-brand-400" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-3 font-heading">{item.title}</h4>
                    <p className="text-slate-400 leading-relaxed text-lg">{item.desc}</p>
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
              className="rounded-[4rem] overflow-hidden shadow-2xl border border-white/10"
            >
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200"
                className="w-full h-[700px] object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                alt="Travel experiences"
              />
            </motion.div>
            <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[3rem] shadow-2xl max-w-[320px] hidden xl:block text-slate-900">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-100 p-3 rounded-2xl">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <div className="font-bold text-xl font-heading">Lightning Fast</div>
              </div>
              <p className="text-slate-500 leading-relaxed">Book your entire dream trip in less than 5 minutes. No hassle, just horizons.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto bg-brand-600 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-brand-200/50">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-400/20 rounded-full blur-[100px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -ml-64 -mb-64" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h2 className="text-5xl md:text-8xl font-bold tracking-tighter font-heading leading-none">Ready to start your <br /> next adventure?</h2>
            <p className="text-xl md:text-2xl text-brand-100 font-light">Join 50,000+ travelers exploring the world's most stunning horizons.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
              <Link to="/register">
                <Button variant="accent" size="lg" className="px-14 h-16 text-xl bg-white text-brand-600 hover:bg-slate-50 rounded-full shadow-xl">
                  Register Now
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="px-14 h-16 text-xl border-white/30 text-white hover:bg-white/10 rounded-full backdrop-blur-md">
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
