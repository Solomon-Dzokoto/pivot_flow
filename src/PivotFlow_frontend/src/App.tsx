import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { useAuth } from './contexts/AuthContext';
import { CosmicBackground } from './components/CosmicBackground';
import { ErrorToast } from './components/ErrorToast';
import { LoginPage } from './components/LoginPage';
import { UserProfile } from './components/UserProfile';
import { DashboardPage } from './components/pages/DashboardPage';
import { NftAlertsPage } from './components/pages/NftAlertsPage';
import { BlockchainFeesPage } from './components/pages/BlockchainFeesPage';
import { PortfolioPage } from './components/pages/PortfolioPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { Toaster } from 'sonner';
import { BarChart3, Bell, Zap, Eye, Settings, Rocket } from 'lucide-react';

const Navigation: React.FC = () => {
  const { currentView, setCurrentView } = useAppContext();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'nft-alerts', label: 'NFT Alerts', icon: Bell },
    { id: 'blockchain-fees', label: 'Blockchain Fees', icon: Zap },
    { id: 'portfolio', label: 'Portfolio', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="mb-8">
      <div className="flex flex-wrap justify-center gap-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCurrentView(id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              currentView === id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/70 border border-slate-700/50'
            }`}
          >
            <Icon size={18} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <NotificationProvider>
          <AppContent />
          <Toaster />
        </NotificationProvider>
      </AppProvider>
    </AuthProvider>
  );
}

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { currentView } = useAppContext();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <CosmicBackground />
        <div className="relative z-10 text-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full relative">
        <CosmicBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <LoginPage />
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'nft-alerts':
        return <NftAlertsPage />;
      case 'blockchain-fees':
        return <BlockchainFeesPage />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-slate-900/50">
      <CosmicBackground />
      <div className="relative z-10">
        <ErrorToast />
        
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl shadow-lg shadow-cyan-500/25">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  PivotFlow
                </h1>
                <p className="text-slate-400 text-sm">
                  Your mission control for NFT monitoring and cross-chain fee optimization
                </p>
              </div>
            </div>
            <UserProfile />
          </div>
        </header>

        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center border-t border-slate-700/50">
          <p className="text-slate-500 text-sm">
            © 2025 PivotFlow • Powered by Internet Computer Protocol
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;