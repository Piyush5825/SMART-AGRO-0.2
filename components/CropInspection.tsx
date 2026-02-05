
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle, Droplets, FlaskConical, Leaf, Mic, MicOff, Edit3, Save, Video, FileVideo, Zap, RefreshCw, X, PlayCircle, Clock, Info, Calendar } from 'lucide-react';
import { inspectCrop } from '../services/geminiService';
import { CropDiseaseResult } from '../types';

const LOADING_STATUSES = [
  "व्हिडिओ स्कॅन होत आहे...",
  "रोगाची लक्षणे शोधली जात आहेत...",
  "एआय पीक विश्लेषण करत आहे...",
  "उपचार योजना तयार होत आहे...",
  "प्रमाण मोजले जात आहे..."
];

const CropInspection: React.FC = () => {
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<CropDiseaseResult | null>(null);
  
  // States for editable fields
  const [editableTreatment, setEditableTreatment] = useState('');
  const [editablePreventive, setEditablePreventive] = useState('');
  const [isListening, setIsListening] = useState<'treatment' | 'preventive' | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sync editable fields when AI result arrives
  useEffect(() => {
    if (result) {
      setEditableTreatment(result.treatment);
      setEditablePreventive(result.preventiveMeasures);
    }
  }, [result]);

  // Handle step-by-step loading messages
  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % LOADING_STATUSES.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      if (isVideo && file.size > 50 * 1024 * 1024) {
        alert("व्हिडिओ ५०MB पेक्षा मोठा नसावी.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia(reader.result as string);
        setMediaType(isVideo ? 'video' : 'image');
        setMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeMedia = async () => {
    if (!media) return;
    setLoading(true);
    setResult(null);
    try {
      const base64Data = media.split(',')[1];
      const data = await inspectCrop(base64Data, mimeType);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('विश्लेषण अयशस्वी. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setLoading(false);
    }
  };

  const startVoiceInput = (field: 'treatment' | 'preventive') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening === field) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'mr-IN';
    recognition.interimResults = true;
    
    recognition.onstart = () => setIsListening(field);
    recognition.onend = () => setIsListening(null);
    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) transcript += event.results[i][0].transcript;
      }
      if (transcript) {
        if (field === 'treatment') setEditableTreatment(prev => (prev ? prev + " " : "") + transcript);
        else setEditablePreventive(prev => (prev ? prev + " " : "") + transcript);
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const saveEdits = () => {
    if (result) {
      setResult({ ...result, treatment: editableTreatment, preventiveMeasures: editablePreventive });
      alert("माहिती जतन केली आहे!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-indigo-50 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Camera size={24} />
            </div>
            <h2 className="text-2xl font-bold marathi-font text-indigo-800 dark:text-indigo-400">एआई पीक तपासणी</h2>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-full text-[10px] font-bold uppercase border border-amber-100">
            <Zap size={12} className="fill-current" /> Dosage Expert
          </div>
        </div>
        
        <div className="border-2 border-dashed border-indigo-200 dark:border-gray-700 rounded-3xl p-6 text-center bg-indigo-50/20 dark:bg-gray-900/50">
          {media ? (
            <div className="space-y-4">
              <div className="relative group">
                {mediaType === 'video' ? (
                  <video src={media} controls className="max-h-72 mx-auto rounded-2xl shadow-md bg-black w-full object-contain" />
                ) : (
                  <img src={media} alt="Crop" className="max-h-72 mx-auto rounded-2xl shadow-md w-full object-contain" />
                )}
                <button onClick={() => { setMedia(null); setMediaType(null); setResult(null); }} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"><X size={18} /></button>
              </div>
              <div className="flex justify-center gap-3">
                <button onClick={() => { setMedia(null); setMediaType(null); setResult(null); }} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-2xl marathi-font font-bold">बदला</button>
                <button onClick={analyzeMedia} disabled={loading} className="flex-1 bg-indigo-600 text-white px-8 py-3 rounded-2xl marathi-font font-bold shadow-lg flex items-center justify-center gap-2">
                  {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
                  {loading ? 'एआई विश्लेषण करत आहे...' : 'आताच विश्लेषण करा'}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 space-y-6">
              <div className="flex justify-center gap-8">
                <div className="flex flex-col items-center gap-2"><Camera size={48} className="text-indigo-300"/><span className="text-[10px] font-bold text-indigo-400">PHOTO</span></div>
                <div className="h-12 w-[1px] bg-indigo-100 self-center" />
                <div className="flex flex-col items-center gap-2"><Video size={48} className="text-indigo-300"/><span className="text-[10px] font-bold text-indigo-400">VIDEO</span></div>
              </div>
              <p className="marathi-font text-gray-500 text-lg">पिकाचा फोटो काढा किंवा ३० सेकंदांपर्यंतचा व्हिडिओ निवडा</p>
              <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
              <button onClick={() => fileInputRef.current?.click()} className="bg-indigo-600 text-white p-6 rounded-full shadow-2xl"><Upload size={36} /></button>
            </div>
          )}
        </div>

        {loading && (
          <div className="mt-6 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100">
            <div className="flex items-center gap-5">
              <RefreshCw size={32} className="text-indigo-600 animate-spin" />
              <div className="flex-1">
                <p className="marathi-font font-bold text-indigo-800 dark:text-indigo-300">{LOADING_STATUSES[loadingStep]}</p>
                <div className="w-full bg-indigo-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${((loadingStep + 1) / LOADING_STATUSES.length) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-500">
          <div className={`p-6 text-white flex items-center justify-between ${result.diseaseName.includes('निरोगी') ? 'bg-green-600' : 'bg-orange-600'}`}>
            <div className="flex items-center gap-3">
              {result.diseaseName.includes('निरोगी') ? <CheckCircle size={28} /> : <AlertCircle size={28} />}
              <div>
                <h3 className="marathi-font font-bold text-xl">{result.cropName}: {result.diseaseName}</h3>
                <div className="flex items-center gap-2 opacity-90 text-[10px] font-bold uppercase">
                  <Calendar size={12} /> पिकाची अवस्था: {result.cropStage || 'अनोळखी'}
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-bold border border-white/10">{result.accuracy}% अचूकता</div>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="p-5 bg-slate-50 dark:bg-gray-900 rounded-3xl border border-slate-100">
               <h4 className="marathi-font font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2"><Leaf size={18} className="text-green-500" /> लक्षणांचे स्पष्टीकरण:</h4>
               <p className="marathi-font text-gray-600 dark:text-gray-300 text-sm">{result.explanation}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DosageTile icon={<FlaskConical size={20} />} title="खत नियोजन" data={result.fertilizerDetails} color="blue" />
              <DosageTile icon={<Droplets size={20} />} title="कीटकनाशक" data={result.herbicideDetails} color="red" />
              <DosageTile icon={<Leaf size={20} />} title="सेंद्रिय उपाय" data={result.compostDetails} color="green" />
            </div>
            
            <div className="space-y-6">
              <EditableSection title="तात्काळ उपचार योजना" value={editableTreatment} onChange={setEditableTreatment} onVoice={() => startVoiceInput('treatment')} isListening={isListening === 'treatment'} color="indigo" />
              <EditableSection title="भविष्यातील खबरदारी" value={editablePreventive} onChange={setEditablePreventive} onVoice={() => startVoiceInput('preventive')} isListening={isListening === 'preventive'} color="amber" />
            </div>

            <div className="flex gap-4">
               <button onClick={saveEdits} className="flex-1 bg-green-600 text-white p-5 rounded-2xl font-bold marathi-font shadow-lg flex items-center justify-center gap-2"><Save size={20} /> माहिती जतन करा</button>
               <button onClick={() => { setMedia(null); setMediaType(null); setResult(null); }} className="p-5 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-2xl font-bold marathi-font">पुन्हा तपासणी</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DosageTile = ({ icon, title, data, color }: any) => {
  const colors: any = {
    blue: 'bg-blue-50 border-blue-100 text-blue-800 dark:bg-blue-900/10 dark:border-blue-900/30 dark:text-blue-400',
    red: 'bg-red-50 border-red-100 text-red-800 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400',
    green: 'bg-green-50 border-green-100 text-green-800 dark:bg-green-900/10 dark:border-green-900/30 dark:text-green-400',
  };
  return (
    <div className={`p-5 rounded-3xl border ${colors[color]} flex flex-col gap-3 h-full`}>
      <div className="flex items-center gap-2 font-bold marathi-font text-xs uppercase opacity-80">{icon} {title}</div>
      <div className="flex-1">
        <p className="marathi-font font-bold text-[15px] mb-1">{data?.name || 'लागू नाही'}</p>
        <div className="flex items-start gap-2 bg-white/40 dark:bg-black/20 p-2 rounded-xl border border-white/20">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p className="marathi-font text-[13px] font-bold leading-tight">प्रमाण: {data?.dosage || 'माहिती उपलब्ध नाही'}</p>
        </div>
      </div>
    </div>
  );
};

const EditableSection = ({ title, value, onChange, onVoice, isListening, color }: any) => {
  const colors: any = {
    indigo: 'border-indigo-100 bg-indigo-50/10',
    amber: 'border-amber-100 bg-amber-50/10'
  };
  return (
    <div className={`p-5 rounded-3xl border ${colors[color]} dark:border-gray-700`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="marathi-font font-bold text-gray-800 dark:text-white flex items-center gap-2 text-lg"><Edit3 size={18}/> {title}:</h4>
        <button onClick={onVoice} className={`p-2.5 rounded-xl transition ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white dark:bg-gray-800 text-gray-400'}`}>
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
      </div>
      <textarea className="w-full bg-transparent border-none focus:ring-0 p-1 marathi-font text-sm text-gray-700 dark:text-gray-300 min-h-[80px] resize-none" value={value} onChange={(e) => onChange(e.target.value)} placeholder="माहिती अपडेट करा..." />
    </div>
  );
};

export default CropInspection;
