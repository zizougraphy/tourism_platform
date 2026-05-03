import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Search, Trash2, Star, MessageSquare } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import * as api from '../../api/axios';

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(n => (
      <Star key={n} className={`w-3.5 h-3.5 ${n <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 dark:text-slate-700'}`} />
    ))}
  </div>
);

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [busy,    setBusy]    = useState({});

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    api.getAdminReviews(params)
      .then(res => setReviews(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const deleteReview = async (id) => {
    if (!confirm('Delete this review? This cannot be undone.')) return;
    setBusy(b => ({ ...b, [id]: true }));
    try {
      await api.deleteAdminReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } finally { setBusy(b => ({ ...b, [id]: false })); }
  };

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <AdminSidebar />
      <main className="flex-grow p-8 md:p-12 space-y-8 overflow-auto">
        <header>
          <h1 className="text-3xl font-bold tracking-tight font-heading text-slate-900 dark:text-white">Review Moderation</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Search and remove abusive or inappropriate reviews.</p>
        </header>

        <Card className="p-0 border border-slate-200 dark:border-transparent shadow-sm rounded-3xl bg-white dark:bg-slate-900 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by reviewer, service, or comment..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            <span className="text-xs font-bold text-slate-400 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">{reviews.length} reviews</span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-slate-400">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="py-20 text-center">
                <MessageSquare className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No reviews found</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Reviewer</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Service</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Rating</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Comment</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {reviews.map((rv, i) => (
                    <motion.tr key={rv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${rv.reviewer_name}&background=random&size=32`} className="w-8 h-8 rounded-full" alt="" />
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{rv.reviewer_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">{rv.service_name}</span>
                      </td>
                      <td className="px-8 py-5">
                        <StarRating rating={rv.rating} />
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs truncate">
                          {rv.comment || <span className="italic text-slate-300 dark:text-slate-600">No comment</span>}
                        </p>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-400 dark:text-slate-500">
                        {new Date(rv.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" disabled={busy[rv.id]} onClick={() => deleteReview(rv.id)}
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
