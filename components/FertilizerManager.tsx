
import React, { useState, useEffect } from 'react';
import { FlaskConical, Beaker, Sprout, ClipboardCheck, Info, RefreshCw, Calendar, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';
import { getFertilizerAdvice } from '../services/geminiService';
import { SOIL_TYPES } from '../constants';
import { FertilizerAdvice } from '../types';

const FertilizerManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<FertilizerAdvice | null>(null);
  const [formData, setFormData] = useState({
    targetCrop: '',
    soilType: SOIL_TYPES[0],
    landArea: '',
    nLevel: 'मध्यम',
    pLevel: 'कमी',
    kLevel: 'जास्त',
    prevCrop: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('farmer_profile');
    if (saved) {
      const profile = JSON.parse(saved);
      if (profile.landArea) setFormData(prev => ({ ...prev, landArea: profile.landArea }));
      if (profile.primaryCrops?.length > 0) setFormData(prev => ({ ...prev, targetCrop: profile.primaryCrops[0] }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getFertilizerAdvice(formData);
      setAdvice(data);
    } catch (err) {
      alert("खत नियोजन मिळवताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-cyan-50 dark:border-gray-700 transition-colors">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-3xl">
            <FlaskConical size={36} />
          </div>
          <div>
            <h2 className="text-3xl font-bold marathi-font text-cyan-800 dark:text-cyan-400">एआय खत व्यवस्थापन</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 marathi-font mt-1">माती परीक्षण आणि पिकाच्या गरजेनुसार खताचे अचूक नियोजन</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block marathi-font font-bold mb-2 dark:text-gray-200">निवडलेले पीक</label>
              <input 
                type="text" 
                required
                className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white"
                value={formData.targetCrop}
                onChange={(e) => setFormData({...formData, targetCrop: e.target.value})}
                placeholder="उदा. कापूस, गहू, कांदा"
              />
            </div>
            <div>
              <label className="block marathi-font font-bold mb-2 dark:text-gray-200">क्षेत्रफळ (एकर)</label>
              <input 
                type="number" 
                required
                className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl dark:text-white"
                value={formData.landArea}
                onChange={(e) => setFormData({...formData, landArea: e.target.value})}
                placeholder="उदा. २"
              />
            </div>
            <div>
              <label className="block marathi-font font-bold mb-2 dark:text-gray-200">मातीचा प्रकार</label>
              <select 
                className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl dark:text-white"
                value={formData.soilType}
                onChange={(e) => setFormData({...formData, soilType: e.target.value})}
              >
                {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-cyan-50/50 dark:bg-gray-900/50 p-6 rounded-[2rem] border border-cyan-100 dark:border-cyan-900/30 space-y-4">
            <h4 className="marathi-font font-bold text-cyan-800 dark:text-cyan-400 flex items-center gap-2 mb-2">
              <Beaker size={20} /> माती परीक्षण मूल्य (पर्यायी)
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <NutrientInput label="नत्र (N)" value={formData.nLevel} onChange={v => setFormData({...formData, nLevel: v})} />
              <NutrientInput label="स्फुरद (P)" value={formData.pLevel} onChange={v => setFormData({...formData, pLevel: v})} />
              <NutrientInput label="पालाश (K)" value={formData.kLevel} onChange={v => setFormData({...formData, kLevel: v})} />
            </div>
            <div>
              <label className="block marathi-font font-bold mb-1 text-sm dark:text-gray-300">मागील पीक (Previous Crop)</label>
              <input 
                type="text" 
                className="w-full p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none text-sm dark:text-white"
                value={formData.prevCrop}
                onChange={(e) => setFormData({...formData, prevCrop: e.target.value})}
                placeholder="उदा. सोयाबीन"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-cyan-600 text-white p-5 rounded-3xl font-bold marathi-font hover:bg-cyan-700 transition shadow-xl shadow-cyan-100 dark:shadow-none flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <ClipboardCheck />}
              {loading ? 'नियोजन तयार होत आहे...' : 'खत वेळापत्रक मिळवा'}
            </button>
          </div>
        </form>
      </div>

      {advice && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-lg border-l-8 border-cyan-500">
            <h4 className="marathi-font font-bold text-xl text-cyan-800 dark:text-cyan-400 mb-2 flex items-center gap-2">
              <Sprout /> {advice.cropName} साठी एआय विश्लेषण:
            </h4>
            <p className="marathi-font text-gray-700 dark:text-gray-300 leading-relaxed">{advice.soilSummary}</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {advice.schedules.map((step, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-md border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 dark:bg-cyan-900/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50" />
                <div className="relative z-10 flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold marathi-font text-lg">
                      <Calendar size={22} /> {step.stage}
                    </div>
                    <div className="bg-cyan-50 dark:bg-cyan-900/30 px-4 py-2 rounded-xl inline-block text-cyan-800 dark:text-cyan-200 marathi-font font-bold text-sm">
                      {step.timing}
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-400 marathi-font mb-2 uppercase tracking-widest font-bold">खताचे नाव आणि प्रमाण</div>
                        <div className="space-y-2">
                          {step.fertilizers.map((f, i) => (
                            <div key={i} className="marathi-font font-bold text-gray-800 dark:text-white flex items-center gap-2">
                              <ArrowRight size={14} className="text-cyan-500" /> {f}
                            </div>
                          ))}
                          <div className="mt-2 text-cyan-600 dark:text-cyan-400 font-bold marathi-font text-lg">{step.quantity}</div>
                        </div>
                      </div>
                      <div className="p-5 bg-cyan-50/30 dark:bg-cyan-900/10 rounded-3xl">
                        <div className="text-xs text-cyan-600/50 marathi-font mb-2 uppercase tracking-widest font-bold">अर्ज करण्याची पद्धत</div>
                        <p className="marathi-font text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{step.method}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-[2rem] border border-green-100 dark:border-green-800">
              <h5 className="marathi-font font-bold text-green-800 dark:text-green-400 flex items-center gap-2 mb-3">
                <Leaf size={20} /> सेंद्रिय आणि नैसर्गिक टीप:
              </h5>
              <p className="marathi-font text-sm text-green-700 dark:text-green-300 leading-relaxed">{advice.organicTips}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-[2rem] border border-red-100 dark:border-red-900/30">
              <h5 className="marathi-font font-bold text-red-800 dark:text-red-400 flex items-center gap-2 mb-3">
                <ShieldCheck size={20} /> खबरदारी:
              </h5>
              <p className="marathi-font text-sm text-red-700 dark:text-red-300 leading-relaxed">{advice.warningNotice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NutrientInput = ({ label, value, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] marathi-font font-bold text-gray-500 dark:text-gray-400 block text-center uppercase">{label}</label>
    <select 
      className="w-full p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-xs dark:text-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="कमी">कमी</option>
      <option value="मध्यम">मध्यम</option>
      <option value="जास्त">जास्त</option>
      <option value="अत्यंत जास्त">खूप जास्त</option>
    </select>
  </div>
);

export default FertilizerManager;
