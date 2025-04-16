import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateHealthScore, type HealthScoreInputs, calculateBMI } from "@/utils/healthScoreCalculator";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, CircleAlert, XCircle } from "lucide-react";
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
  waterIntake: z.number().min(0).max(10)
});
const HealthScore = () => {
  const [score, setScore] = React.useState<number | null>(null);
  const [recommendations, setRecommendations] = React.useState<string[]>([]);
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
      waterIntake: 2.5
    }
  });
  const generateRecommendations = (data: HealthScoreInputs): string[] => {
    const recommendations: string[] = [];
    if (data.sleepHours < 7 || data.sleepHours > 9) {
      recommendations.push("Try improving your sleep routine to 7–9 hrs/day.");
    }
    if (data.smokingHabit === "occasionalSmoker" || data.smokingHabit === "regularSmoker") {
      recommendations.push("Consider quitting smoking to drastically improve your long-term health.");
    }
    const bmi = calculateBMI(data.weight, data.height);
    if (bmi >= 25) {
      recommendations.push("Your BMI is above ideal range — work on balanced nutrition and daily movement.");
    }
    if (data.waterIntake < 2.5) {
      recommendations.push("Try to increase your water intake to at least 2.5 liters per day.");
    }
    if (data.stressLevel === "high") {
      recommendations.push("Consider stress management techniques like meditation or yoga.");
    }
    if (data.alcoholConsumption === "daily" || data.alcoholConsumption === "frequently") {
      recommendations.push("Reducing alcohol consumption will significantly improve your health score.");
    }
    if (data.activityLevel === "sedentary" || data.activityLevel === "lightlyActive") {
      recommendations.push("Increasing your physical activity to at least 3-5 days a week can greatly improve your health.");
    }
    if (data.eatingOutside === "daily" || data.eatingOutside === "twoToFourWeek") {
      recommendations.push("Try to reduce eating outside and prepare more home-cooked meals.");
    }
    return recommendations;
  };
  const getScoreCategory = (score: number) => {
    if (score >= 80) return {
      label: "Excellent",
      color: "bg-green-500",
      icon: <CheckCircle className="h-6 w-6 text-green-500" />
    };
    if (score >= 60) return {
      label: "Good, can be Improved",
      color: "bg-blue-500",
      icon: <CircleAlert className="h-6 w-6 text-blue-500" />
    };
    if (score >= 40) return {
      label: "Average",
      color: "bg-yellow-500",
      icon: <AlertCircle className="h-6 w-6 text-yellow-500" />
    };
    return {
      label: "Poor",
      color: "bg-red-500",
      icon: <XCircle className="h-6 w-6 text-red-500" />
    };
  };
  const onSubmit = (data: HealthScoreInputs) => {
    const healthScore = calculateHealthScore(data);
    setScore(healthScore);
    setRecommendations(generateRecommendations(data));
    toast.success("Health score calculated successfully!");
  };
  return <div className="min-h-screen bg-gradient-to-b from-white to-health-light">
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
                  <FormField control={form.control} name="age" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Age (years)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
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
                      </FormItem>} />

                  <FormField control={form.control} name="height" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                      </FormItem>} />

                  <FormField control={form.control} name="weight" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                      </FormItem>} />

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
                            <SelectItem value="sedentary">Sedentary (Little or no exercise)</SelectItem>
                            <SelectItem value="lightlyActive">Lightly Active (1-3 days/week)</SelectItem>
                            <SelectItem value="moderatelyActive">Moderately Active (3-5 days/week)</SelectItem>
                            <SelectItem value="veryActive">Very Active (6-7 days/week)</SelectItem>
                            <SelectItem value="superActive">Super Active (Daily intense training)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>} />

                  <FormField control={form.control} name="sleepHours" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Sleep Hours (0-12)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                      </FormItem>} />

                  <FormField control={form.control} name="smokingHabit" render={({
                  field
                }) => <FormItem>
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
                      </FormItem>} />

                  <FormField control={form.control} name="alcoholConsumption" render={({
                  field
                }) => <FormItem>
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
                      </FormItem>} />

                  <FormField control={form.control} name="stressLevel" render={({
                  field
                }) => <FormItem>
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
                      </FormItem>} />

                  <FormField control={form.control} name="eatingOutside" render={({
                  field
                }) => <FormItem>
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
                      </FormItem>} />

                  <FormField control={form.control} name="waterIntake" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Water Intake (liters/day)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                      </FormItem>} />
                </div>

                <Button type="submit" className="w-full md:w-1/2 block text-center bg-red-900 hover:bg-red-800 px-[14px] mx-px">Calculate Health Score</Button>

                {score !== null && <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-center">Your Health Score</h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      {getScoreCategory(score).icon}
                      <p className="text-3xl font-bold text-center">{score}/100</p>
                    </div>
                    <p className="text-center text-gray-600 mt-2">
                      {getScoreCategory(score).label}
                    </p>
                    
                    <div className="mt-4">
                      <Progress value={score} className="h-3 w-full" indicatorClassName={getScoreCategory(score).color} />
                    </div>
                    
                    {recommendations.length > 0 && <Alert className="mt-4">
                        <AlertTitle>Personalized Recommendations</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            {recommendations.map((rec, index) => <li key={index} className="text-sm">{rec}</li>)}
                          </ul>
                        </AlertDescription>
                      </Alert>}
                  </div>}
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>;
};
export default HealthScore;