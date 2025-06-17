import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ActivityItem {
  'id' : string,
  'activityType' : ActivityType,
  'userId' : Principal,
  'blockchain' : [] | [string],
  'message' : string,
  'timestamp' : Time,
}
export type ActivityType = { 'gas_alert' : null } |
  { 'nft_alert' : null } |
  { 'portfolio_update' : null };
export type AlertType = { 'rise_above' : null } |
  { 'any_change' : null } |
  { 'drop_below' : null };
export interface FeeInfo { 'usd' : number, 'gwei' : number }
export interface GasAlert {
  'id' : string,
  'userId' : Principal,
  'priorityTier' : PriorityTier,
  'createdAt' : Time,
  'isActive' : boolean,
  'blockchain' : string,
  'maxGwei' : bigint,
}
export interface NFTAlert {
  'id' : string,
  'alertType' : AlertType,
  'currentFloorPrice' : number,
  'userId' : Principal,
  'createdAt' : Time,
  'percentageChange' : [] | [number],
  'targetPrice' : number,
  'isActive' : boolean,
  'currency' : string,
  'lastChecked' : Time,
  'gasLimit' : [] | [bigint],
  'collectionName' : string,
  'collectionSlug' : string,
}
export interface NetworkFee {
  'fast' : FeeInfo,
  'icon' : string,
  'slow' : FeeInfo,
  'lastUpdated' : Time,
  'blockchain' : string,
  'standard' : FeeInfo,
}
export type Principal = Principal;
export type PriorityTier = { 'fast' : null } |
  { 'slow' : null } |
  { 'standard' : null };
export type Time = bigint;
export interface User {
  'principal' : Principal,
  'createdAt' : Time,
  'isOperator' : boolean,
  'lastLogin' : Time,
}
export interface WalletAddress {
  'id' : string,
  'owner' : Principal,
  'name' : [] | [string],
  'createdAt' : Time,
  'blockchain' : string,
  'address' : string,
}
export interface _SERVICE {
  'addWalletAddress' : ActorMethod<
    [string, string, [] | [string]],
    WalletAddress
  >,
  'createGasAlert' : ActorMethod<[string, bigint, PriorityTier], GasAlert>,
  'createNFTAlert' : ActorMethod<
    [string, string, number, string, AlertType, [] | [bigint], [] | [number]],
    NFTAlert
  >,
  'getCycles' : ActorMethod<[], bigint>,
  'getNetworkFees' : ActorMethod<[], Array<NetworkFee>>,
  'getUser' : ActorMethod<[], [] | [User]>,
  'getUserActivities' : ActorMethod<[], Array<ActivityItem>>,
  'getUserGasAlerts' : ActorMethod<[], Array<GasAlert>>,
  'getUserNFTAlerts' : ActorMethod<[], Array<NFTAlert>>,
  'getUserWallets' : ActorMethod<[], Array<WalletAddress>>,
  'register' : ActorMethod<[], User>,
  'updateNetworkFees' : ActorMethod<
    [string, string, FeeInfo, FeeInfo, FeeInfo],
    NetworkFee
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
