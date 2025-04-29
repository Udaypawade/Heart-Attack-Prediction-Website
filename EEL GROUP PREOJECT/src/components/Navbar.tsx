import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import DarkModeToggle from './DarkModeToggle';
import { useDarkMode } from '../hooks/useDarkMode';

const Navbar = () => {
  const location = useLocation();
  const { isDark, toggle } = useDarkMode();

  return (
    <nav className="bg-gray-900/50 dark:bg-gray-950/50 backdrop-blur-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="h-8 w-8 text-red-500" />
            </motion.div>
            <span className="text-xl font-bold">CardioCheck</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-4">
              {[
                { path: '/', label: 'Home' },
                { path: '/login', label: 'Login' },
                { path: '/about', label: 'About' },
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${location.pathname === path
                      ? 'bg-red-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                  {label}
                </Link>
              ))}
            </div>
            <DarkModeToggle isDark={isDark} toggle={toggle} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;