import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Save, Key, Bell, Palette, Shield, AlertTriangle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useAppContext();
  const [activeTab, setActiveTab] = useState('api-keys');
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = async (section: 'apiKeys' | 'notifications' | 'ui') => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateSettings({ [section]: localSettings[section] });
    setSavedMessage(`${section === 'apiKeys' ? 'API Keys' : section === 'notifications' ? 'Notifications' : 'UI Settings'} saved successfully!`);
    setTimeout(() => setSavedMessage(''), 3000);
    setIsSaving(false);
  };

  const tabs = [
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ui', label: 'Interface', icon: Palette },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Mission Settings
        </h1>
        <p className="text-slate-400">Configure your NFT alert system preferences</p>
      </div>

      {/* Success Message */}
      {savedMessage && (
        <div className="bg-green-900/50 border border-green-500/50 rounded-xl p-4 text-center">
          <p className="text-green-400 font-medium">{savedMessage}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
        <div className="flex space-x-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* API Keys Tab */}
      {activeTab === 'api-keys' && (
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Key className="w-5 h-5 mr-2 text-cyan-400" />
              API Keys Management
            </h2>
            <div className="flex items-center space-x-2 text-yellow-400">
              <Shield size={16} />
              <span className="text-sm">Read-only access</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Security Warning */}
            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-medium">Security Notice</p>
                  <p className="text-slate-300 text-sm mt-1">
                    Only use read-only API keys. Never provide keys that allow withdrawals or transactions.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  OpenSea API Key
                </label>
                <input
                  type="password"
                  value={localSettings.apiKeys.opensea}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    apiKeys: { ...localSettings.apiKeys, opensea: e.target.value }
                  })}
                  placeholder="Your OpenSea API key"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                />
                <p className="text-xs text-slate-500 mt-1">For NFT collection data</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Etherscan API Key
                </label>
                <input
                  type="password"
                  value={localSettings.apiKeys.etherscan}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    apiKeys: { ...localSettings.apiKeys, etherscan: e.target.value }
                  })}
                  placeholder="Your Etherscan API key"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                />
                <p className="text-xs text-slate-500 mt-1">For Ethereum gas prices</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Polygonscan API Key
                </label>
                <input
                  type="password"
                  value={localSettings.apiKeys.polygonscan}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    apiKeys: { ...localSettings.apiKeys, polygonscan: e.target.value }
                  })}
                  placeholder="Your Polygonscan API key"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                />
                <p className="text-xs text-slate-500 mt-1">For Polygon gas prices</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  BSCScan API Key
                </label>
                <input
                  type="password"
                  value={localSettings.apiKeys.bscscan}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    apiKeys: { ...localSettings.apiKeys, bscscan: e.target.value }
                  })}
                  placeholder="Your BSCScan API key"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                />
                <p className="text-xs text-slate-500 mt-1">For BNB Chain gas prices</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Solana RPC Endpoint
                </label>
                <input
                  type="text"
                  value={localSettings.apiKeys.solana}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    apiKeys: { ...localSettings.apiKeys, solana: e.target.value }
                  })}
                  placeholder="https://api.mainnet-beta.solana.com"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                />
                <p className="text-xs text-slate-500 mt-1">For Solana network data</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleSave('apiKeys')}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
              >
                <Save size={20} />
                <span>{isSaving ? 'Saving...' : 'Save API Keys'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-purple-400" />
            Notification Settings
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Telegram Bot Token
                </label>
                <input
                  type="password"
                  value={localSettings.notifications.telegramBotToken}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    notifications: { ...localSettings.notifications, telegramBotToken: e.target.value }
                  })}
                  placeholder="Your Telegram bot token"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Discord Bot Token
                </label>
                <input
                  type="password"
                  value={localSettings.notifications.discordBotToken}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    notifications: { ...localSettings.notifications, discordBotToken: e.target.value }
                  })}
                  placeholder="Your Discord bot token"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Admin Chat ID
                </label>
                <input
                  type="text"
                  value={localSettings.notifications.adminChatId}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    notifications: { ...localSettings.notifications, adminChatId: e.target.value }
                  })}
                  placeholder="Your Telegram chat ID or Discord channel ID"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Notification Types</h3>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div>
                    <span className="text-white font-medium">NFT Floor Price Alerts</span>
                    <p className="text-slate-400 text-sm">Get notified when NFT floor prices change</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.notifications.enableNftAlerts}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      notifications: { ...localSettings.notifications, enableNftAlerts: e.target.checked }
                    })}
                    className="w-5 h-5 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div>
                    <span className="text-white font-medium">Gas Price Alerts</span>
                    <p className="text-slate-400 text-sm">Get notified when gas prices drop below your threshold</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.notifications.enableGasAlerts}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      notifications: { ...localSettings.notifications, enableGasAlerts: e.target.checked }
                    })}
                    className="w-5 h-5 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div>
                    <span className="text-white font-medium">Portfolio Updates</span>
                    <p className="text-slate-400 text-sm">Get notified about changes in your NFT portfolio</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.notifications.enablePortfolioUpdates}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      notifications: { ...localSettings.notifications, enablePortfolioUpdates: e.target.checked }
                    })}
                    className="w-5 h-5 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleSave('notifications')}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
              >
                <Save size={20} />
                <span>{isSaving ? 'Saving...' : 'Save Notifications'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UI Settings Tab */}
      {activeTab === 'ui' && (
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Palette className="w-5 h-5 mr-2 text-pink-400" />
            Interface Customization
          </h2>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div>
                  <span className="text-white font-medium">Dark Mode</span>
                  <p className="text-slate-400 text-sm">Toggle between light and dark themes</p>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.ui.darkMode}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    ui: { ...localSettings.ui, darkMode: e.target.checked }
                  })}
                  className="w-5 h-5 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                />
              </label>

              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-white font-medium">Animation Speed</span>
                    <p className="text-slate-400 text-sm">Adjust the speed of interface animations</p>
                  </div>
                  <span className="text-cyan-400 font-medium">{localSettings.ui.animationSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={localSettings.ui.animationSpeed}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    ui: { ...localSettings.ui, animationSpeed: parseFloat(e.target.value) }
                  })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${((localSettings.ui.animationSpeed - 0.5) / 1.5) * 100}%, rgb(51 65 85) ${((localSettings.ui.animationSpeed - 0.5) / 1.5) * 100}%, rgb(51 65 85) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleSave('ui')}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
              >
                <Save size={20} />
                <span>{isSaving ? 'Saving...' : 'Save Interface'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};