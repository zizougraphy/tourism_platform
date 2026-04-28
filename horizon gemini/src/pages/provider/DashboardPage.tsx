import { motion } from 'motion/react';
import { 
  TrendingUp, Users, Calendar, 
  DollarSign, ArrowUpRight, ArrowDownRight,
  MoreVertical, Star
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import { cn } from '../../lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, bookings: 24 },
  { name: 'Tue', revenue: 3000, bookings: 18 },
  { name: 'Wed', revenue: 5000, bookings: 32 },
  { name: 'Thu', revenue: 2780, bookings: 15 },
  { name: 'Fri', revenue: 6890, bookings: 45 },
  { name: 'Sat', revenue: 8390, bookings: 58 },
  { name: 'Sun', revenue: 7490, bookings: 48 },
];

const DashboardPage = () => {
  const stats = [
    { label: 'Total Revenue', value: '$45,892', change: '+12.5%', isUp: true, icon: DollarSign },
    { label: 'Active Bookings', value: '1,284', change: '+8.2%', isUp: true, icon: Calendar },
    { label: 'Total Users', value: '8,432', change: '-2.4%', isUp: false, icon: Users },
    { label: 'Avg Rating', value: '4.85', change: '+0.1%', isUp: true, icon: Star },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <DashboardSidebar />
      
      <main className="flex-grow p-8 md:p-12 space-y-10">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500">Welcome back, Azure Hospitality. Here's what's happening today.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">Download Report</Button>
            <Button variant="primary">Add New Service</Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 border-none shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="bg-brand-50 p-3 rounded-2xl">
                    <stat.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div className={cn(
                    "flex items-center text-xs font-bold px-2 py-1 rounded-lg",
                    stat.isUp ? "bg-green-50 text-green-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {stat.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                  <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts & Tables */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 p-8 border-none shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl">Revenue Trends</h3>
              <select className="bg-slate-50 border-none outline-none text-sm font-bold text-slate-500 rounded-lg p-2">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0e8ce4" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0e8ce4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0e8ce4" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Bookings */}
          <Card className="p-8 border-none shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl">Recent Activity</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>

            <div className="space-y-6">
              {[
                { name: 'Sarah Wilson', service: 'Azure Resort', date: '5 mins ago', amount: '$450', img: 'https://i.pravatar.cc/150?u=1' },
                { name: 'James Miller', service: 'Temple Tour', date: '12 mins ago', amount: '$120', img: 'https://i.pravatar.cc/150?u=2' },
                { name: 'Anna Baker', service: 'Golden Lotus', date: '1 hr ago', amount: '$85', img: 'https://i.pravatar.cc/150?u=3' },
                { name: 'Tom Hardy', service: 'Yacht Charter', date: '3 hrs ago', amount: '$950', img: 'https://i.pravatar.cc/150?u=4' },
                { name: 'Emma Watson', service: 'Azure Resort', date: '5 hrs ago', amount: '$450', img: 'https://i.pravatar.cc/150?u=5' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <img src={item.img} className="w-10 h-10 rounded-full" alt="User" />
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-sm tracking-tight">{item.name}</div>
                      <div className="text-sm font-bold text-slate-900">{item.amount}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-slate-400">{item.service}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{item.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
