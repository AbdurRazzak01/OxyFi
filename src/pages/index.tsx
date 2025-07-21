import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { 
  PlayIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  GlobeIcon,
  ShieldCheckIcon,
  SparklesIcon 
} from '@heroicons/react/outline';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Home: React.FC = () => {
  const { connected } = useWallet();
  const [impactStats, setImpactStats] = useState({
    totalCO2Offset: 0,
    treesPlanted: 0,
    projectsFunded: 0,
    totalInvestment: 0
  });

  // Animate numbers on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setImpactStats({
        totalCO2Offset: 125000,
        treesPlanted: 50000,
        projectsFunded: 25,
        totalInvestment: 2500000
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>OxyFi - Transparent Carbon Offsetting with Satellite Verification</title>
        <meta name="description" content="Invest in verified environmental projects monitored by AI and satellite imagery on Solana blockchain" />
        <meta name="keywords" content="carbon offset, blockchain, satellite monitoring, environmental investing, Solana" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-base-content mb-6">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  OxyFi
                </span>
              </h1>
              <h2 className="text-xl md:text-3xl font-semibold text-base-content/80 mb-8">
                Transparent Carbon Offsetting with
                <br />
                <span className="text-primary">Satellite Verification</span>
              </h2>
              <p className="text-lg md:text-xl text-base-content/70 mb-12 max-w-3xl mx-auto">
                Invest in verified environmental projects monitored by AI and satellite imagery. 
                Track real impact with blockchain transparency on Solana.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn btn-primary btn-lg gap-2">
                  <GlobeIcon className="w-6 h-6" />
                  Explore Projects
                </button>
                {!connected ? (
                  <WalletMultiButton className="btn btn-outline btn-lg" />
                ) : (
                  <button className="btn btn-secondary btn-lg gap-2">
                    <CurrencyDollarIcon className="w-6 h-6" />
                    Start Investing
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-16 bg-base-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-success mb-2">
                  {impactStats.totalCO2Offset.toLocaleString()}
                </div>
                <div className="text-base-content/70">Tons CO₂ Offset</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {impactStats.treesPlanted.toLocaleString()}
                </div>
                <div className="text-base-content/70">Trees Planted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">
                  {impactStats.projectsFunded}
                </div>
                <div className="text-base-content/70">Projects Funded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  ${impactStats.totalInvestment.toLocaleString()}
                </div>
                <div className="text-base-content/70">Total Investment</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-base-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
                Why Choose OxyFi?
              </h2>
              <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                Cutting-edge technology meets environmental impact for transparent, verifiable carbon offsetting.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <SparklesIcon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="card-title justify-center">AI-Powered Health Scoring</h3>
                  <p className="text-base-content/70">
                    Machine learning algorithms analyze satellite data to provide real-time project health scores.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center">
                  <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                    <GlobeIcon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="card-title justify-center">Satellite Monitoring</h3>
                  <p className="text-base-content/70">
                    Track project progress with real-time satellite imagery and timelapse visualizations.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center">
                  <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheckIcon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="card-title justify-center">Blockchain Transparency</h3>
                  <p className="text-base-content/70">
                    Immutable carbon credit tracking and transparent investment records on Solana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-20 bg-base-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-base-content/70">
                Discover high-impact environmental projects verified by our AI monitoring system.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Project Card 1 */}
              <div className="card bg-base-100 shadow-xl image-full">
                <figure>
                  <div className="w-full h-64 bg-gradient-to-br from-green-400 to-green-600"></div>
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-white">Amazon Rainforest Conservation</h3>
                  <p className="text-white/80">Protecting 1,000 hectares of rainforest</p>
                  <div className="card-actions justify-between items-center mt-4">
                    <div className="text-white">
                      <div className="text-sm opacity-70">Health Score</div>
                      <div className="text-xl font-bold text-success">92</div>
                    </div>
                    <button className="btn btn-primary btn-sm">View Details</button>
                  </div>
                </div>
              </div>

              {/* Project Card 2 */}
              <div className="card bg-base-100 shadow-xl image-full">
                <figure>
                  <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-white">Solar Farm Development</h3>
                  <p className="text-white/80">50MW clean energy generation</p>
                  <div className="card-actions justify-between items-center mt-4">
                    <div className="text-white">
                      <div className="text-sm opacity-70">Health Score</div>
                      <div className="text-xl font-bold text-warning">88</div>
                    </div>
                    <button className="btn btn-primary btn-sm">View Details</button>
                  </div>
                </div>
              </div>

              {/* Project Card 3 */}
              <div className="card bg-base-100 shadow-xl image-full">
                <figure>
                  <div className="w-full h-64 bg-gradient-to-br from-cyan-400 to-cyan-600"></div>
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-white">Ocean Restoration</h3>
                  <p className="text-white/80">Marine ecosystem recovery</p>
                  <div className="card-actions justify-between items-center mt-4">
                    <div className="text-white">
                      <div className="text-sm opacity-70">Health Score</div>
                      <div className="text-xl font-bold text-success">95</div>
                    </div>
                    <button className="btn btn-primary btn-sm">View Details</button>
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
        <section className="py-20 bg-gradient-to-r from-primary to-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of investors creating positive environmental change with verified, transparent carbon offsetting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-secondary btn-lg">
                Start Investing Now
              </button>
              <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
