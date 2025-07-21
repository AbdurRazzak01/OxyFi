import Time "mo:base/Time";
import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Float "mo:base/Float";

actor AIVerification {
    
    // Types
    public type ProjectId = Text;
    public type AnalysisId = Text;
    public type AgentId = Text;
    public type TaskId = Text;
    
    public type AIAnalysis = {
        id: AnalysisId;
        projectId: ProjectId;
        timestamp: Int;
        forestHealthScore: Nat; // 0-100
        co2SequestrationRate: Float; // kg CO2 per year
        treeCount: Nat;
        vegetationDensity: Float; // 0-1
        deforestationRisk: Float; // 0-1
        biodiversityIndex: Float; // 0-1
        confidence: Float; // 0-1
        analysisMethod: {#satellite; #drone; #ground_sensors; #combined};
        rawData: Text; // JSON string of raw analysis data
        predictions: {
            co2OffsetNext12Months: Float;
            healthTrend: {#improving; #stable; #declining};
            riskFactors: [Text];
            recommendedActions: [Text];
        };
        verification: {
            isVerified: Bool;
            verifiedBy: [AgentId];
            verificationScore: Float; // 0-1
            verificationDate: ?Int;
        };
        imageData: {
            satelliteImageUrl: ?Text;
            droneImageUrl: ?Text;
            groundImageUrls: [Text];
            analysisOverlayUrl: ?Text;
        };
    };
    
    public type AIAgent = {
        id: AgentId;
        name: Text;
        agentType: {#verification; #matching; #reporting; #optimization; #prediction};
        capabilities: [Text];
        isActive: Bool;
        lastActive: Int;
        performance: {
            accuracy: Float; // 0-1
            tasksCompleted: Nat;
            uptime: Float; // percentage
            averageProcessingTime: Float; // seconds
        };
        configuration: {
            modelVersion: Text;
            parameters: Text; // JSON string
            updateFrequency: Nat; // hours
        };
    };
    
    public type AITask = {
        id: TaskId;
        agentId: AgentId;
        taskType: {#analyze_forest; #verify_data; #predict_health; #detect_changes; #generate_report};
        input: Text; // JSON string of input data
        output: ?Text; // JSON string of output data
        status: {#queued; #processing; #completed; #failed; #cancelled};
        priority: {#low; #medium; #high; #critical};
        createdAt: Int;
        startedAt: ?Int;
        completedAt: ?Int;
        error: ?Text;
        estimatedDuration: ?Float; // seconds
        actualDuration: ?Float; // seconds
    };
    
    public type VerificationCertificate = {
        id: Text;
        projectId: ProjectId;
        analysisId: AnalysisId;
        issuer: Text;
        certificateType: {#carbon_standard; #forest_stewardship; #biodiversity; #social_impact; #ai_verified};
        validFrom: Int;
        validUntil: Int;
        documentHash: Text;
        metadata: {
            standard: Text;
            methodology: Text;
            verificationLevel: {#basic; #enhanced; #premium};
            additionalBenefits: [Text];
        };
    };
    
    public type Alert = {
        id: Text;
        projectId: ProjectId;
        analysisId: ?AnalysisId;
        alertType: {#deforestation; #fire; #disease; #illegal_activity; #weather; #health_decline; #growth_anomaly};
        severity: {#low; #medium; #high; #critical};
        message: Text;
        timestamp: Int;
        location: {
            lat: Float;
            lng: Float;
            radius: ?Float; // meters
        };
        isResolved: Bool;
        resolvedAt: ?Int;
        actions: [Text];
        confidence: Float;
        detectedBy: AgentId;
    };
    
    // State
    private stable var nextAnalysisId: Nat = 0;
    private stable var nextTaskId: Nat = 0;
    private stable var nextAlertId: Nat = 0;
    private stable var nextCertificateId: Nat = 0;
    
    private var analyses = Map.HashMap<AnalysisId, AIAnalysis>(10, Text.equal, Text.hash);
    private var agents = Map.HashMap<AgentId, AIAgent>(10, Text.equal, Text.hash);
    private var tasks = Map.HashMap<TaskId, AITask>(10, Text.equal, Text.hash);
    private var certificates = Map.HashMap<Text, VerificationCertificate>(10, Text.equal, Text.hash);
    private var alerts = Map.HashMap<Text, Alert>(10, Text.equal, Text.hash);
    private var projectAnalyses = Map.HashMap<ProjectId, [AnalysisId]>(10, Text.equal, Text.hash);
    private var agentTasks = Map.HashMap<AgentId, [TaskId]>(10, Text.equal, Text.hash);
    private var projectAlerts = Map.HashMap<ProjectId, [Text]>(10, Text.equal, Text.hash);
    
    // Helper functions
    private func generateAnalysisId(): AnalysisId {
        let id = "analysis_" # Nat.toText(nextAnalysisId);
        nextAnalysisId += 1;
        id
    };
    
    private func generateTaskId(): TaskId {
        let id = "task_" # Nat.toText(nextTaskId);
        nextTaskId += 1;
        id
    };
    
    private func generateAlertId(): Text {
        let id = "alert_" # Nat.toText(nextAlertId);
        nextAlertId += 1;
        id
    };
    
    private func generateCertificateId(): Text {
        let id = "cert_" # Nat.toText(nextCertificateId);
        nextCertificateId += 1;
        id
    };
    
    private func getCurrentTime(): Int {
        Time.now()
    };
    
    // AI Agent Management
    public func registerAIAgent(
        id: AgentId,
        name: Text,
        agentType: {#verification; #matching; #reporting; #optimization; #prediction},
        capabilities: [Text],
        modelVersion: Text,
        parameters: Text
    ): async Result.Result<AIAgent, Text> {
        
        switch (agents.get(id)) {
            case (?existing) {
                #err("Agent already registered")
            };
            case null {
                let agent: AIAgent = {
                    id = id;
                    name = name;
                    agentType = agentType;
                    capabilities = capabilities;
                    isActive = true;
                    lastActive = getCurrentTime();
                    performance = {
                        accuracy = 0.85; // Initial accuracy
                        tasksCompleted = 0;
                        uptime = 100.0;
                        averageProcessingTime = 30.0;
                    };
                    configuration = {
                        modelVersion = modelVersion;
                        parameters = parameters;
                        updateFrequency = 24; // 24 hours
                    };
                };
                agents.put(id, agent);
                #ok(agent)
            };
        }
    };
    
    public func updateAgentStatus(agentId: AgentId, isActive: Bool): async Result.Result<AIAgent, Text> {
        switch (agents.get(agentId)) {
            case null {
                #err("Agent not found")
            };
            case (?agent) {
                let updatedAgent: AIAgent = {
                    agent with
                    isActive = isActive;
                    lastActive = getCurrentTime();
                };
                agents.put(agentId, updatedAgent);
                #ok(updatedAgent)
            };
        }
    };
    
    // Task Management
    public func createAITask(
        agentId: AgentId,
        taskType: {#analyze_forest; #verify_data; #predict_health; #detect_changes; #generate_report},
        input: Text,
        priority: {#low; #medium; #high; #critical},
        estimatedDuration: ?Float
    ): async Result.Result<AITask, Text> {
        
        switch (agents.get(agentId)) {
            case null {
                #err("Agent not found")
            };
            case (?agent) {
                if (not agent.isActive) {
                    #err("Agent is not active")
                } else {
                    let taskId = generateTaskId();
                    
                    let task: AITask = {
                        id = taskId;
                        agentId = agentId;
                        taskType = taskType;
                        input = input;
                        output = null;
                        status = #queued;
                        priority = priority;
                        createdAt = getCurrentTime();
                        startedAt = null;
                        completedAt = null;
                        error = null;
                        estimatedDuration = estimatedDuration;
                        actualDuration = null;
                    };
                    
                    tasks.put(taskId, task);
                    
                    // Add to agent's tasks
                    switch (agentTasks.get(agentId)) {
                        case null {
                            agentTasks.put(agentId, [taskId]);
                        };
                        case (?existing) {
                            agentTasks.put(agentId, Array.append(existing, [taskId]));
                        };
                    };
                    
                    #ok(task)
                }
            };
        }
    };
    
    public func updateTaskStatus(
        taskId: TaskId,
        status: {#queued; #processing; #completed; #failed; #cancelled},
        output: ?Text,
        error: ?Text
    ): async Result.Result<AITask, Text> {
        
        switch (tasks.get(taskId)) {
            case null {
                #err("Task not found")
            };
            case (?task) {
                let currentTime = getCurrentTime();
                let startedAt = if (status == #processing and task.startedAt == null) {
                    ?currentTime
                } else {
                    task.startedAt
                };
                
                let completedAt = switch (status) {
                    case (#completed or #failed or #cancelled) { ?currentTime };
                    case _ { task.completedAt };
                };
                
                let actualDuration = switch (startedAt, completedAt) {
                    case (?started, ?completed) {
                        ?Float.fromInt(completed - started) / 1000000000.0 // Convert to seconds
                    };
                    case _ { null };
                };
                
                let updatedTask: AITask = {
                    task with
                    status = status;
                    output = output;
                    error = error;
                    startedAt = startedAt;
                    completedAt = completedAt;
                    actualDuration = actualDuration;
                };
                
                tasks.put(taskId, updatedTask);
                
                // Update agent performance
                if (status == #completed) {
                    ignore updateAgentPerformance(task.agentId, true, actualDuration);
                } else if (status == #failed) {
                    ignore updateAgentPerformance(task.agentId, false, actualDuration);
                };
                
                #ok(updatedTask)
            };
        }
    };
    
    private func updateAgentPerformance(agentId: AgentId, success: Bool, duration: ?Float): async () {
        switch (agents.get(agentId)) {
            case null { };
            case (?agent) {
                let newTasksCompleted = agent.performance.tasksCompleted + 1;
                let currentAccuracy = agent.performance.accuracy;
                let newAccuracy = if (success) {
                    (currentAccuracy * Float.fromInt(agent.performance.tasksCompleted) + 1.0) / Float.fromInt(newTasksCompleted)
                } else {
                    (currentAccuracy * Float.fromInt(agent.performance.tasksCompleted)) / Float.fromInt(newTasksCompleted)
                };
                
                let newAvgProcessingTime = switch (duration) {
                    case null { agent.performance.averageProcessingTime };
                    case (?dur) {
                        (agent.performance.averageProcessingTime * Float.fromInt(agent.performance.tasksCompleted) + dur) / Float.fromInt(newTasksCompleted)
                    };
                };
                
                let updatedAgent: AIAgent = {
                    agent with
                    performance = {
                        accuracy = newAccuracy;
                        tasksCompleted = newTasksCompleted;
                        uptime = agent.performance.uptime; // Would be updated by monitoring system
                        averageProcessingTime = newAvgProcessingTime;
                    };
                    lastActive = getCurrentTime();
                };
                
                agents.put(agentId, updatedAgent);
            };
        }
    };
    
    // Forest Analysis Management
    public func createForestAnalysis(
        projectId: ProjectId,
        forestHealthScore: Nat,
        co2SequestrationRate: Float,
        treeCount: Nat,
        vegetationDensity: Float,
        deforestationRisk: Float,
        biodiversityIndex: Float,
        confidence: Float,
        analysisMethod: {#satellite; #drone; #ground_sensors; #combined},
        rawData: Text,
        co2OffsetNext12Months: Float,
        healthTrend: {#improving; #stable; #declining},
        riskFactors: [Text],
        recommendedActions: [Text],
        satelliteImageUrl: ?Text,
        droneImageUrl: ?Text,
        groundImageUrls: [Text]
    ): async Result.Result<AIAnalysis, Text> {
        
        let analysisId = generateAnalysisId();
        
        let analysis: AIAnalysis = {
            id = analysisId;
            projectId = projectId;
            timestamp = getCurrentTime();
            forestHealthScore = forestHealthScore;
            co2SequestrationRate = co2SequestrationRate;
            treeCount = treeCount;
            vegetationDensity = vegetationDensity;
            deforestationRisk = deforestationRisk;
            biodiversityIndex = biodiversityIndex;
            confidence = confidence;
            analysisMethod = analysisMethod;
            rawData = rawData;
            predictions = {
                co2OffsetNext12Months = co2OffsetNext12Months;
                healthTrend = healthTrend;
                riskFactors = riskFactors;
                recommendedActions = recommendedActions;
            };
            verification = {
                isVerified = false;
                verifiedBy = [];
                verificationScore = 0.0;
                verificationDate = null;
            };
            imageData = {
                satelliteImageUrl = satelliteImageUrl;
                droneImageUrl = droneImageUrl;
                groundImageUrls = groundImageUrls;
                analysisOverlayUrl = null;
            };
        };
        
        analyses.put(analysisId, analysis);
        
        // Add to project's analyses
        switch (projectAnalyses.get(projectId)) {
            case null {
                projectAnalyses.put(projectId, [analysisId]);
            };
            case (?existing) {
                projectAnalyses.put(projectId, Array.append(existing, [analysisId]));
            };
        };
        
        // Check for alerts
        ignore await checkForAlerts(analysis);
        
        #ok(analysis)
    };
    
    public func verifyAnalysis(
        analysisId: AnalysisId,
        verifyingAgentId: AgentId,
        verificationScore: Float
    ): async Result.Result<AIAnalysis, Text> {
        
        switch (analyses.get(analysisId)) {
            case null {
                #err("Analysis not found")
            };
            case (?analysis) {
                let updatedVerification = {
                    isVerified = verificationScore >= 0.8; // 80% threshold
                    verifiedBy = Array.append(analysis.verification.verifiedBy, [verifyingAgentId]);
                    verificationScore = verificationScore;
                    verificationDate = ?getCurrentTime();
                };
                
                let updatedAnalysis: AIAnalysis = {
                    analysis with
                    verification = updatedVerification;
                };
                
                analyses.put(analysisId, updatedAnalysis);
                #ok(updatedAnalysis)
            };
        }
    };
    
    // Alert Management
    private func checkForAlerts(analysis: AIAnalysis): async () {
        // Check for deforestation risk
        if (analysis.deforestationRisk > 0.7) {
            ignore await createAlert(
                analysis.projectId,
                ?analysis.id,
                #deforestation,
                #high,
                "High deforestation risk detected",
                { lat = 0.0; lng = 0.0; radius = null }, // Would use actual coordinates
                analysis.confidence,
                "ai_agent_forest_monitor"
            );
        };
        
        // Check for health decline
        if (analysis.forestHealthScore < 40) {
            ignore await createAlert(
                analysis.projectId,
                ?analysis.id,
                #health_decline,
                #medium,
                "Forest health below acceptable threshold",
                { lat = 0.0; lng = 0.0; radius = null },
                analysis.confidence,
                "ai_agent_health_monitor"
            );
        };
        
        // Check for biodiversity concerns
        if (analysis.biodiversityIndex < 0.3) {
            ignore await createAlert(
                analysis.projectId,
                ?analysis.id,
                #growth_anomaly,
                #medium,
                "Low biodiversity index detected",
                { lat = 0.0; lng = 0.0; radius = null },
                analysis.confidence,
                "ai_agent_biodiversity_monitor"
            );
        };
    };
    
    public func createAlert(
        projectId: ProjectId,
        analysisId: ?AnalysisId,
        alertType: {#deforestation; #fire; #disease; #illegal_activity; #weather; #health_decline; #growth_anomaly},
        severity: {#low; #medium; #high; #critical},
        message: Text,
        location: { lat: Float; lng: Float; radius: ?Float },
        confidence: Float,
        detectedBy: AgentId
    ): async Result.Result<Alert, Text> {
        
        let alertId = generateAlertId();
        
        let alert: Alert = {
            id = alertId;
            projectId = projectId;
            analysisId = analysisId;
            alertType = alertType;
            severity = severity;
            message = message;
            timestamp = getCurrentTime();
            location = location;
            isResolved = false;
            resolvedAt = null;
            actions = [];
            confidence = confidence;
            detectedBy = detectedBy;
        };
        
        alerts.put(alertId, alert);
        
        // Add to project's alerts
        switch (projectAlerts.get(projectId)) {
            case null {
                projectAlerts.put(projectId, [alertId]);
            };
            case (?existing) {
                projectAlerts.put(projectId, Array.append(existing, [alertId]));
            };
        };
        
        #ok(alert)
    };
    
    public func resolveAlert(alertId: Text, actions: [Text]): async Result.Result<Alert, Text> {
        switch (alerts.get(alertId)) {
            case null {
                #err("Alert not found")
            };
            case (?alert) {
                let resolvedAlert: Alert = {
                    alert with
                    isResolved = true;
                    resolvedAt = ?getCurrentTime();
                    actions = actions;
                };
                alerts.put(alertId, resolvedAlert);
                #ok(resolvedAlert)
            };
        }
    };
    
    // Certificate Management
    public func issueCertificate(
        projectId: ProjectId,
        analysisId: AnalysisId,
        issuer: Text,
        certificateType: {#carbon_standard; #forest_stewardship; #biodiversity; #social_impact; #ai_verified},
        validUntil: Int,
        documentHash: Text,
        standard: Text,
        methodology: Text,
        verificationLevel: {#basic; #enhanced; #premium},
        additionalBenefits: [Text]
    ): async Result.Result<VerificationCertificate, Text> {
        
        let certificateId = generateCertificateId();
        
        let certificate: VerificationCertificate = {
            id = certificateId;
            projectId = projectId;
            analysisId = analysisId;
            issuer = issuer;
            certificateType = certificateType;
            validFrom = getCurrentTime();
            validUntil = validUntil;
            documentHash = documentHash;
            metadata = {
                standard = standard;
                methodology = methodology;
                verificationLevel = verificationLevel;
                additionalBenefits = additionalBenefits;
            };
        };
        
        certificates.put(certificateId, certificate);
        #ok(certificate)
    };
    
    // Query Functions
    public query func getAnalysis(analysisId: AnalysisId): async ?AIAnalysis {
        analyses.get(analysisId)
    };
    
    public query func getProjectAnalyses(projectId: ProjectId, limit: Nat): async [AIAnalysis] {
        switch (projectAnalyses.get(projectId)) {
            case null { [] };
            case (?analysisIds) {
                let limitedIds = Array.take(Array.reverse(analysisIds), limit);
                Array.mapFilter(limitedIds, func(id: AnalysisId): ?AIAnalysis {
                    analyses.get(id)
                })
            };
        }
    };
    
    public query func getLatestAnalysis(projectId: ProjectId): async ?AIAnalysis {
        switch (projectAnalyses.get(projectId)) {
            case null { null };
            case (?analysisIds) {
                if (analysisIds.size() == 0) {
                    null
                } else {
                    let latestId = analysisIds[analysisIds.size() - 1];
                    analyses.get(latestId)
                }
            };
        }
    };
    
    public query func getAIAgent(agentId: AgentId): async ?AIAgent {
        agents.get(agentId)
    };
    
    public query func getAllActiveAgents(): async [AIAgent] {
        let allAgents = Array.map(agents.entries(), func((id, agent): (AgentId, AIAgent)): AIAgent { agent });
        Array.filter(allAgents, func(agent: AIAgent): Bool { agent.isActive })
    };
    
    public query func getTask(taskId: TaskId): async ?AITask {
        tasks.get(taskId)
    };
    
    public query func getAgentTasks(agentId: AgentId, limit: Nat): async [AITask] {
        switch (agentTasks.get(agentId)) {
            case null { [] };
            case (?taskIds) {
                let limitedIds = Array.take(Array.reverse(taskIds), limit);
                Array.mapFilter(limitedIds, func(id: TaskId): ?AITask {
                    tasks.get(id)
                })
            };
        }
    };
    
    public query func getProjectAlerts(projectId: ProjectId, includeResolved: Bool): async [Alert] {
        switch (projectAlerts.get(projectId)) {
            case null { [] };
            case (?alertIds) {
                let allAlerts = Array.mapFilter(alertIds, func(id: Text): ?Alert {
                    alerts.get(id)
                });
                if (includeResolved) {
                    allAlerts
                } else {
                    Array.filter(allAlerts, func(alert: Alert): Bool { not alert.isResolved })
                }
            };
        }
    };
    
    public query func getCertificate(certificateId: Text): async ?VerificationCertificate {
        certificates.get(certificateId)
    };
    
    // Platform Statistics
    public query func getAIStats(): async {
        totalAnalyses: Nat;
        verifiedAnalyses: Nat;
        activeAgents: Nat;
        totalTasks: Nat;
        completedTasks: Nat;
        activeAlerts: Nat;
        averageConfidence: Float;
    } {
        let allAnalyses = Array.map(analyses.entries(), func((id, analysis): (AnalysisId, AIAnalysis)): AIAnalysis { analysis });
        let allAgents = Array.map(agents.entries(), func((id, agent): (AgentId, AIAgent)): AIAgent { agent });
        let allTasks = Array.map(tasks.entries(), func((id, task): (TaskId, AITask)): AITask { task });
        let allAlerts = Array.map(alerts.entries(), func((id, alert): (Text, Alert)): Alert { alert });
        
        let verifiedAnalyses = Array.size(Array.filter(allAnalyses, func(analysis: AIAnalysis): Bool {
            analysis.verification.isVerified
        }));
        
        let activeAgents = Array.size(Array.filter(allAgents, func(agent: AIAgent): Bool {
            agent.isActive
        }));
        
        let completedTasks = Array.size(Array.filter(allTasks, func(task: AITask): Bool {
            task.status == #completed
        }));
        
        let activeAlerts = Array.size(Array.filter(allAlerts, func(alert: Alert): Bool {
            not alert.isResolved
        }));
        
        let totalConfidence = Array.foldLeft(allAnalyses, 0.0, func(acc: Float, analysis: AIAnalysis): Float {
            acc + analysis.confidence
        });
        
        let averageConfidence = if (allAnalyses.size() > 0) {
            totalConfidence / Float.fromInt(allAnalyses.size())
        } else {
            0.0
        };
        
        {
            totalAnalyses = analyses.size();
            verifiedAnalyses = verifiedAnalyses;
            activeAgents = activeAgents;
            totalTasks = tasks.size();
            completedTasks = completedTasks;
            activeAlerts = activeAlerts;
            averageConfidence = averageConfidence;
        }
    };
    
    // System functions
    system func preupgrade() {
        Debug.print("Preparing AI verification canister for upgrade...");
    };
    
    system func postupgrade() {
        Debug.print("AI verification canister upgrade completed successfully");
    };
}