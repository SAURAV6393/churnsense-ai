
import React from 'react';

const ROADMAP_DATA = [
  { week: '1-2', focus: 'Foundations & Setup', tasks: ['Python/Pandas review', 'ML concepts', 'Git setup'], status: 'Done' },
  { week: '3-4', focus: 'Data Science Basics', tasks: ['Dataset loading', 'EDA', 'Feature Distribution'], status: 'Done' },
  { week: '5-6', focus: 'Preprocessing Pipeline', tasks: ['Missing values', 'Categorical encoding', 'Scaling'], status: 'Done' },
  { week: '7-8', focus: 'Algorithm Benchmarking', tasks: ['Logistic Regression', 'Random Forest', 'XGBoost'], status: 'In Progress' },
  { week: '9-10', focus: 'Advanced Tuning', tasks: ['Hyperparameter Opt', 'SMOTE', 'Cross-validation'], status: 'Upcoming' },
  { week: '11-12', focus: 'Enterprise Deployment', tasks: ['React UI', 'Gemini API Integration', 'Cloud Render'], status: 'Upcoming' },
];

const Roadmap: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-2xl font-black text-slate-900 mb-2">Project Execution Roadmap</h3>
        <p className="text-slate-500 font-medium mb-8 uppercase text-[10px] tracking-widest">Capstone Project Timeline (12-16 Weeks)</p>
        
        <div className="relative border-l-2 border-slate-100 ml-4 space-y-12">
          {ROADMAP_DATA.map((item, i) => (
            <div key={i} className="relative pl-10">
              <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-sm ${item.status === 'Done' ? 'bg-emerald-500' : item.status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                   <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Week {item.week}</div>
                   <h4 className="text-lg font-black text-slate-800">{item.focus}</h4>
                   <div className="flex flex-wrap gap-2 mt-3">
                     {item.tasks.map(t => (
                       <span key={t} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-500">{t}</span>
                     ))}
                   </div>
                </div>
                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'Done' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-3xl text-white">
           <h3 className="text-lg font-black mb-4">ML Architecture (Step 3)</h3>
           <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black">1</div>
                <div>
                  <div className="text-xs font-bold text-blue-400 uppercase">User Layer</div>
                  <div className="text-sm font-medium">React + Tailwind Interface</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black">2</div>
                <div>
                  <div className="text-xs font-bold text-blue-400 uppercase">Processing Layer</div>
                  <div className="text-sm font-medium">Gemini 3 Flash ML Logic</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black">3</div>
                <div>
                  <div className="text-xs font-bold text-blue-400 uppercase">Analysis Tier</div>
                  <div className="text-sm font-medium">Feature Scaling & Encoding</div>
                </div>
              </div>
           </div>
        </div>
        
        <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-100">
           <h3 className="text-lg font-black mb-4 italic">Future Scope (V2.0)</h3>
           <ul className="space-y-3 text-sm font-bold opacity-90">
             <li>• Real-time CRM API Integration</li>
             <li>• Deep Learning LSTM Model for Time-Series</li>
             <li>• Federated Learning for Privacy Preservation</li>
             <li>• Mobile Field-App for Retention Teams</li>
           </ul>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
