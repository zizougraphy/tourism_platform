import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Search, Trash2, Eye, ToggleLeft, ToggleRight, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import * as api from '../../api/axios';
import { cn } from '../../lib/utils';

const CATEGORIES = ['all', 'hotel', 'restaurant', 'guide', 'transport', 'activity'];

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('all');
  const [busy,     setBusy]     = useState({});

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search)             params.search   = search;
    if (category !== 'all') params.category = category;
    api.getAdminServices(params)
      .then(res => setServices(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category]);

  useEffect(() => { load(); }, [load]);

  const toggleService = async (svc) => {
    setBusy(b => ({ ...b, [svc.id]: true }));
    try {
      const res = await api.toggleAdminService(svc.id);
      setServices(prev => prev.map(s => s.id === svc.id ? { ...s, is_available: res.data.is_available } : s));
    } finally { setBusy(b => ({ ...b, [svc.id]: false })); }
  };

  const deleteService = async (id) => {
    if (!confirm('Delete this service? This cannot be undone.')) return;
    setBusy(b => ({ ...b, [id]: true }));
    try {
      await api.deleteAdminService(id);
      setServices(prev => prev.filter(s => s.id !== id));
    } finally { setBusy(b => ({ ...b, [id]: false })); }
  };

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <AdminSidebar />
      <main className="flex-grow p-8 md:p-12 space-y-8 overflow-auto">
        <header>
          <h1 className="text-3xl font-bold tracking-tight font-heading text-slate-900 dark:text-white">Services Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review, toggle, and remove services across the platform.</p>
        </header>

        <Card className="p-0 border border-slate-200 dark:border-transparent shadow-sm rounded-3xl bg-white dark:bg-slate-900 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search services..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={cn('px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all',
                    c === category
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}>
                  {c}
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400 self-center px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">{services.length}</span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-slate-400">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="py-20 text-center">
                <MapPin className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No services found</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Service</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">City</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Price</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Rating</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {services.map((svc, i) => (
                    <motion.tr key={svc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                            <img src={svc.images || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100'} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{svc.name}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">by {svc.provider_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg w-max">
                          <Tag className="w-3 h-3 text-rose-500" />
                          <span className="text-xs font-bold capitalize">{svc.category}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">{svc.city_name}</td>
                      <td className="px-8 py-5">
                        <span className="text-slate-900 dark:text-white font-bold">${svc.price}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-amber-500 font-bold text-sm">★ {Number(svc.rating).toFixed(1)}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn('px-3 py-1 rounded-xl text-xs font-bold',
                          svc.is_available ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                        )}>
                          {svc.is_available ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/services/${svc.id}`} target="_blank">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-500/10">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" disabled={busy[svc.id]} onClick={() => toggleService(svc)}
                            className={cn('h-9 w-9 rounded-xl',
                              svc.is_available
                                ? 'text-amber-500 hover:bg-amber-500/10'
                                : 'text-green-600 hover:bg-green-500/10'
                            )}>
                            {svc.is_available ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" disabled={busy[svc.id]} onClick={() => deleteService(svc.id)}
                            className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
