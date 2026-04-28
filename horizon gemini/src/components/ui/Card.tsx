import * as React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

export interface CardProps extends HTMLMotionProps<'div'> {
  glass?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{ y: -4 }}
      className={cn(
        'rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden transition-shadow hover:shadow-xl',
        glass && 'glass-morphism',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export { Card };
