
import React from 'react';
import {
  ClockIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface HeaderProps {
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  resetCanvas: () => void;
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
}

const Header: React.FC<HeaderProps> = ({
  toggleLeftSidebar,
  toggleRightSidebar,
  resetCanvas,
  showLeftSidebar,
  showRightSidebar,
}) => {
  return (
    <header className={`fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 sm:px-6 z-[100] bg-transparent transition-all duration-500 ease-in-out ${showLeftSidebar ? 'lg:left-80' : ''} ${showRightSidebar ? 'lg:right-80' : ''}`}>
      <div className="flex items-center gap-4">
        <button onClick={toggleLeftSidebar} className={`p-2.5 border rounded-xl transition-all backdrop-blur-3xl shadow-lg ${showLeftSidebar ? 'bg-primary-600 border-primary-500 text-white' : 'bg-black/40 hover:bg-white/10 border-white/5 text-gray-400'}`}>
          <ClockIcon className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex flex-col">
          <h1 className="font-black tracking-widest text-[10px] uppercase text-white/80">Z-Focus</h1>
          <span className="text-[9px] text-white/20 font-mono">Powered by Pollinations</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={resetCanvas} className="p-2.5 bg-black/40 hover:bg-white/10 border border-white/5 rounded-xl text-gray-400 hover:text-white backdrop-blur-3xl transition-all" title="New Artwork">
          <PlusIcon className="w-5 h-5" />
        </button>
        <button onClick={toggleRightSidebar} className={`p-2.5 border rounded-xl transition-all backdrop-blur-3xl shadow-lg ${showRightSidebar ? 'bg-primary-600 border-primary-500 text-white' : 'bg-black/40 hover:bg-white/10 border-white/5 text-gray-400'}`}>
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
