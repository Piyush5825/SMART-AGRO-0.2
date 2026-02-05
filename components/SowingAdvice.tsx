
import React, { useState, useEffect } from 'react';
import { Zap, Tractor, Droplets, Ruler, Lightbulb, Calculator, RefreshCcw } from 'lucide-react';
import { getSowingAdvice } from '../services/geminiService';
import { SOIL_TYPES, SEASONS } from '../constants';

const SowingAdvice: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);
  const [formData, setFormData] = useState({
    landArea: '',
    soilType: SOIL_TYPES[0],
    season: SEASONS[0],
    soilMoisture: 'मध्यम',
    lastRainfall: '७ दिवस आधी'
  });

  useEffect(() => {
    const saved = localStorage.getItem('farmer_profile');
    if (saved) {
      const profile = JSON.parse(saved);
      if (profile.landArea) setFormData(prev => ({ ...prev, landArea: profile.landArea }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getSowingAdvice(formData);
      setAdvice(data);
    } catch (err) {
      alert("माहिती मिळवताना त्रुटी आली.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-orange-50 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-2xl">
            <Zap size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold marathi-font text-orange-600">पेरणी नियोजन (Sowing Planner)</h2>
            <p className="text-xs text-gray-500 marathi-font mt-1">तुमच्या शेतीच्या माहितीवर आधारित स्मार्ट सल्ला</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block marathi-font font-bold mb-2 dark:text-gray-200">क्षेत्रफळ (एकर)</label>
            <input 
              type="number" 
              required
              className="w-full p-4 bg-orange-50/50 dark:bg-gray-900 border border-orange-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
              value={formData.landArea}
              onChange={(e) => setFormData({...formData, landArea: e.target.value})}
              placeholder="उदा. २"
            />
          </div>
          <div>
            <label className="block marathi-font font-bold mb-2 dark:text-gray-200">मातीचा प्रकार</label>
            <select 
              className="w-full p-4 bg-orange-50/50 dark:bg-gray-900 border border-orange-100 dark:border-gray-700 rounded-2xl dark:text-white"
              value={formData.soilType}
              onChange={(e) => setFormData({...formData, soilType: e.target.value})}
            >
              {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block marathi-font font-bold mb-2 dark:text-gray-200">मातीतील ओलावा</label>
            <select 
              className="w-full p-4 bg-orange-50/50 dark:bg-gray-900 border border-orange-100 dark:border-gray-700 rounded-2xl dark:text-white"
              value={formData.soilMoisture}
              onChange={(e) => setFormData({...formData, soilMoisture: e.target.value})}
            >
              <option value="कमी">कमी (Dry)</option>
              <option value="मध्यम">मध्यम (Moist)</option>
              <option value="जास्त">जास्त (Wet)</option>
            </select>
          </div>
          <div>
            <label className="block marathi-font font-bold mb-2 dark:text-gray-200">शेवटचा पाऊस कधी झाला?</label>
            <input 
              className="w-full p-4 bg-orange-50/50 dark:bg-gray-900 border border-orange-100 dark:border-gray-700 rounded-2xl dark:text-white"
              value={formData.lastRainfall}
              onChange={(e) => setFormData({...formData, lastRainfall: e.target.value})}
              placeholder="उदा. २ दिवस आधी"
            />
          </div>
          <div className="md:col-span-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-600 text-white p-5 rounded-3xl font-bold marathi-font hover:bg-orange-700 transition shadow-xl shadow-orange-100 dark:shadow-none flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? <RefreshCcw className="animate-spin" /> : <Calculator />}
              {loading ? 'एआय गणित मांडत आहे...' : 'पेरणीचा अचूक सल्ला मिळवा'}
            </button>
          </div>
        </form>
      </div>

      {advice && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <AdviceCard 
            icon={<Tractor className="text-orange-600" />} 
            title="ट्रॅक्टर चालवण्याची योग्य वेळ" 
            text={advice.tractorTiming} 
          />
          <AdviceCard 
            icon={<Droplets className="text-blue-600" />} 
            title="पाण्याचे नियोजन (Water %)" 
            text={advice.waterPercentage} 
          />
          <AdviceCard 
            icon={<Ruler className="text-green-600" />} 
            title="पेरणीची खोली आणि अंतर" 
            text={advice.depthAndSpacing} 
          />
          <AdviceCard 
            icon={<Lightbulb className="text-amber-600" />} 
            title="एआय विशेष टीप" 
            text={advice.proTip} 
            variant="highlight"
          />
        </div>
      )}
    </div>
  );
};

const AdviceCard = ({ icon, title, text, variant }: any) => (
  <div className={`p-8 rounded-[2rem] shadow-lg border transition-all hover:scale-[1.02] ${variant === 'highlight' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/10' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">{icon}</div>
      <h4 className="marathi-font font-bold text-xl dark:text-white">{title}</h4>
    </div>
    <p className="marathi-font text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{text}</p>
  </div>
);

export default SowingAdvice;
