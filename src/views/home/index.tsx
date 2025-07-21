// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import { BalanceSkeleton } from '../../components/LoadingSkeleton';
=======
import ForestVisualizer from '../../components/ForestVisualizer';
import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="md:hero mx-auto p-4 py-8 md:py-16">
        <div className="md:hero-content flex flex-col max-w-6xl mx-auto animate-fade-in">
          
          {/* Header Section */}
          <div className='mt-6 text-center'>
            <div className='text-xs md:text-sm font-normal text-right text-gray-500 dark:text-slate-600 mb-2 md:mb-4'>
              v{pkg.version}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-600 mb-4 md:mb-6 animate-slide-up">
              Solana Next
            </h1>
          </div>
          
          {/* Subtitle */}
          <div className="text-center mb-8 md:mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-xl md:text-2xl lg:text-4xl text-gray-700 dark:text-slate-300 my-2 px-4">
              <p className="mb-2">Unleash the full power of blockchain with Solana and Next.js 13.</p>
              <p className='text-gray-500 dark:text-slate-500 text-lg md:text-xl lg:text-2xl leading-relaxed'>
                Full-stack Solana applications made easy.
              </p>
            </h4>
          </div>
          
          {/* Code snippet */}
          <div className="relative group mb-8 md:mb-12 w-full max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative max-w-full mx-auto mockup-code bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <pre data-prefix=">" className="text-gray-800 dark:text-gray-200">
                <code className="text-xs md:text-sm break-all">
                  npx create-solana-dapp &lt;dapp-name&gt;
                </code>
              </pre>
            </div>
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
                          <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 transition-all duration-300 hover:scale-105">
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
                    Connect your wallet to see your SOL balance
                  </div>
                )}
              </h4>
            </div>
            
            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl mt-8 md:mt-12">
              
              {/* Fast */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="text-purple-600 dark:text-purple-400 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Sub-second finality and low transaction costs make Solana ideal for high-frequency applications.</p>
              </div>
              
              {/* Scalable */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <div className="text-purple-600 dark:text-purple-400 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Highly Scalable</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Process thousands of transactions per second without compromising decentralization.</p>
              </div>
              
              {/* Developer Friendly */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <div className="text-purple-600 dark:text-purple-400 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Developer Friendly</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Rich ecosystem of tools, libraries, and frameworks to accelerate your development.</p>
              </div>
              
            </div>
          </div>
        </div>
        {/* Forest Visualizer */}
        <div className="w-full max-w-4xl mx-auto mt-8">
          <ForestVisualizer />
        </div>
      </div>
    </div>
  );
};
