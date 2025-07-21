// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import { BalanceSkeleton } from '../../components/LoadingSkeleton';
import { InvestModal } from '../../components/InvestModal';
import AiAgentPopup from '../../components/AiAgentPopup';

import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

// Icons
import { 
  SparklesIcon, 
  CpuChipIcon, 
  MapIcon,
  UserGroupIcon,
  TrophyIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      setIsBalanceLoading(true);
      getUserSOLBalance(wallet.publicKey, connection).finally(() => {
        setIsBalanceLoading(false);
      });
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-blue-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">
      <div className="md:hero mx-auto p-4 py-8 md:py-16">
        <div className="md:hero-content flex flex-col max-w-6xl mx-auto animate-fade-in">
          
          {/* Header Section */}
          <div className='mt-6 text-center'>
            <div className='text-xs md:text-sm font-normal text-right text-gray-500 dark:text-slate-600 mb-2 md:mb-4'>
              v{pkg.version}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-emerald-600 mb-4 md:mb-6 animate-slide-up">
              GreenChain
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-6">
              AI-Powered On-Chain Reforestation Social Platform
            </p>
          </div>
          
          {/* Subtitle */}
          <div className="text-center mb-8 md:mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-xl md:text-2xl lg:text-4xl text-gray-700 dark:text-slate-300 my-2 px-4">
              <p className="mb-2">A fully on-chain social platform for reforestation investment tracking</p>
              <p className='text-gray-500 dark:text-slate-500 text-lg md:text-xl lg:text-2xl leading-relaxed'>
                Powered by AI, generating transparent carbon impact tokens on ICP
              </p>
            </h4>
          </div>
          
          {/* Action Section */}
          <div className="flex flex-col items-center space-y-6 md:space-y-8 w-full animate-slide-up" style={{ animationDelay: '0.3s' }}>
            
            {/* Airdrop Button */}
            <div className="w-full max-w-md">
              <RequestAirdrop />
            </div>
            
            {/* Balance Display */}
            <div className="text-center">
              <h4 className="text-lg md:text-2xl text-gray-700 dark:text-slate-300 my-2">
                {wallet.publicKey ? (
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-sm md:text-base text-gray-500 dark:text-gray-400">Your SOL Balance:</span>
                    <div className="flex items-center justify-center space-x-2">
                      {isBalanceLoading ? (
                        <BalanceSkeleton />
                      ) : (
                        <>
                          <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 transition-all duration-300 hover:scale-105">
                            {(balance || 0).toLocaleString()}
                          </div>
                          <div className='text-lg md:text-xl text-gray-600 dark:text-slate-600 font-medium'>
                            SOL
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
                    Connect your wallet to access the reforestation platform
                  </div>
                )}
              </h4>
            </div>
            
            {/* Platform Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsInvestModalOpen(true)}
                className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <BeakerIcon className="w-6 h-6" />
                Start Investing (£0.01 - £1M+)
              </button>
              <button
                onClick={() => setIsAiAgentOpen(true)}
                className="btn btn-secondary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <CpuChipIcon className="w-6 h-6" />
                AI Investment Assistant
              </button>
              <Link href="/" className="btn btn-outline btn-lg gap-2 border-2 hover:scale-105 transition-transform">
                <MapIcon className="w-6 h-6" />
                Explore Ecuador Projects
              </Link>
            </div>

            {/* Key Features Pills */}
            <div className="flex flex-wrap justify-center gap-3 text-sm mt-6">
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
            
            {/* Platform Features Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl mt-8 md:mt-12">
              
              {/* AI-Powered */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="text-green-600 dark:text-green-400 mb-3">
                  <CpuChipIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">AI-Powered Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Fine-tuned AI models predict forest health and CO₂ sequestration with 95%+ accuracy.</p>
              </div>
              
              {/* Social Platform */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <div className="text-blue-600 dark:text-blue-400 mb-3">
                  <UserGroupIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Social Impact Community</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Connect with climate advocates and share your environmental impact journey.</p>
              </div>
              
              {/* ICP Native */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <div className="text-purple-600 dark:text-purple-400 mb-3">
                  <TrophyIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Internet Computer Native</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Fully on-chain platform with transparent carbon credit tracking on ICP.</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      <InvestModal 
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
        projectName="Ecuador Reforestation Initiative"
      />

      {/* AI Agent Popup */}
      <AiAgentPopup
        isOpen={isAiAgentOpen}
        onClose={() => setIsAiAgentOpen(false)}
        userGoals={{
          offsetTarget: 2500,
          timeline: '12 months',
          preferredRegions: ['Ecuador', 'Brazil', 'Colombia'],
          investmentRange: { min: 100, max: 5000 }
        }}
        userProfile={{
          currentImpact: 850,
          monthlyBudget: 250,
          previousContributions: 8,
          portfolioValue: 2100
        }}
      />
    </div>
  );
};