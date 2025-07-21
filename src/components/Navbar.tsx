import { FC, useState } from 'react';
import Link from "next/link";
import dynamic from 'next/dynamic';
import { useAutoConnect } from '../contexts/AutoConnectProvider';
import NavElement from './nav-element';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const Navbar: FC = () => {
  const { autoConnect } = useAutoConnect();
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                OxyFi
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavElement
              label="Home"
              href="/"
              navigationStarts={() => setIsNavOpen(false)}
            />
            <NavElement
              label="Projects"
              href="/projects"
              navigationStarts={() => setIsNavOpen(false)}
            />
            <NavElement
              label="My Impact"
              href="/impact"
              navigationStarts={() => setIsNavOpen(false)}
            />
            <NavElement
              label="Contribute"
              href="/contribute"
              navigationStarts={() => setIsNavOpen(false)}
            />
          </div>

          {/* Connect Wallet Button & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Connect Wallet Button */}
            <WalletMultiButtonDynamic className="!bg-gradient-to-r !from-green-500 !to-blue-600 hover:!from-green-600 hover:!to-blue-700 !text-white !font-medium !px-4 !py-2 !rounded-lg !transition-all !duration-200 !text-sm" />
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              onClick={() => setIsNavOpen(!isNavOpen)}
              aria-expanded={isNavOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isNavOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isNavOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden ${isNavOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
          <Link
            href="/"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => setIsNavOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => setIsNavOpen(false)}
          >
            Projects
          </Link>
          <Link
            href="/impact"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => setIsNavOpen(false)}
          >
            My Impact
          </Link>
          <Link
            href="/contribute"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => setIsNavOpen(false)}
          >
            Contribute
          </Link>
        </div>
      </div>
    </nav>
  );
};