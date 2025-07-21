import type { NextPage } from "next";
import Head from "next/head";
import { GoalBuilder } from "../components/GoalBuilder";

const GoalBuilderPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>CO₂ Offset Goal Builder - Solana DApp</title>
        <meta
          name="description"
          content="Set up automated carbon offset contributions to combat climate change using blockchain technology"
        />
        <meta name="keywords" content="carbon offset, CO2, climate change, blockchain, Solana, sustainability" />
      </Head>
      
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
              CO₂ Offset Goal Builder
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Take action against climate change by setting up automated carbon offset contributions. 
              Choose between smart contract automation or local reminders to stay on track with your environmental goals.
            </p>
          </div>

          {/* Goal Builder Component */}
          <GoalBuilder />

          {/* Additional Information */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🌍
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Verified Offsets</h3>
              <p className="text-gray-300 text-sm">
                All carbon offsets are verified through international standards including Gold Standard and VCS (Verified Carbon Standard).
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Blockchain Powered</h3>
              <p className="text-gray-300 text-sm">
                Leverage Solana&apos;s fast, low-cost blockchain for transparent and automated carbon offset transactions.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                📊
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Track Impact</h3>
              <p className="text-gray-300 text-sm">
                Monitor your environmental impact in real-time with detailed analytics and progress tracking.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-green-100 text-lg mb-6">
                Join thousands of individuals taking concrete action against climate change. 
                Every contribution counts towards a sustainable future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                  Learn More About Carbon Offsets
                </button>
                <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors">
                  View Project Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalBuilderPage;