
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const StepCount = () => {
  // Initialize state variables with numbers, not strings
  const [age, setAge] = useState<number>(30);
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [stepGoal, setStepGoal] = useState<number>(0);
  const [goalCalculated, setGoalCalculated] = useState<boolean>(false);

  const calculateGoal = () => {
    // Basic formula: (Age * 10) + (Weight * 0.5) + (Height * 0.1)
    // This is just a sample formula - adjust as needed
    const calculatedGoal = Math.round((age * 10) + (weight * 0.5) + (height * 0.1));
    setStepGoal(calculatedGoal);
    setGoalCalculated(true);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setAge(value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setWeight(value);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setHeight(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader className="bg-health-primary text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold text-center">Daily Step Goal Calculator</CardTitle>
          <CardDescription className="text-center text-white/90">Find your optimal daily step target</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium">Age (years)</Label>
              <Input 
                id="age" 
                type="number"
                min="10"
                max="100"
                value={age}
                onChange={handleAgeChange}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
              <Input 
                id="weight" 
                type="number"
                min="30"
                max="200"
                value={weight}
                onChange={handleWeightChange}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm font-medium">Height (cm)</Label>
              <Input 
                id="height" 
                type="number"
                min="100"
                max="250"
                value={height}
                onChange={handleHeightChange}
                className="w-full"
              />
            </div>

            <div className="flex justify-center mt-4">
              <Button onClick={calculateGoal} className="w-auto px-6">
                Calculate Step Goal
              </Button>
            </div>
            
            {goalCalculated && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-center font-medium">Your recommended daily step goal:</p>
                <p className="text-center text-2xl font-bold text-green-600">{stepGoal.toLocaleString()} steps</p>
                <p className="text-center text-sm text-gray-500 mt-1">
                  This is personalized based on your age, weight, and height
                </p>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="border-t px-6 py-4 text-center text-sm text-gray-500">
          Step goals may vary based on health conditions and fitness levels.
        </CardFooter>
      </Card>
    </div>
  );
};

export default StepCount;
