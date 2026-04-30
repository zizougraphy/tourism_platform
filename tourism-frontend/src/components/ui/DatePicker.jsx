import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function DatePicker({ date, setDate, className, placeholder = "Add dates", align = "left" }) {
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

  // Format display text
  let displayText = placeholder;
  if (date?.from) {
    if (date.to) {
      displayText = `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`;
    } else {
      displayText = format(date.from, "LLL dd, y");
    }
  }

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div 
        className="flex items-center gap-3 bg-transparent border-none focus:ring-0 text-slate-900 font-medium outline-none cursor-pointer w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="text-brand-500 w-5 h-5 flex-shrink-0" />
        <span className={cn("truncate", date?.from ? "text-slate-900" : "text-slate-400")}>
          {displayText}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={cn(
              "absolute top-full mt-4 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-4 z-50",
              align === "left" ? "left-0" : "right-0"
            )}
          >
            <DayPicker
              mode="range"
              defaultMonth={date?.from || new Date()}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
              disabled={{ before: new Date() }}
              className="font-sans"
              classNames={{
                day_selected: "bg-brand-600 text-white hover:bg-brand-600 hover:text-white focus:bg-brand-600 focus:text-white",
                day_range_middle: "bg-brand-50 text-brand-900 rounded-none",
                day_range_start: "bg-brand-600 text-white rounded-l-full",
                day_range_end: "bg-brand-600 text-white rounded-r-full",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
