
import React, { RefObject } from 'react';
import {
  ChevronDownIcon,
  PlusIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface PromptPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  currentImage: boolean;
  isGenerating: boolean;
  isEnhancing: boolean;
  handleEnhancePrompt: () => void;
  handleGenerate: () => void;
  isConsoleVisible: boolean;
  setIsConsoleVisible: (visible: boolean) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
}

const PromptPanel: React.FC<PromptPanelProps> = ({
  prompt,
  setPrompt,
  currentImage,
  isGenerating,
  isEnhancing,
  handleEnhancePrompt,
  handleGenerate,
  isConsoleVisible,
  setIsConsoleVisible,
  textareaRef,
  showLeftSidebar,
  showRightSidebar,
}) => {
  return (
    <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 flex justify-center z-[80] px-4 pointer-events-none">
      <div className={`w-full max-w-4xl pointer-events-auto transition-all duration-500 ease-in-out ${isConsoleVisible ? 'translate-y-0 opacity-100' : 'translate-y-[300px] opacity-0'}`}>
        <div className="bg-[#0c0c0c]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3 shadow-2xl ring-1 ring-white/5 hover:border-white/20 transition-all">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0 pl-5 pt-3">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={currentImage ? "Enter modification instructions (e.g., change background to a forest, add sunglasses...)" : "Enter drawing prompts or inspiration..."}
                className="w-full bg-transparent text-gray-100 text-[15px] leading-relaxed outline-none resize-none min-h-[48px] custom-scrollbar placeholder:text-white/20 font-medium"
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                rows={1}
              />
            </div>
            <div className="flex items-center gap-2 pr-1 pt-1.5">
              <button 
                onClick={handleEnhancePrompt} 
                disabled={isEnhancing} 
                title={currentImage ? "AI Natural Language Modification" : "AI Inspiration Optimization"}
                className={`p-3.5 rounded-2xl transition-all border border-white/5 ${isEnhancing ? 'bg-primary-600/30 animate-pulse text-primary-400' : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08]'}`}
              >
                {isEnhancing ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : currentImage ? <WrenchScrewdriverIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
              </button>
              <button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt.trim()} 
                className={`h-14 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl shadow-primary-900/20 active:scale-95 flex items-center gap-3 ${currentImage ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-primary-600 text-white hover:bg-primary-500'}`}
              >
                {currentImage ? 'Edit Image' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
        
        <button onClick={() => setIsConsoleVisible(false)} className="absolute -top-10 left-1/2 -translate-x-1/2 p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/20 hover:text-white border border-white/5 transition-all backdrop-blur-md">
          <ChevronDownIcon className="w-4 h-4" />
        </button>
      </div>
      
      {!isConsoleVisible && !showLeftSidebar && !showRightSidebar && (
        <button onClick={() => setIsConsoleVisible(true)} className="absolute -bottom-2 p-5 bg-primary-600 rounded-full text-white shadow-2xl pointer-events-auto hover:scale-110 active:scale-95 transition-all animate-bounce">
          <PlusIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default PromptPanel;
