import { Actor, HttpAgent, Identity } from '@dfinity/agent';
// import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';

// Import the generated types and factory
import { 
  _SERVICE,
  idlFactory,
  canisterId as defaultCanisterId 
} from '../../../declarations/PivotFlow_backend';
import { GasAlert, NetworkFee, NFTAlert, WalletAddress } from '@/contexts/AppContext';

// Define UserSettings type (replace fields with actual structure if known)
export interface UserSettings {
  // Example fields, update as needed
  notificationsEnabled: boolean;
  preferredCurrency: string;
  // Add other settings fields as needed
}

// Define UserActivity type (replace fields with actual structure if known)
export interface UserActivity {
  // Example fields, update as needed
  id: string;
  type: string;
  timestamp: bigint;
  details?: string;
}

// Types for our application
export interface CanisterService extends _SERVICE {
  me: () => Promise<Principal>;
  whoami: () => Promise<Principal>;
  registerUser: () => Promise<void>;
  getUser: () => Promise<{
    principal: Principal;
    username: string;
    email: string;
    createdAt: bigint;
  }>;
  getUserNftAlerts: () => Promise<NFTAlert[]>;
  addNftAlert: (
    collectionSlug: string,
    collectionName: string,
    targetPrice: number,
    currency: string,
    alertType: { drop_below: null } | { rise_above: null } | { any_change: null },
    gasLimit?: bigint[],
    percentageChange?: number[]
  ) => Promise<string>;
  removeNftAlert: (alertId: string) => Promise<void>;
  getUserGasAlerts: () => Promise<GasAlert[]>;
  addGasAlert: (
    blockchain: string,
    maxGwei: bigint,
    priorityTier: { fast: null } | { standard: null } | { slow: null }
  ) => Promise<string>;
  removeGasAlert: (alertId: string) => Promise<void>;
  getUserWalletAddresses: () => Promise<WalletAddress[]>;
  addWalletAddress: (
    address: string,
    blockchain: string,
    label?: string[]
  ) => Promise<string>;
  removeWalletAddress: (walletId: string) => Promise<void>;
  getUserActivity: (limit?: bigint[]) => Promise<UserActivity[]>;
  getUserSettings: () => Promise<UserSettings>;
  updateSettings: (settings: UserSettings) => Promise<void>;
  getNetworkFees: () => Promise<NetworkFee[]>;
  getCycles: () => Promise<bigint>;
  health: () => Promise<boolean>;
  getCanisterMemoryUsage: () => Promise<bigint>; // Nat becomes bigint
  getICPPrice: () => Promise<[] | [number]>; // ?Float becomes an optional array with one number
  getAltcoinPrices: (tokenIds: string[]) => Promise<[] | Array<{id: string; current_price: number}>>; // ?[TokenPriceInfo]
  getNftFloorPrice: (collectionSlug: string, blockchain: string) => Promise<[] | [number]>; // ?Float for NFT floor price
}

export class CanisterClient {
  private static instance: CanisterClient;
  private actor: CanisterService | null = null;
  private agent: HttpAgent | null = null;

  private constructor() {}

  public static getInstance(): CanisterClient {
    if (!CanisterClient.instance) {
      CanisterClient.instance = new CanisterClient();
    }
    return CanisterClient.instance;
  }

  public async init(identity?: Identity): Promise<CanisterService> {
    const canisterId = import.meta.env.VITE_CANISTER_ID || defaultCanisterId;
    const host = import.meta.env.VITE_HOST || 'https://ic0.app';

    this.agent = new HttpAgent({
      host,
      identity,
    });

    // Fetch root key for certificate validation during development
    if (import.meta.env.MODE === 'development') {
      try {
        await this.agent.fetchRootKey();
      } catch (err) {
        console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
        console.error(err);
      }
    }

    this.actor = Actor.createActor<CanisterService>(idlFactory, {
      agent: this.agent,
      canisterId,
    });

    return this.actor;
  }

  public getActor(): CanisterService | null {
    return this.actor;
  }

