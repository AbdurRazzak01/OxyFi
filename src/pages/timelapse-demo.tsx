import React, { useState } from 'react';
import { NextPage } from 'next';
import TimelapseViewer from '../components/TimelapseViewer';
import { MLPrediction } from './api/ml/predict-health';

const TimelapseDemo: NextPage = () => {
  const [selectedProject, setSelectedProject] = useState('project-001');
  const [coordinates, setCoordinates] = useState({
    lat: 37.7749,
    lng: -122.4194,
  });
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });
  const [predictions, setPredictions] = useState<MLPrediction[]>([]);

  // Sample project locations
  const sampleProjects = [
    {
      id: 'project-001',
      name: 'San Francisco Urban Forest',
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    {
      id: 'project-002',
      name: 'Central Valley Agriculture',
      coordinates: { lat: 37.2431, lng: -120.8234 },
    },
    {
      id: 'project-003',
      name: 'Marin County Wilderness',
      coordinates: { lat: 38.0834, lng: -122.7633 },
    },
    {
      id: 'project-004',
      name: 'Napa Valley Vineyards',
      coordinates: { lat: 38.5025, lng: -122.2654 },
    },
  ];

  const handleProjectChange = (projectId: string) => {
    const project = sampleProjects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(projectId);
      setCoordinates(project.coordinates);
    }
  };

  const handlePredictionUpdate = (prediction: MLPrediction) => {
    setPredictions(prev => {
      // Keep only the last 10 predictions
      const updated = [prediction, ...prev].slice(0, 10);
      return updated;
    });
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getHealthColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    if (score >= 0.4) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Satellite Timelapse Viewer Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience real-time satellite imagery analysis with AI-powered health predictions. 
            Select a project location and watch vegetation health changes over time.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Project Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Location
              </label>
              <select
                value={selectedProject}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sampleProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Coordinates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={coordinates.lat}
                onChange={(e) => setCoordinates(prev => ({ ...prev, lat: parseFloat(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={coordinates.lng}
                onChange={(e) => setCoordinates(prev => ({ ...prev, lng: parseFloat(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={formatDate(dateRange.start)}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={formatDate(dateRange.end)}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Timelapse Viewer */}
          <div className="lg:col-span-3">
            <TimelapseViewer
              projectId={selectedProject}
              coordinates={coordinates}
              dateRange={dateRange}
              onPredictionUpdate={handlePredictionUpdate}
            />
          </div>

          {/* Predictions Sidebar */}
          <div className="space-y-6">
            {/* Latest Prediction */}
            {predictions.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Analysis</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getHealthColor(predictions[0].healthScore)}`}>
                      {(predictions[0].healthScore * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-600">Health Score</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="text-sm font-medium capitalize">
                        {predictions[0].classification}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <span className="text-sm font-medium">
                        {(predictions[0].confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {predictions[0].detectedIssues.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Issues Detected:</p>
                      <div className="space-y-1">
                        {predictions[0].detectedIssues.map((issue, index) => (
                          <div
                            key={index}
                            className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs"
                          >
                            {issue.replace(/_/g, ' ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Prediction History */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis History</h3>
              
              {predictions.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Start the timelapse to see ML predictions
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {predictions.map((prediction, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-3 text-sm"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-semibold ${getHealthColor(prediction.healthScore)}`}>
                          {(prediction.healthScore * 100).toFixed(0)}%
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(prediction.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span className="capitalize">{prediction.classification}</span>
                        <span>{(prediction.confidence * 100).toFixed(0)}% confident</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Usage Instructions */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Select a project location from the dropdown</li>
                <li>• Adjust coordinates and date range as needed</li>
                <li>• Click play to start the timelapse</li>
                <li>• ML predictions appear automatically during playback</li>
                <li>• Use the slider to manually navigate frames</li>
                <li>• Toggle prediction overlay on/off</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            This demo uses mock satellite imagery and ML predictions for demonstration purposes.
            In production, this would connect to real satellite data providers and trained ML models.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelapseDemo;