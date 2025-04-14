import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Footprints, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const stepCountSchema = z.object({
  height: z.string().transform(val => Number(val)).refine(val => val > 0, {
    message: "Height must be greater than 0"
  }),
  weight: z.string().transform(val => Number(val)).refine(val => val > 0, {
    message: "Weight must be greater than 0"
  }),
  age: z.string().transform(val => Number(val)).refine(val => val > 0 && val < 120, {
    message: "Age must be between 1 and 120"
  }),
  gender: z.enum(["male", "female", "other"]),
  activityLevel: z.enum(["sedentary", "lightly", "moderately", "very", "super"])
});

type StepCountFormValues = z.infer<typeof stepCountSchema>;

const activityLevelFactors = {
  sedentary: {
    factor: 1.2,
    stepPercent: 0.10,
    label: "Sedentary"
  },
  lightly: {
    factor: 1.375,
    stepPercent: 0.15,
    label: "Lightly Active"
  },
  moderately: {
    factor: 1.55,
    stepPercent: 0.20,
    label: "Moderately Active"
  },
  very: {
    factor: 1.725,
    stepPercent: 0.25,
    label: "Very Active"
  },
  super: {
    factor: 1.9,
    stepPercent: 0.30,
    label: "Super Active"
  }
};

const calculateBMR = (height: number, weight: number, age: number, gender: string): number => {
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  if (gender === "male") {
    return baseBMR + 5;
  } else if (gender === "female") {
    return baseBMR - 161;
  } else {
    return baseBMR - 78;
  }
};

const calculateTDEE = (bmr: number, activityLevel: string): number => {
  return bmr * activityLevelFactors[activityLevel as keyof typeof activityLevelFactors].factor;
};

const calculateStepGoal = (tdee: number, activityLevel: string): number => {
  const stepPercent = activityLevelFactors[activityLevel as keyof typeof activityLevelFactors].stepPercent;
  const caloriesFromSteps = tdee * stepPercent;
  const steps = caloriesFromSteps / 0.05;
  return Math.round(steps / 100) * 100;
};

const StepCount = () => {
  const [stepGoal, setStepGoal] = useState<number | null>(null);

  const form = useForm<StepCountFormValues>({
    resolver: zodResolver(stepCountSchema),
    defaultValues: {
      height: "",
      weight: "",
      age: "",
      gender: "male",
      activityLevel: "moderately"
    }
  });

  useEffect(() => {
    const storedHeight = localStorage.getItem("height");
    const storedWeight = localStorage.getItem("weight");
    const storedAge = localStorage.getItem("age");
    const storedGender = localStorage.getItem("gender");
    const storedActivityLevel = localStorage.getItem("activityLevel");

    if (storedHeight) form.setValue("height", storedHeight);
    if (storedWeight) form.setValue("weight", storedWeight);
    if (storedAge) form.setValue("age", storedAge);
    if (storedGender && ["male", "female", "other"].includes(storedGender)) form.setValue("gender", storedGender as "male" | "female" | "other");
    if (storedActivityLevel && ["sedentary", "lightly", "moderately", "very", "super"].includes(storedActivityLevel)) form.setValue("activityLevel", storedActivityLevel as "sedentary" | "lightly" | "moderately" | "very" | "super");
  }, [form]);

  const onSubmit = (data: StepCountFormValues) => {
    const height = data.height;
    const weight = data.weight;
    const age = data.age;

    const bmr = calculateBMR(height, weight, age, data.gender);
    const tdee = calculateTDEE(bmr, data.activityLevel);
    const calculatedStepGoal = calculateStepGoal(tdee, data.activityLevel);
    setStepGoal(calculatedStepGoal);

    localStorage.setItem("height", height.toString());
    localStorage.setItem("weight", weight.toString());
    localStorage.setItem("age", age.toString());
    localStorage.setItem("gender", data.gender);
    localStorage.setItem("activityLevel", data.activityLevel);
  };

  return <div className="min-h-screen bg-gradient-to-b from-white to-health-light">
      <header className="py-6 text-white bg-gray-700">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Daily Step Count Calculator</h1>
          <p className="text-center mt-2 text-health-light">Find your personalized daily step goal</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Calculate Your Daily Step Goal</CardTitle>
              <CardDescription>
                Enter your personal information to get a customized step count recommendation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="height" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter height in cm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={form.control} name="weight" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter weight in kg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="age" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Age (years)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter age" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={form.control} name="gender" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                  
                  <FormField control={form.control} name="activityLevel" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Physical Activity Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                            <SelectItem value="lightly">Lightly Active (light exercise/sports 1-3 days/week)</SelectItem>
                            <SelectItem value="moderately">Moderately Active (moderate exercise/sports 3-5 days/week)</SelectItem>
                            <SelectItem value="very">Very Active (hard exercise/sports 6-7 days/week)</SelectItem>
                            <SelectItem value="super">Super Active (very hard exercise/sports & physical job)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the activity level that best describes your lifestyle
                        </FormDescription>
                        <FormMessage />
                      </FormItem>} />
                  
                  <div className="flex justify-center">
                    <Button 
                      type="submit" 
                      className="bg-red-700 hover:bg-red-600 text-white font-bold px-4 py-2"
                    >
                      <Footprints size={18} className="mr-2" />
                      Calculate Step Goal
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {stepGoal && <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-green-800">
                <CardTitle className="flex items-center text-2xl">
                  <Footprints size={24} className="mr-2" />
                  Your Recommended Daily Step Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-700 mb-3">{stepGoal.toLocaleString()} steps/day</p>
                  <p className="text-lg text-gray-700">
                    {stepGoal.toLocaleString()} steps/day is recommended based on your profile to maintain/improve your health.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-green-100 text-sm text-green-800">
                <p className="italic">
                  This calculation uses the Mifflin-St Jeor formula and takes into account your height, weight, age, gender, and activity level.
                </p>
              </CardFooter>
            </Card>}
        </div>
      </main>

      <footer className="text-white py-6 mt-12 bg-zinc-950">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Health Calculator. All rights reserved.</p>
        </div>
      </footer>
    </div>;
};

export default StepCount;
