import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Calculator } from 'lucide-react';
import { useHeartRiskPrediction } from '../hooks/useHeartRiskPrediction';
import AnimatedRiskDisplay from '../components/AnimatedRiskDisplay';

const chestPainDescriptions = {
  typical: "Classic angina characterized by chest pressure or heaviness, typically triggered by physical activity or stress",
  atypical: "Chest pain that shares some characteristics with typical angina but may present differently",
  nonanginal: "Chest pain that is not related to heart problems, possibly caused by other factors like muscle strain or anxiety",
  asymptomatic: "No chest pain symptoms present"
};

const Prediction = () => {
  const { calculateRisk, loading, error, riskScore } = useHeartRiskPrediction();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showBmiCalculator, setShowBmiCalculator] = useState(false);
  const [showRiskDisplay, setShowRiskDisplay] = useState(false);
  const [showChestPainInfo, setShowChestPainInfo] = useState(false);
  const [selectedChestPain, setSelectedChestPain] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [bmiData, setBmiData] = useState({
    height: '',
    weight: '',
    bmi: null as number | null,
  });

  const validateInput = (name: string, value: string) => {
    const numValue = parseFloat(value);
    const errors: Record<string, string> = {};

    switch (name) {
      case 'cholesterol':
        if (numValue < 100) {
          errors[name] = 'Cholesterol must be at least 100 mg/dL';
        }
        break;
      case 'systolic':
      case 'diastolic':
        if (numValue < 50) {
          errors[name] = 'Blood pressure must be at least 50 mmHg';
        }
        break;
      case 'height':
        if (numValue < 50) {
          errors[name] = 'Height must be at least 50 cm';
        }
        break;
      case 'weight':
        if (numValue < 10) {
          errors[name] = 'Weight must be at least 10 kg';
        }
        break;
    }

    return errors;
  };

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const heightErrors = validateInput('height', bmiData.height);
    const weightErrors = validateInput('weight', bmiData.weight);
    
    if (Object.keys(heightErrors).length > 0 || Object.keys(weightErrors).length > 0) {
      setValidationErrors({ ...heightErrors, ...weightErrors });
      return;
    }
    
    const height = parseFloat(bmiData.height) / 100;
    const weight = parseFloat(bmiData.weight);
    
    if (height <= 0 || weight <= 0) {
      alert('Please enter valid height and weight values');
      return;
    }
    
    const bmi = weight / (height * height);
    setBmiData(prev => ({ ...prev, bmi: parseFloat(bmi.toFixed(1)) }));
    setValidationErrors({});
  };

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    routine: '',
    cholesterol: '',
    systolic: '',
    diastolic: '',
    smokingStatus: '',
    alcoholConsumption: '',
    familyHistory: '',
    diabetes: '',
    chestPainType: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = {
      ...validateInput('cholesterol', formData.cholesterol),
      ...validateInput('systolic', formData.systolic),
      ...validateInput('diastolic', formData.diastolic),
    };

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    if (!formData.age || !formData.cholesterol || !formData.systolic || !formData.diastolic || !bmiData.bmi) {
      alert('Please fill in all required fields');
      return;
    }

    calculateRisk({
      age: parseInt(formData.age),
      gender: formData.gender,
      cholesterol: parseInt(formData.cholesterol),
      systolic: parseInt(formData.systolic),
      diastolic: parseInt(formData.diastolic),
      smokingStatus: formData.smokingStatus,
      alcoholConsumption: formData.alcoholConsumption,
      familyHistory: formData.familyHistory,
      diabetes: formData.diabetes,
      bmi: bmiData.bmi,
    });
    setShowRiskDisplay(true);
    setValidationErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      const errors = validateInput(name, value);
      setValidationErrors(prev => ({ ...prev, ...errors }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'chestPainType') {
      setSelectedChestPain(value);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-md rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Heart Attack Risk Assessment</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {showRiskDisplay && riskScore !== null && (
            <AnimatedRiskDisplay
              riskScore={riskScore}
              onComplete={() => setShowRiskDisplay(false)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chest Pain Type
                <button
                  type="button"
                  onClick={() => setShowChestPainInfo(!showChestPainInfo)}
                  className="ml-2 text-red-400 hover:text-red-300 text-sm"
                >
                  <AlertCircle className="inline-block h-4 w-4 dark:text-gray-300" />
                </button>
              </label>
              <select
                name="chestPainType"
                value={formData.chestPainType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select chest pain type</option>
                <option value="typical">Typical Angina</option>
                <option value="atypical">Atypical Angina</option>
                <option value="nonanginal">Non-Anginal</option>
                <option value="asymptomatic">Asymptomatic</option>
              </select>
              {(showChestPainInfo || selectedChestPain) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-3 bg-gray-900/50 rounded-md"
                >
                  <p className="text-sm text-gray-300">
                    {selectedChestPain 
                      ? chestPainDescriptions[selectedChestPain as keyof typeof chestPainDescriptions]
                      : "Please select the chest pain type you've experienced. If you are unsure, we recommend consulting a medical professional."}
                  </p>
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Smoking Status
                </label>
                <select
                  name="smokingStatus"
                  value={formData.smokingStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select smoking status</option>
                  <option value="never">Never Smoked</option>
                  <option value="former">Former Smoker</option>
                  <option value="current">Current Smoker</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alcohol Consumption
                </label>
                <select
                  name="alcoholConsumption"
                  value={formData.alcoholConsumption}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select alcohol consumption</option>
                  <option value="none">None</option>
                  <option value="occasional">Occasional (1-2 drinks/week)</option>
                  <option value="moderate">Moderate (3-7 drinks/week)</option>
                  <option value="heavy">Heavy (&gt;7 drinks/week)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Family History of Heart Disease
                </label>
                <select
                  name="familyHistory"
                  value={formData.familyHistory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Diabetes
                </label>
                <select
                  name="diabetes"
                  value={formData.diabetes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Daily Routine
              </label>
              <select
                name="routine"
                value={formData.routine}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select routine type</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light Activity</option>
                <option value="moderate">Moderate Activity</option>
                <option value="active">Very Active</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cholesterol Level
              </label>
              <input
                type="number"
                name="cholesterol"
                value={formData.cholesterol}
                onChange={handleInputChange}
                min="100"
                className={`w-full px-3 py-2 border ${
                  validationErrors.cholesterol ? 'border-red-500' : 'border-gray-700'
                } rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="Enter cholesterol level (min 100 mg/dL)"
                onFocus={() => setShowDisclaimer(true)}
              />
              {validationErrors.cholesterol && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.cholesterol}</p>
              )}
              {showDisclaimer && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-3 bg-red-900/50 rounded-md flex items-start space-x-2"
                >
                  <AlertCircle className="h-5 w-4 text-red-500 flex-shrink-0 mt-0.5 dark:text-red-400" />
                  <p className="text-sm text-red-200">
                    Please refer to your certified doctor's report to enter your cholesterol level accurately.
                  </p>
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Blood Pressure (Systolic)
                </label>
                <input
                  type="number"
                  name="systolic"
                  value={formData.systolic}
                  onChange={handleInputChange}
                  min="50"
                  className={`w-full px-3 py-2 border ${
                    validationErrors.systolic ? 'border-red-500' : 'border-gray-700'
                  } rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="e.g., 120 (min 50 mmHg)"
                />
                {validationErrors.systolic && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.systolic}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Blood Pressure (Diastolic)
                </label>
                <input
                  type="number"
                  name="diastolic"
                  value={formData.diastolic}
                  onChange={handleInputChange}
                  min="50"
                  className={`w-full px-3 py-2 border ${
                    validationErrors.diastolic ? 'border-red-500' : 'border-gray-700'
                  } rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="e.g., 80 (min 50 mmHg)"
                />
                {validationErrors.diastolic && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.diastolic}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                BMI (Body Mass Index)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Your BMI will appear here"
                  value={bmiData.bmi || ''}
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setShowBmiCalculator(!showBmiCalculator)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-400 dark:text-red-400 dark:hover:text-red-300 flex items-center space-x-1"
                >
                  <Calculator size={16} className="dark:text-gray-300" />
                  <span>Calculate BMI</span>
                </button>
              </div>

              {showBmiCalculator && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-gray-900/50 rounded-lg"
                >
                  <h3 className="text-lg font-medium mb-4">BMI Calculator</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        value={bmiData.height}
                        onChange={(e) => setBmiData(prev => ({ ...prev, height: e.target.value }))}
                        min="50"
                        className={`w-full px-3 py-2 border ${
                          validationErrors.height ? 'border-red-500' : 'border-gray-700'
                        } rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500`}
                        placeholder="e.g., 170 (min 50 cm)"
                      />
                      {validationErrors.height && (
                        <p className="mt-1 text-sm text-red-500">{validationErrors.height}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={bmiData.weight}
                        onChange={(e) => setBmiData(prev => ({ ...prev, weight: e.target.value }))}
                        min="10"
                        className={`w-full px-3 py-2 border ${
                          validationErrors.weight ? 'border-red-500' : 'border-gray-700'
                        } rounded-md bg-gray-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500`}
                        placeholder="e.g., 70 (min 10 kg)"
                      />
                      {validationErrors.weight && (
                        <p className="mt-1 text-sm text-red-500">{validationErrors.weight}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={calculateBMI}
                      className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                      Calculate BMI
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="relative w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <motion.div
                initial={false}
                animate={loading ? { opacity: 1 } : { opacity: 0 }}
                className="absolute inset-0 bg-red-700/50"
                style={{
                  mixBlendMode: 'overlay',
                }}
              />
              {loading ? 'Calculating...' : 'Calculate Risk'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Prediction;