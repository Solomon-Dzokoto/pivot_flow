import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
// import { CosmicBackground } from './CosmicBackground';
import { Rocket, Shield, Zap, Users, Globe, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const success = await login();
      if (!success) {
        // Error handling is done in the auth service
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Login with Internet Identity for maximum security and privacy',
    },
    {
      icon: Zap,
      title: 'Real-time Alerts',
      description: 'Get instant notifications when NFT floor prices hit your targets',
    },
    {
      icon: Globe,
      title: 'Cross-chain Support',
      description: 'Monitor gas fees across Ethereum, Polygon, BNB Chain, and Solana',
    },
    {
      icon: Users,
      title: 'Portfolio Tracking',
      description: 'Track your NFT portfolio across multiple wallets and blockchains',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-slate-400 mt-4">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10 flex flex-col">
      {/* Header */}
      <header className="p-6 text-center">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="p-3 bg-gradient-to-r from-theme-accent/70 to-purple-500/70 rounded-2xl shadow-lg shadow-theme-accent/25"> {/* Adjusted gradient to use theme-accent */}
            <Rocket className="w-8 h-8 text-foreground" /> {/* Use text-foreground */}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-theme-accent via-purple-400 to-pink-400 bg-clip-text text-transparent"> {/* Kept custom gradient text */}
            PivotFlow
          </h1>
        </div>
        <p className="text-muted-foreground text-sm md:text-base"> {/* Use text-muted-foreground */}
          Your mission control for NFT monitoring and cross-chain fee optimization
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Login Card */}
          <div className="bg-card/70 backdrop-blur-md border-border rounded-3xl p-8 md:p-12 shadow-2xl text-center mb-12"> {/* Use bg-card, border-border and added more blur */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-theme-accent/10 to-purple-500/10 rounded-2xl mb-6"> {/* Adjusted gradient */}
                <Lock className="w-10 h-10 text-accent" /> {/* Use text-accent */}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4"> {/* Use text-foreground */}
                Welcome to the Future of NFT Monitoring
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto"> {/* Use text-muted-foreground */}
                Secure, decentralized, and powered by the Internet Computer Protocol. 
                Login with Internet Identity to access your personalized NFT alert dashboard.
              </p>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-theme-accent to-blue-500 hover:from-theme-accent/90 hover:to-blue-500/90 disabled:from-slate-600 disabled:to-slate-700 text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-theme-accent/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" // Adjusted button gradient and text
            >
              {isLoggingIn ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Shield className="w-6 h-6" /> {/* Icon color will be inherited from text-primary-foreground */}
                  <span>Login with Internet Identity</span>
                </>
              )}
            </button>

            <div className="mt-6 text-sm text-muted-foreground"> {/* Use text-muted-foreground */}
              <p>Secure • Decentralized • Privacy-First</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-6 shadow-xl hover:border-accent/50 transition-all duration-300" /* Use bg-card, border-border, hover:border-accent */
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-r from-theme-accent/10 to-purple-500/10 rounded-xl"> {/* Adjusted gradient */}
                    <feature.icon className="w-6 h-6 text-accent" /> {/* Use text-accent */}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2"> {/* Use text-foreground */}
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm"> {/* Use text-muted-foreground */}
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-border"> {/* Use border-border */}
        <p className="text-muted-foreground text-sm"> {/* Use text-muted-foreground */}
          © 2025 PivotFlow • Powered by Internet Computer Protocol
        </p>
      </footer>
    </div>
  );
};