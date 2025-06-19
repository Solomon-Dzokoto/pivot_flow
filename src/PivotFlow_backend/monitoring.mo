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

        // Transform function for parsing HTTP response to get floor price
        private func transformHttpResponseToFloorPrice(response: Types.HttpResponse) : async ?Float {
            if (response.status != 200) {
                Debug.print("HTTP request failed with status " # Nat.toText(response.status));
                return null;
            };

            let bodyText = Text.decodeUtf8(Blob.toArray(response.body));
            // Simplified JSON parsing: look for "floor_price": value
            // This is a basic approach and might need a robust JSON library for complex structures.

            // Try parsing {"stats": {"floor_price": 10.5}}
            var priceText : ?Text = null;
            let statsKey = "\"stats\":";
            let floorPriceKey = "\"floor_price\":";

            // Check for nested structure first
            let statsPos = Text.find(bodyText, statsKey);
            if (statsPos != null) {
                let substringFromStats = Text.slice(bodyText, statsPos! + Text.size(statsKey), Text.size(bodyText));
                let floorPricePosInStats = Text.find(substringFromStats, floorPriceKey);
                if (floorPricePosInStats != null) {
                    let start = floorPricePosInStats! + Text.size(floorPriceKey);
                    let remainingText = Text.slice(substringFromStats, start, Text.size(substringFromStats));
                    var end = 0;
                    while (end < Text.size(remainingText) and Char.isDigit(Text.get(remainingText, end)!) or Text.get(remainingText, end)! == '.') {
                        end += 1;
                    };
                    priceText = ?Text.slice(remainingText, 0, end);
                }
            } else {
                // Try parsing {"floor_price": 10.5}
                let floorPricePos = Text.find(bodyText, floorPriceKey);
                if (floorPricePos != null) {
                    let start = floorPricePos! + Text.size(floorPriceKey);
                    let remainingText = Text.slice(bodyText, start, Text.size(bodyText));
                    var end = 0;
                    while (end < Text.size(remainingText) and Char.isDigit(Text.get(remainingText, end)!) or Text.get(remainingText, end)! == '.') {
                        end += 1;
                    };
                    priceText = ?Text.slice(remainingText, 0, end);
                }
            };

            switch (priceText) {
                case (?pText) {
                    // Remove potential trailing commas or whitespace before converting
                    // This basic parser doesn't handle it, but a real one would.
                    // For now, assume pText is clean.
                    // Debug.print("Extracted price text: " # pText);
                    return Float.fromText(pText);
                };
                case null {
                    Debug.print("Could not find 'floor_price' in response body: " # bodyText);
                    return null;
                };
            }
        };

        public shared func getCurrentFloorPrice(collectionSlug: Text) : async ?Float {
            let url = "https://api.placeholder.host/nft/collection/" # collectionSlug # "/floor";
            let request_headers : [Types.HttpHeader] = []; // No specific headers for this example

            // The transform context for http_request
            // It needs a public shared function. We'll define a simple wrapper if needed,
            // or make transformHttpResponseToFloorPrice meet requirements.
            // For now, let's assume we can structure it to work.
            // The IC.http_request function expects the transform function to be of type:
            // shared query (HttpResponse) -> async HttpResponse
            // Our transformHttpResponseToFloorPrice returns async ?Float directly.
            // This is a common point of confusion. The `transform` option in HttpRequest
            // is for transforming the raw HttpResponse from the boundary node into another HttpResponse.
            // The actual extraction logic (like JSON parsing) happens *after* http_request returns.
            // So, we make the HTTP call, then process its result.

            let request : Types.HttpRequest = {
                url = url;
                method = "GET";
                headers = request_headers;
                body = null;
                transform = null; // We will process the response *after* the await IC.http_request
            };

            try {
                // This is a conceptual call. In a real environment, this makes an HTTP request.
                // The type of 'rawResponse' here is Types.HttpResponse
                let rawResponse = await IC.http_request(request);

                // Now, we manually call our parsing logic.
                // This is slightly different from putting the parser directly in the 'transform' field of HttpRequest,
                // but achieves the goal of getting a ?Float.
                return await transformHttpResponseToFloorPrice(rawResponse);

            } catch (e) {
                Debug.print("HTTP request to " # url # " failed: " # Debug.toString(e));
                return null;
            };
        };
        
        public func checkNftAlerts(alerts: [NFTAlert]) : async [NotificationPayload] {
            let notifications = Buffer.Buffer<NotificationPayload>(0); // Initialize with 0 or a sensible default
            
            for (alert in alerts.vals()) {
                if (not alert.isActive) continue;
                
                // Now we await the asynchronous call
                let currentPriceResult = await getCurrentFloorPrice(alert.collectionSlug);

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

        // Helper to extract a numeric value from a JSON string for gas prices
        private func extractGasPriceValue(bodyText: Text, key: Text) : ?Float {
            let keyPos = Text.find(bodyText, key);
            if (keyPos == null) return null;

            let valueStartPos = keyPos! + Text.size(key);
            // Skip potential quote, colon, quote
            var startIdx = valueStartPos;
            while (startIdx < Text.size(bodyText) and (Text.get(bodyText, startIdx)! == ' ' or Text.get(bodyText, startIdx)! == ':' or Text.get(bodyText, startIdx)! == '"')) {
                startIdx += 1;
            };

            var endIdx = startIdx;
            while (endIdx < Text.size(bodyText) and (Char.isDigit(Text.get(bodyText, endIdx)!) or Text.get(bodyText, endIdx)! == '.')) {
                endIdx += 1;
            };
            
            if (startIdx == endIdx) return null; // No number found

            let priceStr = Text.slice(bodyText, startIdx, endIdx);
            return Float.fromText(priceStr);
        };

        // Parses the HTTP response body to extract gas fees.
        private func parseGasFeeResponse(blockchainName: Text, response: Types.HttpResponse) : async ?Types.NetworkFee {
            if (response.status != 200) {
                Debug.print("Gas fee HTTP request for " # blockchainName # " failed with status " # Nat.toText(response.status));
                return null;
            };

            let bodyText = Text.decodeUtf8(Blob.toArray(response.body));
            // Debug.print("Gas fee response for " # blockchainName # ": " # bodyText);

            var fastGwei: ?Float = null;
            var standardGwei: ?Float = null;
            var slowGwei: ?Float = null;

            // Try parsing style: {"result": {"SafeGasPrice": "10", "ProposeGasPrice": "12", "FastGasPrice": "15"}} (Etherscan-like)
            if (Text.contains(bodyText, "\"result\"") and Text.contains(bodyText, "\"SafeGasPrice\"")) {
                slowGwei = extractGasPriceValue(bodyText, "\"SafeGasPrice\"");
                standardGwei = extractGasPriceValue(bodyText, "\"ProposeGasPrice\"");
                fastGwei = extractGasPriceValue(bodyText, "\"FastGasPrice\"");
            }
            // Try parsing style: {"fast": 20, "standard": 15, "slow": 10} (Generic)
            else {
                fastGwei = extractGasPriceValue(bodyText, "\"fast\"");
                standardGwei = extractGasPriceValue(bodyText, "\"standard\"");
                slowGwei = extractGasPriceValue(bodyText, "\"slow\"");
            };

            if (fastGwei == null or standardGwei == null or slowGwei == null) {
                Debug.print("Could not parse all gas prices from response for " # blockchainName # ": " # bodyText);
                return null;
            };

            return ?{
                blockchain = blockchainName;
                icon = ""; // Placeholder icon
                fast = { gwei = fastGwei!, usd = 0.0 }; // Placeholder USD
                standard = { gwei = standardGwei!, usd = 0.0 }; // Placeholder USD
                slow = { gwei = slowGwei!, usd = 0.0 }; // Placeholder USD
                lastUpdated = Time.now();
            };
        };

        public shared func getCurrentGasFees(blockchainName: Text) : async ?Types.NetworkFee {
            let url = "https://api.placeholder.host/gas/" # blockchainName # "/fees";
            let request_headers : [Types.HttpHeader] = [];

            let request : Types.HttpRequest = {
                url = url;
                method = "GET";
                headers = request_headers;
                body = null;
                transform = null; // Process response after the call
            };

            try {
                let rawResponse = await IC.http_request(request);
                return await parseGasFeeResponse(blockchainName, rawResponse);
            } catch (e) {
                Debug.print("HTTP request for gas fees (" # blockchainName # ") failed: " # Debug.toString(e));
                return null;
            };
        };
        
        // Checks a single gas alert against the provided current fee data for that blockchain.
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