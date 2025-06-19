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

    // HTTP Types for Internet Computer outcalls
    // Based on mo:base/ExperimentalInternetComputer.Http

    public type HttpHeader = {
        name: Text;
        value: Text;
    };

    // HttpRequest type for IC http_request calls
    // The `transform` function signature is simplified here.
    // It directly expects a function that processes HttpResponse and returns the desired type,
    // rather than a context object with a function name.
    public type HttpRequest = {
        url: Text;
        method: Text; // "GET", "POST", etc.
        headers: [HttpHeader];
        body: ?Blob; // Optional body
        // The transform function itself, not a context.
        // The actual type of 'a depends on what the transform function is supposed to return.
        // For the floor price, it would be async ?Float.
        // However, the system http_request type expects a specific structure for transform.
        // Let's align with the common IC definition for the transform field.
        transform: ?{
            function: (HttpResponse) -> async HttpResponse; // This is standard
            context: ?Blob;
        };
        // Optional: Fields for controlling HTTP outcalls specific to IC
        // max_response_bytes : ?Nat64;
        // certificate_version : ?Nat16; // For certified data, if needed by API
    };

    // HttpResponse type from an IC http_request call
    public type HttpResponse = {
        status: Nat; // e.g., 200, 404
        headers: [HttpHeader];
        body: Blob;
        // Optional: For handling streamed responses, if ever needed
        // streaming_strategy : ?StreamingStrategy;
    };

    // Type for CoinGecko price information
    public type TokenPriceInfo = {
      id: Text;             // e.g., "ethereum", "solana"
      current_price: Float; // Price in USD
    };
}