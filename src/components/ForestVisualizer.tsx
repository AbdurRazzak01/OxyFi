import React, { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';

interface TreeStage {
  emoji: string;
  minBalance: number;
  description: string;
}

const TREE_STAGES: TreeStage[] = [
  { emoji: '🌱', minBalance: 0, description: 'Seed' },
  { emoji: '🌿', minBalance: 0.1, description: 'Sprout' },
  { emoji: '🌳', minBalance: 1, description: 'Young Tree' },
  { emoji: '🌲', minBalance: 5, description: 'Mature Tree' },
  { emoji: '🎄', minBalance: 10, description: 'Ancient Tree' },
];

const ForestVisualizer: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (publicKey) {
      getUserSOLBalance(publicKey, connection);
    }
  }, [publicKey, connection, getUserSOLBalance]);

  useEffect(() => {
    // Trigger animation when balance changes
    setAnimationClass('animate-pulse');
    const timer = setTimeout(() => setAnimationClass(''), 1000);
    return () => clearTimeout(timer);
  }, [balance]);

  const getCurrentTreeStage = (): TreeStage => {
    for (let i = TREE_STAGES.length - 1; i >= 0; i--) {
      if (balance >= TREE_STAGES[i].minBalance) {
        return TREE_STAGES[i];
      }
    }
    return TREE_STAGES[0];
  };

  const getForestSize = (): number => {
    if (balance >= 50) return 15;
    if (balance >= 25) return 10;
    if (balance >= 10) return 7;
    if (balance >= 5) return 5;
    if (balance >= 1) return 3;
    return 1;
  };

  const currentStage = getCurrentTreeStage();
  const forestSize = getForestSize();
  const nextStage = TREE_STAGES.find(stage => stage.minBalance > balance);
  const progress = nextStage ? 
    ((balance - currentStage.minBalance) / (nextStage.minBalance - currentStage.minBalance)) * 100 : 100;

  if (!connected) {
    return (
      <div className="bg-gradient-to-b from-sky-200 to-green-200 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">🌱</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600">Connect your wallet to start growing your forest!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-sky-200 via-sky-100 to-green-200 rounded-lg p-6 shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your SOL Forest</h2>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
          <span>Balance: {balance.toFixed(4)} SOL</span>
          <span>•</span>
          <span>{currentStage.description}</span>
        </div>
      </div>

      {/* Progress Bar */}
      {nextStage && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress to {nextStage.description}</span>
            <span>{Math.min(progress, 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            Need {(nextStage.minBalance - balance).toFixed(4)} more SOL to reach {nextStage.description}
          </div>
        </div>
      )}

      {/* Forest Display */}
      <div className="relative">
        {/* Sky background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100 rounded-lg"></div>
        
        {/* Ground */}
        <div className="relative bg-gradient-to-b from-green-300 to-green-400 rounded-b-lg min-h-[200px] p-4">
          
          {/* Trees Grid */}
          <div className="grid grid-cols-5 gap-2 items-end justify-items-center h-full">
            {Array.from({ length: forestSize }, (_, index) => {
              const treeVariation = (balance + index) % TREE_STAGES.length;
              const stageIndex = Math.min(
                Math.floor(balance / TREE_STAGES[Math.min(treeVariation, TREE_STAGES.length - 1)].minBalance),
                TREE_STAGES.length - 1
              );
              const treeStage = TREE_STAGES[Math.min(stageIndex, currentStage === TREE_STAGES[0] ? 0 : TREE_STAGES.indexOf(currentStage))];
              
              return (
                <div
                  key={index}
                  className={`text-4xl transform transition-all duration-500 hover:scale-110 ${animationClass}`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    filter: index === 0 ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'
                  }}
                >
                  {treeStage.emoji}
                </div>
              );
            })}
            
            {/* Empty slots for future trees */}
            {Array.from({ length: Math.max(0, 15 - forestSize) }, (_, index) => (
              <div key={`empty-${index}`} className="text-2xl text-gray-400 opacity-50">
                🌱
              </div>
            ))}
          </div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="absolute text-yellow-300 opacity-70 animate-bounce"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + (index % 3) * 20}%`,
                  animationDelay: `${index * 0.5}s`,
                  animationDuration: `${2 + index * 0.5}s`
                }}
              >
                ✨
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="mt-6 bg-white bg-opacity-80 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{forestSize}</div>
            <div className="text-sm text-gray-600">Trees</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{currentStage.emoji}</div>
            <div className="text-sm text-gray-600">Current Stage</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {balance >= 50 ? '🏆' : balance >= 10 ? '🥉' : balance >= 5 ? '🥈' : balance >= 1 ? '🥇' : '🌟'}
            </div>
            <div className="text-sm text-gray-600">Achievement</div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="mt-4 text-center">
        <details className="text-sm text-gray-600">
          <summary className="cursor-pointer hover:text-gray-800 font-medium">
            View Growth Milestones
          </summary>
          <div className="mt-3 space-y-2">
            {TREE_STAGES.map((stage, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-2 rounded ${
                  balance >= stage.minBalance 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stage.emoji}</span>
                  <span>{stage.description}</span>
                </div>
                <div className="text-xs">
                  {stage.minBalance} SOL
                  {balance >= stage.minBalance && <span className="ml-2">✅</span>}
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};

export default ForestVisualizer;