
import React, { useState, useEffect, useRef } from 'react';
import { MAHARASHTRA_DISTRICTS } from '../constants';
import { FarmerProfile } from '../types';
import { Save, UserCircle, Camera, MapPin, Navigation } from 'lucide-react';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<FarmerProfile>({
    name: '',
    age: '',
    village: '',
    district: MAHARASHTRA_DISTRICTS[0],
    landArea: '',
    primaryCrops: [],
    profilePic: '',
    farmLat: undefined,
    farmLng: undefined
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('farmer_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile(prev => ({ ...prev, ...parsed }));
      } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('farmer_profile', JSON.stringify(profile));
    alert('तुमची माहिती यशस्वीरित्या जतन केली आहे!');
    window.dispatchEvent(new Event('storage'));
  };

  const setFarmLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setProfile({
        ...profile,
        farmLat: pos.coords.latitude,
        farmLng: pos.coords.longitude
      });
      alert("शेताचे स्थान जतन केले!");
    });
  };

  const handlePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfile({ ...profile, profilePic: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-32 h-32 bg-green-50 text-green-700 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            {profile.profilePic ? (
              <img src={profile.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserCircle size={80} className="opacity-50" />
            )}
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow-md"><Camera size={18}/></button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePicUpload} />
        </div>
        <h2 className="text-2xl font-bold marathi-font text-green-900 dark:text-green-400">माझी प्रोफाइल</h2>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <Input label="पूर्ण नाव" value={profile.name} onChange={v => setProfile({...profile, name: v})} />
          <Input label="वय" type="number" value={profile.age} onChange={v => setProfile({...profile, age: v})} />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Input label="गाव" value={profile.village} onChange={v => setProfile({...profile, village: v})} />
          <div className="space-y-1.5">
            <label className="block marathi-font font-bold text-gray-700 dark:text-gray-300">जिल्हा</label>
            <select className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl marathi-font dark:text-white" value={profile.district} onChange={e => setProfile({...profile, district: e.target.value})}>
              {MAHARASHTRA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-dashed border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="marathi-font font-bold text-green-800 dark:text-green-400 flex items-center gap-2"><MapPin size={18}/> शेताचे स्थान (Farm Location)</h4>
              <p className="text-xs text-green-600 marathi-font">अचूक पाऊस अलर्टसाठी शेतात उभे राहून हे बटण दाबा.</p>
            </div>
            <button onClick={setFarmLocation} className="p-3 bg-green-600 text-white rounded-xl shadow-md active:scale-95"><Navigation size={20}/></button>
          </div>
          {profile.farmLat && (
            <p className="text-xs font-mono text-gray-500">स्थान: {profile.farmLat.toFixed(4)}, {profile.farmLng?.toFixed(4)}</p>
          )}
        </div>

        <Input label="एकूण शेत जमीन (एकर)" type="number" value={profile.landArea} onChange={v => setProfile({...profile, landArea: v})} />
        <Input label="मुख्य पिके (उदा. कापूस, कांदा)" value={profile.primaryCrops.join(', ')} onChange={v => setProfile({...profile, primaryCrops: v.split(',').map(c => c.trim())})} />

        <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white p-4 rounded-2xl font-bold marathi-font shadow-lg mt-4 active:scale-95">
          <Save size={20} /> माहिती जतन करा
        </button>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-1.5">
    <label className="block marathi-font font-bold text-gray-700 dark:text-gray-300">{label}</label>
    <input 
      type={type} 
      className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white" 
      value={value} 
      onChange={e => onChange(e.target.value)} 
    />
  </div>
);

export default Profile;
