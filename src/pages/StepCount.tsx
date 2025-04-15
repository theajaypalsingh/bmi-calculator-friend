import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ActivitySquare } from 'lucide-react';

type FormData = {
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
};

const activityMultipliers = {
  sedentary: 1.2,
  lightlyActive: 1.375,
  moderatelyActive: 1.55,
  veryActive: 1.725,
  superActive: 1.9
};

const stepPercentages = {
  sedentary: 0.10,
  lightlyActive: 0.15,
  moderatelyActive: 0.20,
  veryActive: 0.25,
  superActive: 0.30
};

const CALORIES_PER_STEP = 0.05;

const StepCount = () => {
  const [stepGoal, setStepGoal] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const form = useForm<FormData>({
    defaultValues: {
      age: 30,
      weight: 70,
      height: 170,
      gender: 'male',
      activityLevel: 'lightlyActive'
    }
  });

  const calculateStepGoal = (data: FormData) => {
    let bmr = 0;
    if (data.gender === 'male') {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
    } else if (data.gender === 'female') {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
    } else {
      const maleBmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
      const femaleBmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
      bmr = (maleBmr + femaleBmr) / 2;
    }

    const activityMultiplier = activityMultipliers[data.activityLevel as keyof typeof activityMultipliers];
    const tdee = bmr * activityMultiplier;

    const stepPercentage = stepPercentages[data.activityLevel as keyof typeof stepPercentages];
    const steps = tdee * stepPercentage / CALORIES_PER_STEP;

    return Math.round(steps / 100) * 100;
  };

  const onSubmit = (data: FormData) => {
    const calculatedStepGoal = calculateStepGoal(data);
    setStepGoal(calculatedStepGoal);
    setShowResults(true);
  };

  const getActivityLabel = (key: string): string => {
    switch (key) {
      case 'sedentary':
        return 'Sedentary – Little or no exercise';
      case 'lightlyActive':
        return 'Lightly Active – Light exercise 1–3 days/week';
      case 'moderatelyActive':
        return 'Moderately Active – Moderate exercise 3–5 days/week';
      case 'veryActive':
        return 'Very Active – Hard exercise 6–7 days/week';
      case 'superActive':
        return 'Super Active – Intense training or physical job daily';
      default:
        return key;
    }
  };

  return <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-white rounded-t-lg bg-gray-800">
          <CardTitle className="text-xl font-bold text-center">Daily Step Goal Calculator</CardTitle>
          <CardDescription className="text-center text-white/90">Find your optimal daily step target</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="age" render={({
              field
            }) => <FormItem>
                    <FormLabel>Age (years)</FormLabel>
                    <FormControl>
                      <Input type="number" min="10" max="100" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                  </FormItem>} />

              <FormField control={form.control} name="height" render={({
              field
            }) => <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" min="100" max="250" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                  </FormItem>} />

              <FormField control={form.control} name="weight" render={({
              field
            }) => <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" min="30" max="200" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                  </FormItem>} />

              <FormField control={form.control} name="gender" render={({
              field
            }) => <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>} />

              <FormField control={form.control} name="activityLevel" render={({
              field
            }) => <FormItem>
                    <FormLabel>Physical Activity Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your activity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary – Little or no exercise</SelectItem>
                        <SelectItem value="lightlyActive">Lightly Active – Light exercise 1–3 days/week</SelectItem>
                        <SelectItem value="moderatelyActive">Moderately Active – Moderate exercise 3–5 days/week</SelectItem>
                        <SelectItem value="veryActive">Very Active – Hard exercise 6–7 days/week</SelectItem>
                        <SelectItem value="superActive">Super Active – Intense training or physical job daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>} />

              <div className="flex justify-center mt-6">
                <Button type="submit" className="px-6 bg-red-800 hover:bg-red-700">
                  <ActivitySquare className="mr-2 h-4 w-4" />
                  Calculate Step Goal
                </Button>
              </div>
            </form>
          </Form>
          
          {showResults && <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-center font-medium">Your recommended daily step goal:</p>
              <p className="text-center text-2xl font-bold text-green-600">
                {stepGoal.toLocaleString()} steps/day
              </p>
              <p className="text-center text-sm text-gray-600 mt-2">
                {stepGoal.toLocaleString()} steps/day is recommended based on your profile to improve your health.
              </p>
            </div>}
        </CardContent>
        
        <CardFooter className="border-t px-6 py-4">
          <div className="text-sm text-gray-500 space-y-2 w-full">
            <p className="text-center">Step goals are calculated based on your BMR, activity level, and estimated caloric needs.

Note - There's no single universal formula to calculate “Ideal daily step count,” The above calculation is based on research from ACSM (American College of Sports Medicine) and public health bodies like WHO and CDC.</p>
            <p className="text-center text-xs">Consult your healthcare provider before starting any new fitness program.</p>
          </div>
        </CardFooter>
      </Card>
    </div>;
};

export default StepCount;
