
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateHealthScore, type HealthScoreInputs } from "@/utils/healthScoreCalculator";
import { toast } from "sonner";

const formSchema = z.object({
  age: z.number().min(1).max(120),
  gender: z.enum(["male", "female", "other"]),
  height: z.number().min(1).max(300),
  weight: z.number().min(1).max(500),
  activityLevel: z.enum(["sedentary", "lightlyActive", "moderatelyActive", "veryActive", "superActive"]),
  sleepHours: z.number().min(0).max(12),
  smokingHabit: z.enum(["nonSmoker", "occasionalSmoker", "regularSmoker"]),
  alcoholConsumption: z.enum(["never", "occasionally", "weekly", "frequently", "daily"]),
  stressLevel: z.enum(["low", "moderate", "high"]),
  eatingOutside: z.enum(["rarely", "onceWeek", "twoToFourWeek", "daily"]),
  waterIntake: z.number().min(0).max(10),
});

const HealthScore = () => {
  const [score, setScore] = React.useState<number | null>(null);

  const form = useForm<HealthScoreInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 25,
      gender: "male",
      height: 170,
      weight: 70,
      activityLevel: "moderatelyActive",
      sleepHours: 8,
      smokingHabit: "nonSmoker",
      alcoholConsumption: "never",
      stressLevel: "low",
      eatingOutside: "rarely",
      waterIntake: 2.5,
    },
  });

  const onSubmit = (data: HealthScoreInputs) => {
    const healthScore = calculateHealthScore(data);
    setScore(healthScore);
    toast.success("Health score calculated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-health-light">
      <header className="py-6 text-white bg-gray-700">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Health Score</h1>
          <p className="text-center mt-2 text-health-light">Calculate your overall health score</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Health Score Calculator</h2>
            <p className="text-gray-600">Fill in your details to calculate your health score</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (years)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="activityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Physical Activity Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary (Little or no exercise)</SelectItem>
                            <SelectItem value="lightlyActive">Lightly Active (1-3 days/week)</SelectItem>
                            <SelectItem value="moderatelyActive">Moderately Active (3-5 days/week)</SelectItem>
                            <SelectItem value="veryActive">Very Active (6-7 days/week)</SelectItem>
                            <SelectItem value="superActive">Super Active (Daily intense training)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sleepHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sleep Hours (0-12)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="smokingHabit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Smoking Habit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select smoking habit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="nonSmoker">Non-smoker</SelectItem>
                            <SelectItem value="occasionalSmoker">Occasional smoker</SelectItem>
                            <SelectItem value="regularSmoker">Regular smoker</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alcoholConsumption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alcohol Consumption</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select alcohol consumption" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="never">Never</SelectItem>
                            <SelectItem value="occasionally">Occasionally (1-2 times/month)</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="frequently">Frequently (2-4 times/week)</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stressLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stress Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select stress level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eatingOutside"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Eating Outside Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select eating frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="rarely">Rarely</SelectItem>
                            <SelectItem value="onceWeek">Once a week</SelectItem>
                            <SelectItem value="twoToFourWeek">2-4 times/week</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="waterIntake"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Water Intake (liters/day)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">Calculate Health Score</Button>

                {score !== null && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-center">Your Health Score</h3>
                    <p className="text-3xl font-bold text-center text-green-600 mt-2">{score}/90</p>
                    <p className="text-center text-gray-600 mt-2">
                      {score >= 80 ? "Excellent health! Keep it up!" :
                       score >= 60 ? "Good health. Room for improvement." :
                       "Consider making lifestyle changes for better health."}
                    </p>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HealthScore;
