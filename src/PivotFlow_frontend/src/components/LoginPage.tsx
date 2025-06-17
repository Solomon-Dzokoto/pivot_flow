import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { CosmicBackground } from './CosmicBackground';
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
      <>
        <CosmicBackground />
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-slate-400 mt-4">Initializing authentication...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CosmicBackground />
      <div className="min-h-screen relative z-10 flex flex-col">
        {/* Header */}
        <header className="p-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl shadow-lg shadow-cyan-500/25">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ZeroFee NFT Alerts
            </h1>
          </div>
          <p className="text-slate-400 text-sm md:text-base">
            Your mission control for NFT monitoring and cross-chain fee optimization
          </p>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Login Card */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl text-center mb-12">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl mb-6">
                  <Lock className="w-10 h-10 text-cyan-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Welcome to the Future of NFT Monitoring
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                  Secure, decentralized, and powered by the Internet Computer Protocol. 
                  Login with Internet Identity to access your personalized NFT alert dashboard.
                </p>
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoggingIn ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-6 h-6" />
                    <span>Login with Internet Identity</span>
                  </>
                )}
              </button>

              <div className="mt-6 text-sm text-slate-500">
                <p>Secure • Decentralized • Privacy-First</p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:border-slate-600/50 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl">
                      <feature.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 text-sm">
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
        <footer className="p-6 text-center border-t border-slate-700/50">
          <p className="text-slate-500 text-sm">
            © 2025 ZeroFee NFT Alerts • Powered by Internet Computer Protocol
          </p>
        </footer>
      </div>
    </>
  );
};