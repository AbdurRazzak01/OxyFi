import React, { useState } from 'react';
import { useForestAnalysis, formatHealthScore, formatCO2Offset, ForestAnalysisResult } from '../utils/ml';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    location: string;
    imageUrl: string;
    coordinates?: { lat: number; lng: number };
    description?: string;
  };
  onViewDetails?: (project: any, analysis: ForestAnalysisResult | null) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
  const { analysis, loading, error } = useForestAnalysis(
    project.imageUrl,
    project.coordinates,
    30000 // Refresh every 30 seconds
  );

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(project, analysis);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl">
      {/* Project Image */}
      <div className="relative h-48 bg-gray-900">
        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Forest+Project';
          }}
        />
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {/* Real-time analysis badge */}
        {analysis && !loading && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 rounded-lg px-2 py-1">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-white">Live Analysis</span>
            </div>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">{project.name}</h3>
            <p className="text-gray-400 text-sm">{project.location}</p>
          </div>
          
          {/* Analysis confidence indicator */}
          {analysis && (
            <div className="text-right">
              <div className="text-xs text-gray-400">Confidence</div>
              <div className="text-sm font-medium text-white">
                {Math.round(analysis.confidence * 100)}%
              </div>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">Analysis unavailable</p>
          </div>
        )}

        {analysis && !loading && (
          <div className="mb-4 space-y-3">
            {/* Forest Health Score */}
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Forest Health</span>
              <div className="text-right">
                <div className={`font-semibold ${getHealthScoreColor(analysis.forestHealthScore)}`}>
                  {formatHealthScore(analysis.forestHealthScore).text}
                </div>
                <div className="text-xs text-gray-400">
                  {formatHealthScore(analysis.forestHealthScore).description}
                </div>
              </div>
            </div>

            {/* CO₂ Offset */}
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">CO₂ Offset</span>
              <div className="text-right">
                <div className="font-semibold text-blue-400">
                  {formatCO2Offset(analysis.co2OffsetEstimate)}
                </div>
                <div className="text-xs text-gray-400">
                  {analysis.metadata.areaAnalyzed.toFixed(1)} hectares
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-700">
              <div className="text-center">
                <div className="text-lg font-semibold text-white">
                  {analysis.metadata.estimatedTreeCount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">Est. Trees</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-white">
                  {Math.round(analysis.metadata.vegetationDensity * 100)}%
                </div>
                <div className="text-xs text-gray-400">Vegetation</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && !analysis && (
          <div className="mb-4 space-y-3">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-8 bg-gray-700 rounded"></div>
                <div className="h-8 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {project.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Action Button */}
        <button
          onClick={handleViewDetails}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          View Details
        </button>

        {/* Last Updated */}
        {analysis && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              Last analyzed: {new Date(analysis.metadata.analysisDate).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;