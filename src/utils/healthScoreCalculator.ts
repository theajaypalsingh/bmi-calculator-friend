
export type HealthScoreInputs = {
  age: number;
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive' | 'superActive';
  sleepHours: number;
  smokingHabit: 'nonSmoker' | 'occasionalSmoker' | 'regularSmoker';
  alcoholConsumption: 'never' | 'occasionally' | 'weekly' | 'frequently' | 'daily';
  stressLevel: 'low' | 'moderate' | 'high';
  eatingOutside: 'rarely' | 'onceWeek' | 'twoToFourWeek' | 'daily';
  waterIntake: number;
  symptoms: string[];
  medicalConditions: string[];
};

const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

const calculateBMIScore = (bmi: number): number => {
  if (bmi >= 18.5 && bmi <= 24.9) return 15;
  if ((bmi >= 17 && bmi < 18.5) || (bmi >= 25 && bmi <= 29.9)) return 12;
  if ((bmi < 17) || (bmi >= 30 && bmi <= 34.9)) return 8;
  return 4; // bmi >= 35
};

const getActivityScore = (level: HealthScoreInputs['activityLevel']): number => {
  const scores = {
    sedentary: 3,
    lightlyActive: 6,
    moderatelyActive: 8,
    veryActive: 10,
    superActive: 12
  };
  return scores[level];
};

const getSleepScore = (hours: number): number => {
  if (hours >= 7 && hours <= 8) return 10;
  if (hours >= 6 && hours < 7) return 8;
  if (hours >= 5 && hours < 6) return 6;
  return 3; // < 5 hours or > 9 hours
};

const getSmokingScore = (habit: HealthScoreInputs['smokingHabit']): number => {
  const scores = {
    nonSmoker: 8,
    occasionalSmoker: 4,
    regularSmoker: 2
  };
  return scores[habit];
};

const getAlcoholScore = (consumption: HealthScoreInputs['alcoholConsumption']): number => {
  const scores = {
    never: 8,
    occasionally: 6,
    weekly: 4,
    frequently: 4,
    daily: 2
  };
  return scores[consumption];
};

const getStressScore = (level: HealthScoreInputs['stressLevel']): number => {
  const scores = {
    low: 8,
    moderate: 5,
    high: 2
  };
  return scores[level];
};

const getEatingOutsideScore = (frequency: HealthScoreInputs['eatingOutside']): number => {
  const scores = {
    rarely: 10,
    onceWeek: 8,
    twoToFourWeek: 5,
    daily: 2
  };
  return scores[frequency];
};

const getWaterIntakeScore = (glasses: number): number => {
  if (glasses >= 8) return 6;
  if (glasses >= 6 && glasses <= 7) return 5;
  if (glasses >= 4 && glasses <= 5) return 3;
  return 1; // < 4 glasses
};

const getSymptomsScore = (symptoms: string[]): number => {
  // If "None" is selected or array is empty
  if (symptoms.includes('none') || symptoms.length === 0) return 8;
  
  // Count actual symptoms (excluding "none")
  const actualSymptoms = symptoms.filter(symptom => symptom !== 'none');
  
  if (actualSymptoms.length === 1) return 6;
  if (actualSymptoms.length === 2) return 4;
  return 2; // 3+ symptoms
};

const getMedicalConditionsScore = (conditions: string[]): number => {
  // If "None" is selected or array is empty
  if (conditions.includes('none') || conditions.length === 0) return 15;
  
  // Count actual conditions (excluding "none")
  const actualConditions = conditions.filter(condition => condition !== 'none');
  
  if (actualConditions.length === 1) return 10;
  if (actualConditions.length === 2) return 7;
  return 3; // 3+ conditions
};

const getAgeScore = (age: number): number => {
  return age < 45 ? 5 : 3;
};

export const calculateHealthScore = (inputs: HealthScoreInputs): number => {
  const bmi = calculateBMI(inputs.weight, inputs.height);
  
  const scores = {
    bmi: calculateBMIScore(bmi),
    activity: getActivityScore(inputs.activityLevel),
    sleep: getSleepScore(inputs.sleepHours),
    smoking: getSmokingScore(inputs.smokingHabit),
    alcohol: getAlcoholScore(inputs.alcoholConsumption),
    stress: getStressScore(inputs.stressLevel),
    eatingOut: getEatingOutsideScore(inputs.eatingOutside),
    water: getWaterIntakeScore(inputs.waterIntake),
    age: getAgeScore(inputs.age),
    symptoms: getSymptomsScore(inputs.symptoms),
    medicalConditions: getMedicalConditionsScore(inputs.medicalConditions)
  };

  return Object.values(scores).reduce((sum, score) => sum + score, 0);
};

export { calculateBMI };
