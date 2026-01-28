
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { MOCK_SEGMENTS } from '../constants';

const EDA_DISTRIBUTION = [
  { feature: 'Monthly < $20', churn: 5, active: 45 },
  { feature: 'Monthly $20-$70', churn: 15, active: 35 },
  { feature: 'Monthly $70+', churn: 35, active: 15 },
  { feature: 'Support Calls 0', churn: 2, active: 28 },
  { feature: 'Support Calls 3+', churn: 25, active: 5 },
];

const CHURN_TREND = [
  { month: 'Jan', churn: 120, target: 100 },
  { month: 'Feb', churn: 132, target: 100 },
  { month: 'Mar', churn: 101, target: 100 },
  { month: 'Apr', churn: 134, target: 100 },
  { month: 'May', churn: 90, target: 100 },
  { month: 'Jun', churn: 110, target: 100 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Churn Rate', value: '18.4%', trend: '-2.1%', color: 'text-blue-600' },
          { label: 'High Risk Customers', value: '432', trend: '+12', color: 'text-red-600' },
          { label: 'Avg Monthly Revenue', value: '$84.20', trend: '+$4.10', color: 'text-green-600' },
          { label: 'Retention Success', value: '76%', trend: '+5%', color: 'text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EDA Section - New based on PDF */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-800">Exploratory Analysis (EDA)</h3>
            <p className="text-sm text-slate-500">Distribution analysis of churn-heavy features.</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EDA_DISTRIBUTION} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="feature" type="category" stroke="#64748b" fontSize={10} width={100} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="churn" name="Churned" fill="#ef4444" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="active" name="Active" fill="#3b82f6" stackId="a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-6">Retention Success Gradient</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CHURN_TREND}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="churn" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
        <h3 className="text-xl font-black mb-6">Strategic Proactive Heatmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
            <h4 className="font-black text-red-400 mb-2 uppercase text-xs tracking-widest">High Elasticity Zone</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">Month-to-month fiber customers show 42% higher churn. Implement immediate bundle discounting for this cluster.</p>
          </div>
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
            <h4 className="font-black text-amber-400 mb-2 uppercase text-xs tracking-widest">Support Friction</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">Support calls &gt; 3 correlate with churn within 14 days. Proactive technical outreach required for all flagged IDs.</p>
          </div>
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
            <h4 className="font-black text-emerald-400 mb-2 uppercase text-xs tracking-widest">Loyalty Optimization</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">2-year contract users are stabilized. Focus on premium VAS (Value Added Services) upselling and referral incentives.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
