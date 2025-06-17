import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { LoadingSpinner, LoadingSkeleton } from '../LoadingSpinner';
import { Plus, Wallet, ExternalLink, RefreshCw, Trash2, Eye } from 'lucide-react';

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

  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletForm.address) return;

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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTotalValue = () => {
    return nftPortfolio.reduce((sum, nft) => sum + nft.floorPrice, 0);
  };

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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          NFT Portfolio
        </h1>
        <p className="text-slate-400">Manage your cross-chain NFT collection</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total NFTs</p>
              <p className="text-3xl font-bold text-white">{nftPortfolio.length}</p>
            </div>
            <div className="p-3 bg-cyan-500/20 rounded-xl">
              <Eye className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Value</p>
              <p className="text-3xl font-bold text-white">{getTotalValue().toFixed(2)} ETH</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Wallet className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Connected Wallets</p>
              <p className="text-3xl font-bold text-white">{walletAddresses.length}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Plus className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setShowAddWalletForm(!showAddWalletForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Plus size={20} />
          <span>Add Wallet</span>
        </button>
        
        <button
          onClick={() => refreshPortfolio()}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : <RefreshCw size={20} />}
          <span>Refresh Portfolio</span>
        </button>
      </div>

      {/* Add Wallet Form */}
      {showAddWalletForm && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Add Wallet Address</h2>
          
          <form onSubmit={handleWalletSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Wallet Address *
              </label>
              <input
                type="text"
                value={walletForm.address}
                onChange={(e) => setWalletForm({ ...walletForm, address: e.target.value })}
                placeholder="0x... or public address"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Blockchain *
              </label>
              <select
                value={walletForm.blockchain}
                onChange={(e) => setWalletForm({ ...walletForm, blockchain: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
                <option value="BNB Chain">BNB Chain</option>
                <option value="Solana">Solana</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Label (Optional)
              </label>
              <input
                type="text"
                value={walletForm.label}
                onChange={(e) => setWalletForm({ ...walletForm, label: e.target.value })}
                placeholder="e.g., Main Wallet, Trading Wallet"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
              />
            </div>

            <div className="md:col-span-3 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddWalletForm(false)}
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
              >
                <span>Add Wallet</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Connected Wallets */}
      {walletAddresses.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-cyan-400" />
            Connected Wallets ({walletAddresses.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {walletAddresses.map((wallet) => (
              <div
                key={wallet.id}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{blockchainIcons[wallet.blockchain]}</span>
                    <div>
                      <p className="text-white font-medium">
                        {wallet.label || formatAddress(wallet.address)}
                      </p>
                      <p className="text-slate-400 text-sm font-mono">
                        {formatAddress(wallet.address)}
                      </p>
                      <p className="text-slate-500 text-xs">{wallet.blockchain}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeWalletAddress(wallet.id)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NFT Portfolio */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-purple-400" />
          My NFTs ({nftPortfolio.length})
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-4">
                <div className="w-full h-48 bg-slate-700 rounded-xl mb-4 animate-pulse"></div>
                <LoadingSkeleton lines={3} />
              </div>
            ))}
          </div>
        ) : nftPortfolio.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-slate-400 mb-2">No NFTs found</p>
            <p className="text-sm text-slate-500">
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
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-all duration-300 group"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-slate-700">
                  <img
                    src={nft.imageUrl}
                    alt={`${nft.collectionName} ${nft.tokenId}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-white font-semibold truncate">{nft.collectionName}</h3>
                  <p className="text-slate-400 text-sm">{nft.tokenId}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Floor Price</p>
                      <p className="text-green-400 font-bold">
                        {nft.floorPrice.toFixed(2)} {nft.currency}
                      </p>
                    </div>
                    <a
                      href={nft.marketplaceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-400 hover:text-cyan-400 rounded-lg transition-all duration-300"
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