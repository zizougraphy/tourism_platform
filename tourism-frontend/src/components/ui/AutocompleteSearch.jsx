import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Map, Building2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import * as api from '../../api/axios';

export function AutocompleteSearch({ value, onChange, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState({ cities: [], services: [] });
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value) {
        setLoading(true);
        try {
          const res = await api.getCities();
          setSuggestions({ cities: res.data.data?.slice(0, 4) || [], services: [] });
        } catch (err) {
        } finally {
          setLoading(false);
        }
        return;
      }
      
      setLoading(true);
      try {
        const [citiesRes, servicesRes] = await Promise.all([
          api.getCities({ search: value }),
          api.getServices({ search: value, limit: 4 })
        ]);
        
        setSuggestions({
          cities: citiesRes.data.data?.slice(0, 4) || [],
          services: servicesRes.data.data?.slice(0, 4) || []
        });
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = (item) => {
    onChange(item.name);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div className="flex items-center gap-3 w-full">
        <MapPin className="text-brand-500 w-5 h-5 flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Where to next?"
          className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium outline-none p-0"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-4 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 p-4 z-50 w-full min-w-[300px]"
          >
            {loading && !suggestions.cities.length && !suggestions.services.length ? (
              <div className="text-center p-4 text-sm font-medium text-slate-400">Searching...</div>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar">
                {!value && suggestions.cities.length > 0 && (
                  <div className="px-2 pb-2">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Popular Destinations</div>
                    {suggestions.cities.map(city => (
                      <div 
                        key={`pop-${city.id}`}
                        onClick={() => handleSelect(city)}
                        className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                          <Map className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{city.name}</div>
                          <div className="text-xs text-slate-400">{city.country}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {value && suggestions.cities.length > 0 && (
                  <div className="px-2 pb-2">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Cities</div>
                    {suggestions.cities.map(city => (
                      <div 
                        key={`city-${city.id}`}
                        onClick={() => handleSelect(city)}
                        className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <Map className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{city.name}</div>
                          <div className="text-xs text-slate-400">{city.country}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {value && suggestions.services.length > 0 && (
                  <div className="px-2">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Experiences</div>
                    {suggestions.services.map(service => (
                      <div 
                        key={`srv-${service.id}`}
                        onClick={() => handleSelect(service)}
                        className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">{service.name}</div>
                          <div className="text-xs text-slate-400 line-clamp-1">{service.city_name} • {service.category}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {value && !loading && !suggestions.cities.length && !suggestions.services.length && (
                  <div className="text-center p-4 text-sm font-medium text-slate-400">No results found for "{value}"</div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
