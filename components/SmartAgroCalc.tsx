
import React, { useState } from 'react';
import { SOIL_TYPES, SEASONS } from '../constants';
import { getSmartAgroAdvice } from '../services/geminiService';
import { CropRecommendation, FutureAdvice } from '../types';
import { Sprout, IndianRupee, Droplets, Info, Target, TrendingUp, ShieldCheck, Briefcase } from 'lucide-react';

const SmartAgroCalc: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CropRecommendation[]>([]);
  const [futureAdvice, setFutureAdvice] = useState<FutureAdvice | null>(null);
  const [formData, setFormData] = useState({
    landArea: '',
    soilType: SOIL_TYPES[0],
    pH: '7.0',
    lightLevel: 'मध्यम',
    irrigation: 'उपलब्ध',
    season: SEASONS[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getSmartAgroAdvice(formData);
      setResults(data.recommendations || []);
      setFutureAdvice(data.futureAdvice || null);
    } catch (err) {
      console.error(err);
      alert('माहिती मिळवताना त्रुटी आली.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-colors duration-300">
        <h2 className="text-2xl font-bold marathi-font mb-6 text-green-800 dark:text-green-400 flex items-center gap-2">
          <Sprout /> स्मार्ट अ‍ॅग्रो गणक
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block marathi-font font-semibold mb-1 dark:text-gray-200">क्षेत्रफळ (एकर)</label>
            <input 
              type="number" 
              required
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formData.landArea}
              onChange={(e) => setFormData({...formData, landArea: e.target.value})}
              placeholder="उदा. २"
            />
          </div>
          <div>
            <label className="block marathi-font font-semibold mb-1 dark:text-gray-200">मातीचा प्रकार</label>
            <select 
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formData.soilType}
              onChange={(e) => setFormData({...formData, soilType: e.target.value})}
            >
              {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block marathi-font font-semibold mb-1 dark:text-gray-200">pH पातळी</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formData.pH}
              onChange={(e) => setFormData({...formData, pH: e.target.value})}
              placeholder="६.५ - ७.५"
            />
          </div>
          <div>
            <label className="block marathi-font font-semibold mb-1 dark:text-gray-200">हंगाम</label>
            <select 
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formData.season}
              onChange={(e) => setFormData({...formData, season: e.target.value})}
            >
              {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-700 text-white p-4 rounded-xl font-bold marathi-font hover:bg-green-800 transition disabled:opacity-50"
            >
              {loading ? 'प्रक्रिया सुरू आहे...' : 'पीक शिफारसी आणि भविष्यातील नियोजन मिळवा'}
            </button>
          </div>
        </form>
      </div>

      {results.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold marathi-font text-green-800 dark:text-green-400">तुमच्यासाठी शिफारस केलेली पिके:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((crop, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border-l-4 border-green-600 transition-colors">
                <h4 className="text-lg font-bold marathi-font text-green-700 dark:text-green-400 mb-3">{crop.cropName}</h4>
                <div className="space-y-2 text-sm dark:text-gray-300">
                  <p className="flex items-center gap-2"><IndianRupee size={16} /> <strong>नफा:</strong> {crop.estimatedProfit}</p>
                  <p className="flex items-center gap-2"><Sprout size={16} /> <strong>उत्पन्न:</strong> {crop.expectedYield}</p>
                  <p className="flex items-start gap-2"><Info size={16} className="mt-1" /> <strong>खत नियोजन:</strong> {crop.fertilizerPlan}</p>
                  <p className="flex items-center gap-2"><Droplets size={16} /> <strong>सिंचन:</strong> {crop.irrigationStrategy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {futureAdvice && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-xl font-bold marathi-font text-purple-800 dark:text-purple-400 flex items-center gap-2">
            <Target /> भविष्यातील नियोजन (Future Planning):
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border-t-4 border-purple-500 transition-colors">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold marathi-font mb-2">
                <TrendingUp size={20} /> बाजारभाव अंदाज
              </div>
              <p className="marathi-font text-sm text-gray-700 dark:text-gray-300">{futureAdvice.marketPrediction}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border-t-4 border-blue-500 transition-colors">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold marathi-font mb-2">
                <Briefcase size={20} /> गुंतवणूक सल्ला
              </div>
              <p className="marathi-font text-sm text-gray-700 dark:text-gray-300">{futureAdvice.investmentAdvice}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border-t-4 border-green-500 transition-colors">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold marathi-font mb-2">
                <Target size={20} /> पीक बदल सल्ला
              </div>
              <p className="marathi-font text-sm text-gray-700 dark:text-gray-300">{futureAdvice.cropTransitionAdvice}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border-t-4 border-red-500 transition-colors">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold marathi-font mb-2">
                <ShieldCheck size={20} /> धोका निवारण
              </div>
              <p className="marathi-font text-sm text-gray-700 dark:text-gray-300">{futureAdvice.riskMitigation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAgroCalc;
