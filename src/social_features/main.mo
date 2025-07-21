import Time "mo:base/Time";
import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";

actor SocialFeatures {
    
    // Types
    public type UserId = Principal;
    public type PostId = Text;
    public type ChallengeId = Text;
    public type AchievementId = Text;
    
    public type Post = {
        id: PostId;
        userId: UserId;
        content: Text;
        images: [Text];
        projectId: ?Text;
        postType: {#update; #achievement; #investment; #discussion; #milestone};
        timestamp: Int;
        likes: [UserId];
        comments: [Comment];
        shares: Nat;
        hashtags: [Text];
        isVerified: Bool;
    };
    
    public type Comment = {
        id: Text;
        userId: UserId;
        content: Text;
        timestamp: Int;
        likes: [UserId];
        replies: [Comment];
    };
    
    public type UserProfile = {
        id: UserId;
        username: ?Text;
        displayName: ?Text;
        bio: ?Text;
        avatar: ?Text;
        coverImage: ?Text;
        joinDate: Int;
        reputation: Nat;
        level: Nat;
        totalCO2Offset: Float;
        totalInvested: Float;
        followers: [UserId];
        following: [UserId];
        achievements: [AchievementId];
        badges: [Text];
        preferences: UserPreferences;
        stats: UserStats;
    };
    
    public type UserPreferences = {
        notifications: Bool;
        publicProfile: Bool;
        shareImpact: Bool;
        autoInvest: Bool;
        monthlyGoal: ?Float;
        emailNotifications: Bool;
        pushNotifications: Bool;
    };
    
    public type UserStats = {
        postsCount: Nat;
        likesReceived: Nat;
        commentsReceived: Nat;
        sharesReceived: Nat;
        projectsSupported: Nat;
        treesPlanted: Nat;
        carbonCreditsEarned: Nat;
        streakDays: Nat;
        lastActiveDate: Int;
    };
    
    public type Achievement = {
        id: AchievementId;
        title: Text;
        description: Text;
        icon: Text;
        category: {#environmental; #social; #investment; #milestone; #special};
        rarity: {#common; #rare; #epic; #legendary};
        requirements: {
            co2Offset: ?Float;
            treesPlanted: ?Nat;
            investmentAmount: ?Float;
            projectsSupported: ?Nat;
            socialEngagement: ?Nat;
            streakDays: ?Nat;
        };
        rewards: {
            reputation: Nat;
            tokens: ?Float;
            badge: ?Text;
            title: ?Text;
        };
        unlockedBy: [UserId];
    };
    
    public type Challenge = {
        id: ChallengeId;
        title: Text;
        description: Text;
        goal: Float;
        current: Float;
        unit: {#trees; #co2; #investment; #posts; #engagement};
        startDate: Int;
        endDate: Int;
        participants: [UserId];
        leaderboard: [LeaderboardEntry];
        rewards: [ChallengeReward];
        status: {#upcoming; #active; #completed; #cancelled};
        isGlobal: Bool;
        createdBy: UserId;
    };
    
    public type LeaderboardEntry = {
        userId: UserId;
        score: Float;
        rank: Nat;
        lastUpdated: Int;
    };
    
    public type ChallengeReward = {
        rank: Nat;
        reward: Text;
        rewardType: {#tokens; #nft; #badge; #discount; #reputation};
        value: Float;
    };
    
    public type Notification = {
        id: Text;
        userId: UserId;
        notificationType: {#like; #comment; #follow; #achievement; #challenge; #investment; #project_update; #mention};
        title: Text;
        message: Text;
        isRead: Bool;
        timestamp: Int;
        actionUrl: ?Text;
        fromUserId: ?UserId;
        metadata: ?Text;
    };
    
    // State
    private stable var nextPostId: Nat = 0;
    private stable var nextChallengeId: Nat = 0;
    private stable var nextCommentId: Nat = 0;
    private stable var nextNotificationId: Nat = 0;
    
    private var posts = Map.HashMap<PostId, Post>(10, Text.equal, Text.hash);
    private var userProfiles = Map.HashMap<UserId, UserProfile>(10, Principal.equal, Principal.hash);
    private var achievements = Map.HashMap<AchievementId, Achievement>(10, Text.equal, Text.hash);
    private var challenges = Map.HashMap<ChallengeId, Challenge>(10, Text.equal, Text.hash);
    private var notifications = Map.HashMap<Text, Notification>(10, Text.equal, Text.hash);
    private var userPosts = Map.HashMap<UserId, [PostId]>(10, Principal.equal, Principal.hash);
    private var userNotifications = Map.HashMap<UserId, [Text]>(10, Principal.equal, Principal.hash);
    private var followRelations = Map.HashMap<UserId, [UserId]>(10, Principal.equal, Principal.hash);
    private var globalFeed = Array.init<PostId>(1000, "");
    private var feedIndex: Nat = 0;
    
    // Helper functions
    private func generatePostId(): PostId {
        let id = "post_" # Nat.toText(nextPostId);
        nextPostId += 1;
        id
    };
    
    private func generateChallengeId(): ChallengeId {
        let id = "challenge_" # Nat.toText(nextChallengeId);
        nextChallengeId += 1;
        id
    };
    
    private func generateCommentId(): Text {
        let id = "comment_" # Nat.toText(nextCommentId);
        nextCommentId += 1;
        id
    };
    
    private func generateNotificationId(): Text {
        let id = "notification_" # Nat.toText(nextNotificationId);
        nextNotificationId += 1;
        id
    };
    
    private func getCurrentTime(): Int {
        Time.now()
    };
    
    // User Profile Management
    public shared(msg) func createUserProfile(
        username: ?Text,
        displayName: ?Text,
        bio: ?Text,
        avatar: ?Text
    ): async Result.Result<UserProfile, Text> {
        let caller = msg.caller;
        
        switch (userProfiles.get(caller)) {
            case (?existing) {
                #err("User profile already exists")
            };
            case null {
                let profile: UserProfile = {
                    id = caller;
                    username = username;
                    displayName = displayName;
                    bio = bio;
                    avatar = avatar;
                    coverImage = null;
                    joinDate = getCurrentTime();
                    reputation = 100;
                    level = 1;
                    totalCO2Offset = 0.0;
                    totalInvested = 0.0;
                    followers = [];
                    following = [];
                    achievements = [];
                    badges = [];
                    preferences = {
                        notifications = true;
                        publicProfile = true;
                        shareImpact = true;
                        autoInvest = false;
                        monthlyGoal = null;
                        emailNotifications = true;
                        pushNotifications = true;
                    };
                    stats = {
                        postsCount = 0;
                        likesReceived = 0;
                        commentsReceived = 0;
                        sharesReceived = 0;
                        projectsSupported = 0;
                        treesPlanted = 0;
                        carbonCreditsEarned = 0;
                        streakDays = 0;
                        lastActiveDate = getCurrentTime();
                    };
                };
                userProfiles.put(caller, profile);
                #ok(profile)
            };
        }
    };
    
    public shared(msg) func updateUserProfile(
        username: ?Text,
        displayName: ?Text,
        bio: ?Text,
        avatar: ?Text,
        coverImage: ?Text
    ): async Result.Result<UserProfile, Text> {
        let caller = msg.caller;
        
        switch (userProfiles.get(caller)) {
            case null {
                #err("User profile not found")
            };
            case (?profile) {
                let updatedProfile: UserProfile = {
                    profile with
                    username = username;
                    displayName = displayName;
                    bio = bio;
                    avatar = avatar;
                    coverImage = coverImage;
                };
                userProfiles.put(caller, updatedProfile);
                #ok(updatedProfile)
            };
        }
    };
    
    public query func getUserProfile(userId: UserId): async ?UserProfile {
        userProfiles.get(userId)
    };
    
    // Social Interactions
    public shared(msg) func followUser(targetUserId: UserId): async Result.Result<Bool, Text> {
        let caller = msg.caller;
        
        if (caller == targetUserId) {
            #err("Cannot follow yourself")
        } else {
            switch (userProfiles.get(caller), userProfiles.get(targetUserId)) {
                case (?followerProfile, ?targetProfile) {
                    // Check if already following
                    let alreadyFollowing = Array.find(followerProfile.following, func(id: UserId): Bool { id == targetUserId });
                    
                    switch (alreadyFollowing) {
                        case (?_) {
                            #err("Already following this user")
                        };
                        case null {
                            // Update follower's following list
                            let updatedFollower: UserProfile = {
                                followerProfile with
                                following = Array.append(followerProfile.following, [targetUserId]);
                            };
                            userProfiles.put(caller, updatedFollower);
                            
                            // Update target's followers list
                            let updatedTarget: UserProfile = {
                                targetProfile with
                                followers = Array.append(targetProfile.followers, [caller]);
                            };
                            userProfiles.put(targetUserId, updatedTarget);
                            
                            // Create notification
                            ignore await createNotification(
                                targetUserId,
                                #follow,
                                "New Follower",
                                "Someone started following you!",
                                null,
                                ?caller
                            );
                            
                            #ok(true)
                        };
                    }
                };
                case _ {
                    #err("User profile not found")
                };
            }
        }
    };
    
    public shared(msg) func unfollowUser(targetUserId: UserId): async Result.Result<Bool, Text> {
        let caller = msg.caller;
        
        switch (userProfiles.get(caller), userProfiles.get(targetUserId)) {
            case (?followerProfile, ?targetProfile) {
                // Update follower's following list
                let updatedFollowing = Array.filter(followerProfile.following, func(id: UserId): Bool { id != targetUserId });
                let updatedFollower: UserProfile = {
                    followerProfile with
                    following = updatedFollowing;
                };
                userProfiles.put(caller, updatedFollower);
                
                // Update target's followers list
                let updatedFollowers = Array.filter(targetProfile.followers, func(id: UserId): Bool { id != caller });
                let updatedTarget: UserProfile = {
                    targetProfile with
                    followers = updatedFollowers;
                };
                userProfiles.put(targetUserId, updatedTarget);
                
                #ok(true)
            };
            case _ {
                #err("User profile not found")
            };
        }
    };
    
    // Post Management
    public shared(msg) func createPost(
        content: Text,
        images: [Text],
        projectId: ?Text,
        postType: {#update; #achievement; #investment; #discussion; #milestone},
        hashtags: [Text]
    ): async Result.Result<Post, Text> {
        let caller = msg.caller;
        let postId = generatePostId();
        
        let post: Post = {
            id = postId;
            userId = caller;
            content = content;
            images = images;
            projectId = projectId;
            postType = postType;
            timestamp = getCurrentTime();
            likes = [];
            comments = [];
            shares = 0;
            hashtags = hashtags;
            isVerified = false;
        };
        
        posts.put(postId, post);
        
        // Add to user's posts
        switch (userPosts.get(caller)) {
            case null {
                userPosts.put(caller, [postId]);
            };
            case (?existing) {
                userPosts.put(caller, Array.append(existing, [postId]));
            };
        };
        
        // Add to global feed
        globalFeed[feedIndex] := postId;
        feedIndex := (feedIndex + 1) % globalFeed.size();
        
        // Update user stats
        switch (userProfiles.get(caller)) {
            case null { };
            case (?profile) {
                let updatedStats: UserStats = {
                    profile.stats with
                    postsCount = profile.stats.postsCount + 1;
                    lastActiveDate = getCurrentTime();
                };
                let updatedProfile: UserProfile = {
                    profile with
                    stats = updatedStats;
                };
                userProfiles.put(caller, updatedProfile);
            };
        };
        
        #ok(post)
    };
    
    public shared(msg) func likePost(postId: PostId): async Result.Result<Post, Text> {
        let caller = msg.caller;
        
        switch (posts.get(postId)) {
            case null {
                #err("Post not found")
            };
            case (?post) {
                // Check if already liked
                let alreadyLiked = Array.find(post.likes, func(id: UserId): Bool { id == caller });
                
                switch (alreadyLiked) {
                    case (?_) {
                        // Unlike
                        let updatedLikes = Array.filter(post.likes, func(id: UserId): Bool { id != caller });
                        let updatedPost: Post = {
                            post with
                            likes = updatedLikes;
                        };
                        posts.put(postId, updatedPost);
                        #ok(updatedPost)
                    };
                    case null {
                        // Like
                        let updatedPost: Post = {
                            post with
                            likes = Array.append(post.likes, [caller]);
                        };
                        posts.put(postId, updatedPost);
                        
                        // Create notification for post owner
                        if (post.userId != caller) {
                            ignore await createNotification(
                                post.userId,
                                #like,
                                "Post Liked",
                                "Someone liked your post!",
                                ?("/post/" # postId),
                                ?caller
                            );
                        };
                        
                        #ok(updatedPost)
                    };
                }
            };
        }
    };
    
    public shared(msg) func addComment(
        postId: PostId,
        content: Text,
        parentCommentId: ?Text
    ): async Result.Result<Post, Text> {
        let caller = msg.caller;
        let commentId = generateCommentId();
        
        switch (posts.get(postId)) {
            case null {
                #err("Post not found")
            };
            case (?post) {
                let comment: Comment = {
                    id = commentId;
                    userId = caller;
                    content = content;
                    timestamp = getCurrentTime();
                    likes = [];
                    replies = [];
                };
                
                let updatedComments = Array.append(post.comments, [comment]);
                let updatedPost: Post = {
                    post with
                    comments = updatedComments;
                };
                posts.put(postId, updatedPost);
                
                // Create notification for post owner
                if (post.userId != caller) {
                    ignore await createNotification(
                        post.userId,
                        #comment,
                        "New Comment",
                        "Someone commented on your post!",
                        ?("/post/" # postId),
                        ?caller
                    );
                };
                
                #ok(updatedPost)
            };
        }
    };
    
    // Notification Management
    private func createNotification(
        userId: UserId,
        notificationType: {#like; #comment; #follow; #achievement; #challenge; #investment; #project_update; #mention},
        title: Text,
        message: Text,
        actionUrl: ?Text,
        fromUserId: ?UserId
    ): async Text {
        let notificationId = generateNotificationId();
        
        let notification: Notification = {
            id = notificationId;
            userId = userId;
            notificationType = notificationType;
            title = title;
            message = message;
            isRead = false;
            timestamp = getCurrentTime();
            actionUrl = actionUrl;
            fromUserId = fromUserId;
            metadata = null;
        };
        
        notifications.put(notificationId, notification);
        
        // Add to user's notifications
        switch (userNotifications.get(userId)) {
            case null {
                userNotifications.put(userId, [notificationId]);
            };
            case (?existing) {
                userNotifications.put(userId, Array.append(existing, [notificationId]));
            };
        };
        
        notificationId
    };
    
    public shared(msg) func markNotificationAsRead(notificationId: Text): async Result.Result<Bool, Text> {
        let caller = msg.caller;
        
        switch (notifications.get(notificationId)) {
            case null {
                #err("Notification not found")
            };
            case (?notification) {
                if (notification.userId != caller) {
                    #err("Access denied")
                } else {
                    let updatedNotification: Notification = {
                        notification with
                        isRead = true;
                    };
                    notifications.put(notificationId, updatedNotification);
                    #ok(true)
                }
            };
        }
    };
    
    // Query Functions
    public query func getPost(postId: PostId): async ?Post {
        posts.get(postId)
    };
    
    public query func getUserPosts(userId: UserId, limit: Nat): async [Post] {
        switch (userPosts.get(userId)) {
            case null { [] };
            case (?postIds) {
                let limitedIds = Array.take(Array.reverse(postIds), limit);
                Array.mapFilter(limitedIds, func(id: PostId): ?Post {
                    posts.get(id)
                })
            };
        }
    };
    
    public query func getGlobalFeed(limit: Nat): async [Post] {
        let feedArray = Array.freeze(globalFeed);
        let recentPosts = Array.take(Array.reverse(feedArray), limit);
        Array.mapFilter(recentPosts, func(id: PostId): ?Post {
            if (id == "") { null } else { posts.get(id) }
        })
    };
    
    public query func getUserNotifications(userId: UserId, limit: Nat): async [Notification] {
        switch (userNotifications.get(userId)) {
            case null { [] };
            case (?notificationIds) {
                let limitedIds = Array.take(Array.reverse(notificationIds), limit);
                Array.mapFilter(limitedIds, func(id: Text): ?Notification {
                    notifications.get(id)
                })
            };
        }
    };
    
    public query func getUnreadNotificationsCount(userId: UserId): async Nat {
        switch (userNotifications.get(userId)) {
            case null { 0 };
            case (?notificationIds) {
                Array.size(Array.filter(notificationIds, func(id: Text): Bool {
                    switch (notifications.get(id)) {
                        case null { false };
                        case (?notification) { not notification.isRead };
                    }
                }))
            };
        }
    };
    
    public query func searchUsers(query: Text, limit: Nat): async [UserProfile] {
        let allProfiles = Array.map(userProfiles.entries(), func((id, profile): (UserId, UserProfile)): UserProfile { profile });
        let filtered = Array.filter(allProfiles, func(profile: UserProfile): Bool {
            switch (profile.username, profile.displayName) {
                case (?username, _) { Text.contains(username, #text query) };
                case (_, ?displayName) { Text.contains(displayName, #text query) };
                case _ { false };
            }
        });
        Array.take(filtered, limit)
    };
    
    // Platform Statistics
    public query func getSocialStats(): async {
        totalUsers: Nat;
        totalPosts: Nat;
        totalLikes: Nat;
        totalComments: Nat;
        activeUsers24h: Nat;
    } {
        let allPosts = Array.map(posts.entries(), func((id, post): (PostId, Post)): Post { post });
        let allProfiles = Array.map(userProfiles.entries(), func((id, profile): (UserId, UserProfile)): UserProfile { profile });
        
        let totalLikes = Array.foldLeft(allPosts, 0, func(acc: Nat, post: Post): Nat {
            acc + post.likes.size()
        });
        
        let totalComments = Array.foldLeft(allPosts, 0, func(acc: Nat, post: Post): Nat {
            acc + post.comments.size()
        });
        
        let currentTime = getCurrentTime();
        let oneDayAgo = currentTime - (24 * 60 * 60 * 1000000000); // 24 hours in nanoseconds
        
        let activeUsers24h = Array.size(Array.filter(allProfiles, func(profile: UserProfile): Bool {
            profile.stats.lastActiveDate > oneDayAgo
        }));
        
        {
            totalUsers = userProfiles.size();
            totalPosts = posts.size();
            totalLikes = totalLikes;
            totalComments = totalComments;
            activeUsers24h = activeUsers24h;
        }
    };
    
    // System functions
    system func preupgrade() {
        Debug.print("Preparing social features canister for upgrade...");
    };
    
    system func postupgrade() {
        Debug.print("Social features canister upgrade completed successfully");
    };
}