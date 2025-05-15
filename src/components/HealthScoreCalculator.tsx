import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { calculateHealthScore, getScoreCategory } from "@/utils/healthScoreCalculator";
import { CheckboxList, CheckboxOption } from "./CheckboxList";

// Medical condition options
const medicalConditionOptions: CheckboxOption[] = [
  { value: "none", label: "None of these" },
  { value: "diabetes", label: "Diabetes" },
  { value: "pcos", label: "PCOS" },
  { value: "thyroid", label: "Thyroid" },
  { value: "hypertension", label: "Hypertension" },
  { value: "fatty_liver", label: "Fatty liver" },
  { value: "autoimmune", label: "Auto Immune Disease" },
  { value: "arthritis", label: "Arthritis" },
  { value: "hormonal", label: "Hormonal Imbalance" },
  { value: "ibs", label: "IBS" },
  { value: "asthma", label: "Asthma" }
];

// Symptom options
const symptomOptions: CheckboxOption[] = [
  { value: "none", label: "None of these" },
  { value: "low_energy", label: "Low energy" },
  { value: "poor_digestion", label: "Poor digestion" },
  { value: "constipation", label: "Constipation" },
  { value: "hair_fall", label: "Hair fall" },
  { value: "poor_sleep", label: "Poor sleep" }
];

const HealthScoreCalculator = () => {
  const [age, setAge] = useState("");
  const [bmi, setBmi] = useState("");
  const [sleep, setSleep] = useState("");
  const [activityLevel, setActivityLevel] = useState("moderatelyActive");
  const [smoking, setSmoking] = useState("never");
  const [alcohol, setAlcohol] = useState("never");
  const [stressLevel, setStressLevel] = useState("low");
  const [eatingOutside, setEatingOutside] = useState("oneToTwo");
  const [waterIntake, setWaterIntake] = useState("eightPlus");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [scoreCategory, setScoreCategory] = useState<string>("");
  
  const calculateScore = () => {
    if (!age || !bmi || !sleep) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields before calculating your health score.",
        variant: "destructive",
      });
      return;
    }
    
    const inputs = {
      age: parseInt(age),
      bmi: parseFloat(bmi),
      sleepHours: parseFloat(sleep),
      activityLevel: activityLevel as any,
      smokingHabit: smoking as any,
      alcoholConsumption: alcohol as any,
      stressLevel: stressLevel as any,
      eatingOutside: eatingOutside as any,
      waterIntake: waterIntake as any,
      symptoms: symptoms,
      medicalConditions: medicalConditions
    };
    
    const score = calculateHealthScore(inputs);
    setHealthScore(Math.round(score));
    setScoreCategory(getScoreCategory(score));
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
            
            <div className="space-y-2">
              <Label htmlFor="activity">Physical Activity Level</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger id="activity">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="lightlyActive">Lightly Active</SelectItem>
                  <SelectItem value="moderatelyActive">Moderately Active</SelectItem>
                  <SelectItem value="veryActive">Very Active</SelectItem>
                  <SelectItem value="superActive">Super Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smoking">Smoking Habit</Label>
              <Select value={smoking} onValueChange={setSmoking}>
                <SelectTrigger id="smoking">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="rarely">Rarely</SelectItem>
                  <SelectItem value="occasionally">Occasionally</SelectItem>
                  <SelectItem value="regularly">Regularly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alcohol">Alcohol Consumption</Label>
              <Select value={alcohol} onValueChange={setAlcohol}>
                <SelectTrigger id="alcohol">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="rarely">Rarely</SelectItem>
                  <SelectItem value="occasionally">Occasionally</SelectItem>
                  <SelectItem value="regularly">Regularly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stress">Stress Level</Label>
              <Select value={stressLevel} onValueChange={setStressLevel}>
                <SelectTrigger id="stress">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eating">Eating Outside Frequency</Label>
              <Select value={eatingOutside} onValueChange={setEatingOutside}>
                <SelectTrigger id="eating">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="oneToTwo">1-2 times/week</SelectItem>
                  <SelectItem value="threeToFive">3-5 times/week</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="water">Water Intake (glasses/day)</Label>
              <Select value={waterIntake} onValueChange={setWaterIntake}>
                <SelectTrigger id="water">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eightPlus">8+ glasses</SelectItem>
                  <SelectItem value="sixToSeven">6-7 glasses</SelectItem>
                  <SelectItem value="fourToFive">4-5 glasses</SelectItem>
                  <SelectItem value="lessThan4">Less than 4 glasses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="symptoms">Symptoms (Select all that apply)</Label>
            <div className="border rounded-md p-3 bg-background">
              <CheckboxList 
                options={symptomOptions}
                selected={symptoms}
                onChange={setSymptoms}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="conditions">Medical Conditions (Select all that apply)</Label>
            <div className="border rounded-md p-3 bg-background">
              <CheckboxList 
                options={medicalConditionOptions}
                selected={medicalConditions}
                onChange={setMedicalConditions}
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={calculateScore} className="w-auto px-8">Calculate Health Score</Button>
          </div>
          
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
