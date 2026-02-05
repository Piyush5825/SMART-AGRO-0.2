import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw, Info, BarChart3, Search, MapPin, Filter, Sparkles, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MarketPrice as MarketPriceType } from '../types';
import { fetchMarketPrices, getMarketSummaryAI } from '../services/marketService';
import { APP_LABELS, MAHARASHTRA_DISTRICTS } from '../constants';

const MarketPrice: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<MarketPriceType[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('सर्व जिल्हे');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchMarketPrices();
      setPrices(data);
      setLastUpdated(new Date().toLocaleTimeString('mr-IN'));
      
      const summary = await getMarketSummaryAI(data);
      setAiSummary(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtered Prices
  const filteredPrices = useMemo(() => {
    return prices.filter(p => {
      const matchesSearch = p.commodity.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDistrict = selectedDistrict === 'सर्व जिल्हे' || p.district.includes(selectedDistrict);
      return matchesSearch && matchesDistrict;
    });
  }, [prices, searchTerm, selectedDistrict]);

  // Generate mock historical data for the top 3 commodities in current view
  const chartData = useMemo(() => {
    const topItems = filteredPrices.slice(0, 3);
    if (topItems.length === 0) return [];
    
    const days = ['७ दिवस आधी', '६ दिवस आधी', '५ दिवस आधी', '४ दिवस आधी', '३ दिवस आधी', 'काल', 'आज'];
    return days.map((day, dayIdx) => {
      const entry: any = { name: day };
      topItems.forEach(p => {
        const volatility = p.modalPrice * 0.03;
        const offset = (days.length - 1 - dayIdx) * (Math.random() - 0.5) * volatility;
        entry[p.commodity] = Math.round(p.modalPrice + offset);
      });
      return entry;
    });
  }, [filteredPrices]);

  const topCommodityNames = useMemo(() => filteredPrices.slice(0, 3).map(p => p.commodity), [filteredPrices]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-4xl font-bold marathi-font text-amber-900 dark:text-amber-500">बाजारभाव ट्रॅकर</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold marathi-font">
              ● Live महाराष्ट्र
            </span>
            <p className="text-xs text-amber-600 dark:text-amber-400 marathi-font flex items-center gap-1">
              <Info size={14} /> अपडेट: {lastUpdated || 'Loading...'}
            </p>
          </div>
        </div>
        <button 
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 bg-amber-600 text-white px-8 py-4 rounded-2xl hover:bg-amber-700 transition-all disabled:opacity-50 marathi-font font-bold shadow-xl shadow-amber-100 dark:shadow-none active:scale-95"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} /> 
          {loading ? 'अपडेट होत आहे...' : 'रिफ्रेश करा'}
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-lg border border-amber-50 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl marathi-font outline-none focus:ring-2 focus:ring-amber-500 transition-all dark:text-white"
            placeholder="शेतमाल शोधा (उदा. कांदा, कापूस)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl marathi-font outline-none focus:ring-2 focus:ring-amber-500 transition-all dark:text-white appearance-none"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option>सर्व जिल्हे</option>
            {MAHARASHTRA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* AI Market Pulse & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart View */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-amber-50 dark:border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl">
                <BarChart3 size={24} />
              </div>
              <h3 className="marathi-font font-bold text-xl text-gray-800 dark:text-gray-200">दर वाढ/घट कल (Trend)</h3>
            </div>
          </div>
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: '#9ca3af' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#9ca3af' }} 
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '20px', 
                      border: 'none', 
                      boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                      fontFamily: 'Tiro Devanagari Marathi, sans-serif'
                    }}
                  />
                  <Legend iconType="circle" />
                  {topCommodityNames.map((name, idx) => (
                    <Line 
                      key={name}
                      type="monotone" 
                      dataKey={name} 
                      stroke={idx === 0 ? '#d97706' : idx === 1 ? '#059669' : '#2563eb'} 
                      strokeWidth={4}
                      dot={false}
                      activeDot={{ r: 6 }}
                      animationDuration={2000}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 marathi-font italic">
                माहिती उपलब्ध नाही.
              </div>
            )}
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
            <Sparkles size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <Sparkles size={20} className="fill-current" />
              </div>
              <h4 className="marathi-font font-bold text-lg">एआय मार्केट पल्स</h4>
            </div>
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 bg-white/20 rounded w-full animate-pulse" />
                <div className="h-4 bg-white/20 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-white/20 rounded w-5/6 animate-pulse" />
              </div>
            ) : (
              <p className="marathi-font leading-relaxed text-sm lg:text-base font-medium">
                {aiSummary || "बाजार विश्लेषणाचे काम सुरू आहे..."}
              </p>
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-white/20 flex items-center justify-between relative z-10">
            <div className="text-[10px] uppercase font-bold tracking-widest opacity-80">Sentiment</div>
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold marathi-font">
              <TrendingUp size={14} /> तेजी (Bullish)
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl overflow-hidden border border-amber-50 dark:border-gray-700 relative">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left marathi-font min-w-[700px]">
            <thead className="bg-amber-600 text-white">
              <tr>
                <th className="p-6 font-bold border-b border-amber-700">शेतमाल</th>
                <th className="p-6 font-bold border-b border-amber-700">बाजार (जिल्हा)</th>
                <th className="p-6 font-bold border-b border-amber-700">किमान - कमाल दर</th>
                <th className="p-6 font-bold border-b border-amber-700">सरासरी दर (₹)</th>
                <th className="p-6 font-bold border-b border-amber-700 text-center">बाजार कल</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50 dark:divide-gray-700">
              {filteredPrices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-400 marathi-font">
                    <div className="flex flex-col items-center gap-4">
                      <AlertCircle size={48} className="text-amber-200" />
                      माहिती सापडली नाही.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPrices.map((item, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/50 dark:hover:bg-gray-700/50 transition">
                    <td className="p-6">
                      <div className="font-bold text-gray-800 dark:text-white text-lg">{item.commodity}</div>
                      <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Quality: Fair</div>
                    </td>
                    <td className="p-6 text-gray-600 dark:text-gray-400 flex items-center gap-2">
                       <MapPin size={14} className="text-amber-400" /> {item.district}
                    </td>
                    <td className="p-6">
                      <div className="text-sm text-gray-500 dark:text-gray-400">₹{item.minPrice} - ₹{item.maxPrice}</div>
                      <div className="w-24 bg-gray-100 dark:bg-gray-900 h-1 rounded-full mt-2 overflow-hidden">
                        <div className="bg-amber-400 h-full" style={{ width: '60%' }} />
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-green-700 dark:text-green-400 text-xl">₹{item.modalPrice}</div>
                      <div className="text-[10px] text-gray-400">प्रति क्विंटल</div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center">
                        <div className={`p-2.5 rounded-2xl ${
                          item.trend === 'up' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 
                          item.trend === 'down' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
                        }`}>
                          {item.trend === 'up' && <TrendingUp size={24} />}
                          {item.trend === 'down' && <TrendingDown size={24} />}
                          {item.trend === 'stable' && <Minus size={24} />}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] border-2 border-dashed border-amber-200 dark:border-amber-800/50 flex flex-col md:flex-row items-center gap-4">
        <div className="p-3 bg-white dark:bg-gray-800 rounded-full text-amber-500 shadow-md">
          <Info size={24} />
        </div>
        <p className="text-amber-800 dark:text-amber-300 text-xs marathi-font text-center md:text-left leading-relaxed">
          <strong>अस्वीकरण:</strong> वरील माहिती अधिकृत सरकारी API (Agmarknet) द्वारे प्रसारित केली जाते. दरांमध्ये स्थानिक बाजार समितीच्या धोरणानुसार बदल असू शकतात. प्रत्यक्ष व्यवहारापूर्वी आपल्या जवळच्या कृषी उत्पन्न बाजार समितीशी (APMC) संपर्क साधून खात्री करा.
        </p>
      </div>
    </div>
  );
};

export default MarketPrice;