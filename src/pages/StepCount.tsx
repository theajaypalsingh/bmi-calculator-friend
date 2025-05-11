import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ActivitySquare, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

  return (
    <div className="container-fluid p-0">
      <div className="bg-gray-800 text-white py-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center">Daily Step Goal Calculator</h1>
          <p className="text-center mt-2">Know how much steps you should do daily</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">Find your optimal daily step target</CardTitle>
            <CardDescription className="text-center">Get personalized recommendations based on your profile</CardDescription>
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

Note - There's no single universal formula to calculate "Ideal daily step count," The above calculation is based on research from ACSM (American College of Sports Medicine) and public health bodies like WHO and CDC.</p>
              <p className="text-center text-xs">Consult your healthcare provider before starting any new fitness program.</p>
            </div>
          </CardFooter>
        </Card>
        
        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                How many steps should I aim for each day?
              </AccordionTrigger>
              <AccordionContent>
                <p>While 10,000 steps is a common goal, the ideal step count varies by individual. Research suggests:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>For basic health benefits: 7,000-8,000 steps</li>
                  <li>For weight management: 10,000-12,000 steps</li>
                  <li>For active lifestyles: 12,000-15,000 steps</li>
                </ul>
                <p className="mt-2">Our calculator provides a personalized recommendation based on your body metrics and activity level.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                How does the step goal calculator work?
              </AccordionTrigger>
              <AccordionContent>
                Our calculator uses your age, gender, weight, height, and activity level to:
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                  <li>Calculate your Basal Metabolic Rate (BMR)</li>
                  <li>Determine your Total Daily Energy Expenditure (TDEE) based on activity level</li>
                  <li>Estimate an appropriate percentage of calories that should come from walking</li>
                  <li>Convert those calories into steps based on average calorie burn per step (approximately 0.05 calories per step)</li>
                </ol>
                <p className="mt-2">This provides a scientifically-backed step goal tailored to your unique physiology and lifestyle.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                How can I increase my daily steps?
              </AccordionTrigger>
              <AccordionContent>
                <p>Here are some practical ways to increase your daily step count:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Take a short walk during lunch breaks</li>
                  <li>Park farther away from entrances</li>
                  <li>Use stairs instead of elevators</li>
                  <li>Walk while talking on the phone</li>
                  <li>Set hourly reminders to stand up and move</li>
                  <li>Walk to nearby destinations instead of driving</li>
                  <li>Take a longer route when possible</li>
                  <li>Consider walking meetings at work</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                Are all steps equal, or do I need to walk faster?
              </AccordionTrigger>
              <AccordionContent>
                <p>The intensity of your walking does matter:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Casual steps</strong> (shopping, around the house) contribute to your overall total and are beneficial</li>
                  <li><strong>Brisk walking</strong> (3-4 mph) provides greater cardiovascular benefits</li>
                  <li><strong>Power walking</strong> (4-5+ mph) significantly increases calorie burn and fitness benefits</li>
                </ul>
                <p className="mt-2">For optimal health, aim for a mix of walking speeds with at least 30 minutes of moderate-intensity walking daily.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                What if I can't reach my step goal every day?
              </AccordionTrigger>
              <AccordionContent>
                <p>Don't worry if you can't meet your goal every single day. Consider these approaches:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Focus on weekly averages rather than daily goals</li>
                  <li>Start with lower targets and gradually increase</li>
                  <li>Compensate for low-step days with more active days when possible</li>
                  <li>Remember that any increase in physical activity is beneficial</li>
                </ul>
                <p className="mt-2">Consistency over time matters more than perfect adherence every day.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default StepCount;
