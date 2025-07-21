import type { NextPage } from "next";
import Head from "next/head";
import GreenChainNavbar from "../components/GreenChainNavbar";

const GreenChainDemo: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>GreenChain - Sustainable Blockchain Solutions</title>
        <meta
          name="description"
          content="GreenChain - Leading the way in sustainable blockchain technology"
        />
      </Head>
      
      <GreenChainNavbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-400 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to GreenChain
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Building a sustainable future with blockchain technology
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Map Section */}
        <section id="map" className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Interactive Map</h2>
          <div className="bg-white rounded-lg shadow-lg p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Forest Coverage Map</h3>
              <p className="text-gray-600">Explore reforestation projects worldwide</p>
            </div>
          </div>
        </section>

        {/* Dashboard Section */}
        <section id="dashboard" className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Dashboard</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Carbon Credits", value: "1,250", icon: "🌱" },
              { title: "Trees Planted", value: "5,420", icon: "🌳" },
              { title: "CO₂ Offset", value: "890 kg", icon: "♻️" }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* My Forest Section */}
        <section id="forest" className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">My Forest</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Impact</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span>25 Oak trees planted in Amazon</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span>150 Pine trees in Pacific Northwest</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span>75 Bamboo plants in Southeast Asia</span>
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Next Milestone</h4>
                <p className="text-green-600">500 trees to unlock Carbon Certificate NFT</p>
                <div className="w-full bg-green-200 rounded-full h-2 mt-4">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
                <p className="text-sm text-green-600 mt-2">300/500 trees</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">About GreenChain</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-gray-600 mb-6">
                GreenChain is revolutionizing environmental conservation through blockchain technology. 
                Our platform enables transparent, verifiable, and impactful reforestation efforts worldwide.
              </p>
              <p className="text-gray-600 mb-8">
                By leveraging smart contracts and NFTs, we create a sustainable ecosystem where 
                environmental impact is measurable, tradeable, and permanently recorded on the blockchain.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-green-600">50K+</h3>
                  <p className="text-gray-600">Trees Planted</p>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-green-600">1M+</h3>
                  <p className="text-gray-600">Carbon Credits Issued</p>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-green-600">100+</h3>
                  <p className="text-gray-600">Partner Organizations</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll demo content */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Scroll to Test Sticky Navbar
          </h2>
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Section {item}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  This is additional content to demonstrate the sticky navbar behavior. 
                  As you scroll down the page, notice how the navbar remains fixed at the top, 
                  providing easy access to navigation links at all times. The clean, minimal 
                  design ensures that the navbar enhances rather than distracts from the user experience.
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold mb-4">GreenChain</h3>
          <p className="text-gray-400 mb-6">Building a sustainable future, one tree at a time.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GreenChainDemo;