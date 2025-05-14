
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateBMR } from "@/utils/bmrCalculator";

const BMRCalculator = () => {
  const [gender, setGender] = useState("female");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("1.2");
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [unitSystem, setUnitSystem] = useState("metric");

  const handleCalculate = () => {
    if (!age || !weight || !height) return;

    const ageValue = parseFloat(age);
    let weightValue = parseFloat(weight);
    let heightValue = parseFloat(height);

    // Convert imperial to metric if needed
    if (unitSystem === "imperial") {
      weightValue = weightValue * 0.453592; // lbs to kg
      heightValue = heightValue * 2.54; // inches to cm
    }

    const calculatedBMR = calculateBMR(gender, ageValue, weightValue, heightValue);
    const calculatedTDEE = calculatedBMR * parseFloat(activityLevel);

    setBmr(Math.round(calculatedBMR));
    setTdee(Math.round(calculatedTDEE));
  };

  const resetCalculator = () => {
    setAge("");
    setWeight("");
    setHeight("");
    setActivityLevel("1.2");
    setBmr(null);
    setTdee(null);
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-white to-health-light pb-0">
      <header className="py-8 text-white bg-gradient-to-r from-gray-700 to-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-2 animate-fade-in">
            <span className="text-health-light">BMR</span> Calculator
          </h1>
          <p className="text-center text-lg text-health-light opacity-90">
            Calculate your Basal Metabolic Rate and Total Daily Energy Expenditure
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <Tabs defaultValue="calculator" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="calculator">Calculator</TabsTrigger>
                <TabsTrigger value="about">About BMR</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calculator">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">BMR & TDEE Calculator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex justify-center space-x-4 mb-6">
                        <Button
                          variant={unitSystem === "metric" ? "default" : "outline"}
                          onClick={() => setUnitSystem("metric")}
                        >
                          Metric (kg/cm)
                        </Button>
                        <Button
                          variant={unitSystem === "imperial" ? "default" : "outline"}
                          onClick={() => setUnitSystem("imperial")}
                        >
                          Imperial (lb/in)
                        </Button>
                      </div>
                      
                      <div className="grid gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <RadioGroup
                            id="gender"
                            value={gender}
                            onValueChange={setGender}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male">Male</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female">Female</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="age">Age (years)</Label>
                          <Input
                            id="age"
                            type="number"
                            placeholder="Enter your age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="weight">
                            Weight ({unitSystem === "metric" ? "kg" : "lb"})
                          </Label>
                          <Input
                            id="weight"
                            type="number"
                            placeholder={`Enter your weight in ${unitSystem === "metric" ? "kilograms" : "pounds"}`}
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="height">
                            Height ({unitSystem === "metric" ? "cm" : "in"})
                          </Label>
                          <Input
                            id="height"
                            type="number"
                            placeholder={`Enter your height in ${unitSystem === "metric" ? "centimeters" : "inches"}`}
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="activity-level">Activity Level</Label>
                          <Select value={activityLevel} onValueChange={setActivityLevel}>
                            <SelectTrigger id="activity-level">
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1.2">Sedentary (little or no exercise)</SelectItem>
                              <SelectItem value="1.375">Light (exercise 1-3 days/week)</SelectItem>
                              <SelectItem value="1.55">Moderate (exercise 3-5 days/week)</SelectItem>
                              <SelectItem value="1.725">Active (exercise 6-7 days/week)</SelectItem>
                              <SelectItem value="1.9">Very Active (hard exercise/physical job)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex space-x-4">
                          <Button onClick={handleCalculate} className="flex-1">
                            Calculate
                          </Button>
                          <Button variant="outline" onClick={resetCalculator}>
                            Reset
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {bmr !== null && tdee !== null && (
                      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-center mb-4">Your Results</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white p-4 rounded-md shadow text-center">
                            <p className="text-sm text-gray-600 mb-1">Basal Metabolic Rate</p>
                            <p className="text-3xl font-bold text-blue-600">{bmr} calories</p>
                            <p className="text-xs text-gray-500 mt-2">Calories needed at complete rest</p>
                          </div>
                          <div className="bg-white p-4 rounded-md shadow text-center">
                            <p className="text-sm text-gray-600 mb-1">Total Daily Energy Expenditure</p>
                            <p className="text-3xl font-bold text-green-600">{tdee} calories</p>
                            <p className="text-xs text-gray-500 mt-2">Calories needed based on activity level</p>
                          </div>
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white p-4 rounded-md shadow">
                            <p className="font-medium text-center mb-2">To Lose Weight</p>
                            <ul className="text-sm space-y-1">
                              <li>Mild weight loss: <strong>{tdee - 250} calories/day</strong></li>
                              <li>Weight loss: <strong>{tdee - 500} calories/day</strong></li>
                              <li>Extreme weight loss: <strong>{tdee - 1000} calories/day</strong></li>
                            </ul>
                          </div>
                          <div className="bg-white p-4 rounded-md shadow">
                            <p className="font-medium text-center mb-2">To Gain Weight</p>
                            <ul className="text-sm space-y-1">
                              <li>Mild weight gain: <strong>{tdee + 250} calories/day</strong></li>
                              <li>Weight gain: <strong>{tdee + 500} calories/day</strong></li>
                              <li>Fast weight gain: <strong>{tdee + 1000} calories/day</strong></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="about">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">What is BMR?</h2>
                  <p className="text-gray-700">
                    Basal Metabolic Rate (BMR) is the number of calories your body needs to accomplish its most basic (basal) life-sustaining functions, like breathing, circulation, nutrient processing, and cell production.
                  </p>
                  
                  <h2 className="text-2xl font-semibold">What is TDEE?</h2>
                  <p className="text-gray-700">
                    Total Daily Energy Expenditure (TDEE) is an estimation of how many calories you burn per day when your activity level is taken into account. It is calculated by multiplying your BMR by an activity factor.
                  </p>
                  
                  <h2 className="text-2xl font-semibold">How are they calculated?</h2>
                  <p className="text-gray-700">
                    This calculator uses the Mifflin-St Jeor equation which is considered the most accurate for calculating BMR:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-md my-4">
                    <p className="font-mono">For men: BMR = 10W + 6.25H - 5A + 5</p>
                    <p className="font-mono">For women: BMR = 10W + 6.25H - 5A - 161</p>
                    <p className="text-sm mt-2">
                      Where W is weight in kg, H is height in cm, and A is age in years.
                    </p>
                  </div>
                  
                  <h2 className="text-2xl font-semibold">Why is this important?</h2>
                  <p className="text-gray-700">
                    Understanding your BMR and TDEE can help you:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Set realistic weight loss or gain goals</li>
                    <li>Understand how many calories you need daily</li>
                    <li>Make informed decisions about your diet and exercise</li>
                    <li>Create a sustainable caloric deficit or surplus</li>
                  </ul>
                  
                  <div className="bg-yellow-50 p-4 rounded-md mt-6">
                    <h3 className="font-semibold text-amber-800">Important Note</h3>
                    <p className="text-amber-800">
                      These calculations provide estimates and may vary based on individual factors not accounted for in the formula, such as body composition, genetics, and specific health conditions. For personalized advice, consult with a healthcare professional.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BMRCalculator;
