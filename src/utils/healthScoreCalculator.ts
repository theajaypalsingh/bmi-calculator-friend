
export type HealthScoreInputs = {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive' | 'superActive';
  sleepHours: number;
  smokingHabit: 'nonSmoker' | 'occasionalSmoker' | 'regularSmoker';
  alcoholConsumption: 'never' | 'occasionally' | 'weekly' | 'frequently' | 'daily';
  stressLevel: 'low' | 'moderate' | 'high';
  eatingOutside: 'rarely' | 'onceWeek' | 'twoToFourWeek' | 'daily';
  waterIntake: number;
};

const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

const calculateBMIScore = (bmi: number): number => {
  if (bmi >= 18.5 && bmi <= 24.9) return 20;
  if ((bmi >= 25 && bmi <= 29.9) || (bmi >= 17 && bmi <= 18.4)) return 14;
  return 8;
};

const getActivityScore = (level: HealthScoreInputs['activityLevel']): number => {
  const scores = {
    sedentary: 2,
    lightlyActive: 7,
    moderatelyActive: 10,
    veryActive: 12,
    superActive: 15
  };
  return scores[level];
};

const getSleepScore = (hours: number): number => {
  if (hours >= 7 && hours <= 9) return 12;
  if (hours === 6 || hours === 10) return 7;
  return 4;
};

const getSmokingScore = (habit: HealthScoreInputs['smokingHabit']): number => {
  const scores = {
    nonSmoker: 10,
    occasionalSmoker: 5,
    regularSmoker: 2
  };
  return scores[habit];
};

const getAlcoholScore = (consumption: HealthScoreInputs['alcoholConsumption']): number => {
  const scores = {
    never: 10,
    occasionally: 8,
    weekly: 5,
    frequently: 3,
    daily: 0
  };
  return scores[consumption];
};

const getStressScore = (level: HealthScoreInputs['stressLevel']): number => {
  const scores = {
    low: 10,
    moderate: 6,
    high: 2
  };
  return scores[level];
};

const getEatingOutsideScore = (frequency: HealthScoreInputs['eatingOutside']): number => {
  const scores = {
    rarely: 13,
    onceWeek: 8,
    twoToFourWeek: 5,
    daily: 2
  };
  return scores[frequency];
};

const getWaterIntakeScore = (liters: number): number => {
  if (liters >= 2.5 && liters <= 3.5) return 5;
  if (liters >= 1.5 && liters < 2.5) return 3;
  return 1;
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
    age: getAgeScore(inputs.age)
  };

  return Object.values(scores).reduce((sum, score) => sum + score, 0);
};

