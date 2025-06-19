import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';

export interface AuthState {
  isAuthenticated: boolean;
  identity: Identity | null;
  principal: string | null;
  authClient: AuthClient | null;
}

export class AuthService {
  private static instance: AuthService;
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async init(): Promise<AuthClient> {
    try {
      if (!this.authClient) {
        console.log('Initializing AuthClient...');
        this.authClient = await AuthClient.create({
          idleOptions: {
            idleTimeout: 1000 * 60 * 30, // 30 minutes
            disableDefaultIdleCallback: true,
          },
        });
        console.log('AuthClient created successfully');
      }
      return this.authClient;
    } catch (error) {
      console.error('Failed to initialize AuthClient:', error);
      throw error;
    }
  }

  public async login(): Promise<boolean> {
    try {
      const authClient = await this.init();
      console.log('Starting login process...');
      
      // Get the canister ID from the environment or use the deployed one
      const canisterId = import.meta.env.VITE_INTERNET_IDENTITY_CANISTER_ID;
      const identityProviderUrl = import.meta.env.MODE === 'development'
        ? `http://localhost:4943/?canisterId=${canisterId}`
        : 'https://identity.ic0.app';
      
      console.log('Using identity provider:', identityProviderUrl);
      
      return new Promise((resolve) => {
        authClient.login({
          identityProvider: identityProviderUrl,
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
          onSuccess: () => {
            console.log('Login successful');
            this.identity = authClient.getIdentity();
            const principal = this.identity.getPrincipal().toString();
            console.log('Authenticated with principal:', principal);
            resolve(true);
          },
          onError: (error) => {
            console.error('Login error:', error);
            resolve(false);
          }
        });
      });
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    try {
      const authClient = await this.init();
      const isAuthenticated = await authClient.isAuthenticated();
      console.log('Authentication check:', isAuthenticated);
      
      if (isAuthenticated) {
        this.identity = authClient.getIdentity();
        const principal = this.identity.getPrincipal().toString();
        console.log('Current principal:', principal);
      }
      
      return isAuthenticated;
    } catch (error) {
      console.error('Authentication check failed:', error);
      return false;
    }
  }

  public async logout(): Promise<void> {
    try {
      const authClient = await this.init();
      await authClient.logout();
      this.identity = null;
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  public getIdentity(): Identity | null {
    return this.identity;
  }

  public getPrincipal(): string | null {
    if (!this.identity) return null;
    return this.identity.getPrincipal().toString();
  }

  public getAuthClient(): AuthClient | null {
    return this.authClient;
  }
}

export const authService = AuthService.getInstance();