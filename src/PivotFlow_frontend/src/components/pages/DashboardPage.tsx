import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { LoadingSpinner, LoadingSkeleton } from '../LoadingSpinner';
import { Activity, Bell, Zap, Wallet, TrendingUp, AlertTriangle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    nftAlerts, 
    gasAlerts, 
    recentActivity, 
    canisterCycles, 
    isOperator, 
    isLoading 
  } = useAppContext();

  const activeNftAlerts = nftAlerts.filter(alert => alert.isActive);
  const activeGasAlerts = gasAlerts.filter(alert => alert.isActive);

  const formatCycles = (cycles: number) => {
    if (cycles >= 1e12) return `${(cycles / 1e12).toFixed(1)}T`;
    if (cycles >= 1e9) return `${(cycles / 1e9).toFixed(1)}B`;
    if (cycles >= 1e6) return `${(cycles / 1e6).toFixed(1)}M`;
    return cycles.toString();
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const time = new Date(timestamp).getTime();
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Mission Control
        </h1>
        <p className="text-slate-400">Monitor your NFT alerts and blockchain fees from orbit</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active NFT Alerts */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-cyan-500/20 rounded-xl">
              <Bell className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{activeNftAlerts.length}</p>
              <p className="text-sm text-slate-400">NFT Alerts</p>
            </div>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (activeNftAlerts.length / 10) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Active Gas Alerts */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{activeGasAlerts.length}</p>
              <p className="text-sm text-slate-400">Gas Alerts</p>
            </div>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (activeGasAlerts.length / 5) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Portfolio Value */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">12.4</p>
              <p className="text-sm text-slate-400">ETH Value</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-sm text-green-400">+2.3% (24h)</p>
          </div>
        </div>

        {/* Canister Cycles (Operator Only) */}
        {isOperator && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Wallet className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{formatCycles(canisterCycles)}</p>
                <p className="text-sm text-slate-400">Cycles</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-sm text-green-400">Normal</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-cyan-400" />
            Recent Activity
          </h2>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton lines={5} />
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🚀</div>
              <p className="text-slate-400">No recent activity. Your alerts are standing by.</p>
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'nft_alert' ? 'bg-cyan-500/20 text-cyan-400' :
                    activity.type === 'gas_alert' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {activity.type === 'nft_alert' && <Bell size={16} />}
                    {activity.type === 'gas_alert' && <Zap size={16} />}
                    {activity.type === 'portfolio_update' && <Wallet size={16} />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.message}</p>
                    {activity.blockchain && (
                      <p className="text-sm text-slate-400">{activity.blockchain}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-500">{formatTimeAgo(activity.timestamp)}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">NFT Monitor</span>
              <span className="text-green-400">Operational</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Gas Tracker</span>
              <span className="text-green-400">Operational</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Notifications</span>
              <span className="text-green-400">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700/70 rounded-xl transition-all duration-300 text-slate-300 hover:text-white">
              Create NFT Alert
            </button>
            <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700/70 rounded-xl transition-all duration-300 text-slate-300 hover:text-white">
              Set Gas Alert
            </button>
            <button className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700/70 rounded-xl transition-all duration-300 text-slate-300 hover:text-white">
              Refresh Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};