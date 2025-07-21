import { FC } from 'react';
import Link from "next/link";
import Text from './Text';
import NavElement from './nav-element';

interface Props {
  children: React.ReactNode;
}

export const ContentContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex-1 drawer min-h-0 flex-col justify-between bg-white dark:bg-gray-900 transition-colors duration-200">
      <input id="my-drawer" type="checkbox" className="grow drawer-toggle" />
      <div className="items-center drawer-content flex flex-col justify-between min-h-full">
        <div className="flex-1 w-full">
          {children}
        </div>
      </div>
      
      {/* SideBar / Drawer */}
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        <ul className="p-6 overflow-y-auto menu w-80 bg-white dark:bg-gray-900 min-h-full border-r border-gray-200 dark:border-gray-700 space-y-4 animate-slide-down">
          <li>
            <Text 
              variant="heading" 
              className='font-extrabold tracking-tighter text-center text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-600 mt-10 mb-6 text-2xl'
            >
              Menu
            </Text>
          </li>
          
          <li>
            <NavElement
              label="Home"
              href="/"
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-105"
            />
          </li>
          
          <li>
            <NavElement
              label="Basics"
              href="/basics"
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-105"
            />
          </li>
        </ul>
      </div>
    </div>
  );
};
