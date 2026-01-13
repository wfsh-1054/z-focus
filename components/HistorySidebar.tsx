
import React from 'react';
import { GeneratedImage } from '../types';
import {
  RectangleStackIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface HistorySidebarProps {
  showLeftSidebar: boolean;
  toggleLeftSidebar: () => void;
  history: GeneratedImage[];
  currentImage: GeneratedImage | null;
  setCurrentImage: (image: GeneratedImage) => void;
  setPrompt: (prompt: string) => void;
  isSmallScreen: () => boolean;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  showLeftSidebar,
  toggleLeftSidebar,
  history,
  currentImage,
  setCurrentImage,
  setPrompt,
  isSmallScreen,
}) => {
  return (
    <aside className={`fixed inset-y-0 left-0 w-full sm:w-80 bg-[#080808] border-r border-white/5 transition-all duration-500 ease-in-out z-[90] flex flex-col pt-16 lg:static lg:pt-0 ${showLeftSidebar ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:w-0 lg:absolute'}`}>
      <div className="p-5 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <RectangleStackIcon className="w-4 h-4 text-primary-400" />
          <span className="font-bold text-[11px] tracking-widest uppercase text-white/40">Canvas Archive</span>
        </div>
        <button onClick={toggleLeftSidebar} className="text-gray-500 hover:text-white lg:hidden"><XMarkIcon className="w-5 h-5"/></button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {history.length === 0 ? (
          <div className="h-full flex items-center justify-center opacity-10 text-[9px] uppercase tracking-widest p-8 text-center">Empty Records</div>
        ) : (
          history.map((img) => (
            <div key={img.id} onClick={() => { setCurrentImage(img); setPrompt(img.prompt); if(isSmallScreen()) toggleLeftSidebar(); }} className={`group relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all duration-300 ${currentImage?.id === img.id ? 'border-primary-500 ring-4 ring-primary-500/10' : 'border-white/5 hover:border-white/20'}`}>
              <img src={img.url} className="w-full h-full object-cover" alt="History" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ArrowPathIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default HistorySidebar;
