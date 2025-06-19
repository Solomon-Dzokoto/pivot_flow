import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { NFTAlert, GasAlert, NetworkFee } from '../../../declarations/PivotFlow_backend/PivotFlow_backend.did';

interface AppState {
  currentView: string;
  nftAlerts: NFTAlert[];
  gasAlerts: GasAlert[];
  networkFees: NetworkFee[];
  canisterCycles: bigint;
  isOperator: boolean;
  actions: {
    setCurrentView: (view: string) => void;
    setNFTAlerts: (alerts: NFTAlert[]) => void;
    setGasAlerts: (alerts: GasAlert[]) => void;
    setNetworkFees: (fees: NetworkFee[]) => void;
    setCanisterCycles: (cycles: bigint) => void;
    setIsOperator: (isOperator: boolean) => void;
  };
}

export const useAppStore = create<AppState>()(
  immer((set) => ({
    currentView: 'dashboard',
    nftAlerts: [],
    gasAlerts: [],
    networkFees: [],
    canisterCycles: BigInt(0),
    isOperator: false,
    actions: {
      setCurrentView: (view) => 
        set((state) => {
          state.currentView = view
        }),
      setNFTAlerts: (alerts) => 
        set((state) => {
          state.nftAlerts = alerts;
        }),
      setGasAlerts: (alerts) => 
        set((state) => {
          state.gasAlerts = alerts;
        }),
      setNetworkFees: (fees) => 
        set((state) => {
          state.networkFees = fees;
        }),
      setCanisterCycles: (cycles) => 
        set((state) => {
          state.canisterCycles = cycles;
        }),
      setIsOperator: (isOperator) => 
        set((state) => {
          state.isOperator = isOperator;
        }),
    },
  }))
);
