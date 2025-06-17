export const idlFactory = ({ IDL }) => {
  const Principal = IDL.Principal;
  const Time = IDL.Int;
  const WalletAddress = IDL.Record({
    'id' : IDL.Text,
    'owner' : Principal,
    'name' : IDL.Opt(IDL.Text),
    'createdAt' : Time,
    'blockchain' : IDL.Text,
    'address' : IDL.Text,
  });
  const PriorityTier = IDL.Variant({
    'fast' : IDL.Null,
    'slow' : IDL.Null,
    'standard' : IDL.Null,
  });
  const GasAlert = IDL.Record({
    'id' : IDL.Text,
    'userId' : Principal,
    'priorityTier' : PriorityTier,
    'createdAt' : Time,
    'isActive' : IDL.Bool,
    'blockchain' : IDL.Text,
    'maxGwei' : IDL.Nat,
  });
  const AlertType = IDL.Variant({
    'rise_above' : IDL.Null,
    'any_change' : IDL.Null,
    'drop_below' : IDL.Null,
  });
  const NFTAlert = IDL.Record({
    'id' : IDL.Text,
    'alertType' : AlertType,
    'currentFloorPrice' : IDL.Float64,
    'userId' : Principal,
    'createdAt' : Time,
    'percentageChange' : IDL.Opt(IDL.Float64),
    'targetPrice' : IDL.Float64,
    'isActive' : IDL.Bool,
    'currency' : IDL.Text,
    'lastChecked' : Time,
    'gasLimit' : IDL.Opt(IDL.Nat),
    'collectionName' : IDL.Text,
    'collectionSlug' : IDL.Text,
  });
  const FeeInfo = IDL.Record({ 'usd' : IDL.Float64, 'gwei' : IDL.Float64 });
  const NetworkFee = IDL.Record({
    'fast' : FeeInfo,
    'icon' : IDL.Text,
    'slow' : FeeInfo,
    'lastUpdated' : Time,
    'blockchain' : IDL.Text,
    'standard' : FeeInfo,
  });
  const User = IDL.Record({
    'principal' : Principal,
    'createdAt' : Time,
    'isOperator' : IDL.Bool,
    'lastLogin' : Time,
  });
  const ActivityType = IDL.Variant({
    'gas_alert' : IDL.Null,
    'nft_alert' : IDL.Null,
    'portfolio_update' : IDL.Null,
  });
  const ActivityItem = IDL.Record({
    'id' : IDL.Text,
    'activityType' : ActivityType,
    'userId' : Principal,
    'blockchain' : IDL.Opt(IDL.Text),
    'message' : IDL.Text,
    'timestamp' : Time,
  });
  return IDL.Service({
    'addWalletAddress' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Opt(IDL.Text)],
        [WalletAddress],
        [],
      ),
    'createGasAlert' : IDL.Func(
        [IDL.Text, IDL.Nat, PriorityTier],
        [GasAlert],
        [],
      ),
    'createNFTAlert' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Float64,
          IDL.Text,
          AlertType,
          IDL.Opt(IDL.Nat),
          IDL.Opt(IDL.Float64),
        ],
        [NFTAlert],
        [],
      ),
    'getCycles' : IDL.Func([], [IDL.Nat], []),
    'getNetworkFees' : IDL.Func([], [IDL.Vec(NetworkFee)], ['query']),
    'getUser' : IDL.Func([], [IDL.Opt(User)], []),
    'getUserActivities' : IDL.Func([], [IDL.Vec(ActivityItem)], []),
    'getUserGasAlerts' : IDL.Func([], [IDL.Vec(GasAlert)], []),
    'getUserNFTAlerts' : IDL.Func([], [IDL.Vec(NFTAlert)], []),
    'getUserWallets' : IDL.Func([], [IDL.Vec(WalletAddress)], []),
    'register' : IDL.Func([], [User], []),
    'updateNetworkFees' : IDL.Func(
        [IDL.Text, IDL.Text, FeeInfo, FeeInfo, FeeInfo],
        [NetworkFee],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
