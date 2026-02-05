
import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, ArrowRight, RefreshCcw } from 'lucide-react';
import { fetchAgroNews } from '../services/geminiService';
import { NewsItem } from '../types';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    setLoading(true);
    try {
      const saved = localStorage.getItem('farmer_profile');
      const profile = saved ? JSON.parse(saved) : {};
      const data = await fetchAgroNews(profile.district || 'महाराष्ट्र');
      setNews(data.news || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNews(); }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold marathi-font text-blue-800 flex items-center gap-2">
          <Newspaper /> शेती बातम्या व योजना
        </h2>
        <button onClick={loadNews} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 marathi-font text-gray-400">बातम्या शोधत आहे...</div>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-3xl shadow-md border border-gray-50 flex flex-col md:flex-row gap-6 hover:shadow-xl transition group">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-400 marathi-font">
                  <Calendar size={14} /> {item.date} | {item.source}
                </div>
                <h3 className="text-xl font-bold marathi-font text-gray-800 group-hover:text-blue-600 transition">{item.title}</h3>
                <p className="marathi-font text-sm text-gray-600 leading-relaxed line-clamp-2">{item.content}</p>
                <button className="text-blue-600 font-bold marathi-font text-sm flex items-center gap-1">
                  अधिक वाचा <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
