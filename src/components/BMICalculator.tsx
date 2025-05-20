import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { calculateBMI, getBMICategory, getBMICategoryDescription, convertHeightToMeters, convertLbsToKg, convertCmToMeters } from "@/utils/bmiCalculator";
import BMIResultBar from "./BMIResultBar";
import { toast } from "@/hooks/use-toast";
import { useHealthRecords } from "@/hooks/useHealthRecords";
import { useAuth } from "@/context/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
const BMICalculator = () => {
  // Height state
  const [heightCm, setHeightCm] = useState<number>(170);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(7);

  // Weight state
  const [weightKg, setWeightKg] = useState<number>(70);
  const [weightLbs, setWeightLbs] = useState<number>(154.3);

  // Unit toggles
  const [isMetricHeight, setIsMetricHeight] = useState<boolean>(true);
  const [isMetricWeight, setIsMetricWeight] = useState<boolean>(true);

  // Results
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    saveHealthRecord
  } = useHealthRecords();
  const {
    user
  } = useAuth();

  // Convert between units when toggling
  useEffect(() => {
    if (isMetricHeight) {
      // Convert from feet/inches to cm
      const totalInches = heightFeet * 12 + heightInches;
      setHeightCm(parseFloat((totalInches * 2.54).toFixed(1)));
    } else {
      // Convert from cm to feet/inches
      const totalInches = heightCm / 2.54;
      setHeightFeet(Math.floor(totalInches / 12));
      setHeightInches(parseFloat((totalInches % 12).toFixed(1)));
    }
  }, [isMetricHeight]);
  useEffect(() => {
    if (isMetricWeight) {
      // Convert from lbs to kg
      setWeightKg(parseFloat((weightLbs * 0.453592).toFixed(1)));
    } else {
      // Convert from kg to lbs
      setWeightLbs(parseFloat((weightKg / 0.453592).toFixed(1)));
    }
  }, [isMetricWeight]);
  const handleCalculate = () => {
    setError(null);

    // Check for maximum limits
    if (isMetricHeight && heightCm > 250 || !isMetricHeight && (heightFeet > 8 || heightFeet === 8 && heightInches > 0) || isMetricWeight && weightKg > 250 || !isMetricWeight && weightLbs > 550) {
      setError("One or more values exceeds the maximum limit");
      setBmi(null);
      setCategory("");
      setVisible(false);
      return;
    }

    // Convert height to meters for BMI calculation
    let heightInMeters: number;
    if (isMetricHeight) {
      heightInMeters = convertCmToMeters(heightCm);
    } else {
      heightInMeters = convertHeightToMeters(heightFeet, heightInches);
    }

    // Convert weight to kg for BMI calculation
    let weightInKg: number;
    if (isMetricWeight) {
      weightInKg = weightKg;
    } else {
      weightInKg = convertLbsToKg(weightLbs);
    }

    // Calculate BMI
    const bmiValue = calculateBMI(weightInKg, heightInMeters);
    const bmiCategory = getBMICategory(bmiValue);
    setBmi(bmiValue);
    setCategory(bmiCategory);
    setVisible(true);

    // Save to database if user is logged in
    if (user) {
      const result = {
        height: isMetricHeight ? heightCm : heightFeet * 30.48 + heightInches * 2.54,
        weight: isMetricWeight ? weightKg : weightLbs * 0.453592,
        heightUnit: isMetricHeight ? "cm" : "ft",
        weightUnit: isMetricWeight ? "kg" : "lbs",
        bmi: bmiValue,
        category: bmiCategory
      };
      saveHealthRecord("bmi", result).then(({
        success
      }) => {
        if (success) {
          toast({
            title: "Result Saved",
            description: "Your BMI result has been saved to your records"
          });
        }
      }).catch(error => {
        console.error("Error saving BMI record:", error);
      });
    }
  };
  return <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Height Input Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="height" className="text-base font-medium">Height</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">cm</span>
                <Switch checked={!isMetricHeight} onCheckedChange={() => setIsMetricHeight(!isMetricHeight)} />
                <span className="text-sm text-gray-600">ft &amp; in</span>
              </div>
            </div>
            
            {isMetricHeight ? <div className="flex space-x-2">
                <div className="w-full">
                  <Input id="height-cm" type="number" value={heightCm} onChange={e => setHeightCm(Number(e.target.value))} min={0} max={250} step={0.1} className="flex-1" />
                  <p className="text-xs text-gray-500 mt-1">Centimeters (cm)</p>
                </div>
              </div> : <div className="flex space-x-2">
                <div className="w-1/2">
                  <Input id="height-feet" type="number" value={heightFeet} onChange={e => setHeightFeet(Number(e.target.value))} min={0} max={8} className="flex-1" />
                  <p className="text-xs text-gray-500 mt-1">Feet</p>
                </div>
                <div className="w-1/2">
                  <Input id="height-inches" type="number" value={heightInches} onChange={e => setHeightInches(Number(e.target.value))} min={0} max={11.9} step={0.1} className="flex-1" />
                  <p className="text-xs text-gray-500 mt-1">Inches</p>
                </div>
              </div>}
          </div>

          {/* Weight Input Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="weight" className="text-base font-medium">Weight</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">kg</span>
                <Switch checked={!isMetricWeight} onCheckedChange={() => setIsMetricWeight(!isMetricWeight)} />
                <span className="text-sm text-gray-600">lbs</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <div className="w-full">
                <Input id="weight" type="number" value={isMetricWeight ? weightKg : weightLbs} onChange={e => {
                if (isMetricWeight) {
                  setWeightKg(Number(e.target.value));
                  setWeightLbs(parseFloat((Number(e.target.value) / 0.453592).toFixed(1)));
                } else {
                  setWeightLbs(Number(e.target.value));
                  setWeightKg(parseFloat((Number(e.target.value) * 0.453592).toFixed(1)));
                }
              }} min={0} max={isMetricWeight ? 250 : 550} step={0.1} className="flex-1" />
                <p className="text-xs text-gray-500 mt-1">
                  {isMetricWeight ? "Kilograms (kg)" : "Pounds (lbs)"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleCalculate} size="lg" className="w-3/4 text-white bg-red-800 hover:bg-red-700">
              Calculate BMI
            </Button>
          </div>

          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md text-center">
              {error}
            </div>}

          {bmi !== null && !error && <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-bold">{bmi.toFixed(1)}</h3>
                <p className="text-lg font-medium">{category}</p>
                
                {bmi > 24.9 && <div className="mt-2 text-blue-600 hover:underline">
                    <Link to="/dietary-tips">Click here to get dietary tips for weight loss</Link>
                  </div>}
              </div>
              
              <BMIResultBar bmi={bmi} category={category} visible={visible} heightInCm={isMetricHeight ? heightCm : heightFeet * 30.48 + heightInches * 2.54} />
              
              {!user && <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                  <p className="font-medium">Sign in to save your BMI results!</p>
                  <p>Track your progress over time by creating an account.</p>
                </div>}
            </div>}
        </div>
      </CardContent>
    </Card>;
};
export default BMICalculator;
