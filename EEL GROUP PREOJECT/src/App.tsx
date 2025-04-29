import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Prediction from './pages/Prediction';
import About from './pages/About';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const { isDark } = useDarkMode();

  return (
    <Router>
      <div className={`min-h-screen ${isDark ? 'dark' : ''} bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white`}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <footer className="py-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2"
          >
            <Heart className="text-red-500" size={20} />
            <span>CardioCheck © {new Date().getFullYear()}</span>
          </motion.div>
        </footer>
      </div>
    </Router>
  );
}

export default App;