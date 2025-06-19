import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Bell, Zap, Wallet, TrendingUp } from 'lucide-react';
import { CustomizableDashboard } from '../dashboard/CustomizableDashboard';
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

export const DashboardPage: React.FC = () => {
  const { 
    nftAlerts, 
    gasAlerts, 
    canisterCycles, 
    isOperator
  } = useAppContext();

  const activeNftAlerts = nftAlerts.filter(alert => alert.isActive);
  const activeGasAlerts = gasAlerts.filter(alert => alert.isActive);

  const widgets = [
    {
      id: 'portfolio',
      title: 'Portfolio Overview',
      component: <PortfolioWidget />,
      defaultSize: { w: 6, h: 4 }
    },
    {
      id: 'nft-price',
      title: 'NFT Price History',
      component: <NFTPriceWidget />,
      defaultSize: { w: 6, h: 4 }
    },
    {
      id: 'gas-fees',
      title: 'Gas Fee Trends',
      component: <GasFeeWidget />,
      defaultSize: { w: 6, h: 4 }
    },
    {
      id: 'trending',
      title: 'Trending Collections',
      component: <TrendingCollectionsWidget />,
      defaultSize: { w: 3, h: 4 }
    },
    {
      id: 'community',
      title: 'Community Feed',
      component: <CommunityFeedWidget />,
      defaultSize: { w: 3, h: 6 }
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <NotificationCenter />
          <ICPMetrics 
          // canisterCycles={canisterCycles} 
          // isOperator={isOperator} 
          />
        </div>
      </div>
      
      {/* Header Section */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Mission Control
        </h1>
        <p className="text-slate-400">Monitor your NFT alerts and blockchain fees from orbit</p>
      </div>

      {/* Customizable Dashboard */}
      <CustomizableDashboard widgets={widgets} />

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
            />
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
            />
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
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
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
                <p className="text-2xl font-bold text-white">
                  {canisterCycles >= 1e12 ? `${(canisterCycles / 1e12).toFixed(1)}T` :
                   canisterCycles >= 1e9 ? `${(canisterCycles / 1e9).toFixed(1)}B` :
                   canisterCycles >= 1e6 ? `${(canisterCycles / 1e6).toFixed(1)}M` :
                   canisterCycles.toString()}
                </p>
                <p className="text-sm text-slate-400">Cycles</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <p className="text-sm text-green-400">Normal</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}