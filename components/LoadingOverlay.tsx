import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message }) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-xl transition-all duration-300">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-t-4 border-l-4 border-primary-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-r-4 border-b-4 border-purple-500 rounded-full animate-spin reverse"></div>
      </div>
      <p className="text-white font-medium tracking-wide animate-pulse">{message}</p>
    </div>
  );
};