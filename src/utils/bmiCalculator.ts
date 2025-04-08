
// BMI Categories
export enum BMICategory {
  UNDERWEIGHT = "Underweight",
  NORMAL = "Normal weight",
  OVERWEIGHT = "Overweight",
  OBESE = "Obese",
}

// Convert height from feet and inches to meters
export const convertHeightToMeters = (feet: number, inches: number): number => {
  const totalInches = feet * 12 + inches;
  const meters = totalInches * 0.0254;
  return meters;
};

// Convert height from centimeters to meters
export const convertCmToMeters = (cm: number): number => {
  return cm / 100;
};

// Convert weight from pounds to kilograms
export const convertLbsToKg = (lbs: number): number => {
  return lbs * 0.453592;
};

// Calculate BMI using the formula: weight (kg) / (height (m))^2
export const calculateBMI = (heightInMeters: number, weightInKg: number): number => {
  if (heightInMeters <= 0 || weightInKg <= 0) {
    return 0;
  }
  
  const bmi = weightInKg / (heightInMeters * heightInMeters);
  return parseFloat(bmi.toFixed(1));
};

// Calculate ideal weight in kg using the formula: (height in cm - 100)
export const calculateIdealWeight = (heightInCm: number): number => {
  return parseFloat((heightInCm - 100).toFixed(1));
};

// Determine BMI category based on calculated BMI
export const getBMICategory = (bmi: number): BMICategory => {
  if (bmi < 18.5) {
    return BMICategory.UNDERWEIGHT;
  } else if (bmi >= 18.5 && bmi < 25) {
    return BMICategory.NORMAL;
  } else if (bmi >= 25 && bmi < 30) {
    return BMICategory.OVERWEIGHT;
  } else {
    return BMICategory.OBESE;
  }
};

// Get a description of the BMI category
export const getBMICategoryDescription = (category: BMICategory, heightInCm: number): string => {
  switch (category) {
    case BMICategory.UNDERWEIGHT:
      return "You are underweight. Consider gaining some weight for better health.";
    case BMICategory.NORMAL:
      return "You have a healthy weight. Maintain your current lifestyle.";
    case BMICategory.OVERWEIGHT: {
      const idealWeight = calculateIdealWeight(heightInCm);
      return `You are overweight. Your ideal weight should be around ${idealWeight} kg. Consider losing some weight for better health.`;
    }
    case BMICategory.OBESE: {
      const idealWeight = calculateIdealWeight(heightInCm);
      return `You are obese. Your ideal weight should be around ${idealWeight} kg. Please consult with a healthcare professional.`;
    }
    default:
      return "";
  }
};
