
import React, { useState, useEffect } from 'react';
import { Menu, X, User, Settings, Home, ArrowLeft, LayoutGrid, Palette } from 'lucide-react';
import { APP_LABELS } from '../constants';
import { FarmerProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('farmer_profile');
    if (saved) setProfile(JSON.parse(saved));
  }, [activeView]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-gray-800 transition-colors duration-500 pb-20 md:pb-0">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-green-900 text-white transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-green-900 font-bold shadow-md">स्</div>
            <h1 className="text-xl font-bold marathi-font tracking-tight">{APP_LABELS.title}</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>
        <nav className="mt-4 px-4 space-y-2">
          <NavItem icon={<Home size={20} />} label="मुख्य डॅशबोर्ड" active={activeView === 'dashboard'} onClick={() => { setActiveView('dashboard'); setIsSidebarOpen(false); }} />
          <NavItem icon={<User size={20} />} label={APP_LABELS.profile} active={activeView === 'profile'} onClick={() => { setActiveView('profile'); setIsSidebarOpen(false); }} />
          <NavItem icon={<Settings size={20} />} label={APP_LABELS.settings} active={activeView === 'settings'} onClick={() => { setActiveView('settings'); setIsSidebarOpen(false); }} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8faf8] dark:bg-gray-950 transition-colors">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-30 h-20 flex items-center justify-between px-4 md:px-10 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-600 dark:text-gray-400">
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold marathi-font text-green-900 dark:text-green-400 truncate">
              {activeView === 'dashboard' 
                ? (profile?.name ? `नमस्कार, ${profile.name}! 🌾` : "तुमच्या शेतीसाठी एआय आधारित उपाय! 🌾") 
                : "स्मार्ट अ‍ॅग्रो"}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {activeView === 'dashboard' && (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-tile-editor'))}
                className="p-3 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-2xl transition hover:shadow-md active:scale-95"
                title="टाइल्स कस्टमाइज करा"
              >
                <LayoutGrid size={22} />
              </button>
            )}
            <button onClick={() => setActiveView('profile')} className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-green-100 dark:border-green-800 shadow-md transition-transform active:scale-90 hover:ring-4 hover:ring-green-500/20 ml-1">
              {profile?.profilePic ? (
                <img src={profile.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-700 dark:text-green-400">
                  <User size={28} />
                </div>
              )}
            </button>
          </div>
        </header>

        <div className="p-4 md:p-10 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>

        {/* Bottom Back Button Bar */}
        {activeView !== 'dashboard' && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 md:left-64 flex justify-center z-40">
            <button 
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-2 bg-green-700 text-white px-10 py-4 rounded-[2rem] font-bold marathi-font shadow-xl shadow-green-200 dark:shadow-none active:scale-95 transition-all text-lg"
            >
              <ArrowLeft size={22} /> मुख्य पृष्ठावर जा (Back)
            </button>
          </div>
        )}
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`flex items-center space-x-3 w-full p-4 rounded-2xl transition-all duration-200 ${active ? 'bg-white/15 shadow-inner scale-[1.02] text-white' : 'hover:bg-white/10 text-green-100'}`}
  >
    <div className={`${active ? 'text-white' : 'text-green-400'}`}>{icon}</div>
    <span className="marathi-font font-bold text-sm tracking-wide">{label}</span>
  </button>
);

export default Layout;
