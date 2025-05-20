
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateBMI, getBMICategory } from "@/utils/bmiCalculator";
import BMIResultBar from "./BMIResultBar";
import { toast } from "@/hooks/use-toast";
import { useHealthRecords } from "@/hooks/useHealthRecords";
import { useAuth } from "@/context/AuthContext";

const BMICalculator = () => {
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [measurementSystem, setMeasurementSystem] = useState<"metric" | "imperial">("metric");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const { saveHealthRecord } = useHealthRecords();
  const { user } = useAuth();

  useEffect(() => {
    if (measurementSystem === "metric") {
      setHeightUnit("cm");
      setWeightUnit("kg");
    } else {
      setHeightUnit("ft");
      setWeightUnit("lbs");
    }
  }, [measurementSystem]);

  const handleCalculate = () => {
    if (height && weight) {
      const bmiValue = calculateBMI(height, weight, heightUnit, weightUnit);
      const bmiCategory = getBMICategory(bmiValue);
      
      setBmi(bmiValue);
      setCategory(bmiCategory);
      
      // Save to database if user is logged in
      if (user) {
        const result = {
          height,
          weight,
          heightUnit,
          weightUnit,
          bmi: bmiValue,
          category: bmiCategory
        };
        
        saveHealthRecord("bmi", result)
          .then(({ success }) => {
            if (success) {
              toast({
                title: "Result Saved",
                description: "Your BMI result has been saved to your records",
              });
            }
          })
          .catch(error => {
            console.error("Error saving BMI record:", error);
          });
      }
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Measurement System</Label>
            <RadioGroup
              defaultValue="metric"
              value={measurementSystem}
              onValueChange={(value) => setMeasurementSystem(value as "metric" | "imperial")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="metric" id="metric" />
                <Label htmlFor="metric" className="cursor-pointer">Metric (cm, kg)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="imperial" id="imperial" />
                <Label htmlFor="imperial" className="cursor-pointer">Imperial (ft, lbs)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="height">Height ({heightUnit === "cm" ? "cm" : "feet"})</Label>
              <div className="flex space-x-2">
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min={0}
                  step={heightUnit === "cm" ? 1 : 0.01}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight ({weightUnit === "kg" ? "kg" : "lbs"})</Label>
              <div className="flex space-x-2">
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  min={0}
                  step={0.1}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleCalculate}
            className="w-full bg-health-light hover:bg-health-light/90 text-white"
            size="lg"
          >
            Calculate BMI
          </Button>

          {bmi !== null && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-bold">{bmi.toFixed(1)}</h3>
                <p className="text-lg font-medium">{category}</p>
              </div>
              
              <BMIResultBar bmi={bmi} />
              
              {!user && (
                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                  <p className="font-medium">Sign in to save your BMI results!</p>
                  <p>Track your progress over time by creating an account.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BMICalculator;
