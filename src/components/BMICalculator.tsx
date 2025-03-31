
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  convertHeightToMeters, 
  calculateBMI, 
  getBMICategory, 
  getBMICategoryDescription 
} from "@/utils/bmiCalculator";

const BMICalculator = () => {
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(6);
  const [weight, setWeight] = useState<number>(70);
  const [bmi, setBMI] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Calculate BMI whenever height or weight changes
  useEffect(() => {
    if (feet > 0 || inches > 0) {
      const heightInMeters = convertHeightToMeters(feet, inches);
      const calculatedBMI = calculateBMI(heightInMeters, weight);
      
      setBMI(calculatedBMI);
      
      const bmiCategory = getBMICategory(calculatedBMI);
      setCategory(bmiCategory);
      setDescription(getBMICategoryDescription(bmiCategory));
    }
  }, [feet, inches, weight]);

  // Handle form input changes
  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFeet(isNaN(value) ? 0 : value);
  };

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setInches(isNaN(value) ? 0 : Math.min(value, 11)); // Limit inches to 0-11
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
          <div>
            <Label htmlFor="height" className="text-lg font-medium">Height</Label>
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
                  max="11"
                  value={inches}
                  onChange={handleInchesChange}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="weight" className="text-lg font-medium">Weight (kg)</Label>
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
