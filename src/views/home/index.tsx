// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import { GoalBuilder } from '../../components/GoalBuilder';
=======
import { InvestModal } from '../../components/InvestModal';
=======
import ForestVisualizer from '../../components/ForestVisualizer';

import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className='mt-6'>
        <div className='text-sm font-normal align-bottom text-right text-slate-600 mt-4'>v{pkg.version}</div>
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
          Solana Next
        </h1>
        </div>
        <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
          <p>Unleash the full power of blockchain with Solana and Next.js 13.</p>
          <p className='text-slate-500 text-2x1 leading-relaxed'>Full-stack Solana applications made easy.</p>
        </h4>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-indigo-500 rounded-lg blur opacity-40 animate-tilt"></div>
          <div className="max-w-md mx-auto mockup-code bg-primary border-2 border-[#5252529f] p-6 px-10 my-2">
            <pre data-prefix=">">
              <code className="truncate">{`npx create-solana-dapp <dapp-name>`} </code>
            </pre>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <RequestAirdrop />
          <h4 className="md:w-full text-2xl text-slate-300 my-2">
          {wallet &&
          <div className="flex flex-row justify-center">
            <div>
              {(balance || 0).toLocaleString()}
              </div>
              <div className='text-slate-600 ml-2'>
                SOL
              </div>
          </div>
          }
          </h4>
          
          {/* Investment Demo */}
          <div className="flex flex-col items-center mt-6">
            <button
              onClick={() => setIsInvestModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              🌱 Invest in Carbon Impact Projects
            </button>
            <p className="text-slate-400 text-sm mt-2 text-center max-w-sm">
              Invest SOL or USDC and receive OxyFi Carbon Impact Tokens representing your environmental contribution
            </p>
          </div>
        </div>
cursor/implement-co2-offset-goal-builder-97e6
        
        {/* Goal Builder Section */}
        <div className="mt-12 w-full">
          <div className="text-center mb-6">
            <Link href="/goal-builder" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all">
              <span>🌱</span>
              <span>Build Your CO₂ Offset Goal</span>
              <span>→</span>
            </Link>
          </div>
          <GoalBuilder />
=======
        
        {/* Investment Modal */}
        <InvestModal 
          isOpen={isInvestModalOpen}
          onClose={() => setIsInvestModalOpen(false)}
          projectName="OxyFi Carbon Offset Initiative"
        />
=======
        {/* Forest Visualizer */}
        <div className="w-full max-w-4xl mx-auto mt-8">
          <ForestVisualizer />
 main
        </div>
      </div>
    </div>
  );
};
