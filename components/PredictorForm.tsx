
import React, { useState } from 'react';
import { CustomerData, ChurnPrediction } from '../types';
import { predictChurn } from '../services/geminiService';

interface Props {
  onResult: (result: ChurnPrediction) => void;
}

const PredictorForm: React.FC<Props> = ({ onResult }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<CustomerData, 'id'>>({
    name: 'Saurav Rajput',
    tenure: 24,
    monthlyCharges: 85.0,
    totalCharges: 2040.0,
    contract: 'One year',
    internetService: 'Fiber optic',
    supportInteractions: 1,
    paymentMethod: 'Credit card',
    isSeniorCitizen: false,
    hasDependents: true,
    usageLevel: 75,
    selectedModel: 'XGBoost'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.tenure < 0 || formData.monthlyCharges < 0) {
      alert("Invalid feature data detected.");
      return;
    }
    
    setLoading(true);
    try {
      const result = await predictChurn({ ...formData, id: 'log-' + Date.now() });
      onResult(result);
    } catch (err) {
      alert("System Error: Prediction pipeline unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value as string) : val
    }));
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
      <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Analytical Modeling Terminal</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Churn Classification System</p>
        </div>
        <div className="bg-blue-600/20 px-4 py-2 rounded-xl border border-blue-500/30">
          <span className="text-xs font-black text-blue-400 uppercase tracking-widest">System Operational</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-black">01</span>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Identity & Tenure</label>
            </div>
            
            <input 
              type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700 transition-all"
              placeholder="Full Name"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tenure (Months)</label>
                <input type="number" name="tenure" value={formData.tenure} onChange={handleChange} min="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Prediction Engine</label>
                <select name="selectedModel" value={formData.selectedModel} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-black text-blue-600 outline-none">
                  {['XGBoost', 'Random Forest', 'Decision Tree', 'Logistic Regression'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-black">02</span>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial & Service Matrix</label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Monthly Charges ($)</label>
                <input type="number" name="monthlyCharges" value={formData.monthlyCharges} onChange={handleChange} step="0.01" className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Service Friction</label>
                <input type="number" name="supportInteractions" value={formData.supportInteractions} onChange={handleChange} min="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold" />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Contract Agreement</label>
              <select name="contract" value={formData.contract} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold bg-white">
                <option value="Month-to-month">Month-to-month</option>
                <option value="One year">One year</option>
                <option value="Two year">Two year</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-6">
          <div className="flex gap-6">
             <label className="flex items-center gap-3 cursor-pointer group">
               <input type="checkbox" name="isSeniorCitizen" checked={formData.isSeniorCitizen} onChange={handleChange} className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 transition-all" />
               <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Senior Citizen</span>
             </label>
             <label className="flex items-center gap-3 cursor-pointer group">
               <input type="checkbox" name="hasDependents" checked={formData.hasDependents} onChange={handleChange} className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 transition-all" />
               <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Dependents</span>
             </label>
          </div>
          
          <button 
            type="submit" disabled={loading}
            className="w-full md:w-auto px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.15em] shadow-2xl shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                PROCESSING...
              </>
            ) : 'CALCULATE RISK SCORE'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PredictorForm;
