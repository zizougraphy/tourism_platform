import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, PauseCircle, PlayCircle, Briefcase } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import * as api from '../../api/axios';
import { cn } from '../../lib/utils';

const FILTERS = ['all', 'active', 'suspended'];

export default function AdminProviders() {
  const [providers, setProviders] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('all');
  const [busy,      setBusy]      = useState({});

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filter === 'active')    params.status = 'approved';
    if (filter === 'suspended') params.status = 'suspended';
    api.getProviders(params)
      .then(res => setProviders(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const setActive = async (provider, isActive) => {
    setBusy(b => ({ ...b, [provider.id]: true }));
    try {
      await api.updateProviderStatus(provider.id, { is_active: isActive });
      setProviders(prev => prev.map(p => p.id === provider.id ? { ...p, is_active: isActive ? 1 : 0 } : p));
    } finally { setBusy(b => ({ ...b, [provider.id]: false })); }
  };

  const approve = async (id) => {
    setBusy(b => ({ ...b, [id]: true }));
    try { await api.approveProvider(id); load(); }
    finally { setBusy(b => ({ ...b, [id]: false })); }
  };

  const reject = async (id) => {
    setBusy(b => ({ ...b, [id]: true }));
    try { await api.rejectProvider(id); load(); }
    finally { setBusy(b => ({ ...b, [id]: false })); }
  };

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <AdminSidebar />
      <main className="flex-grow p-8 md:p-12 space-y-8 overflow-auto">
        <header>
          <h1 className="text-3xl font-bold tracking-tight font-heading text-slate-900 dark:text-white">Provider Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Approve, reject, and manage service providers.</p>
        </header>

        <Card className="p-0 border border-slate-200 dark:border-transparent shadow-sm rounded-3xl bg-white dark:bg-slate-900 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={cn('px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all',
                    f === filter ? 'bg-rose-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}>
                  {f}
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">{providers.length} providers</span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-slate-400 font-medium">Loading providers...</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Provider</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Services</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Registered</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {providers.map((p, i) => (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${p.name}&background=random&size=36`} className="w-9 h-9 rounded-full" alt="" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{p.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-xl">{p.total_services} services</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn('px-3 py-1 rounded-xl text-xs font-bold',
                          p.is_active ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                        )}>
                          {p.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-400 dark:text-slate-500">
                        {new Date(p.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" disabled={busy[p.id]} onClick={() => approve(p.id)}
                            className="rounded-xl text-xs gap-1.5 text-green-600 hover:bg-green-500/10">
                            <CheckCircle className="w-4 h-4" /> Approve
                          </Button>
                          <Button variant="ghost" size="sm" disabled={busy[p.id]} onClick={() => reject(p.id)}
                            className="rounded-xl text-xs gap-1.5 text-red-600 hover:bg-red-500/10">
                            <XCircle className="w-4 h-4" /> Reject
                          </Button>
                          {p.is_active ? (
                            <Button variant="ghost" size="sm" disabled={busy[p.id]} onClick={() => setActive(p, false)}
                              className="rounded-xl text-xs gap-1.5 text-amber-600 hover:bg-amber-500/10">
                              <PauseCircle className="w-4 h-4" /> Suspend
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" disabled={busy[p.id]} onClick={() => setActive(p, true)}
                              className="rounded-xl text-xs gap-1.5 text-blue-600 hover:bg-blue-500/10">
                              <PlayCircle className="w-4 h-4" /> Activate
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && providers.length === 0 && (
              <div className="py-20 text-center">
                <Briefcase className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No providers found</p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
