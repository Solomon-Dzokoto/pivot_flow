import React from 'react';
import { useAppContext } from '../../../contexts/AppContext'; // May not be needed if data comes via props
import { ArrowRightLeft, Settings, FilePlus, CircleCheck, CircleX, Clock, Bell, Wallet, Zap, Cpu, RefreshCw } from 'lucide-react';

/**
 * @type MockTransaction
 * @description Defines the structure for a mock transaction item.
 */
export type MockTransaction = {
  id: string;
  type: 'NFT Alert Set' | 'Wallet Added' | 'Gas Alert Triggered' | 'Cycles Recharged' | 'Settings Changed' | 'Portfolio Refreshed' | 'Token Transfer';
  description: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  amount?: string;
  icon?: React.ElementType;
};

// Mock Data - In a real app, this would come from context or props based on fetched data
const mockTransactions: MockTransaction[] = [
  { id: '1', type: 'NFT Alert Set', description: 'Alert for CryptoPunks floor drop below 40 ETH', date: '2024-07-28T10:30:00Z', status: 'Completed', icon: Bell },
  { id: '2', type: 'Wallet Added', description: 'Added Solana wallet MyMainSol (SoL...j7gH)', date: '2024-07-27T15:45:00Z', status: 'Completed', icon: Wallet },
  { id: '3', type: 'Gas Alert Triggered', description: 'ETH Gas price below 20 Gwei (Standard)', date: '2024-07-27T09:15:00Z', status: 'Completed', icon: Zap },
  { id: '4', type: 'Cycles Recharged', description: 'Recharged 2T cycles to canister', date: '2024-07-26T12:00:00Z', status: 'Completed', amount: '+2T Cycles', icon: Cpu },
  { id: '5', type: 'Settings Changed', description: 'Updated notification preferences', date: '2024-07-25T18:00:00Z', status: 'Completed', icon: Settings },
  { id: '6', type: 'Portfolio Refreshed', description: 'Manually refreshed portfolio data', date: '2024-07-28T11:00:00Z', status: 'Pending', icon: RefreshCw },
  { id: '7', type: 'Token Transfer', description: 'Sent 0.05 ckBTC to new_address_here', date: '2024-07-24T14:20:00Z', status: 'Failed', amount: '-0.05 ckBTC', icon: ArrowRightLeft },
];


/**
 * @component TransactionHistoryWidget
 * @description Displays a list of mock transactions with status indicators and icons.
 * Uses internally defined mock data for now.
 * @returns {React.ReactElement} The transaction history display widget.
 */
export const TransactionHistoryWidget: React.FC = () => {
  // const { recentActivity } = useAppContext(); // If using real activity from context later

  /**
   * Returns a status icon component based on the transaction status.
   * @param {MockTransaction['status']} status - The status of the transaction.
   * @returns {React.ReactElement | null} Corresponding status icon.
   */
  const getStatusIcon = (status: MockTransaction['status']) => {
    switch (status) {
      case 'Completed': return <CircleCheck className="w-4 h-4 text-green-500" />;
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'Failed': return <CircleX className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  /**
   * Formats an ISO date string into a more readable local date and time.
   * @param {string} dateString - The ISO date string.
   * @returns {string} Formatted date string.
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-4 sm:p-6 shadow-2xl h-full">
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
        <ArrowRightLeft className="w-5 h-5 mr-2 text-accent" /> Transaction History
      </h2>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom-scrollbar if defined globally */}
        {mockTransactions.map(tx => {
          const Icon = tx.icon || FilePlus; // Default icon if none provided
          return (
            <div key={tx.id} className="bg-card border-border p-3 rounded-lg hover:border-accent/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0"> {/* Added min-w-0 for truncation */}
                  <Icon className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="min-w-0"> {/* Added min-w-0 for truncation */}
                    <p className="text-sm font-medium text-foreground truncate">{tx.type}</p>
                    <p className="text-xs text-muted-foreground truncate">{tx.description}</p>
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
                <p className={`text-sm font-medium mt-1 text-right ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.amount}
                </p>
              )}
            </div>
          );
        })}
        {mockTransactions.length === 0 && (
          <p className="text-muted-foreground text-center py-4">No transaction history found.</p>
        )}
      </div>
    </div>
  );
};
