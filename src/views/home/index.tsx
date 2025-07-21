// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import ProjectCard from '../../components/ProjectCard';
import ProjectModal from '../../components/ProjectModal';
=======
import ForestVisualizer from '../../components/ForestVisualizer';
import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

// Types
import { ForestAnalysisResult } from '../../utils/ml';

// Sample forest projects for demonstration
const SAMPLE_PROJECTS = [
  {
    id: '1',
    name: 'Amazon Rainforest Conservation',
    location: 'Amazonas, Brazil',
    imageUrl: 'https://images.unsplash.com/photo-1570967685117-e3f6b6eb3b1e?w=800&h=600&fit=crop',
    coordinates: { lat: -3.4653, lng: -62.2159 },
    description: 'A critical conservation area in the Amazon rainforest, focusing on protecting biodiversity and carbon sequestration through sustainable forest management practices.'
  },
  {
    id: '2',
    name: 'Pacific Northwest Reforestation',
    location: 'Oregon, USA',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    coordinates: { lat: 45.3311, lng: -121.7113 },
    description: 'Large-scale reforestation project restoring native coniferous forests after logging, with focus on climate resilience and habitat restoration.'
  },
  {
    id: '3',
    name: 'Boreal Forest Research Site',
    location: 'Manitoba, Canada',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
    coordinates: { lat: 55.2094, lng: -97.8167 },
    description: 'Research and monitoring site in the Canadian boreal forest, studying carbon dynamics and forest health indicators for climate change mitigation.'
  },
  {
    id: '4',
    name: 'Tropical Forest Restoration',
    location: 'Costa Rica',
    imageUrl: 'https://images.unsplash.com/photo-1596075780750-81249df16d19?w=800&h=600&fit=crop',
    coordinates: { lat: 10.2735, lng: -84.0408 },
    description: 'Community-led tropical forest restoration project connecting fragmented habitats and enhancing biodiversity corridors.'
  }
];

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ForestAnalysisResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  const handleViewDetails = (project: any, analysis: ForestAnalysisResult | null) => {
    setSelectedProject(project);
    setSelectedAnalysis(analysis);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setSelectedAnalysis(null);
  };

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className='mt-6'>
          <div className='text-sm font-normal align-bottom text-right text-slate-600 mt-4'>v{pkg.version}</div>
          <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
            Forest ML Analytics
          </h1>
        </div>
        <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
          <p>Real-time forest health monitoring with satellite imagery and machine learning.</p>
          <p className='text-slate-500 text-2x1 leading-relaxed'>Track CO₂ offsets and forest health in real time.</p>
        </h4>

        {/* Wallet Connection Section */}
        <div className="relative group mb-8">
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
        </div>

        {/* Forest Projects Section */}
        <div className="w-full max-w-7xl mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Forest Conservation Projects</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Monitor forest health and CO₂ offset estimates in real-time using satellite imagery and machine learning. 
              Each project card shows live analysis data that updates automatically.
            </p>
          </div>

          {/* Real-time Analysis Notice */}
          <div className="mb-8 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-blue-300 font-medium">Live ML Analysis Active</span>
              <span className="text-gray-400 text-sm">• Updates every 30 seconds</span>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {SAMPLE_PROJECTS.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-12 p-6 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.002 4.002 0 003 15z" />
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-2">Satellite Imagery</h4>
                <p className="text-gray-400 text-sm">Real-time satellite images are captured and processed from forest areas</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-2">ML Analysis</h4>
                <p className="text-gray-400 text-sm">Machine learning models analyze vegetation health and calculate CO₂ estimates</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-2">Real-time Updates</h4>
                <p className="text-gray-400 text-sm">Forest health scores and CO₂ offset data update automatically in real-time</p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Technical Implementation</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">ML Backend:</span>
                <span className="text-white">utils/ml.ts - Forest analysis functions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Components:</span>
                <span className="text-white">ProjectCard.tsx, ProjectModal.tsx</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Update Frequency:</span>
                <span className="text-white">30s (cards), 15s (modal)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fallback Mode:</span>
                <span className="text-white">Simulated data for development</span>
              </div>
            </div>
          </div>
=======
        {/* Forest Visualizer */}
        <div className="w-full max-w-4xl mx-auto mt-8">

        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        project={selectedProject}
        initialAnalysis={selectedAnalysis}
      />
    </div>
  );
};
