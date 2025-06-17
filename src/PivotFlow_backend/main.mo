import Principal "mo:base/Principal";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Types "types";
import Utils "utils";

actor PivotFlow {
    private stable var users : [(Principal, Types.User)] = [];
    private stable var nftAlerts : [(Text, Types.NFTAlert)] = [];
    private stable var gasAlerts : [(Text, Types.GasAlert)] = [];
    private stable var walletAddresses : [(Text, Types.WalletAddress)] = [];
    private stable var activities : [(Text, Types.ActivityItem)] = [];
    private stable var networkFees : [(Text, Types.NetworkFee)] = [];
    
    private let userStore = HashMap.fromIter<Principal, Types.User>(users.vals(), 0, Principal.equal, Principal.hash);
    private let nftAlertStore = HashMap.fromIter<Text, Types.NFTAlert>(nftAlerts.vals(), 0, Text.equal, Text.hash);
    private let gasAlertStore = HashMap.fromIter<Text, Types.GasAlert>(gasAlerts.vals(), 0, Text.equal, Text.hash);
    private let walletStore = HashMap.fromIter<Text, Types.WalletAddress>(walletAddresses.vals(), 0, Text.equal, Text.hash);
    private let activityStore = HashMap.fromIter<Text, Types.ActivityItem>(activities.vals(), 0, Text.equal, Text.hash);
    private let networkFeeStore = HashMap.fromIter<Text, Types.NetworkFee>(networkFees.vals(), 0, Text.equal, Text.hash);
    
    // System Functions
    public func getCycles() : async Nat {
        ExperimentalCycles.balance()
    };

    // Activity Log
    private func logActivity(userId: Principal, activityType: Types.ActivityType, message: Text, blockchain: ?Text) {
        let id = Text.concat(Principal.toText(userId), Int.toText(Time.now()));
        let activity : Types.ActivityItem = {
            id;
            userId;
            activityType;
            message;
            blockchain;
            timestamp = Time.now();
        };
        activityStore.put(id, activity);
    };

    // User Management
    public shared(msg) func register() : async Types.User {
        let caller = msg.caller;
        
        switch (userStore.get(caller)) {
            case (?existing) {
                let updated : Types.User = {
                    principal = existing.principal;
                    createdAt = existing.createdAt;
                    lastLogin = Time.now();
                    isOperator = existing.isOperator;
                };
                userStore.put(caller, updated);
                updated
            };
            case null {
                let newUser : Types.User = {
                    principal = caller;
                    createdAt = Time.now();
                    lastLogin = Time.now();
                    isOperator = false;
                };
                userStore.put(caller, newUser);
                newUser
            };
        }
    };

    public shared(msg) func getUser() : async ?Types.User {
        userStore.get(msg.caller)
    };

    // NFT Alerts
    public shared(msg) func createNFTAlert(
        collectionSlug: Text,
        collectionName: Text,
        targetPrice: Float,
        currency: Text,
        alertType: Types.AlertType,
        gasLimit: ?Nat,
        percentageChange: ?Float
    ) : async Types.NFTAlert {
        assert(Utils.isValidCurrency(currency));
        assert(Utils.isValidPrice(targetPrice));
        
        let id = Text.concat(Principal.toText(msg.caller), Int.toText(Time.now()));
        let alert : Types.NFTAlert = {
            id;
            userId = msg.caller;
            collectionSlug;
            collectionName;
            targetPrice;
            currency;
            alertType;
            gasLimit;
            percentageChange;
            currentFloorPrice = targetPrice;
            lastChecked = Time.now();
            isActive = true;
            createdAt = Time.now();
        };
        
        nftAlertStore.put(id, alert);
        logActivity(msg.caller, #nft_alert, "Created NFT Alert for " # collectionName, null);
        alert
    };

    public shared(msg) func getUserNFTAlerts() : async [Types.NFTAlert] {
        Utils.filterByUserId(Iter.toArray(nftAlertStore.entries()), msg.caller, func(alert: Types.NFTAlert) : Principal { alert.userId })
    };

    // Gas Alerts
    public shared(msg) func createGasAlert(
        blockchain: Text,
        maxGwei: Nat,
        priorityTier: Types.PriorityTier
    ) : async Types.GasAlert {
        assert(Utils.isValidBlockchain(blockchain));
        assert(Utils.isValidGwei(maxGwei));
        
        let id = Text.concat(Principal.toText(msg.caller), Int.toText(Time.now()));
        let alert : Types.GasAlert = {
            id;
            userId = msg.caller;
            blockchain;
            maxGwei;
            priorityTier;
            isActive = true;
            createdAt = Time.now();
        };
        
        gasAlertStore.put(id, alert);
        logActivity(msg.caller, #gas_alert, "Created Gas Alert for " # blockchain, ?blockchain);
        alert
    };

    public shared(msg) func getUserGasAlerts() : async [Types.GasAlert] {
        Utils.filterByUserId(Iter.toArray(gasAlertStore.entries()), msg.caller, func(alert: Types.GasAlert) : Principal { alert.userId })
    };

    // Wallet Management
    public shared(msg) func addWalletAddress(
        address: Text,
        blockchain: Text,
        name: ?Text
    ) : async Types.WalletAddress {
        assert(Utils.isValidBlockchain(blockchain));
        
        if (blockchain == "Ethereum") {
            assert(Utils.isValidEthereumAddress(address));
        } else if (blockchain == "Solana") {
            assert(Utils.isValidSolanaAddress(address));
        };
        
        let id = Text.concat(Principal.toText(msg.caller), Int.toText(Time.now()));
        let wallet : Types.WalletAddress = {
            id;
            owner = msg.caller;
            address;
            blockchain;
            name;
            createdAt = Time.now();
        };
        
        walletStore.put(id, wallet);
        logActivity(msg.caller, #portfolio_update, "Added wallet address for " # blockchain, ?blockchain);
        wallet
    };

    public shared(msg) func getUserWallets() : async [Types.WalletAddress] {
        Utils.filterByUserId(Iter.toArray(walletStore.entries()), msg.caller, func(wallet: Types.WalletAddress) : Principal { wallet.owner })
    };

    // Network Fees
    public shared(msg) func updateNetworkFees(
        blockchain: Text,
        icon: Text,
        fast: Types.FeeInfo,
        standard: Types.FeeInfo,
        slow: Types.FeeInfo
    ) : async Types.NetworkFee {
        assert(Utils.isValidBlockchain(blockchain));
        assert(msg.caller == Principal.fromText("2vxsx-fae")); // Replace with actual operator principal
        
        let fee : Types.NetworkFee = {
            blockchain;
            icon;
            fast;
            standard;
            slow;
            lastUpdated = Time.now();
        };
        
        networkFeeStore.put(blockchain, fee);
        fee
    };

    public query func getNetworkFees() : async [Types.NetworkFee] {
        Iter.toArray(networkFeeStore.vals())
    };

    public shared(msg) func getUserActivities() : async [Types.ActivityItem] {
        Utils.filterByUserId(Iter.toArray(activityStore.entries()), msg.caller, func(activity: Types.ActivityItem) : Principal { activity.userId })
    };

    // System Upgrade
    system func preupgrade() {
        users := Iter.toArray(userStore.entries());
        nftAlerts := Iter.toArray(nftAlertStore.entries());
        gasAlerts := Iter.toArray(gasAlertStore.entries());
        walletAddresses := Iter.toArray(walletStore.entries());
        activities := Iter.toArray(activityStore.entries());
        networkFees := Iter.toArray(networkFeeStore.entries());
    };
};