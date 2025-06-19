import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Activity, ArrowRightLeft } from 'lucide-react'; // Common icons for this page
import { CustomizableDashboard } from '../dashboard/CustomizableDashboard';
// Import newly created widget components
import { CanisterStatusWidget } from '../dashboard/widgets/CanisterStatusWidget';
import { ICPPriceWidget } from '../dashboard/widgets/ICPPriceWidget';
import { CanisterCyclesWidget } from '../dashboard/widgets/CanisterCyclesWidget';
import { AlertsSummaryWidget } from '../dashboard/widgets/AlertsSummaryWidget';
import { TransactionHistoryWidget } from '../dashboard/widgets/TransactionHistoryWidget';
// Existing widget imports for CustomizableDashboard
import {
  NFTPriceWidget,
  GasFeeWidget,
  PortfolioWidget,
  TrendingCollectionsWidget,
  CommunityFeedWidget
} from '../dashboard/widgets';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { ICPMetrics } from '../ICPMetrics';
import { RecentActivity } from '../RecentActivity';

// Removed inline component definitions as they are now in separate files.

/**
 * @page DashboardPage
 * @description The main dashboard page for PivotFlow. Displays key metrics, customizable widgets,
 * alerts summary, recent activity, and transaction history.
 * @returns {React.ReactElement} The rendered dashboard page.
 */
export const DashboardPage: React.FC = () => {
  const { 
    nftAlerts, 
    gasAlerts, 
    // canisterCycles, // Cycles are now fetched by CanisterCyclesWidget directly
    // isOperator
  } = useAppContext();

  const activeNftAlerts = nftAlerts.filter(alert => alert.isActive);
  const activeGasAlerts = gasAlerts.filter(alert => alert.isActive);

  // Widgets for CustomizableDashboard (can be expanded)
  const widgets = [
    { id: 'portfolio', title: 'Portfolio Overview', component: <PortfolioWidget />, defaultSize: { w: 6, h: 4 } },
    { id: 'nft-price', title: 'NFT Price History', component: <NFTPriceWidget />, defaultSize: { w: 6, h: 4 } },
    { id: 'gas-fees', title: 'Gas Fee Trends', component: <GasFeeWidget />, defaultSize: { w: 6, h: 4 } },
    { id: 'trending', title: 'Trending Collections', component: <TrendingCollectionsWidget />, defaultSize: { w: 3, h: 4 } },
    { id: 'community', title: 'Community Feed', component: <CommunityFeedWidget />, defaultSize: { w: 3, h: 6 } }
  ];

  return (
    <div className="container mx-auto p-4 space-y-8"> {/* Changed px-4 to p-4 for uniform padding, added space-y-8 */}

      {/* Top Bar: Dashboard Title & Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2"> {/* Added gap, flex-col for mobile */}
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <div className="flex items-center gap-2 sm:gap-4"> {/* Reduced gap for mobile */}
          <NotificationCenter />
          <ICPMetrics />
        </div>
      </div>
      
      {/* Section 1: Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <CanisterStatusWidget />
        <ICPPriceWidget />
        <CanisterCyclesWidget />
      </div>

      {/* Section 2: Main Content Area (using flex for sidebar layout on larger screens) */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Column */}
        <div className="flex-grow lg:w-2/3 space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-theme-accent via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mission Control
            </h2>
            <p className="text-muted-foreground">Your central hub for Web3 insights and actions.</p>
          </div>

          {/* Customizable Dashboard */}
          <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-4 sm:p-6 shadow-2xl">
             <h2 className="text-xl font-semibold text-foreground mb-4">My Widgets</h2>
            <CustomizableDashboard widgets={widgets} />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:w-1/3 space-y-8">
          <AlertsSummaryWidget nftAlertCount={activeNftAlerts.length} gasAlertCount={activeGasAlerts.length} />
          <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-4 sm:p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-accent"/> Recent Activity
            </h2>
            <RecentActivity /> {/* Assuming RecentActivity is styled or simple enough not to break horribly */}
          </div>
        </div>
      </div>

      {/* Section 3: Transaction History (Full Width Below Main Content) */}
      <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-4 sm:p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <ArrowRightLeft className="w-5 h-5 mr-2 text-accent" /> Transaction History
        </h2>
        <TransactionHistoryDisplay transactions={mockTransactions} />
      </div>
    </div>
  );
}

// --- Mock Transaction Data & Display Component ---
type MockTransaction = {
  id: string;
  type: 'NFT Alert Set' | 'Wallet Added' | 'Gas Alert Triggered' | 'Cycles Recharged' | 'Settings Changed' | 'Portfolio Refreshed' | 'Token Transfer';
  description: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  amount?: string;
  icon?: React.ElementType; // For specific icons per type
};

const mockTransactions: MockTransaction[] = [
  { id: '1', type: 'NFT Alert Set', description: 'Alert for CryptoPunks floor drop below 40 ETH', date: '2024-07-28T10:30:00Z', status: 'Completed', icon: Bell },
  { id: '2', type: 'Wallet Added', description: 'Added Solana wallet MyMainSol (SoL...j7gH)', date: '2024-07-27T15:45:00Z', status: 'Completed', icon: Wallet },
  { id: '3', type: 'Gas Alert Triggered', description: 'ETH Gas price below 20 Gwei (Standard)', date: '2024-07-27T09:15:00Z', status: 'Completed', icon: Zap },
  { id: '4', type: 'Cycles Recharged', description: 'Recharged 2T cycles to canister', date: '2024-07-26T12:00:00Z', status: 'Completed', amount: '+2T Cycles', icon: Cpu },
  { id: '5', type: 'Settings Changed', description: 'Updated notification preferences', date: '2024-07-25T18:00:00Z', status: 'Completed', icon: Settings },
  { id: '6', type: 'Portfolio Refreshed', description: 'Manually refreshed portfolio data', date: '2024-07-28T11:00:00Z', status: 'Pending', icon: RefreshCw },
  { id: '7', type: 'Token Transfer', description: 'Sent 0.05 ckBTC to new_address_here', date: '2024-07-24T14:20:00Z', status: 'Failed', amount: '-0.05 ckBTC', icon: ArrowRightLeft },
];

const TransactionHistoryDisplay: React.FC<{ transactions: MockTransaction[] }> = ({ transactions }) => {
  const getStatusIcon = (status: MockTransaction['status']) => {
    switch (status) {
      case 'Completed': return <CircleCheck className="w-4 h-4 text-green-500" />;
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />; // Simple spin for pending
      case 'Failed': return <CircleX className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2"> {/* Added max-height and scroll */}
      {transactions.map(tx => {
        const Icon = tx.icon || FilePlus; // Default icon
        return (
          <div key={tx.id} className="bg-card border-border p-3 rounded-lg hover:border-accent/50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.type}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-xs sm:max-w-md md:max-w-lg">{tx.description}</p>
                </div>
              </div>
              <div className="text-right space-y-1 flex-shrink-0 ml-2">
                <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                <div className="flex items-center justify-end space-x-1">
                  {getStatusIcon(tx.status)}
                  <span className={`text-xs font-medium ${
                    tx.status === 'Completed' ? 'text-green-500' :
                    tx.status === 'Pending' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
            {tx.amount && (
              <p className={`text-sm font-medium mt-1 ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {tx.amount}
              </p>
            )}
          </div>
        );
      })}
      {transactions.length === 0 && (
        <p className="text-muted-foreground text-center py-4">No transaction history found.</p>
      )}
    </div>
  );
};