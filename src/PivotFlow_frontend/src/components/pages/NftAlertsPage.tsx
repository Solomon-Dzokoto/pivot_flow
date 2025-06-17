import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { LoadingSpinner } from '../LoadingSpinner';
import { Plus, Bell, Edit, Trash2, Eye, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export const NftAlertsPage: React.FC = () => {
  const { nftAlerts, addNftAlert, removeNftAlert, updateNftAlert, isLoading } = useAppContext();
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    collectionSlug: '',
    collectionName: '',
    targetPrice: '',
    currency: 'ETH',
    alertType: 'drop_below' as 'drop_below' | 'rise_above' | 'any_change',
    gasLimit: '',
    percentageChange: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.collectionSlug || !formData.targetPrice) return;

    addNftAlert({
      collectionSlug: formData.collectionSlug,
      collectionName: formData.collectionName || formData.collectionSlug,
      targetPrice: parseFloat(formData.targetPrice),
      currency: formData.currency,
      alertType: formData.alertType,
      gasLimit: formData.gasLimit ? parseInt(formData.gasLimit) : undefined,
      percentageChange: formData.percentageChange ? parseFloat(formData.percentageChange) : undefined,
      currentFloorPrice: parseFloat(formData.targetPrice) + (Math.random() - 0.5) * 5, // Mock current price
    });

    setFormData({
      collectionSlug: '',
      collectionName: '',
      targetPrice: '',
      currency: 'ETH',
      alertType: 'drop_below',
      gasLimit: '',
      percentageChange: '',
    });
    setShowAddForm(false);
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toFixed(2)} ${currency}`;
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'drop_below': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'rise_above': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'any_change': return <Activity className="w-4 h-4 text-yellow-400" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'drop_below': return 'text-red-400 bg-red-500/20';
      case 'rise_above': return 'text-green-400 bg-green-500/20';
      case 'any_change': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-cyan-400 bg-cyan-500/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          NFT Alert System
        </h1>
        <p className="text-slate-400">Monitor floor prices across the NFT universe</p>
      </div>

      {/* Add Alert Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
        >
          <Plus size={20} />
          <span>Create New Alert</span>
        </button>
      </div>

      {/* Add Alert Form */}
      {showAddForm && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Create NFT Alert</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Collection Slug *
              </label>
              <input
                type="text"
                value={formData.collectionSlug}
                onChange={(e) => setFormData({ ...formData, collectionSlug: e.target.value })}
                placeholder="e.g., boredapeyachtclub"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Use the collection's URL slug from OpenSea</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Collection Name
              </label>
              <input
                type="text"
                value={formData.collectionName}
                onChange={(e) => setFormData({ ...formData, collectionName: e.target.value })}
                placeholder="e.g., Bored Ape Yacht Club"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target Price *
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.01"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                  placeholder="0.00"
                  className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                  required
                />
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                >
                  <option value="ETH">ETH</option>
                  <option value="SOL">SOL</option>
                  <option value="MATIC">MATIC</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Alert Type *
              </label>
              <select
                value={formData.alertType}
                onChange={(e) => setFormData({ ...formData, alertType: e.target.value as any })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
              >
                <option value="drop_below">Drop Below</option>
                <option value="rise_above">Rise Above</option>
                <option value="any_change">Any Change</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Gas Limit (Gwei)
              </label>
              <input
                type="number"
                value={formData.gasLimit}
                onChange={(e) => setFormData({ ...formData, gasLimit: e.target.value })}
                placeholder="Optional - for Ethereum alerts"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
              />
            </div>

            {formData.alertType === 'any_change' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Percentage Change (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.percentageChange}
                  onChange={(e) => setFormData({ ...formData, percentageChange: e.target.value })}
                  placeholder="e.g., 5.0"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                />
              </div>
            )}

            <div className="md:col-span-2 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
              >
                {isLoading && <LoadingSpinner size="sm" />}
                <span>Create Alert</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Alerts */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-cyan-400" />
          Active NFT Alerts ({nftAlerts.length})
        </h2>

        {nftAlerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-slate-400 mb-2">No NFT alerts configured</p>
            <p className="text-sm text-slate-500">Create your first alert to start monitoring floor prices</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nftAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{alert.collectionName}</h3>
                    <p className="text-sm text-slate-400">@{alert.collectionSlug}</p>
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getAlertTypeColor(alert.alertType)}`}>
                    {getAlertTypeIcon(alert.alertType)}
                    <span className="capitalize">{alert.alertType.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Target Price:</span>
                    <span className="text-white font-medium">{formatPrice(alert.targetPrice, alert.currency)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Current Floor:</span>
                    <span className={`font-medium ${
                      alert.currentFloorPrice < alert.targetPrice ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {formatPrice(alert.currentFloorPrice, alert.currency)}
                    </span>
                  </div>

                  {alert.gasLimit && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Gas Limit:</span>
                      <span className="text-white font-medium">{alert.gasLimit} Gwei</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Last Checked:</span>
                    <span className="text-slate-500 text-sm">
                      {new Date(alert.lastChecked).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button className="p-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-400 hover:text-cyan-400 rounded-lg transition-all duration-300">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-400 hover:text-yellow-400 rounded-lg transition-all duration-300">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => removeNftAlert(alert.id)}
                    className="p-2 bg-slate-700/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all duration-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};