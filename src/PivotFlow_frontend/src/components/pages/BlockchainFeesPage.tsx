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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Blockchain Fees Monitor
        </h1>
        <p className="text-slate-400">Track cross-chain transaction costs in real-time</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => refreshNetworkFees()}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : <RefreshCw size={20} />}
          <span>Refresh Fees</span>
        </button>
        
        <button
          onClick={() => setShowGasAlertForm(!showGasAlertForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Plus size={20} />
          <span>Set Gas Alert</span>
        </button>

        <button
          onClick={() => setShowCostCalculator(!showCostCalculator)}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
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
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:border-slate-600/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <span className="text-2xl mr-2">{network.icon}</span>
                {network.blockchain}
              </h3>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-3">
              {/* Fast */}
              <div className="flex justify-between items-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div>
                  <span className="text-red-400 font-medium">Fast</span>
                  <p className="text-xs text-slate-500">~15 seconds</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{Math.round(network.fast.gwei)} Gwei</p>
                  <p className="text-xs text-slate-400">${network.fast.usd.toFixed(2)}</p>
                </div>
              </div>

              {/* Standard */}
              <div className="flex justify-between items-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div>
                  <span className="text-yellow-400 font-medium">Standard</span>
                  <p className="text-xs text-slate-500">~1 minute</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{Math.round(network.standard.gwei)} Gwei</p>
                  <p className="text-xs text-slate-400">${network.standard.usd.toFixed(2)}</p>
                </div>
              </div>

              {/* Slow */}
              <div className="flex justify-between items-center p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div>
                  <span className="text-green-400 font-medium">Slow</span>
                  <p className="text-xs text-slate-500">~5 minutes</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{Math.round(network.slow.gwei)} Gwei</p>
                  <p className="text-xs text-slate-400">${network.slow.usd.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gas Alert Form */}
      {showGasAlertForm && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Set Gas Alert</h2>
          
          <form onSubmit={handleGasAlertSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Blockchain *
              </label>
              <select
                value={gasAlertForm.blockchain}
                onChange={(e) => setGasAlertForm({ ...gasAlertForm, blockchain: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
                <option value="BNB Chain">BNB Chain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Gwei *
              </label>
              <input
                type="number"
                value={gasAlertForm.maxGwei}
                onChange={(e) => setGasAlertForm({ ...gasAlertForm, maxGwei: e.target.value })}
                placeholder="e.g., 30"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Priority Tier *
              </label>
              <select
                value={gasAlertForm.priorityTier}
                onChange={(e) => setGasAlertForm({ ...gasAlertForm, priorityTier: e.target.value as any })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
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
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
              >
                <span>Set Alert</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cost Calculator */}
      {showCostCalculator && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Transaction Cost Calculator</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Blockchain
              </label>
              <select
                value={costCalculator.blockchain}
                onChange={(e) => setCostCalculator({ ...costCalculator, blockchain: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
                <option value="BNB Chain">BNB Chain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Transaction Type
              </label>
              <select
                value={costCalculator.transactionType}
                onChange={(e) => setCostCalculator({ ...costCalculator, transactionType: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
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
              <div className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4">Estimated Cost</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">Gas Price</p>
                    <p className="text-white font-bold">{cost.gasPrice} Gwei</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">Gas Units</p>
                    <p className="text-white font-bold">{cost.gasUnits.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">ETH Cost</p>
                    <p className="text-white font-bold">{cost.costInEth}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">USD Cost</p>
                    <p className="text-green-400 font-bold">${cost.costInUsd}</p>
                  </div>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Active Gas Alerts */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-purple-400" />
          Active Gas Alerts ({gasAlerts.length})
        </h2>

        {gasAlerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚡</div>
            <p className="text-slate-400 mb-2">No gas alerts configured</p>
            <p className="text-sm text-slate-500">Set up alerts to be notified when gas prices drop</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gasAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">{alert.blockchain}</h3>
                  <button
                    onClick={() => removeGasAlert(alert.id)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Max Gwei:</span>
                    <span className="text-white font-medium">{alert.maxGwei}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Priority:</span>
                    <span className="text-purple-400 capitalize">{alert.priorityTier}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Canister Cycles (Operator Only) */}
      {isOperator && (
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-yellow-400" />
            Canister Cycles
          </h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{formatCycles(canisterCycles)}</p>
              <p className="text-slate-400">Current Balance</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Normal</span>
            </div>
          </div>
          
          <div className="mt-4">
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105">
              Top Up Cycles
            </button>
          </div>
        </div>
      )}
    </div>
  );
};