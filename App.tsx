
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import SmartAgroCalc from './components/SmartAgroCalc';
import CropInspection from './components/CropInspection';
import MarketPrice from './components/MarketPrice';
import AgroAssistant from './components/AgroAssistant';
import GeneralCalculator from './components/GeneralCalculator';
import Weather from './components/Weather';
import News from './components/News';
import Notepad from './components/Notepad';
import Settings from './components/Settings';
import SowingAdvice from './components/SowingAdvice';
import FertilizerManager from './components/FertilizerManager';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <Dashboard onSelectFeature={(f) => setActiveView(f)} />;
      case 'profile': return <Profile />;
      case 'smart_calc': return <SmartAgroCalc />;
      case 'crop_ai': return <CropInspection />;
      case 'market': return <MarketPrice />;
      case 'assistant': return <AgroAssistant />;
      case 'news': return <News />;
      case 'weather': return <Weather />;
      case 'basic_calc': return <GeneralCalculator />;
      case 'notepad': return <Notepad />;
      case 'settings': return <Settings />;
      case 'sowing': return <SowingAdvice />;
      case 'fertilizer': return <FertilizerManager />;
      default: return <Dashboard onSelectFeature={(f) => setActiveView(f)} />;
    }
  };

  return (
    <div className="transition-colors duration-300">
      <Layout activeView={activeView} setActiveView={setActiveView}>
        {renderContent()}
      </Layout>
    </div>
  );
};

export default App;
