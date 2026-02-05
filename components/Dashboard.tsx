
import React, { useState, useEffect } from 'react';
import { 
  Calculator, Camera, TrendingUp, Newspaper, 
  CloudSun, MessageSquare, Plus, FileText,
  Zap, Settings, LayoutGrid, FlaskConical
} from 'lucide-react';
import { APP_LABELS } from '../constants';
import { DashboardTile } from '../types';
import TileEditor from './TileEditor';

const DEFAULT_TILES: DashboardTile[] = [
  { id: 'sowing', label: 'पेरणी (Sowing)', icon: 'Zap', color: 'bg-orange-500', isVisible: true },
  { id: 'fertilizer', label: 'खत नियोजन', icon: 'FlaskConical', color: 'bg-cyan-600', isVisible: true },
  { id: 'smart_calc', label: APP_LABELS.calculator, icon: 'Calculator', color: 'bg-emerald-600', isVisible: true },
  { id: 'crop_ai', label: APP_LABELS.inspection, icon: 'Camera', color: 'bg-indigo-600', isVisible: true },
  { id: 'market', label: APP_LABELS.market, icon: 'TrendingUp', color: 'bg-amber-600', isVisible: true },
  { id: 'news', label: APP_LABELS.news, icon: 'Newspaper', color: 'bg-blue-600', isVisible: true },
  { id: 'weather', label: APP_LABELS.weather, icon: 'CloudSun', color: 'bg-sky-500', isVisible: true },
  { id: 'assistant', label: APP_LABELS.assistant, icon: 'MessageSquare', color: 'bg-violet-600', isVisible: true },
  { id: 'basic_calc', label: 'गणक', icon: 'Plus', color: 'bg-gray-600', isVisible: true },
  { id: 'notepad', label: APP_LABELS.notepad, icon: 'FileText', color: 'bg-rose-600', isVisible: true },
];

interface DashboardProps {
  onSelectFeature: (feature: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectFeature }) => {
  const [tiles, setTiles] = useState<DashboardTile[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dashboard_tiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTiles(parsed.filter((t: any) => t.id !== 'diseases'));
        } else {
          setTiles(DEFAULT_TILES);
        }
      } catch (e) {
        setTiles(DEFAULT_TILES);
      }
    } else {
      setTiles(DEFAULT_TILES);
    }

    const handleOpenEditor = () => setIsEditing(true);
    window.addEventListener('open-tile-editor', handleOpenEditor);
    return () => window.removeEventListener('open-tile-editor', handleOpenEditor);
  }, []);

  const saveTiles = (newTiles: DashboardTile[]) => {
    setTiles(newTiles);
    localStorage.setItem('dashboard_tiles', JSON.stringify(newTiles));
  };

  const renderIcon = (id: string) => {
    const props = { size: 36, className: "text-white group-hover:scale-110 transition duration-300" };
    switch (id) {
      case 'sowing': return <Zap {...props} />;
      case 'fertilizer': return <FlaskConical {...props} />;
      case 'smart_calc': return <Calculator {...props} />;
      case 'crop_ai': return <Camera {...props} />;
      case 'market': return <TrendingUp {...props} />;
      case 'news': return <Newspaper {...props} />;
      case 'weather': return <CloudSun {...props} />;
      case 'assistant': return <MessageSquare {...props} />;
      case 'basic_calc': return <Plus {...props} />;
      case 'notepad': return <FileText {...props} />;
      default: return <Plus {...props} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
        {tiles.filter(t => t.isVisible).map(tile => (
          <button 
            key={tile.id}
            onClick={() => onSelectFeature(tile.id)}
            className={`${tile.color} p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col items-center justify-center text-center space-y-4 aspect-square active:scale-95 group relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-5 bg-white/20 rounded-3xl shadow-inner">
              {renderIcon(tile.id)}
            </div>
            <span className="marathi-font font-bold text-white text-lg leading-tight drop-shadow-sm">{tile.label}</span>
          </button>
        ))}
        <button 
          onClick={() => setIsEditing(true)}
          className="p-8 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center space-y-4 aspect-square hover:bg-gray-50 dark:hover:bg-gray-900 transition active:scale-95 group"
        >
          <div className="p-5 bg-gray-100 dark:bg-gray-800 rounded-3xl text-gray-400 group-hover:text-green-600 transition">
            <LayoutGrid size={36} />
          </div>
          <span className="marathi-font font-bold text-gray-400 group-hover:text-green-600 transition">टाइल्स बदला</span>
        </button>
      </div>

      {isEditing && (
        <TileEditor 
          currentTiles={tiles}
          onClose={() => setIsEditing(false)}
          onSave={saveTiles}
        />
      )}
    </div>
  );
};

export default Dashboard;
