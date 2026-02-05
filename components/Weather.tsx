
import React, { useState, useEffect } from 'react';
import { CloudSun, Wind, Droplets, Thermometer, MapPin, RefreshCcw, Navigation, AlertTriangle, CloudRain, BellRing } from 'lucide-react';
import { WeatherData } from '../types';
import { MAHARASHTRA_DISTRICTS } from '../constants';

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState('पुणे');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [farmAlert, setFarmAlert] = useState<{message: string, type: 'danger' | 'warning'} | null>(null);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  const triggerBrowserNotification = (title: string, body: string) => {
    if (notificationPermission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/favicon.ico' // Assuming a favicon exists
      });
    }
  };

  const checkExtremeWeather = (data: any) => {
    const temp = data.main.temp;
    const weatherId = data.weather[0].id;
    let alert = null;

    // Heatwave logic
    if (temp >= 40) {
      alert = {
        message: "सतर्कता: उष्णतेची लाट! भरपूर पाणी प्या आणि दुपारी बाहेर जाणे टाळा.",
        type: 'danger' as const
      };
      triggerBrowserNotification("उष्णतेची लाट!", alert.message);
    } 
    // Thunderstorm (IDs 200-232)
    else if (weatherId >= 200 && weatherId <= 232) {
      alert = {
        message: "सतर्कता: वीज कडकडाटासह वादळाची शक्यता आहे. सुरक्षित स्थळी राहा!",
        type: 'danger' as const
      };
      triggerBrowserNotification("वादळाचा इशारा!", alert.message);
    }
    // Heavy Rain (IDs 502, 503, 504, 522)
    else if ([502, 503, 504, 522].includes(weatherId)) {
      alert = {
        message: "सतर्कता: तुमच्या भागात मुसळधार पाऊस पडण्याची शक्यता आहे!",
        type: 'warning' as const
      };
      triggerBrowserNotification("मुसळधार पाऊस!", alert.message);
    }

    setFarmAlert(alert);
  };

  const fetchWeather = async (lat?: number, lon?: number, districtName?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = '';
      const saved = localStorage.getItem('farmer_profile');
      const profile = saved ? JSON.parse(saved) : null;

      if (lat && lon) {
        query = `lat=${lat}&lon=${lon}`;
      } else if (districtName) {
        query = `q=${districtName},IN`;
        setLocationName(districtName);
      } else {
        const cityEn = profile?.district || 'Pune';
        setLocationName(profile?.district || 'पुणे');
        query = `q=${cityEn},IN`;
      }

      const apiKey = "895286d2d7c71d643962635293297a7a"; 
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${apiKey}&lang=mr`);
      
      if (!res.ok) throw new Error("Weather Fetch Failed");
      
      const data = await res.json();
      if (lat && lon) setLocationName(data.name || 'वर्तमान स्थान');
      
      if (data.main) {
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          forecast: [
            { day: 'उद्या', temp: Math.round(data.main.temp + 1), icon: 'Sun' },
            { day: 'परवा', temp: Math.round(data.main.temp - 1), icon: 'Cloud' }
          ]
        });

        // If we have profile coordinates, prioritize those for farm-specific alerts
        if (profile?.farmLat && profile?.farmLng) {
          const farmRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${profile.farmLat}&lon=${profile.farmLng}&units=metric&appid=${apiKey}&lang=mr`);
          const farmData = await farmRes.json();
          checkExtremeWeather(farmData);
        } else {
          // Otherwise use the currently searched location
          checkExtremeWeather(data);
        }
      }

    } catch (e) {
      setError("हवामान माहिती मिळवताना अडचण आली.");
      // Fallback data
      setWeather({
        temp: 32, condition: 'Clear', description: 'निरभ्र आकाश', humidity: 40, windSpeed: 12,
        forecast: [{ day: 'उद्या', temp: 33, icon: 'Sun' }, { day: 'परवा', temp: 31, icon: 'Cloud' }]
      });
    } finally {
      setLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("तुमच्या ब्राउझरमध्ये लोकेशन सपोर्ट नाही.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => alert("लोकेशन एक्सेस नाकारला.")
    );
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dist = e.target.value;
    setSelectedDistrict(dist);
    fetchWeather(undefined, undefined, dist);
  };

  useEffect(() => { 
    fetchWeather(); 
    // Re-check permissions on mount
    setNotificationPermission(Notification.permission);
  }, []);

  if (loading) return <div className="text-center p-20 marathi-font dark:text-white animate-pulse">माहिती लोड होत आहे...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Permission Reminder */}
      {notificationPermission !== 'granted' && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-3xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200 marathi-font text-sm">
            <BellRing size={20} />
            अचूक अलर्ट मिळवण्यासाठी नोटिफिकेशन परवानगी द्या.
          </div>
          <button 
            onClick={requestNotificationPermission}
            className="bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold marathi-font hover:bg-amber-700 transition"
          >
            परवानगी द्या
          </button>
        </div>
      )}

      {/* Extreme Weather Alert Banner */}
      {farmAlert && (
        <div className={`p-6 rounded-[2.5rem] shadow-xl flex items-center gap-5 animate-pulse marathi-font font-bold border-2 ${
          farmAlert.type === 'danger' 
            ? 'bg-red-600 text-white border-red-400' 
            : 'bg-orange-500 text-white border-orange-300'
        }`}>
          <div className="bg-white/20 p-3 rounded-2xl">
            <AlertTriangle size={32} />
          </div>
          <span className="text-lg leading-tight">{farmAlert.message}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-xl border dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/2">
            <label className="block marathi-font text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">जिल्हा निवडा</label>
            <select 
              className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl marathi-font dark:text-white outline-none focus:ring-2 focus:ring-sky-500/50"
              value={selectedDistrict}
              onChange={handleDistrictChange}
            >
              <option value="">-- जिल्हा निवडा --</option>
              {MAHARASHTRA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button 
            onClick={useCurrentLocation} 
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 p-4 rounded-2xl font-bold marathi-font hover:bg-sky-200 transition-all active:scale-95 shadow-sm"
          >
            <Navigation size={20} /> माझे वर्तमान स्थान वापरा
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-sky-500 to-blue-600 dark:from-sky-800 dark:to-indigo-950 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden transition-all group">
        {/* Animated background element */}
        <div className="absolute -right-10 -top-10 bg-white/10 w-40 h-40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-3 bg-white/20 px-5 py-2.5 rounded-2xl backdrop-blur-md">
              <MapPin size={22} className="text-sky-200" />
              <span className="marathi-font text-xl font-bold">{locationName}</span>
            </div>
            <button onClick={() => fetchWeather()} className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition active:rotate-180 duration-500"><RefreshCcw size={24} /></button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left">
              <div className="flex items-start justify-center md:justify-start">
                <h1 className="text-9xl font-bold tracking-tighter leading-none">{weather?.temp}</h1>
                <span className="text-4xl font-bold mt-4">°C</span>
              </div>
              <p className="marathi-font text-3xl opacity-95 flex items-center gap-3 justify-center md:justify-start mt-4 capitalize font-semibold">
                <CloudSun size={36} /> {weather?.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <WeatherStat icon={<Droplets />} label="आद्रता" value={`${weather?.humidity}%`} />
              <WeatherStat icon={<Wind />} label="वारा" value={`${weather?.windSpeed} km/h`} />
            </div>
          </div>
        </div>
      </div>

      {/* Simple Forecast section */}
      <div className="grid grid-cols-2 gap-6">
        {weather?.forecast.map((f, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-md border dark:border-gray-700 flex flex-col items-center gap-2">
            <span className="marathi-font font-bold text-gray-500 dark:text-gray-400">{f.day}</span>
            <CloudSun className="text-sky-500" size={32} />
            <span className="text-2xl font-bold dark:text-white">{f.temp}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WeatherStat = ({ icon, label, value }: any) => (
  <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 min-w-[140px] flex flex-col items-center md:items-start">
    <div className="flex items-center gap-2 text-sky-200 mb-1">
      {React.cloneElement(icon as React.ReactElement, { size: 18 })}
      <p className="text-xs opacity-80 marathi-font font-bold">{label}</p>
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Weather;
