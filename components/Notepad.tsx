
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Save, Trash2, FileText, MicOff, AlertCircle } from 'lucide-react';

const Notepad: React.FC = () => {
  const [note, setNote] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('farmer_note');
    if (saved) setNote(saved);
    
    // Cleanup recognition on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSave = () => {
    localStorage.setItem('farmer_note', note);
    alert("तुमची नोंद यशस्वीरित्या जतन केली आहे!");
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("तुमच्या ब्राउझरमध्ये व्हॉइस इनपुट उपलब्ध नाही. कृपया गुगल क्रोम वापरा.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'mr-IN';
    recognition.interimResults = true;
    recognition.continuous = true;
    
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error("Notepad STT Error:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setError("माइक वापरण्याची परवानगी नाकारली आहे.");
      } else {
        setError("व्हॉइस टायपिंगमध्ये अडथळा आला.");
      }
    };
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setNote(prev => (prev ? prev + " " : "") + finalTranscript);
      }
    };
    
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-rose-50 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold marathi-font text-rose-800 dark:text-rose-400 flex items-center gap-3">
              <FileText size={28} /> शेती नोटपॅड
            </h2>
            <p className="text-xs text-gray-400 marathi-font mt-1">तुमच्या शेतीतील महत्त्वाच्या नोंदी येथे ठेवा</p>
          </div>
          <button 
            onClick={startVoiceInput} 
            className={`p-4 rounded-2xl transition-all duration-300 transform active:scale-95 ${isListening ? 'bg-rose-600 text-white animate-pulse scale-110 shadow-lg shadow-rose-200' : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-200'}`}
            title={isListening ? "थांबा" : "बोलून लिहा"}
          >
            {isListening ? <MicOff size={28} /> : <Mic size={28} />}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm marathi-font">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <textarea 
          className="w-full h-80 p-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-3xl marathi-font outline-none focus:ring-4 focus:ring-rose-500/20 transition-all text-lg dark:text-white resize-none shadow-inner" 
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="येथे बोला किंवा लिहा... (उदा. बियाणे खर्च, खत विक्री, मजुरीच्या नोंदी)"
        />

        <div className="flex gap-4 mt-8">
          <button 
            onClick={handleSave} 
            className="flex-1 bg-rose-600 text-white p-5 rounded-2xl font-bold marathi-font hover:bg-rose-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-rose-200 dark:shadow-none active:scale-95"
          >
            <Save size={24} /> नोंद जतन करा
          </button>
          <button 
            onClick={() => confirm("तुम्हाला ही नोंद हटवायची आहे का?") && setNote('')} 
            className="p-5 bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-500 transition-all rounded-2xl active:scale-95"
            title="साफ करा"
          >
            <Trash2 size={24} />
          </button>
        </div>
      </div>
      
      <div className="bg-rose-50/50 dark:bg-rose-900/10 p-4 rounded-2xl border border-dashed border-rose-200 dark:border-rose-900/30">
        <p className="text-center text-rose-600/70 dark:text-rose-400/70 marathi-font text-sm leading-relaxed">
          टीप: माइक वापरून तुम्ही मराठीत बोलल्यास ते आपोआप टिपले जाईल. <br/>
          तुमची माहिती तुमच्या फोनमध्येच सुरक्षित राहते.
        </p>
      </div>
    </div>
  );
};

export default Notepad;
