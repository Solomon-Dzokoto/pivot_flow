import React from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { TrendingUp } from 'lucide-react';

/**
 * @component ICPPriceWidget
 * @description Displays the current price of ICP (Internet Computer Protocol token).
 * Fetches ICP price data from AppContext. Shows a loading state and a mock 24h change.
 * @returns {React.ReactElement} The ICP price display widget.
 */
export const ICPPriceWidget: React.FC = () => {
  const { icpPrice } = useAppContext();

  return (
    <div className="bg-card/70 backdrop-blur-sm border-border rounded-xl p-4 shadow-lg h-full flex flex-col justify-between">
      <div>
        <h3 className="text-md font-semibold text-foreground mb-3 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-accent" /> ICP Price
        </h3>
        {icpPrice === null ? (
          <p className="text-2xl font-bold text-muted-foreground animate-pulse">Loading...</p>
        ) : (
          <p className="text-2xl font-bold text-foreground">${icpPrice.toFixed(2)}</p>
        )}
      </div>
      {/* Mocked change, can be made dynamic later if price history is available */}
      <p className="text-xs text-green-400 mt-1">+0.5% (24h)</p>
    </div>
  );
};
