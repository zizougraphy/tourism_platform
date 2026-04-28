import { motion } from 'motion/react';
import { Mail, Phone, MapPin, MessageSquare, Send, Globe, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

const ContactPage = () => {
  return (
    <div className="pt-24 min-h-screen">
      <section className="py-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-8">
              Let's Map Your <br />
              <span className="text-gradient">Next Adventure.</span>
            </h1>
            <p className="text-slate-500 text-xl leading-relaxed max-w-md">
              Have questions about a destination, a booking, or a partnership? Our team is available 24/7.
            </p>
          </div>

          <div className="space-y-8">
            {[
              { label: 'Email Sales', value: 'sales@horizon.com', icon: Mail },
              { label: 'Support Line', value: '+1 (800) HORIZON', icon: Phone },
              { label: 'Headquarters', value: '789 Vista Avenue, San Francisco', icon: MapPin },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-brand-50 transition-colors">
                  <item.icon className="w-6 h-6 text-slate-400 group-hover:text-brand-600" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest font-bold text-slate-400">{item.label}</div>
                  <div className="text-lg font-bold text-slate-900">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-slate-400">Follow our journey</h4>
            <div className="flex gap-4">
              <Button variant="secondary" size="icon" className="rounded-full">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Globe className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <Card className="p-10 md:p-14 border-none shadow-2xl rounded-[3rem] space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16" />
            
            <div className="relative z-10 space-y-2">
              <h3 className="text-2xl font-bold">Send a Message</h3>
              <p className="text-slate-500 text-sm">Fill out the form below and we'll get back to you within 2 hours.</p>
            </div>

            <form className="space-y-6 relative z-10" onSubmit={e => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">First Name</label>
                  <Input placeholder="John" className="h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Last Name</label>
                  <Input placeholder="Doe" className="h-14 rounded-2xl" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <Input type="email" placeholder="john@example.com" className="h-14 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Message</label>
                <textarea 
                  className="w-full min-h-[150px] rounded-[2rem] border border-slate-200 p-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="How can we help you explore?"
                ></textarea>
              </div>
              <Button size="lg" className="w-full h-16 rounded-2xl text-lg font-bold">
                <Send className="w-5 h-5 mr-3" />
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="rounded-[3rem] h-[400px] bg-slate-100 flex items-center justify-center overflow-hidden grayscale relative border border-slate-200">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover opacity-50" alt="Map" />
          <div className="absolute inset-0 bg-brand-900/10" />
          <div className="relative z-10 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4">
            <div className="bg-brand-600 p-3 rounded-2xl">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold">Horizon HQ</div>
              <div className="text-xs text-slate-400">San Francisco, CA</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
