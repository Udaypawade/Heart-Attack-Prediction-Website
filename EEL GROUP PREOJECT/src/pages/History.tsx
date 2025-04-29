import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type PredictionRecord = Database['public']['Tables']['predictions']['Row'] & {
  risk_level: 'Low' | 'Moderate' | 'High';
};

const RiskIndicator = ({ score }: { score: number }) => {
  const color = score < 30 ? 'emerald' : score < 60 ? 'yellow' : 'red';
  
  return (
    <div className="relative w-20 h-20">
      <div className={`absolute inset-0 rounded-full bg-${color}-500/10`} />
      <svg className="w-20 h-20 transform rotate-[-90deg]">
        <circle
          cx="40"
          cy="40"
          r="36"
          strokeWidth="8"
          className="fill-none stroke-gray-700/25"
        />
        <motion.circle
          cx="40"
          cy="40"
          r="36"
          strokeWidth="8"
          className={`fill-none stroke-${color}-500`}
          strokeLinecap="round"
          strokeDasharray={`${Math.PI * 72}`}
          strokeDashoffset={`${Math.PI * 72 * (1 - score / 100)}`}
          initial={{ strokeDashoffset: Math.PI * 72 }}
          animate={{ strokeDashoffset: Math.PI * 72 * (1 - score / 100) }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-lg font-bold text-${color}-500`}
        >
          {Math.round(score)}%
        </motion.span>
      </div>
    </div>
  );
};

const History = () => {
  const [records, setRecords] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const { data, error } = await supabase
          .from('predictions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        const formattedData: PredictionRecord[] = (data || []).map(record => ({
          ...record,
          risk_level: record.risk_score < 30 
            ? 'Low' 
            : record.risk_score < 60 
            ? 'Moderate' 
            : 'High'
        }));

        setRecords(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load predictions');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <Activity className="text-red-500" />
            Prediction History
          </h1>
          <p className="text-gray-400 mt-2">Your past heart health assessments</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : records.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No predictions found. Start by making your first prediction!
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {records.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.645, 0.045, 0.355, 1.000]
                  }}
                  className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 flex items-center justify-between hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{record.name}</h3>
                    <div className="text-gray-400 space-y-1 mt-2">
                      <p>Age: {record.age}</p>
                      <p>Date: {new Date(record.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-medium
                        ${record.risk_level === 'Low' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : record.risk_level === 'Moderate'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'}
                      `}>
                        {record.risk_level} Risk
                      </span>
                    </div>
                    <RiskIndicator score={record.risk_score} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;