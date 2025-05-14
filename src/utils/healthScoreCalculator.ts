
// Health Score Types
export type HealthScoreInputs = {
  age: number;
  bmi: number;
  activityLevel: 'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive' | 'superActive';
  sleepHours: number;
  smokingHabit: 'never' | 'rarely' | 'occasionally' | 'regularly';
  alcoholConsumption: 'never' | 'rarely' | 'occasionally' | 'regularly';
  stressLevel: 'low' | 'medium' | 'high';
  eatingOutside: 'never' | 'oneToTwo' | 'threeToFive' | 'daily';
  waterIntake: 'lessThan4' | 'fourToFive' | 'sixToSeven' | 'eightPlus';
  symptoms: string[];
  medicalConditions: string[];
};

// 1. BMI Score Calculation (15 Points)
export const calculateBMIScore = (bmi: number): number => {
  if (bmi >= 18.5 && bmi <= 24.9) return 15;
  if ((bmi >= 17 && bmi < 18.5) || (bmi >= 25 && bmi <= 29.9)) return 12;
  if ((bmi < 17) || (bmi >= 30 && bmi <= 34.9)) return 8;
  return 4; // bmi >= 35
};

// 2. Physical Activity Level Score (12 Points)
export const getActivityScore = (level: HealthScoreInputs['activityLevel']): number => {
  const scores = {
    sedentary: 3,
    lightlyActive: 6,
    moderatelyActive: 8,
    veryActive: 10,
    superActive: 12
  };
  return scores[level];
};

// 3. Sleep Hours Score (10 Points)
export const getSleepScore = (hours: number): number => {
  if (hours >= 7 && hours <= 8) return 10;
  if (hours >= 6 && hours < 7) return 8;
  if (hours >= 5 && hours < 6) return 6;
  return 3; // < 5 hours or > 9 hours
};

// 4. Smoking Habit Score (8 Points)
export const getSmokingScore = (habit: HealthScoreInputs['smokingHabit']): number => {
  const scores = {
    never: 8,
    rarely: 6,
    occasionally: 4,
    regularly: 2
  };
  return scores[habit];
};

// 5. Alcohol Consumption Score (8 Points)
export const getAlcoholScore = (consumption: HealthScoreInputs['alcoholConsumption']): number => {
  const scores = {
    never: 8,
    rarely: 6,
    occasionally: 4,
    regularly: 2
  };
  return scores[consumption];
};

// 6. Stress Level Score (8 Points)
export const getStressScore = (level: HealthScoreInputs['stressLevel']): number => {
  const scores = {
    low: 8,
    medium: 5,
    high: 2
  };
  return scores[level];
};

// 7. Eating Outside Frequency Score (10 Points)
export const getEatingOutsideScore = (frequency: HealthScoreInputs['eatingOutside']): number => {
  const scores = {
    never: 10,
    oneToTwo: 8,
    threeToFive: 5,
    daily: 2
  };
  return scores[frequency];
};

// 8. Water Intake Score (6 Points)
export const getWaterIntakeScore = (intake: HealthScoreInputs['waterIntake']): number => {
  const scores = {
    eightPlus: 6,
    sixToSeven: 5,
    fourToFive: 3,
    lessThan4: 1
  };
  return scores[intake];
};

// 9. Symptoms Score (8 Points)
export const getSymptomsScore = (symptoms: string[]): number => {
  // If "None" is selected or array is empty
  if (symptoms.includes('none') || symptoms.length === 0) return 8;
  
  // Count actual symptoms (excluding "none")
  const actualSymptoms = symptoms.filter(symptom => symptom !== 'none');
  
  if (actualSymptoms.length === 1) return 6;
  if (actualSymptoms.length === 2) return 4;
  return 2; // 3+ symptoms
};

// 10. Medical Conditions Score (15 Points)
export const getMedicalConditionsScore = (conditions: string[]): number => {
  // If "None" is selected or array is empty
  if (conditions.includes('none') || conditions.length === 0) return 15;
  
  // Count actual conditions (excluding "none")
  const actualConditions = conditions.filter(condition => condition !== 'none');
  
  if (actualConditions.length === 1) return 10;
  if (actualConditions.length === 2) return 7;
  return 3; // 3+ conditions
};

// Calculate total health score
export const calculateHealthScore = (inputs: HealthScoreInputs): number => {
  const scores = {
    bmi: calculateBMIScore(inputs.bmi),
    activity: getActivityScore(inputs.activityLevel),
    sleep: getSleepScore(inputs.sleepHours),
    smoking: getSmokingScore(inputs.smokingHabit),
    alcohol: getAlcoholScore(inputs.alcoholConsumption),
    stress: getStressScore(inputs.stressLevel),
    eatingOutside: getEatingOutsideScore(inputs.eatingOutside),
    water: getWaterIntakeScore(inputs.waterIntake),
    symptoms: getSymptomsScore(inputs.symptoms),
    medicalConditions: getMedicalConditionsScore(inputs.medicalConditions)
  };

  // Sum all scores
  return Object.values(scores).reduce((sum, score) => sum + score, 0);
};

// Get score category based on the total score
export const getScoreCategory = (score: number): string => {
  if (score >= 86) return "Excellent";
  else if (score >= 71) return "Good";
  else if (score >= 51) return "Fair";
  else return "Needs Improvement";
};