  public getAgent(): HttpAgent | null {
    return this.agent;
  }

  // Convenience methods for common operations
  public async whoami(): Promise<Principal> {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.whoami();
  }

  public async registerUser() {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.registerUser();
  }

  public async getUser() {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.getUser();
  }

  public async getUserNftAlerts() {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.getUserNftAlerts();
  }

  public async addNftAlert(
    collectionSlug: string,
    collectionName: string,
    targetPrice: number,
    currency: string,
    alertType: { drop_below: null } | { rise_above: null } | { any_change: null },
    gasLimit?: bigint,
    percentageChange?: number
  ) {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.addNftAlert(
      collectionSlug,
      collectionName,
      targetPrice,
      currency,
      alertType,
      gasLimit ? [gasLimit] : [],
      percentageChange ? [percentageChange] : []
    );
  }

  public async removeNftAlert(alertId: string) {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.removeNftAlert(alertId);
  }

  public async getUserGasAlerts() {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.getUserGasAlerts();
  }

  public async addGasAlert(
    blockchain: string,
    maxGwei: bigint,
    priorityTier: { fast: null } | { standard: null } | { slow: null }
  ) {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.addGasAlert(blockchain, maxGwei, priorityTier);
  }

  public async removeGasAlert(alertId: string) {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.removeGasAlert(alertId);
  }

  public async getUserWalletAddresses() {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.getUserWalletAddresses();
  }

  public async addWalletAddress(address: string, blockchain: string, label?: string) {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.addWalletAddress(address, blockchain, label ? [label] : []);
  }

  public async removeWalletAddress(walletId: string) {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.removeWalletAddress(walletId);
  }

  public async getUserActivity(limit?: bigint) {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.getUserActivity(limit ? [limit] : []);
  }

  public async getUserSettings() {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.getUserSettings();
  }

  public async updateSettings(settings: any) {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.updateSettings(settings);
  }

  public async getNetworkFees() {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.getNetworkFees();
  }

  public async getCycles() {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.getCycles();
  }

  public async health() {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.health();
  }

  public async getCanisterMemoryUsage(): Promise<bigint> {
    if (!this.actor) throw new Error('Actor not initialized');
    return this.actor.getCanisterMemoryUsage();
  }

  public async getICPPrice(): Promise<number | null> {
    if (!this.actor) throw new Error('Actor not initialized');
    const result = await this.actor.getICPPrice();
    return result.length > 0 ? result[0] : null;
  }

  public async getAltcoinPrices(tokenIds: string[]): Promise<Array<{id: string; current_price: number}> | null> {
    if (!this.actor) throw new Error('Actor not initialized');
    const result = await this.actor.getAltcoinPrices(tokenIds);
    // Motoko ?[TokenPriceInfo] returns an array, which could be empty if the option was null,
    // or an array containing another array of TokenPriceInfo if the option was Some.
    // The candid interface for ?T is Vec<T>, which is an array. If T is an array, it's Vec<Vec<X>>.
    // If backend returns ?[TokenPriceInfo] (i.e. Option<Array<TokenPriceInfo>>):
    // - null (None) becomes `[]` (empty array) at the candid layer.
    // - Some([item1, item2]) becomes `[[item1, item2]]` (array containing one array) at the candid layer.
    // So, `result` will be `[]` if backend returned `null`, or `[actualArray]` if backend returned `?actualArray`.
    if (result.length === 0) { // This means backend returned null
      return null;
    }
    return result[0]; // This is the actualArray: Array<{id: string; current_price: number}>
  }

  public async getNftFloorPrice(collectionSlug: string, blockchain: string): Promise<number | null> {
    if (!this.actor) throw new Error('Actor not initialized');
    const result = await this.actor.getNftFloorPrice(collectionSlug, blockchain);
    // ?Float from Motoko is represented as [] | [number] in Candid/JS
    if (result.length === 0) { // This means backend returned null (None)
      return null;
    }
    return result[0]; // This is the actual price: number
  }
}

export const canisterClient = CanisterClient.getInstance();