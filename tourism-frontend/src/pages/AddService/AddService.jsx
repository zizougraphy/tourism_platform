import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Image, MapPin, DollarSign, List, Info, ChevronRight, Save, Trash2, Plus, X, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Sidebar from '../../components/Sidebar/Sidebar';
import * as api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const AMENITY_PRESETS = {
  hotel: ['WiFi', 'Pool', 'Breakfast', 'Spa', 'Gym', 'Parking', 'Beach Access', 'Room Service', 'Air Conditioning'],
  restaurant: ['WiFi', 'Outdoor Seating', 'Live Music', 'Halal', 'Vegan Options', 'Private Dining', 'Delivery'],
  guide: ['Transport Included', 'Lunch Included', 'Equipment Provided', 'Multilingual Guide', 'Small Group'],
  activity: ['Equipment Included', 'Guide Included', 'Insurance', 'Photos Included', 'Transfer Included'],
  transport: ['WiFi', 'Air Conditioning', 'Luggage Space', 'Child Seat', 'Meet & Greet'],
};

export default function AddService() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({ 
    name: '', 
    category: 'hotel', 
    city_id: '', 
    price: '', 
    description: '',
    location_address: '',
  });
  // Multi-image support (File objects)
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [customAmenity, setCustomAmenity] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.getCities().then(res => setCities(res.data.data || res.data || [])).catch(() => { setCities([]); });
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities(prev => [...prev, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const combinedFiles = [...imageFiles, ...newFiles].slice(0, 5); // Limit to 5
      setImageFiles(combinedFiles);
      
      // Create preview URLs
      const previews = combinedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const removeImage = (idx) => {
    const newFiles = [...imageFiles];
    newFiles.splice(idx, 1);
    setImageFiles(newFiles);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(idx, 1);
    setImagePreviews(newPreviews);
  };

  // Availability
  const [availability, setAvailability] = useState({
    startDate: '',
    endDate: '',
    capacity: 10
  });

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(''); setSuccess('');
    
    if (!formData.name || !formData.price || !formData.city_id) { 
      setError('Name, price and city are required.'); 
      return; 
    }

    setLoading(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) payload.append(key, formData[key]);
      });
      
      payload.append('amenities', JSON.stringify(selectedAmenities));
      
      imageFiles.forEach(file => {
        payload.append('images', file);
      });

      const res = await api.createService(payload);
      const newServiceId = res.data.data.id;

      // Handle availability if provided
      if (availability.startDate && availability.endDate && availability.capacity) {
        const start = new Date(availability.startDate);
        const end = new Date(availability.endDate);
        const slots = [];
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          slots.push({
            date: d.toISOString().split('T')[0],
            total_slots: parseInt(availability.capacity)
          });
        }
        
        if (slots.length > 0) {
          await api.setBulkAvailability({ service_id: newServiceId, slots });
        }
      }

      setSuccess('Service published successfully!');
      setTimeout(() => navigate('/dashboard/services'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service');
    } finally { 
      setLoading(false); 
    }
  };

  const currentAmenityPresets = AMENITY_PRESETS[formData.category] || AMENITY_PRESETS.hotel;

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Sidebar />
      
      <main className="flex-grow p-8 md:p-12 max-w-5xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-4">
            <span>My Services</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-600 font-bold">Add New Service</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight font-heading dark:text-white">Create New Offering</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Reach thousands of travelers by publishing your premium services.</p>
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

          {/* Location & Amenities */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 font-heading dark:text-white">
              <MapPin className="w-5 h-5 text-brand-600" />
              Location & Details
            </h3>
            <Card className="p-8 border-none shadow-sm space-y-6 rounded-[2rem] dark:bg-slate-900">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">City</label>
                  <select name="city_id" value={formData.city_id} onChange={handleChange} className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-slate-700 dark:text-slate-200 cursor-pointer outline-none">
                    <option value="">Select a city</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Address (Optional)</label>
                  <Input name="location_address" value={formData.location_address} onChange={handleChange} placeholder="123 Coastal Road, Oia" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Key {formData.category === 'restaurant' ? 'Features' : 'Amenities'}
                </label>
                <div className="flex flex-wrap gap-3">
                  {currentAmenityPresets.map(item => (
                    <button 
                      type="button" 
                      key={item} 
                      onClick={() => toggleAmenity(item)}
                      className={`px-5 py-2 border rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        selectedAmenities.includes(item) 
                          ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600'
                      }`}
                    >
                      {selectedAmenities.includes(item) && '✓ '}{item}
                    </button>
                  ))}
                </div>
                {/* Custom amenity */}
                <div className="flex gap-2 items-center">
                  <Input 
                    value={customAmenity} 
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomAmenity(); }}}
                    placeholder="Add custom amenity..." 
                    className="flex-grow"
                  />
                  <Button type="button" variant="outline" onClick={addCustomAmenity} className="shrink-0">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                {/* Show selected amenities not in presets */}
                {selectedAmenities.filter(a => !currentAmenityPresets.includes(a)).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedAmenities.filter(a => !currentAmenityPresets.includes(a)).map(custom => (
                      <span key={custom} className="px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-lg text-sm font-bold flex items-center gap-2">
                        {custom}
                        <X className="w-3 h-3 cursor-pointer hover:text-brand-900" onClick={() => toggleAmenity(custom)} />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </section>

          {/* Availability */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 font-heading dark:text-white">
              <CalendarIcon className="w-5 h-5 text-brand-600" />
              Availability Management
            </h3>
            <Card className="p-8 border-none shadow-sm space-y-6 rounded-[2rem] dark:bg-slate-900">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Start Date</label>
                  <Input type="date" value={availability.startDate} onChange={(e) => setAvailability(prev => ({...prev, startDate: e.target.value}))} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">End Date</label>
                  <Input type="date" value={availability.endDate} onChange={(e) => setAvailability(prev => ({...prev, endDate: e.target.value}))} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Daily Capacity / Slots</label>
                  <Input type="number" min="1" value={availability.capacity} onChange={(e) => setAvailability(prev => ({...prev, capacity: e.target.value}))} />
                </div>
              </div>
            </Card>
          </section>

          {/* Media — Multi-image */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 font-heading dark:text-white">
              <Image className="w-5 h-5 text-brand-600" />
              Media Gallery
            </h3>
            <Card className="p-8 border-none shadow-sm space-y-6 rounded-[2rem] dark:bg-slate-900">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Upload Images (Max 5)</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                {imagePreviews.map((url, idx) => (
                  <div key={idx} className="aspect-square rounded-[2rem] overflow-hidden relative group">
                    <img src={url} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {imagePreviews.length === 0 && (
                  <div className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-800/50">
                    <Image className="w-8 h-8 text-slate-300 mb-2" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">No Images</span>
                  </div>
                )}
              </div>
            </Card>
          </section>

          <footer className="pt-8 flex justify-end gap-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="lg" className="px-10" onClick={() => navigate('/dashboard/services')}>Cancel</Button>
            <Button type="submit" variant="primary" size="lg" className="px-12" disabled={loading}>
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Publishing...' : 'Publish Service'}
            </Button>
          </footer>
        </form>
      </main>
    </div>
  );
}
