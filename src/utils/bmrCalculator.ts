
// BMR calculation utilities

// Activity level multipliers
const activityLevelMap = {
  "No exercise at all": 1.2,
  "Once a week": 1.3,
  "1-3 times a week": 1.375,
  "4-5 times a week": 1.55,
  "6-7 times a week": 1.725,
  "More than 7 times a week": 1.9
};

/**
 * Calculate body fat percentage for males using the U.S. Navy method
 */
const calculateBodyFatMale = (height: number, waist: number, neck: number): number => {
  return 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
};

/**
 * Calculate body fat percentage for females using the U.S. Navy method
 */
const calculateBodyFatFemale = (height: number, waist: number, neck: number, hip: number): number => {
  return 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
};

/**
 * Calculate BMR for males using Katch-McArdle formula with Navy body fat
 */
const calculateBMRMale = (height: number, waist: number, neck: number, weight: number): number => {
  const bodyFatPercent = calculateBodyFatMale(height, waist, neck);
  const leanBodyMass = weight * (1 - bodyFatPercent / 100);
  return 370 + (21.6 * leanBodyMass);
};

/**
 * Calculate BMR for females using Katch-McArdle formula with Navy body fat
 */
const calculateBMRFemale = (height: number, waist: number, neck: number, hip: number, weight: number): number => {
  const bodyFatPercent = calculateBodyFatFemale(height, waist, neck, hip);
  const leanBodyMass = weight * (1 - bodyFatPercent / 100);
  return 370 + (21.6 * leanBodyMass);
};

/**
 * Calculate TDEE for males based on BMR and activity level
 */
const calculateTDEEMale = (height: number, waist: number, neck: number, weight: number, activityMultiplier: number): number => {
  const bmr = calculateBMRMale(height, waist, neck, weight);
  return bmr * activityMultiplier;
};

/**
 * Calculate TDEE for females based on BMR and activity level
 */
const calculateTDEEFemale = (height: number, waist: number, neck: number, hip: number, weight: number, activityMultiplier: number): number => {
  const bmr = calculateBMRFemale(height, waist, neck, hip, weight);
  return bmr * activityMultiplier;
};

export const bmrCalculator = {
  calculateBodyFatMale,
  calculateBodyFatFemale,
  calculateBMRMale,
  calculateBMRFemale,
  calculateTDEEMale,
  calculateTDEEFemale,
  activityLevelMap
};
