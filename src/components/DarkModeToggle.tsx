import { FC, useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/outline';

export const DarkModeToggle: FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    const isDarkMode = initialTheme === 'dark';
    
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      aria-label="Toggle dark mode"
    >
      <div className="relative w-5 h-5">
        <SunIcon 
          className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 ease-in-out ${
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <MoonIcon 
          className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 ease-in-out ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
    </button>
  );
};

export default DarkModeToggle;