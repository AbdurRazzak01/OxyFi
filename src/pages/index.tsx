import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import {
  GlobeEuropeAfricaIcon,
  EyeIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  BeakerIcon,
  CloudIcon,
  UserGroupIcon,
  CpuChipIcon,
  BanknotesIcon,
  TrophyIcon,
  MapIcon,
  HeartIcon,
  ShareIcon,
  ChatBubbleLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Dynamic import for map component to avoid SSR issues
const ProjectMap = dynamic(() => import('../components/ProjectMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
    <MapIcon className="w-12 h-12 text-gray-400" />
  </div>
});

const Home: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<'projects' | 'social' | 'map'>('projects');
  const [impactStats, setImpactStats] = useState({
    totalCO2Offset: 0,
    treesPlanted: 0,
    projectsFunded: 0,
    totalInvestment: 0,
    activeUsers: 0,
    carbonCreditsIssued: 0
  });

  // Animate numbers on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setImpactStats({
        totalCO2Offset: 2500000, // 2.5M kg CO2
        treesPlanted: 1250000, // 1.25M trees
        projectsFunded: 150,
        totalInvestment: 45000000, // $45M
        activeUsers: 25000,
        carbonCreditsIssued: 850000
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Ecuador reforestation projects data
  const ecuadorProjects = [
    {
      id: '1',
      name: 'Amazon Basin Restoration',
      location: 'Orellana Province, Ecuador',
      coordinates: { lat: -0.4686, lng: -76.9834 },
      imageUrl: 'https://images.unsplash.com/photo-1574263867128-4a4e9b5f1f6c?w=800&h=600&fit=crop',
      description: 'Restoring 15,000 hectares of degraded Amazon rainforest with indigenous communities',
      aiScore: 94,
      treesPlanted: 180000,
      co2Offset: 1250,
      fundingProgress: 0.72,
      fundingTarget: 3500000,
      fundingRaised: 2520000,
      status: 'active',
      verified: true,
      socialEngagement: {
        likes: 1245,
        shares: 89,
        comments: 156
      }
    },
    {
      id: '2',
      name: 'Cloud Forest Conservation',
      location: 'Pichincha Province, Ecuador',
      coordinates: { lat: -0.1807, lng: -78.4678 },
      imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
      description: 'Protecting and expanding cloud forest ecosystems in the Andes mountains',
      aiScore: 91,
      treesPlanted: 95000,
      co2Offset: 720,
      fundingProgress: 0.85,
      fundingTarget: 2200000,
      fundingRaised: 1870000,
      status: 'active',
      verified: true,
      socialEngagement: {
        likes: 892,
        shares: 67,
        comments: 134
      }
    },
    {
      id: '3',
      name: 'Coastal Mangrove Restoration',
      location: 'Esmeraldas Province, Ecuador',
      coordinates: { lat: 0.9592, lng: -79.6566 },
      imageUrl: 'https://images.unsplash.com/photo-1596075780750-81249df16d19?w=800&h=600&fit=crop',
      description: 'Restoring coastal mangrove ecosystems to protect against sea level rise',
      aiScore: 89,
      treesPlanted: 125000,
      co2Offset: 890,
      fundingProgress: 0.63,
      fundingTarget: 1800000,
      fundingRaised: 1134000,
      status: 'active',
      verified: true,
      socialEngagement: {
        likes: 567,
        shares: 45,
        comments: 89
      }
    },
    {
      id: '4',
      name: 'Dry Forest Regeneration',
      location: 'Loja Province, Ecuador',
      coordinates: { lat: -4.0079, lng: -79.2113 },
      imageUrl: 'https://images.unsplash.com/photo-1570967685117-e3f6b6eb3b1e?w=800&h=600&fit=crop',
      description: 'Regenerating dry tropical forests in southern Ecuador',
      aiScore: 87,
      treesPlanted: 67000,
      co2Offset: 485,
      fundingProgress: 0.45,
      fundingTarget: 1200000,
      fundingRaised: 540000,
      status: 'active',
      verified: true,
      socialEngagement: {
        likes: 423,
        shares: 32,
        comments: 67
      }
    }
  ];

  const socialPosts = [
    {
      id: '1',
      user: {
        name: 'Maria Santos',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
        verified: true
      },
      content: 'Just invested in the Amazon Basin Restoration project! 🌱 Excited to see my carbon impact tokens grow as the forest does. #GreenChain #ClimateAction',
      timestamp: '2 hours ago',
      engagement: { likes: 45, shares: 12, comments: 8 },
      project: 'Amazon Basin Restoration',
      investment: '0.5 SOL'
    },
    {
      id: '2',
      user: {
        name: 'EcoInvestor',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        verified: false
      },
      content: 'The AI analysis shows 94% forest health score for our latest investment. Real-time satellite data is incredible! 📡🌳',
      timestamp: '4 hours ago',
      engagement: { likes: 67, shares: 23, comments: 15 },
      project: 'Cloud Forest Conservation',
      investment: '1.2 SOL'
    },
    {
      id: '3',
      user: {
        name: 'Climate Foundation',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face',
        verified: true
      },
      content: 'Milestone achieved! 🎉 Our portfolio has now offset 500 tons of CO₂. Thank you to all our community members making this possible.',
      timestamp: '6 hours ago',
      engagement: { likes: 156, shares: 89, comments: 34 },
      project: 'Multiple Projects',
      investment: '50+ SOL'
    }
  ];

  return (
    <>
      <Head>
        <title>GreenChain - AI-Powered On-Chain Reforestation Social Platform</title>
        <meta name="description" content="A fully on-chain social platform for real-time tracking and investment in reforestation projects. Powered by AI, generating transparent carbon impact tokens on Internet Computer." />
        <meta name="keywords" content="reforestation, carbon credits, blockchain, AI forest monitoring, climate investment, ICP, Internet Computer, social platform, Ecuador" />
        <meta property="og:title" content="GreenChain - AI-Powered On-Chain Reforestation Social Platform" />
        <meta property="og:description" content="Join the future of climate action with AI-verified reforestation investments and social impact tracking" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-blue-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-emerald-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center">
              
              {/* Logo/Brand */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BeakerIcon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      GreenChain
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      On-Chain Reforestation Social Platform
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                AI-Powered Climate Action
                <br />
                <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
                  Social Investment Platform
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                A fully on-chain social platform on the Internet Computer for real-time tracking and investment in reforestation projects. 
                Powered by fine-tuned AI models, predicting forest health and CO₂ sequestration to generate transparent, traceable carbon impact tokens.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                {!connected ? (
                  <WalletMultiButton className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all" />
                ) : (
                  <button className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all">
                    <PlusIcon className="w-6 h-6" />
                    Start Investing (£0.01 - £1M+)
                  </button>
                )}
                <button className="btn btn-outline btn-lg gap-2 border-2 hover:scale-105 transition-transform">
                  <MapIcon className="w-6 h-6" />
                  Explore Ecuador Projects
                </button>
              </div>

              {/* Key Features Pills */}
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-700 dark:text-gray-300 shadow-md">
                  🤖 AI Forest Health Prediction
                </span>
                <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-700 dark:text-gray-300 shadow-md">
                  🌍 Real-time Satellite Monitoring
                </span>
                <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-700 dark:text-gray-300 shadow-md">
                  💰 Micro to Macro Investments
                </span>
                <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-700 dark:text-gray-300 shadow-md">
                  🏆 Transparent Carbon Credits
                </span>
                <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-700 dark:text-gray-300 shadow-md">
                  👥 Social Impact Community
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-16 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Global Impact Powered by AI
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Real numbers from our AI-verified reforestation projects worldwide
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CloudIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {(impactStats.totalCO2Offset / 1000).toFixed(1)}k
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tons CO₂ Offset</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BeakerIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  {(impactStats.treesPlanted / 1000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Trees Planted</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GlobeEuropeAfricaIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {impactStats.projectsFunded}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Projects</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BanknotesIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  ${(impactStats.totalInvestment / 1000000).toFixed(0)}M
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Investment</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {(impactStats.activeUsers / 1000).toFixed(0)}k
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrophyIcon className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                  {(impactStats.carbonCreditsIssued / 1000).toFixed(0)}k
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Carbon Credits</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-1 shadow-lg">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === 'projects'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-green-500'
                  }`}
                >
                  Ecuador Projects
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === 'map'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-green-500'
                  }`}
                >
                  Map View
                </button>
                <button
                  onClick={() => setActiveTab('social')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === 'social'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-green-500'
                  }`}
                >
                  Social Feed
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'projects' && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Ecuador Reforestation Projects
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    AI-verified forest restoration projects across Ecuador's diverse ecosystems
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {ecuadorProjects.map((project) => (
                    <div key={project.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="relative h-48">
                        <img
                          src={project.imageUrl}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-4 right-4 bg-white/90 rounded-lg px-3 py-1 flex items-center gap-2">
                          <CpuChipIcon className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-600">AI Score: {project.aiScore}</span>
                        </div>
                        {project.verified && (
                          <div className="absolute top-4 left-4 bg-blue-500 rounded-full p-1">
                            <ShieldCheckIcon className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-bold mb-1">{project.name}</h3>
                          <p className="text-sm opacity-90">{project.location}</p>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                          {project.description}
                        </p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-emerald-600">{(project.treesPlanted / 1000).toFixed(0)}k</div>
                            <div className="text-xs text-gray-500">Trees Planted</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{project.co2Offset} tons</div>
                            <div className="text-xs text-gray-500">CO₂ Offset/year</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{Math.round(project.fundingProgress * 100)}%</div>
                            <div className="text-xs text-gray-500">Funded</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Funding Progress</span>
                            <span className="font-medium">${(project.fundingRaised / 1000000).toFixed(1)}M / ${(project.fundingTarget / 1000000).toFixed(1)}M</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${project.fundingProgress * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <HeartIcon className="w-4 h-4" />
                              <span>{project.socialEngagement.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ShareIcon className="w-4 h-4" />
                              <span>{project.socialEngagement.shares}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ChatBubbleLeftIcon className="w-4 h-4" />
                              <span>{project.socialEngagement.comments}</span>
                            </div>
                          </div>
                          <button className="btn btn-primary btn-sm">
                            Invest Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Ecuador Projects Map
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Interactive map showing real-time project locations and AI health scores
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
                  <ProjectMap projects={ecuadorProjects} />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Climate Action Social Feed
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Connect with fellow climate advocates and share your impact journey
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  {socialPosts.map((post) => (
                    <div key={post.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-start space-x-4">
                        <img
                          src={post.user.avatar}
                          alt={post.user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{post.user.name}</h4>
                            {post.user.verified && (
                              <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
                            )}
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{post.timestamp}</span>
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            {post.content}
                          </p>

                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Project:</span> {post.project}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Investment:</span> {post.investment}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                              <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                                <HeartIcon className="w-5 h-5" />
                                <span className="text-sm">{post.engagement.likes}</span>
                              </button>
                              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                                <ShareIcon className="w-5 h-5" />
                                <span className="text-sm">{post.engagement.shares}</span>
                              </button>
                              <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
                                <ChatBubbleLeftIcon className="w-5 h-5" />
                                <span className="text-sm">{post.engagement.comments}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose GreenChain?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Advanced AI technology meets climate action for transparent, verifiable, and impactful reforestation investments.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <CpuChipIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Fine-tuned AI models analyze satellite data, predict forest health, and calculate precise CO₂ sequestration rates in real-time.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• Satellite imagery analysis</li>
                  <li>• Predictive health modeling</li>
                  <li>• Automated verification</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <EyeIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Real-time Monitoring</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Track project progress with live satellite feeds, drone surveillance, and IoT sensors providing continuous forest health updates.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• Live satellite feeds</li>
                  <li>• Drone monitoring</li>
                  <li>• IoT sensor networks</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Internet Computer Native</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Fully on-chain social platform with immutable carbon credit tracking and transparent investment records on ICP.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• Native ICP integration</li>
                  <li>• Immutable records</li>
                  <li>• Smart contract automation</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                  <UserGroupIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Social Impact Platform</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Connect with climate advocates, share achievements, participate in challenges, and build meaningful environmental partnerships.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• Social feed & profiles</li>
                  <li>• Community challenges</li>
                  <li>• Achievement system</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <CurrencyDollarIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Flexible Investment</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Invest any amount from £0.01 to £1M+ with automated goal setting, portfolio management, and AI agent assistance.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• Micro to macro investments</li>
                  <li>• AI-powered matching</li>
                  <li>• Automated reporting</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <TrophyIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Carbon Credit Marketplace</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Trade verified carbon credits, earn staking rewards, and participate in the growing carbon economy with full transparency.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• Verified carbon credits</li>
                  <li>• Trading marketplace</li>
                  <li>• ROI-driven returns</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-green-600 via-emerald-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join the future of climate action with AI-verified, transparent reforestation investments. 
              Build long-term climate partnerships and earn carbon credits while making a real difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-secondary btn-lg shadow-lg hover:shadow-xl">
                Start Your Climate Journey
              </button>
              <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-green-600">
                Explore AI Technology
              </button>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" />
                <span>AI-Verified Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5" />
                <span>£0.01 to £1M+ Range</span>
              </div>
              <div className="flex items-center gap-2">
                <TrophyIcon className="w-5 h-5" />
                <span>Carbon Credit Rewards</span>
              </div>
              <div className="flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5" />
                <span>Social Impact Community</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
