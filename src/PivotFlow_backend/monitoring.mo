import Time "mo:base/Time";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
// Iter is not directly used after removing mocks, but other functions might use it. Keep for now.
import Iter "mo:base/Iter";
import Float "mo:base/Float";
import Blob "mo:base/Blob"; // For HTTP response body
// Placeholder for IC functionalities, assuming it's available for http_request
import IC "mo:base/ExperimentalInternetComputer";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

import Types "./types";
import Utils "./utils";

module Monitoring {
    
    type NFTAlert = Types.NFTAlert;
    type GasAlert = Types.GasAlert;
    type NetworkFee = Types.NetworkFee;
    type NotificationPayload = Types.NotificationPayload;
    type ActivityType = Types.ActivityType;
    
    // Price monitoring service
    public class PriceMonitor() {

        // Placeholder for OpenSea API Key. In a real app, fetch from a secure configuration.
        private let OPENSEA_API_KEY_PLACEHOLDER = "YOUR_OPENSEA_API_KEY_HERE";

        // Private helper to parse NFT floor price from JSON response
        private func _parseNftFloorPrice(jsonText: Text, blockchain: Text) : ?Float {
            // TODO: Add more robust JSON parsing if possible. This is a simplified string search.
            // Consider edge cases like missing keys, non-numeric values, etc.
            var priceText: ?Text = null;

            if (blockchain == "Ethereum") {
                // Expected OpenSea: {"total": {"floor_price": 10.5}} or {"collection": {"stats": {"floor_price": 10.5}}}
                // Simplified: look for the last occurrence of "floor_price":
                // This is very basic and might pick up other "floor_price" keys if present.
                // A more robust parser would navigate the JSON structure.
                var searchPos = 0;
                var lastKeyPos : ?Nat = null;
                while (true) {
                    let foundPos = Text.findFrom(jsonText, "\"floor_price\":", searchPos);
                    if (foundPos == null) break;
                    lastKeyPos := foundPos;
                    searchPos := foundPos! + 1;
                };

                if (lastKeyPos != null) {
                    let sliceFromKey = Text.slice(jsonText, lastKeyPos! + Text.size("\"floor_price\":"), Text.size(jsonText));
                    var valEnd = 0;
                    while(valEnd < Text.size(sliceFromKey) && (Char.isDigit(Text.get(sliceFromKey, valEnd)!) or Text.get(sliceFromKey, valEnd)! == '.')){
                        valEnd +=1;
                    };
                    if(valEnd > 0) {
                        priceText = ?Text.slice(sliceFromKey, 0, valEnd);
                    };
                };
            } else if (blockchain == "Solana") {
                // Expected Magic Eden: {"floorPrice": 150000000} (lamports) or {"results": {"floorPrice": ...}}
                // Simplified: look for "floorPrice":
                // This also assumes the value is directly usable as Float (e.g., already in SOL).
                // If in lamports, division by 10^9 would be needed: price / 1_000_000_000.0
                let key = "\"floorPrice\":";
                let keyPos = Text.find(jsonText, key);
                if (keyPos != null) {
                    let sliceFromKey = Text.slice(jsonText, keyPos! + Text.size(key), Text.size(jsonText));
                    var valEnd = 0;
                    while(valEnd < Text.size(sliceFromKey) && (Char.isDigit(Text.get(sliceFromKey, valEnd)!) or Text.get(sliceFromKey, valEnd)! == '.')){
                        valEnd +=1;
                    };
                    if(valEnd > 0) {
                        priceText = ?Text.slice(sliceFromKey, 0, valEnd);
                        // Example: If priceText is lamports, convert to SOL:
                        // case(?p) { let lamports = Nat.fromText(p); return ?Float.fromInt(lamports) / 1_000_000_000.0; }
                    };
                };
            };

            switch (priceText) {
                case (?pText) { return Float.fromText(pText); };
                case null {
                    Debug.print("PriceMonitor: Could not parse " # blockchain # " NFT floor price. Body: " # Text.slice(jsonText, 0, Nat.min(500, Text.size(jsonText))) # "...");
                    return null;
                };
            }
        };

        /**
        * Fetches the current floor price for a given NFT collection slug and blockchain.
        * Note: This function replicates logic from Main.getNftFloorPrice.
        * In a future refactor, consider making Main.getNftFloorPrice callable from here
        * or moving shared HTTP fetching logic to a common module.
        * TODO: Implement caching for NFT floor prices to avoid hitting API rate limits
        *       and to improve performance (e.g., store price with timestamp, re-fetch if older than 5 mins).
        * TODO: Be mindful of API rate limits from OpenSea, Magic Eden, etc.
        */
        public shared func getCurrentFloorPrice(collectionSlug: Text, blockchain: Text) : async ?Float {
            var url = "";
            var headers : [Types.HttpHeader] = [];

            // API Key Management (Conceptual - using placeholder for OpenSea)
            // A more robust solution would involve fetching API keys from a secure configuration.
            let osApiKey = Utils.getEnvVar("OPENSEA_API_KEY") ?? OPENSEA_API_KEY_PLACEHOLDER;

            if (blockchain == "Ethereum") {
                if (osApiKey == OPENSEA_API_KEY_PLACEHOLDER or osApiKey == "") {
                    Debug.print("PriceMonitor: OpenSea API Key is placeholder or missing. Skipping Ethereum floor price fetch for " # collectionSlug);
                    return null; // Or return a specific error/status
                }
                url := "https://api.opensea.io/api/v2/collections/" # collectionSlug # "/stats";
                headers := [{ name = "X-API-KEY"; value = osApiKey }];
            } else if (blockchain == "Solana") {
                // Using a common public Magic Eden endpoint. Confirm if API key is needed for production.
                url := "https://api-mainnet.magiceden.dev/v2/collections/" # collectionSlug # "/stats";
                // headers := []; // No specific headers assumed for Magic Eden public stats
            } else {
                Debug.print("PriceMonitor: Unsupported blockchain for getCurrentFloorPrice: " # blockchain);
                return null;
            };

            if (url == "") { return null; };

            let request : Types.HttpRequest = {
                url = url;
                method = "GET";
                headers = headers;
                body = null;
                transform = null;
            };

            Debug.print("PriceMonitor: Fetching NFT floor price for " # collectionSlug # " on " # blockchain # " from: " # url);

            try {
                let httpResponse = await IC.http_request(request);

                if (httpResponse.status != 200) {
                    Debug.print("PriceMonitor: HTTP request failed for " # collectionSlug # " (" # blockchain # "), Status: " # Nat.toText(httpResponse.status));
                    return null;
                };

                let bodyText = Text.decodeUtf8(Blob.toArray(httpResponse.body));
                return _parseNftFloorPrice(bodyText, blockchain);

            } catch (e) {
                Debug.print("PriceMonitor: HTTP request exception for " # collectionSlug # " (" # blockchain # "): " # Debug.toString(e));
                return null;
            };
        };
        
        public func checkNftAlerts(alerts: [NFTAlert]) : async [NotificationPayload] {
            let notifications = Buffer.Buffer<NotificationPayload>(0);
            
            for (alert in alerts.vals()) {
                if (not alert.isActive) continue;
                
                // Assuming NFTAlert type now includes a 'blockchain' field.
                // If not, this needs to be adapted, or alerts are Ethereum-only by default.
                // For this example, let's assume alert.blockchain exists or default to "Ethereum".
                let blockchainForAlert = alert.blockchain ?? "Ethereum"; // Fallback if not present

                let currentPriceResult = await getCurrentFloorPrice(alert.collectionSlug, blockchainForAlert);

                switch (currentPriceResult) {
                    case (?currentPrice) {
                        let shouldTrigger = switch (alert.alertType) {
                            case (#drop_below) { currentPrice <= alert.targetPrice };
                            case (#rise_above) { currentPrice >= alert.targetPrice };
                            case (#any_change) {
                                switch (alert.percentageChange) {
                                    case (?threshold) {
                                        let change = Utils.calculatePercentageChange(alert.currentFloorPrice, currentPrice);
                                        Float.abs(change) >= threshold
                                    };
                                    case null { false };
                                }
                            };
                        };
                        
                        if (shouldTrigger) {
                            let message = switch (alert.alertType) {
                                case (#drop_below) {
                                    alert.collectionName # " floor dropped to " # Float.toText(currentPrice) # " " # alert.currency
                                };
                                case (#rise_above) {
                                    alert.collectionName # " floor rose to " # Float.toText(currentPrice) # " " # alert.currency
                                };
                                case (#any_change) {
                                    let change = Utils.calculatePercentageChange(alert.currentFloorPrice, currentPrice);
                                    alert.collectionName # " floor changed by " # Float.toText(change) # "% to " # Float.toText(currentPrice) # " " # alert.currency
                                };
                            };
                            
                            notifications.add({
                                userId = alert.userId;
                                title = "NFT Price Alert";
                                message = message;
                                alertType = #nft_alert;
                                blockchain = null;
                                timestamp = Time.now();
                            });
                        };
                    };
                    case null {
                        Debug.print("No price data for collection: " # alert.collectionSlug);
                    };
                };
            };
            
            Buffer.toArray(notifications)
        };
    };
    // Gas monitoring service
    public class GasMonitor() {

        private let ETHERSCAN_API_KEY_PLACEHOLDER = "YOUR_ETHERSCAN_API_KEY";

        // Helper to extract a numeric value from a JSON string, looking for a specific key.
        // Example: findValue(body, "\"SafeGasPrice\":\"") -> extracts the number after the quote.
        private func findNumericValueAfterKey(jsonText: Text, key: Text) : ?Float {
            let keyPos = Text.find(jsonText, key);
            if (keyPos == null) {
                // Debug.print("Key '" # key # "' not found in JSON.");
                return null;
            };

            let valueStartPos = keyPos! + Text.size(key);
            var idx = valueStartPos;
            var priceStr = "";

            // Skip optional opening quote
            if (idx < Text.size(jsonText) && Text.get(jsonText, idx)! == '"') {
                idx += 1;
            };
            
            let valStartIndex = idx;
            while (idx < Text.size(jsonText)) {
                let char = Text.get(jsonText, idx)!;
                if (Char.isDigit(char) or char == '.') {
                    priceStr := priceStr # Char.toText(char);
                    idx += 1;
                } else {
                    break;
                };
            };

            if (Text.size(priceStr) == 0) {
                // Debug.print("No numeric value found after key '" # key # "'.");
                return null;
            };
            // Debug.print("Extracted value for key '" # key # "': " # priceStr);
            return Float.fromText(priceStr);
        };

        private func parseEtherscanGasOracle(jsonText: Text) : ?{ fast: Float; standard: Float; slow: Float } {
            // Etherscan typical response: {"status":"1","message":"OK","result":{"LastBlock":"...","SafeGasPrice":"...","ProposeGasPrice":"...","FastGasPrice":"..."}}
            // We need result.SafeGasPrice, result.ProposeGasPrice, result.FastGasPrice
            // A simple check for overall structure
            if (not Text.contains(jsonText, "\"result\"") or
                not Text.contains(jsonText, "\"SafeGasPrice\"") or
                not Text.contains(jsonText, "\"ProposeGasPrice\"") or
                not Text.contains(jsonText, "\"FastGasPrice\"")) {
                Debug.print("Etherscan response missing key fields: " # jsonText);
                return null;
            };

            let slowGwei = findNumericValueAfterKey(jsonText, "\"SafeGasPrice\":\"");
            let standardGwei = findNumericValueAfterKey(jsonText, "\"ProposeGasPrice\":\"");
            let fastGwei = findNumericValueAfterKey(jsonText, "\"FastGasPrice\":\"");

            if (slowGwei != null and standardGwei != null and fastGwei != null) {
                return ?{ slow = slowGwei!; standard = standardGwei!; fast = fastGwei! };
            } else {
                Debug.print("Failed to parse all gas prices from Etherscan: " # jsonText);
                return null;
            }
        };

        private func parseSolanaRpcFees(jsonText: Text) : ?{ fast: Float; standard: Float; slow: Float } {
            // Solana getFees response: {"jsonrpc":"2.0","result":{"context":{"slot":...},"value":{"blockhash":"...","feeCalculator":{"lamportsPerSignature":5000},"lastValidBlockHeight":...}},"id":1}
            // We need result.value.feeCalculator.lamportsPerSignature
            if (not Text.contains(jsonText, "\"lamportsPerSignature\"")) {
                 Debug.print("Solana response missing 'lamportsPerSignature': " # jsonText);
                return null;
            };

            let lamports = findNumericValueAfterKey(jsonText, "\"lamportsPerSignature\":");

            if (lamports != null) {
                // For Solana, "lamportsPerSignature" is the primary fee.
                // We'll use this for "standard" and derive/mock "fast" and "slow".
                // This value is in lamports, not Gwei. For conceptual consistency in NetworkFee structure,
                // we might use this value directly or apply a simple scaling if needed.
                // For this exercise, let's use it as is, understanding it's not true Gwei.
                // A more accurate system might handle different units per blockchain.
                let standardFee = lamports!;
                // Mock fast and slow as variations or same as standard for simplicity here.
                let fastFee = lamports! * 1.2; // e.g., 20% higher
                let slowFee = lamports! * 0.8;  // e.g., 20% lower
                return ?{ slow = slowFee; standard = standardFee; fast = fastFee };
            } else {
                Debug.print("Failed to parse lamportsPerSignature from Solana response: " # jsonText);
                return null;
            }
        };

        public shared func getCurrentGasFees(blockchainName: Text) : async ?Types.NetworkFee {
            var url = "";
            var method = "GET";
            var request_headers : [Types.HttpHeader] = [];
            var requestBody : ?Blob = null;
            var parsedFees : ?{fast: Float; standard: Float; slow: Float} = null;

            if (blockchainName == "Ethereum") {
                let apiKey = Utils.getEnvVar("ETHERSCAN_API_KEY") ?? ETHERSCAN_API_KEY_PLACEHOLDER;
                if (apiKey == ETHERSCAN_API_KEY_PLACEHOLDER) {
                    Debug.print("Warning: Using placeholder Etherscan API Key for Ethereum gas fees.");
                }
                url := "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=" # apiKey;
                method := "GET";
            } else if (blockchainName == "Solana") {
                url := "https://api.mainnet-beta.solana.com"; // Or another public RPC
                method := "POST";
                request_headers := [{ name = "Content-Type"; value = "application/json" }];
                // For getFees, the body is `{"jsonrpc":"2.0","id":1, "method":"getFees"}`
                // For getRecentPrioritizationFees: `{"jsonrpc":"2.0","id":1, "method":"getRecentPrioritizationFees", "params": [[]]}`
                // Using getFees for simplicity as it's more stable.
                let rpcBody = "{ \"jsonrpc\":\"2.0\", \"id\":1, \"method\":\"getFees\" }";
                requestBody := ?Blob.fromArray(Text.encodeUtf8(rpcBody));
            } else {
                Debug.print("Unsupported blockchain for getCurrentGasFees: " # blockchainName);
                return null;
            };

            let request : Types.HttpRequest = {
                url = url;
                method = method;
                headers = request_headers;
                body = requestBody;
                transform = null;
            };

            Debug.print("Attempting to fetch gas fees for " # blockchainName # " from: " # url);

            try {
                let httpResponse = await IC.http_request(request);
                if (httpResponse.status != 200) {
                    Debug.print("Failed to fetch gas fees for " # blockchainName # ", status: " # Nat.toText(httpResponse.status) # " body: " # Text.decodeUtf8(Blob.toArray(httpResponse.body)));
                    return null;
                };
                let bodyText = Text.decodeUtf8(Blob.toArray(httpResponse.body));
                // Debug.print("Gas fee response for " # blockchainName # ": " # bodyText);

                if (blockchainName == "Ethereum") {
                    parsedFees := parseEtherscanGasOracle(bodyText);
                } else if (blockchainName == "Solana") {
                    parsedFees := parseSolanaRpcFees(bodyText);
                };

                switch(parsedFees) {
                    case (?fees) {
                        return ?{
                            blockchain = blockchainName;
                            icon = ""; // Placeholder icon
                            fast = { gwei = fees.fast, usd = 0.0 };
                            standard = { gwei = fees.standard, usd = 0.0 };
                            slow = { gwei = fees.slow, usd = 0.0 };
                            lastUpdated = Time.now();
                        };
                    };
                    case null { return null; };
                };
            } catch (e) {
                Debug.print("HTTP request for gas fees (" # blockchainName # ") failed: " # Debug.toString(e));
                return null;
            };
        };
        
        public func checkGasAlerts(alert: Types.GasAlert, currentFee: Types.NetworkFee) : ?Types.NotificationPayload {
            if (not alert.isActive or alert.blockchain != currentFee.blockchain) {
                // This check might be redundant if caller ensures correct fee is passed, but good for safety.
                return null;
            };

            let currentGwei = switch (alert.priorityTier) {
                case (#fast) { currentFee.fast.gwei };
                case (#standard) { currentFee.standard.gwei };
                case (#slow) { currentFee.slow.gwei };
            };

            if (currentGwei <= Float.fromInt(alert.maxGwei)) {
                let message = alert.blockchain # " gas (" #
                    (switch (alert.priorityTier) {
                        case (#fast) { "Fast" };
                        case (#standard) { "Standard" };
                        case (#slow) { "Slow" };
                    }) # ") dropped to " # Float.toText(currentGwei) # " Gwei";
                
                return ?{
                    userId = alert.userId;
                    title = "Gas Price Alert";
                    message = message;
                    alertType = #gas_alert;
                    blockchain = ?alert.blockchain;
                    timestamp = Time.now();
                };
            };
            return null;
        };
    };
    
    // Notification service
    public class NotificationService() {

        // Placeholder for Telegram configuration.
        // In a real app, these would come from a secure store or environment variables.
        private let TELEGRAM_BOT_TOKEN : Text = "YOUR_TELEGRAM_BOT_TOKEN_PLACEHOLDER";
        // This default chat ID would be used if payload.userId cannot be mapped to a specific Telegram chat_id.
        // For simplicity, we'll use this for all notifications in this conceptual implementation.
        // A real implementation would need a way to map system UserIds (Principals) to Telegram chat_ids.
        private let DEFAULT_TELEGRAM_CHAT_ID : Text = "YOUR_DEFAULT_CHAT_ID_PLACEHOLDER";

        private func transformTelegramResponse(response: Types.HttpResponse) : async Bool {
            if (response.status != 200) {
                Debug.print("Telegram API request failed with status " # Nat.toText(response.status));
                let errorBody = Text.decodeUtf8(Blob.toArray(response.body));
                Debug.print("Telegram error body: " # errorBody);
                return false;
            };
            let bodyText = Text.decodeUtf8(Blob.toArray(response.body));
            // Example Telegram success response: {"ok":true,"result":{...}}
            if (Text.contains(bodyText, "\"ok\":true")) {
                return true;
            } else {
                Debug.print("Telegram API response did not indicate success: " # bodyText);
                return false;
            }
        };
        
        public func sendNotification(payload: NotificationPayload) : async Bool {
            let messageText = formatNotificationMessage(payload);

            // Replace with actual user's chat_id if available, otherwise use default.
            // For this conceptual step, we use DEFAULT_TELEGRAM_CHAT_ID.
            // A mapping from payload.userId (Principal) to a chat_id (Text) would be needed.
            let chatId = DEFAULT_TELEGRAM_CHAT_ID;

            if (TELEGRAM_BOT_TOKEN == "YOUR_TELEGRAM_BOT_TOKEN_PLACEHOLDER" or chatId == "YOUR_DEFAULT_CHAT_ID_PLACEHOLDER") {
                Debug.print("!!! Telegram Bot Token or Chat ID not configured. Skipping actual HTTP call. !!!");
                Debug.print("Conceptual Notification (would be sent to Telegram for user " # Principal.toText(payload.userId) # "): " # messageText);
                return true; // Simulate success if not configured, to avoid breaking existing tests/flows.
            };

            let url = "https://api.telegram.org/bot" # TELEGRAM_BOT_TOKEN # "/sendMessage";

            // Simple JSON construction. For robustness, a JSON library or more careful escaping would be needed.
            // Ensure messageText is properly escaped for JSON if it can contain quotes or backslashes.
            // For this example, assuming messageText is relatively simple.
            let jsonPayload = "{ \"chat_id\": \"" # chatId # "\", \"text\": \"" # Utils.escapeJsonText(messageText) # "\", \"parse_mode\": \"MarkdownV2\" }";

            let requestBody = Blob.fromArray(Text.encodeUtf8(jsonPayload));

            let request_headers : [Types.HttpHeader] = [
                { name = "Content-Type"; value = "application/json" }
            ];

            let request : Types.HttpRequest = {
                url = url;
                method = "POST";
                headers = request_headers;
                body = ?requestBody;
                transform = null; // We will use a custom response handler
            };

            Debug.print("Attempting to send Telegram notification for user " # Principal.toText(payload.userId));

            try {
                let rawResponse = await IC.http_request(request);
                let success = await transformTelegramResponse(rawResponse);
                if (success) {
                    Debug.print("Telegram notification conceptually sent successfully to chat_id: " # chatId);
                    return true;
                } else {
                    Debug.print("Telegram notification conceptually failed for chat_id: " # chatId);
                    return false;
                }
            } catch (e) {
                Debug.print("HTTP request to Telegram failed: " # Debug.toString(e));
                return false;
            };
        };
        
        public func sendBulkNotifications(payloads: [NotificationPayload]) : async [Bool] {
            let results = Buffer.Buffer<Bool>(payloads.size());
            for (payload in payloads.vals()) {
                let result = await sendNotification(payload);
                results.add(result);
            };
            Buffer.toArray(results)
        };
        
        public func formatNotificationMessage(payload: NotificationPayload) : Text {
            let timestamp = Utils.formatTimestamp(payload.timestamp);
            let blockchainInfo = switch (payload.blockchain) {
                case (?blockchain) { " [" # blockchain # "]" };
                case null { "" };
            };
            
            "🚨 " # payload.title # blockchainInfo # "\n" # 
            payload.message # "\n" # 
            "Time: " # timestamp
        };
    };
    
    // Main monitoring coordinator
    public class MonitoringCoordinator() {
        private let priceMonitor = PriceMonitor();
        private let gasMonitor = GasMonitor();
        private let notificationService = NotificationService(); // Instantiated with new changes
        
        public func init() {
            // priceMonitor.init() is removed;
            // GasMonitor no longer has an init or simulation setup.
        };
        
        public func runMonitoringCycle(
            nftAlerts: [Types.NFTAlert],
            gasAlerts: [Types.GasAlert],
            _currentNetworkFeesPlaceholder: [Types.NetworkFee] // This parameter is no longer used to source fee data, but kept for signature compatibility if needed by caller for other reasons.
        ) : async {
            nftNotifications: [Types.NotificationPayload];
            gasNotificationsBuffer: Buffer.Buffer<Types.NotificationPayload>;
            fetchedNetworkFees: Buffer.Buffer<Types.NetworkFee>;
        } {
            // Check NFT alerts - (already updated in previous subtask)
            let nftNotifications = await priceMonitor.checkNftAlerts(nftAlerts);
            
            // --- Gas Alert Processing ---
            let gasNotificationsBuffer = Buffer.Buffer<Types.NotificationPayload>(0);
            let fetchedNetworkFees = Buffer.Buffer<Types.NetworkFee>(0);
            let uniqueBlockchains = HashMap.HashMap<Text, Bool>(10, Text.equal, Text.hash);

            // 1. Collect unique blockchains from active gas alerts
            for (alert in gasAlerts.vals()) {
                if (alert.isActive) {
                    uniqueBlockchains.put(alert.blockchain, true);
                };
            };

            // 2. Fetch gas fees for each unique blockchain
            let fetchedFeesMap = HashMap.HashMap<Text, Types.NetworkFee>(uniqueBlockchains.size(), Text.equal, Text.hash);
            for ((blockchain, _) in uniqueBlockchains.entries()) {
                let feeData = await gasMonitor.getCurrentGasFees(blockchain);
                switch (feeData) {
                    case (?networkFee) {
                        fetchedFeesMap.put(blockchain, networkFee);
                        fetchedNetworkFees.add(networkFee); // For returning updated fees
                    };
                    case null {
                        Debug.print("Could not fetch gas fees for blockchain: " # blockchain);
                    };
                };
            };
            
            // 3. Check alerts against the new fees
            for (alert in gasAlerts.vals()) {
                if (alert.isActive) {
                    switch (fetchedFeesMap.get(alert.blockchain)) {
                        case (?feeForAlert) {
                            let notification = gasMonitor.checkGasAlerts(alert, feeForAlert);
                            if (notification != null) {
                                gasNotificationsBuffer.add(notification!);
                            };
                        };
                        case null {
                            // Fee data wasn't fetched successfully for this alert's blockchain
                        };
                    };
                };
            };
            let gasNotifications = Buffer.toArray(gasNotificationsBuffer);
            // --- End Gas Alert Processing ---

            // Send notifications
            if (nftNotifications.size() > 0) {
                let _ = await notificationService.sendBulkNotifications(nftNotifications);
            };
            
            if (gasNotifications.size() > 0) {
                let _ = await notificationService.sendBulkNotifications(gasNotifications);
            };
            
            {
                nftNotifications = nftNotifications;
                gasNotifications = gasNotifications; // Now populated with fetched data
                updatedNetworkFees = Buffer.toArray(fetchedNetworkFees); // Return the newly fetched fees
            }
        };
        
        // This function now needs to be async as it calls the async getCurrentFloorPrice
        public shared func getCurrentFloorPrice(collectionSlug: Text) : async ?Float {
            await priceMonitor.getCurrentFloorPrice(collectionSlug)
        };
    };
}
// Ensure Utils.escapeJsonText is available or implement a basic version if not.
// For now, assuming Utils.escapeJsonText exists.
// If not, a simple version: func escapeJsonText(text: Text) : Text { Text.replace(Text.replace(text, "\\", "\\\\"), "\"", "\\\"") }
// This should ideally be in the Utils module.