import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Search, ShieldBan, ShieldCheck, Trash2, UserCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import * as api from '../../api/axios';
import { cn } from '../../lib/utils';

const ROLES = ['all', 'tourist', 'service_provider', 'admin'];
const roleLabel = { tourist: 'Tourist', service_provider: 'Provider', admin: 'Admin' };
const roleBadge = {
  tourist:          'bg-blue-500/10 text-blue-600',
  service_provider: 'bg-violet-500/10 text-violet-600',
  admin:            'bg-rose-500/10 text-rose-600',
};

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [role,    setRole]    = useState('all');
  const [busy,    setBusy]    = useState({});

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (role !== 'all') params.role = role;
    api.getAdminUsers(params)
      .then(res => setUsers(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, role]);

  useEffect(() => { load(); }, [load]);

  const toggleBan = async (user) => {
    setBusy(b => ({ ...b, [user.id]: true }));
    try {
      await api.updateAdminUserStatus(user.id, { is_active: !user.is_active });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: u.is_active ? 0 : 1 } : u));
    } finally { setBusy(b => ({ ...b, [user.id]: false })); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Permanently delete this user and all their data?')) return;
    setBusy(b => ({ ...b, [id]: true }));
    try {
      await api.deleteAdminUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } finally { setBusy(b => ({ ...b, [id]: false })); }
  };

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <AdminSidebar />
      <main className="flex-grow p-8 md:p-12 space-y-8 overflow-auto">
        <header>
          <h1 className="text-3xl font-bold tracking-tight font-heading text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Ban, unban, or remove platform users.</p>
        </header>

        <Card className="p-0 border border-slate-200 dark:border-transparent shadow-sm rounded-3xl bg-white dark:bg-slate-900 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              {ROLES.map(r => (
                <button key={r} onClick={() => setRole(r)}
                  className={cn('px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all',
                    r === role
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}>
                  {r === 'service_provider' ? 'Providers' : r === 'all' ? 'All' : roleLabel[r] || r}
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400 self-center px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">{users.length} users</span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-slate-400 font-medium">Loading users...</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">User</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Role</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Joined</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u, i) => (
                    <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${u.name}&background=random&size=36`} className="w-9 h-9 rounded-full" alt="" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{u.name}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn('px-3 py-1 rounded-xl text-xs font-bold capitalize', roleBadge[u.role] || 'bg-slate-100 text-slate-500')}>
                          {roleLabel[u.role] || u.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn('px-3 py-1 rounded-xl text-xs font-bold',
                          u.is_active ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                        )}>
                          {u.is_active ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-400 dark:text-slate-500">
                        {new Date(u.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" disabled={busy[u.id] || u.role === 'admin'} onClick={() => toggleBan(u)}
                            className={cn('rounded-xl text-xs gap-1.5',
                              u.is_active ? 'text-amber-600 hover:bg-amber-500/10' : 'text-green-600 hover:bg-green-500/10'
                            )}>
                            {u.is_active ? <><ShieldBan className="w-4 h-4" /> Ban</> : <><ShieldCheck className="w-4 h-4" /> Unban</>}
                          </Button>
                          <Button variant="ghost" size="icon" disabled={busy[u.id] || u.role === 'admin'} onClick={() => deleteUser(u.id)}
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
            {!loading && users.length === 0 && (
              <div className="py-20 text-center">
                <UserCircle className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No users found</p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
