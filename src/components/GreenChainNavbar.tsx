import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserStore, mockUser } from '../stores/useUserStore';
import { useTheme } from 'next-themes';
import { 
  BeakerIcon, 
  MagnifyingGlassIcon, 
  BellIcon, 
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  SparklesIcon,
  MapIcon,
  UserGroupIcon,
  TrophyIcon,
  FlagIcon,
  DocumentTextIcon,
  UserIcon,
  WalletIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import clsx from 'clsx';

const GreenChainNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const { connected, publicKey } = useWallet();
  
  const {
    user,
    isAuthenticated,
    notifications,
    unreadNotifications,
    messages,
    unreadMessages,
    showAiAgent,
    setUser,
    toggleAiAgent,
    markAllNotificationsRead,
    markAllMessagesRead
  } = useUserStore();

  // Initialize mock user for demo
  useEffect(() => {
    if (!user && connected) {
      setUser(mockUser);
    }
  }, [connected, user, setUser]);

  const navigationLinks = [
    { name: 'Projects', href: '/projects', icon: DocumentTextIcon },
    { name: 'Map', href: '/map', icon: MapIcon },
    { name: 'Social', href: '/social', icon: UserGroupIcon },
    { name: 'Leaderboard', href: '/leaderboard', icon: TrophyIcon },
    { name: 'Challenges', href: '/challenges', icon: FlagIcon },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const formatCarbonOffset = (offset: number) => {
    return offset.toLocaleString('en-US', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <BeakerIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent tracking-tight">
                    GreenChain
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                    AI-Powered Reforestation Platform
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-1">
                {navigationLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg group"
                    >
                      <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className={clsx(
                  "relative transition-all duration-300",
                  isSearchFocused ? "transform scale-105" : ""
                )}>
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects, users, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* AI Agent Button */}
              <button
                onClick={toggleAiAgent}
                className={clsx(
                  "relative p-2 rounded-lg transition-all duration-300 group",
                  showAiAgent 
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
                )}
              >
                <SparklesIcon className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-purple-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                ) : (
                  <MoonIcon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-200" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
                >
                  <BellIcon className="w-5 h-5 group-hover:animate-pulse" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>
              </div>

              {/* Messages */}
              <div className="relative">
                <button
                  onClick={() => setShowMessages(!showMessages)}
                  className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </span>
                  )}
                </button>
              </div>

              {/* User Profile or Wallet Connection */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:border-green-400 transition-colors duration-200"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                        {user.level}
                      </div>
                      {user.verified && (
                        <CheckBadgeIcon className="absolute -top-1 -right-1 w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.username}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">{formatCarbonOffset(user.carbonOffset)} kg CO₂</p>
                    </div>
                  </button>

                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{user.username}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Level {user.level}</p>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <p className="font-medium text-green-600 dark:text-green-400">{formatCarbonOffset(user.carbonOffset)} kg</p>
                            <p className="text-gray-600 dark:text-gray-400">CO₂ Offset</p>
                          </div>
                          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <p className="font-medium text-blue-600 dark:text-blue-400">{user.treesPlanted.toLocaleString()}</p>
                            <p className="text-gray-600 dark:text-gray-400">Trees Planted</p>
                          </div>
                        </div>
                      </div>
                      
                      <Link href="/profile" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <UserIcon className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      
                      <Link href="/investments" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <WalletIcon className="w-4 h-4" />
                        <span>My Investments</span>
                      </Link>
                      
                      <Link href="/settings" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Cog6ToothIcon className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      
                      <button 
                        onClick={() => setUser(null)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:block">
                  <WalletMultiButton className="!bg-gradient-to-r !from-green-600 !to-emerald-600 hover:!from-green-700 hover:!to-emerald-700 !text-white !px-6 !py-2 !rounded-lg !text-sm !font-medium !transition-all !duration-200 !transform hover:!scale-105 !shadow-md hover:!shadow-lg !border-0" />
                </div>
              )}

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 focus:outline-none focus:text-green-600 dark:focus:text-green-400"
                >
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                {/* Mobile Search */}
                <div className="px-3 py-2">
                  <form onSubmit={handleSearch} className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </form>
                </div>

                {/* Mobile Navigation Links */}
                {navigationLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 block px-3 py-2 text-base font-medium hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
                
                {/* Mobile Wallet Connection */}
                {!isAuthenticated && (
                  <div className="pt-4 px-3">
                    <WalletMultiButton className="!w-full !bg-gradient-to-r !from-green-600 !to-emerald-600 hover:!from-green-700 hover:!to-emerald-700 !text-white !px-6 !py-2 !rounded-lg !text-sm !font-medium !transition-all !duration-200 !shadow-md !border-0" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Click outside handlers */}
      {(showUserDropdown || showNotifications || showMessages) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserDropdown(false);
            setShowNotifications(false);
            setShowMessages(false);
          }}
        />
      )}
    </>
  );
};

export default GreenChainNavbar;