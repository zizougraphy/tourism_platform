import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?query=${destination}`);
  };

  return (
    <div className="bg-white rounded-2xl md:rounded-[32px] shadow-2xl p-2 w-full border border-soft-border/30 luxury-shadow">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center">
        <div className="flex-1 w-full flex flex-col md:flex-row">
          <div className="flex-1 px-8 py-4 text-left group cursor-pointer hover:bg-ivory/40 transition-colors rounded-[24px]">
            <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-slate block mb-1">Where to?</label>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-muted-slate/40 group-hover:text-sunset-gold transition-colors" />
              <input
                type="text"
                placeholder="Search destinations"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-transparent text-dark-slate font-sans font-semibold placeholder:text-muted-slate/30 focus:outline-none w-full text-base"
              />
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-soft-border self-center"></div>
          <div className="flex-1 px-8 py-4 text-left group cursor-pointer hover:bg-ivory/40 transition-colors rounded-[24px]">
            <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-slate block mb-1">Check in - Check out</label>
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-muted-slate/40 group-hover:text-sunset-gold transition-colors" />
              <p className="text-dark-slate font-sans font-semibold text-base whitespace-nowrap opacity-30">Add dates</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-soft-border self-center"></div>
          <div className="flex-1 px-8 py-4 text-left group cursor-pointer hover:bg-ivory/40 transition-colors rounded-[24px]">
            <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-slate block mb-1">Guests</label>
            <div className="flex items-center gap-3">
              <Users size={18} className="text-muted-slate/40 group-hover:text-sunset-gold transition-colors" />
              <p className="text-dark-slate font-sans font-semibold text-base">2 guests</p>
            </div>
          </div>
        </div>
        <button type="submit" className="bg-sunset-gold hover:bg-sunset-gold/90 text-white px-12 py-5 rounded-[24px] font-bold shadow-xl shadow-sunset-gold/10 flex items-center gap-3 transition-all duration-500 hover:scale-[1.02] active:scale-95 m-1 group">
          <Search size={20} className="stroke-[3px] group-hover:scale-110 transition-transform" />
          <span className="tracking-wide">Search</span>
        </button>
      </form>
    </div>
  );
}
