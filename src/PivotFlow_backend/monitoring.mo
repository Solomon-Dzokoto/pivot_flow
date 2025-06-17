import Time "mo:base/Time";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Float "mo:base/Float";
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
        
        // Mock NFT floor price data (in production, this would fetch from APIs)
        private let mockFloorPrices = HashMap.HashMap<Text, Float>(10, Text.equal, Text.hash);
        
        public func init() {
            // Initialize with some mock data
            mockFloorPrices.put("boredapeyachtclub", 24.5);
            mockFloorPrices.put("azuki", 6.2);
            mockFloorPrices.put("cryptopunks", 45.8);
            mockFloorPrices.put("doodles-official", 3.1);
            mockFloorPrices.put("coolcats", 2.5);
        };
        
        public func getCurrentFloorPrice(collectionSlug: Text) : ?Float {
            mockFloorPrices.get(collectionSlug)
        };
        
        public func updateFloorPrice(collectionSlug: Text, newPrice: Float) {
            mockFloorPrices.put(collectionSlug, newPrice);
        };
        
        // Simulate price fluctuations
        public func simulatePriceChanges() {
            for ((slug, price) in mockFloorPrices.entries()) {
                let change = (Float.fromInt(Int.abs(Time.now() % 1000)) / 1000.0 - 0.5) * 0.1; // ±5% change
                let newPrice = Float.max(0.1, price * (1.0 + change));
                mockFloorPrices.put(slug, newPrice);
            };
        };
        
        public func checkNftAlerts(alerts: [NFTAlert]) : [NotificationPayload] {
            let notifications = Buffer.Buffer<NotificationPayload>(10);
            
            for (alert in alerts.vals()) {
                if (not alert.isActive) continue;
                
                switch (getCurrentFloorPrice(alert.collectionSlug)) {
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
        
        public func checkGasAlerts(alerts: [GasAlert], networkFees: [NetworkFee]) : [NotificationPayload] {
            let notifications = Buffer.Buffer<NotificationPayload>(10);
            
            for (alert in alerts.vals()) {
                if (not alert.isActive) continue;
                
                // Find matching network fee
                switch (Array.find<NetworkFee>(networkFees, func(fee) { fee.blockchain == alert.blockchain })) {
                    case (?networkFee) {
                        let currentGwei = switch (alert.priorityTier) {
                            case (#fast) { networkFee.fast.gwei };
                            case (#standard) { networkFee.standard.gwei };
                            case (#slow) { networkFee.slow.gwei };
                        };
                        
                        if (currentGwei <= Float.fromInt(alert.maxGwei)) {
                            let message = alert.blockchain # " gas (" # 
                                (switch (alert.priorityTier) {
                                    case (#fast) { "Fast" };
                                    case (#standard) { "Standard" };
                                    case (#slow) { "Slow" };
                                }) # ") dropped to " # Float.toText(currentGwei) # " Gwei";
                            
                            notifications.add({
                                userId = alert.userId;
                                title = "Gas Price Alert";
                                message = message;
                                alertType = #gas_alert;
                                blockchain = ?alert.blockchain;
                                timestamp = Time.now();
                            });
                        };
                    };
                    case null {
                        Debug.print("No network fee data for blockchain: " # alert.blockchain);
                    };
                };
            };
            
            Buffer.toArray(notifications)
        };
        
        // Simulate gas price fluctuations
        public func simulateGasPriceChanges(networkFees: [NetworkFee]) : [NetworkFee] {
            Array.map<NetworkFee, NetworkFee>(networkFees, func(fee) {
                let fastChange = (Float.fromInt(Int.abs(Time.now() % 1000)) / 1000.0 - 0.5) * 0.2; // ±10% change
                let standardChange = (Float.fromInt(Int.abs((Time.now() + 100) % 1000)) / 1000.0 - 0.5) * 0.15; // ±7.5% change
                let slowChange = (Float.fromInt(Int.abs((Time.now() + 200) % 1000)) / 1000.0 - 0.5) * 0.1; // ±5% change
                
                {
                    blockchain = fee.blockchain;
                    icon = fee.icon;
                    fast = {
                        gwei = Float.max(1.0, fee.fast.gwei * (1.0 + fastChange));
                        usd = fee.fast.usd * (1.0 + fastChange);
                    };
                    standard = {
                        gwei = Float.max(1.0, fee.standard.gwei * (1.0 + standardChange));
                        usd = fee.standard.usd * (1.0 + standardChange);
                    };
                    slow = {
                        gwei = Float.max(1.0, fee.slow.gwei * (1.0 + slowChange));
                        usd = fee.slow.usd * (1.0 + slowChange);
                    };
                    lastUpdated = Time.now();
                }
            })
        };
    };
    
    // Notification service
    public class NotificationService() {
        
        public func sendNotification(payload: NotificationPayload) : async Bool {
            // In production, this would integrate with Telegram/Discord APIs
            Debug.print("Notification for user " # Principal.toText(payload.userId) # ": " # payload.message);
            true
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
        private let notificationService = NotificationService();
        
        public func init() {
            priceMonitor.init();
        };
        
        public func runMonitoringCycle(
            nftAlerts: [NFTAlert],
            gasAlerts: [GasAlert],
            networkFees: [NetworkFee]
        ) : async {
            nftNotifications: [NotificationPayload];
            gasNotifications: [NotificationPayload];
            updatedNetworkFees: [NetworkFee];
        } {
            // Simulate price changes
            priceMonitor.simulatePriceChanges();
            
            // Check NFT alerts
            let nftNotifications = priceMonitor.checkNftAlerts(nftAlerts);
            
            // Simulate gas price changes and check gas alerts
            let updatedNetworkFees = gasMonitor.simulateGasPriceChanges(networkFees);
            let gasNotifications = gasMonitor.checkGasAlerts(gasAlerts, updatedNetworkFees);
            
            // Send notifications (in production)
            if (nftNotifications.size() > 0) {
                let _ = await notificationService.sendBulkNotifications(nftNotifications);
            };
            
            if (gasNotifications.size() > 0) {
                let _ = await notificationService.sendBulkNotifications(gasNotifications);
            };
            
            {
                nftNotifications = nftNotifications;
                gasNotifications = gasNotifications;
                updatedNetworkFees = updatedNetworkFees;
            }
        };
        
        public func getCurrentFloorPrice(collectionSlug: Text) : ?Float {
            priceMonitor.getCurrentFloorPrice(collectionSlug)
        };
    };
}