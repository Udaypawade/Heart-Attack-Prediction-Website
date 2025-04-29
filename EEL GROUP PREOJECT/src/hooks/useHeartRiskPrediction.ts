import { useState, useCallback } from 'react';
import type { HeartData } from '../services/heartData';

interface RiskFactors {
  age: number;
  gender: string;
  cholesterol: number;
  systolic: number;
  diastolic: number;
  smokingStatus: string;
  alcoholConsumption: string;
  familyHistory: string;
  diabetes: string;
  bmi: number;
}

export function useHeartRiskPrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);

  const calculateRisk = useCallback((factors: RiskFactors) => {
    setLoading(true);
    setError(null);

    try {
      // Simple risk calculation based on weighted factors
      let score = 0;

      // Age factor (higher risk with age)
      score += (factors.age / 100) * 20;

      // Cholesterol factor
      if (factors.cholesterol > 200) {
        score += 15;
      }

      // Blood pressure factor
      if (factors.systolic > 140 || factors.diastolic > 90) {
        score += 15;
      }

      // Smoking factor
      if (factors.smokingStatus === 'current') {
        score += 20;
      } else if (factors.smokingStatus === 'former') {
        score += 10;
      }

      // Alcohol consumption factor
      if (factors.alcoholConsumption === 'heavy') {
        score += 15;
      } else if (factors.alcoholConsumption === 'moderate') {
        score += 8;
      }

      // Family history factor
      if (factors.familyHistory === 'yes') {
        score += 15;
      }

      // Diabetes factor
      if (factors.diabetes === 'yes') {
        score += 15;
      }

      // BMI factor
      if (factors.bmi > 30) {
        score += 10;
      } else if (factors.bmi > 25) {
        score += 5;
      }

      // Normalize score to 0-100 range
      const normalizedScore = Math.min(Math.max(score, 0), 100);
      
      setRiskScore(normalizedScore);
      setLoading(false);
    } catch (err) {
      setError('Error calculating risk score');
      setLoading(false);
    }
  }, []);

  return {
    calculateRisk,
    loading,
    error,
    riskScore
  };
}