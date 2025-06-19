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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-theme-accent via-purple-400 to-pink-400 bg-clip-text text-transparent"> {/* Use theme-accent */}
          Mission Settings
        </h1>
        <p className="text-muted-foreground">Configure your NFT alert system preferences</p> {/* Use text-muted-foreground */}
      </div>

      {/* Success Message */}
      {savedMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center"> {/* Themed success message */}
          <p className="text-green-400 font-medium">{savedMessage}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-2 shadow-2xl"> {/* Use theme colors */}
        <div className="flex space-x-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === id
                  ? 'bg-primary text-primary-foreground shadow-lg' // Themed active tab
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80' // Themed inactive tab
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
        <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl"> {/* Use theme colors */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center"> {/* Use theme text */}
              <Key className="w-5 h-5 mr-2 text-accent" /> {/* Use theme-accent */}
              API Keys Management
            </h2>
            <div className="flex items-center space-x-2 text-yellow-400"> {/* Semantic color, keep */}
              <Shield size={16} />
              <span className="text-sm">Read-only access</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Security Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4"> {/* Themed warning */}
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" /> {/* Semantic color */}
                <div>
                  <p className="text-yellow-400 font-medium">Security Notice</p> {/* Semantic color */}
                  <p className="text-foreground/80 text-sm mt-1"> {/* Use theme text */}
                    Only use read-only API keys. Never provide keys that allow withdrawals or transactions.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2"> {/* Use theme text */}
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
                  className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Theme input */
                />
                <p className="text-xs text-muted-foreground mt-1">For NFT collection data</p> {/* Use theme text */}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2"> {/* Use theme text */}
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
                  className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Theme input */
                />
                <p className="text-xs text-muted-foreground mt-1">For Ethereum gas prices</p> {/* Use theme text */}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2"> {/* Use theme text */}
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
                  className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Theme input */
                />
                <p className="text-xs text-muted-foreground mt-1">For Polygon gas prices</p> {/* Use theme text */}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2"> {/* Use theme text */}
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
                  className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Theme input */
                />
                <p className="text-xs text-muted-foreground mt-1">For BNB Chain gas prices</p> {/* Use theme text */}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2"> {/* Use theme text */}
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
                  className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Theme input */
                />
                <p className="text-xs text-muted-foreground mt-1">For Solana network data</p> {/* Use theme text */}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleSave('apiKeys')}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50" /* Keep semantic save button color, ensure text-white is fine */
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
        <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl"> {/* Use theme colors */}
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center"> {/* Use theme text */}
            <Bell className="w-5 h-5 mr-2 text-accent" /> {/* Use theme-accent (was purple) */}
            Notification Settings
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2"> {/* Use theme text */}
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
                  className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Theme input */
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2"> {/* Use theme text */}
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
                  className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Theme input */
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2"> {/* Use theme text */}
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
                  className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Theme input */
                />
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Notification Types</h3> {/* Use theme text */}
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-secondary/70 rounded-xl border-border"> {/* Use theme colors */}
                  <div>
                    <span className="text-foreground font-medium">NFT Floor Price Alerts</span> {/* Use theme text */}
                    <p className="text-muted-foreground text-sm">Get notified when NFT floor prices change</p> {/* Use theme text */}
                  </div>
                  <input /* Standardize checkbox appearance */
                    type="checkbox"
                    checked={localSettings.notifications.enableNftAlerts}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      notifications: { ...localSettings.notifications, enableNftAlerts: e.target.checked }
                    })}
                    className="w-5 h-5 text-accent bg-input border-border rounded focus:ring-ring focus:ring-2"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-secondary/70 rounded-xl border-border"> {/* Use theme colors */}
                  <div>
                    <span className="text-foreground font-medium">Gas Price Alerts</span> {/* Use theme text */}
                    <p className="text-muted-foreground text-sm">Get notified when gas prices drop below your threshold</p> {/* Use theme text */}
                  </div>
                  <input /* Standardize checkbox appearance */
                    type="checkbox"
                    checked={localSettings.notifications.enableGasAlerts}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      notifications: { ...localSettings.notifications, enableGasAlerts: e.target.checked }
                    })}
                    className="w-5 h-5 text-accent bg-input border-border rounded focus:ring-ring focus:ring-2"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-secondary/70 rounded-xl border-border"> {/* Use theme colors */}
                  <div>
                    <span className="text-foreground font-medium">Portfolio Updates</span> {/* Use theme text */}
                    <p className="text-muted-foreground text-sm">Get notified about changes in your NFT portfolio</p> {/* Use theme text */}
                  </div>
                  <input /* Standardize checkbox appearance */
                    type="checkbox"
                    checked={localSettings.notifications.enablePortfolioUpdates}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      notifications: { ...localSettings.notifications, enablePortfolioUpdates: e.target.checked }
                    })}
                    className="w-5 h-5 text-accent bg-input border-border rounded focus:ring-ring focus:ring-2"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleSave('notifications')}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50" /* Keep semantic save button color */
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
        <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl"> {/* Use theme colors */}
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center"> {/* Use theme text */}
            <Palette className="w-5 h-5 mr-2 text-accent" /> {/* Use theme-accent (was pink) */}
            Interface Customization
          </h2>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-secondary/70 rounded-xl border-border"> {/* Use theme colors */}
                <div>
                  <span className="text-foreground font-medium">Dark Mode</span> {/* Use theme text */}
                  <p className="text-muted-foreground text-sm">Toggle between light and dark themes</p> {/* Use theme text */}
                </div>
                <input /* Standardize checkbox appearance */
                  type="checkbox"
                  checked={localSettings.ui.darkMode}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    ui: { ...localSettings.ui, darkMode: e.target.checked }
                  })}
                  className="w-5 h-5 text-accent bg-input border-border rounded focus:ring-ring focus:ring-2"
                />
              </label>

              <div className="p-4 bg-secondary/70 rounded-xl border-border"> {/* Use theme colors */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-foreground font-medium">Animation Speed</span> {/* Use theme text */}
                    <p className="text-muted-foreground text-sm">Adjust the speed of interface animations</p> {/* Use theme text */}
                  </div>
                  <span className="text-accent font-medium">{localSettings.ui.animationSpeed}x</span> {/* Use theme-accent */}
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
                  className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer slider" /* Use bg-input for track */
                  style={{ /* Keep dynamic gradient but use theme colors */
                    background: `linear-gradient(to right, hsl(var(--accent)) 0%, hsl(var(--accent)) ${((localSettings.ui.animationSpeed - 0.5) / 1.5) * 100}%, hsl(var(--input)) ${((localSettings.ui.animationSpeed - 0.5) / 1.5) * 100}%, hsl(var(--input)) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"> {/* Use theme text */}
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
                className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50" /* Keep semantic save button color */
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