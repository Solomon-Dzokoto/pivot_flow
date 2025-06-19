import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface FeeInfo {
  gwei: number;
  usd: number;
}

interface NetworkFee {
  blockchain: string;
  icon: string;
  fast: FeeInfo;
  standard: FeeInfo;
  slow: FeeInfo;
  lastUpdated: Date;
}

interface GasAlert {
  id: string;
  blockchain: string;
  maxGwei: number;
  priorityTier: 'fast' | 'standard' | 'slow';
  isActive: boolean;
}

interface GasState {
  networkFees: Record<string, NetworkFee>;
  alerts: GasAlert[];
  actions: {
    updateNetworkFee: (blockchain: string, fee: Omit<NetworkFee, 'blockchain'>) => void;
    addAlert: (alert: Omit<GasAlert, 'id'>) => void;
    removeAlert: (id: string) => void;
    toggleAlert: (id: string) => void;
  };
}

export const useGasStore = create<GasState>()(
  immer((set) => ({
    networkFees: {},
    alerts: [],
    actions: {
      updateNetworkFee: (blockchain, fee) =>
        set((state) => {
          state.networkFees[blockchain] = {
            blockchain,
            ...fee,
          };

          // Check alerts and trigger notifications if needed
          state.alerts.forEach((alert:GasAlert) => {
            if (alert.isActive && alert.blockchain === blockchain) {
              const currentFee = fee[alert.priorityTier].gwei;
              if (currentFee <= alert.maxGwei) {
                // You can dispatch a notification here using the notification store
              }
            }
          });
        }),
      addAlert: (alert) =>
        set((state) => {
          state.alerts.push({
            ...alert,
            id: Math.random().toString(36).substring(7),
          });
        }),
      removeAlert: (id) =>
        set((state) => {
          state.alerts = state.alerts.filter((alert:GasAlert) => alert.id !== id);
        }),
      toggleAlert: (id) =>
        set((state) => {
          const alert = state.alerts.find((a:GasAlert) => a.id === id);
          if (alert) {
            alert.isActive = !alert.isActive;
          }
        }),
    },
  }))
);
