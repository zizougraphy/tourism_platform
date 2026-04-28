import { motion } from 'motion/react';
import { Image, MapPin, DollarSign, List, Info, ChevronRight, Save, Trash2, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import { ServiceCategory } from '../../types';

const AddServicePage = () => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <DashboardSidebar />
      
      <main className="flex-grow p-8 md:p-12 max-w-5xl">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-4">
            <span>My Services</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-600 font-bold">Add New Service</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Create New Offering</h1>
          <p className="text-slate-500">Reach thousands of travelers by publishing your premium services.</p>
        </header>

        <form className="space-y-12" onSubmit={e => e.preventDefault()}>
          {/* Basic Info */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Info className="w-5 h-5 text-brand-600" />
              General Information
            </h3>
            <Card className="p-8 border-none shadow-sm space-y-6 rounded-[2rem]">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Service Title</label>
                <Input placeholder="e.g. Ocean View Luxury Suite" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Category</label>
                  <select className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    {Object.values(ServiceCategory).map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Starting Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input type="number" placeholder="250" className="pl-12" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <textarea 
                  className="w-full min-h-[150px] rounded-2xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Describe the unique experience you offer..."
                ></textarea>
              </div>
            </Card>
          </section>

          {/* Location & Amenities */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-600" />
              Location & Details
            </h3>
            <Card className="p-8 border-none shadow-sm space-y-6 rounded-[2rem]">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">City</label>
                  <Input placeholder="e.g. Santorini" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Full Address</label>
                  <Input placeholder="123 Coastal Road, Oia" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">Key Amenities</label>
                <div className="flex flex-wrap gap-3">
                  {['WiFi', 'Pool', 'Breakfast', 'Spa', 'Gym', 'Parking', 'Beach Access'].map(item => (
                    <button key={item} className="px-5 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:border-brand-500 hover:text-brand-600 transition-all">
                      {item}
                    </button>
                  ))}
                  <button className="flex items-center gap-2 px-5 py-2 bg-brand-50 border border-brand-100 rounded-xl text-sm font-bold text-brand-600">
                    <Plus className="w-4 h-4" />
                    Add Custom
                  </button>
                </div>
              </div>
            </Card>
          </section>

          {/* Media */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Image className="w-5 h-5 text-brand-600" />
              Media Gallery
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                <Plus className="w-8 h-8 text-slate-300 mb-2" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Upload Image</span>
              </div>
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square rounded-[2rem] overflow-hidden relative group">
                  <img src={`https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=400&u=${i}`} className="w-full h-full object-cover" />
                  <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <footer className="pt-8 flex justify-end gap-4 border-t border-slate-200">
            <Button variant="outline" size="lg" className="px-10">Cancel</Button>
            <Button variant="primary" size="lg" className="px-12">
              <Save className="w-5 h-5 mr-2" />
              Publish Service
            </Button>
          </footer>
        </form>
      </main>
    </div>
  );
};

export default AddServicePage;
