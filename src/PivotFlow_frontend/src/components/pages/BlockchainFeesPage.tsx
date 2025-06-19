import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { LoadingSpinner } from '../LoadingSpinner';
import { Zap, RefreshCw, Plus, Trash2, Calculator, Wallet } from 'lucide-react';

export const BlockchainFeesPage: React.FC = () => {
  const { 
    networkFees, 
    gasAlerts, 
    addGasAlert, 
    removeGasAlert, 
    refreshNetworkFees, 
    canisterCycles,
    isOperator,
    isLoading 
  } = useAppContext();

  const [showGasAlertForm, setShowGasAlertForm] = useState(false);
  const [showCostCalculator, setShowCostCalculator] = useState(false);
  
  const [gasAlertForm, setGasAlertForm] = useState({
    blockchain: 'Ethereum',
    maxGwei: '',
    priorityTier: 'standard' as 'fast' | 'standard' | 'slow',
  });

  const [costCalculator, setCostCalculator] = useState({
    blockchain: 'Ethereum',
    transactionType: 'mint_nft',
  });

  const transactionTypes = {
    mint_nft: { label: 'Mint NFT', gasUnits: 150000 },
    buy_nft: { label: 'Buy NFT', gasUnits: 100000 },
    list_nft: { label: 'List NFT', gasUnits: 80000 },
    transfer_nft: { label: 'Transfer NFT', gasUnits: 70000 },
    approve_nft: { label: 'Approve NFT', gasUnits: 50000 },
  };

  const handleGasAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gasAlertForm.maxGwei) return;

    addGasAlert({
      blockchain: gasAlertForm.blockchain,
      maxGwei: parseInt(gasAlertForm.maxGwei),
      priorityTier: gasAlertForm.priorityTier,
    });

    setGasAlertForm({
      blockchain: 'Ethereum',
      maxGwei: '',
      priorityTier: 'standard',
    });
    setShowGasAlertForm(false);
  };

  const calculateTransactionCost = () => {
    const network = networkFees.find(n => n.blockchain === costCalculator.blockchain);
    const txType = transactionTypes[costCalculator.transactionType as keyof typeof transactionTypes];
    
    if (!network || !txType) return null;

    const gasPrice = network.standard.gwei;
    const gasUnits = txType.gasUnits;
    const costInGwei = gasPrice * gasUnits;
    const costInEth = costInGwei / 1e9; // Convert to ETH
    const costInUsd = costInEth * 2000; // Assume ETH = $2000

    return {
      gasPrice,
      gasUnits,
      costInEth: costInEth.toFixed(6),
      costInUsd: costInUsd.toFixed(2),
    };
  };

  const formatCycles = (cycles: number) => {
    if (cycles >= 1e12) return `${(cycles / 1e12).toFixed(1)}T`;
    if (cycles >= 1e9) return `${(cycles / 1e9).toFixed(1)}B`;
    if (cycles >= 1e6) return `${(cycles / 1e6).toFixed(1)}M`;
    return cycles.toString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-theme-accent via-purple-400 to-pink-400 bg-clip-text text-transparent"> {/* Use theme-accent */}
          Blockchain Fees Monitor
        </h1>
        <p className="text-muted-foreground">Track cross-chain transaction costs in real-time</p> {/* Use text-muted-foreground */}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        <button /* Refresh Button */
          onClick={() => refreshNetworkFees()}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-2xl font-medium shadow-lg disabled:opacity-50"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : <RefreshCw size={20} />}
          <span>Refresh Fees</span>
        </button>
        
        <button /* Set Gas Alert Button */
          onClick={() => setShowGasAlertForm(!showGasAlertForm)}
          className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-accent/25"
        >
          <Plus size={20} />
          <span>Set Gas Alert</span>
        </button>

        <button /* Cost Calculator Button */
          onClick={() => setShowCostCalculator(!showCostCalculator)}
          className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-2xl font-medium shadow-lg disabled:opacity-50"
        >
          <Calculator size={20} />
          <span>Cost Calculator</span>
        </button>
      </div>

      {/* Current Network Fees */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {networkFees.map((network) => (
          <div
            key={network.blockchain}
            className="bg-card/70 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl hover:border-accent/30 transition-all duration-300" /* Use bg-card, border-border, hover */
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center"> {/* Use text-foreground */}
                <span className="text-2xl mr-2">{network.icon}</span>
                {network.blockchain}
              </h3>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> {/* Semantic: keep green for 'live' */}
            </div>

            <div className="space-y-3">
              {/* Fast */}
              <div className="flex justify-between items-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl"> {/* Semantic: keep red */}
                <div>
                  <span className="text-red-400 font-medium">Fast</span>
                  <p className="text-xs text-muted-foreground">~15 seconds</p> {/* Use text-muted-foreground */}
                </div>
                <div className="text-right">
                  <p className="text-foreground font-bold">{Math.round(network.fast.gwei)} Gwei</p> {/* Use text-foreground */}
                  <p className="text-xs text-muted-foreground">${network.fast.usd.toFixed(2)}</p> {/* Use text-muted-foreground */}
                </div>
              </div>

              {/* Standard */}
              <div className="flex justify-between items-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"> {/* Semantic: keep yellow */}
                <div>
                  <span className="text-yellow-400 font-medium">Standard</span>
                  <p className="text-xs text-muted-foreground">~1 minute</p> {/* Use text-muted-foreground */}
                </div>
                <div className="text-right">
                  <p className="text-foreground font-bold">{Math.round(network.standard.gwei)} Gwei</p> {/* Use text-foreground */}
                  <p className="text-xs text-muted-foreground">${network.standard.usd.toFixed(2)}</p> {/* Use text-muted-foreground */}
                </div>
              </div>

              {/* Slow */}
              <div className="flex justify-between items-center p-3 bg-green-500/10 border border-green-500/20 rounded-xl"> {/* Semantic: keep green */}
                <div>
                  <span className="text-green-400 font-medium">Slow</span>
                  <p className="text-xs text-muted-foreground">~5 minutes</p> {/* Use text-muted-foreground */}
                </div>
                <div className="text-right">
                  <p className="text-foreground font-bold">{Math.round(network.slow.gwei)} Gwei</p> {/* Use text-foreground */}
                  <p className="text-xs text-muted-foreground">${network.slow.usd.toFixed(2)}</p> {/* Use text-muted-foreground */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gas Alert Form */}
      {showGasAlertForm && (
        <div className="bg-card/70 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl"> {/* Use bg-card, border-border */}
          <h2 className="text-xl font-semibold text-foreground mb-6">Set Gas Alert</h2> {/* Use text-foreground */}
          
          <form onSubmit={handleGasAlertSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2"> {/* Use text-foreground */}
                Blockchain *
              </label>
              <select
                value={gasAlertForm.blockchain}
                onChange={(e) => setGasAlertForm({ ...gasAlertForm, blockchain: e.target.value })}
                className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground focus:ring-ring focus:border-accent" /* Use theme input styles */
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
                <option value="BNB Chain">BNB Chain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2"> {/* Use text-foreground */}
                Max Gwei *
              </label>
              <input
                type="number"
                value={gasAlertForm.maxGwei}
                onChange={(e) => setGasAlertForm({ ...gasAlertForm, maxGwei: e.target.value })}
                placeholder="e.g., 30"
                className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Use theme input styles */
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2"> {/* Use text-foreground */}
                Priority Tier *
              </label>
              <select
                value={gasAlertForm.priorityTier}
                onChange={(e) => setGasAlertForm({ ...gasAlertForm, priorityTier: e.target.value as any })}
                className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground focus:ring-ring focus:border-accent" /* Use theme input styles */
              >
                <option value="fast">Fast</option>
                <option value="standard">Standard</option>
                <option value="slow">Slow</option>
              </select>
            </div>

            <div className="md:col-span-3 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowGasAlertForm(false)}
                className="px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl" /* Use theme secondary button */
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl font-medium" /* Use theme primary button */
              >
                <span>Set Alert</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cost Calculator */}
      {showCostCalculator && (
        <div className="bg-card/70 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl"> {/* Use bg-card, border-border */}
          <h2 className="text-xl font-semibold text-foreground mb-6">Transaction Cost Calculator</h2> {/* Use text-foreground */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2"> {/* Use text-foreground */}
                Blockchain
              </label>
              <select
                value={costCalculator.blockchain}
                onChange={(e) => setCostCalculator({ ...costCalculator, blockchain: e.target.value })}
                className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground focus:ring-ring focus:border-accent" /* Use theme input styles */
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
                <option value="BNB Chain">BNB Chain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2"> {/* Use text-foreground */}
                Transaction Type
              </label>
              <select
                value={costCalculator.transactionType}
                onChange={(e) => setCostCalculator({ ...costCalculator, transactionType: e.target.value })}
                className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground focus:ring-ring focus:border-accent" /* Use theme input styles */
              >
                {Object.entries(transactionTypes).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>
          </div>

          {(() => {
            const cost = calculateTransactionCost();
            return cost ? (
              <div className="mt-6 p-4 bg-secondary/30 rounded-xl border-border"> {/* Use bg-secondary, border-border */}
                <h3 className="text-lg font-semibold text-foreground mb-4">Estimated Cost</h3> {/* Use text-foreground */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Gas Price</p> {/* Use text-muted-foreground */}
                    <p className="text-foreground font-bold">{cost.gasPrice} Gwei</p> {/* Use text-foreground */}
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Gas Units</p> {/* Use text-muted-foreground */}
                    <p className="text-foreground font-bold">{cost.gasUnits.toLocaleString()}</p> {/* Use text-foreground */}
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">ETH Cost</p> {/* Use text-muted-foreground */}
                    <p className="text-foreground font-bold">{cost.costInEth}</p> {/* Use text-foreground */}
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">USD Cost</p> {/* Use text-muted-foreground */}
                    <p className="text-green-400 font-bold">${cost.costInUsd}</p> {/* Semantic: keep green */}
                  </div>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Active Gas Alerts */}
      <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl"> {/* Use bg-card, border-border */}
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center"> {/* Use text-foreground */}
          <Zap className="w-5 h-5 mr-2 text-purple-400" /> {/* Semantic: keep purple */}
          Active Gas Alerts ({gasAlerts.length})
        </h2>

        {gasAlerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚡</div>
            <p className="text-muted-foreground mb-2">No gas alerts configured</p> {/* Use text-muted-foreground */}
            <p className="text-sm text-muted-foreground/70">Set up alerts to be notified when gas prices drop</p> {/* Use text-muted-foreground */}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gasAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-card border-border rounded-xl p-4 hover:border-accent/50 transition-all duration-300" /* Use bg-card, border-border, hover */
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-foreground font-medium">{alert.blockchain}</h3> {/* Use text-foreground */}
                  <button
                    onClick={() => removeGasAlert(alert.id)}
                    className="p-1 text-muted-foreground hover:text-destructive-foreground hover:bg-destructive/80 rounded" /* Themed remove button */
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Max Gwei:</span> {/* Use text-muted-foreground */}
                    <span className="text-foreground font-medium">{alert.maxGwei}</span> {/* Use text-foreground */}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Priority:</span> {/* Use text-muted-foreground */}
                    <span className="text-purple-400 capitalize">{alert.priorityTier}</span> {/* Semantic: keep purple */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Canister Cycles (Operator Only) */}
      {isOperator && (
        <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl"> {/* Use bg-card, border-border */}
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center"> {/* Use text-foreground */}
            <Wallet className="w-5 h-5 mr-2 text-yellow-400" /> {/* Semantic: keep yellow */}
            Canister Cycles
          </h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">{formatCycles(canisterCycles)}</p> {/* Use text-foreground */}
              <p className="text-muted-foreground">Current Balance</p> {/* Use text-muted-foreground */}
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div> {/* Semantic: keep green */}
              <span className="text-green-400 font-medium">Normal</span> {/* Semantic: keep green */}
            </div>
          </div>
          
          <div className="mt-4">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl font-medium"> {/* Keep custom button color, ensure contrast for text */}
              Top Up Cycles
            </button>
          </div>
        </div>
      )}
    </div>
  );
};