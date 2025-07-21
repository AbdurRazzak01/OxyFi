import React, { useEffect, useRef, useCallback } from 'react';
import { useForestAnalysis, formatHealthScore, formatCO2Offset, ForestAnalysisResult } from '../utils/ml';
import Image from 'next/image';
import { XMarkIcon, PlayIcon, CurrencyDollarIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';


// Project data interface
export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  healthScore: number; // 0-100 from ML model
  predictedCO2Offset: number; // tons per year
  imageUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  metrics: {
    totalArea: number; // hectares
    treesPlanted?: number;
    startDate: string;
    projectType: 'reforestation' | 'conservation' | 'renewable' | 'restoration';
  };
  investment: {
    targetAmount: number;
    currentAmount: number;
    tokenPrice: number; // price per carbon credit token
    availableTokens: number;
  };
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onInvest: (project: Project) => void;
  onBuyToken: (project: Project) => void;
  onViewTimelapse: (project: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onInvest,
  onBuyToken,
  onViewTimelapse,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableElementRef = useRef<HTMLButtonElement>(null);

  // Real-time forest analysis with ML
  const { analysis, loading, error } = useForestAnalysis(
    project?.imageUrl || null,
    project?.coordinates,
    15000 // Refresh every 15 seconds
  );

  // Use real-time analysis when available
  const currentAnalysis = analysis;

  // Handle click outside modal
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, handleClickOutside]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap for accessibility
  const handleTabKey = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleTabKey);
    }
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const progressPercentage = (project.investment.currentAmount / project.investment.targetAmount) * 100;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className="bg-base-100 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-base-300">
          <div className="flex-1">
            <h2 id="modal-title" className="text-2xl font-bold text-base-content mb-2">
              {project.name}
            </h2>
            <p className="text-sm text-base-content opacity-70">
              📍 {project.location}
            </p>
          </div>
          <button
            ref={firstFocusableElementRef}
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle ml-4"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Image and Basic Info */}
            <div>
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x300?text=Forest+Project';
                  }}
                />
                
                {/* Loading overlay */}
                {loading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                )}

                {/* Real-time indicator */}
                {currentAnalysis && (
                  <div className="absolute top-4 right-4 bg-black bg-opacity-75 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-white font-medium">Live Analysis</span>
                    </div>
                  </div>
                )}
              </div>

              {project.description && (
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">About This Project</h3>
                  <p className="text-gray-300 leading-relaxed">{project.description}</p>
                </div>
              )}
            </div>

            {/* Right Column - Analysis Results */}
            <div>
              {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                  <h3 className="text-red-400 font-semibold mb-2">Analysis Error</h3>
                  <p className="text-red-300 text-sm">Unable to fetch real-time analysis data</p>
                </div>
              )}

              {currentAnalysis ? (
                <div className="space-y-6">
                  {/* Main Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Forest Health */}
                    <div className={`p-4 rounded-lg border ${getHealthScoreColor(currentAnalysis.forestHealthScore)}`}>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getHealthScoreColor(currentAnalysis.forestHealthScore)}`}>
                          {formatHealthScore(currentAnalysis.forestHealthScore).text}
                        </div>
                        <div className="text-sm text-gray-300 mt-1">Forest Health</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatHealthScore(currentAnalysis.forestHealthScore).description}
                        </div>
                      </div>
                    </div>

                    {/* CO₂ Offset */}
                    <div className="p-4 rounded-lg border bg-blue-500/20 border-blue-500">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {formatCO2Offset(currentAnalysis.co2OffsetEstimate)}
                        </div>
                        <div className="text-sm text-gray-300 mt-1">CO₂ Offset</div>
                        <div className="text-xs text-gray-400 mt-1">Annual estimate</div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Metrics */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Detailed Analysis</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {currentAnalysis.metadata.estimatedTreeCount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">Estimated Trees</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {currentAnalysis.metadata.areaAnalyzed.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-400">Hectares Analyzed</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {Math.round(currentAnalysis.metadata.vegetationDensity * 100)}%
                          </div>
                          <div className="text-sm text-gray-400">Vegetation Density</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {Math.round(currentAnalysis.confidence * 100)}%
                          </div>
                          <div className="text-sm text-gray-400">Confidence Level</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Metadata */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Analysis Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-white">
                          {new Date(currentAnalysis.metadata.analysisDate).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Analysis Method:</span>
                        <span className="text-white">Satellite Imagery + ML</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Data Source:</span>
                        <span className="text-white">Real-time Satellite Feed</span>
                      </div>
                      {project.coordinates && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Coordinates:</span>
                          <span className="text-white">
                            {project.coordinates.lat.toFixed(4)}, {project.coordinates.lng.toFixed(4)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Update Frequency Notice */}
                  <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <p className="text-xs text-gray-400">
                      Analysis updates automatically every 15 seconds
                    </p>
                  </div>
                </div>
              ) : (
                /* Loading State */
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Analyzing satellite imagery...</p>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-700 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-6">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                // This would trigger a refresh of the analysis
                window.location.reload();
              }}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-all"
            >
              Refresh Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;