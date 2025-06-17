import Principal "mo:base/Principal";
import Time "mo:base/Time";

module Types {
    
    public type Principal = Principal.Principal;
    public type Time = Int;
    
    // User types
    public type User = {
        principal: Principal;
        createdAt: Time;
        lastLogin: Time;
        isOperator: Bool;
    };
    
    // Alert types
    public type AlertType = {
        #drop_below;
        #rise_above;
        #any_change;
    };
    
    public type PriorityTier = {
        #fast;
        #standard;
        #slow;
    };
    
    public type ActivityType = {
        #nft_alert;
        #gas_alert;
        #portfolio_update;
    };
    
    // NFT Alert
    public type NFTAlert = {
        id: Text;
        userId: Principal;
        collectionSlug: Text;
        collectionName: Text;
        targetPrice: Float;
        currency: Text;
        alertType: AlertType;
        gasLimit: ?Nat;
        percentageChange: ?Float;
        currentFloorPrice: Float;
        lastChecked: Time;
        isActive: Bool;
        createdAt: Time;
    };
    
    // Gas Alert
    public type GasAlert = {
        id: Text;
        userId: Principal;
        blockchain: Text;
        maxGwei: Nat;
        priorityTier: PriorityTier;
        isActive: Bool;
        createdAt: Time;
    };
    
    // Wallet Address
    public type WalletAddress = {
        id: Text;
        owner: Principal;
        address: Text;
        blockchain: Text;
        name: ?Text;
        createdAt: Time;
    };
    
    // Activity Item
    public type ActivityItem = {
        id: Text;
        userId: Principal;
        activityType: ActivityType;
        message: Text;
        blockchain: ?Text;
        timestamp: Time;
    };
    
    // Network Fee structures
    public type FeeInfo = {
        gwei: Float;
        usd: Float;
    };
    
    public type NetworkFee = {
        blockchain: Text;
        icon: Text;
        fast: FeeInfo;
        standard: FeeInfo;
        slow: FeeInfo;
        lastUpdated: Time;
    };
    
    // NFT Item
    public type NFTItem = {
        id: Text;
        userId: Principal;
        collectionName: Text;
        tokenId: Text;
        imageUrl: Text;
        floorPrice: Float;
        currency: Text;
        marketplaceUrl: Text;
        walletAddress: Text;
        blockchain: Text;
        lastUpdated: Time;
    };
    
    // Settings types
    public type ApiKeys = {
        opensea: Text;
        etherscan: Text;
        polygonscan: Text;
        bscscan: Text;
        solana: Text;
    };
    
    public type NotificationSettings = {
        telegramBotToken: Text;
        discordBotToken: Text;
        adminChatId: Text;
        enableNftAlerts: Bool;
        enableGasAlerts: Bool;
        enablePortfolioUpdates: Bool;
    };
    
    public type UISettings = {
        darkMode: Bool;
        animationSpeed: Float;
    };
    
    public type AppSettings = {
        apiKeys: ApiKeys;
        notifications: NotificationSettings;
        ui: UISettings;
    };
    
    // API Response wrapper
    public type ApiResponse<T> = {
        #ok: T;
        #err: Text;
    };
    
    // External API types for future integration
    public type OpenSeaCollection = {
        slug: Text;
        name: Text;
        floorPrice: ?Float;
        currency: Text;
    };
    
    public type GasPrice = {
        blockchain: Text;
        fast: Float;
        standard: Float;
        slow: Float;
        timestamp: Time;
    };
    
    // Notification types
    public type NotificationPayload = {
        userId: Principal;
        title: Text;
        message: Text;
        alertType: ActivityType;
        blockchain: ?Text;
        timestamp: Time;
    };
}