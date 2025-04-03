import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  convertHeightToMeters, 
  convertCmToMeters,
  convertLbsToKg,
  calculateBMI, 
  getBMICategory, 
  getBMICategoryDescription 
} from "@/utils/bmiCalculator";

// Maximum limits
const MAX_FEET = 8;
const MAX_INCHES = 11.9;
const MAX_CM = 274.1; // Equivalent to 9 feet
const MAX_KG = 250;
const MAX_LBS = 551.2; // Equivalent to 250 kg

const BMICalculator = () => {
  // Height state
  const [useMetric, setUseMetric] = useState<boolean>(false);
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(6);
  const [cm, setCm] = useState<number>(168); // Default 5'6" in cm
  
  // Weight state
  const [useKg, setUseKg] = useState<boolean>(true);
  const [weight, setWeight] = useState<number>(70);
  
  // Result state
  const [bmi, setBMI] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Error state
  const [error, setError] = useState<string>("");

  // Initialize cm value based on feet and inches
  useEffect(() => {
    const heightInMeters = convertHeightToMeters(feet, inches);
    setCm(parseFloat((heightInMeters * 100).toFixed(1)));
  }, []);

  // Check if values exceed limits
  const checkValuesWithinLimits = (): boolean => {
    // Check height limits
    if ((useMetric && cm > MAX_CM) || 
        (!useMetric && (feet > MAX_FEET || (feet === MAX_FEET && inches > 0) || inches > MAX_INCHES))) {
      setError("One or more values exceeds the maximum limit");
      return false;
    }

    // Check weight limits
    if ((useKg && weight > MAX_KG) || (!useKg && weight > MAX_LBS)) {
      setError("One or more values exceeds the maximum limit");
      return false;
    }

    setError("");
    return true;
  };

  // Calculate BMI whenever relevant values change
  useEffect(() => {
    if (!checkValuesWithinLimits()) {
      setBMI(0);
      setCategory("");
      setDescription("");
      return;
    }

    let heightInMeters: number;
    let weightInKg: number;

    // Calculate height in meters based on selected unit
    if (useMetric) {
      heightInMeters = convertCmToMeters(cm);
    } else {
      heightInMeters = convertHeightToMeters(feet, inches);
    }

    // Calculate weight in kg based on selected unit
    if (useKg) {
      weightInKg = weight;
    } else {
      weightInKg = convertLbsToKg(weight);
    }
    
    // Calculate BMI
    const calculatedBMI = calculateBMI(heightInMeters, weightInKg);
    setBMI(calculatedBMI);
    
    // Set category and description
    const bmiCategory = getBMICategory(calculatedBMI);
    setCategory(bmiCategory);
    setDescription(getBMICategoryDescription(bmiCategory));
  }, [feet, inches, cm, weight, useMetric, useKg]);

  // Handle height unit toggle
  const handleHeightUnitToggle = () => {
    if (!useMetric) {
      // Switching to metric (cm)
      const heightInMeters = convertHeightToMeters(feet, inches);
      setCm(parseFloat((heightInMeters * 100).toFixed(1)));
    } else {
      // Switching to imperial (feet and inches)
      const totalInches = parseFloat((cm / 2.54).toFixed(1));
      const calculatedFeet = Math.floor(totalInches / 12);
      const calculatedInches = parseFloat((totalInches % 12).toFixed(1));
      setFeet(calculatedFeet);
      setInches(calculatedInches);
    }
    setUseMetric(!useMetric);
  };

  // Handle weight unit toggle
  const handleWeightUnitToggle = () => {
    if (useKg) {
      // Switching to lbs
      setWeight(parseFloat((weight * 2.20462).toFixed(1)));
    } else {
      // Switching to kg
      setWeight(parseFloat(convertLbsToKg(weight).toFixed(1)));
    }
    setUseKg(!useKg);
  };

  // Handle form input changes
  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove leading zeros for non-zero values
    const cleanedValue = inputValue.replace(/^0+(?!$)/, '');
    
    if (inputValue === '') {
      setFeet(0);
    } else {
      const value = parseInt(cleanedValue);
      setFeet(isNaN(value) ? 0 : Math.min(value, MAX_FEET));
    }
  };

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove leading zeros for non-zero values
    const cleanedValue = inputValue.replace(/^0+(?!$)/, '');
    
    if (inputValue === '') {
      setInches(0);
    } else {
      const value = parseFloat(cleanedValue);
      setInches(isNaN(value) ? 0 : Math.min(value, MAX_INCHES));
    }
  };

  const handleCmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove leading zeros for non-zero values
    const cleanedValue = inputValue.replace(/^0+(?!$)/, '');
    
    if (inputValue === '') {
      setCm(0);
    } else {
      const value = parseFloat(cleanedValue);
      setCm(isNaN(value) ? 0 : Math.min(value, MAX_CM));
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove leading zeros for non-zero values
    const cleanedValue = inputValue.replace(/^0+(?!$)/, '');
    
    if (inputValue === '') {
      setWeight(0);
    } else {
      const value = parseFloat(cleanedValue);
      const maxWeight = useKg ? MAX_KG : MAX_LBS;
      setWeight(isNaN(value) ? 0 : Math.min(value, maxWeight));
    }
  };

  // Get color based on BMI category
  const getCategoryColor = () => {
    switch (category) {
      case "Underweight":
        return "text-blue-500";
      case "Normal weight":
        return "text-green-500";
      case "Overweight":
        return "text-yellow-500";
      case "Obese":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-health-primary text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center">BMI Calculator</CardTitle>
        <CardDescription className="text-health-light text-center">
          Calculate your Body Mass Index
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          {/* Height Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="height" className="text-lg font-medium">Height</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{useMetric ? "Cm" : "Feet & Inches"}</span>
                <Switch 
                  id="height-unit-toggle" 
                  checked={useMetric}
                  onCheckedChange={handleHeightUnitToggle}
                />
              </div>
            </div>
            
            {useMetric ? (
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="cm">Centimeters</Label>
                <Input
                  id="cm"
                  type="number"
                  min="1"
                  max={MAX_CM}
                  step="0.1"
                  value={cm}
                  onChange={handleCmChange}
                  className="mt-1"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="feet">Feet</Label>
                  <Input
                    id="feet"
                    type="number"
                    min="0"
                    max={MAX_FEET}
                    value={feet}
                    onChange={handleFeetChange}
                    className="mt-1"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="inches">Inches</Label>
                  <Input
                    id="inches"
                    type="number"
                    min="0"
                    max={MAX_INCHES}
                    step="0.1"
                    value={inches}
                    onChange={handleInchesChange}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Weight Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="weight" className="text-lg font-medium">
                Weight {useKg ? "(kg)" : "(lbs)"}
              </Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{useKg ? "Kg" : "Lbs"}</span>
                <Switch 
                  id="weight-unit-toggle" 
                  checked={!useKg}
                  onCheckedChange={handleWeightUnitToggle}
                />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="weight">{useKg ? "Kilograms" : "Pounds"}</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                max={useKg ? MAX_KG : MAX_LBS}
                step="0.1"
                value={weight}
                onChange={handleWeightChange}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Display error message if limits are exceeded */}
        {error && (
          <Alert variant="destructive" className="mt-4 bg-red-50">
            <AlertDescription className="text-red-500">{error}</AlertDescription>
          </Alert>
        )}

        {/* Show BMI result only if no errors and BMI is calculated */}
        {!error && bmi > 0 && (
          <div className="mt-8 p-4 bg-health-light rounded-lg">
            <h3 className="text-lg font-bold text-center">Your BMI Result</h3>
            <div className="text-center">
              <p className="text-3xl font-bold mt-2">{bmi}</p>
              <p className={`text-xl font-semibold mt-1 ${getCategoryColor()}`}>
                {category}
              </p>
              <p className="mt-2 text-gray-600">{description}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t p-4">
        <p className="text-sm text-gray-500 text-center">
          BMI is a screening tool, not a diagnostic of body fatness or health.
          Consult with a healthcare provider for more information.
        </p>
      </CardFooter>
    </Card>
  );
};

export default BMICalculator;
