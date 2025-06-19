import React from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { ShieldCheck } from 'lucide-react';

/**
 * @component CanisterStatusWidget
 * @description Displays the current status of the backend canister, including memory usage.
 * Fetches memory data from AppContext. Status is currently static.
 * @returns {React.ReactElement} The canister status display widget.
 */
export const CanisterStatusWidget: React.FC = () => {
  const { canisterMemory } = useAppContext();

  /**
   * Formats a BigInt memory size into a human-readable string (MB or GB).
   * @param {bigint | null} mem - The memory size in bytes, or null if loading/unavailable.
   * @returns {string} Formatted memory size string or "Loading...".
   */
  const formatMemory = (mem: bigint | null): string => {
    if (mem === null) return "Loading...";
    const gb = Number(mem) / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = Number(mem) / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  // Status is static for now, could be fetched or determined by other metrics in the future.
  const status = "Operational";

  return (
    <div className="bg-card/70 backdrop-blur-sm border-border rounded-xl p-4 shadow-lg neon-glow-border h-full flex flex-col justify-between">
      <div>
        <h3 className="text-md font-semibold text-foreground mb-3 flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-accent" /> Canister Status
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="text-green-400 font-medium flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>{status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Memory:</span>
            <span className="text-foreground font-medium">{formatMemory(canisterMemory)}</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">System health nominal.</p>
    </div>
  );
};
