import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface NFTAlert {
  id: string;
  collectionSlug: string;
  collectionName: string;
  targetPrice: number;
  currency: string;
  alertType: 'drop_below' | 'rise_above' | 'any_change';
  isActive: boolean;
}

interface NFTState {
  alerts: NFTAlert[];
  collections: {
    [slug: string]: {
      name: string;
      floorPrice: number;
      volume24h: number;
      priceHistory: { timestamp: number; price: number }[];
    };
  };
  actions: {
    addAlert: (alert: Omit<NFTAlert, 'id'>) => void;
    removeAlert: (id: string) => void;
    toggleAlert: (id: string) => void;
    updateCollectionData: (
      slug: string,
      data: {
        name: string;
        floorPrice: number;
        volume24h: number;
        pricePoint?: { timestamp: number; price: number };
      }
    ) => void;
  };
}

export const useNFTStore = create<NFTState>()(
  immer((set) => ({
    alerts: [],
    collections: {},
    actions: {
      addAlert: (alert) =>
        set((state) => {
          state.alerts.push({
            ...alert,
            id: Math.random().toString(36).substring(7),
          });
        }),
      removeAlert: (id) =>
        set((state) => {
          state.alerts = state.alerts.filter((alert) => alert.id !== id);
        }),
      toggleAlert: (id) =>
        set((state) => {
          const alert = state.alerts.find((a) => a.id === id);
          if (alert) {
            alert.isActive = !alert.isActive;
          }
        }),
      updateCollectionData: (slug, data) =>
        set((state) => {
          if (!state.collections[slug]) {
            state.collections[slug] = {
              name: data.name,
              floorPrice: data.floorPrice,
              volume24h: data.volume24h,
              priceHistory: [],
            };
          } else {
            state.collections[slug].floorPrice = data.floorPrice;
            state.collections[slug].volume24h = data.volume24h;
          }
          if (data.pricePoint) {
            state.collections[slug].priceHistory.push(data.pricePoint);
          }
        }),
    },
  }))
);
