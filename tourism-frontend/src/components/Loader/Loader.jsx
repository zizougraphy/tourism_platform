import { motion } from 'motion/react';
import { Compass } from 'lucide-react';

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="w-16 h-16 bg-sunset-gold rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-sunset-gold/20 mb-6"
      >
        <Compass size={32} />
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-primary-ocean font-serif font-bold text-xl tracking-tighter">
        THE HORIZON
      </motion.p>
      <div className="mt-4 w-48 h-1 bg-ivory rounded-full overflow-hidden">
        <motion.div animate={{ left: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="relative h-full w-1/2 bg-sunset-gold" />
      </div>
    </div>
  );
}
