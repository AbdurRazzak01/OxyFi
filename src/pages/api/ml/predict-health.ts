import type { NextApiRequest, NextApiResponse } from 'next';

interface MLPredictionRequest {
  imageUrl: string;
  imageId: string;
  projectId: string;
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
  analysis?: {
    vegetationIndex: number;
    moistureContent: number;
    temperatureAnomaly: number;
    changeDetection: string[];
  };
}

// Mock ML prediction for demonstration
const generateMockPrediction = (imageId: string): MLPrediction => {
  // Simulate different health scenarios based on image ID
  const scenarios = [
    {
      healthScore: 0.92,
      classification: 'healthy' as const,
      confidence: 0.95,
      detectedIssues: [],
      vegetationIndex: 0.85,
      moistureContent: 0.78,
      temperatureAnomaly: 0.1,
      changeDetection: ['stable_vegetation'],
    },
    {
      healthScore: 0.65,
      classification: 'stressed' as const,
      confidence: 0.87,
      detectedIssues: ['water_stress', 'partial_defoliation'],
      vegetationIndex: 0.62,
      moistureContent: 0.45,
      temperatureAnomaly: 0.35,
      changeDetection: ['vegetation_decline', 'moisture_loss'],
    },
    {
      healthScore: 0.35,
      classification: 'diseased' as const,
      confidence: 0.82,
      detectedIssues: ['fungal_infection', 'severe_defoliation', 'growth_stunting'],
      vegetationIndex: 0.28,
      moistureContent: 0.32,
      temperatureAnomaly: 0.22,
      changeDetection: ['rapid_vegetation_loss', 'disease_spread'],
    },
    {
      healthScore: 0.15,
      classification: 'dead' as const,
      confidence: 0.94,
      detectedIssues: ['complete_defoliation', 'bare_soil', 'erosion'],
      vegetationIndex: 0.05,
      moistureContent: 0.12,
      temperatureAnomaly: 0.45,
      changeDetection: ['vegetation_removed', 'soil_exposure'],
    },
  ];

  // Use image ID to deterministically select a scenario
  const scenarioIndex = parseInt(imageId.slice(-1), 10) % scenarios.length;
  const scenario = scenarios[scenarioIndex] || scenarios[0];

  return {
    healthScore: scenario.healthScore + (Math.random() - 0.5) * 0.1, // Add small random variation
    classification: scenario.classification,
    confidence: scenario.confidence + (Math.random() - 0.5) * 0.05,
    detectedIssues: scenario.detectedIssues,
    timestamp: new Date().toISOString(),
    analysis: {
      vegetationIndex: scenario.vegetationIndex + (Math.random() - 0.5) * 0.05,
      moistureContent: scenario.moistureContent + (Math.random() - 0.5) * 0.05,
      temperatureAnomaly: scenario.temperatureAnomaly + (Math.random() - 0.5) * 0.1,
      changeDetection: scenario.changeDetection,
    },
  };
};

// Function to call real ML model (placeholder for actual implementation)
const callMLModel = async (
  imageUrl: string,
  imageId: string,
  projectId: string,
  coordinates: { lat: number; lng: number }
): Promise<MLPrediction> => {
  try {
    // This would integrate with actual ML services like:
    // - TensorFlow Serving
    // - PyTorch Serve
    // - Amazon SageMaker
    // - Google AI Platform
    // - Azure Machine Learning
    // - Custom ML API

    const response = await fetch(`${process.env.ML_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ML_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        image_id: imageId,
        project_id: projectId,
        coordinates: coordinates,
        model_version: process.env.ML_MODEL_VERSION || 'v1.0',
        features: [
          'vegetation_health',
          'disease_detection',
          'stress_analysis',
          'change_detection',
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`ML API failed with status: ${response.status}`);
    }

    const data = await response.json();

    return {
      healthScore: data.health_score,
      classification: data.classification,
      confidence: data.confidence,
      detectedIssues: data.detected_issues || [],
      timestamp: new Date().toISOString(),
      analysis: {
        vegetationIndex: data.analysis?.vegetation_index,
        moistureContent: data.analysis?.moisture_content,
        temperatureAnomaly: data.analysis?.temperature_anomaly,
        changeDetection: data.analysis?.change_detection || [],
      },
    };
  } catch (error) {
    console.warn('Real ML API failed, using mock prediction:', error);
    // Fallback to mock prediction if real API fails
    return generateMockPrediction(imageId);
  }
};

// Function to download and preprocess image for ML model
const preprocessImage = async (imageUrl: string): Promise<Buffer | null> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    
    // Here you would typically:
    // 1. Resize image to model's expected input size
    // 2. Normalize pixel values
    // 3. Apply any required transformations
    // 4. Convert to the format expected by your ML model
    
    return Buffer.from(imageBuffer);
  } catch (error) {
    console.error('Error preprocessing image:', error);
    return null;
  }
};

// Validate coordinates are within reasonable bounds
const validateCoordinates = (coordinates: { lat: number; lng: number }): boolean => {
  return (
    coordinates.lat >= -90 &&
    coordinates.lat <= 90 &&
    coordinates.lng >= -180 &&
    coordinates.lng <= 180
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MLPrediction | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, imageId, projectId, coordinates }: MLPredictionRequest = req.body;

    // Validate input
    if (!imageUrl || !imageId || !projectId || !coordinates) {
      return res.status(400).json({
        error: 'Missing required parameters: imageUrl, imageId, projectId, coordinates',
      });
    }

    if (!validateCoordinates(coordinates)) {
      return res.status(400).json({
        error: 'Invalid coordinates',
      });
    }

    // Validate image URL format
    try {
      new URL(imageUrl);
    } catch {
      return res.status(400).json({
        error: 'Invalid image URL format',
      });
    }

    // Optional: Download and preprocess image
    const imageBuffer = await preprocessImage(imageUrl);
    if (!imageBuffer) {
      // Continue with URL-based prediction if image download fails
      console.warn('Image preprocessing failed, using URL-based prediction');
    }

    // Call ML model for prediction
    const prediction = await callMLModel(imageUrl, imageId, projectId, coordinates);

    // Validate prediction results
    if (prediction.healthScore < 0 || prediction.healthScore > 1) {
      prediction.healthScore = Math.max(0, Math.min(1, prediction.healthScore));
    }

    if (prediction.confidence < 0 || prediction.confidence > 1) {
      prediction.confidence = Math.max(0, Math.min(1, prediction.confidence));
    }

    // Log prediction for monitoring/analytics
    console.log(`ML Prediction for ${imageId}:`, {
      projectId,
      healthScore: prediction.healthScore,
      classification: prediction.classification,
      confidence: prediction.confidence,
      issueCount: prediction.detectedIssues.length,
    });

    res.status(200).json(prediction);
  } catch (error) {
    console.error('Error in ML prediction:', error);
    res.status(500).json({
      error: 'Internal server error during ML prediction',
    });
  }
}

// Export types for use in other files
export type { MLPrediction, MLPredictionRequest };