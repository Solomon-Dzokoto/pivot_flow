import React from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { AlertTriangle } from 'lucide-react';

/**
 * @component AlertsSummaryWidget
 * @description Displays a summary of active NFT and Gas alerts.
 * Data is derived from props passed from DashboardPage, which gets it from AppContext.
 * @param {object} props - The component's props.
 * @param {number} props.nftAlertCount - Number of active NFT alerts.
 * @param {number} props.gasAlertCount - Number of active Gas alerts.
 * @returns {React.ReactElement} The alerts summary display widget.
 */
export const AlertsSummaryWidget: React.FC<{ nftAlertCount: number; gasAlertCount: number }> = ({ nftAlertCount, gasAlertCount }) => {
  // const { setCurrentView } = useAppContext(); // If "View All Alerts" button should navigate

  return (
    <div className="bg-card/70 backdrop-blur-sm border-border rounded-xl p-4 shadow-lg h-full flex flex-col justify-between">
      <div>
        <h3 className="text-md font-semibold text-foreground mb-3 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-accent" /> Alerts Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Active NFT Alerts:</span>
            <span className="text-foreground font-medium">{nftAlertCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Active Gas Alerts:</span>
            <span className="text-foreground font-medium">{gasAlertCount}</span>
          </div>
        </div>
      </div>
      {/* Placeholder for a button to navigate to alerts page */}
      <button
        onClick={() => { /* TODO: Implement navigation, e.g., setCurrentView('nft-alerts') or similar */ alert('Navigate to alerts page - TBD'); }}
        className="mt-3 text-xs text-accent hover:underline focus:outline-none"
      >
        View All Alerts
      </button>
    </div>
  );
};
