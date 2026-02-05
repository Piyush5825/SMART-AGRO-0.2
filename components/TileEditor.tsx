
import React, { useState } from 'react';
import { X, Eye, EyeOff, Save, ChevronUp, ChevronDown } from 'lucide-react';
import { DashboardTile } from '../types';

interface TileEditorProps {
  onClose: () => void;
  onSave: (tiles: DashboardTile[]) => void;
  currentTiles: DashboardTile[];
}

const TileEditor: React.FC<TileEditorProps> = ({ onClose, onSave, currentTiles }) => {
  const [tiles, setTiles] = useState<DashboardTile[]>(currentTiles);

  const toggleVisibility = (id: string) => {
    setTiles(prev => prev.map(tile => 
      tile.id === id ? { ...tile, isVisible: !tile.isVisible } : tile
    ));
  };

  const moveTile = (index: number, direction: 'up' | 'down') => {
    const newTiles = [...tiles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newTiles.length) {
      [newTiles[index], newTiles[targetIndex]] = [newTiles[targetIndex], newTiles[index]];
      setTiles(newTiles);
    }
  };

  const handleSave = () => {
    onSave(tiles);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-green-700 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold marathi-font">डॅशबोर्ड कस्टमाइझ करा</h3>
            <p className="text-sm opacity-80 marathi-font">टाइल्सचा क्रम आणि दृश्यमानता बदला</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
          {tiles.map((tile, index) => (
            <div 
              key={tile.id} 
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                tile.isVisible ? 'bg-green-50 border-green-200 dark:bg-green-900/10' : 'bg-gray-50 border-gray-200 opacity-60 dark:bg-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button 
                    disabled={index === 0}
                    onClick={() => moveTile(index, 'up')}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-20"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button 
                    disabled={index === tiles.length - 1}
                    onClick={() => moveTile(index, 'down')}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-20"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
                <div className={`p-2.5 rounded-xl ${tile.color} shadow-sm`}>
                  <div className="w-5 h-5 border-2 border-white/50 rounded-md" />
                </div>
                <span className="marathi-font font-bold text-gray-800 dark:text-gray-200">{tile.label}</span>
              </div>
              <button 
                onClick={() => toggleVisibility(tile.id)}
                className={`p-2.5 rounded-xl transition ${
                  tile.isVisible ? 'text-green-600 bg-white shadow-sm dark:bg-gray-800' : 'text-gray-400'
                }`}
              >
                {tile.isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-900 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 p-4 rounded-2xl font-bold marathi-font text-gray-500 hover:bg-gray-200 transition"
          >
            रद्द करा
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 bg-green-700 text-white p-4 rounded-2xl font-bold marathi-font shadow-lg hover:bg-green-800 transition flex items-center justify-center gap-2"
          >
            <Save size={20} /> बदल जतन करा
          </button>
        </div>
      </div>
    </div>
  );
};

export default TileEditor;
