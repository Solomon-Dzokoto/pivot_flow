import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Types
export interface NFTAlert {
  id: string;
  collectionSlug: string;
  collectionName: string;
  targetPrice: number;
  currency: string;
  alertType: 'drop_below' | 'rise_above' | 'any_change';
  gasLimit?: number;
  percentageChange?: number;
  currentFloorPrice: number;
  lastChecked: string;
  isActive: boolean;
}

export interface GasAlert {
  id: string;
  blockchain: string;
  maxGwei: number;
  priorityTier: 'fast' | 'standard' | 'slow';
  isActive: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'nft_alert' | 'gas_alert' | 'portfolio_update';
  message: string;
  timestamp: string;
  blockchain?: string;
}

export interface NetworkFee {
  blockchain: string;
  icon: string;
  fast: { gwei: number; usd: number };
  standard: { gwei: number; usd: number };
  slow: { gwei: number; usd: number };
}

export interface NFTItem {
  id: string; // Unique ID for the NFT item itself (e.g., principal_tokenid)
  collectionSlug: string; // For API calls, e.g., "boredapeyachtclub"
  collectionName: string;
  tokenId?: string; // Some NFTs might be collection offers, not specific tokens
  imageUrl: string;
  // floorPrice: number; // This will now be fetched dynamically, remove from static item data
  currency: string; // Default currency for display, e.g. ETH, SOL
  blockchain: string; // e.g., "Ethereum", "Solana"
  marketplaceUrl: string;
}

export interface WalletAddress {
  id: string;
  address: string;
  blockchain: string;
  label?: string;
}

export interface AppSettings {
  apiKeys: {
    opensea: string;
    etherscan: string;
    polygonscan: string;
    bscscan: string;
    solana: string;
  };
  notifications: {
    telegramBotToken: string;
    discordBotToken: string;
    adminChatId: string;
    enableNftAlerts: boolean;
    enableGasAlerts: boolean;
    enablePortfolioUpdates: boolean;
  };
  ui: {
    darkMode: boolean;
    animationSpeed: number;
  };
}

interface AppContextType {
  // Navigation
  currentView: string;
  setCurrentView: (view: string) => void;
  
  // NFT Alerts
  nftAlerts: NFTAlert[];
  addNftAlert: (alert: Omit<NFTAlert, 'id' | 'lastChecked' | 'isActive'>) => void;
  removeNftAlert: (id: string) => void;
  updateNftAlert: (id: string, updates: Partial<NFTAlert>) => void;
  
  // Gas Alerts
  gasAlerts: GasAlert[];
  addGasAlert: (alert: Omit<GasAlert, 'id' | 'isActive'>) => void;
  removeGasAlert: (id: string) => void;
  
  // Network Fees
  networkFees: NetworkFee[];
  refreshNetworkFees: () => Promise<void>;
  
  // Portfolio
  walletAddresses: WalletAddress[];
  nftPortfolio: NFTItem[];
  addWalletAddress: (address: Omit<WalletAddress, 'id'>) => void;
  removeWalletAddress: (id: string) => void;
  refreshPortfolio: () => Promise<void>;
  
  // Activity
  recentActivity: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id'>) => void;
  
  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  // UI State
  isLoading: boolean;
  errorMessage: string | null;
  setError: (error: string | null) => void;
  
