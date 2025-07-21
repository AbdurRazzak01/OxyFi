import { useState, useEffect } from 'react';
import { PublicKey, Connection } from '@solana/web3.js';

// Types for our impact data
export interface ImpactData {
  totalCO2Offset: number;
  totalTokens: number;
  contributionTimeline: TimelineData[];
  forestData: ForestData;
  topProjects: ProjectData[];
}

export interface TimelineData {
  date: string;
  co2Offset: number;
  tokensEarned: number;
  projects: number;
}

export interface ForestData {
  treesPlanted: number;
  forestArea: number; // in hectares
  species: { name: string; count: number; color: string }[];
}

export interface ProjectData {
  id: string;
  name: string;
  type: string;
  contribution: number;
  co2Impact: number;
  tokensEarned: number;
}

// Mock data generator (in a real app, this would come from smart contract)
const generateMockData = (walletAddress: string): ImpactData => {
  // Use wallet address to generate consistent but varied data
  const seed = walletAddress.slice(-8);
  const hash = parseInt(seed, 16);
  
  const baseOffset = (hash % 1000) + 500;
  const baseTokens = (hash % 10000) + 5000;
  
  const contributionTimeline: TimelineData[] = [];
  const currentDate = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    
    contributionTimeline.push({
      date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      co2Offset: Math.floor((hash % 50) + 20 + (i * 5)),
      tokensEarned: Math.floor((hash % 200) + 100 + (i * 10)),
      projects: Math.floor((hash % 3) + 1)
    });
  }
  
  const forestSpecies = [
    { name: 'Oak Trees', count: Math.floor((hash % 50) + 25), color: '#22C55E' },
    { name: 'Pine Trees', count: Math.floor((hash % 40) + 20), color: '#16A34A' },
    { name: 'Birch Trees', count: Math.floor((hash % 30) + 15), color: '#15803D' },
    { name: 'Maple Trees', count: Math.floor((hash % 25) + 10), color: '#166534' }
  ];
  
  const topProjects: ProjectData[] = [
    {
      id: '1',
      name: 'Amazon Rainforest Restoration',
      type: 'Reforestation',
      contribution: Math.floor((hash % 5000) + 2000),
      co2Impact: Math.floor((hash % 200) + 100),
      tokensEarned: Math.floor((hash % 1000) + 500)
    },
    {
      id: '2', 
      name: 'Solar Farm Initiative',
      type: 'Renewable Energy',
      contribution: Math.floor((hash % 4000) + 1500),
      co2Impact: Math.floor((hash % 150) + 75),
      tokensEarned: Math.floor((hash % 800) + 400)
    },
    {
      id: '3',
      name: 'Ocean Cleanup Project',
      type: 'Marine Conservation',
      contribution: Math.floor((hash % 3000) + 1000),
      co2Impact: Math.floor((hash % 100) + 50),
      tokensEarned: Math.floor((hash % 600) + 300)
    },
    {
      id: '4',
      name: 'Carbon Capture Technology',
      type: 'Technology',
      contribution: Math.floor((hash % 2500) + 800),
      co2Impact: Math.floor((hash % 80) + 40),
      tokensEarned: Math.floor((hash % 500) + 250)
    }
  ];
  
  return {
    totalCO2Offset: baseOffset,
    totalTokens: baseTokens,
    contributionTimeline,
    forestData: {
      treesPlanted: forestSpecies.reduce((sum, species) => sum + species.count, 0),
      forestArea: Math.floor((hash % 100) + 50) / 10, // Convert to hectares with decimal
      species: forestSpecies
    },
    topProjects
  };
};

// Simulate fetching data from smart contract
const fetchImpactDataFromContract = async (
  walletAddress: PublicKey,
  connection: Connection
): Promise<ImpactData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // In a real implementation, you would:
  // 1. Define your program ID and account structures
  // 2. Use @solana/web3.js to fetch account data
  // 3. Parse the account data to extract impact metrics
  // 4. Aggregate data from multiple accounts if needed
  
  // Example real implementation:
  // const programId = new PublicKey('YourProgramIdHere');
  // const userImpactAccount = await PublicKey.findProgramAddress(
  //   [Buffer.from('user_impact'), walletAddress.toBuffer()],
  //   programId
  // );
  // const accountInfo = await connection.getAccountInfo(userImpactAccount[0]);
  // const impactData = YourImpactDataStruct.deserialize(accountInfo.data);
  
  return generateMockData(walletAddress.toBase58());
};

export const useImpactData = (
  walletAddress: PublicKey | null,
  connection: Connection | null
) => {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress || !connection) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const impactData = await fetchImpactDataFromContract(walletAddress, connection);
        setData(impactData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch impact data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [walletAddress, connection]);

  const refetch = () => {
    if (walletAddress && connection) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const impactData = await fetchImpactDataFromContract(walletAddress, connection);
          setData(impactData);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch impact data');
          setData(null);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};