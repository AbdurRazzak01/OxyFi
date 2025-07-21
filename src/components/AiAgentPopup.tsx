import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  SparklesIcon, 
  ArrowTrendingUpIcon, 
  ExclamationTriangleIcon,
  CpuChipIcon,
  GlobeEuropeAfricaIcon,
  BeakerIcon,
  ShieldCheckIcon,
  MapIcon
} from '@heroicons/react/24/outline';

interface AiAgentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userGoals?: {
    offsetTarget?: number;
    timeline?: string;
    preferredRegions?: string[];
    investmentRange?: { min: number; max: number };
  };
  userProfile?: {
    currentImpact?: number;
    monthlyBudget?: number;
    previousContributions?: number;
    portfolioValue?: number;
  };
}

interface ReforestationProject {
  id: string;
  name: string;
  region: string;
  ecosystem: string;
  aiHealthScore: number;
  description: string;
  matchScore: number;
  carbonOffsetPotential: number;
  minInvestment: number;
  projectedROI: number;
  verificationStatus: 'verified' | 'pending' | 'in-review';
  coordinates: { lat: number; lng: number };
}

interface InvestmentPlan {
  monthly: number;
  quarterly: number;
  annual: number;
  projectedCarbonImpact: number;
  projectedROI: number;
  diversificationStrategy: string[];
  milestones: string[];
}

interface AIInsight {
  type: 'forest-health' | 'market-trend' | 'portfolio-optimization' | 'risk-alert';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success' | 'error';
  actionable: boolean;
}

