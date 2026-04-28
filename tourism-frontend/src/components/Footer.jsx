import { Link } from 'react-router-dom';
import { Compass, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white font-heading">Horizon</span>
          </Link>
          <p className="text-slate-400 leading-relaxed">
            Crafting unforgettable journeys for curious souls. Discover the world's most breathtaking destinations and premium services curated just for you.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-slate-900 rounded-full hover:text-brand-400 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-slate-900 rounded-full hover:text-brand-400 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-slate-900 rounded-full hover:text-brand-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-slate-900 rounded-full hover:text-brand-400 transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6 font-heading text-lg">Explore</h4>
          <ul className="space-y-4">
            <li><Link to="/services" className="hover:text-white transition-colors">Destinations</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Travel Services</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-bold mb-6 font-heading text-lg">Services</h4>
          <ul className="space-y-4">
            <li><Link to="/services?category=hotel" className="hover:text-white transition-colors">Hotels & Resorts</Link></li>
            <li><Link to="/services?category=restaurant" className="hover:text-white transition-colors">Exquisite Dining</Link></li>
            <li><Link to="/services?category=guide" className="hover:text-white transition-colors">Guided Tours</Link></li>
            <li><Link to="/services?category=transport" className="hover:text-white transition-colors">Luxury Transport</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-bold mb-6 font-heading text-lg">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-500" />
              <span>hello@horizon.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand-500" />
              <span>+1 (234) 567-890</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-brand-500" />
              <span>123 Travel Way, San Francisco</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-slate-500">
          © {currentYear} Horizon Tourism. All rights reserved.
        </p>
        <div className="flex gap-8 text-sm text-slate-500">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
