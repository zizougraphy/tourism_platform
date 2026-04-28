import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export const Skeleton = ({ className, variant = 'rounded' }: SkeletonProps) => {
  const variants = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-2xl',
  };

  return (
    <div 
      className={cn(
        'animate-pulse bg-slate-100',
        variants[variant],
        className
      )} 
    />
  );
};
