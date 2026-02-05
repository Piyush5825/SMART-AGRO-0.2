
import React, { useState } from 'react';
import { HeartPulse, Search, Info, FlaskConical, Droplets, Leaf, X, AlertTriangle, Bug, ShieldCheck, Microscope } from 'lucide-react';
import { OFFLINE_DISEASES } from '../services/diseaseData';
import { DiseaseInfo } from '../types';

const DiseaseLibrary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | null>(null);

  const filtered = OFFLINE_DISEASES.filter(d => 
    d.cropName.toLowerCase().includes(search.toLowerCase()) || 
    d.diseaseName.toLowerCase().includes(search.toLowerCase()) ||
    d.affectedCrops.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-red-50 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-red-100 text-red-600 rounded-2xl">
            <Microscope size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold marathi-font text-red-600">पिकांचे आजार व उपाय</h2>
            <p className="text-sm text-gray-500 marathi-font mt-1">खराब पानांचा फोटो निवडा आणि माहिती मिळवा</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          <input 
            type="text"
            className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-3xl outline-none marathi-font focus:ring-4 focus:ring-red-500/10 text-xl dark:text-white transition-all shadow-inner"
            placeholder="पिकाचे किंवा रोगाचे नाव शोधा..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(d => (
          <button 
            key={d.id} 
            onClick={() => setSelectedDisease(d)}
            className="group relative bg-white dark:bg-gray-800 rounded-[2rem] shadow-lg overflow-hidden border border-gray-50 dark:border-gray-700 hover:shadow-2xl transition-all active:scale-95 text-left"
          >
            <div className="aspect-square w-full overflow-hidden bg-gray-100">
              <img 
                src={d.imageUrl} 
                alt={d.diseaseName} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-4">
              <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full mb-2 uppercase tracking-wide">{d.cropName}</span>
              <h3 className="marathi-font font-bold text-lg text-gray-800 dark:text-white leading-tight line-clamp-2">{d.diseaseName}</h3>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="marathi-font text-gray-400 text-xl">कोणताही फोटो सापडला नाही.</p>
          </div>
        )}
      </div>

      {selectedDisease && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row h-full max-h-[85vh] md:h-auto">
            <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden bg-gray-200 shrink-0">
              <img src={selectedDisease.imageUrl} alt={selectedDisease.diseaseName} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold marathi-font text-red-700 leading-tight">{selectedDisease.diseaseName}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDisease.affectedCrops.map(c => (
                      <span key={c} className="text-xs font-bold marathi-font text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">{c}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setSelectedDisease(null)} className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-red-50 rounded-full transition text-gray-500">
                  <X size={28} />
                </button>
              </div>

              <div className="space-y-6">
                <section className="bg-red-50 dark:bg-red-900/10 p-5 rounded-3xl border border-red-100">
                  <h4 className="marathi-font font-bold text-red-800 dark:text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle size={20} /> मुख्य कारण:
                  </h4>
                  <p className="marathi-font text-gray-700 dark:text-gray-300">{selectedDisease.reason}</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem icon={<FlaskConical className="text-blue-600"/>} title="कीटकनाशके" text={selectedDisease.pesticides} />
                  <InfoItem icon={<Droplets className="text-emerald-600"/>} title="तणनाशके" text={selectedDisease.herbicides} />
                  <InfoItem icon={<Leaf className="text-green-600"/>} title="सेंद्रिय खते" text={selectedDisease.compost} />
                  <InfoItem icon={<ShieldCheck className="text-amber-600"/>} title="खबरदारी" text={selectedDisease.precautions} />
                </div>

                <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-3xl">
                  <h4 className="marathi-font font-bold text-gray-800 dark:text-gray-200 mb-2">अचूक उपाययोजना:</h4>
                  <p className="marathi-font text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{selectedDisease.solution}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ icon, title, text }: any) => (
  <div className="p-4 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl shadow-sm">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <h5 className="marathi-font font-bold text-sm text-gray-700 dark:text-gray-200">{title}</h5>
    </div>
    <p className="marathi-font text-xs text-gray-500 dark:text-gray-400">{text || 'लागू नाही'}</p>
  </div>
);

export default DiseaseLibrary;
