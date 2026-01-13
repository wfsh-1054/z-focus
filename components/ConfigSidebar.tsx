
import React from 'react';
import { AspectRatio, ImageStyle } from '../types';
import {
  XMarkIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

interface ConfigSidebarProps {
  showRightSidebar: boolean;
  toggleRightSidebar: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  handleLogout: () => void;
  handleGetApiKey: () => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  selectedStyle: ImageStyle;
  setSelectedStyle: (style: ImageStyle) => void;
}

const ConfigSidebar: React.FC<ConfigSidebarProps> = ({
  showRightSidebar,
  toggleRightSidebar,
  apiKey,
  setApiKey,
  handleLogout,
  handleGetApiKey,
  aspectRatio,
  setAspectRatio,
  selectedStyle,
  setSelectedStyle,
}) => {
  return (
    <aside className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-[#080808] border-l border-white/5 transition-all duration-500 ease-in-out z-[90] flex flex-col pt-16 lg:static lg:pt-0 ${showRightSidebar ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 lg:w-0 lg:absolute'}`}>
      <div className="p-8 flex flex-col h-full overflow-y-auto custom-scrollbar space-y-12">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Advanced Ops</h3>
          <button onClick={toggleRightSidebar} className="text-gray-600 hover:text-white p-1 lg:hidden"><XMarkIcon className="w-5 h-5"/></button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <KeyIcon className="w-3.5 h-3.5" /> Pollinations API key
            </label>
            <button 
              onClick={apiKey ? handleLogout : handleGetApiKey}
              className="text-[10px] font-bold text-primary-500 hover:text-primary-400 transition-colors"
            >
              {apiKey ? 'Logout' : 'Get Key'}
            </button>
          </div>
          <input 
            type="password" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
            placeholder="Authorization Key..." 
            className="w-full bg-black/60 border border-white/10 text-gray-100 text-xs font-mono rounded-xl px-4 py-4 outline-none focus:border-primary-500 transition-all shadow-inner" 
          />
        </div>

        <div className="space-y-6">
          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Resolution Ratio</label>
          <div className="grid grid-cols-2 gap-2.5">
            {Object.entries(AspectRatio).map(([key, value]) => (
              <button key={key} onClick={() => setAspectRatio(value)} className={`px-4 py-4 text-[9px] font-black uppercase tracking-widest rounded-xl border transition-all ${aspectRatio === value ? 'bg-primary-600 text-white border-primary-500 shadow-xl' : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'}`}>
                {key.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Aesthetic Preset</label>
          <select 
            value={selectedStyle} 
            onChange={(e) => setSelectedStyle(e.target.value as ImageStyle)} 
            className="w-full bg-black/60 border border-white/10 text-gray-300 text-xs font-bold rounded-xl px-4 py-4 outline-none cursor-pointer hover:border-white/20 transition-all shadow-inner"
          >
            {Object.values(ImageStyle).map((style) => <option key={style} value={style} className="bg-[#0a0a0a]">{style}</option>)}
          </select>
        </div>
        
        <div className="pt-8 border-t border-white/5 mt-auto">
           <div className="flex flex-col gap-2">
             <span className="text-[9px] text-white/20 font-mono">Infrastructure</span>
             <p className="text-[9px] text-white/40 uppercase tracking-widest leading-relaxed font-bold">
               Powered by Pollinations
             </p>
           </div>
        </div>
      </div>
    </aside>
  );
};

export default ConfigSidebar;
