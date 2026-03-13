
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MOCK_SEGMENTS } from '../constants';

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'];

const Segments: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-900">Churn Risk Impact</h3>
            <p className="text-sm text-slate-500 font-medium">Segment contribution to total churn probability</p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_SEGMENTS}
                  cx="50%" cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="churnRate"
                  nameKey="name"
                  stroke="none"
                >
                  {MOCK_SEGMENTS.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  formatter={(v) => [`${v}% Risk`, 'Probability']}
                />
                <Legend verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-900">Market Population</h3>
            <p className="text-sm text-slate-500 font-medium">Customer volume per intelligence segment</p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_SEGMENTS} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">💡</div>
            <div>
              <h3 className="text-2xl font-black">Predictive Stratagems</h3>
              <p className="text-blue-300 font-medium">AI-generated segment optimizations</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MOCK_SEGMENTS.map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-black text-lg">{s.name}</span>
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${s.churnRate > 40 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {s.churnRate > 40 ? 'Critical Focus' : 'Stabilized'}
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  {s.churnRate > 40 
                    ? `Segment exhibits high elasticity. Current ${s.churnRate}% churn requires immediate price-lock incentives and service-level audits.` 
                    : `Segment shows strong retention metrics. Recommend expansion campaigns and migration to higher-tier service agreements.`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Segments;
