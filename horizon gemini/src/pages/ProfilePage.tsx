import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Camera, Settings, ChevronRight, LogOut, ShieldCheck, Heart, Calendar, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const ProfilePage = () => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-12">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="text-center space-y-4">
            <div className="relative inline-block group">
              <img src="https://i.pravatar.cc/150?u=me" className="w-40 h-40 rounded-[3rem] border-4 border-white shadow-xl" alt="Profile" />
              <button className="absolute bottom-2 right-2 p-3 bg-brand-600 text-white rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">James Alexander</h2>
              <p className="text-slate-400 font-medium">Premium Member since 2021</p>
            </div>
          </div>

          <div className="space-y-1">
            {[
              { label: 'Personal Info', icon: User, active: true },
              { label: 'Bookings', icon: Calendar, active: false },
              { label: 'Favorites', icon: Heart, active: false },
              { label: 'Reviews', icon: Star, active: false },
              { label: 'Security', icon: ShieldCheck, active: false },
              { label: 'Settings', icon: Settings, active: false },
            ].map(item => (
              <button 
                key={item.label}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all group ${
                  item.active ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-slate-500 hover:bg-white hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </div>
                {!item.active && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />}
              </button>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-200">
            <Button variant="ghost" className="w-full justify-start text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-2xl p-6 font-bold">
              <LogOut className="w-5 h-5 mr-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3 space-y-12">
          {/* Personal Info */}
          <section className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Personal Information</h1>
                <p className="text-slate-500">Update your account details and travel preferences.</p>
              </div>
              <Button variant="outline">Discard Changes</Button>
            </div>

            <Card className="p-10 border-none shadow-sm space-y-8 rounded-[3rem]">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">Full Name</label>
                  <Input defaultValue="James Alexander" className="h-14 rounded-2xl" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <Input defaultValue="james.alex@example.com" className="h-14 rounded-2xl" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">Phone Number</label>
                  <Input defaultValue="+1 (555) 000-0000" className="h-14 rounded-2xl" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">Language</label>
                  <select className="w-full h-14 rounded-2xl border border-slate-200 px-6 font-medium focus:ring-2 focus:ring-brand-500 outline-none">
                    <option>English (US)</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Bio / Travel Philosophy</label>
                <textarea 
                  className="w-full min-h-[120px] rounded-[2rem] border border-slate-200 p-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  defaultValue="Passionate explorer seeking authentic moments and architectural wonders. My heart belongs to the Mediterranean coasts and Kyoto's zen gardens."
                />
              </div>

              <div className="pt-8 border-t border-slate-50 flex justify-end">
                <Button size="lg" className="px-12">Save Changes</Button>
              </div>
            </Card>
          </section>

          {/* Preferences */}
          <section className="space-y-8">
            <h3 className="text-2xl font-bold">Travel Preferences</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Dietary', value: 'Vegetarian', active: true },
                { label: 'Bed Type', value: 'King Size', active: false },
                { label: 'Floor', value: 'High Floor', active: true },
              ].map((pref, i) => (
                <Card key={i} className={`p-6 border-none shadow-sm rounded-3xl cursor-pointer transition-all ${pref.active ? 'ring-2 ring-brand-500 bg-brand-50/20' : 'hover:bg-white'}`}>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{pref.label}</div>
                  <div className="font-bold">{pref.value}</div>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
