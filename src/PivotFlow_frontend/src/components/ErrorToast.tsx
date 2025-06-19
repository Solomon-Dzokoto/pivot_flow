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
      {/* Uses destructive theme colors for better adaptability */}
      <div className="bg-destructive/90 dark:bg-destructive/50 border border-destructive/70 dark:border-destructive/30 rounded-xl p-4 shadow-2xl backdrop-blur-sm max-w-sm text-destructive-foreground dark:text-destructive-foreground">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {/* Pulse dot can use a slightly lighter shade of destructive or a generic error color */}
            <div className="w-2 h-2 bg-destructive-foreground/70 dark:bg-destructive-foreground/50 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-destructive-foreground/80 hover:text-destructive-foreground transition-colors ml-2"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};