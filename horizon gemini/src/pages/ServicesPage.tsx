import * as React from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, Heart, Filter, ChevronDown, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { SERVICES } from '../data/mockData';
import { Link } from 'react-router-dom';
import { ServiceCategory } from '../types';

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<ServiceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredServices = SERVICES.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         service.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Explore Services</h1>
            <p className="text-slate-500">Discover top-rated hotels, restaurants, and guided tours.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="Search services or cities..." 
              className="pl-12 bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
            <div>
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Categories
              </h4>
              <div className="space-y-2">
                {['all', ...Object.values(ServiceCategory)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as any)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-brand-600 text-white' 
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Price Range</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>$0</span>
                  <span>$1,000+</span>
                </div>
                <input type="range" className="w-full accent-brand-600" />
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Rating</h4>
              <div className="space-y-2">
                {[5, 4, 3].map((star) => (
                  <label key={star} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                    <div className="flex items-center gap-1">
                      {Array.from({ length: star }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                      <span className="text-sm text-slate-600">& up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full">Reset Filters</Button>
          </aside>

          {/* Results Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-8">
              <span className="text-slate-500 text-sm">{filteredServices.length} results found</span>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer hover:text-brand-600">
                Sort by: Recommended <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredServices.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full border-none shadow-md hover:shadow-xl group">
                    <Link to={`/services/${service.id}`} className="block relative aspect-video overflow-hidden">
                      <img 
                        src={service.images[0]} 
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-600 uppercase tracking-widest">
                        {service.category}
                      </div>
                      <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-slate-400 hover:text-rose-500 transition-colors shadow-sm">
                        <Heart className="w-5 h-5" />
                      </button>
                    </Link>

                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <Link to={`/services/${service.id}`}>
                          <h3 className="text-xl font-bold hover:text-brand-600 transition-colors line-clamp-1">{service.title}</h3>
                        </Link>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-bold text-sm tracking-tight">{service.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{service.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {service.amenities.slice(0, 3).map((amenity) => (
                          <span key={amenity} className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                            {amenity}
                          </span>
                        ))}
                        {service.amenities.length > 3 && (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-2 py-1">
                            +{service.amenities.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="pt-4 mt-auto flex items-center justify-between border-t border-slate-50">
                        <div>
                          <span className="text-2xl font-bold text-slate-900">${service.price}</span>
                          <span className="text-slate-400 text-sm font-medium"> / night</span>
                        </div>
                        <Link to={`/services/${service.id}`}>
                          <Button size="sm" variant="primary">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                <div className="mb-4 inline-flex p-4 bg-slate-50 rounded-full">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No services found</h3>
                <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                <Button variant="secondary" className="mt-6" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
