import React from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { Cpu } from 'lucide-react'; // Or Wallet, Fuel, etc.

/**
 * @component CanisterCyclesWidget
 * @description Displays the current cycles balance of the backend canister.
 * Fetches canister cycles data from AppContext and formats it for display (T, B, M).
 * @returns {React.ReactElement} The canister cycles display widget.
 */
export const CanisterCyclesWidget: React.FC = () => {
  const { canisterCycles } = useAppContext();

  /**
   * Formats a BigInt cycles count into a human-readable string (T, B, M).
   * @param {bigint | null} c - The cycles count, or null if loading/unavailable.
   * @returns {string} Formatted cycles string or "Loading...".
   */
  const formatCycles = (c: bigint | null): string => {
    if (c === null) return "Loading...";
    const cNum = Number(c);
    if (cNum >= 1e12) return `${(cNum / 1e12).toFixed(2)}T`;
    if (cNum >= 1e9) return `${(cNum / 1e9).toFixed(2)}B`;
    if (cNum >= 1e6) return `${(cNum / 1e6).toFixed(2)}M`;
    return cNum.toString();
  };

  return (
    <div className="bg-card/70 backdrop-blur-sm border-border rounded-xl p-4 shadow-lg h-full flex flex-col justify-between">
      <div>
        <h3 className="text-md font-semibold text-foreground mb-3 flex items-center">
          <Cpu className="w-5 h-5 mr-2 text-accent" /> Canister Cycles
        </h3>
        {canisterCycles === null ? (
           <p className="text-2xl font-bold text-muted-foreground animate-pulse">Loading...</p>
        ) : (
           <p className="text-2xl font-bold text-foreground">{formatCycles(canisterCycles)}</p>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">Current Balance</p>
    </div>
  );
};
