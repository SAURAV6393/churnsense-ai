import React, { useState } from 'react';
import { generateAImage, generateVeoVideo, editAImage } from '../services/geminiService';

const MediaCenter: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'Image' | 'Video' | 'Edit'>('Image');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [size, setSize] = useState('1K');
  const [baseImg, setBaseImg] = useState<string | null>(null);

  const checkVeoKey = async () => {
    if (type === 'Video') {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }
  };

  const handleProcess = async () => {
    if (!prompt && type !== 'Edit') return;
    setLoading(true);
    try {
      if (type === 'Video') {
        await checkVeoKey();
        const res = await generateVeoVideo(prompt, aspectRatio, baseImg?.split(',')[1]);
        setResult(res);
      } else if (type === 'Image') {
        const res = await generateAImage(prompt, aspectRatio, size);
        setResult(res);
      } else if (type === 'Edit' && baseImg) {
        const res = await editAImage(prompt, baseImg.split(',')[1]);
        setResult(res);
      }
    } catch (e: any) {
      if (e.message?.includes("Requested entity was not found")) {
        alert("Video generation requires a paid API Key. Please select one in the dialog.");
        await (window as any).aistudio.openSelectKey();
      } else {
        alert("Failed to synthesize media. Ensure prompts follow safety guidelines.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['Image', 'Video', 'Edit'].map(t => (
            <button 
              key={t} onClick={() => setType(t as any)}
              className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${type === t ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {t === 'Image' ? 'Nano Banana Pro' : t === 'Video' ? 'Veo Animate' : 'Nano Banana Edit'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Synthesis Prompt</label>
              <textarea 
                value={prompt} onChange={e => setPrompt(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-200 h-32 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                placeholder={type === 'Edit' ? "e.g., 'Add a retro filter' or 'Remove the person'" : "Describe the visual..."}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ratio</label>
                <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
                  {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              {type === 'Image' && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Size</label>
                  <select value={size} onChange={e => setSize(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
                    {['1K', '2K', '4K'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>

            {type === 'Video' && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-[10px] text-amber-700 font-bold mb-1">⚠️ VEO REQUIREMENT</p>
                <p className="text-[10px] text-amber-600">Generation can take several minutes. Requires a paid project API key. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline font-black">Billing Info</a></p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50">
            {baseImg ? (
              <div className="relative group">
                <img src={baseImg} className="max-h-48 rounded-lg shadow-xl" />
                <button onClick={() => setBaseImg(null)} className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2 shadow-lg">✕</button>
              </div>
            ) : (
              <label className="cursor-pointer text-center group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📸</div>
                <p className="text-sm font-bold text-slate-600">Upload Reference Image</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">Animate (Veo) or Edit (Nano Banana)</p>
                <input type="file" className="hidden" accept="image/*" onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const r = new FileReader();
                    r.onload = () => setBaseImg(r.result as string);
                    r.readAsDataURL(f);
                  }
                }} />
              </label>
            )}
          </div>
        </div>

        <button 
          onClick={handleProcess} disabled={loading}
          className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 shadow-2xl disabled:opacity-50"
        >
          {loading ? 'AI SYNTHESIS IN PROGRESS...' : 'GENERATE ASSET'}
        </button>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-4">
             <h4 className="text-xs font-black uppercase text-slate-400">Synthesized Output</h4>
             <a href={result} download="churnsense-asset" className="text-blue-600 font-bold text-xs hover:underline">Download High-Res</a>
          </div>
          {type === 'Video' ? (
            <video src={result} controls className="w-full rounded-xl shadow-inner border border-slate-200" />
          ) : (
            <img src={result} className="w-full rounded-xl shadow-inner border border-slate-200" />
          )}
        </div>
      )}
    </div>
  );
};

export default MediaCenter;