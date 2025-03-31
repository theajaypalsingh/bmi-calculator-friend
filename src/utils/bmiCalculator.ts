
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

// Calculate BMI using the formula: weight (kg) / (height (m))^2
export const calculateBMI = (heightInMeters: number, weightInKg: number): number => {
  if (heightInMeters <= 0 || weightInKg <= 0) {
    return 0;
  }
  
  const bmi = weightInKg / (heightInMeters * heightInMeters);
  return parseFloat(bmi.toFixed(1));
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
export const getBMICategoryDescription = (category: BMICategory): string => {
  switch (category) {
    case BMICategory.UNDERWEIGHT:
      return "You are underweight. Consider gaining some weight for better health.";
    case BMICategory.NORMAL:
      return "You have a healthy weight. Maintain your current lifestyle.";
    case BMICategory.OVERWEIGHT:
      return "You are overweight. Consider losing some weight for better health.";
    case BMICategory.OBESE:
      return "You are obese. Please consult with a healthcare professional.";
    default:
      return "";
  }
};
