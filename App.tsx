
import React, { useState, useRef, useEffect } from 'react';
import { generateImage, enhancePromptWithAI } from './services/pollinationsService';
import { LoadingOverlay } from './components/LoadingOverlay';
import { downloadImageAs } from './utils/imageProcessor'; 
import { AspectRatio, GeneratedImage, ImageStyle, PollinationsModel } from './types';
import { 
  ArrowDownTrayIcon,
  SparklesIcon,
  XMarkIcon,
  ChevronDownIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  KeyIcon,
  RectangleStackIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]); 
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(ImageStyle.NONE);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('zfocus_pollinations_key') || '');
  
  const [showRightSidebar, setShowRightSidebar] = useState<boolean>(window.innerWidth >= 1280); 
  const [showLeftSidebar, setShowLeftSidebar] = useState<boolean>(false);   
  const [isConsoleVisible, setIsConsoleVisible] = useState<boolean>(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSmallScreen = () => window.innerWidth < 1024;

  const toggleLeftSidebar = () => {
    if (showLeftSidebar) {
      setShowLeftSidebar(false);
      if (isSmallScreen()) setIsConsoleVisible(true);
    } else {
      setShowLeftSidebar(true);
      setShowRightSidebar(false);
      setIsConsoleVisible(false);
    }
  };

  const toggleRightSidebar = () => {
    if (showRightSidebar) {
      setShowRightSidebar(false);
      if (isSmallScreen()) setIsConsoleVisible(true);
    } else {
      setShowRightSidebar(true);
      setShowLeftSidebar(false);
      setIsConsoleVisible(false);
    }
  };

  const closeAllSidebars = () => {
    setShowLeftSidebar(false);
    setShowRightSidebar(false);
    setIsConsoleVisible(true);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const maxHeight = isSmallScreen() ? 80 : 120;
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [prompt]);

  useEffect(() => {
    localStorage.setItem('zfocus_pollinations_key', apiKey);
  }, [apiKey]);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() && !currentImage) return;
    setIsEnhancing(true);
    setError(null);
    try {
      const mode = currentImage ? 'modify' : 'expand';
      const enhanced = await enhancePromptWithAI(
        prompt || "A masterpiece", 
        mode, 
        currentImage?.prompt, 
        apiKey
      );
      setPrompt(enhanced);
    } catch (err: any) {
      setError("AI 優化暫時不可用，請直接嘗試生成。");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    if (isSmallScreen()) closeAllSidebars();

    try {
      // If we are modifying, we might want to perform an AI enhancement automatically 
      // but let's keep it manual for user control as per the "Modify" button logic.
      const resultBase64 = await generateImage({
        prompt, 
        aspectRatio, 
        style: selectedStyle, 
        model: PollinationsModel.ZIMAGE, 
        apiKey: apiKey
      });

      const newImage: GeneratedImage = {
        id: crypto.randomUUID(), 
        url: resultBase64, 
        prompt, 
        timestamp: Date.now(),
        style: selectedStyle, 
        aspectRatio, 
        model: PollinationsModel.ZIMAGE
      };

      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev]);
    } catch (err: any) {
      setError("生成失敗：伺服器繁忙或參數錯誤，請檢查連線。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!currentImage) return;
    await downloadImageAs(currentImage.url, `zfocus-pro-${Date.now()}`, 'png');
  };

  const resetCanvas = () => {
    setCurrentImage(null);
    setPrompt('');
    closeAllSidebars();
  };

  return (
    <div className="h-screen w-screen bg-[#050505] text-gray-200 flex overflow-hidden relative font-inter">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 sm:px-6 z-[100] bg-transparent">
        <div className="flex items-center gap-4">
           <button onClick={toggleLeftSidebar} className={`p-2.5 border rounded-xl transition-all backdrop-blur-3xl shadow-lg ${showLeftSidebar ? 'bg-primary-600 border-primary-500 text-white' : 'bg-black/40 hover:bg-white/10 border-white/5 text-gray-400'}`}>
              <ClockIcon className="w-5 h-5" />
           </button>
           <div className="hidden sm:flex flex-col">
              <h1 className="font-black tracking-widest text-[10px] uppercase text-white/80">Z-Focus Pro</h1>
              <span className="text-[9px] text-white/20 font-mono">Nanobanana Engine v2.6</span>
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

      {/* LEFT SIDEBAR (History) */}
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

      {/* WORKSPACE */}
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

          <LoadingOverlay isLoading={isGenerating} message="Synthesizing Nanobanana Logic..." />
        </section>

        {/* PROMPT PANEL */}
        <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 flex justify-center z-[80] px-4 pointer-events-none">
          <div className={`w-full max-w-4xl pointer-events-auto transition-all duration-500 ease-in-out ${isConsoleVisible ? 'translate-y-0 opacity-100' : 'translate-y-[300px] opacity-0'}`}>
            <div className="bg-[#0c0c0c]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3 shadow-2xl ring-1 ring-white/5 hover:border-white/20 transition-all">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0 pl-5 pt-3">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={currentImage ? "輸入修改指令 (例如: 將背景改為森林、加入墨鏡...)" : "輸入繪圖提示詞或靈感..."}
                    className="w-full bg-transparent text-gray-100 text-[15px] leading-relaxed outline-none resize-none min-h-[48px] custom-scrollbar placeholder:text-white/20 font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                    rows={1}
                  />
                </div>
                <div className="flex items-center gap-2 pr-1 pt-1.5">
                   <button 
                    onClick={handleEnhancePrompt} 
                    disabled={isEnhancing} 
                    title={currentImage ? "AI 自然語言修改" : "AI 靈感優化"}
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
      </main>

      {/* RIGHT SIDEBAR (Config) */}
      <aside className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-[#080808] border-l border-white/5 transition-all duration-500 ease-in-out z-[90] flex flex-col pt-16 lg:static lg:pt-0 ${showRightSidebar ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 lg:w-0 lg:absolute'}`}>
        <div className="p-8 flex flex-col h-full overflow-y-auto custom-scrollbar space-y-12">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Advanced Ops</h3>
            <button onClick={toggleRightSidebar} className="text-gray-600 hover:text-white p-1 lg:hidden"><XMarkIcon className="w-5 h-5"/></button>
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <KeyIcon className="w-3.5 h-3.5" /> Pollitations API key
            </label>
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
                 Nanobanana Pro distributed inference active.
               </p>
             </div>
          </div>
        </div>
      </aside>
      
      {/* MOBILE MASK */}
      {(showLeftSidebar || showRightSidebar) && isSmallScreen() && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[85] lg:hidden" onClick={closeAllSidebars} />
      )}
    </div>
  );
};

export default App;
