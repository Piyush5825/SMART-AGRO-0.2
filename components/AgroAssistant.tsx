
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Mic, AlertCircle, Volume2, MicOff, X, Square, Sparkles } from 'lucide-react';
import { agroChat, speakMarathi } from '../services/geminiService';

const QUICK_REPLIES = [
  "खत व्यवस्थापन कधी करावे?",
  "कीड नियंत्रण कसे करावे?",
  "जास्त उत्पन्न देणारी पिके कोणती?",
  "शासकीय योजनांची माहिती हवी.",
  "माती परीक्षण कसे करावे?",
  "कापूस पिकावरील लाल्या रोग उपाय",
  "ठिबक सिंचनाचे फायदे"
];

const AgroAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    {role: 'bot', text: 'नमस्कार! मी आपला स्मार्ट अ‍ॅग्रो सहाय्यक आहे. मी आपल्याला शेतीविषयक प्रश्नांची जलद उत्तरे देऊ शकतो.'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (overrideText?: string) => {
    const textToProcess = overrideText || input;
    if (!textToProcess.trim() || loading) return;
    
    const userMsg = textToProcess.trim();
    setInput('');
    setError(null);
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setLoading(true);

    try {
      const savedProfile = localStorage.getItem('farmer_profile');
      const profile = savedProfile ? JSON.parse(savedProfile) : {};
      
      const response = await agroChat(userMsg, profile);
      setMessages(prev => [...prev, {role: 'bot', text: response}]);
    } catch (err: any) {
      setError(err.message || "समस्या आली आहे.");
    } finally {
      setLoading(false);
    }
  };

  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleSpeakManual = async (text: string) => {
    if (isSpeaking) {
      handleStopSpeaking();
      return;
    }
    setIsSpeaking(true);
    try {
      await speakMarathi(text);
    } finally {
      setIsSpeaking(false);
    }
  };

  const toggleMic = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("तुमच्या ब्राउझरमध्ये व्हॉइस इनपुट उपलब्ध नाही.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'mr-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      setIsListening(false);
      setError("माइक वापरताना त्रुटी आली.");
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInput(transcript);
        handleSend(transcript);
      }
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="max-w-2xl mx-auto h-[75vh] flex flex-col bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-violet-100 dark:border-gray-700 transition-colors duration-300">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 p-5 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full text-violet-600 shadow-sm">
            <Bot size={28} />
          </div>
          <div>
            <h3 className="marathi-font font-bold text-lg">अ‍ॅग्रो एआय सहाय्यक</h3>
            <span className="text-[10px] uppercase opacity-80 tracking-widest">थोडक्यात आणि जलद उत्तरे</span>
          </div>
        </div>
        {isSpeaking && (
          <button 
            onClick={handleStopSpeaking}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all animate-pulse"
          >
            <Square size={12} fill="white" /> थांबवा
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-gray-900 transition-colors custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] p-4 rounded-2xl flex flex-col gap-1 shadow-sm transition-all ${
              m.role === 'user' 
                ? 'bg-violet-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
            }`}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold opacity-60 uppercase tracking-tight">
                  {m.role === 'user' ? 'तुम्ही' : 'एआय सहाय्यक'}
                </span>
                {m.role === 'bot' && (
                  <button 
                    onClick={() => handleSpeakManual(m.text)} 
                    className={`p-1.5 rounded-lg transition ${isSpeaking ? 'text-red-500 bg-red-50' : 'text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/30'}`}
                    title="बोला"
                  >
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
              <p className="marathi-font text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start items-center gap-2">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700 flex gap-2 shadow-sm">
              <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <div className="mx-6 mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-xs text-red-600 dark:text-red-400 marathi-font">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
        </div>
      )}

      {/* Quick Replies Section */}
      {!loading && messages.length > 0 && (
        <div className="px-4 py-3 bg-slate-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2 overflow-hidden">
             <Sparkles size={14} className="text-violet-500 shrink-0" />
             <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">त्वरीत विचारून पहा</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {QUICK_REPLIES.map((query, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(query)}
                className="whitespace-nowrap bg-white dark:bg-gray-800 border border-violet-100 dark:border-gray-700 px-4 py-2 rounded-full text-xs font-bold marathi-font text-violet-700 dark:text-violet-400 shadow-sm hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:border-violet-300 transition-all active:scale-95"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-2xl border dark:border-gray-700 focus-within:ring-2 focus-within:ring-violet-500/50 transition-all shadow-inner">
          <input 
            className="flex-1 bg-transparent p-3 outline-none marathi-font text-sm dark:text-white"
            placeholder="येथे तुमचा प्रश्न विचारा..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={toggleMic}
            className={`p-3 rounded-xl transition-all active:scale-90 ${isListening ? 'bg-red-600 text-white animate-pulse' : 'text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900/50'}`}
          >
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
          <button 
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-40 transition-all active:scale-90 shadow-lg shadow-violet-100 dark:shadow-none"
          >
            <Send size={22} />
          </button>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AgroAssistant;
