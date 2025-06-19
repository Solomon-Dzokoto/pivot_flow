import React, { useState, useEffect } from 'react';
import { useAppContext, NFTItem } from '../../contexts/AppContext'; // Import NFTItem type
import { LoadingSpinner, LoadingSkeleton } from '../LoadingSpinner';
import { Plus, Wallet, ExternalLink, RefreshCw, Trash2, Eye, Coins, Bitcoin, Zap as ZapIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NftCard } from '../dashboard/widgets/NftCard'; // Import the new NftCard component

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
    isLoading,
    // For token prices
    tokenPrices,
    fetchTokenPrices,
    isLoadingTokenPrices,
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
    // Add more if needed, or use actual image icons later
  };

  // --- Token Balances Logic ---
  interface PortfolioToken {
    id: string; // CoinGecko compatible ID
    symbol: string;
    name: string;
    mockBalance: number;
    icon?: LucideIcon; // Optional: Icon component
    decimals?: number; // For formatting balance
  }

  const mockPortfolioTokens: PortfolioToken[] = [
    { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer', mockBalance: 105.50, icon: Coins, decimals: 2 },
    { id: 'bitcoin', symbol: 'ckBTC', name: 'Chain-Key Bitcoin', mockBalance: 0.05, icon: Bitcoin, decimals: 8 }, // Assuming 'bitcoin' for ckBTC price
    { id: 'xtc', symbol: 'XTC', name: 'Cycles Token', mockBalance: 2500000, icon: ZapIcon, decimals: 0 }, // No direct price for XTC, usually pegged or derived
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', mockBalance: 1.5, icon: blockchainIcons['Ethereum'] ? undefined : undefined, decimals: 4 }, // Use text icon if no Lucide one
    { id: 'solana', symbol: 'SOL', name: 'Solana', mockBalance: 25.0, icon: blockchainIcons['Solana'] ? undefined : undefined, decimals: 2 },
    // Add more mock tokens if desired e.g. STX (Stacks) if coingecko id is 'blockstack'
    // { id: 'blockstack', symbol: 'STX', name: 'Stacks', mockBalance: 500, icon: Layers /*Example*/, decimals: 0 },

  ];

  // Coingecko IDs for fetching prices
  const targetTokenIds = mockPortfolioTokens.map(token => token.id).filter(id => id !== 'xtc'); // XTC doesn't have a direct CoinGecko price usually

  useEffect(() => {
    if (targetTokenIds.length > 0) {
      fetchTokenPrices(targetTokenIds);
    }
  }, []); // Fetch on mount

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-theme-accent via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Portfolio Overview
        </h1>
        <p className="text-muted-foreground">Manage your wallets, tokens, and NFTs across chains.</p>
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
        <div className="bg-card/70 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl smooth-appear"> {/* Use theme colors, ADDED smooth-appear */}
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
              Token Balances
            </h2>
            {isLoadingTokenPrices && targetTokenIds.length > 0 && (
              <div className="flex justify-center items-center py-8">
                <LoadingSpinner />
                <p className="ml-2 text-muted-foreground">Loading token prices...</p>
              </div>
            )}
            <div className="space-y-4">
              {mockPortfolioTokens.map((token) => {
                const livePrice = tokenPrices[token.id];
                const usdValue = livePrice !== null && livePrice !== undefined ? token.mockBalance * livePrice : null;
                const TokenIcon = token.icon;
                const displayBalance = token.decimals !== undefined
                                     ? token.mockBalance.toFixed(token.decimals)
                                     : token.mockBalance.toLocaleString();

                return (
                  <div key={token.id} className="bg-card border-border p-4 rounded-lg hover:border-accent/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        {TokenIcon && <TokenIcon className="w-6 h-6 text-accent" />}
                        {!TokenIcon && blockchainIcons[token.symbol] && <span className="text-2xl p-0 leading-none">{blockchainIcons[token.symbol]}</span>}
                        {!TokenIcon && !blockchainIcons[token.symbol] && <Coins className="w-6 h-6 text-accent" /> }

                        <span className="text-lg font-bold text-foreground">{token.symbol}</span>
                      </div>
                      <span className="text-muted-foreground text-sm text-right">{token.name}</span>
                    </div>
                    <p className="text-2xl font-semibold text-foreground">{displayBalance} {token.symbol}</p>
                    {livePrice !== null && livePrice !== undefined ? (
                      <p className="text-sm text-green-400">${usdValue ? usdValue.toFixed(2) : 'N/A'} USD</p>
                    ) : token.id === 'xtc' ? (
                       <p className="text-sm text-muted-foreground">(Not directly priced)</p>
                    ) : (
                      <p className="text-sm text-muted-foreground animate-pulse">Loading price...</p>
                    )}
                     {livePrice !== null && livePrice !== undefined && token.id !== 'xtc' && (
                       <p className="text-xs text-muted-foreground/80">@ ${livePrice.toFixed(2)}/{token.symbol}</p>
                     )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* NFT Portfolio Grid (remains at the bottom) */}
      <div className="bg-card/50 backdrop-blur-sm border-border rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-purple-400" /> {/* Keep semantic color for now, or change to text-accent */}
          My NFTs ({nftPortfolio.length})
        </h2>

        {isLoading && nftPortfolio.length === 0 ? ( // Show skeleton only if portfolio is empty and loading
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border-border rounded-xl p-4 animate-pulse">
                <div className="aspect-square rounded-lg bg-secondary mb-3"></div>
                <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-secondary rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : nftPortfolio.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-muted-foreground mb-2">No NFTs found in your connected wallets.</p>
            <p className="text-sm text-muted-foreground/70">
              {walletAddresses.length === 0 
                ? "Add a wallet address above to view your NFTs."
                : "Try refreshing your portfolio or check if your wallets contain NFTs."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {nftPortfolio.map((nft) => (
              // Cast nft to the extended type expected by NftCard if NFTItem from context isn't fully updated yet.
              // The NFTItem in AppContext should now have collectionSlug and blockchain.
              <NftCard key={nft.id} nft={nft as NFTItem & { collectionSlug: string; blockchain: string; }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};