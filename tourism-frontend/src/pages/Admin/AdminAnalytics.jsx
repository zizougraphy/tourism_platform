import { useState, useEffect } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../../components/ui/Card';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import * as api from '../../api/axios';

const COLORS = ['#f43f5e', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

export default function AdminAnalytics() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    api.getAdminAnalytics()
      .then(res => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Axis/grid styles adapt to current theme
  const gridColor  = isDark ? '#1e293b' : '#e2e8f0';
  const axisColor  = isDark ? '#64748b' : '#94a3b8';
  const axisStyle  = { fill: axisColor, fontSize: 12, fontWeight: 600 };
  const tooltipBg  = isDark ? '#1e293b' : '#ffffff';
  const tooltipBdr = isDark ? '#334155' : '#e2e8f0';

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: tooltipBg, border: `1px solid ${tooltipBdr}` }} className="rounded-2xl p-4 shadow-xl text-sm">
        <p className="text-slate-400 font-medium mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-bold">
            {p.name}: {p.name === 'Revenue' ? `$${Number(p.value).toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  };

  const chartCard = (title, children) => (
    <Card className="p-8 border border-slate-200 dark:border-transparent shadow-sm rounded-3xl bg-white dark:bg-slate-900">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading mb-6">{title}</h2>
      {loading ? (
        <div className="h-64 flex items-center justify-center text-slate-400">Loading...</div>
      ) : children}
    </Card>
  );

  const bookingsByDay = (data?.bookings_by_day || []).map(d => ({
    date: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    Bookings: d.count,
    Revenue: Number(d.revenue),
  }));

  const topServices = (data?.top_services || []).map(s => ({
    name: s.name.length > 18 ? s.name.slice(0, 18) + '…' : s.name,
    Bookings: s.bookings,
    Revenue: Number(s.revenue),
  }));

  const topProviders = (data?.top_providers || []).map(p => ({
    name: p.name.length > 16 ? p.name.slice(0, 16) + '…' : p.name,
    Revenue: Number(p.revenue),
    Bookings: p.bookings,
  }));

  const categoryData = (data?.category_breakdown || []).map(c => ({
    name: c.category,
    Bookings: c.bookings,
  }));

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <AdminSidebar />
      <main className="flex-grow p-8 md:p-12 space-y-8 overflow-auto">
        <header>
          <h1 className="text-3xl font-bold tracking-tight font-heading text-slate-900 dark:text-white">Platform Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Trends, top performers, and category insights.</p>
        </header>

        {!loading && !data?.bookings_by_day?.length && (
          <Card className="p-16 border border-slate-200 dark:border-transparent rounded-3xl bg-white dark:bg-slate-900 text-center">
            <BarChart3 className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Data Yet</h3>
            <p className="text-slate-400">Analytics will populate as bookings are made on the platform.</p>
          </Card>
        )}

        {/* Bookings & Revenue over time */}
        {chartCard('Bookings & Revenue – Last 30 Days',
          bookingsByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={bookingsByDay} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left"  tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: axisColor, fontSize: 12 }} />
                <Line yAxisId="left"  type="monotone" dataKey="Bookings" stroke="#f43f5e" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                <Line yAxisId="right" type="monotone" dataKey="Revenue"  stroke="#8b5cf6" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-400 text-center py-16 font-medium">No booking data in the last 30 days</p>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {chartCard('Top 5 Services by Bookings',
            topServices.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topServices} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} width={130} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Bookings" radius={[0, 6, 6, 0]}>
                    {topServices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-slate-400 text-center py-16 font-medium">No data yet</p>
          )}

          {chartCard('Top 5 Providers by Revenue',
            topProviders.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topProviders} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                  <YAxis type="category" dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Revenue" radius={[0, 6, 6, 0]}>
                    {topProviders.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-slate-400 text-center py-16 font-medium">No data yet</p>
          )}
        </div>

        {chartCard('Bookings by Category',
          categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Bookings" radius={[6, 6, 0, 0]}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-400 text-center py-16 font-medium">No booking data yet</p>
        )}
      </main>
    </div>
  );
}
