import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Plus, Search, Edit3, Trash2, Eye, MapPin, Tag } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import * as api from '../../api/axios';

export default function ProviderServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.getProviderServices();
      setServices(res.data.data || (Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this service?')) return;
    try {
      await api.deleteService(id);
      fetchServices();
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  const filteredServices = services.filter(s => 
    (s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.category?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 md:p-12 space-y-10 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-heading dark:text-white">My Services</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your listings, update details, and monitor performance.</p>
          </div>
          <Link to="/dashboard/add-service">
            <Button variant="primary" className="gap-2">
              <Plus className="w-5 h-5" /> New Service
            </Button>
          </Link>
        </header>

        <Card className="p-0 border-none shadow-sm rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                type="text" 
                placeholder="Search your listings..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-brand-500 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
            <div className="flex items-center gap-3">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">Total: {filteredServices.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-slate-500 font-medium">Loading your services...</div>
            ) : filteredServices.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Service Details</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Price</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm shrink-0 bg-slate-100 dark:bg-slate-800">
                            <img src={service.images || service.image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=200'} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1 font-heading">{service.name}</h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                              <MapPin className="w-3 h-3 text-brand-500" /> {service.city_name || 'Global'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg w-max border border-slate-100 dark:border-slate-700">
                          <Tag className="w-3 h-3 text-brand-500" />
                          <span className="text-sm font-bold capitalize">{service.category}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-lg font-bold text-slate-900 dark:text-white font-heading">${service.price}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                          service.is_available ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/50" : "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/50"
                        )}>
                          {service.is_available ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/services/${service.id}`}>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link to={`/dashboard/edit-service/${service.id}`}>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)} className="h-10 w-10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-500">
                  <Tag className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading">No Services Found</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">You haven't listed any services yet. Start by creating your first collection.</p>
                <Link to="/dashboard/add-service">
                  <Button variant="outline" className="px-8">Create Listing</Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
