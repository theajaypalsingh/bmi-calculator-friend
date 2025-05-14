
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const HealthScoreCalculator = () => {
  const [age, setAge] = useState("");
  const [bmi, setBmi] = useState("");
  const [steps, setSteps] = useState("");
  const [sleep, setSleep] = useState("");
  const [fruits, setFruits] = useState("2");
  const [smoking, setSmoking] = useState("no");
  const [alcohol, setAlcohol] = useState("none");
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [scoreCategory, setScoreCategory] = useState<string>("");
  
  const calculateHealthScore = () => {
    if (!age || !bmi || !steps || !sleep) return;
    
    // Base score starts at 50
    let score = 50;
    
    // Age factor (younger generally means healthier starting point)
    const ageValue = parseFloat(age);
    if (ageValue < 30) score += 5;
    else if (ageValue > 60) score -= 5;
    
    // BMI factor (healthy BMI range is typically 18.5-24.9)
    const bmiValue = parseFloat(bmi);
    if (bmiValue >= 18.5 && bmiValue <= 24.9) score += 15;
    else if (bmiValue >= 25 && bmiValue <= 29.9) score += 5;
    else if (bmiValue >= 30) score -= 10;
    else if (bmiValue < 18.5) score -= 5;
    
    // Activity level (steps per day)
    const stepsValue = parseFloat(steps);
    if (stepsValue >= 10000) score += 15;
    else if (stepsValue >= 7500) score += 10;
    else if (stepsValue >= 5000) score += 5;
    
    // Sleep duration (7-9 hours is typically recommended)
    const sleepValue = parseFloat(sleep);
    if (sleepValue >= 7 && sleepValue <= 9) score += 10;
    else if (sleepValue >= 6 && sleepValue < 7) score += 5;
    else if (sleepValue > 9) score += 0;
    else score -= 5;
    
    // Nutrition (fruits and vegetables per day)
    const fruitsValue = parseInt(fruits);
    if (fruitsValue >= 5) score += 10;
    else if (fruitsValue >= 3) score += 5;
    
    // Smoking status
    if (smoking === "no") score += 10;
    else score -= 20;
    
    // Alcohol consumption
    if (alcohol === "none") score += 5;
    else if (alcohol === "moderate") score += 0;
    else score -= 10;
    
    // Ensure score stays within 0-100 range
    score = Math.max(0, Math.min(100, score));
    
    setHealthScore(Math.round(score));
    
    // Determine score category
    if (score >= 86) setScoreCategory("Excellent");
    else if (score >= 71) setScoreCategory("Good");
    else if (score >= 51) setScoreCategory("Fair");
    else setScoreCategory("Needs Improvement");
  };
  
  const getScoreCategoryColor = () => {
    if (!scoreCategory) return "bg-gray-200";
    
    switch (scoreCategory) {
      case "Excellent": return "bg-green-500";
      case "Good": return "bg-blue-500";
      case "Fair": return "bg-yellow-500";
      case "Needs Improvement": return "bg-red-500";
      default: return "bg-gray-200";
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bmi">BMI (Body Mass Index)</Label>
              <Input
                id="bmi"
                type="number"
                step="0.1"
                placeholder="Enter your BMI"
                value={bmi}
                onChange={(e) => setBmi(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="steps">Daily Steps</Label>
              <Input
                id="steps"
                type="number"
                placeholder="Average steps per day"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sleep">Sleep Duration (hours)</Label>
              <Input
                id="sleep"
                type="number"
                step="0.5"
                placeholder="Hours of sleep per night"
                value={sleep}
                onChange={(e) => setSleep(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fruits">Daily Fruits & Vegetables</Label>
              <Select value={fruits} onValueChange={setFruits}>
                <SelectTrigger id="fruits">
                  <SelectValue placeholder="Select servings per day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="1">1 serving</SelectItem>
                  <SelectItem value="2">2 servings</SelectItem>
                  <SelectItem value="3">3 servings</SelectItem>
                  <SelectItem value="4">4 servings</SelectItem>
                  <SelectItem value="5">5+ servings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alcohol">Alcohol Consumption</Label>
              <Select value={alcohol} onValueChange={setAlcohol}>
                <SelectTrigger id="alcohol">
                  <SelectValue placeholder="Select consumption level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="moderate">Moderate (1-2 drinks/week)</SelectItem>
                  <SelectItem value="heavy">Heavy (>7 drinks/week)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smoking">Do you smoke?</Label>
            <RadioGroup
              id="smoking"
              value={smoking}
              onValueChange={setSmoking}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button onClick={calculateHealthScore}>Calculate Health Score</Button>
          
          {healthScore !== null && (
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Your Health Score</span>
                  <span className="font-bold">{healthScore}/100</span>
                </div>
                <Progress value={healthScore} className={`h-3 ${getScoreCategoryColor()}`} />
              </div>
              
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <p className="font-medium text-lg">Category: {scoreCategory}</p>
                <p className="text-sm mt-2">
                  {scoreCategory === "Excellent" && "Great job! You're practicing excellent health habits."}
                  {scoreCategory === "Good" && "You're doing well with your health habits."}
                  {scoreCategory === "Fair" && "You have a foundation to build on. Consider making some lifestyle improvements."}
                  {scoreCategory === "Needs Improvement" && "Consider focusing on areas like nutrition, activity, and sleep quality to improve your score."}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthScoreCalculator;
