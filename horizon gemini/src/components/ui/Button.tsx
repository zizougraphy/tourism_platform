import * as React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-md',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
      outline: 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
      accent: 'bg-accent text-white hover:bg-amber-600 shadow-md',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-2.5',
      lg: 'px-8 py-3.5 text-lg font-medium',
      icon: 'p-2',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ translateY: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
