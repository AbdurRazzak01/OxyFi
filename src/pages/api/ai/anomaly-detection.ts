import { NextApiRequest, NextApiResponse } from 'next';
import { aiForestService, satelliteService } from '../../../services/aiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectId, baselineData, location } = req.body;

    if (!projectId || !baselineData || !location) {
      return res.status(400).json({ 
        error: 'Project ID, baseline data, and location are required' 
      });
    }

    // Fetch current satellite data
    const currentSatelliteData = await satelliteService.fetchSatelliteImages(
      location.latitude,
      location.longitude,
      location.areaHectares / 100,
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last week
      new Date().toISOString().split('T')[0] // Today
    );

    // Detect anomalies
    const anomalyAnalysis = await aiForestService.detectAnomalies(
      baselineData,
      currentSatelliteData
    );

    res.status(200).json({
      success: true,
      data: {
        projectId,
        anomalyAnalysis,
        currentSatelliteData,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Anomaly detection error:', error);
    res.status(500).json({
      error: 'Anomaly detection failed',
      message: error.message,
    });
  }
}