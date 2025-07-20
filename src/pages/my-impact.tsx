import type { NextPage } from "next";
import Head from "next/head";
import { FC } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trees, Coins, TrendingUp, Award, Leaf } from 'lucide-react';
import { useImpactData, ImpactData, ForestData } from '../hooks/useImpactData';



const StatCard: FC<{ icon: React.ReactNode; title: string; value: string; subtitle?: string; gradient: string }> = ({ 
  icon, title, value, subtitle, gradient 
}) => (
  <div className={`rounded-xl p-6 text-white ${gradient} shadow-lg transform hover:scale-105 transition-transform duration-200`}>
    <div className="flex items-center justify-between mb-4">
      <div className="text-white/80">{icon}</div>
      <div className="text-right">
        <p className="text-sm font-medium opacity-90">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && <p className="text-xs opacity-75">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const ForestVisualizer: FC<{ forestData: ForestData }> = ({ forestData }) => {
  const totalTrees = forestData.treesPlanted;
  const rows = Math.ceil(Math.sqrt(totalTrees / 4));
  const treesPerRow = Math.ceil(totalTrees / rows);
  
  const treeIcons = [];
  let treeIndex = 0;
  
  for (let row = 0; row < Math.min(rows, 8); row++) {
    for (let col = 0; col < Math.min(treesPerRow, 12); col++) {
      if (treeIndex >= Math.min(totalTrees, 96)) break; // Limit display to 96 trees max
      
      // Determine species based on distribution
      let currentSpecies = forestData.species[0];
      let cumulativeCount = 0;
      
      for (const species of forestData.species) {
        cumulativeCount += species.count;
        if (treeIndex < cumulativeCount) {
          currentSpecies = species;
          break;
        }
      }
      
      treeIcons.push(
        <Trees 
          key={`${row}-${col}`}
          className="w-6 h-6 animate-pulse"
          style={{ 
            color: currentSpecies.color,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: '3s'
          }}
        />
      );
      treeIndex++;
    }
  }
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Trees className="w-6 h-6 text-green-600" />
        Your Virtual Forest
      </h3>
      
      <div className="grid grid-cols-12 gap-1 mb-6 p-4 bg-gradient-to-b from-sky-100 to-green-100 rounded-lg">
        {treeIcons}
        {treeIndex < totalTrees && (
          <div className="col-span-12 text-center text-sm text-gray-600 mt-2">
            + {totalTrees - Math.min(96, totalTrees)} more trees
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{totalTrees}</p>
          <p className="text-sm text-gray-600">Trees Planted</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{forestData.forestArea} ha</p>
          <p className="text-sm text-gray-600">Forest Area</p>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="font-semibold text-gray-800 mb-2">Species Distribution</h4>
        <div className="space-y-2">
          {forestData.species.map((species, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: species.color }}
                />
                <span className="text-sm text-gray-700">{species.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-800">{species.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MyImpactView: FC = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { data: impactData, loading, error } = useImpactData(wallet.publicKey, connection);

  if (!wallet.connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <Leaf className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">Connect your Solana wallet to view your environmental impact</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your impact data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!impactData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Impact Data Found</h2>
          <p className="text-gray-600">Start contributing to environmental projects to see your impact!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Environmental Impact</h1>
          <p className="text-lg text-gray-600">Track your contribution to a sustainable future</p>
          <p className="text-sm text-gray-500 font-mono mt-2">
            Wallet: {wallet.publicKey?.toBase58().slice(0, 8)}...{wallet.publicKey?.toBase58().slice(-8)}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Leaf className="w-8 h-8" />}
            title="Total CO₂ Offset"
            value={`${impactData.totalCO2Offset.toLocaleString()}`}
            subtitle="kg CO₂"
            gradient="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            icon={<Coins className="w-8 h-8" />}
            title="Impact Tokens"
            value={impactData.totalTokens.toLocaleString()}
            subtitle="ECO Tokens"
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<Trees className="w-8 h-8" />}
            title="Trees Planted"
            value={impactData.forestData.treesPlanted.toLocaleString()}
            subtitle="Across all projects"
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
          <StatCard
            icon={<Award className="w-8 h-8" />}
            title="Projects Supported"
            value={impactData.topProjects.length.toString()}
            subtitle="Active contributions"
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contribution Timeline Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Contribution Timeline
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={impactData.contributionTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip 
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: '#f9fafb', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="co2Offset" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="url(#co2Gradient)" 
                  name="CO₂ Offset (kg)"
                />
                <Area 
                  type="monotone" 
                  dataKey="tokensEarned" 
                  stackId="2"
                  stroke="#3b82f6" 
                  fill="url(#tokenGradient)" 
                  name="Tokens Earned"
                />
                <defs>
                  <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Forest Visualizer */}
          <ForestVisualizer forestData={impactData.forestData} />
        </div>

        {/* Top Projects */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600" />
            Top Projects Contributed To
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {impactData.topProjects.map((project, index) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{project.name}</h4>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mt-1">
                      {project.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{project.co2Impact} kg</div>
                    <div className="text-xs text-gray-500">CO₂ Impact</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Contribution: </span>
                    <span className="font-medium">${project.contribution.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tokens: </span>
                    <span className="font-medium text-blue-600">{project.tokensEarned}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MyImpact: NextPage = () => {
  return (
    <div>
      <Head>
        <title>My Environmental Impact - Solana Eco Platform</title>
        <meta
          name="description"
          content="Track your environmental impact and contributions to sustainability projects"
        />
      </Head>
      <MyImpactView />
    </div>
  );
};

export default MyImpact;