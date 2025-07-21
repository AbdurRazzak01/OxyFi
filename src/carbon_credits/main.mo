import Time "mo:base/Time";
import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";

actor CarbonCredits {
    
    // Types
    public type TokenId = Text;
    public type UserId = Principal;
    public type ProjectId = Text;
    
    public type CarbonCredit = {
        id: TokenId;
        projectId: ProjectId;
        amount: Float; // tonnes CO2
        price: Float; // per tonne
        vintage: Nat; // year
        status: {#pending; #verified; #retired; #traded};
        owner: UserId;
        createdAt: Int;
        verificationData: {
            methodology: Text;
            verificationStandard: Text;
            verifier: Text;
            verificationDate: ?Int;
            additionalBenefits: [Text];
        };
        metadata: {
            projectName: Text;
            location: Text;
            treeSpecies: [Text];
            biodiversityImpact: Float;
            socialImpact: Float;
        };
    };
    
    public type ImpactToken = {
        id: TokenId;
        symbol: Text;
        name: Text;
        projectId: ProjectId;
        co2Equivalent: Float; // kg CO2 per token
        price: Float;
        owner: UserId;
        createdAt: Int;
        stakingRewards: Float;
        lastRewardClaim: Int;
    };
    
    public type MarketplaceListing = {
        id: Text;
        sellerId: UserId;
        assetType: {#carbon_credit; #impact_token};
        assetId: TokenId;
        quantity: Float;
        price: Float;
        currency: {#USD; #SOL; #ICP; #ETH};
        status: {#active; #sold; #cancelled; #expired};
        listedAt: Int;
        expiresAt: ?Int;
    };
    
    public type TradeOrder = {
        id: Text;
        userId: UserId;
        orderType: {#buy; #sell};
        assetType: {#carbon_credit; #impact_token};
        assetId: TokenId;
        quantity: Float;
        price: Float;
        status: {#pending; #filled; #cancelled; #expired};
        createdAt: Int;
        filledAt: ?Int;
    };
    
    // State
    private stable var nextTokenId: Nat = 0;
    private stable var nextListingId: Nat = 0;
    private stable var nextOrderId: Nat = 0;
    
    private var carbonCredits = Map.HashMap<TokenId, CarbonCredit>(10, Text.equal, Text.hash);
    private var impactTokens = Map.HashMap<TokenId, ImpactToken>(10, Text.equal, Text.hash);
    private var userCarbonCredits = Map.HashMap<UserId, [TokenId]>(10, Principal.equal, Principal.hash);
    private var userImpactTokens = Map.HashMap<UserId, [TokenId]>(10, Principal.equal, Principal.hash);
    private var projectCredits = Map.HashMap<ProjectId, [TokenId]>(10, Text.equal, Text.hash);
    private var projectTokens = Map.HashMap<ProjectId, [TokenId]>(10, Text.equal, Text.hash);
    private var marketplaceListings = Map.HashMap<Text, MarketplaceListing>(10, Text.equal, Text.hash);
    private var tradeOrders = Map.HashMap<Text, TradeOrder>(10, Text.equal, Text.hash);
    
    // Helper functions
    private func generateTokenId(): TokenId {
        let id = "token_" # Nat.toText(nextTokenId);
        nextTokenId += 1;
        id
    };
    
    private func generateListingId(): Text {
        let id = "listing_" # Nat.toText(nextListingId);
        nextListingId += 1;
        id
    };
    
    private func generateOrderId(): Text {
        let id = "order_" # Nat.toText(nextOrderId);
        nextOrderId += 1;
        id
    };
    
    private func getCurrentTime(): Int {
        Time.now()
    };
    
    // Carbon Credit Management
    public shared(msg) func mintCarbonCredit(
        projectId: ProjectId,
        amount: Float,
        price: Float,
        vintage: Nat,
        methodology: Text,
        verificationStandard: Text,
        verifier: Text,
        additionalBenefits: [Text],
        projectName: Text,
        location: Text,
        treeSpecies: [Text],
        biodiversityImpact: Float,
        socialImpact: Float
    ): async Result.Result<CarbonCredit, Text> {
        let caller = msg.caller;
        let tokenId = generateTokenId();
        
        let carbonCredit: CarbonCredit = {
            id = tokenId;
            projectId = projectId;
            amount = amount;
            price = price;
            vintage = vintage;
            status = #pending;
            owner = caller;
            createdAt = getCurrentTime();
            verificationData = {
                methodology = methodology;
                verificationStandard = verificationStandard;
                verifier = verifier;
                verificationDate = null;
                additionalBenefits = additionalBenefits;
            };
            metadata = {
                projectName = projectName;
                location = location;
                treeSpecies = treeSpecies;
                biodiversityImpact = biodiversityImpact;
                socialImpact = socialImpact;
            };
        };
        
        carbonCredits.put(tokenId, carbonCredit);
        
        // Add to user's credits
        switch (userCarbonCredits.get(caller)) {
            case null {
                userCarbonCredits.put(caller, [tokenId]);
            };
            case (?existing) {
                userCarbonCredits.put(caller, Array.append(existing, [tokenId]));
            };
        };
        
        // Add to project's credits
        switch (projectCredits.get(projectId)) {
            case null {
                projectCredits.put(projectId, [tokenId]);
            };
            case (?existing) {
                projectCredits.put(projectId, Array.append(existing, [tokenId]));
            };
        };
        
        #ok(carbonCredit)
    };
    
    public func verifyCarbonCredit(tokenId: TokenId): async Result.Result<CarbonCredit, Text> {
        switch (carbonCredits.get(tokenId)) {
            case null {
                #err("Carbon credit not found")
            };
            case (?credit) {
                let verifiedCredit: CarbonCredit = {
                    credit with
                    status = #verified;
                    verificationData = {
                        credit.verificationData with
                        verificationDate = ?getCurrentTime();
                    };
                };
                carbonCredits.put(tokenId, verifiedCredit);
                #ok(verifiedCredit)
            };
        }
    };
    
    public shared(msg) func retireCarbonCredit(tokenId: TokenId): async Result.Result<CarbonCredit, Text> {
        let caller = msg.caller;
        
        switch (carbonCredits.get(tokenId)) {
            case null {
                #err("Carbon credit not found")
            };
            case (?credit) {
                if (credit.owner != caller) {
                    #err("Only owner can retire credit")
                } else {
                    let retiredCredit: CarbonCredit = {
                        credit with
                        status = #retired;
                    };
                    carbonCredits.put(tokenId, retiredCredit);
                    #ok(retiredCredit)
                }
            };
        }
    };
    
    // Impact Token Management
    public shared(msg) func mintImpactToken(
        projectId: ProjectId,
        symbol: Text,
        name: Text,
        co2Equivalent: Float,
        price: Float
    ): async Result.Result<ImpactToken, Text> {
        let caller = msg.caller;
        let tokenId = generateTokenId();
        
        let impactToken: ImpactToken = {
            id = tokenId;
            symbol = symbol;
            name = name;
            projectId = projectId;
            co2Equivalent = co2Equivalent;
            price = price;
            owner = caller;
            createdAt = getCurrentTime();
            stakingRewards = 0.0;
            lastRewardClaim = getCurrentTime();
        };
        
        impactTokens.put(tokenId, impactToken);
        
        // Add to user's tokens
        switch (userImpactTokens.get(caller)) {
            case null {
                userImpactTokens.put(caller, [tokenId]);
            };
            case (?existing) {
                userImpactTokens.put(caller, Array.append(existing, [tokenId]));
            };
        };
        
        // Add to project's tokens
        switch (projectTokens.get(projectId)) {
            case null {
                projectTokens.put(projectId, [tokenId]);
            };
            case (?existing) {
                projectTokens.put(projectId, Array.append(existing, [tokenId]));
            };
        };
        
        #ok(impactToken)
    };
    
    public shared(msg) func claimStakingRewards(tokenId: TokenId): async Result.Result<Float, Text> {
        let caller = msg.caller;
        
        switch (impactTokens.get(tokenId)) {
            case null {
                #err("Impact token not found")
            };
            case (?token) {
                if (token.owner != caller) {
                    #err("Only owner can claim rewards")
                } else {
                    let currentTime = getCurrentTime();
                    let timeDiff = currentTime - token.lastRewardClaim;
                    let rewardRate = 0.05; // 5% annual reward
                    let newRewards = (Float.fromInt(timeDiff) / (365.0 * 24.0 * 60.0 * 60.0 * 1000000000.0)) * rewardRate * token.co2Equivalent;
                    
                    let updatedToken: ImpactToken = {
                        token with
                        stakingRewards = token.stakingRewards + newRewards;
                        lastRewardClaim = currentTime;
                    };
                    
                    impactTokens.put(tokenId, updatedToken);
                    #ok(newRewards)
                }
            };
        }
    };
    
    // Transfer Functions
    public shared(msg) func transferCarbonCredit(tokenId: TokenId, to: UserId): async Result.Result<Bool, Text> {
        let caller = msg.caller;
        
        switch (carbonCredits.get(tokenId)) {
            case null {
                #err("Carbon credit not found")
            };
            case (?credit) {
                if (credit.owner != caller) {
                    #err("Only owner can transfer credit")
                } else if (credit.status == #retired) {
                    #err("Cannot transfer retired credit")
                } else {
                    let transferredCredit: CarbonCredit = {
                        credit with
                        owner = to;
                        status = #traded;
                    };
                    carbonCredits.put(tokenId, transferredCredit);
                    
                    // Update user mappings
                    // Remove from sender
                    switch (userCarbonCredits.get(caller)) {
                        case null { };
                        case (?credits) {
                            let filtered = Array.filter(credits, func(id: TokenId): Bool { id != tokenId });
                            userCarbonCredits.put(caller, filtered);
                        };
                    };
                    
                    // Add to receiver
                    switch (userCarbonCredits.get(to)) {
                        case null {
                            userCarbonCredits.put(to, [tokenId]);
                        };
                        case (?existing) {
                            userCarbonCredits.put(to, Array.append(existing, [tokenId]));
                        };
                    };
                    
                    #ok(true)
                }
            };
        }
    };
    
    public shared(msg) func transferImpactToken(tokenId: TokenId, to: UserId): async Result.Result<Bool, Text> {
        let caller = msg.caller;
        
        switch (impactTokens.get(tokenId)) {
            case null {
                #err("Impact token not found")
            };
            case (?token) {
                if (token.owner != caller) {
                    #err("Only owner can transfer token")
                } else {
                    let transferredToken: ImpactToken = {
                        token with
                        owner = to;
                    };
                    impactTokens.put(tokenId, transferredToken);
                    
                    // Update user mappings
                    // Remove from sender
                    switch (userImpactTokens.get(caller)) {
                        case null { };
                        case (?tokens) {
                            let filtered = Array.filter(tokens, func(id: TokenId): Bool { id != tokenId });
                            userImpactTokens.put(caller, filtered);
                        };
                    };
                    
                    // Add to receiver
                    switch (userImpactTokens.get(to)) {
                        case null {
                            userImpactTokens.put(to, [tokenId]);
                        };
                        case (?existing) {
                            userImpactTokens.put(to, Array.append(existing, [tokenId]));
                        };
                    };
                    
                    #ok(true)
                }
            };
        }
    };
    
    // Marketplace Functions
    public shared(msg) func createMarketplaceListing(
        assetType: {#carbon_credit; #impact_token},
        assetId: TokenId,
        quantity: Float,
        price: Float,
        currency: {#USD; #SOL; #ICP; #ETH},
        expiresAt: ?Int
    ): async Result.Result<MarketplaceListing, Text> {
        let caller = msg.caller;
        let listingId = generateListingId();
        
        // Verify ownership
        let isOwner = switch (assetType) {
            case (#carbon_credit) {
                switch (carbonCredits.get(assetId)) {
                    case null { false };
                    case (?credit) { credit.owner == caller };
                }
            };
            case (#impact_token) {
                switch (impactTokens.get(assetId)) {
                    case null { false };
                    case (?token) { token.owner == caller };
                }
            };
        };
        
        if (not isOwner) {
            #err("Asset not found or not owned by caller")
        } else {
            let listing: MarketplaceListing = {
                id = listingId;
                sellerId = caller;
                assetType = assetType;
                assetId = assetId;
                quantity = quantity;
                price = price;
                currency = currency;
                status = #active;
                listedAt = getCurrentTime();
                expiresAt = expiresAt;
            };
            
            marketplaceListings.put(listingId, listing);
            #ok(listing)
        }
    };
    
    public shared(msg) func purchaseFromMarketplace(listingId: Text): async Result.Result<Bool, Text> {
        let caller = msg.caller;
        
        switch (marketplaceListings.get(listingId)) {
            case null {
                #err("Listing not found")
            };
            case (?listing) {
                if (listing.status != #active) {
                    #err("Listing not active")
                } else if (listing.sellerId == caller) {
                    #err("Cannot purchase own listing")
                } else {
                    // Update listing status
                    let soldListing: MarketplaceListing = {
                        listing with
                        status = #sold;
                    };
                    marketplaceListings.put(listingId, soldListing);
                    
                    // Transfer asset
                    let transferResult = switch (listing.assetType) {
                        case (#carbon_credit) {
                            await transferCarbonCredit(listing.assetId, caller)
                        };
                        case (#impact_token) {
                            await transferImpactToken(listing.assetId, caller)
                        };
                    };
                    
                    switch (transferResult) {
                        case (#ok(_)) { #ok(true) };
                        case (#err(msg)) { #err("Transfer failed: " # msg) };
                    }
                }
            };
        }
    };
    
    // Query Functions
    public query func getCarbonCredit(tokenId: TokenId): async ?CarbonCredit {
        carbonCredits.get(tokenId)
    };
    
    public query func getImpactToken(tokenId: TokenId): async ?ImpactToken {
        impactTokens.get(tokenId)
    };
    
    public query func getUserCarbonCredits(userId: UserId): async [CarbonCredit] {
        switch (userCarbonCredits.get(userId)) {
            case null { [] };
            case (?tokenIds) {
                Array.mapFilter(tokenIds, func(id: TokenId): ?CarbonCredit {
                    carbonCredits.get(id)
                })
            };
        }
    };
    
    public query func getUserImpactTokens(userId: UserId): async [ImpactToken] {
        switch (userImpactTokens.get(userId)) {
            case null { [] };
            case (?tokenIds) {
                Array.mapFilter(tokenIds, func(id: TokenId): ?ImpactToken {
                    impactTokens.get(id)
                })
            };
        }
    };
    
    public query func getProjectCarbonCredits(projectId: ProjectId): async [CarbonCredit] {
        switch (projectCredits.get(projectId)) {
            case null { [] };
            case (?tokenIds) {
                Array.mapFilter(tokenIds, func(id: TokenId): ?CarbonCredit {
                    carbonCredits.get(id)
                })
            };
        }
    };
    
    public query func getProjectImpactTokens(projectId: ProjectId): async [ImpactToken] {
        switch (projectTokens.get(projectId)) {
            case null { [] };
            case (?tokenIds) {
                Array.mapFilter(tokenIds, func(id: TokenId): ?ImpactToken {
                    impactTokens.get(id)
                })
            };
        }
    };
    
    public query func getActiveMarketplaceListings(): async [MarketplaceListing] {
        Array.filter(
            Array.map(marketplaceListings.entries(), func((id, listing): (Text, MarketplaceListing)): MarketplaceListing { listing }),
            func(listing: MarketplaceListing): Bool { listing.status == #active }
        )
    };
    
    public query func getMarketplaceListing(listingId: Text): async ?MarketplaceListing {
        marketplaceListings.get(listingId)
    };
    
    // Platform Statistics
    public query func getCarbonCreditStats(): async {
        totalCredits: Nat;
        totalCO2Amount: Float;
        verifiedCredits: Nat;
        retiredCredits: Nat;
        averagePrice: Float;
    } {
        let allCredits = Array.map(carbonCredits.entries(), func((id, credit): (TokenId, CarbonCredit)): CarbonCredit { credit });
        
        let totalCO2Amount = Array.foldLeft(allCredits, 0.0, func(acc: Float, credit: CarbonCredit): Float {
            acc + credit.amount
        });
        
        let verifiedCredits = Array.size(Array.filter(allCredits, func(credit: CarbonCredit): Bool {
            credit.status == #verified
        }));
        
        let retiredCredits = Array.size(Array.filter(allCredits, func(credit: CarbonCredit): Bool {
            credit.status == #retired
        }));
        
        let totalPrice = Array.foldLeft(allCredits, 0.0, func(acc: Float, credit: CarbonCredit): Float {
            acc + credit.price
        });
        
        let averagePrice = if (allCredits.size() > 0) {
            totalPrice / Float.fromInt(allCredits.size())
        } else {
            0.0
        };
        
        {
            totalCredits = carbonCredits.size();
            totalCO2Amount = totalCO2Amount;
            verifiedCredits = verifiedCredits;
            retiredCredits = retiredCredits;
            averagePrice = averagePrice;
        }
    };
    
    // System functions
    system func preupgrade() {
        Debug.print("Preparing carbon credits canister for upgrade...");
    };
    
    system func postupgrade() {
        Debug.print("Carbon credits canister upgrade completed successfully");
    };
}