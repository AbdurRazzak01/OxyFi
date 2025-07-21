export type EndpointTypes = 'mainnet' | 'devnet' | 'localnet'

// Blockchain Networks
export type NetworkType = 'solana' | 'icp' | 'ethereum'

// User and Social Features
export interface User {
  id: string;
  publicKey: string;
  username?: string;
  avatar?: string;
  bio?: string;
  joinDate: Date;
  reputation: number;
  totalCO2Offset: number;
  totalInvested: number;
  followers: string[];
  following: string[];
  achievements: Achievement[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  publicProfile: boolean;
  shareImpact: boolean;
  autoInvest: boolean;
  monthlyGoal?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Project Types
export interface ReforestationProject {
  id: string;
  name: string;
  description: string;
  location: {
    country: string;
    region: string;
    coordinates: { lat: number; lng: number };
  };
  area: number; // hectares
  targetTrees: number;
  treesPlanted: number;
  species: TreeSpecies[];
  startDate: Date;
  expectedCompletion: Date;
  status: 'planning' | 'active' | 'completed' | 'verified';
  fundingGoal: number; // in USD
  fundingRaised: number;
  minimumInvestment: number;
  carbonCreditsGenerated: number;
  healthScore: number; // 0-100
  verificationStatus: VerificationStatus;
  images: ProjectImage[];
  updates: ProjectUpdate[];
  investors: ProjectInvestor[];
  socialMetrics: SocialMetrics;
  aiAnalysis: AIAnalysisResult;
}

export interface TreeSpecies {
  name: string;
  scientificName: string;
  count: number;
  co2PerYear: number; // kg CO2 per tree per year
  survivalRate: number; // percentage
  maturityYears: number;
}

export interface ProjectImage {
  id: string;
  url: string;
  type: 'satellite' | 'drone' | 'ground';
  timestamp: Date;
  coordinates?: { lat: number; lng: number };
  metadata?: {
    resolution: string;
    source: string;
    analysisData?: any;
  };
}

export interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  images?: string[];
  timestamp: Date;
  author: string;
  type: 'progress' | 'milestone' | 'alert' | 'verification';
}

export interface ProjectInvestor {
  userId: string;
  amount: number;
  timestamp: Date;
  tokensReceived: number;
  isAnonymous: boolean;
}

export interface SocialMetrics {
  likes: number;
  shares: number;
  comments: number;
  followers: number;
  engagementRate: number;
}

// AI and Verification
export interface AIAnalysisResult {
  id: string;
  projectId: string;
  timestamp: Date;
  forestHealthScore: number;
  co2SequestrationRate: number;
  treeCount: number;
  vegetationDensity: number;
  deforestationRisk: number;
  biodiversityIndex: number;
  confidence: number;
  analysisMethod: 'satellite' | 'drone' | 'ground_sensors';
  rawData: any;
  predictions: {
    co2OffsetNext12Months: number;
    healthTrend: 'improving' | 'stable' | 'declining';
    riskFactors: string[];
  };
}

export interface VerificationStatus {
  isVerified: boolean;
  verifiedBy: string[];
  verificationDate?: Date;
  verificationScore: number; // 0-100
  verificationMethod: string;
  certificates: VerificationCertificate[];
}

export interface VerificationCertificate {
  id: string;
  issuer: string;
  type: 'carbon_standard' | 'forest_stewardship' | 'biodiversity' | 'social_impact';
  validUntil: Date;
  documentHash: string;
}

// Carbon Credits and Tokens
export interface CarbonCredit {
  id: string;
  projectId: string;
  amount: number; // tonnes CO2
  price: number; // per tonne
  vintage: number; // year
  status: 'pending' | 'verified' | 'retired' | 'traded';
  owner: string;
  tokenId?: string;
  metadata: {
    methodology: string;
    verificationStandard: string;
    additionalBenefits: string[];
  };
}

export interface ImpactToken {
  id: string;
  symbol: string;
  name: string;
  totalSupply: number;
  projectId: string;
  co2Equivalent: number; // kg CO2 per token
  price: number;
  holders: TokenHolder[];
  transferHistory: TokenTransfer[];
}

export interface TokenHolder {
  address: string;
  balance: number;
  stakingRewards: number;
  lastActivity: Date;
}

export interface TokenTransfer {
  from: string;
  to: string;
  amount: number;
  timestamp: Date;
  transactionHash: string;
  network: NetworkType;
}

// Investment and Financial
export interface Investment {
  id: string;
  userId: string;
  projectId: string;
  amount: number;
  currency: 'USD' | 'SOL' | 'ICP' | 'ETH';
  timestamp: Date;
  expectedReturns: {
    carbonCredits: number;
    impactTokens: number;
    estimatedValue: number;
  };
  status: 'pending' | 'confirmed' | 'generating_returns' | 'completed';
  transactionHash: string;
  network: NetworkType;
}

export interface Portfolio {
  userId: string;
  totalInvested: number;
  totalValue: number;
  totalCO2Offset: number;
  totalTokens: number;
  investments: Investment[];
  carbonCredits: CarbonCredit[];
  impactTokens: ImpactToken[];
  performance: PortfolioPerformance;
}

export interface PortfolioPerformance {
  roi: number; // percentage
  carbonImpact: number; // kg CO2
  socialImpact: number; // trees planted equivalent
  riskScore: number; // 0-100
  diversificationScore: number; // 0-100
  sustainabilityRating: 'A' | 'B' | 'C' | 'D' | 'F';
}

// Social and Community Features
export interface Post {
  id: string;
  userId: string;
  content: string;
  images?: string[];
  projectId?: string;
  type: 'update' | 'achievement' | 'investment' | 'discussion';
  timestamp: Date;
  likes: string[]; // user IDs
  comments: Comment[];
  shares: number;
  hashtags: string[];
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  likes: string[];
  replies: Comment[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  current: number;
  unit: 'trees' | 'co2' | 'investment';
  startDate: Date;
  endDate: Date;
  participants: string[];
  rewards: ChallengeReward[];
  status: 'upcoming' | 'active' | 'completed';
}

export interface ChallengeReward {
  rank: number;
  reward: string;
  type: 'tokens' | 'nft' | 'badge' | 'discount';
  value: number;
}

// AI Agent Types
export interface AIAgent {
  id: string;
  name: string;
  type: 'verification' | 'matching' | 'reporting' | 'optimization';
  capabilities: string[];
  isActive: boolean;
  lastActive: Date;
  performance: {
    accuracy: number;
    tasksCompleted: number;
    uptime: number;
  };
}

export interface AITask {
  id: string;
  agentId: string;
  type: string;
  input: any;
  output?: any;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

// Marketplace and Trading
export interface MarketplaceListing {
  id: string;
  sellerId: string;
  assetType: 'carbon_credit' | 'impact_token' | 'nft';
  assetId: string;
  quantity: number;
  price: number;
  currency: string;
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  listedAt: Date;
  expiresAt?: Date;
}

export interface TradeOrder {
  id: string;
  userId: string;
  type: 'buy' | 'sell';
  assetType: string;
  assetId: string;
  quantity: number;
  price: number;
  status: 'pending' | 'filled' | 'cancelled' | 'expired';
  createdAt: Date;
  filledAt?: Date;
}

// Real-time Data
export interface LiveData {
  projectId: string;
  timestamp: Date;
  metrics: {
    co2Absorption: number; // real-time rate
    temperature: number;
    humidity: number;
    soilMoisture: number;
    treeGrowth: number;
    biodiversityIndex: number;
  };
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'deforestation' | 'fire' | 'disease' | 'illegal_activity' | 'weather';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  location: { lat: number; lng: number };
  isResolved: boolean;
  actions: string[];
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'investment' | 'achievement' | 'project_update' | 'social' | 'alert';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
  actionUrl?: string;
  metadata?: any;
}

// Analytics and Reporting
export interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'year';
  metrics: {
    totalInvestments: number;
    totalCO2Offset: number;
    totalTreesPlanted: number;
    activeProjects: number;
    newUsers: number;
    platformGrowth: number;
  };
  trends: {
    metric: string;
    change: number; // percentage
    direction: 'up' | 'down' | 'stable';
  }[];
}

export interface ImpactReport {
  id: string;
  userId?: string;
  projectId?: string;
  period: { start: Date; end: Date };
  co2Impact: number;
  treesPlanted: number;
  biodiversityImpact: number;
  socialImpact: {
    jobsCreated: number;
    communitiesSupported: number;
    localEconomicImpact: number;
  };
  verification: {
    isVerified: boolean;
    verifiedBy: string;
    certificates: string[];
  };
  generatedAt: Date;
}
