import React, { useState, useRef, useEffect } from 'react';
import { Users, Plus, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function GuestSelector({ guests, setGuests, className, align = "left" }) {
  const [isOpen, setIsOpen] = useState(false);
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

  const totalGuests = guests.adults + guests.children;

  const updateAdults = (val) => {
    if (val < 1 || val + guests.children > 10) return;
    setGuests(prev => ({ ...prev, adults: val }));
  };

  const updateChildren = (val) => {
    if (val < 0 || guests.adults + val > 10) return;
    setGuests(prev => ({ ...prev, children: val }));
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div 
        className="flex items-center gap-3 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-slate-100 font-medium outline-none cursor-pointer w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Users className="text-brand-500 w-5 h-5 flex-shrink-0" />
        <span className="text-slate-900 dark:text-slate-100 truncate">
          {guests.adults} {guests.adults === 1 ? 'Adult' : 'Adults'}
          {guests.children > 0 ? `, ${guests.children} ${guests.children === 1 ? 'Child' : 'Children'}` : ''}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={cn(
              "absolute top-full mt-4 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 p-6 z-50 min-w-[280px] space-y-6",
              align === "left" ? "left-0" : "right-0"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">Adults</div>
                <div className="text-xs text-slate-400">Ages 13 or above</div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => updateAdults(guests.adults - 1)}
                  disabled={guests.adults <= 1}
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:border-brand-500 hover:text-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold w-4 text-center">{guests.adults}</span>
                <button 
                  onClick={() => updateAdults(guests.adults + 1)}
                  disabled={totalGuests >= 10}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-brand-500 hover:text-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">Children</div>
                <div className="text-xs text-slate-400">Ages 2-12</div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => updateChildren(guests.children - 1)}
                  disabled={guests.children <= 0}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-brand-500 hover:text-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold w-4 text-center">{guests.children}</span>
                <button 
                  onClick={() => updateChildren(guests.children + 1)}
                  disabled={totalGuests >= 10}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-brand-500 hover:text-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-bold pt-4 border-t border-slate-50 dark:border-slate-700">
              Maximum 10 guests
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
