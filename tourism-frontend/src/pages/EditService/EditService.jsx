import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Image, MapPin, DollarSign, List, Info, ChevronRight, Save, Trash2, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Sidebar from '../../components/Sidebar/Sidebar';
import * as api from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({ 
    name: '', 
    category: 'hotel', 
    city_id: '', 
    price: '', 
    description: '',
    image_url: '' 
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch cities
    api.getCities().then(res => setCities(res.data.data || res.data || [])).catch(() => {});
    
    // Fetch service data
    api.getServiceById(id)
      .then(res => {
        const data = res.data.data || res.data;
        setFormData({
          name: data.name || '',
          category: data.category || 'hotel',
          city_id: data.city_id || '',
          price: data.price || '',
          description: data.description || '',
          image_url: data.image_url || data.images || ''
        });
      })
      .catch(() => setError('Failed to load service data'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(''); setSuccess('');
    
    if (!formData.name || !formData.price || !formData.city_id) { 
      setError('Name, price and city are required.'); 
      return; 
    }
    
    setLoading(true);
    try {
      await api.updateService(id, formData);
      setSuccess('Service updated successfully!');
      setTimeout(() => navigate('/dashboard/services'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update service');
    } finally { 
      setLoading(false); 
    }
  };

  if (fetching) return <div className="flex bg-slate-50 min-h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Sidebar />
      
      <main className="flex-grow p-8 md:p-12 max-w-5xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-4">
            <span>My Services</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-600 font-bold">Edit Service</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight font-heading dark:text-white">Update Your Offering</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Modify your listing details to keep them accurate and attractive.</p>
        </header>

        <form className="space-y-12" onSubmit={handleSubmit}>
          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">{error}</div>}
          {success && <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-600 text-sm font-medium">{success}</div>}

          {/* Basic Info */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 font-heading dark:text-white">
              <Info className="w-5 h-5 text-brand-600" />
              General Information
            </h3>
            <Card className="p-8 border-none shadow-sm space-y-6 rounded-[2rem] dark:bg-slate-900">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Service Title</label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Ocean View Luxury Suite" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-slate-700 dark:text-slate-200 cursor-pointer outline-none">
                    <option value="hotel">Hotel</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="guide">Guide / Tour</option>
                    <option value="transport">Transport</option>
                    <option value="activity">Activity</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Starting Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="250" className="pl-12" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  className="w-full min-h-[150px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 outline-none font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="Describe the unique experience you offer..."
                ></textarea>
              </div>
            </Card>
          </section>

          {/* Media */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 font-heading dark:text-white">
              <Image className="w-5 h-5 text-brand-600" />
              Media Gallery
            </h3>
            <Card className="p-8 border-none shadow-sm space-y-6 rounded-[2rem] dark:bg-slate-900">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Primary Image URL</label>
                <Input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                {formData.image_url ? (
                  <div className="aspect-square rounded-[2rem] overflow-hidden relative group">
                    <img src={formData.image_url} className="w-full h-full object-cover" alt="Preview" />
                    <button type="button" onClick={() => setFormData(prev => ({...prev, image_url: ''}))} className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Plus className="w-8 h-8 text-slate-300 mb-2" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Add Image</span>
                  </div>
                )}
              </div>
            </Card>
          </section>

          <footer className="pt-8 flex justify-end gap-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="lg" className="px-10" onClick={() => navigate('/dashboard/services')}>Cancel</Button>
            <Button type="submit" variant="primary" size="lg" className="px-12" disabled={loading}>
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </footer>
        </form>
      </main>
    </div>
  );
}
