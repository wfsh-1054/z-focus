
import React, { useState, useRef, useEffect } from 'react';
import { generateImage, enhancePromptWithAI } from './services/pollinationsService';
import { downloadImageAs } from './utils/imageProcessor';
import { AspectRatio, GeneratedImage, ImageStyle, PollinationsModel } from './types';
import Header from './components/Header';
import HistorySidebar from './components/HistorySidebar';
import ConfigSidebar from './components/ConfigSidebar';
import Workspace from './components/Workspace';
import PromptPanel from './components/PromptPanel';

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
    if (apiKey) {
      localStorage.setItem('zfocus_pollinations_key', apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#api_key=')) {
      const key = hash.substring('#api_key='.length);
      setApiKey(key);
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }, []);

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
      setError("AI enhancement is temporarily unavailable. Please try generating directly.");
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
      setError("Generation failed: Server is busy or parameters are incorrect. Please check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!currentImage) return;
    await downloadImageAs(currentImage.url, `zfocus-${Date.now()}`, 'png');
  };

  const resetCanvas = () => {
    setCurrentImage(null);
    setPrompt('');
    closeAllSidebars();
  };

  const handleGetApiKey = () => {
    const redirectUrl = window.location.href.split('#')[0];
    window.open(`https://enter.pollinations.ai/authorize?redirect_url=${encodeURIComponent(redirectUrl)}`, '_self');
  };

  const handleLogout = () => {
    localStorage.removeItem('zfocus_pollinations_key');
    setApiKey('');
  };

  return (
    <div className="h-screen w-screen bg-[#050505] text-gray-200 flex overflow-hidden relative font-inter">
      <Header
        toggleLeftSidebar={toggleLeftSidebar}
        toggleRightSidebar={toggleRightSidebar}
        resetCanvas={resetCanvas}
        showLeftSidebar={showLeftSidebar}
        showRightSidebar={showRightSidebar}
      />
      <HistorySidebar
        showLeftSidebar={showLeftSidebar}
        toggleLeftSidebar={toggleLeftSidebar}
        history={history}
        currentImage={currentImage}
        setCurrentImage={setCurrentImage}
        setPrompt={setPrompt}
        isSmallScreen={isSmallScreen}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <Workspace
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
          isGenerating={isGenerating}
          error={error}
          handleDownload={handleDownload}
        />
        <PromptPanel
          prompt={prompt}
          setPrompt={setPrompt}
          currentImage={!!currentImage}
          isGenerating={isGenerating}
          isEnhancing={isEnhancing}
          handleEnhancePrompt={handleEnhancePrompt}
          handleGenerate={handleGenerate}
          isConsoleVisible={isConsoleVisible}
          setIsConsoleVisible={setIsConsoleVisible}
          textareaRef={textareaRef}
          showLeftSidebar={showLeftSidebar}
          showRightSidebar={showRightSidebar}
        />
      </div>
      <ConfigSidebar
        showRightSidebar={showRightSidebar}
        toggleRightSidebar={toggleRightSidebar}
        apiKey={apiKey}
        setApiKey={setApiKey}
        handleLogout={handleLogout}
        handleGetApiKey={handleGetApiKey}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
      />
      {(showLeftSidebar || showRightSidebar) && isSmallScreen() && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[85] lg:hidden" onClick={closeAllSidebars} />
      )}
    </div>
  );
};

export default App;
