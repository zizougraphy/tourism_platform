import { motion } from 'motion/react';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Legend
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import { Download, Filter, Calendar } from 'lucide-react';

const visitData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const categoryData = [
  { name: 'Luxury Stays', value: 45, color: '#0e8ce4' },
  { name: 'Dining', value: 25, color: '#f59e0b' },
  { name: 'Tours', value: 30, color: '#10b981' },
];

const AnalyticsPage = () => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <DashboardSidebar />
      <main className="flex-grow p-8 md:p-12 space-y-10">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
            <p className="text-slate-500">Deep dive into your service performance and guest behavior.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Custom Range
            </Button>
            <Button variant="primary" className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Traffic Chart */}
          <Card className="p-8 border-none shadow-sm space-y-8">
            <h3 className="font-bold text-xl">Visitor Traffic</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="value" fill="#0e8ce4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Source Distribution */}
          <Card className="p-8 border-none shadow-sm space-y-8">
            <h3 className="font-bold text-xl">Revenue by Category</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="p-8 border-none shadow-sm overflow-x-auto">
          <h3 className="font-bold text-xl mb-6">Service Performance Rank</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 italic text-slate-400 text-sm">
                <th className="pb-4 font-normal">Service Name</th>
                <th className="pb-4 font-normal">Revenue</th>
                <th className="pb-4 font-normal">Conversion</th>
                <th className="pb-4 font-normal">Growth</th>
                <th className="pb-4 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: 'Azure Boutique Resort', rev: '$28,450', conv: '4.2%', growth: '+12%', color: 'text-green-500' },
                { name: 'The Golden Lotus', rev: '$12,120', conv: '3.1%', growth: '+5%', color: 'text-green-500' },
                { name: 'Kyoto Heritage Tour', rev: '$8,400', conv: '2.8%', growth: '-2%', color: 'text-rose-500' },
              ].map((item, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 font-bold text-slate-700">{item.name}</td>
                  <td className="py-6 font-bold">{item.rev}</td>
                  <td className="py-6 font-medium text-slate-500">{item.conv}</td>
                  <td className={`py-6 font-bold ${item.color}`}>{item.growth}</td>
                  <td className="py-6 text-right">
                    <Button variant="ghost" size="sm" className="font-bold">Edit Service</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
};

export default AnalyticsPage;
