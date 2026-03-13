
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

const LiveAI: React.FC = () => {
  const [active, setActive] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [liveTranscription, setLiveTranscription] = useState('');
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#3b82f6';
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

  const toggleLive = async () => {
    if (active) {
      sessionRef.current?.close();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setActive(false);
      setLiveTranscription('');
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setActive(true);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            source.connect(analyser);
            
            const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const input = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(input.length);
              for (let i=0; i<input.length; i++) int16[i] = input[i] * 32768;
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(processor);
            processor.connect(audioContextRef.current!.destination);
            drawWaveform();
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Handle Transcription
            if (msg.serverContent?.inputTranscription) {
              setLiveTranscription(prev => prev + msg.serverContent!.inputTranscription!.text);
            }
            if (msg.serverContent?.turnComplete) {
              setMessages(prev => [...prev, { role: 'user', text: liveTranscription }]);
              setLiveTranscription('');
            }

            // Handle Audio Output
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const binary = atob(audioData);
              const bytes = new Uint8Array(binary.length);
              for(let i=0; i<binary.length; i++) bytes[i] = binary.charCodeAt(i);
              
              const int16 = new Int16Array(bytes.buffer);
              const buffer = audioContextRef.current!.createBuffer(1, int16.length, 24000);
              const data = buffer.getChannelData(0);
              for(let i=0; i<int16.length; i++) data[i] = int16[i] / 32768;
              
              const source = audioContextRef.current!.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextRef.current!.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current!.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;

              // We don't easily get text for model output in Modality.AUDIO unless we use transcription
              // But for UI, we'll just show the model is speaking.
            }

            if (msg.serverContent?.outputTranscription) {
              const text = msg.serverContent.outputTranscription.text;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'model') {
                   return [...prev.slice(0, -1), { role: 'model', text: last.text + text }];
                }
                return [...prev, { role: 'model', text: text }];
              });
            }
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: 'You are an elite Churn Intelligence Advisor. Provide short, punchy, strategic advice.'
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      alert("Microphone access required for Live Advisor.");
    }
  };

  const sendText = async () => {
    if (!userInput) return;
    const current = userInput;
    setMessages(prev => [...prev, { role: 'user', text: current }]);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    setUserInput('');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: current,
        config: { systemInstruction: 'You are an enterprise AI assistant for churn analysis.' }
      });
      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Synthesis complete.' }]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
        {active && (
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 animate-pulse"></div>
        )}
        
        <div className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700 ${active ? 'bg-blue-600 shadow-[0_0_50px_rgba(59,130,246,0.5)] scale-110' : 'bg-slate-100'}`}>
          <div className={`w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center ${active ? 'animate-pulse' : ''}`}>
             <span className="text-5xl">{active ? '🎙️' : '🔘'}</span>
          </div>
          {active && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-25"></div>
          )}
        </div>

        <div className="w-full h-16 px-4">
          <canvas ref={canvasRef} width={400} height={60} className="w-full h-full opacity-50" />
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {active ? 'Recording Audio...' : 'Voice Advisor Node'}
          </h3>
          <p className="text-sm text-slate-500 mt-2 font-medium max-w-xs mx-auto">
            {active ? 'AI is listening and transcribing your query in real-time.' : 'Start a low-latency voice session for immediate strategic consulting.'}
          </p>
        </div>

        {active && liveTranscription && (
          <div className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-blue-600 italic animate-pulse text-center">
            "{liveTranscription}..."
          </div>
        )}

        <button 
          onClick={toggleLive}
          className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-3 ${active ? 'bg-red-500 text-white shadow-red-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
        >
          {active ? (
            <>
              <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
              STOP RECORDING
            </>
          ) : (
            <>
              <span>🎙️</span>
              START ADVISOR SESSION
            </>
          )}
        </button>
        
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Model: Gemini 2.5 Native Audio (Live)</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[650px]">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Session Intelligence Log
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase">Enterprise Tier</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 mb-6 px-2 custom-scrollbar">
          {messages.length === 0 && !liveTranscription && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Awaiting Strategic Input</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200'}`}>
                <div className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">
                   {m.role === 'user' ? 'You' : 'Advisor'}
                </div>
                {m.text}
              </div>
            </div>
          ))}
          {liveTranscription && (
             <div className="flex justify-end opacity-50">
                <div className="bg-blue-50 text-blue-600 p-5 rounded-3xl text-sm font-bold italic border border-blue-100">
                   {liveTranscription}...
                </div>
             </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-50">
          <input 
            value={userInput} onChange={e => setUserInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendText()}
            placeholder="Type your strategic query..."
            className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all"
          />
          <button 
            onClick={sendText} 
            className="px-6 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl active:scale-95"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveAI;
