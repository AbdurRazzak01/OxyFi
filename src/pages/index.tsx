import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
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
  TrophyIcon
} from '@heroicons/react/24/outline';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Home: React.FC = () => {
  const { connected } = useWallet();
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

  return (
    <>
      <Head>
        <title>GreenChain - AI-Powered Reforestation Investment Platform</title>
        <meta name="description" content="Invest in verified reforestation projects with AI-powered forest health monitoring. From £0.01 to £1M+, earn carbon credits and build climate partnerships on Solana & ICP." />
        <meta name="keywords" content="reforestation, carbon credits, blockchain, AI forest monitoring, climate investment, Solana, ICP, sustainability" />
        <meta property="og:title" content="GreenChain - AI-Powered Reforestation Investment Platform" />
        <meta property="og:description" content="Join the future of climate action with transparent, AI-verified reforestation investments" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-emerald-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
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
                      AI-Powered Reforestation
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Invest in Our Planet&apos;s
                <br />
                <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
                  Social Future with AI
                </span>
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                The world&apos;s first fully on-chain social platform for reforestation investment. 
                AI-verified projects, transparent carbon credits, and real-time forest monitoring.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all">
                  <BeakerIcon className="w-6 h-6" />
                  Explore Projects
                </button>
                {!connected ? (
                  <WalletMultiButton className="btn btn-outline btn-lg border-2 hover:scale-105 transition-transform" />
                ) : (
                  <button className="btn btn-secondary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all">
                    <CurrencyDollarIcon className="w-6 h-6" />
                    Start Investing
                  </button>
                )}
              </div>

              {/* Key Features Pills */}
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-700 dark:text-gray-300 shadow-md">
                  🤖 AI-Verified Projects
                </span>
                <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-700 dark:text-gray-300 shadow-md">
                  🌍 Real-time Monitoring
                </span>
                <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-700 dark:text-gray-300 shadow-md">
                  💰 From £0.01 to £1M+
                </span>
                <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-700 dark:text-gray-300 shadow-md">
                  🏆 Carbon Credit Rewards
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-20 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Global Impact So Far
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Real numbers from our verified reforestation projects worldwide
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

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
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
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <CpuChipIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Advanced machine learning algorithms analyze satellite data, predict forest health, and calculate precise CO₂ sequestration rates in real-time.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• Satellite imagery analysis</li>
                  <li>• Predictive health modeling</li>
                  <li>• Automated verification</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
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

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Blockchain Transparency</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Immutable carbon credit tracking and transparent investment records on Solana and Internet Computer Protocol.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• Multi-chain support</li>
                  <li>• Immutable records</li>
                  <li>• Smart contract automation</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
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

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <CurrencyDollarIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Flexible Investment</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Invest any amount from £0.01 to £1M+ across multiple cryptocurrencies with automated goal setting and portfolio management.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• Micro to macro investments</li>
                  <li>• Multi-currency support</li>
                  <li>• Automated goals</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
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
                  <li>• Staking rewards</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Reforestation Projects
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Discover high-impact environmental projects verified by our AI monitoring system.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Project Card 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-600 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4 bg-white/90 rounded-lg px-3 py-1">
                    <span className="text-sm font-semibold text-green-600">AI Score: 94</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Amazon Rainforest Conservation</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Protecting 2,500 hectares of pristine rainforest in Brazil with indigenous communities</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">Trees Planted</div>
                      <div className="text-lg font-bold text-emerald-600">125,000</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">CO₂ Offset</div>
                      <div className="text-lg font-bold text-blue-600">850 tons/year</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">Funding Progress</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">$2.1M / $3M (70%)</div>
                    </div>
                    <button className="btn btn-primary btn-sm">Invest Now</button>
                  </div>
                </div>
              </div>

              {/* Project Card 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-600 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4 bg-white/90 rounded-lg px-3 py-1">
                    <span className="text-sm font-semibold text-blue-600">AI Score: 91</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mangrove Restoration</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Coastal ecosystem restoration in Southeast Asia protecting marine biodiversity</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">Trees Planted</div>
                      <div className="text-lg font-bold text-emerald-600">75,000</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">CO₂ Offset</div>
                      <div className="text-lg font-bold text-blue-600">620 tons/year</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">Funding Progress</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">$1.8M / $2.5M (72%)</div>
                    </div>
                    <button className="btn btn-primary btn-sm">Invest Now</button>
                  </div>
                </div>
              </div>

              {/* Project Card 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-600 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4 bg-white/90 rounded-lg px-3 py-1">
                    <span className="text-sm font-semibold text-purple-600">AI Score: 89</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">African Savanna Restoration</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Regenerating degraded savanna landscapes in Kenya with local communities</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">Trees Planted</div>
                      <div className="text-lg font-bold text-emerald-600">95,000</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">CO₂ Offset</div>
                      <div className="text-lg font-bold text-blue-600">720 tons/year</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">Funding Progress</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">$950K / $1.5M (63%)</div>
                    </div>
                    <button className="btn btn-primary btn-sm">Invest Now</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <button className="btn btn-outline btn-lg">
                View All Projects
              </button>
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
              Join thousands of climate advocates creating positive environmental change with AI-verified, 
              transparent reforestation investments. Start with as little as £0.01.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-secondary btn-lg shadow-lg hover:shadow-xl">
                Start Investing Now
              </button>
              <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-green-600">
                Learn More
              </button>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" />
                <span>AI-Verified Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5" />
                <span>Flexible Investment</span>
              </div>
              <div className="flex items-center gap-2">
                <TrophyIcon className="w-5 h-5" />
                <span>Carbon Credit Rewards</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
