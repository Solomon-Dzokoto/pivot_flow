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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-theme-accent via-purple-400 to-pink-400 bg-clip-text text-transparent"> {/* Use theme-accent */}
          NFT Alert System
        </h1>
        <p className="text-muted-foreground">Monitor floor prices across the NFT universe</p> {/* Use text-muted-foreground */}
      </div>

      {/* Add Alert Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-accent/25" /* Use theme primary button style */
        >
          <Plus size={20} />
          <span>Create New Alert</span>
        </button>
      </div>

      {/* Add Alert Form */}
      {showAddForm && (
        <div className="bg-card/70 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl smooth-appear"> {/* Use bg-card, border-border, ADDED smooth-appear */}
          <h2 className="text-xl font-semibold text-foreground mb-6">Create NFT Alert</h2> {/* Use text-foreground */}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2"> {/* Use text-foreground */}
                Collection Slug *
              </label>
              <input
                type="text"
                value={formData.collectionSlug}
                onChange={(e) => setFormData({ ...formData, collectionSlug: e.target.value })}
                placeholder="e.g., boredapeyachtclub"
                className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Use theme input styles */
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Use the collection's URL slug from OpenSea</p> {/* Use text-muted-foreground */}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2"> {/* Use text-foreground */}
                Collection Name
              </label>
              <input
                type="text"
                value={formData.collectionName}
                onChange={(e) => setFormData({ ...formData, collectionName: e.target.value })}
                placeholder="e.g., Bored Ape Yacht Club"
                className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Use theme input styles */
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2"> {/* Use text-foreground */}
                Target Price *
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.01"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                  placeholder="0.00"
                  className="flex-1 bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Use theme input styles */
                  required
                />
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="bg-input border-border rounded-xl px-4 py-3 text-foreground focus:ring-ring focus:border-accent" /* Use theme input styles */
                >
                  <option value="ETH">ETH</option>
                  <option value="SOL">SOL</option>
                  <option value="MATIC">MATIC</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2"> {/* Use text-foreground */}
                Alert Type *
              </label>
              <select
                value={formData.alertType}
                onChange={(e) => setFormData({ ...formData, alertType: e.target.value as any })}
                className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground focus:ring-ring focus:border-accent" /* Use theme input styles */
              >
                <option value="drop_below">Drop Below</option>
                <option value="rise_above">Rise Above</option>
                <option value="any_change">Any Change</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2"> {/* Use text-foreground */}
                Gas Limit (Gwei)
              </label>
              <input
                type="number"
                value={formData.gasLimit}
                onChange={(e) => setFormData({ ...formData, gasLimit: e.target.value })}
                placeholder="Optional - for Ethereum alerts"
                className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Use theme input styles */
              />
            </div>

            {formData.alertType === 'any_change' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2"> {/* Use text-foreground */}
                  Percentage Change (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.percentageChange}
                  onChange={(e) => setFormData({ ...formData, percentageChange: e.target.value })}
                  placeholder="e.g., 5.0"
                  className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Use theme input styles */
                />
              </div>
            )}

            <div className="md:col-span-2 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl" /* Use theme secondary button style */
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl font-medium disabled:opacity-50" /* Use theme primary button style */
              >
                {isLoading && <LoadingSpinner size="sm" />}
                <span>Create Alert</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Alerts */}
      <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl"> {/* Use bg-card, border-border */}
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center"> {/* Use text-foreground */}
          <Bell className="w-5 h-5 mr-2 text-accent" /> {/* Use text-accent */}
          Active NFT Alerts ({nftAlerts.length})
        </h2>

        {nftAlerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-muted-foreground mb-2">No NFT alerts configured</p> {/* Use text-muted-foreground */}
            <p className="text-sm text-muted-foreground/70">Create your first alert to start monitoring floor prices</p> {/* Use text-muted-foreground */}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nftAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-card border-border rounded-xl p-6 hover:border-accent/50 transition-all duration-300" /* Use bg-card, border-border, hover:border-accent */
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{alert.collectionName}</h3> {/* Use text-foreground */}
                    <p className="text-sm text-muted-foreground">@{alert.collectionSlug}</p> {/* Use text-muted-foreground */}
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getAlertTypeColor(alert.alertType)}`}>
                    {getAlertTypeIcon(alert.alertType)}
                    <span className="capitalize">{alert.alertType.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Target Price:</span> {/* Use text-muted-foreground */}
                    <span className="text-foreground font-medium">{formatPrice(alert.targetPrice, alert.currency)}</span> {/* Use text-foreground */}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Floor:</span> {/* Use text-muted-foreground */}
                    <span className={`font-medium ${
                      alert.currentFloorPrice < alert.targetPrice ? 'text-red-400' : 'text-green-400' // Semantic colors, keep
                    }`}>
                      {formatPrice(alert.currentFloorPrice, alert.currency)}
                    </span>
                  </div>

                  {alert.gasLimit && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Gas Limit:</span> {/* Use text-muted-foreground */}
                      <span className="text-foreground font-medium">{alert.gasLimit} Gwei</span> {/* Use text-foreground */}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Checked:</span> {/* Use text-muted-foreground */}
                    <span className="text-muted-foreground/70 text-sm"> {/* Use text-muted-foreground */}
                      {new Date(alert.lastChecked).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button className="p-2 bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-accent rounded-lg"> {/* Themed icon button */}
                    <Eye size={16} />
                  </button>
                  <button className="p-2 bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-yellow-400 rounded-lg"> {/* Themed icon button, yellow for edit is fine */}
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => removeNftAlert(alert.id)}
                    className="p-2 bg-secondary hover:bg-destructive/80 text-muted-foreground hover:text-destructive-foreground rounded-lg" /* Themed icon button for destructive action */
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