import React from 'react';

export const CosmicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      
      {/* Animated stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Floating crypto symbols */}
      <div className="absolute inset-0">
        {/* Bitcoin symbol */}
        <div className="absolute text-4xl text-yellow-400/20 animate-float-slow"
             style={{ left: '10%', top: '20%', animationDelay: '0s' }}>
          ₿
        </div>
        
        {/* Ethereum symbol */}
        <div className="absolute text-3xl text-blue-400/20 animate-float-medium"
             style={{ left: '80%', top: '30%', animationDelay: '1s' }}>
          ⟠
        </div>
        
        {/* Generic crypto symbol */}
        <div className="absolute text-2xl text-green-400/20 animate-float-fast"
             style={{ left: '70%', top: '70%', animationDelay: '2s' }}>
          ◊
        </div>
        
        {/* ICP-style symbol */}
        <div className="absolute text-3xl text-purple-400/20 animate-float-slow"
             style={{ left: '20%', top: '80%', animationDelay: '1.5s' }}>
          ∞
        </div>
        
        {/* NFT symbol */}
        <div className="absolute text-2xl text-pink-400/20 animate-float-medium"
             style={{ left: '50%', top: '15%', animationDelay: '0.5s' }}>
          🖼
        </div>
      </div>
      
      {/* Nebula effects */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-float-slow"
             style={{ left: '60%', top: '40%' }}></div>
        <div className="absolute w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-float-medium"
             style={{ left: '20%', top: '60%' }}></div>
        <div className="absolute w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-float-fast"
             style={{ left: '80%', top: '20%' }}></div>
      </div>
    </div>
  );
};