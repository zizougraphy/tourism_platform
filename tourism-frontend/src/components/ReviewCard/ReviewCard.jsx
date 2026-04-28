import { Star, Quote } from 'lucide-react';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white p-10 rounded-[18px] luxury-shadow border border-soft-border/50 relative h-full group hover:bg-ivory/20 transition-all duration-500">
      <div className="absolute top-10 right-10 text-primary-ocean/5 group-hover:text-sunset-gold/10 transition-colors duration-500">
        <Quote size={80} fill="currentColor" />
      </div>
      <div className="flex items-center gap-5 mb-8 relative z-10">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-ivory flex items-center justify-center text-primary-ocean font-bold text-xl font-serif">
            {(review.user_name || review.user || 'A').charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-sunset-gold rounded-full border-2 border-white flex items-center justify-center">
            <Star size={10} className="text-white fill-white" />
          </div>
        </div>
        <div>
          <h4 className="font-serif font-bold text-xl text-dark-slate">{review.user_name || review.user}</h4>
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-slate">Verified Member</span>
        </div>
      </div>
      <div className="flex gap-1 mb-6 relative z-10">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className={i < (review.rating || 5) ? "fill-sunset-gold text-sunset-gold" : "text-soft-border"} />
        ))}
      </div>
      <p className="text-muted-slate leading-relaxed font-sans font-light italic text-lg relative z-10">
        &quot;{review.comment}&quot;
      </p>
    </div>
  );
}
