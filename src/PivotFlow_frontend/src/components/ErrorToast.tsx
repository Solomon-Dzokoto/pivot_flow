import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { X } from 'lucide-react';

export const ErrorToast: React.FC = () => {
  const { errorMessage, setError } = useAppContext();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (errorMessage) {
      timeoutId = setTimeout(() => setError(null), 5000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [errorMessage, setError]);

  if (!errorMessage) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-red-900/90 border border-red-500/50 rounded-xl p-4 shadow-2xl backdrop-blur-sm max-w-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <p className="text-red-100 text-sm font-medium">{errorMessage}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 transition-colors ml-2"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};