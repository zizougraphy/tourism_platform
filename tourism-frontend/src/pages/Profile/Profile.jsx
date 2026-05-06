import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, Camera, Settings, ChevronRight, LogOut, ShieldCheck, Heart, Calendar, Star, Save, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../../api/axios';

const PREFERENCE_OPTIONS = [
  { label: 'Dietary', options: ['No Preference', 'Vegetarian', 'Vegan', 'Halal', 'Gluten-Free'] },
  { label: 'Bed Type', options: ['No Preference', 'Single', 'Double', 'King Size', 'Twin'] },
  { label: 'Floor', options: ['No Preference', 'Low Floor', 'Mid Floor', 'High Floor'] },
];

const Profile = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  // Editable form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    profile_photo: '',
  });
  const [preferences, setPreferences] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Initialize from user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        profile_photo: user.profile_photo || '',
      });
      // Parse travel_preferences from JSON if available
      try {
        const prefs = user.travel_preferences ? JSON.parse(user.travel_preferences) : {};
        setPreferences(prefs);
      } catch {
        setPreferences({});
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePreferenceChange = (label, value) => {
    setPreferences(prev => ({ ...prev, [label]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const payload = new FormData();
      if (formData.name) payload.append('name', formData.name);
      if (formData.phone) payload.append('phone', formData.phone);
      if (formData.bio) payload.append('bio', formData.bio);
      payload.append('travel_preferences', JSON.stringify(preferences));
      
      if (photoFile) {
        payload.append('profile_photo', photoFile);
      } else if (formData.profile_photo && !formData.profile_photo.startsWith('blob:')) {
        payload.append('profile_photo', formData.profile_photo);
      }

      const res = await api.updateProfile(payload);
      setUser(res.data.user);
      setSaveMsg('Profile updated successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setPhotoFile(null);
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        profile_photo: user.profile_photo || '',
      });
      try {
        const prefs = user.travel_preferences ? JSON.parse(user.travel_preferences) : {};
        setPreferences(prefs);
      } catch {
        setPreferences({});
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-12">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="text-center space-y-4">
            <div className="relative inline-block group">
              {photoFile ? (
                <img src={URL.createObjectURL(photoFile)} className="w-40 h-40 rounded-[3rem] border-4 border-white dark:border-slate-800 shadow-xl object-cover" alt="Profile" />
              ) : formData.profile_photo ? (
                <img src={formData.profile_photo.startsWith('http') ? formData.profile_photo : `http://localhost:3000${formData.profile_photo}`} className="w-40 h-40 rounded-[3rem] border-4 border-white dark:border-slate-800 shadow-xl object-cover" alt="Profile" />
              ) : (
                <div className="w-40 h-40 rounded-[3rem] border-4 border-white dark:border-slate-800 shadow-xl bg-brand-600 flex items-center justify-center text-white text-5xl font-bold font-heading">
                  {(formData.name || user?.name || 'T')[0].toUpperCase()}
                </div>
              )}
              <label 
                className="absolute bottom-2 right-2 p-3 bg-brand-600 text-white rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhotoFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading dark:text-white">{formData.name || user?.name || 'Traveler'}</h2>
              <p className="text-slate-400 font-medium capitalize">{user?.role === 'service_provider' ? 'Provider' : 'Tourist'}</p>
            </div>
          </div>

          <div className="space-y-1">
            <Link to="/profile" className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all bg-brand-600 text-white shadow-lg shadow-brand-500/20">
              <div className="flex items-center gap-4">
                <User className="w-5 h-5" />
                Personal Info
              </div>
            </Link>
            
            {user?.role !== 'service_provider' && (
              <>
                <Link to="/bookings" className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white group">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5" />
                    Bookings
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
                
                <Link to="/favorites" className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white group">
                  <div className="flex items-center gap-4">
                    <Heart className="w-5 h-5" />
                    Favorites
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
              </>
            )}
            
            {user?.role === 'service_provider' && (
              <Link to="/dashboard" className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white group">
                <div className="flex items-center gap-4">
                  <ShieldCheck className="w-5 h-5" />
                  Provider Dashboard
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>
            )}
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" className="w-full justify-start text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 rounded-2xl p-6 font-bold" onClick={handleLogout}>
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
                <h1 className="text-4xl font-bold tracking-tight font-heading dark:text-white">Personal Information</h1>
                <p className="text-slate-500 dark:text-slate-400">Update your account details and travel preferences.</p>
              </div>
              <Button variant="outline" onClick={handleDiscard}>Discard Changes</Button>
            </div>

            {saveMsg && (
              <div className={`p-4 rounded-2xl text-sm font-medium ${saveMsg.includes('success') ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
                {saveMsg}
              </div>
            )}

            <Card className="p-10 border-none shadow-sm space-y-8 rounded-[3rem]">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                  <Input name="name" value={formData.name} onChange={handleChange} className="h-14 rounded-2xl" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                  <Input defaultValue={user?.email || ''} className="h-14 rounded-2xl" readOnly />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} className="h-14 rounded-2xl" placeholder="+213 555 000 000" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Profile Photo URL</label>
                  <Input name="profile_photo" value={formData.profile_photo} onChange={handleChange} className="h-14 rounded-2xl" placeholder="https://..." />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Bio / Travel Philosophy</label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full min-h-[120px] rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="Tell us about your travel philosophy..."
                />
              </div>

              <div className="pt-8 border-t border-slate-50 dark:border-slate-700 flex justify-end gap-4">
                <Button size="lg" className="px-12" onClick={handleSave} disabled={saving}>
                  <Save className="w-5 h-5 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Card>
          </section>

          {/* Preferences */}
          <section className="space-y-8">
            <h3 className="text-2xl font-bold font-heading dark:text-white">Travel Preferences</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {PREFERENCE_OPTIONS.map((pref, i) => (
                <Card key={i} className="p-6 border-none shadow-sm rounded-3xl space-y-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{pref.label}</div>
                  <select
                    value={preferences[pref.label] || 'No Preference'}
                    onChange={(e) => handlePreferenceChange(pref.label, e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {pref.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;
