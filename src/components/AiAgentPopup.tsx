import React, { useState, useEffect } from 'react';
import { XIcon, SparklesIcon, TrendingUpIcon, ExclamationTriangleIcon } from '@heroicons/react/outline';

interface AiAgentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userGoals?: {
    offsetTarget?: number;
    timeline?: string;
    preferredCategories?: string[];
  };
  userProfile?: {
    currentImpact?: number;
    monthlyBudget?: number;
    previousContributions?: number;
  };
}

interface ProjectSuggestion {
  id: string;
  name: string;
  category: string;
  impactPerDollar: number;
  description: string;
  matchScore: number;
  carbonOffset: number;
  price: number;
}

interface ContributionPlan {
  monthly: number;
  quarterly: number;
  annual: number;
  projectedImpact: number;
  milestones: string[];
}

const AiAgentPopup: React.FC<AiAgentPopupProps> = ({
  isOpen,
  onClose,
  userGoals = {
    offsetTarget: 1000,
    timeline: '12 months',
    preferredCategories: ['renewable-energy', 'reforestation']
  },
  userProfile = {
    currentImpact: 250,
    monthlyBudget: 100,
    previousContributions: 3
  }
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'plans' | 'alerts'>('projects');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [projectSuggestions, setProjectSuggestions] = useState<ProjectSuggestion[]>([]);
  const [contributionPlan, setContributionPlan] = useState<ContributionPlan | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);

  // Simulate AI analysis on popup open
  useEffect(() => {
    if (isOpen) {
      setIsAnalyzing(true);
      setTimeout(() => {
        // Mock AI-generated project suggestions
        setProjectSuggestions([
          {
            id: '1',
            name: 'Amazon Rainforest Conservation',
            category: 'reforestation',
            impactPerDollar: 12.5,
            description: 'Protect 100 acres of rainforest per $50 contribution',
            matchScore: 95,
            carbonOffset: 250,
            price: 50
          },
          {
            id: '2',
            name: 'Solar Farm Development',
            category: 'renewable-energy',
            impactPerDollar: 8.3,
            description: 'Fund solar panel installation in rural communities',
            matchScore: 88,
            carbonOffset: 166,
            price: 75
          },
          {
            id: '3',
            name: 'Ocean Cleanup Initiative',
            category: 'ocean-restoration',
            impactPerDollar: 15.2,
            description: 'Remove plastic waste and restore marine ecosystems',
            matchScore: 82,
            carbonOffset: 304,
            price: 40
          }
        ]);

        // Mock AI-generated contribution plan
        setContributionPlan({
          monthly: 85,
          quarterly: 255,
          annual: 1020,
          projectedImpact: 1275,
          milestones: [
            'Month 3: 25% of offset goal achieved',
            'Month 6: 50% of offset goal achieved',
            'Month 9: 75% of offset goal achieved',
            'Month 12: 100% offset goal achieved'
          ]
        });

        // Mock AI-generated alerts
        const currentProgress = (userProfile.currentImpact / userGoals.offsetTarget) * 100;
        const alertMessages = [];
        
        if (currentProgress < 25) {
          alertMessages.push('⚠️ You\'re behind on your offset goals. Consider increasing monthly contributions.');
        }
        if (userProfile.monthlyBudget < 50) {
          alertMessages.push('💡 Your current budget may not meet your annual offset target. Consider adjusting.');
        }
        if (userProfile.previousContributions < 2) {
          alertMessages.push('🎯 New to carbon offsetting? Start with smaller, verified projects to build confidence.');
        }

        setAlerts(alertMessages);
        setIsAnalyzing(false);
      }, 2000);
    }
  }, [isOpen, userGoals, userProfile]);

  if (!isOpen) return null;

  const renderProjectSuggestions = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center">
        <SparklesIcon className="h-5 w-5 mr-2 text-primary-focus" />
        AI-Recommended Projects
      </h3>
      {isAnalyzing ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-focus"></div>
          <span className="ml-3 text-gray-300">Analyzing your goals...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {projectSuggestions.map((project) => (
            <div key={project.id} className="bg-base-200 rounded-lg p-4 border border-gray-600">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white">{project.name}</h4>
                <span className="text-sm bg-primary-focus text-white px-2 py-1 rounded">
                  {project.matchScore}% match
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-3">{project.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  <span className="text-success">{project.carbonOffset} kg CO₂</span> offset
                  <span className="mx-2">•</span>
                  <span>${project.price}</span>
                </div>
                <button className="btn btn-sm btn-primary">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContributionPlans = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center">
        <TrendingUpIcon className="h-5 w-5 mr-2 text-success" />
        Optimized Contribution Plan
      </h3>
      {isAnalyzing ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-success"></div>
          <span className="ml-3 text-gray-300">Calculating optimal plan...</span>
        </div>
      ) : contributionPlan ? (
        <div className="space-y-4">
          <div className="bg-base-200 rounded-lg p-4 border border-gray-600">
            <h4 className="font-semibold text-white mb-3">Recommended Schedule</h4>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">${contributionPlan.monthly}</div>
                <div className="text-sm text-gray-400">Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">${contributionPlan.quarterly}</div>
                <div className="text-sm text-gray-400">Quarterly</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-info">${contributionPlan.annual}</div>
                <div className="text-sm text-gray-400">Annual</div>
              </div>
            </div>
            <div className="text-center p-3 bg-success bg-opacity-20 rounded-lg">
              <div className="text-success font-bold">Projected Impact: {contributionPlan.projectedImpact} kg CO₂</div>
              <div className="text-sm text-gray-300">Exceeds your goal by 27%</div>
            </div>
          </div>
          
          <div className="bg-base-200 rounded-lg p-4 border border-gray-600">
            <h4 className="font-semibold text-white mb-3">Milestone Timeline</h4>
            <div className="space-y-2">
              {contributionPlan.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-primary-focus rounded-full mr-3"></div>
                  <span className="text-gray-300">{milestone}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button className="btn btn-success w-full">
            Set Up Auto-Contributions
          </button>
        </div>
      ) : null}
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center">
        <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-warning" />
        Impact Alerts & Insights
      </h3>
      {isAnalyzing ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warning"></div>
          <span className="ml-3 text-gray-300">Analyzing your progress...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <div key={index} className="bg-base-200 rounded-lg p-4 border border-warning">
                <p className="text-gray-300">{alert}</p>
              </div>
            ))
          ) : (
            <div className="bg-base-200 rounded-lg p-4 border border-success">
              <p className="text-success font-semibold">🎉 Great job! You're on track with your offset goals.</p>
              <p className="text-gray-300 text-sm mt-1">Your current impact is aligned with your targets.</p>
            </div>
          )}
          
          <div className="bg-base-200 rounded-lg p-4 border border-gray-600">
            <h4 className="font-semibold text-white mb-2">Progress Overview</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Impact:</span>
                <span className="text-white">{userProfile.currentImpact} kg CO₂</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Target Impact:</span>
                <span className="text-white">{userGoals.offsetTarget} kg CO₂</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary-focus h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((userProfile.currentImpact / userGoals.offsetTarget) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-400">
                {Math.round((userProfile.currentImpact / userGoals.offsetTarget) * 100)}% complete
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-xl font-bold text-white flex items-center">
            <SparklesIcon className="h-6 w-6 mr-2 text-primary-focus" />
            AI Carbon Offset Assistant
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm text-gray-400 hover:text-white"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-600">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'projects'
                ? 'text-primary-focus border-b-2 border-primary-focus'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Project Suggestions
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'plans'
                ? 'text-primary-focus border-b-2 border-primary-focus'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Contribution Plans
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'alerts'
                ? 'text-primary-focus border-b-2 border-primary-focus'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Impact Alerts
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'projects' && renderProjectSuggestions()}
          {activeTab === 'plans' && renderContributionPlans()}
          {activeTab === 'alerts' && renderAlerts()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-600 bg-base-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              AI recommendations based on your goals and preferences
            </div>
            <div className="flex space-x-3">
              <button onClick={onClose} className="btn btn-ghost">
                Close
              </button>
              <button className="btn btn-primary">
                Apply Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAgentPopup;