
import React, { useState } from 'react';
import { Target, TrendingUp, ShieldCheck, Briefcase, Sparkles } from 'lucide-react';
import { getFuturePlannerAdvice } from '../services/geminiService';
import { FutureAdvice } from '../types';

const FuturePlanner: React.FC = () => {
  const [advice, setAdvice] = useState<FutureAdvice | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePlanner = async () => {
    setLoading(true);
    try {
      const saved = localStorage.getItem('farmer_profile');
      const profile = saved ? JSON.parse(saved) : {};
      const data = await getFuturePlannerAdvice(profile);
      setAdvice(data);
    } catch (e) {
      alert("नियोजन करताना त्रुटी आली.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-purple-50 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><Sparkles size={80} /></div>
        <h2 className="text-3xl font-bold marathi-font text-purple-900 mb-4 flex items-center justify-center gap-3">
          <Target className="text-purple-600" /> भविष्यातील नियोजन (AI)
        </h2>
        <p className="marathi-font text-gray-600 max-w-xl mx-auto mb-8">
          तुमच्या जिल्ह्याचा हवामान अहवाल, मागील बाजारभाव आणि तुमच्या शेतीची माहिती वापरून आम्ही तुम्हाला पुढील २-५ वर्षांसाठी पीक आणि गुंतवणुकीचा सल्ला देऊ शकतो.
        </p>
        <button 
          onClick={generatePlanner} 
          disabled={loading}
          className="bg-purple-600 text-white px-10 py-4 rounded-3xl font-bold marathi-font shadow-xl shadow-purple-100 hover:bg-purple-700 transition active:scale-95 disabled:opacity-50"
        >
          {loading ? 'नियोजन तयार होत आहे...' : 'माझे भविष्य नियोजन करा'}
        </button>
      </div>

      {advice && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-purple-500">
            <div className="flex items-center gap-3 mb-4 text-purple-700 font-bold marathi-font">
              <TrendingUp /> बाजारभाव अंदाज (Investments)
            </div>
            <p className="marathi-font text-sm leading-relaxed text-gray-700">{advice.marketPrediction}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4 text-blue-700 font-bold marathi-font">
              <Briefcase /> गुंतवणूक सल्ला
            </div>
            <p className="marathi-font text-sm leading-relaxed text-gray-700">{advice.investmentAdvice}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-green-500">
            <div className="flex items-center gap-3 mb-4 text-green-700 font-bold marathi-font">
              <Target /> पीक बदल सल्ला
            </div>
            <p className="marathi-font text-sm leading-relaxed text-gray-700">{advice.cropTransitionAdvice}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-red-500">
            <div className="flex items-center gap-3 mb-4 text-red-700 font-bold marathi-font">
              <ShieldCheck /> धोका निवारण (Risk Management)
            </div>
            <p className="marathi-font text-sm leading-relaxed text-gray-700">{advice.riskMitigation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuturePlanner;
