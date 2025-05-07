
export const activityMultipliers = {
  sedentary: 1.2,
  lightlyActive: 1.375,
  moderatelyActive: 1.55,
  veryActive: 1.725,
  superActive: 1.9
};

export const stepPercentages = {
  sedentary: 0.10,
  lightlyActive: 0.15,
  moderatelyActive: 0.20,
  veryActive: 0.25,
  superActive: 0.30
};

export const CALORIES_PER_STEP = 0.05;

export type StepFormData = {
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
};

export const calculateStepGoal = (data: StepFormData): number => {
  let bmr = 0;
  if (data.gender === 'male') {
    bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
  } else if (data.gender === 'female') {
    bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
  } else {
    const maleBmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
    const femaleBmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
    bmr = (maleBmr + femaleBmr) / 2;
  }
  
  const activityMultiplier = activityMultipliers[data.activityLevel as keyof typeof activityMultipliers];
  const tdee = bmr * activityMultiplier;
  const stepPercentage = stepPercentages[data.activityLevel as keyof typeof stepPercentages];
  const steps = tdee * stepPercentage / CALORIES_PER_STEP;
  
  return Math.round(steps / 100) * 100;
};

export const getActivityLabel = (key: string): string => {
  switch (key) {
    case 'sedentary':
      return 'Sedentary – Little or no exercise';
    case 'lightlyActive':
      return 'Lightly Active – Light exercise 1–3 days/week';
    case 'moderatelyActive':
      return 'Moderately Active – Moderate exercise 3–5 days/week';
    case 'veryActive':
      return 'Very Active – Hard exercise 6–7 days/week';
    case 'superActive':
      return 'Super Active – Intense training or physical job daily';
    default:
      return key;
  }
};
