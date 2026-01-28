
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { thinkingAnalysis, fastResponse, groundedWebSearch, groundedMapsSearch, speak, analyzeContent } from '../services/geminiService';

const IntelligenceHub: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'Thinking' | 'Fast' | 'Search' | 'Maps' | 'Analyze'>('Thinking');
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileMime, setFileMime] = useState<string>('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#60a5fa');
      ctx.lineWidth = 3;
      ctx.strokeStyle = gradient;
      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    draw();
  };

  const startRecording = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      analyserRef.current = analyser;
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      setLiveTranscription('');
      setIsRecording(true);
      setTimeout(drawWaveform, 0);
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          inputAudioTranscription: {},
          responseModalities: [Modality.AUDIO],
          systemInstruction: 'Audit the user voice input and provide a text transcription of their retention-related query.'
        },
        callbacks: {
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              setLiveTranscription(prev => prev + message.serverContent!.inputTranscription!.text);
            }
          }
        }
      });
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const int16Data = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) int16Data[i] = inputData[i] * 0x7FFF;
        const base64 = btoa(String.fromCharCode(...new Uint8Array(int16Data.buffer)));
        sessionPromise.then(session => session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
      };
      source.connect(processor);
      processor.connect(audioCtx.destination);
      processorRef.current = processor;
      sessionRef.current = await sessionPromise;
    } catch (e) { console.error(e); }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    processorRef.current?.disconnect();
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioContextRef.current?.close();
    sessionRef.current?.close();
    if (liveTranscription) setQuery(prev => prev + (prev ? ' ' : '') + liveTranscription);
  };

  const executeAnalysis = async () => {
    if (!query && mode !== 'Analyze') return;
    setLoading(true);
    setSources([]);
    try {
      let res: any;
      if (mode === 'Thinking') res = await thinkingAnalysis(query);
      else if (mode === 'Fast') res = await fastResponse(query);
      else if (mode === 'Search') {
        const sr = await groundedWebSearch(query);
        res = sr.text;
        setSources(sr.sources);
      } else if (mode === 'Maps') {
        const sr = await groundedMapsSearch(query);
        res = sr.text;
        setSources(sr.sources);
      } else if (mode === 'Analyze' && fileBase64) {
        res = await analyzeContent(query || "Conduct visual audit.", fileBase64.split(',')[1], fileMime);
      }
      setResult(res);
    } catch (e) { setResult('System processing error.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
        <div className="flex flex-wrap gap-3 mb-8">
          {(['Thinking', 'Fast', 'Search', 'Maps', 'Analyze'] as const).map(m => (
            <button
              key={m} onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${mode === m ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {m} Protocol
            </button>
          ))}
        </div>

        <div className="relative group">
          <textarea
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter technical query or record audio briefing..."
            className={`w-full p-8 rounded-[2rem] border-2 border-slate-100 h-64 outline-none focus:ring-8 focus:ring-blue-500/5 text-slate-700 font-medium text-lg leading-relaxed transition-all ${isRecording ? 'opacity-20 blur-sm' : ''}`}
          />
          {isRecording && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-xl rounded-[2rem] z-10">
              <div className="w-full h-24 mb-6 p-6">
                <canvas ref={canvasRef} className="w-full h-full" width={600} height={100} />
              </div>
              <p className="text-slate-900 text-xl font-black">{liveTranscription || "Capturing Input..."}</p>
            </div>
          )}
          <button 
            onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={stopRecording}
            className={`absolute bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center z-20 transition-all ${isRecording ? 'bg-red-500 text-white scale-110' : 'bg-slate-900 text-white'}`}
          >
            {isRecording ? '⏹' : '🎙'}
          </button>
        </div>

        <button onClick={executeAnalysis} disabled={loading} className="w-full mt-8 py-6 bg-blue-600 text-white rounded-3xl font-black text-xl hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'ANALYZING...' : 'RUN STRATEGIC AUDIT'}
        </button>
      </div>

      {result && (
        <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest mb-6">Audit Synthesis Result</h3>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium text-xl whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligenceHub;
