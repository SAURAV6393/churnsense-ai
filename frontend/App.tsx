
import React, { useState } from 'react';
import { AppView, ChurnPrediction } from './types';
import Dashboard from './components/Dashboard';
import PredictorForm from './components/PredictorForm';
import PredictionResultView from './components/PredictionResultView';
import Segments from './components/Segments';
import IntelligenceHub from './components/IntelligenceHub';
import MediaCenter from './components/MediaCenter';
import LiveAI from './components/LiveAI';
import Roadmap from './components/Roadmap';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [predictionResult, setPredictionResult] = useState<ChurnPrediction | null>(null);

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard />;
      case AppView.PREDICTOR:
        return predictionResult ? (
          <PredictionResultView result={predictionResult} onReset={() => setPredictionResult(null)} />
        ) : (
          <PredictorForm onResult={(res) => setPredictionResult(res)} />
        );
      case AppView.SEGMENTS: return <Segments />;
      case AppView.HUB: return <IntelligenceHub />;
      case AppView.MEDIA: return <MediaCenter />;
      case AppView.LIVE: return <LiveAI />;
      case AppView.ROADMAP: return <Roadmap />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-slate-900 text-white p-8 flex flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="flex items-center gap-4 mb-14 px-2">
          <div className="w-14 h-14 bg-blue-600 rounded-3xl flex items-center justify-center font-black text-3xl italic shadow-2xl shadow-blue-900/50">C</div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none">Churn<span className="text-blue-500">Sense</span></h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Enterprise ML</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {[
            { id: AppView.DASHBOARD, label: 'Analytics Board', icon: '📊' },
            { id: AppView.PREDICTOR, label: 'ML Workbench', icon: '🎯' },
            { id: AppView.SEGMENTS, label: 'Deep Segments', icon: '🧬' },
            { id: AppView.HUB, label: 'Intelligence Hub', icon: '🧠' },
            { id: AppView.MEDIA, label: 'Media Lab', icon: '🎨' },
            { id: AppView.LIVE, label: 'Live Advisor', icon: '🎙️' },
            { id: AppView.ROADMAP, label: 'Project Roadmap', icon: '📅' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                if (item.id === AppView.PREDICTOR) setPredictionResult(null);
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-black text-sm ${currentView === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <span className="text-2xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-800">
          <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
            <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-2">Developed By</p>
            <div className="text-xs font-bold text-slate-300">Saurav Rajput</div>
            <div className="text-[10px] text-slate-500 mt-1 uppercase font-black">B.Tech Capstone Project</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-14 overflow-y-auto min-h-screen">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
              {currentView === AppView.DASHBOARD && 'Global Risk Intelligence'}
              {currentView === AppView.PREDICTOR && 'ML Workbench & Predictor'}
              {currentView === AppView.SEGMENTS && 'Market Segmentation'}
              {currentView === AppView.HUB && 'Strategic Intelligence'}
              {currentView === AppView.MEDIA && 'AI Creative Lab'}
              {currentView === AppView.LIVE && 'Voice Advisor Session'}
              {currentView === AppView.ROADMAP && 'Project Implementation'}
              <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] uppercase font-black rounded-lg tracking-widest">v3.0</span>
            </h2>
            <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-widest opacity-70">Customer Churn Prediction Platform</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Node Status</span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                   http://localhost:3001
                </span>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black shadow-lg">SR</div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>

        <footer className="mt-32 py-12 border-t border-slate-200 text-center">
          <div className="flex justify-center gap-10 mb-6">
            <a href="https://github.com/SAURAV6393" target="_blank" className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600">GitHub Profile</a>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600">Documentation</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600">System Architecture</span>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-tighter">
            &copy; 2026 SAURAV RAJPUT • CHURNSENSE AI • ENTERPRISE ANALYTICS SOLUTION
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
