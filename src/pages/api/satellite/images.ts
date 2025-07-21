import type { NextApiRequest, NextApiResponse } from 'next';

interface SatelliteImageRequest {
  projectId: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  dateRange: {
    start: string;
    end: string;
  };
}

interface SatelliteImage {
  id: string;
  url: string;
  timestamp: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface SatelliteImageResponse {
  images: SatelliteImage[];
  totalCount: number;
  message?: string;
}

// Mock satellite image data for demonstration
const generateMockSatelliteImages = (
  coordinates: { lat: number; lng: number },
  startDate: Date,
  endDate: Date
): SatelliteImage[] => {
  const images: SatelliteImage[] = [];
  const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const imageCount = Math.min(daysDiff, 20); // Limit to 20 images max
  
  for (let i = 0; i < imageCount; i++) {
    const imageDate = new Date(startDate.getTime() + (i * (daysDiff / imageCount) * 24 * 60 * 60 * 1000));
    
    images.push({
      id: `sat_${Date.now()}_${i}`,
      url: `https://picsum.photos/800/600?random=${i}&blur=1`, // Mock satellite imagery
      timestamp: imageDate.toISOString(),
      coordinates: {
        lat: coordinates.lat + (Math.random() - 0.5) * 0.001, // Small random variation
        lng: coordinates.lng + (Math.random() - 0.5) * 0.001,
      },
    });
  }
  
  return images;
};

// Function to fetch real satellite imagery (placeholder for actual implementation)
const fetchRealSatelliteImages = async (
  coordinates: { lat: number; lng: number },
  startDate: Date,
  endDate: Date,
  projectId: string
): Promise<SatelliteImage[]> => {
  // This would integrate with actual satellite image providers like:
  // - Google Earth Engine
  // - Sentinel Hub
  // - Planet Labs
  // - NASA Earthdata
  // - Landsat
  
  try {
    // Example integration with a hypothetical satellite API
    const response = await fetch(`${process.env.SATELLITE_API_URL}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SATELLITE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bbox: [
          coordinates.lng - 0.01,
          coordinates.lat - 0.01,
          coordinates.lng + 0.01,
          coordinates.lat + 0.01,
        ],
        time: `${startDate.toISOString()}/${endDate.toISOString()}`,
        collections: ['sentinel-2-l2a'],
        limit: 20,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from satellite API');
    }

    const data = await response.json();
    
    return data.features.map((feature: any, index: number) => ({
      id: feature.id || `sat_${Date.now()}_${index}`,
      url: feature.assets?.visual?.href || feature.properties?.thumbnail,
      timestamp: feature.properties?.datetime,
      coordinates: {
        lat: feature.geometry?.coordinates?.[1] || coordinates.lat,
        lng: feature.geometry?.coordinates?.[0] || coordinates.lng,
      },
    }));
  } catch (error) {
    console.warn('Real satellite API failed, using mock data:', error);
    // Fallback to mock data if real API fails
    return generateMockSatelliteImages(coordinates, startDate, endDate);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SatelliteImageResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      images: [],
      totalCount: 0,
      message: 'Method not allowed',
    });
  }

  try {
    const { projectId, coordinates, dateRange }: SatelliteImageRequest = req.body;

    // Validate input
    if (!projectId || !coordinates || !dateRange) {
      return res.status(400).json({
        images: [],
        totalCount: 0,
        message: 'Missing required parameters: projectId, coordinates, dateRange',
      });
    }

    if (!coordinates.lat || !coordinates.lng) {
      return res.status(400).json({
        images: [],
        totalCount: 0,
        message: 'Invalid coordinates',
      });
    }

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        images: [],
        totalCount: 0,
        message: 'Invalid date range',
      });
    }

    if (startDate >= endDate) {
      return res.status(400).json({
        images: [],
        totalCount: 0,
        message: 'Start date must be before end date',
      });
    }

    // Fetch satellite images
    const images = await fetchRealSatelliteImages(coordinates, startDate, endDate, projectId);

    // Sort by timestamp
    images.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    res.status(200).json({
      images,
      totalCount: images.length,
      message: images.length === 0 ? 'No satellite images found for the specified criteria' : undefined,
    });
  } catch (error) {
    console.error('Error fetching satellite images:', error);
    res.status(500).json({
      images: [],
      totalCount: 0,
      message: 'Internal server error while fetching satellite images',
    });
  }
}