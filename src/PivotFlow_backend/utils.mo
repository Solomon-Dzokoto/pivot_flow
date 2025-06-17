import Time "mo:base/Time";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Char "mo:base/Char";

module Utils {
    
    // Time utilities
    public func getCurrentTime() : Int {
        Time.now()
    };
    
    public func formatTimestamp(timestamp: Int) : Text {
        // Convert nanoseconds to seconds
        let seconds = timestamp / 1_000_000_000;
        Int.toText(seconds)
    };
    
    // Text utilities
    public func toLowerCase(text: Text) : Text {
        // Simple lowercase conversion for ASCII characters
        let chars = Text.toIter(text);
        var result = "";
        for (char in chars) {
            let code = Char.toNat32(char);
            if (code >= 65 and code <= 90) {
                // Convert uppercase to lowercase
                result := result # Char.toText(Char.fromNat32(code + 32));
            } else {
                result := result # Char.toText(char);
            };
        };
        result
    };
    
    public func isValidEthereumAddress(address: Text) : Bool {
        // Basic Ethereum address validation
        Text.size(address) == 42 and Text.startsWith(address, #text("0x"))
    };
    
    public func isValidSolanaAddress(address: Text) : Bool {
        // Basic Solana address validation (base58, 32-44 characters)
        let size = Text.size(address);
        size >= 32 and size <= 44
    };
    
    // Validation utilities
    public func isValidBlockchain(blockchain: Text) : Bool {
        let validChains = ["Ethereum", "Polygon", "BNB Chain", "Solana"];
        Array.find<Text>(validChains, func(chain) { chain == blockchain }) != null
    };
    
    public func isValidCurrency(currency: Text) : Bool {
        let validCurrencies = ["ETH", "MATIC", "BNB", "SOL", "USD"];
        Array.find<Text>(validCurrencies, func(curr) { curr == currency }) != null
    };
    
    public func isValidGwei(gwei: Nat) : Bool {
        gwei > 0 and gwei <= 1000 // Reasonable gas price range
    };
    
    public func isValidPrice(price: Float) : Bool {
        price >= 0.0 and price <= 1000000.0 // Reasonable price range
    };
    
    // Math utilities
    public func calculatePercentageChange(oldValue: Float, newValue: Float) : Float {
        if (oldValue == 0.0) {
            return 0.0;
        };
        ((newValue - oldValue) / oldValue) * 100.0
    };
    
    public func roundToDecimals(value: Float, decimals: Nat) : Float {
        let multiplier = Float.pow(10.0, Float.fromInt(decimals));
        Float.fromInt(Float.toInt(value * multiplier)) / multiplier
    };
    
    // Array utilities
    public func filterByUserId<T>(
        items: [(Text, T)], 
        userId: Principal,
        getUserId: (T) -> Principal
    ) : [T] {
        let filtered = Array.filter<(Text, T)>(
            items,
            func((_, item)) { Principal.equal(getUserId(item), userId) }
        );
        Array.map<(Text, T), T>(filtered, func((_, item)) { item })
    };
    
    // Sorting utilities
    public func sortByTimestamp<T>(
        items: [T],
        getTimestamp: (T) -> Int,
        ascending: Bool
    ) : [T] {
        Array.sort<T>(
            items,
            func(a: T, b: T) : {#less; #equal; #greater} {
                let timeA = getTimestamp(a);
                let timeB = getTimestamp(b);
                if (ascending) {
                    if (timeA < timeB) { #less }
                    else if (timeA > timeB) { #greater }
                    else { #equal }
                } else {
                    if (timeA > timeB) { #less }
                    else if (timeA < timeB) { #greater }
                    else { #equal }
                }
            }
        )
    };
    
    // Principal utilities
    public func principalToText(principal: Principal) : Text {
        Principal.toText(principal)
    };
    
    public func isAnonymous(principal: Principal) : Bool {
        Principal.isAnonymous(principal)
    };
    
    // Error handling utilities
    public func createErrorMessage(operation: Text, details: Text) : Text {
        operation # " failed: " # details
    };
    
    // Data validation
    public func validateNftAlertData(
        collectionSlug: Text,
        targetPrice: Float,
        currency: Text
    ) : ?Text {
        if (Text.size(collectionSlug) == 0) {
            return ?"Collection slug cannot be empty";
        };
        if (not isValidPrice(targetPrice)) {
            return ?"Invalid target price";
        };
        if (not isValidCurrency(currency)) {
            return ?"Invalid currency";
        };
        null
    };
    
    public func validateGasAlertData(
        blockchain: Text,
        maxGwei: Nat
    ) : ?Text {
        if (not isValidBlockchain(blockchain)) {
            return ?"Invalid blockchain";
        };
        if (not isValidGwei(maxGwei)) {
            return ?"Invalid gas price";
        };
        null
    };
    
    public func validateWalletAddress(
        address: Text,
        blockchain: Text
    ) : ?Text {
        if (not isValidBlockchain(blockchain)) {
            return ?"Invalid blockchain";
        };
        
        switch (blockchain) {
            case ("Ethereum" or "Polygon" or "BNB Chain") {
                if (not isValidEthereumAddress(address)) {
                    return ?"Invalid Ethereum-compatible address";
                };
            };
            case ("Solana") {
                if (not isValidSolanaAddress(address)) {
                    return ?"Invalid Solana address";
                };
            };
            case (_) {
                return ?"Unsupported blockchain";
            };
        };
        
        null
    };
}