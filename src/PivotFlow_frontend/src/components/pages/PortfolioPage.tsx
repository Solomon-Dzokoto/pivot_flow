import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { LoadingSpinner, LoadingSkeleton } from '../LoadingSpinner';
import { Plus, Wallet, ExternalLink, RefreshCw, Trash2, Eye } from 'lucide-react';

/**
 * @page PortfolioPage
 * @description Manages and displays user's NFT portfolio, connected wallets, and token balances.
 * Allows users to add/remove wallets, refresh portfolio data, and view their NFTs.
 * Token balances are currently mocked.
 * @returns {React.ReactElement} The rendered portfolio management page.
 */
export const PortfolioPage: React.FC = () => {
  const { 
    walletAddresses, 
    nftPortfolio, 
    addWalletAddress, 
    removeWalletAddress, 
    refreshPortfolio, 
    isLoading 
  } = useAppContext();

  const [showAddWalletForm, setShowAddWalletForm] = useState(false);
  const [walletForm, setWalletForm] = useState({
    address: '',
    blockchain: 'Ethereum',
    label: '',
  });

  /**
   * Handles the submission of the "Add Wallet" form.
   * Validates input and calls the context function to add a wallet.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletForm.address) return; // Basic validation

    addWalletAddress({
      address: walletForm.address,
      blockchain: walletForm.blockchain,
      label: walletForm.label || undefined,
    });

    setWalletForm({
      address: '',
      blockchain: 'Ethereum',
      label: '',
    });
    setShowAddWalletForm(false);
  };

  /**
   * Formats a blockchain address for concise display.
   * @param {string} address - The full blockchain address.
   * @returns {string} A shortened version of the address (e.g., "0x123...abcd").
   */
  const formatAddress = (address: string): string => {
    if (address.length < 10) return address; // Avoid errors on very short strings
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  /**
   * Calculates the total estimated value of all NFTs in the portfolio.
   * (Currently sums up floor prices in ETH, assuming all are ETH based for mock).
   * @returns {number} The total estimated value.
   */
  const getTotalValue = (): number => {
    return nftPortfolio.reduce((sum, nft) => sum + nft.floorPrice, 0);
  };

  /**
   * Provides simple text icons for different blockchains.
   * In a real app, these could be SVG components or image URLs.
   */
  const blockchainIcons: { [key: string]: string } = {
    'Ethereum': '⟠',
    'Polygon': '⬢',
    'BNB Chain': '●',
    'Solana': '◈',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-theme-accent via-purple-400 to-pink-400 bg-clip-text text-transparent"> {/* Use theme-accent */}
          NFT Portfolio
        </h1>
        <p className="text-muted-foreground">Manage your cross-chain NFT collection</p> {/* Use text-muted-foreground */}
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card/70 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl"> {/* Use theme colors */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total NFTs</p> {/* Use theme text */}
              <p className="text-3xl font-bold text-foreground">{nftPortfolio.length}</p> {/* Use theme text */}
            </div>
            <div className="p-3 bg-theme-accent/20 rounded-xl"> {/* Use theme-accent */}
              <Eye className="w-6 h-6 text-accent" /> {/* Use theme-accent */}
            </div>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl"> {/* Use theme colors */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Value</p> {/* Use theme text */}
              <p className="text-3xl font-bold text-foreground">{getTotalValue().toFixed(2)} ETH</p> {/* Use theme text */}
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl"> {/* Keep semantic color */}
              <Wallet className="w-6 h-6 text-green-400" /> {/* Keep semantic color */}
            </div>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl"> {/* Use theme colors */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Connected Wallets</p> {/* Use theme text */}
              <p className="text-3xl font-bold text-foreground">{walletAddresses.length}</p> {/* Use theme text */}
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl"> {/* Keep semantic color */}
              <Plus className="w-6 h-6 text-purple-400" /> {/* Keep semantic color */}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setShowAddWalletForm(!showAddWalletForm)}
          className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-accent/25" /* Themed button */
        >
          <Plus size={20} />
          <span>Add Wallet</span>
        </button>
        
        <button
          onClick={() => refreshPortfolio()}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-2xl font-medium shadow-lg disabled:opacity-50" /* Themed button */
        >
          {isLoading ? <LoadingSpinner size="sm" /> : <RefreshCw size={20} />}
          <span>Refresh Portfolio</span>
        </button>
      </div>

      {/* Add Wallet Form */}
      {showAddWalletForm && (
        <div className="bg-card/70 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl"> {/* Use theme colors */}
          <h2 className="text-xl font-semibold text-foreground mb-6">Add Wallet Address</h2> {/* Use theme text */}
          
          <form onSubmit={handleWalletSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2"> {/* Use theme text */}
                Wallet Address *
              </label>
              <input
                type="text"
                value={walletForm.address}
                onChange={(e) => setWalletForm({ ...walletForm, address: e.target.value })}
                placeholder="0x... or public address"
                className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Theme input */
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2"> {/* Use theme text */}
                Blockchain *
              </label>
              <select
                value={walletForm.blockchain}
                onChange={(e) => setWalletForm({ ...walletForm, blockchain: e.target.value })}
                className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground focus:ring-ring focus:border-accent" /* Theme select */
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
                <option value="BNB Chain">BNB Chain</option>
                <option value="Solana">Solana</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-foreground mb-2"> {/* Use theme text */}
                Label (Optional)
              </label>
              <input
                type="text"
                value={walletForm.label}
                onChange={(e) => setWalletForm({ ...walletForm, label: e.target.value })}
                placeholder="e.g., Main Wallet, Trading Wallet"
                className="w-full bg-input border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-accent" /* Theme input */
              />
            </div>

            <div className="md:col-span-3 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddWalletForm(false)}
                className="px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl" /* Theme button */
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl font-medium" /* Theme button */
              >
                <span>Add Wallet</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content Area - Using Flex for two columns on larger screens */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Connected Wallets & Add Wallet Form (if not shown above actions) */}
        <div className="lg:w-1/2 space-y-8">
          {walletAddresses.length > 0 && (
            <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                <Wallet className="w-5 h-5 mr-2 text-accent" />
                Connected Wallets ({walletAddresses.length})
              </h2>
              <div className="space-y-4"> {/* Changed from grid to space-y for a list feel */}
                {walletAddresses.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="bg-card border-border rounded-xl p-4 hover:border-accent/50 transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl p-2 bg-secondary/50 rounded-md">{blockchainIcons[wallet.blockchain] || '🔗'}</span>
                      <div>
                        <p className="text-foreground font-medium">
                          {wallet.label || formatAddress(wallet.address)}
                        </p>
                        <p className="text-muted-foreground text-sm font-mono">
                          {formatAddress(wallet.address)}
                        </p>
                        <p className="text-muted-foreground/70 text-xs">{wallet.blockchain}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeWalletAddress(wallet.id)}
                      className="p-2 text-muted-foreground hover:text-destructive-foreground hover:bg-destructive/20 rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Token Balances */}
        <div className="lg:w-1/2 space-y-8">
          <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              {/* Placeholder icon, replace with a suitable one like 'Coins' or 'Briefcase' from lucide-react */}
              <Wallet className="w-5 h-5 mr-2 text-accent" />
              Token Balances (Mocked)
            </h2>
            <div className="space-y-4">
              {/* ICP */}
              <div className="bg-card border-border p-4 rounded-lg hover:border-accent/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {/* <img src="/icp-logo.svg" alt="ICP Logo" className="w-6 h-6"/> Placeholder for actual logo */}
                    <span className="text-lg font-bold text-foreground">ICP</span>
                  </div>
                  <span className="text-muted-foreground text-sm">Internet Computer</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">105.50 ICP</p>
                <p className="text-sm text-green-400">$1,280.70 USD</p>
              </div>
              {/* XTC */}
              <div className="bg-card border-border p-4 rounded-lg hover:border-accent/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-foreground">XTC</span>
                  </div>
                  <span className="text-muted-foreground text-sm">Cycles Token</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">2,500,000 XTC</p>
                <p className="text-sm text-green-400">$3.50 USD</p>
              </div>
              {/* ckBTC */}
              <div className="bg-card border-border p-4 rounded-lg hover:border-accent/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-foreground">ckBTC</span>
                  </div>
                  <span className="text-muted-foreground text-sm">Chain-Key Bitcoin</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">0.05 ckBTC</p>
                <p className="text-sm text-green-400">$2,100.00 USD</p>
              </div>
               {/* Placeholder for more tokens */}
               <div className="text-center mt-4">
                <p className="text-xs text-muted-foreground">More tokens coming soon...</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Portfolio Grid (remains at the bottom) */}
      <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl"> {/* Use theme colors */}
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center"> {/* Use theme text */}
          <Eye className="w-5 h-5 mr-2 text-purple-400" /> {/* Keep semantic color */}
          My NFTs ({nftPortfolio.length})
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card/80 rounded-xl p-4"> {/* Theme skeleton */}
                <div className="w-full h-48 bg-secondary rounded-xl mb-4 animate-pulse"></div> {/* Theme skeleton */}
                <LoadingSkeleton lines={3} />
              </div>
            ))}
          </div>
        ) : nftPortfolio.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-muted-foreground mb-2">No NFTs found</p> {/* Use theme text */}
            <p className="text-sm text-muted-foreground/70"> {/* Use theme text */}
              {walletAddresses.length === 0 
                ? "Add a wallet address to view your NFTs"
                : "Refresh your portfolio or add more wallets"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nftPortfolio.map((nft) => (
              <div
                key={nft.id}
                className="bg-card border-border rounded-xl p-4 hover:border-accent/50 transition-all duration-300 group" /* Theme item */
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-secondary"> {/* Theme image bg */}
                  <img
                    src={nft.imageUrl}
                    alt={`${nft.collectionName} ${nft.tokenId}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-foreground font-semibold truncate">{nft.collectionName}</h3> {/* Use theme text */}
                  <p className="text-muted-foreground text-sm">{nft.tokenId}</p> {/* Use theme text */}
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground/70">Floor Price</p> {/* Use theme text */}
                      <p className="text-green-400 font-bold"> {/* Semantic color, keep */}
                        {nft.floorPrice.toFixed(2)} {nft.currency}
                      </p>
                    </div>
                    <a
                      href={nft.marketplaceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-accent rounded-lg" /* Themed icon button */
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};