
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  convertHeightToMeters, 
  convertCmToMeters,
  convertLbsToKg,
  calculateBMI, 
  getBMICategory, 
  getBMICategoryDescription 
} from "@/utils/bmiCalculator";

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

  // Initialize cm value based on feet and inches
  useEffect(() => {
    const heightInMeters = convertHeightToMeters(feet, inches);
    setCm(Math.round(heightInMeters * 100));
  }, []);

  // Calculate BMI whenever relevant values change
  useEffect(() => {
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
    const value = parseInt(e.target.value);
    setFeet(isNaN(value) ? 0 : value);
  };

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setInches(isNaN(value) ? 0 : Math.min(value, 11.9)); // Limit inches to 0-11.9
  };

  const handleCmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCm(isNaN(value) ? 0 : value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setWeight(isNaN(value) ? 0 : value);
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
              <div>
                <Input
                  id="cm"
                  type="number"
                  min="1"
                  step="0.1"
                  value={cm}
                  onChange={handleCmChange}
                  className="mt-1"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="feet">Feet</Label>
                  <Input
                    id="feet"
                    type="number"
                    min="0"
                    max="8"
                    value={feet}
                    onChange={handleFeetChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="inches">Inches</Label>
                  <Input
                    id="inches"
                    type="number"
                    min="0"
                    max="11.9"
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
            <Input
              id="weight"
              type="number"
              min="0"
              step="0.1"
              value={weight}
              onChange={handleWeightChange}
              className="mt-1"
            />
          </div>
        </div>

        {bmi > 0 && (
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
