import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'outline';
  className?: string;
}

export const Badge = ({ children, variant = 'primary', className }: BadgeProps) => {
  const variants = {
    primary: 'bg-brand-50 text-brand-600',
    secondary: 'bg-slate-100 text-slate-600',
    accent: 'bg-amber-50 text-amber-700',
    success: 'bg-green-50 text-green-700',
    error: 'bg-rose-50 text-rose-700',
    outline: 'border border-slate-200 text-slate-500 bg-transparent',
  };

  return (
    <span className={cn(
      'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
