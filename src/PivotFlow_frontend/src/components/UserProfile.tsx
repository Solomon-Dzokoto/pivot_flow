import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Copy, Check } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { principal, logout, isLoading } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const formatPrincipal = (principal: string) => {
    if (principal.length <= 12) return principal;
    return `${principal.slice(0, 6)}...${principal.slice(-6)}`;
  };

  const copyPrincipal = async () => {
    if (principal) {
      try {
        await navigator.clipboard.writeText(principal);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy principal:', error);
      }
    }
  };

  const handleLogout = async () => {
    setShowDropdown(false);
    await logout();
  };

  if (!principal) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 rounded-xl px-4 py-2 transition-all duration-300"
      >
        <div className="p-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-white text-sm font-medium hidden sm:inline">
          {formatPrincipal(principal)}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl z-50">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Internet Identity</p>
                <p className="text-slate-400 text-sm">Authenticated</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Principal ID
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-3 py-2">
                  <p className="text-white text-sm font-mono break-all">
                    {principal}
                  </p>
                </div>
                <button
                  onClick={copyPrincipal}
                  className="p-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 rounded-xl transition-all duration-300"
                  title="Copy Principal ID"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};