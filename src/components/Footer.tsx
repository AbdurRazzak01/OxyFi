import React from 'react';
import { 
  TwitterIcon, 
  GithubIcon, 
  DiscordIcon 
} from '@heroicons/react/outline';

const Footer: React.FC = () => {
  return (
    <footer className="bg-base-300 text-base-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">OxyFi</h3>
            <p className="text-base-content/70 mb-4 max-w-md">
              Transparent carbon offsetting with satellite verification and blockchain technology. 
              Making environmental impact measurable and trustworthy.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="btn btn-ghost btn-sm btn-circle">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" className="btn btn-ghost btn-sm btn-circle">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href="#" className="btn btn-ghost btn-sm btn-circle">
                <DiscordIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base-content mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="/projects" className="text-base-content/70 hover:text-primary">Projects</a></li>
              <li><a href="/timelapse-demo" className="text-base-content/70 hover:text-primary">Timelapse Demo</a></li>
              <li><a href="/greenchain-demo" className="text-base-content/70 hover:text-primary">GreenChain Demo</a></li>
              <li><a href="/basics" className="text-base-content/70 hover:text-primary">Getting Started</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-base-content mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-base-content/70 hover:text-primary">Documentation</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">API Reference</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">Support</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-base-content/20 mt-8 pt-8 text-center">
          <p className="text-base-content/60">
            © 2024 OxyFi. All rights reserved. Built on Solana with ❤️ for the planet.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