const AiAgentPopup: React.FC<AiAgentPopupProps> = ({
  isOpen,
  onClose,
  userGoals = {
    offsetTarget: 2500,
    timeline: '12 months',
    preferredRegions: ['Ecuador', 'Brazil', 'Colombia'],
    investmentRange: { min: 100, max: 5000 }
  },
  userProfile = {
    currentImpact: 850,
    monthlyBudget: 250,
    previousContributions: 8,
    portfolioValue: 2100
  }
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'plans' | 'insights'>('projects');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [projectSuggestions, setProjectSuggestions] = useState<ReforestationProject[]>([]);
  const [investmentPlan, setInvestmentPlan] = useState<InvestmentPlan | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);

  // Simulate AI analysis on popup open
  useEffect(() => {
    if (isOpen) {
      setIsAnalyzing(true);
      setTimeout(() => {
        // Mock AI-generated reforestation project suggestions
        setProjectSuggestions([
          {
            id: '1',
            name: 'Amazon Basin Restoration',
            region: 'Orellana Province, Ecuador',
            ecosystem: 'Tropical Rainforest',
            aiHealthScore: 94,
            description: 'Restoring 15,000 hectares of degraded Amazon rainforest with indigenous communities using AI-monitored tree planting',
            matchScore: 98,
            carbonOffsetPotential: 1250,
            minInvestment: 50,
            projectedROI: 8.5,
            verificationStatus: 'verified',
            coordinates: { lat: -0.4686, lng: -76.9834 }
          },
          {
            id: '2',
            name: 'Cloud Forest Conservation',
            region: 'Pichincha Province, Ecuador',
            ecosystem: 'Cloud Forest',
            aiHealthScore: 91,
            description: 'Protecting and expanding cloud forest ecosystems in the Andes with real-time satellite monitoring',
            matchScore: 92,
            carbonOffsetPotential: 720,
            minInvestment: 75,
            projectedROI: 7.2,
            verificationStatus: 'verified',
            coordinates: { lat: -0.1807, lng: -78.4678 }
          },
          {
            id: '3',
            name: 'Coastal Mangrove Restoration',
            region: 'Esmeraldas Province, Ecuador',
            ecosystem: 'Mangrove',
            aiHealthScore: 89,
            description: 'Restoring coastal mangrove ecosystems to protect against sea level rise with IoT sensor networks',
            matchScore: 87,
            carbonOffsetPotential: 890,
            minInvestment: 40,
            projectedROI: 9.1,
            verificationStatus: 'verified',
            coordinates: { lat: 0.9592, lng: -79.6566 }
          }
        ]);

        // Mock AI-generated investment plan
        setInvestmentPlan({
          monthly: 220,
          quarterly: 660,
          annual: 2640,
          projectedCarbonImpact: 3200,
          projectedROI: 8.7,
          diversificationStrategy: [
            'Amazon Rainforest (40%)',
            'Cloud Forest (30%)',
            'Mangrove Ecosystems (20%)',
            'Dry Forest Regeneration (10%)'
          ],
          milestones: [
            'Month 3: 800 kg CO₂ offset achieved',
            'Month 6: 1,600 kg CO₂ offset achieved',
            'Month 9: 2,400 kg CO₂ offset achieved',
            'Month 12: 3,200 kg CO₂ offset achieved (128% of goal)'
          ]
        });

        // Mock AI-generated insights
        const insights: AIInsight[] = [];
        
        // Forest health insights
        insights.push({
          type: 'forest-health',
          title: 'Optimal Planting Season Detected',
          message: 'AI analysis shows Ecuador\'s wet season (Dec-May) approaching. Projects planted now show 23% higher survival rates.',
          severity: 'success',
          actionable: true
        });

        // Market trend insights
        if (userProfile.portfolioValue > 2000) {
          insights.push({
            type: 'market-trend',
            title: 'Carbon Credit Price Surge',
            message: 'Verified carbon credits from reforestation projects have increased 15% this quarter. Consider locking in current rates.',
            severity: 'info',
            actionable: true
          });
        }

        // Portfolio optimization
        const currentProgress = (userProfile.currentImpact / userGoals.offsetTarget) * 100;
        if (currentProgress < 40) {
          insights.push({
            type: 'portfolio-optimization',
            title: 'Diversification Opportunity',
            message: 'Your portfolio is concentrated in Amazon projects. Consider adding cloud forest investments for better risk distribution.',
            severity: 'warning',
            actionable: true
          });
        }

        // Risk alerts
        if (userProfile.monthlyBudget < 200) {
          insights.push({
            type: 'risk-alert',
            title: 'Budget Adjustment Recommended',
            message: 'Current budget may not achieve your offset goals by the target date. Consider increasing monthly allocation by £50.',
            severity: 'warning',
            actionable: true
          });
        }

        setAiInsights(insights);
        setIsAnalyzing(false);
      }, 2500);
    }
  }, [isOpen, userGoals, userProfile]);

  if (!isOpen) return null;

  const renderProjectSuggestions = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center">
        <CpuChipIcon className="h-5 w-5 mr-2 text-green-400" />
        AI-Recommended Reforestation Projects
      </h3>
      {isAnalyzing ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <span className="ml-3 text-gray-300">Analyzing forest health data and matching optimal projects...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {projectSuggestions.map((project) => (
            <div key={project.id} className="bg-base-200 rounded-lg p-4 border border-gray-600 hover:border-green-400 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-white">{project.name}</h4>
                  {project.verificationStatus === 'verified' && (
                    <ShieldCheckIcon className="h-4 w-4 text-blue-400" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-green-500 text-white px-2 py-1 rounded">
                    AI: {project.aiHealthScore}
                  </span>
                  <span className="text-sm bg-purple-500 text-white px-2 py-1 rounded">
                    {project.matchScore}% match
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <MapIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">{project.region}</span>
                <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">{project.ecosystem}</span>
              </div>
              
              <p className="text-gray-300 text-sm mb-3">{project.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-sm">
                  <span className="text-gray-400">CO₂ Potential:</span>
                  <span className="text-green-400 font-semibold ml-1">{project.carbonOffsetPotential} kg/year</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Min Investment:</span>
                  <span className="text-white font-semibold ml-1">£{project.minInvestment}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Projected ROI:</span>
                  <span className="text-blue-400 font-semibold ml-1">{project.projectedROI}%</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Verification:</span>
                  <span className="text-green-400 font-semibold ml-1 capitalize">{project.verificationStatus}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <button className="btn btn-sm btn-outline text-gray-400 hover:text-white">
                  View Details
                </button>
                <button className="btn btn-sm btn-primary">
                  Invest Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderInvestmentPlans = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center">
        <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-emerald-400" />
        Optimized Investment Strategy
      </h3>
      {isAnalyzing ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <span className="ml-3 text-gray-300">Calculating optimal investment strategy...</span>
        </div>
      ) : investmentPlan ? (
        <div className="space-y-4">
          <div className="bg-base-200 rounded-lg p-4 border border-gray-600">
            <h4 className="font-semibold text-white mb-3">Recommended Investment Schedule</h4>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">£{investmentPlan.monthly}</div>
                <div className="text-sm text-gray-400">Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">£{investmentPlan.quarterly}</div>
                <div className="text-sm text-gray-400">Quarterly</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">£{investmentPlan.annual}</div>
                <div className="text-sm text-gray-400">Annual</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-emerald-500 bg-opacity-20 rounded-lg">
                <div className="text-emerald-400 font-bold">{investmentPlan.projectedCarbonImpact} kg CO₂</div>
                <div className="text-sm text-gray-300">Projected Impact</div>
              </div>
              <div className="text-center p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                <div className="text-blue-400 font-bold">{investmentPlan.projectedROI}% ROI</div>
                <div className="text-sm text-gray-300">Annual Return</div>
              </div>
            </div>
          </div>
          
          <div className="bg-base-200 rounded-lg p-4 border border-gray-600">
            <h4 className="font-semibold text-white mb-3">Diversification Strategy</h4>
            <div className="space-y-2">
              {investmentPlan.diversificationStrategy.map((allocation, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{allocation.split('(')[0]}</span>
                  <span className="text-emerald-400 font-semibold">{allocation.split('(')[1]?.replace(')', '')}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-base-200 rounded-lg p-4 border border-gray-600">
            <h4 className="font-semibold text-white mb-3">Impact Milestones</h4>
            <div className="space-y-2">
              {investmentPlan.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                  <span className="text-gray-300">{milestone}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button className="btn btn-success w-full">
            Implement AI Strategy
          </button>
        </div>
      ) : null}
    </div>
  );

  const renderAIInsights = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center">
        <BeakerIcon className="h-5 w-5 mr-2 text-yellow-400" />
        AI Forest Intelligence & Market Insights
      </h3>
      {isAnalyzing ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          <span className="ml-3 text-gray-300">Analyzing forest health data and market trends...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {aiInsights.map((insight, index) => {
            const severityColors = {
              info: 'border-blue-400 bg-blue-500',
              warning: 'border-yellow-400 bg-yellow-500',
              success: 'border-green-400 bg-green-500',
              error: 'border-red-400 bg-red-500'
            };
            
            const typeIcons = {
              'forest-health': '🌳',
              'market-trend': '📈',
              'portfolio-optimization': '🎯',
              'risk-alert': '⚠️'
            };

            return (
              <div key={index} className={`bg-base-200 rounded-lg p-4 border ${severityColors[insight.severity]} bg-opacity-20`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white flex items-center">
                    <span className="mr-2">{typeIcons[insight.type]}</span>
                    {insight.title}
                  </h4>
                  {insight.actionable && (
                    <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">Actionable</span>
                  )}
                </div>
                <p className="text-gray-300 text-sm mb-3">{insight.message}</p>
                {insight.actionable && (
                  <button className="btn btn-sm btn-outline">
                    Take Action
                  </button>
                )}
              </div>
            );
          })}
          
          <div className="bg-base-200 rounded-lg p-4 border border-gray-600">
            <h4 className="font-semibold text-white mb-2 flex items-center">
              <GlobeEuropeAfricaIcon className="h-4 w-4 mr-2" />
              Portfolio Overview
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Carbon Impact:</span>
                <span className="text-white">{userProfile.currentImpact} kg CO₂</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Target Impact:</span>
                <span className="text-white">{userGoals.offsetTarget} kg CO₂</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Portfolio Value:</span>
                <span className="text-emerald-400">£{userProfile.portfolioValue}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-3">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((userProfile.currentImpact / userGoals.offsetTarget) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-400">
                {Math.round((userProfile.currentImpact / userGoals.offsetTarget) * 100)}% of target achieved
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600 bg-gradient-to-r from-green-900 to-emerald-900">
          <h2 className="text-xl font-bold text-white flex items-center">
            <SparklesIcon className="h-6 w-6 mr-2 text-green-400" />
            AI Reforestation Investment Assistant
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-600">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'projects'
                ? 'text-green-400 border-b-2 border-green-400 bg-green-500 bg-opacity-10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🌳 Project Recommendations
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'plans'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500 bg-opacity-10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📊 Investment Strategy
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'insights'
                ? 'text-yellow-400 border-b-2 border-yellow-400 bg-yellow-500 bg-opacity-10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🧠 AI Insights
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'projects' && renderProjectSuggestions()}
          {activeTab === 'plans' && renderInvestmentPlans()}
          {activeTab === 'insights' && renderAIInsights()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-600 bg-base-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              🤖 AI-powered recommendations based on real-time forest health data and market analysis
            </div>
            <div className="flex space-x-3">
              <button onClick={onClose} className="btn btn-ghost">
                Close
              </button>
              <button className="btn btn-primary bg-gradient-to-r from-green-500 to-emerald-500">
                Apply AI Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAgentPopup;