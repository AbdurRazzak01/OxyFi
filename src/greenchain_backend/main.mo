import Time "mo:base/Time";
import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Debug "mo:base/Debug";

actor GreenChainBackend {
    
    // Types
    public type ProjectId = Text;
    public type UserId = Principal;
    
    public type Project = {
        id: ProjectId;
        name: Text;
        description: Text;
        location: {
            country: Text;
            region: Text;
            lat: Float;
            lng: Float;
        };
        area: Float; // hectares
        targetTrees: Nat;
        treesPlanted: Nat;
        startDate: Int;
        expectedCompletion: Int;
        status: {#planning; #active; #completed; #verified};
        fundingGoal: Float; // USD
        fundingRaised: Float;
        minimumInvestment: Float;
        carbonCreditsGenerated: Float;
        healthScore: Nat; // 0-100
        creator: UserId;
        createdAt: Int;
        updatedAt: Int;
    };
    
    public type User = {
        id: UserId;
        username: ?Text;
        bio: ?Text;
        joinDate: Int;
        reputation: Nat;
        totalCO2Offset: Float;
        totalInvested: Float;
        achievements: [Text];
    };
    
    public type Investment = {
        id: Text;
        userId: UserId;
        projectId: ProjectId;
        amount: Float;
        currency: {#USD; #SOL; #ICP; #ETH};
        timestamp: Int;
        status: {#pending; #confirmed; #generating_returns; #completed};
        transactionHash: Text;
    };
    
    public type AIAnalysis = {
        projectId: ProjectId;
        timestamp: Int;
        forestHealthScore: Nat;
        co2SequestrationRate: Float;
        treeCount: Nat;
        vegetationDensity: Float;
        confidence: Float;
        predictions: {
            co2OffsetNext12Months: Float;
            healthTrend: {#improving; #stable; #declining};
            riskFactors: [Text];
        };
    };
    
    // State
    private stable var nextProjectId: Nat = 0;
    private stable var nextInvestmentId: Nat = 0;
    
    private var projects = Map.HashMap<ProjectId, Project>(10, Text.equal, Text.hash);
    private var users = Map.HashMap<UserId, User>(10, Principal.equal, Principal.hash);
    private var investments = Map.HashMap<Text, Investment>(10, Text.equal, Text.hash);
    private var projectAnalyses = Map.HashMap<ProjectId, AIAnalysis>(10, Text.equal, Text.hash);
    private var userProjects = Map.HashMap<UserId, [ProjectId]>(10, Principal.equal, Principal.hash);
    private var projectInvestors = Map.HashMap<ProjectId, [Text]>(10, Text.equal, Text.hash);
    
    // Helper functions
    private func generateProjectId(): ProjectId {
        let id = "project_" # Nat.toText(nextProjectId);
        nextProjectId += 1;
        id
    };
    
    private func generateInvestmentId(): Text {
        let id = "investment_" # Nat.toText(nextInvestmentId);
        nextInvestmentId += 1;
        id
    };
    
    private func getCurrentTime(): Int {
        Time.now()
    };
    
    // User Management
    public shared(msg) func registerUser(username: ?Text, bio: ?Text): async Result.Result<User, Text> {
        let caller = msg.caller;
        
        switch (users.get(caller)) {
            case (?existing) {
                #err("User already registered")
            };
            case null {
                let user: User = {
                    id = caller;
                    username = username;
                    bio = bio;
                    joinDate = getCurrentTime();
                    reputation = 100;
                    totalCO2Offset = 0.0;
                    totalInvested = 0.0;
                    achievements = [];
                };
                users.put(caller, user);
                #ok(user)
            };
        }
    };
    
    public query func getUser(userId: UserId): async ?User {
        users.get(userId)
    };
    
    public shared(msg) func updateUserProfile(username: ?Text, bio: ?Text): async Result.Result<User, Text> {
        let caller = msg.caller;
        
        switch (users.get(caller)) {
            case null {
                #err("User not found")
            };
            case (?user) {
                let updatedUser: User = {
                    user with
                    username = username;
                    bio = bio;
                };
                users.put(caller, updatedUser);
                #ok(updatedUser)
            };
        }
    };
    
    // Project Management
    public shared(msg) func createProject(
        name: Text,
        description: Text,
        country: Text,
        region: Text,
        lat: Float,
        lng: Float,
        area: Float,
        targetTrees: Nat,
        fundingGoal: Float,
        minimumInvestment: Float,
        expectedCompletion: Int
    ): async Result.Result<Project, Text> {
        let caller = msg.caller;
        let projectId = generateProjectId();
        
        let project: Project = {
            id = projectId;
            name = name;
            description = description;
            location = {
                country = country;
                region = region;
                lat = lat;
                lng = lng;
            };
            area = area;
            targetTrees = targetTrees;
            treesPlanted = 0;
            startDate = getCurrentTime();
            expectedCompletion = expectedCompletion;
            status = #planning;
            fundingGoal = fundingGoal;
            fundingRaised = 0.0;
            minimumInvestment = minimumInvestment;
            carbonCreditsGenerated = 0.0;
            healthScore = 85; // Initial score
            creator = caller;
            createdAt = getCurrentTime();
            updatedAt = getCurrentTime();
        };
        
        projects.put(projectId, project);
        
        // Add to user's projects
        switch (userProjects.get(caller)) {
            case null {
                userProjects.put(caller, [projectId]);
            };
            case (?existing) {
                userProjects.put(caller, Array.append(existing, [projectId]));
            };
        };
        
        #ok(project)
    };
    
    public query func getProject(projectId: ProjectId): async ?Project {
        projects.get(projectId)
    };
    
    public query func getAllProjects(): async [Project] {
        Array.map(projects.entries(), func((id, project): (ProjectId, Project)): Project { project })
    };
    
    public query func getProjectsByStatus(status: {#planning; #active; #completed; #verified}): async [Project] {
        Array.filter(
            Array.map(projects.entries(), func((id, project): (ProjectId, Project)): Project { project }),
            func(project: Project): Bool { project.status == status }
        )
    };
    
    public query func getUserProjects(userId: UserId): async [Project] {
        switch (userProjects.get(userId)) {
            case null { [] };
            case (?projectIds) {
                Array.mapFilter(projectIds, func(id: ProjectId): ?Project {
                    projects.get(id)
                })
            };
        }
    };
    
    public shared(msg) func updateProjectStatus(
        projectId: ProjectId,
        status: {#planning; #active; #completed; #verified}
    ): async Result.Result<Project, Text> {
        let caller = msg.caller;
        
        switch (projects.get(projectId)) {
            case null {
                #err("Project not found")
            };
            case (?project) {
                if (project.creator != caller) {
                    #err("Only project creator can update status")
                } else {
                    let updatedProject: Project = {
                        project with
                        status = status;
                        updatedAt = getCurrentTime();
                    };
                    projects.put(projectId, updatedProject);
                    #ok(updatedProject)
                }
            };
        }
    };
    
    public shared(msg) func updateTreesPlanted(
        projectId: ProjectId,
        treesPlanted: Nat
    ): async Result.Result<Project, Text> {
        let caller = msg.caller;
        
        switch (projects.get(projectId)) {
            case null {
                #err("Project not found")
            };
            case (?project) {
                if (project.creator != caller) {
                    #err("Only project creator can update trees planted")
                } else {
                    let updatedProject: Project = {
                        project with
                        treesPlanted = treesPlanted;
                        updatedAt = getCurrentTime();
                    };
                    projects.put(projectId, updatedProject);
                    #ok(updatedProject)
                }
            };
        }
    };
    
    // Investment Management
    public shared(msg) func createInvestment(
        projectId: ProjectId,
        amount: Float,
        currency: {#USD; #SOL; #ICP; #ETH},
        transactionHash: Text
    ): async Result.Result<Investment, Text> {
        let caller = msg.caller;
        let investmentId = generateInvestmentId();
        
        switch (projects.get(projectId)) {
            case null {
                #err("Project not found")
            };
            case (?project) {
                if (amount < project.minimumInvestment) {
                    #err("Investment amount below minimum")
                } else {
                    let investment: Investment = {
                        id = investmentId;
                        userId = caller;
                        projectId = projectId;
                        amount = amount;
                        currency = currency;
                        timestamp = getCurrentTime();
                        status = #pending;
                        transactionHash = transactionHash;
                    };
                    
                    investments.put(investmentId, investment);
                    
                    // Add to project investors
                    switch (projectInvestors.get(projectId)) {
                        case null {
                            projectInvestors.put(projectId, [investmentId]);
                        };
                        case (?existing) {
                            projectInvestors.put(projectId, Array.append(existing, [investmentId]));
                        };
                    };
                    
                    #ok(investment)
                }
            };
        }
    };
    
    public shared(msg) func confirmInvestment(investmentId: Text): async Result.Result<Investment, Text> {
        switch (investments.get(investmentId)) {
            case null {
                #err("Investment not found")
            };
            case (?investment) {
                let confirmedInvestment: Investment = {
                    investment with
                    status = #confirmed;
                };
                investments.put(investmentId, confirmedInvestment);
                
                // Update project funding
                switch (projects.get(investment.projectId)) {
                    case null {
                        #err("Project not found")
                    };
                    case (?project) {
                        let updatedProject: Project = {
                            project with
                            fundingRaised = project.fundingRaised + investment.amount;
                            updatedAt = getCurrentTime();
                        };
                        projects.put(investment.projectId, updatedProject);
                        
                        // Update user stats
                        switch (users.get(investment.userId)) {
                            case null { };
                            case (?user) {
                                let updatedUser: User = {
                                    user with
                                    totalInvested = user.totalInvested + investment.amount;
                                };
                                users.put(investment.userId, updatedUser);
                            };
                        };
                        
                        #ok(confirmedInvestment)
                    };
                }
            };
        }
    };
    
    public query func getInvestment(investmentId: Text): async ?Investment {
        investments.get(investmentId)
    };
    
    public query func getUserInvestments(userId: UserId): async [Investment] {
        Array.filter(
            Array.map(investments.entries(), func((id, investment): (Text, Investment)): Investment { investment }),
            func(investment: Investment): Bool { investment.userId == userId }
        )
    };
    
    public query func getProjectInvestments(projectId: ProjectId): async [Investment] {
        switch (projectInvestors.get(projectId)) {
            case null { [] };
            case (?investmentIds) {
                Array.mapFilter(investmentIds, func(id: Text): ?Investment {
                    investments.get(id)
                })
            };
        }
    };
    
    // AI Analysis Management
    public func updateAIAnalysis(
        projectId: ProjectId,
        forestHealthScore: Nat,
        co2SequestrationRate: Float,
        treeCount: Nat,
        vegetationDensity: Float,
        confidence: Float,
        co2OffsetNext12Months: Float,
        healthTrend: {#improving; #stable; #declining},
        riskFactors: [Text]
    ): async Result.Result<AIAnalysis, Text> {
        
        let analysis: AIAnalysis = {
            projectId = projectId;
            timestamp = getCurrentTime();
            forestHealthScore = forestHealthScore;
            co2SequestrationRate = co2SequestrationRate;
            treeCount = treeCount;
            vegetationDensity = vegetationDensity;
            confidence = confidence;
            predictions = {
                co2OffsetNext12Months = co2OffsetNext12Months;
                healthTrend = healthTrend;
                riskFactors = riskFactors;
            };
        };
        
        projectAnalyses.put(projectId, analysis);
        
        // Update project health score
        switch (projects.get(projectId)) {
            case null {
                #err("Project not found")
            };
            case (?project) {
                let updatedProject: Project = {
                    project with
                    healthScore = forestHealthScore;
                    carbonCreditsGenerated = project.carbonCreditsGenerated + co2OffsetNext12Months;
                    updatedAt = getCurrentTime();
                };
                projects.put(projectId, updatedProject);
                #ok(analysis)
            };
        }
    };
    
    public query func getProjectAnalysis(projectId: ProjectId): async ?AIAnalysis {
        projectAnalyses.get(projectId)
    };
    
    // Platform Statistics
    public query func getPlatformStats(): async {
        totalProjects: Nat;
        totalUsers: Nat;
        totalInvestments: Nat;
        totalFunding: Float;
        totalCO2Offset: Float;
        totalTreesPlanted: Nat;
    } {
        let allProjects = Array.map(projects.entries(), func((id, project): (ProjectId, Project)): Project { project });
        let allInvestments = Array.map(investments.entries(), func((id, investment): (Text, Investment)): Investment { investment });
        
        let totalFunding = Array.foldLeft(allProjects, 0.0, func(acc: Float, project: Project): Float {
            acc + project.fundingRaised
        });
        
        let totalCO2Offset = Array.foldLeft(allProjects, 0.0, func(acc: Float, project: Project): Float {
            acc + project.carbonCreditsGenerated
        });
        
        let totalTreesPlanted = Array.foldLeft(allProjects, 0, func(acc: Nat, project: Project): Nat {
            acc + project.treesPlanted
        });
        
        {
            totalProjects = projects.size();
            totalUsers = users.size();
            totalInvestments = investments.size();
            totalFunding = totalFunding;
            totalCO2Offset = totalCO2Offset;
            totalTreesPlanted = totalTreesPlanted;
        }
    };
    
    // Search and Discovery
    public query func searchProjects(query: Text): async [Project] {
        let allProjects = Array.map(projects.entries(), func((id, project): (ProjectId, Project)): Project { project });
        Array.filter(allProjects, func(project: Project): Bool {
            Text.contains(project.name, #text query) or 
            Text.contains(project.description, #text query) or
            Text.contains(project.location.country, #text query) or
            Text.contains(project.location.region, #text query)
        })
    };
    
    public query func getTopProjects(limit: Nat): async [Project] {
        let allProjects = Array.map(projects.entries(), func((id, project): (ProjectId, Project)): Project { project });
        let sortedProjects = Array.sort(allProjects, func(a: Project, b: Project): {#less; #equal; #greater} {
            if (a.healthScore > b.healthScore) { #less }
            else if (a.healthScore < b.healthScore) { #greater }
            else { #equal }
        });
        Array.take(sortedProjects, limit)
    };
    
    // System functions
    system func preupgrade() {
        Debug.print("Preparing for upgrade...");
    };
    
    system func postupgrade() {
        Debug.print("Upgrade completed successfully");
    };
}