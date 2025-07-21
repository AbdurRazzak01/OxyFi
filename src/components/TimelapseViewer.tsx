import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayIcon, PauseIcon, StopIcon } from '@heroicons/react/24/solid';

interface SatelliteImage {
  id: string;
  url: string;
  timestamp: string;
  date: Date;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface MLPrediction {
  healthScore: number;
  classification: 'healthy' | 'stressed' | 'diseased' | 'dead';
  confidence: number;
  detectedIssues: string[];
  timestamp: string;
}

interface TimelapseViewerProps {
  projectId: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  dateRange: {
    start: Date;
    end: Date;
  };
  onPredictionUpdate?: (prediction: MLPrediction) => void;
}

const TimelapseViewer: React.FC<TimelapseViewerProps> = ({
  projectId,
  coordinates,
  dateRange,
  onPredictionUpdate,
}) => {
  const [images, setImages] = useState<SatelliteImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<Map<string, MLPrediction>>(new Map());
  const [showPredictions, setShowPredictions] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(500); // milliseconds between frames
  const [error, setError] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Fetch satellite imagery from API
  const fetchSatelliteImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/satellite/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          coordinates,
          dateRange: {
            start: dateRange.start.toISOString(),
            end: dateRange.end.toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch satellite images: ${response.statusText}`);
      }

      const data = await response.json();
      const sortedImages = data.images
        .map((img: any) => ({
          ...img,
          date: new Date(img.timestamp),
        }))
        .sort((a: SatelliteImage, b: SatelliteImage) => a.date.getTime() - b.date.getTime());
      
      setImages(sortedImages);
      setCurrentImageIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch satellite images');
      console.error('Error fetching satellite images:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, coordinates, dateRange]);

  // Send image to ML model for health prediction
  const predictHealth = useCallback(async (imageUrl: string, imageId: string) => {
    try {
      const response = await fetch('/api/ml/predict-health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          imageId,
          projectId,
          coordinates,
        }),
      });

      if (!response.ok) {
        throw new Error(`ML prediction failed: ${response.statusText}`);
      }

      const prediction: MLPrediction = await response.json();
      
      setPredictions(prev => new Map(prev.set(imageId, prediction)));
      
      if (onPredictionUpdate) {
        onPredictionUpdate(prediction);
      }

      return prediction;
    } catch (err) {
      console.error('Error getting ML prediction:', err);
      return null;
    }
  }, [projectId, coordinates, onPredictionUpdate]);

  // Draw image with health prediction overlay
  const drawImageWithOverlay = useCallback((image: SatelliteImage) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw satellite image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw prediction overlay if available and enabled
    if (showPredictions) {
      const prediction = predictions.get(image.id);
      if (prediction) {
        drawHealthOverlay(ctx, prediction, canvas.width, canvas.height);
      }
    }
  }, [predictions, showPredictions]);

  // Draw health prediction overlay on canvas
  const drawHealthOverlay = (
    ctx: CanvasRenderingContext2D,
    prediction: MLPrediction,
    width: number,
    height: number
  ) => {
    // Health score circle
    const centerX = width - 80;
    const centerY = 80;
    const radius = 30;

    // Background circle
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.fill();

    // Health score color
    const getHealthColor = (score: number) => {
      if (score >= 0.8) return '#22c55e'; // green
      if (score >= 0.6) return '#eab308'; // yellow
      if (score >= 0.4) return '#f97316'; // orange
      return '#ef4444'; // red
    };

    ctx.fillStyle = getHealthColor(prediction.healthScore);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Health score text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText((prediction.healthScore * 100).toFixed(0), centerX, centerY + 5);

    // Classification label
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, height - 80, 200, 60);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Status: ${prediction.classification}`, 20, height - 55);
    ctx.font = '12px Arial';
    ctx.fillText(`Confidence: ${(prediction.confidence * 100).toFixed(1)}%`, 20, height - 35);
    
    if (prediction.detectedIssues.length > 0) {
      ctx.fillText(`Issues: ${prediction.detectedIssues.join(', ')}`, 20, height - 15);
    }
  };

