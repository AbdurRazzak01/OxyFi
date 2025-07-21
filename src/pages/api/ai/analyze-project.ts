import { NextApiRequest, NextApiResponse } from 'next';
import { aiForestService, analyzeProjectWithAI } from '../../../services/aiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectData } = req.body;

    if (!projectData) {
      return res.status(400).json({ error: 'Project data is required' });
    }

    // Validate required fields
    if (!projectData.location || !projectData.location.latitude || !projectData.location.longitude) {
      return res.status(400).json({ error: 'Project location coordinates are required' });
    }

    // Perform AI analysis
    const analysis = await analyzeProjectWithAI(projectData);

    res.status(200).json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({
      error: 'AI analysis failed',
      message: error.message,
    });
  }
}