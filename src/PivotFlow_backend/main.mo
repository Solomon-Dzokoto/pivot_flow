import Principal "mo:base/Principal";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Option "mo:base/Option"; // For Option.get if needed
import Timer "mo:base/Timer"; // For timers
import Task "mo:base/Task"; // For Task.perform with async timer callbacks
import Debug "mo:base/Debug"; // For Debug.print
import Blob "mo:base/Blob"; // For HTTP request/response body
import ExperimentalInternetComputer "mo:base/ExperimentalInternetComputer"; // For IC HTTP calls
import Float "mo:base/Float"; // For ICP Price
import Nat "mo:base/Nat"; // For memory usage, cycles
import Types "types";
import Utils "utils";
import Monitoring "monitoring"; // Import the monitoring module

// Types for Management Canister call
type CanisterIdRecord = { canister_id : Principal; };
type CanisterStatus = {
    status : { #running; #stopping; #stopped };
    module_hash : ?Blob;
    memory_size : Nat;
    cycles : Nat;
    settings : { controllers : [Principal] }; // Simplified settings
    idle_cycles_burned_per_day: Nat; // Added based on common status result
};


actor PivotFlow {
    private stable var users : [(Principal, Types.User)] = [];
    private stable var nftAlerts : [(Text, Types.NFTAlert)] = [];
    private stable var gasAlerts : [(Text, Types.GasAlert)] = [];
    private stable var walletAddresses : [(Text, Types.WalletAddress)] = [];
    private stable var activities : [(Text, Types.ActivityItem)] = [];
    private stable var networkFees : [(Text, Types.NetworkFee)] = [];
    private stable var activeTimerId: ?Timer.TimerId = null; // For storing the active timer ID
    
    private let userStore = HashMap.fromIter<Principal, Types.User>(users.vals(), 0, Principal.equal, Principal.hash);
    private let nftAlertStore = HashMap.fromIter<Text, Types.NFTAlert>(nftAlerts.vals(), 0, Text.equal, Text.hash);
    private let gasAlertStore = HashMap.fromIter<Text, Types.GasAlert>(gasAlerts.vals(), 0, Text.equal, Text.hash);
    private let walletStore = HashMap.fromIter<Text, Types.WalletAddress>(walletAddresses.vals(), 0, Text.equal, Text.hash);
    private let activityStore = HashMap.fromIter<Text, Types.ActivityItem>(activities.vals(), 0, Text.equal, Text.hash);
    private let networkFeeStore = HashMap.fromIter<Text, Types.NetworkFee>(networkFees.vals(), 0, Text.equal, Text.hash);

    private let monitoringCoordinator = Monitoring.MonitoringCoordinator();
    
    // Initialize timer when actor is deployed or upgraded
    // This needs to be called after all stable variables are initialized, typically at the end of the actor block or in postupgrade.
    // For initial deployment, it's tricky. Let's put it in postupgrade and call it once manually if needed for a fresh deployment scenario.
    // Or, let's try to call it at the end of the actor constructor logic.
    // Motoko actor constructor logic runs implicitly. We can add a non-async private function and call it.
    // However, setTimer is async.
    // A common pattern is to start it in postUpgrade and for initial deployment, it might need a manual call or a slight delay.
    // For now, we'll add the function and call it from postUpgrade.
    // To ensure it runs on first deployment, we can add a specific init function or call it if activeTimerId is null.

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

    // New Functions - CRUD, Settings, Identity, Health

    // --- REMOVE Operations ---
    public shared(msg) func removeNftAlert(alertId: Text) : async Bool {
        switch (nftAlertStore.get(alertId)) {
            case (?alert) {
                if (alert.userId != msg.caller) {
                    // Optional: Could also check for operator role here if implemented
                    // For now, only owner can delete.
                    // Consider if operators should bypass this:
                    // let user = userStore.get(msg.caller);
                    // if (alert.userId != msg.caller and (user == null or user?.isOperator != true)) {
                    Debug.print("removeNftAlert: Unauthorized attempt by " # Principal.toText(msg.caller) # " for alert owned by " # Principal.toText(alert.userId));
                    return false;
                };
                nftAlertStore.delete(alertId);
                logActivity(msg.caller, #nft_alert, "Removed NFT Alert ID: " # alertId, null);
                true
            };
            case null {
                Debug.print("removeNftAlert: Alert ID " # alertId # " not found.");
                false
            };
        }
    };

    public shared(msg) func removeGasAlert(alertId: Text) : async Bool {
        switch (gasAlertStore.get(alertId)) {
            case (?alert) {
                if (alert.userId != msg.caller) {
                    Debug.print("removeGasAlert: Unauthorized attempt by " # Principal.toText(msg.caller) # " for alert owned by " # Principal.toText(alert.userId));
                    return false;
                };
                gasAlertStore.delete(alertId);
                logActivity(msg.caller, #gas_alert, "Removed Gas Alert ID: " # alertId, ?alert.blockchain);
                true
            };
            case null {
                Debug.print("removeGasAlert: Alert ID " # alertId # " not found.");
                false
            };
        }
    };

    public shared(msg) func removeWalletAddress(walletId: Text) : async Bool {
        switch (walletStore.get(walletId)) {
            case (?wallet) {
                if (wallet.owner != msg.caller) {
                    Debug.print("removeWalletAddress: Unauthorized attempt by " # Principal.toText(msg.caller) # " for wallet owned by " # Principal.toText(wallet.owner));
                    return false;
                };
                walletStore.delete(walletId);
                logActivity(msg.caller, #portfolio_update, "Removed Wallet ID: " # walletId, ?wallet.blockchain);
                true
            };
            case null {
                Debug.print("removeWalletAddress: Wallet ID " # walletId # " not found.");
                false
            };
        }
    };

    // --- UPDATE Operations ---
    public shared(msg) func updateNftAlert(updatedAlert: Types.NFTAlert) : async ?Types.NFTAlert {
        switch (nftAlertStore.get(updatedAlert.id)) {
            case (?existingAlert) {
                if (existingAlert.userId != msg.caller) {
                     Debug.print("updateNftAlert: Unauthorized attempt by " # Principal.toText(msg.caller) # " for alert owned by " # Principal.toText(existingAlert.userId));
                    return null; // Not authorized
                };
                // Ensure userId is not changed by the update, or if it is, it's to the caller.
                if (updatedAlert.userId != existingAlert.userId and updatedAlert.userId != msg.caller) {
                    Debug.print("updateNftAlert: Attempt to change owner to a different user is not allowed.");
                    return null;
                };
                // Preserve original creation timestamp and potentially ID if not meant to be changed by client
                let alertToStore: Types.NFTAlert = {
                    id = existingAlert.id; // Keep original ID
                    userId = msg.caller; // Re-affirm ownership or allow legitimate change to self
                    collectionSlug = updatedAlert.collectionSlug;
                    collectionName = updatedAlert.collectionName;
                    targetPrice = updatedAlert.targetPrice;
                    currency = updatedAlert.currency;
                    alertType = updatedAlert.alertType;
                    gasLimit = updatedAlert.gasLimit;
                    percentageChange = updatedAlert.percentageChange;
                    currentFloorPrice = updatedAlert.currentFloorPrice; // Or fetch fresh? For now, take from client.
                    lastChecked = Time.now(); // Update last checked time
                    isActive = updatedAlert.isActive;
                    createdAt = existingAlert.createdAt; // Keep original creation time
                };
                nftAlertStore.put(alertToStore.id, alertToStore);
                logActivity(msg.caller, #nft_alert, "Updated NFT Alert ID: " # alertToStore.id, null);
                return ?alertToStore;
            };
            case null {
                Debug.print("updateNftAlert: Alert ID " # updatedAlert.id # " not found for update.");
                return null; // Not found
            };
        }
    };

    public shared(msg) func updateGasAlert(updatedAlert: Types.GasAlert) : async ?Types.GasAlert {
        switch (gasAlertStore.get(updatedAlert.id)) {
            case (?existingAlert) {
                if (existingAlert.userId != msg.caller) {
                    Debug.print("updateGasAlert: Unauthorized attempt by " # Principal.toText(msg.caller) # " for alert owned by " # Principal.toText(existingAlert.userId));
                    return null; // Not authorized
                };
                if (updatedAlert.userId != existingAlert.userId and updatedAlert.userId != msg.caller) {
                     Debug.print("updateGasAlert: Attempt to change owner to a different user is not allowed.");
                    return null;
                };
                let alertToStore: Types.GasAlert = {
                    id = existingAlert.id;
                    userId = msg.caller;
                    blockchain = updatedAlert.blockchain;
                    maxGwei = updatedAlert.maxGwei;
                    priorityTier = updatedAlert.priorityTier;
                    isActive = updatedAlert.isActive;
                    createdAt = existingAlert.createdAt;
                };
                gasAlertStore.put(alertToStore.id, alertToStore);
                logActivity(msg.caller, #gas_alert, "Updated Gas Alert ID: " # alertToStore.id, ?alertToStore.blockchain);
                return ?alertToStore;
            };
            case null {
                Debug.print("updateGasAlert: Alert ID " # updatedAlert.id # " not found for update.");
                return null; // Not found
            };
        }
    };

    // --- Settings ---
    public query func getUserSettings() : async Types.AppSettings {
        // Placeholder implementation: return default settings
        // In a real scenario, these would be loaded per user or system-wide.
        let defaultApiKeys : Types.ApiKeys = {
            opensea = ""; etherscan = ""; polygonscan = ""; bscscan = ""; solana = "";
        };
        let defaultNotifications : Types.NotificationSettings = {
            telegramBotToken = ""; discordBotToken = ""; adminChatId = "";
            enableNftAlerts = true; enableGasAlerts = true; enablePortfolioUpdates = true;
        };
        let defaultUI : Types.UISettings = {
            darkMode = false; animationSpeed = 1.0;
        };
        return {
            apiKeys = defaultApiKeys;
            notifications = defaultNotifications;
            ui = defaultUI;
        };
    };

    public shared(msg) func updateSettings(settings: Types.AppSettings) : async Bool {
        // Placeholder: Acknowledge the update, but don't store/act on it yet.
        // In a real implementation, you'd store these settings, likely per user.
        // Ensure msg.caller is authorized if settings are user-specific and sensitive.
        logActivity(msg.caller, #portfolio_update, "User settings update attempted (placeholder).", null);
        true
    };

    // --- Identity & Health ---
    public shared query (msg) func me() : async Principal {
        msg.caller
    };

    public shared query (msg) func whoami() : async Principal {
        msg.caller
    };

    public shared query func health() : async Bool {
        true
    };

    // --- New Canister Info and Price Functions ---

    public query func getCanisterMemoryUsage() : async Nat {
        // Use Principal.fromActor(this) to get current canister's principal
        let thisCanisterId = Principal.fromActor(this);
        try {
            // Call the management canister
            // The actor type for the management canister is implicitly known for this call.
            // Type for status argument: { canister_id : Principal }
            // Type for status result: { status; settings; module_hash; memory_size; cycles; ... }
            let status = await actor ("aaaaa-aa").canister_status({ canister_id = thisCanisterId });
            // The actual type of status would be the record returned by canister_status.
            // For this example, we assume it has a memory_size field of type Nat.
            // Based on IC interface spec, it's directly accessible.
            return status.memory_size;
        } catch (e) {
            Debug.print("Error fetching canister memory usage: " # Debug.toString(e));
            return 0; // Return 0 or handle error appropriately
        }
    };

    // Conceptual function to fetch ICP price from an external API
    public shared func getICPPrice() : async ?Float {
        let url = "https://api.placeholder.host/price/icp-usd"; // Placeholder URL
        let request_headers : [Types.HttpHeader] = [];

        let request : Types.HttpRequest = {
            url = url;
            method = "GET";
            headers = request_headers;
            body = null;
            transform = null; // Will process response manually
        };

        Debug.print("Attempting to fetch ICP price from: " # url);

        try {
            let httpResponse = await ExperimentalInternetComputer.http_request(request);

            if (httpResponse.status != 200) {
                Debug.print("Failed to fetch ICP price, status: " # Nat.toText(httpResponse.status) # " body: " # Text.decodeUtf8(Blob.toArray(httpResponse.body)));
                return null;
            };

            let bodyText = Text.decodeUtf8(Blob.toArray(httpResponse.body));
            Debug.print("ICP price response body: " # bodyText);

            // Simplified JSON parsing for {"price": 12.34} or {"icp": {"usd": 12.34}}
            var priceText : ?Text = null;

            // Try: {"icp": {"usd": 12.34}}
            let icpKeyPos = Text.find(bodyText, "\"icp\"");
            if (icpKeyPos != null) {
                let usdKeyPos = Text.find(bodyText, "\"usd\"");
                if (usdKeyPos != null && usdKeyPos! > icpKeyPos!) {
                     let sliceFromUsd = Text.slice(bodyText, usdKeyPos! + Text.size("\"usd\""), Text.size(bodyText));
                     // Find first digit after "usd":
                     var valStart = 0;
                     while(valStart < Text.size(sliceFromUsd) && not Char.isDigit(Text.get(sliceFromUsd, valStart)!)){
                        valStart += 1;
                     };
                     var valEnd = valStart;
                     while(valEnd < Text.size(sliceFromUsd) && (Char.isDigit(Text.get(sliceFromUsd, valEnd)!) or Text.get(sliceFromUsd, valEnd)! == '.')){
                        valEnd +=1;
                     };
                     if(valStart < valEnd) {
                        priceText = ?Text.slice(sliceFromUsd, valStart, valEnd);
                     }
                }
            } else {
                // Try: {"price": 12.34}
                let priceKeyPos = Text.find(bodyText, "\"price\"");
                if (priceKeyPos != null) {
                    let sliceFromPrice = Text.slice(bodyText, priceKeyPos! + Text.size("\"price\""), Text.size(bodyText));
                     var valStart = 0;
                     while(valStart < Text.size(sliceFromPrice) && not Char.isDigit(Text.get(sliceFromPrice, valStart)!)){
                        valStart += 1;
                     };
                     var valEnd = valStart;
                     while(valEnd < Text.size(sliceFromPrice) && (Char.isDigit(Text.get(sliceFromPrice, valEnd)!) or Text.get(sliceFromPrice, valEnd)! == '.')){
                        valEnd +=1;
                     };
                     if(valStart < valEnd) {
                        priceText = ?Text.slice(sliceFromPrice, valStart, valEnd);
                     }
                }
            }

            switch (priceText) {
                case (?pText) { return Float.fromText(pText); };
                case null {
                    Debug.print("Could not parse ICP price from body: " # bodyText);
                    return null;
                };
            }
        } catch (e) {
            Debug.print("Error during getICPPrice HTTP request: " # Debug.toString(e));
            return null;
        }
    };

    // System Upgrade
    system func preupgrade() {
        users := Iter.toArray(userStore.entries());
        nftAlerts := Iter.toArray(nftAlertStore.entries());
        gasAlerts := Iter.toArray(gasAlertStore.entries());
        walletAddresses := Iter.toArray(walletStore.entries());
        activities := Iter.toArray(activityStore.entries());
        networkFees := Iter.toArray(networkFeeStore.entries());
        // activeTimerId is already stable, its value will persist.
        // We should cancel the timer before upgrade.
        if (activeTimerId != null) {
            Timer.cancel(activeTimerId!);
            // activeTimerId := null; // Keep the ID to show it was running, or nullify. Nullifying is cleaner.
            // Actually, Timer.cancel doesn't require it to be nullified from the stable var for persistence.
            // But for logical state, it's good.
        };
    };

    system func postupgrade() {
        // Re-initialize non-stable stores from stable arrays
        // userStore := HashMap.fromIter<Principal, Types.User>(users.vals(), 0, Principal.equal, Principal.hash);
        // nftAlertStore := HashMap.fromIter<Text, Types.NFTAlert>(nftAlerts.vals(), 0, Text.equal, Text.hash);
        // ... and so on for all stores. This is already implicitly handled by how they are declared.

        // Restart the monitoring timer
        internalStartMonitoringTimer(300); // Use a default interval, e.g., 5 minutes
    };

    // --- Timer and Monitoring Cycle ---

    private func performMonitoringCycle() : async () {
        Debug.print("Performing monitoring cycle at " # Time.toText(Time.now()));
        try {
            // 1. Retrieve active alerts
            let allNftAlerts = Iter.toArray(nftAlertStore.vals());
            var activeNftAlerts : [Types.NFTAlert] = [];
            for (alert in allNftAlerts.vals()) {
                if (alert.isActive) { activeNftAlerts.push(alert); };
            };

            let allGasAlerts = Iter.toArray(gasAlertStore.vals());
            var activeGasAlerts : [Types.GasAlert] = [];
            for (alert in allGasAlerts.vals()) {
                if (alert.isActive) { activeGasAlerts.push(alert) };
            };

            // 2. Retrieve current network fees from store (to pass to runMonitoringCycle)
            let currentNetworkFeesFromStore = Iter.toArray(networkFeeStore.vals());

            // 3. Call the coordinator
            let cycleResult = await monitoringCoordinator.runMonitoringCycle(
                activeNftAlerts,
                activeGasAlerts,
                currentNetworkFeesFromStore
            );

            // 4. Update Network Fee Store with fetched fees
            for (updatedFee in cycleResult.updatedNetworkFees.vals()) {
                networkFeeStore.put(updatedFee.blockchain, updatedFee);
            };
            Debug.print("Network fee store updated with " # Nat.toText(cycleResult.updatedNetworkFees.size()) # " entries.");

            // 5. Handle Notifications (Conceptual Send)
            for (notification in cycleResult.nftNotifications.vals()) {
                Debug.print("--- NFT Notification ---");
                Debug.print("User: " # Principal.toText(notification.userId));
                Debug.print("Title: " # notification.title);
                Debug.print("Message: " # notification.message);
                Debug.print("-----------------------");
                // logActivity(notification.userId, notification.alertType, notification.message, notification.blockchain); // Optionally log sent notifications
            };
            for (notification in cycleResult.gasNotifications.vals()) {
                Debug.print("--- Gas Notification ---");
                Debug.print("User: " # Principal.toText(notification.userId));
                Debug.print("Title: " # notification.title);
                Debug.print("Message: " # notification.message);
                Debug.print("-----------------------");
                // logActivity(notification.userId, notification.alertType, notification.message, notification.blockchain);
            };
            Debug.print("Monitoring cycle completed.");
        } catch (e) {
            Debug.print("Error during monitoring cycle: " # Debug.toString(e));
        };
    };

    private func internalStartMonitoringTimer(intervalSeconds: Nat) {
        if (activeTimerId != null) {
            Timer.cancel(activeTimerId!);
            Debug.print("Cancelled existing monitoring timer.");
        };

        let interval = Time.fromSeconds(intervalSeconds);
        // Using Task.perform to bridge async call from sync timer callback
        activeTimerId := ?Timer.setTimer(interval, func () {
            // This function is synchronous, but performMonitoringCycle is async.
            // We need to use Task.perform to allow the async call to proceed without blocking the timer heartbeat.
            // And we should ignore the result of Task.perform as setTimer expects a sync callback.
            ignore Task.perform(performMonitoringCycle());
        });
        Debug.print("Monitoring timer started with interval (seconds): " # Nat.toText(intervalSeconds));
        // Log activity for starting timer? Maybe not, it's an internal system event.
    };

    // Actor initialization block (runs once on initial deployment after stable vars are set)
    // We need a way to call internalStartMonitoringTimer once.
    // A common way is to have an explicit init function for the actor or do it in postUpgrade.
    // Since postUpgrade now handles it, this will cover upgrades.
    // For the very first deployment, the timer won't start until the first upgrade.
    // To fix this, we can add a public init function to be called once by the deployer,
    // or use a little trick if possible.
    // For now, relying on postUpgrade. If a main constructor block is needed, that's a bit more advanced.
    // Let's add a simple public function to start it manually for the first time if needed.
    public shared(msg) func initialStartTimerForDeploy(key: Text) : async Bool {
        // Add a simple key check to prevent unauthorized calls.
        // In a real scenario, this would be an operator action.
        if (key != "secret-init-key") { // Replace with a secure mechanism if this were production
            Debug.print("initialStartTimerForDeploy: Unauthorized attempt.");
            return false;
        };
        if (activeTimerId == null) {
             internalStartMonitoringTimer(300);
             logActivity(msg.caller, #portfolio_update, "Initial monitoring timer started.", null);
             return true;
        } else {
            Debug.print("initialStartTimerForDeploy: Timer already seems to be running or was set.");
            return false;
        }
    };
};
// Helper to ensure timer starts on first deployment if not already started by postUpgrade.
// This is a bit of a workaround. A more robust solution might involve an explicit init function.
// However, for this environment, postupgrade should handle subsequent starts.
// The `initialStartTimerForDeploy` function is a manual trigger.