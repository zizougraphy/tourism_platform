import { cn } from '../lib/utils';

export default function Logo({ className, size = 42, textColor = 'primary' }) {
  const textClasses = {
    dark: 'text-dark-slate',
    light: 'text-white',
    primary: 'text-primary-ocean',
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 bg-primary-ocean rounded-xl"></div>
        <div className="absolute top-[30%] left-[60%] -translate-x-1/2 w-[45%] h-[45%] bg-sunset-gold rounded-full shadow-[0_0_15px_rgba(221,168,83,0.4)]"></div>
        <div className="absolute bottom-[15%] left-0 w-full h-[35%] overflow-hidden">
          <svg viewBox="0 0 100 40" className="w-full h-full text-[#3BA7C9]/40 fill-current" preserveAspectRatio="none">
            <path d="M0 20 Q 25 10 50 20 T 100 20 L 100 40 L 0 40 Z" />
          </svg>
          <svg viewBox="0 0 100 40" className="absolute top-2 w-full h-full text-white/20 fill-current" preserveAspectRatio="none">
            <path d="M0 20 Q 25 30 50 20 T 100 20 L 100 40 L 0 40 Z" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className={cn(
          "text-[22px] font-serif font-bold tracking-[0.1em] uppercase leading-none",
          textClasses[textColor]
        )}>
          THE HORIZON
        </span>
        <span className={cn(
          "text-[8px] font-sans font-bold tracking-[0.25em] uppercase mt-1 opacity-70",
          textClasses[textColor]
        )}>
          EXPLORE. DREAM. DISCOVER.
        </span>
      </div>
    </div>
  );
}
