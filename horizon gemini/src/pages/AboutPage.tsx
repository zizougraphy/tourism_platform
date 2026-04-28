import { motion } from 'motion/react';
import { Compass, Users, Globe, Award, Heart, ShieldCheck, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const AboutPage = () => {
  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 z-[-1]" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-brand-50 rounded-full border border-brand-100 italic font-medium text-brand-600">
              Our Journey Since 2018
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.9]">
              Connecting Souls to <span className="text-gradient">Horizons.</span>
            </h1>
            <p className="text-slate-500 text-xl leading-relaxed max-w-xl">
              Horizon was born from a simple belief: travel isn't just about the destination, it's about the depth of connection and the quality of every single moment.
            </p>
            <div className="flex gap-4">
              <Button variant="primary" size="lg">Join the Mission</Button>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
          </div>
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[3rem] overflow-hidden shadow-2xl relative z-10"
            >
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" className="w-full h-[600px] object-cover" alt="Team" />
            </motion.div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent rounded-[3rem] z-[-1]" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 bg-brand-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { value: '50K+', label: 'Global Travelers' },
            { value: '1.2K', label: 'Verified Partners' },
            { value: '50+', label: 'Countries Reached' },
            { value: '4.9', label: 'Average Rating' }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-4xl md:text-6xl font-bold text-brand-400">{stat.value}</div>
              <div className="text-xs uppercase tracking-widest font-bold opacity-60">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-5xl font-bold">The Horizon Creed</h2>
          <div className="space-y-6 text-slate-600 text-lg leading-loose text-left">
            <p>
              Travel is the ultimate bridge between cultures. We believe that by providing a platform that prioritizes trust, beauty, and seamless integration, we facilitate a world that is more connected, more empathetic, and infinitely more inspired.
            </p>
            <p>
              Our team consists of lifelong travelers, local guides, and technology architects who are dedicated to removing the friction from discovery. We don't just list places; we curate possibilities.
            </p>
            <p>
              Whether you're a provider looking to share your oasis with the world or a traveler searching for your next great memory, Horizon is your partner in every mile.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-16">
          <h2 className="text-4xl font-bold text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'Radical Transparency', desc: 'Real reviews, verified partners, and no hidden fees. Ever.', icon: ShieldCheck },
              { title: 'Obsessive Quality', desc: 'We only partner with services that meet our strict Gold Standard of excellence.', icon: Award },
              { title: 'Global Empathy', desc: 'Travel is a human experience. We design for connection across cultures.', icon: Heart },
            ].map((value, i) => (
              <Card key={i} className="p-10 border-none shadow-sm space-y-6 rounded-[2.5rem]">
                <div className="bg-brand-50 w-16 h-16 rounded-2xl flex items-center justify-center text-brand-600">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">{value.title}</h3>
                <p className="text-slate-500 leading-relaxed">{value.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
