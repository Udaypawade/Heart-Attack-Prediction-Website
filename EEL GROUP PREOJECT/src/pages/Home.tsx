import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Activity, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source
            src="https://player.vimeo.com/external/292613080.hd.mp4?s=129e11fad3b8715eac9ad8061678b198e6ec5993&profile_id=175&oauth2_token_id=57447761"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Predict. Prevent. Protect.
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Take control of your heart health with CardioCheck's advanced risk prediction system.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Heart,
              title: "Heart Attack Risk Analysis",
              description: "Advanced algorithms analyze your health metrics to predict potential risks."
            },
            {
              icon: Activity,
              title: "Real-time Monitoring",
              description: "Track your heart health progress with our comprehensive dashboard."
            },
            {
              icon: AlertCircle,
              title: "Early Warning System",
              description: "Receive personalized alerts and recommendations based on your risk factors."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 backdrop-blur-md p-6 rounded-lg"
            >
              <feature.icon className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-32 mb-16 text-center"
        >
          <blockquote className="text-2xl italic text-gray-300">
            "The best way to predict your future is to create it."
          </blockquote>
          <p className="mt-4 text-gray-400">Take the first step towards a healthier heart today.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;