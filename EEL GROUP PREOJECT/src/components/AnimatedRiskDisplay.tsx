import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AnimatedRiskDisplayProps {
  riskScore: number;
  onComplete?: () => void;
}

const AnimatedRiskDisplay: React.FC<AnimatedRiskDisplayProps> = ({ riskScore, onComplete }) => {
  const [count, setCount] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / 1500; // 1.5 seconds duration

      if (progress < 1) {
        setCount(Math.min(Math.floor(progress * riskScore), riskScore));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(riskScore);
        setShowDisclaimer(true);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [riskScore]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 p-4 z-50"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-8 shadow-xl relative">
          <button
            onClick={() => onComplete?.()}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold text-center mb-4">Heart Attack Risk</h2>
          <div className="relative">
            <motion.div
              className="text-6xl font-bold text-center text-red-500"
              style={{
                textShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
              }}
            >
              {count}%
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: ['0 0 20px rgba(239, 68, 68, 0.2)', '0 0 40px rgba(239, 68, 68, 0.4)', '0 0 20px rgba(239, 68, 68, 0.2)'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <p className="text-gray-400 text-center mt-4">
            {count < 30 ? 'Low Risk' : count < 60 ? 'Moderate Risk' : 'High Risk'}
          </p>
          
          {showDisclaimer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-gray-700/50 rounded-lg text-sm text-gray-300 text-center"
            >
              Disclaimer: This prediction is for informational purposes only and should not be considered a medical diagnosis. Please consult a licensed healthcare professional for an accurate assessment.
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedRiskDisplay;