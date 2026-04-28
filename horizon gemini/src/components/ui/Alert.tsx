import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

export const Alert = ({ variant = 'info', title, description, onClose, className }: AlertProps) => {
  const variants = {
    info: 'bg-brand-50 border-brand-100 text-brand-800',
    success: 'bg-green-50 border-green-100 text-green-800',
    warning: 'bg-amber-50 border-amber-100 text-amber-800',
    error: 'bg-rose-50 border-rose-100 text-rose-800',
  };

  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertCircle,
    error: XCircle,
  };

  const Icon = icons[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-2xl border flex gap-4 relative',
        variants[variant],
        className
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <div className="space-y-1">
        <h5 className="font-bold text-sm leading-tight">{title}</h5>
        {description && <p className="text-xs opacity-80 leading-relaxed font-medium">{description}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};
