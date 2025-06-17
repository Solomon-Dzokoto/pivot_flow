import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Astronaut silhouette with spinning animation */}
        <div className="absolute inset-0 animate-spin">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-cyan-400">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6C15 7 14.4 7.8 13.5 8.3L14.3 10.8C14.5 11.5 14.1 12.3 13.4 12.5L12 13L10.6 12.5C9.9 12.3 9.5 11.5 9.7 10.8L10.5 8.3C9.6 7.8 9 7 9 6L3 7V9H5V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V9H21Z"/>
          </svg>
        </div>
        {/* Orbital ring */}
        <div className="absolute inset-0 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin" 
             style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
      </div>
    </div>
  );
};

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = '', 
  lines = 3 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-700 rounded-xl mb-2 last:mb-0" 
             style={{ width: `${80 + Math.random() * 20}%` }}></div>
      ))}
    </div>
  );
};