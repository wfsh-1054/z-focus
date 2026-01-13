
import React from 'react';
import { GeneratedImage } from '../types';
import { LoadingOverlay } from './LoadingOverlay';
import {
  ArrowDownTrayIcon,
  XMarkIcon,
  SparklesIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface WorkspaceProps {
  currentImage: GeneratedImage | null;
  setCurrentImage: (image: GeneratedImage | null) => void;
  isGenerating: boolean;
  error: string | null;
  handleDownload: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({
  currentImage,
  setCurrentImage,
  isGenerating,
  error,
  handleDownload,
}) => {
  return (
    <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-[#050505] bg-checkerboard">
      <section className="flex-1 flex items-center justify-center relative p-4 sm:p-10">
        {currentImage ? (
          <div className="relative max-h-full max-w-full animate-fade-in group flex items-center justify-center">
            <img src={currentImage.url} alt="Current Visual" className="max-h-[75vh] max-w-full rounded-2xl shadow-2xl border border-white/10 ring-1 ring-white/5" />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <button onClick={handleDownload} className="p-2.5 bg-black/60 hover:bg-primary-600 rounded-xl text-white backdrop-blur-xl border border-white/10 shadow-2xl transition-all" title="Download PNG"><ArrowDownTrayIcon className="w-5 h-5" /></button>
              <button onClick={() => setCurrentImage(null)} className="p-2.5 bg-black/60 hover:bg-red-900/80 rounded-xl text-white backdrop-blur-xl border border-white/10 shadow-2xl transition-all"><XMarkIcon className="w-5 h-5" /></button>
            </div>
            <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 text-[10px] font-mono text-white/60 tracking-tight max-w-[80%] truncate">
                {currentImage.prompt}
              </div>
            </div>
          </div>
        ) : !isGenerating && (
          <div className="text-center opacity-10 flex flex-col items-center select-none">
            <SparklesIcon className="w-16 h-16 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Studio Idle</p>
          </div>
        )}
        
        {error && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-950/60 border border-red-500/50 backdrop-blur-2xl px-6 py-4 rounded-2xl flex items-center gap-4 animate-slide-up z-[60] shadow-2xl shadow-red-900/20">
            <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
            <p className="text-xs font-bold text-red-100 tracking-wide">{error}</p>
          </div>
        )}

        <LoadingOverlay isLoading={isGenerating} message="Synthesizing image..." />
      </section>
    </main>
  );
};

export default Workspace;
