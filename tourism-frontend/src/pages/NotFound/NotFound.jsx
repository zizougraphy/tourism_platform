import { motion } from 'motion/react';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-10">
        <div className="relative inline-block">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="bg-brand-600 p-8 rounded-[2.5rem] shadow-2xl shadow-brand-500/40 relative z-10"
          >
            <Compass className="w-20 h-20 text-white" />
          </motion.div>
          <div className="absolute inset-0 bg-brand-400 rounded-full blur-3xl opacity-20 -z-10" />
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl font-bold tracking-tighter text-slate-900 leading-none font-heading">404</h1>
          <h2 className="text-2xl font-bold text-slate-700 font-heading">Lost in the Horizon?</h2>
          <p className="text-slate-500 font-medium">The destination you're looking for doesn't exist or has moved to another part of the world.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto px-10">
              <Home className="w-5 h-5 mr-3" />
              Back to Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto px-10"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-3" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
