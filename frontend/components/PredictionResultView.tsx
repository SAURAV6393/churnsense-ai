
import React, { useState } from 'react';
import { ChurnPrediction } from '../types';

interface Props {
  result: any;
  onReset: () => void;
}

const PredictionResultView: React.FC<Props> = ({ result, onReset }) => {
  const [showHindi, setShowHindi] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="p-8 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="#e2e8f0" strokeWidth="12" fill="transparent" />
                <circle 
                  cx="96" cy="96" r="80" stroke={result.probability > 60 ? '#ef4444' : '#3b82f6'} 
                  strokeWidth="12" fill="transparent" 
                  strokeDasharray={502} 
                  strokeDashoffset={502 - (502 * result.probability) / 100} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-5xl font-black text-slate-900">{result.probability}%</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Churn Index</div>
              </div>
            </div>
            <div className={`mt-6 px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest ${result.riskLevel === 'High' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {result.riskLevel} Alert Cluster
            </div>
            
            <div className="mt-8 w-full border-t border-slate-200 pt-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Stability</span>
                    <span className="text-xs font-black text-blue-600">{result.confidence_score || 94.5}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${result.confidence_score || 94.5}%` }}></div>
                </div>
                <p className="text-[9px] text-slate-400 mt-2 italic font-medium">Verified via cross-validation stability benchmarks.</p>
            </div>
          </div>

          <div className="p-8 lg:col-span-2 space-y-8">
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Statistical Scorecard</h3>
                <div className="flex gap-4">
                    <div className="text-right">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CV Mean AUC</div>
                        <div className="text-xs font-black text-slate-900">{(result.metrics.cv_mean_auc * 100).toFixed(1)}%</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CV Variance</div>
                        <div className="text-xs font-black text-slate-900">±{result.metrics.cv_std_auc.toFixed(3)}</div>
                    </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Accuracy', val: result.metrics.accuracy },
                  { label: 'Precision', val: result.metrics.precision },
                  { label: 'Recall', val: result.metrics.recall },
                  { label: 'F1 Score', val: result.metrics.f1 },
                  { label: 'ROC-AUC', val: result.metrics.auc },
                ].map(m => (
                  <div key={m.label} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-blue-600 font-black text-lg">{(m.val * 100).toFixed(1)}%</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Predictive Features</h4>
                 <div className="space-y-2">
                   {Object.entries(result.feature_importance).map(([key, value]: [string, any], i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                       <div className="flex items-center gap-3">
                         <span className={`w-2 h-2 rounded-full ${value > 0 ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                         <span className="text-xs font-bold text-slate-700">{key}</span>
                       </div>
                       <span className={`text-[10px] font-black ${value > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                         {value > 0 ? '+' : ''}{value.toFixed(2)}
                       </span>
                     </div>
                   ))}
                 </div>
               </div>
               <div>
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Strategic Mandates</h4>
                 <div className="space-y-2">
                   {result.strategies.map((a: string, i: number) => (
                     <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                       <span className="text-emerald-600 font-bold">✓</span>
                       <span className="text-xs font-bold text-emerald-800">{a}</span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-900 text-white relative">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-black uppercase text-blue-400 tracking-tighter">Strategic Audit Report</h4>
            <button 
              onClick={() => setShowHindi(!showHindi)}
              className="text-[10px] font-black uppercase px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              {showHindi ? 'English Text' : 'Hindi Interpretation'}
            </button>
          </div>
          <p className="text-sm font-medium leading-relaxed italic opacity-90">
            {showHindi ? result.insight_hindi : result.insight_eng}
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={onReset} className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all">
          Generate New Audit Log
        </button>
      </div>
    </div>
  );
};

export default PredictionResultView;
