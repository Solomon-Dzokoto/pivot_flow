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
    if (!this.authClient) {
      this.authClient = await AuthClient.create({
        idleOptions: {
          idleTimeout: 1000 * 60 * 30, // 30 minutes
          disableDefaultIdleCallback: true,
        },
      });
    }
    return this.authClient;
  }

  public async login(): Promise<boolean> {
    try {
      const authClient = await this.init();
      
      return new Promise((resolve) => {
        authClient.login({
          identityProvider: import.meta.env.MODE === 'development' 
            ? `http://localhost:4943/?canisterId=${import.meta.env.VITE_INTERNET_IDENTITY_CANISTER_ID || 'rdmx6-jaaaa-aaaaa-aaadq-cai'}`
            : 'https://identity.ic0.app',
          onSuccess: () => {
            this.identity = authClient.getIdentity();
            resolve(true);
          },
          onError: (error) => {
            console.error('Login failed:', error);
            resolve(false);
          },
        });
      });
    } catch (error) {
      console.error('Login initialization failed:', error);
      return false;
    }
  }

  public async logout(): Promise<void> {
    try {
      const authClient = await this.init();
      await authClient.logout();
      this.identity = null;
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    try {
      const authClient = await this.init();
      const isAuthenticated = await authClient.isAuthenticated();
      if (isAuthenticated) {
        this.identity = authClient.getIdentity();
      }
      return isAuthenticated;
    } catch (error) {
      console.error('Authentication check failed:', error);
      return false;
    }
  }

  public getIdentity(): Identity | null {
    return this.identity;
  }

  public getPrincipal(): string | null {
    return this.identity?.getPrincipal().toString() || null;
  }

  public getAuthClient(): AuthClient | null {
    return this.authClient;
  }
}

export const authService = AuthService.getInstance();