  // Canister Info (for operator)
  canisterCycles: bigint | null;
  canisterMemory: bigint | null;
  icpPrice: number | null;
  tokenPrices: Record<string, number | null>;
  isLoadingTokenPrices: boolean;
  nftFloorPrices: Record<string, { price: number | null; isLoading: boolean; error?: string }>; // For NFT floor prices
  isOperator: boolean;
  fetchCanisterCycles: () => Promise<void>;
  fetchCanisterMemory: () => Promise<void>;
  fetchICPPrice: () => Promise<void>;
  fetchTokenPrices: (tokenIds: string[]) => Promise<void>;
  fetchNftFloorPrice: (collectionSlug: string, blockchain: string) => Promise<void>; // New fetcher
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Mock data
const mockNftAlerts: NFTAlert[] = [
  {
    id: '1',
    collectionSlug: 'boredapeyachtclub',
    collectionName: 'Bored Ape Yacht Club',
    targetPrice: 20,
    currency: 'ETH',
    alertType: 'drop_below',
    gasLimit: 30,
    currentFloorPrice: 24.5,
    lastChecked: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '2',
    collectionSlug: 'azuki',
    collectionName: 'Azuki',
    targetPrice: 8,
    currency: 'ETH',
    alertType: 'rise_above',
    currentFloorPrice: 6.2,
    lastChecked: new Date().toISOString(),
    isActive: true,
  },
];

const mockNetworkFees: NetworkFee[] = [
  {
    blockchain: 'Ethereum',
    icon: '⟠',
    fast: { gwei: 45, usd: 15.20 },
    standard: { gwei: 35, usd: 11.80 },
    slow: { gwei: 25, usd: 8.40 },
  },
  {
    blockchain: 'Polygon',
    icon: '⬢',
    fast: { gwei: 40, usd: 0.02 },
    standard: { gwei: 30, usd: 0.015 },
    slow: { gwei: 20, usd: 0.01 },
  },
  {
    blockchain: 'BNB Chain',
    icon: '●',
    fast: { gwei: 5, usd: 0.50 },
    standard: { gwei: 3, usd: 0.30 },
    slow: { gwei: 1, usd: 0.10 },
  },
  {
    blockchain: 'Solana',
    icon: '◈',
    fast: { gwei: 0, usd: 0.0025 },
    standard: { gwei: 0, usd: 0.00125 },
    slow: { gwei: 0, usd: 0.0005 },
  },
];

const mockNftPortfolio: NFTItem[] = [
  {
    id: 'coolcats_1337',
    collectionSlug: 'cool-cats', // Example slug
    collectionName: 'Cool Cats',
    tokenId: '#1337',
    imageUrl: 'https://i.seadn.io/gcs/files/2aूं918DMACI9ERW_sfZ33J9F4BPS_ADhJ0xYd9705s/cool%20cats%20nft.jpg?auto=format&dpr=1&w=384', // Example real image
    currency: 'ETH',
    blockchain: 'Ethereum',
    marketplaceUrl: 'https://opensea.io/collection/cool-cats-nft',
  },
  {
    id: 'doodles_4269',
    collectionSlug: 'doodles-official', // Example slug
    collectionName: 'Doodles',
    tokenId: '#4269',
    imageUrl: 'https://i.seadn.io/gcs/files/1a659012c323db0997900afa04169186.gif?auto=format&dpr=1&w=384', // Example real image
    currency: 'ETH',
    blockchain: 'Ethereum',
    marketplaceUrl: 'https://opensea.io/collection/doodles-official',
  },
  {
    id: 'degods_123',
    collectionSlug: 'degods', // Example slug for a Solana collection
    collectionName: 'DeGods',
    tokenId: '#123',
    imageUrl: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeidhz29vlpp5aukqtoz4ulo52acvrz2pyk5tq43t6u7b75xosbyrpu.ipfs.nftstorage.link/', // Example real image
    currency: 'SOL',
    blockchain: 'Solana',
    marketplaceUrl: 'https://magiceden.io/marketplace/degods',
  }
];

const mockActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'nft_alert',
    message: 'BAYC floor hit 25 ETH (Gas: 30 Gwei)',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'gas_alert',
    message: 'ETH gas dropped to 20 Gwei',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'portfolio_update',
    message: 'New NFT detected in wallet: Cool Cats #1337',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, principal } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [nftAlerts, setNftAlerts] = useState<NFTAlert[]>([]);
  const [gasAlerts, setGasAlerts] = useState<GasAlert[]>([]);
  const [networkFees, setNetworkFees] = useState<NetworkFee[]>(mockNetworkFees);
  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([]);
  const [nftPortfolio, setNftPortfolio] = useState<NFTItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Canister Info State
  const [canisterCycles, setCanisterCycles] = useState<bigint | null>(null);
  const [canisterMemory, setCanisterMemory] = useState<bigint | null>(null);
  const [icpPrice, setIcpPrice] = useState<number | null>(null);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number | null>>({});
  const [isLoadingTokenPrices, setIsLoadingTokenPrices] = useState<boolean>(false);
  const [nftFloorPrices, setNftFloorPrices] = useState<Record<string, { price: number | null; isLoading: boolean; error?: string }>>({});
  const [isOperator] = useState(true); // Mock operator status, can be fetched later

  const [settings, setSettings] = useState<AppSettings>({
    apiKeys: {
      opensea: '',
      etherscan: '',
      polygonscan: '',
      bscscan: '',
      solana: '',
    },
    notifications: {
      telegramBotToken: '',
      discordBotToken: '',
      adminChatId: '',
      enableNftAlerts: true,
      enableGasAlerts: true,
      enablePortfolioUpdates: true,
    },
    ui: {
      darkMode: true,
      animationSpeed: 1,
    },
  });

  // Load user data when authenticated
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      if (isAuthenticated && principal && isMounted) {
        try {
          setIsLoading(true);
          // Load user-specific data
          await loadUserData();

          // Load canister/global data
          await fetchCanisterCycles();
          await fetchCanisterMemory();
          await fetchICPPrice();

          if (isMounted) { // Re-check isMounted after async operations
            addActivity({
              type: 'portfolio_update',
              message: `Welcome back! Logged in with principal: ${principal?.slice(0, 8)}...`,
              timestamp: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Failed to load initial data:', error);
          if (isMounted) {
            setError('Failed to load user data');
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else if (isMounted) { // Clear data if not authenticated
        clearUserData();
        setCanisterCycles(null);
        setCanisterMemory(null);
        setIcpPrice(null);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, principal]); // Dependencies for initial load

  const loadUserData = async () => {
    // This function can remain focused on user-specific data like alerts, wallets
    // For now, using mock data as before.
    // setIsLoading(true); // Handled by loadInitialData
    try {
      // TODO: Replace with actual ICP canister calls for user data
      setNftAlerts(mockNftAlerts);
      setNftPortfolio(mockNftPortfolio);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Failed to load user data:', error);
      setError('Failed to load user data');
    }
    // setIsLoading(false); // Handled by loadInitialData
  };

  const clearUserData = () => { // Clears only user-specific data
    setNftAlerts([]);
    setGasAlerts([]);
    setWalletAddresses([]);
    setNftPortfolio([]);
    setRecentActivity([]);
    setCurrentView('dashboard');
  };

  // Simulate real-time updates
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    const interval = setInterval(() => {
      if (!isMounted) return;

      setNetworkFees(prev => prev.map(fee => ({
        ...fee,
        fast: { ...fee.fast, gwei: Math.max(1, fee.fast.gwei + (Math.random() - 0.5) * 10) },
        standard: { ...fee.standard, gwei: Math.max(1, fee.standard.gwei + (Math.random() - 0.5) * 5) },
        slow: { ...fee.slow, gwei: Math.max(1, fee.slow.gwei + (Math.random() - 0.5) * 2) }
      })));
      
      setNftAlerts(prev => prev.map(alert => ({
        ...alert,
        currentFloorPrice: Math.max(0.1, alert.currentFloorPrice + (Math.random() - 0.5) * 2),
        lastChecked: new Date().toISOString(),
      })));
    }, 30000); // Update every 30 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const addNftAlert = async (alert: Omit<NFTAlert, 'id' | 'lastChecked' | 'isActive'>) => {
    try {
      // TODO: Replace with actual ICP canister call
      // await canisterActor.addNftAlert(principal, alert);
      
      const newAlert: NFTAlert = {
        ...alert,
        id: Date.now().toString(),
        lastChecked: new Date().toISOString(),
        isActive: true,
      };
      setNftAlerts(prev => [...prev, newAlert]);
      addActivity({
        type: 'nft_alert',
        message: `New NFT alert created for ${alert.collectionName}`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to add NFT alert:', error);
      setError('Failed to create NFT alert');
    }
  };

  const removeNftAlert = async (id: string) => {
    try {
      // TODO: Replace with actual ICP canister call
      // await canisterActor.removeNftAlert(principal, id);
      
      setNftAlerts(prev => prev.filter(alert => alert.id !== id));
    } catch (error) {
      console.error('Failed to remove NFT alert:', error);
      setError('Failed to remove NFT alert');
    }
  };

  const updateNftAlert = async (id: string, updates: Partial<NFTAlert>) => {
    try {
      // TODO: Replace with actual ICP canister call
      // await canisterActor.updateNftAlert(principal, id, updates);
      
      setNftAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, ...updates } : alert
      ));
    } catch (error) {
      console.error('Failed to update NFT alert:', error);
      setError('Failed to update NFT alert');
    }
  };

  const addGasAlert = async (alert: Omit<GasAlert, 'id' | 'isActive'>) => {
    try {
      // TODO: Replace with actual ICP canister call
      // await canisterActor.addGasAlert(principal, alert);
      
      const newAlert: GasAlert = {
        ...alert,
        id: Date.now().toString(),
        isActive: true,
      };
      setGasAlerts(prev => [...prev, newAlert]);
      addActivity({
        type: 'gas_alert',
        message: `New gas alert created for ${alert.blockchain}`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to add gas alert:', error);
      setError('Failed to create gas alert');
    }
  };

  const removeGasAlert = async (id: string) => {
    try {
      // TODO: Replace with actual ICP canister call
      // await canisterActor.removeGasAlert(principal, id);
      
      setGasAlerts(prev => prev.filter(alert => alert.id !== id));
    } catch (error) {
      console.error('Failed to remove gas alert:', error);
      setError('Failed to remove gas alert');
    }
  };

  const refreshNetworkFees = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual ICP canister call
      // const fees = await canisterActor.getNetworkFees();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNetworkFees(mockNetworkFees.map(fee => ({
        ...fee,
        fast: { ...fee.fast, gwei: Math.max(1, fee.fast.gwei + (Math.random() - 0.5) * 20) },
        standard: { ...fee.standard, gwei: Math.max(1, fee.standard.gwei + (Math.random() - 0.5) * 15) },
        slow: { ...fee.slow, gwei: Math.max(1, fee.slow.gwei + (Math.random() - 0.5) * 10) },
      })));
    } catch (error) {
      console.error('Failed to refresh network fees:', error);
      setErrorMessage('Failed to refresh network fees');
    } finally {
      setIsLoading(false);
    }
  };

  const addWalletAddress = async (address: Omit<WalletAddress, 'id'>) => {
    try {
      // TODO: Replace with actual ICP canister call
      // await canisterActor.addWalletAddress(principal, address);
      
      const newAddress: WalletAddress = {
        ...address,
        id: Date.now().toString(),
      };
      setWalletAddresses(prev => [...prev, newAddress]);
    } catch (error) {
      console.error('Failed to add wallet address:', error);
      setError('Failed to add wallet address');
    }
  };

  const removeWalletAddress = async (id: string) => {
    try {
      // TODO: Replace with actual ICP canister call
      // await canisterActor.removeWalletAddress(principal, id);
      
      setWalletAddresses(prev => prev.filter(addr => addr.id !== id));
    } catch (error) {
      console.error('Failed to remove wallet address:', error);
      setError('Failed to remove wallet address');
    }
  };

  const refreshPortfolio = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual ICP canister call
      // const portfolio = await canisterActor.refreshPortfolio(principal);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setNftPortfolio(mockNftPortfolio);
    } catch (error) {
      console.error('Failed to refresh portfolio:', error);
      setErrorMessage('Failed to refresh portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  const addActivity = (activity: Omit<ActivityItem, 'id'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: Date.now().toString(),
    };
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]); // Keep last 10
  };

  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      // TODO: Replace with actual ICP canister call
      // await canisterActor.updateSettings(principal, updates);
      
      setSettings(prev => ({
        ...prev,
        ...updates,
        apiKeys: { ...prev.apiKeys, ...updates.apiKeys },
        notifications: { ...prev.notifications, ...updates.notifications },
        ui: { ...prev.ui, ...updates.ui },
      }));
    } catch (error) {
      console.error('Failed to update settings:', error);
      setError('Failed to update settings');
    }
  };

  const setError = (error: string | null) => {
    setErrorMessage(error);
    if (error) {
      setTimeout(() => setErrorMessage(null), 5000); // Auto-clear after 5 seconds
    }
  };

  // --- New Fetcher Functions ---
  const fetchCanisterCycles = async () => {
    try {
      const cycles = await canisterClient.getCycles();
      setCanisterCycles(cycles);
    } catch (err) {
      console.error("Failed to fetch canister cycles:", err);
      setError("Failed to load canister cycles.");
      setCanisterCycles(null);
    }
  };

  const fetchCanisterMemory = async () => {
    try {
      const memory = await canisterClient.getCanisterMemoryUsage();
      setCanisterMemory(memory);
    } catch (err) {
      console.error("Failed to fetch canister memory:", err);
      setError("Failed to load canister memory usage.");
      setCanisterMemory(null);
    }
  };

  const fetchICPPrice = async () => {
    try {
      const price = await canisterClient.getICPPrice();
      setIcpPrice(price);
    } catch (err) {
      console.error("Failed to fetch ICP price:", err);
      setIcpPrice(null);
    }
  };

  const fetchTokenPrices = async (tokenIds: string[]) => {
    if (tokenIds.length === 0) return;
    setIsLoadingTokenPrices(true);
    try {
      const pricesData = await canisterClient.getAltcoinPrices(tokenIds);
      if (pricesData) {
        const newPrices: Record<string, number | null> = {};
        for (const tokenPrice of pricesData) {
          newPrices[tokenPrice.id] = tokenPrice.current_price;
        }
        setTokenPrices(prev => ({ ...prev, ...newPrices }));
      } else {
        // Handle case where backend returns null (e.g. API error)
        tokenIds.forEach(id => setTokenPrices(prev => ({...prev, [id]: null})));
      }
    } catch (err) {
      console.error("Failed to fetch altcoin prices:", err);
      tokenIds.forEach(id => setTokenPrices(prev => ({...prev, [id]: null})));
      // Optionally set a specific error message for token prices
    } finally {
      setIsLoadingTokenPrices(false);
    }
  };

  const fetchNftFloorPrice = async (collectionSlug: string, blockchain: string) => {
    const key = `${collectionSlug}_${blockchain}`;
    setNftFloorPrices(prev => ({ ...prev, [key]: { price: prev[key]?.price ?? null, isLoading: true, error: undefined } }));
    try {
      const price = await canisterClient.getNftFloorPrice(collectionSlug, blockchain);
      setNftFloorPrices(prev => ({ ...prev, [key]: { price: price, isLoading: false } }));
    } catch (err) {
      console.error(`Failed to fetch floor price for ${collectionSlug} on ${blockchain}:`, err);
      setNftFloorPrices(prev => ({ ...prev, [key]: { price: null, isLoading: false, error: 'Failed to fetch price' } }));
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        nftAlerts,
        addNftAlert,
        removeNftAlert,
        updateNftAlert,
        gasAlerts,
        addGasAlert,
        removeGasAlert,
        networkFees,
        refreshNetworkFees,
        walletAddresses,
        nftPortfolio,
        addWalletAddress,
        removeWalletAddress,
        refreshPortfolio,
        recentActivity,
        addActivity,
        settings,
        updateSettings,
        isLoading,
        errorMessage,
        setError,
        canisterCycles,
        canisterMemory,
        icpPrice,
        tokenPrices,
        isLoadingTokenPrices,
        nftFloorPrices, // Added
        isOperator,
        fetchCanisterCycles,
        fetchCanisterMemory,
        fetchICPPrice,
        fetchTokenPrices,
        fetchNftFloorPrice, // Added
      }}
    >
      {children}
    </AppContext.Provider>
  );
};