  // Handle image load
  const handleImageLoad = useCallback(() => {
    if (images.length > 0) {
      const currentImage = images[currentImageIndex];
      drawImageWithOverlay(currentImage);
      
      // Get ML prediction for current image if not already cached
      if (!predictions.has(currentImage.id) && isPlaying) {
        predictHealth(currentImage.url, currentImage.id);
      }
    }
  }, [images, currentImageIndex, drawImageWithOverlay, predictions, predictHealth, isPlaying]);

  // Playback controls
  const play = useCallback(() => {
    if (images.length === 0) return;
    
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex(prev => {
        const nextIndex = (prev + 1) % images.length;
        return nextIndex;
      });
    }, playbackSpeed);
  }, [images.length, playbackSpeed]);

  const pause = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stop = () => {
    pause();
    setCurrentImageIndex(0);
  };

  const seekTo = (index: number) => {
    setCurrentImageIndex(Math.max(0, Math.min(index, images.length - 1)));
  };

  // Effect to update image when index changes
  useEffect(() => {
    if (images.length > 0 && imageRef.current) {
      const currentImage = images[currentImageIndex];
      imageRef.current.src = currentImage.url;
    }
  }, [images, currentImageIndex]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Fetch images on mount or when props change
  useEffect(() => {
    fetchSatelliteImages();
  }, [fetchSatelliteImages]);

  const currentImage = images[currentImageIndex];
  const currentPrediction = currentImage ? predictions.get(currentImage.id) : null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">
          Satellite Timelapse Viewer - Project {projectId}
        </h2>
        <p className="text-gray-300 text-sm">
          {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)} | {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
        </p>
      </div>

      {/* Main viewer */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading satellite imagery...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-600 text-white p-4 m-4 rounded">
            <p>Error: {error}</p>
            <button 
              onClick={fetchSatelliteImages}
              className="mt-2 px-4 py-2 bg-red-700 rounded hover:bg-red-800"
            >
              Retry
            </button>
          </div>
        )}

        {images.length > 0 && (
          <>
            <div className="relative bg-black">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-auto max-h-96 object-contain"
              />
              <img
                ref={imageRef}
                onLoad={handleImageLoad}
                className="hidden"
                alt="Satellite imagery"
              />
              
              {/* Image info overlay */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded">
                <p className="text-sm">
                  {currentImage?.date.toLocaleDateString()} {currentImage?.date.toLocaleTimeString()}
                </p>
                <p className="text-xs">
                  Frame {currentImageIndex + 1} of {images.length}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 px-6 py-4">
              {/* Playback controls */}
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button
                  onClick={isPlaying ? pause : play}
                  className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
                >
                  {isPlaying ? (
                    <PauseIcon className="w-6 h-6" />
                  ) : (
                    <PlayIcon className="w-6 h-6 ml-1" />
                  )}
                </button>
                
                <button
                  onClick={stop}
                  className="flex items-center justify-center w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-full text-white"
                >
                  <StopIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Timeline slider */}
              <div className="mb-4">
                <input
                  type="range"
                  min={0}
                  max={images.length - 1}
                  value={currentImageIndex}
                  onChange={(e) => seekTo(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Settings */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <label className="text-gray-300">Speed:</label>
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))}
                    className="bg-gray-700 text-white rounded px-2 py-1"
                  >
                    <option value={1000}>0.5x</option>
                    <option value={500}>1x</option>
                    <option value={250}>2x</option>
                    <option value={125}>4x</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-predictions"
                    checked={showPredictions}
                    onChange={(e) => setShowPredictions(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="show-predictions" className="text-gray-300">
                    Show Health Predictions
                  </label>
                </div>

                <button
                  onClick={fetchSatelliteImages}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Prediction details */}
            {currentPrediction && showPredictions && (
              <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
                <h3 className="text-lg font-semibold text-white mb-2">Health Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-300">Health Score</p>
                    <p className="text-xl font-bold text-white">
                      {(currentPrediction.healthScore * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300">Classification</p>
                    <p className="text-lg font-semibold text-white capitalize">
                      {currentPrediction.classification}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300">Confidence</p>
                    <p className="text-lg font-semibold text-white">
                      {(currentPrediction.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                {currentPrediction.detectedIssues.length > 0 && (
                  <div className="mt-3">
                    <p className="text-gray-300">Detected Issues:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {currentPrediction.detectedIssues.map((issue, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-600 text-white rounded text-xs"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TimelapseViewer;