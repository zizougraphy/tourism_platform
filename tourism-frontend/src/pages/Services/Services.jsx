import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, Heart, Filter, ChevronDown, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Link, useSearchParams } from 'react-router-dom';
import * as api from '../../api/axios';
import { useFavorites } from '../../context/FavoritesContext';

const Services = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('query') || '';
  const categoryParam = searchParams.get('category') || 'all';
  
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam.toLowerCase());
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [guests, setGuests] = useState(1);
  const [sortBy, setSortBy] = useState('recommended');
  const [loading, setLoading] = useState(true);
  
  const { toggleFavorite, isFavorite } = useFavorites();

  const categories = ['all', 'hotel', 'restaurant', 'guide', 'transport', 'activity'];

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (searchQuery) params.search = searchQuery;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (minRating) params.min_rating = minRating;
    if (sortBy) params.sort = sortBy;

    api.getServices(params)
      .then(res => setServices(res.data.data || res.data.services || res.data || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, minPrice, maxPrice, minRating, sortBy]);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 font-heading">Explore Services</h1>
            <p className="text-slate-500">Discover top-rated hotels, restaurants, and guided tours.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search services or cities..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
            <div>
              <h4 className="font-bold mb-4 flex items-center gap-2 font-heading">
                <Filter className="w-4 h-4" />
                Categories
              </h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors capitalize ${
                      selectedCategory === cat 
                        ? 'bg-brand-600 text-white shadow-md' 
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="font-bold mb-4 flex items-center gap-2 font-heading">Price Range</h4>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice} 
                  onChange={(e) => setMinPrice(e.target.value)} 
                  className="w-full"
                />
                <span className="text-slate-400">-</span>
                <Input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(e.target.value)} 
                  className="w-full"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="font-bold mb-4 flex items-center gap-2 font-heading">Minimum Rating</h4>
              <div className="space-y-2">
                {[5, 4, 3].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={Number(minRating) === rating}
                      onChange={() => setMinRating(rating)}
                      className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                    />
                    <div className="flex items-center gap-1 group-hover:text-brand-600 transition-colors">
                      {Array.from({length: rating}).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                      <span className="text-sm font-medium text-slate-600 ml-1">& up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Guests Placeholder */}
            <div>
              <h4 className="font-bold mb-4 flex items-center gap-2 font-heading">Guests</h4>
              <Input 
                type="number" 
                min="1"
                max="10"
                value={guests} 
                onChange={(e) => setGuests(e.target.value)} 
                className="w-full"
              />
              <p className="text-xs text-slate-400 mt-2">* Visual placeholder for UI consistency</p>
            </div>

            <Button variant="outline" className="w-full" onClick={() => { 
              setSelectedCategory('all'); 
              setSearchQuery(''); 
              setMinPrice(''); 
              setMaxPrice(''); 
              setMinRating('');
              setGuests(1);
            }}>
              Reset Filters
            </Button>
          </aside>

          {/* Results Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-8">
              <span className="text-slate-500 text-sm font-medium">{services.length} results found</span>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <span>Sort by:</span>
                <select 
                  className="bg-transparent border-none font-bold text-slate-900 focus:ring-0 cursor-pointer outline-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-slate-500">Loading services...</div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service, i) => {
                  const favorite = isFavorite(service.id);
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="h-full border-none shadow-md hover:shadow-xl group flex flex-col">
                        <Link to={`/services/${service.id}`} className="block relative aspect-video overflow-hidden shrink-0">
                          <img 
                            src={service.image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'} 
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-600 uppercase tracking-widest shadow-sm">
                            {service.category || 'Service'}
                          </div>
                          <button 
                            onClick={(e) => { e.preventDefault(); toggleFavorite(service); }}
                            className={`absolute top-4 right-4 p-2 backdrop-blur rounded-full transition-colors shadow-sm ${
                              favorite ? 'bg-rose-50 text-rose-500' : 'bg-white/90 text-slate-400 hover:text-rose-500'
                            }`}
                          >
                            <Heart className="w-5 h-5" fill={favorite ? "currentColor" : "none"} />
                          </button>
                        </Link>

                        <div className="p-6 space-y-4 flex flex-col flex-grow">
                          <div className="flex justify-between items-start gap-4">
                            <Link to={`/services/${service.id}`}>
                              <h3 className="text-xl font-bold hover:text-brand-600 transition-colors line-clamp-1 font-heading">{service.name}</h3>
                            </Link>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Star className="w-4 h-4 fill-accent text-accent" />
                              <span className="font-bold text-sm tracking-tight">{service.rating || '4.5'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                            <MapPin className="w-4 h-4" />
                            <span>{service.location || service.city_name || 'Unknown Location'}</span>
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
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                <div className="mb-4 inline-flex p-4 bg-slate-50 rounded-full">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">No services found</h3>
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

export default Services;