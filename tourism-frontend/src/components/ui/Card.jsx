import * as React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

const Card = React.forwardRef(
  ({ className, glass, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{ y: -4 }}
      className={cn(
        'rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden transition-shadow hover:shadow-xl dark:bg-slate-800 dark:border-slate-700/50',
        glass && 'glass-morphism',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export { Card };
