import { create } from 'zustand';
import  immer  from 'zustand/middleware/immer';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';

interface AuthState {
  isAuthenticated: boolean;
  principal: Principal | null;
  authClient: AuthClient | null;
  actions: {
    initialize: () => Promise<void>;
    login: () => Promise<void>;
    logout: () => Promise<void>;
  };
}

export const useAuthStore = create<AuthState>()(
  immer((set, get) => ({
    isAuthenticated: false,
    principal: null,
    authClient: null,
    actions: {
      initialize: async () => {
        const authClient = await AuthClient.create();
        set((state) => {
          state.authClient = authClient;
          state.isAuthenticated = authClient.isAuthenticated();
          if (state.isAuthenticated) {
            state.principal = authClient.getIdentity().getPrincipal();
          }
        });
      },
      login: async () => {
        const { authClient } = get();
        if (!authClient) return;

        await new Promise<void>((resolve) => {
          authClient.login({
            identityProvider: process.env.DFX_NETWORK === 'ic' 
              ? 'https://identity.ic0.app'
              : `http://localhost:4943?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}`,
            onSuccess: () => {
              set((state) => {
                state.isAuthenticated = true;
                state.principal = authClient.getIdentity().getPrincipal();
              });
              resolve();
            },
          });
        });
      },
      logout: async () => {
        const { authClient } = get();
        if (!authClient) return;

        await authClient.logout();
        set((state) => {
          state.isAuthenticated = false;
          state.principal = null;
        });
      },
    },
  }))
);
