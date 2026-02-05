
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Globe, Trash2, Moon, Sun, Monitor } from 'lucide-react';

const Settings: React.FC = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const applyTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Direct manipulation of documentElement for immediate feedback
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const resetApp = () => {
    if (confirm("तुमची सर्व माहिती पुसून टाकू इच्छिता का? यामुळे तुमच्या सर्व नोंदी आणि प्रोफाइल नष्ट होईल.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300 pb-32">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-bold marathi-font text-gray-800 dark:text-white flex items-center gap-3">
          <SettingsIcon className="text-green-600" size={32} /> सेटिंग्ज
        </h2>
      </div>

      <div className="space-y-8">
        {/* Theme Selection Section */}
        <section>
          <h3 className="marathi-font font-bold text-lg text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Monitor size={20} /> थीम निवडा (Theme)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => applyTheme('light')}
              className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all duration-300 active:scale-95 ${theme === 'light' ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-lg shadow-orange-100' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-gray-500'}`}
            >
              <Sun size={32} />
              <span className="marathi-font font-bold">दिवस (Light)</span>
            </button>
            <button 
              onClick={() => applyTheme('dark')}
              className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all duration-300 active:scale-95 ${theme === 'dark' ? 'bg-indigo-900/40 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-900/20' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-gray-500'}`}
            >
              <Moon size={32} />
              <span className="marathi-font font-bold">रात्र (Dark)</span>
            </button>
          </div>
        </section>

        {/* Language Section */}
        <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700 transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl"><Globe size={24} /></div>
            <div>
              <p className="marathi-font font-bold dark:text-white text-lg">अॅपची भाषा</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 marathi-font">मराठी (महाराष्ट्र)</p>
            </div>
          </div>
          <span className="text-blue-600 dark:text-blue-400 marathi-font font-bold bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">मराठी</span>
        </div>

        {/* Reset Button */}
        <div className="mt-12 pt-8 border-t dark:border-gray-700">
          <button 
            onClick={resetApp}
            className="w-full flex items-center justify-center gap-3 text-red-600 dark:text-red-400 p-5 border-2 border-red-100 dark:border-red-900/20 rounded-3xl font-bold marathi-font hover:bg-red-50 dark:hover:bg-red-900/10 transition active:scale-95"
          >
            <Trash2 size={24} /> सर्व माहिती पुसून टाका (Reset App)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
