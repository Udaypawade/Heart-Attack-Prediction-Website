import Papa from 'papaparse';

export interface HeartData {
  age: number;
  gender: string;
  cholesterol: number;
  bloodPressure: number;
  heartRate: number;
  diabetes: number;
  familyHistory: number;
  smoking: number;
  obesity: number;
  alcoholConsumption: number;
  exerciseHours: number;
  diet: string;
  previousHeartProblems: number;
  medicationUse: number;
  stressLevel: number;
  sedentaryHours: number;
  income: number;
  bmi: number;
  triglycerides: number;
  physicalActivityDays: number;
  sleepHours: number;
  heartAttackRisk: number;
}

export async function loadHeartData(): Promise<HeartData[]> {
  try {
    const response = await fetch('https://raw.githubusercontent.com/iamsouravbanerjee/heart-attack-prediction-dataset/main/heart_attack_prediction_dataset.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          resolve(results.data as HeartData[]);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading heart data:', error);
    throw error;
  }
}