import React from 'react';
import './theme.css'; // Import global theme styles
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { useAuth } from './contexts/AuthContext';
import { CosmicBackground } from './components/CosmicBackground';
import { ErrorToast } from './components/ErrorToast';
import { LoginPage } from './components/LoginPage';
import { UserProfile } from './components/UserProfile';
import { ThemeToggle } from './components/ui/ThemeToggle'; // Import ThemeToggle
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
                ? 'bg-gradient-to-r from-primary to-blue-600 dark:to-blue-500 text-primary-foreground shadow-lg shadow-accent/25' // Use theme colors, ensure good contrast for text-primary-foreground
                : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border/50' // Use theme colors
            }`}
          >
            <Icon size={18} className={currentView === id ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'} /> {/* Ensure icon color matches text */}
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
    <div className="min-h-screen w-full relative animated-subtle-gradient"> {/* Applied animated background */}
      {/* CosmicBackground can be kept for particles, or removed if gradient is enough */}
      <CosmicBackground />
      <div className="relative z-10">
        <ErrorToast />
        
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-primary to-purple-600 dark:to-purple-500 rounded-2xl shadow-lg shadow-accent/25"> {/* Use theme-accent (via primary) */}
                <Rocket className="w-8 h-8 text-primary-foreground" /> {/* Use themed text */}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent via-purple-400 to-pink-400 bg-clip-text text-transparent"> {/* Use theme-accent */}
                  PivotFlow
                </h1>
                <p className="text-muted-foreground text-sm"> {/* Use themed text */}
                  Your mission control for NFT monitoring and cross-chain fee optimization
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2"> {/* Wrapper for UserProfile and ThemeToggle */}
              <ThemeToggle />
              <UserProfile />
            </div>
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
        <footer className="p-6 text-center border-t border-border"> {/* Use theme variable for border */}
          <p className="text-muted-foreground text-sm"> {/* Use theme variable for text */}
            © 2025 PivotFlow • Powered by Internet Computer Protocol
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;