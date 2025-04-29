import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const About = () => {
  const emailContacts = [
    'udaykpawade4@gmail.com',
    'swayamprabhabadade6@gmail.com',
    'saipatil7180@gmail.com',
    'rathodshreya26@gmail.com'
  ];

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">About CardioCheck</h1>
          <p className="text-xl text-gray-300">
            Empowering individuals to take control of their heart health through advanced predictive analytics.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-md rounded-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-300 mb-6">
            CardioCheck was born from a simple yet powerful idea: make heart attack risk prediction accessible to everyone. 
            We combine cutting-edge technology with medical expertise to provide accurate, personalized risk assessments 
            and actionable health recommendations.
          </p>
          <p className="text-gray-300">
            Our team of healthcare professionals and data scientists work tirelessly to improve our prediction models, 
            ensuring you receive the most accurate and up-to-date risk assessments possible.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          <div className="bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-md rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Technology</h2>
            <p className="text-gray-300">
              Built using state-of-the-art machine learning algorithms and modern web technologies, 
              CardioCheck provides real-time risk analysis with exceptional accuracy.
            </p>
          </div>
          <div className="bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-md rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Privacy & Security</h2>
            <p className="text-gray-300">
              Your health data is precious. We employ industry-leading security measures to ensure 
              your information remains private and protected at all times.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
          <div className="space-y-4">
            {emailContacts.map((email, index) => (
              <motion.div
                key={email}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-center space-x-2"
              >
                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <a
                  href={`mailto:${email}`}
                  className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors hover:underline"
                >
                  {email}
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;