import { NextApiRequest, NextApiResponse } from 'next';
import { aiForestService } from '../../../services/aiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userProfile, availableProjects } = req.body;

    if (!userProfile || !availableProjects) {
      return res.status(400).json({ 
        error: 'User profile and available projects are required' 
      });
    }

    // Generate AI-powered investment recommendations
    const recommendations = await aiForestService.generateInvestmentRecommendations(
      userProfile,
      availableProjects
    );

    res.status(200).json({
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Investment recommendation error:', error);
    res.status(500).json({
      error: 'Investment recommendation failed',
      message: error.message,
    });
  }
}