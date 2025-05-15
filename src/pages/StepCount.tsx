
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowDownIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const stepCountSchema = z.object({
  height: z.coerce.number().min(100, "Height must be at least 100cm").max(250, "Height must be less than 250cm"),
  weight: z.coerce.number().min(30, "Weight must be at least 30kg").max(300, "Weight must be less than 300kg"),
  age: z.coerce.number().min(10, "Age must be at least 10 years").max(120, "Age must be less than 120 years"),
  gender: z.enum(["male", "female", "other"]),
  activityLevel: z.enum(["sedentary", "lightlyActive", "moderatelyActive", "veryActive", "superActive"]),
});

type StepCountFormValues = z.infer<typeof stepCountSchema>;

const activityLevelFactors = {
  sedentary: {
    factor: 1.2,
    stepPercent: 0.10,
    label: "Sedentary"
  },
  lightlyActive: {
    factor: 1.375,
    stepPercent: 0.15,
    label: "Lightly Active"
  },
  moderatelyActive: {
    factor: 1.55,
    stepPercent: 0.20,
    label: "Moderately Active"
  },
  veryActive: {
    factor: 1.725,
    stepPercent: 0.25,
    label: "Very Active"
  },
  superActive: {
    factor: 1.9,
    stepPercent: 0.30,
    label: "Super Active"
  }
};

const StepCount = () => {
  const [stepGoal, setStepGoal] = useState<number | null>(null);

  const form = useForm<StepCountFormValues>({
    resolver: zodResolver(stepCountSchema),
    defaultValues: {
      height: 170,
      weight: 70,
      age: 30,
      gender: "male",
      activityLevel: "moderatelyActive",
    },
  });

  const calculateStepGoal = (values: StepCountFormValues) => {
    // Calculate BMR using Mifflin-St Jeor formula
    let bmr = 0;
    if (values.gender === "male") {
      bmr = 10 * values.weight + 6.25 * values.height - 5 * values.age + 5;
    } else {
      bmr = 10 * values.weight + 6.25 * values.height - 5 * values.age - 161;
    }

    // Calculate TDEE (Total Daily Energy Expenditure)
    const activityFactor = activityLevelFactors[values.activityLevel].factor;
    const tdee = bmr * activityFactor;

    // Estimate step goal
    const stepPercent = activityLevelFactors[values.activityLevel].stepPercent;
    const caloriesForSteps = tdee * stepPercent;
    const caloriesPerStep = 0.05;
    
    // Calculate steps and round to nearest 100
    const steps = Math.round(caloriesForSteps / caloriesPerStep / 100) * 100;
    
    setStepGoal(steps);
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-white to-health-light pb-12">
      <header className="py-8 text-white bg-gradient-to-r from-gray-700 to-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-2 animate-fade-in">
            <span className="text-health-light">Step</span> Goal Calculator
          </h1>
          <p className="text-center text-lg text-health-light opacity-90">
            Calculate your personalized daily step goal
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Step Goal Calculator</CardTitle>
              <CardDescription>Enter your information to get a personalized daily step goal</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(calculateStepGoal)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Height in cm" {...field} />
                          </FormControl>
                          <FormMessage />
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
                            <Input type="number" placeholder="Weight in kg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age (years)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Age in years" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
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
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Physical Activity Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select activity level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sedentary">Sedentary</SelectItem>
                              <SelectItem value="lightlyActive">Lightly Active</SelectItem>
                              <SelectItem value="moderatelyActive">Moderately Active</SelectItem>
                              <SelectItem value="veryActive">Very Active</SelectItem>
                              <SelectItem value="superActive">Super Active</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="mx-auto max-w-40 block">Calculate</Button>
                </form>
              </Form>
              
              {stepGoal && (
                <div className="mt-8 text-center">
                  <div className="flex justify-center mb-4">
                    <ArrowDownIcon className="h-8 w-8 text-blue-500 animate-bounce" />
                  </div>
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <h2 className="text-2xl font-bold text-blue-700 mb-2">{stepGoal.toLocaleString()} steps/day</h2>
                    <p className="text-gray-700">
                      {stepGoal.toLocaleString()} steps/day is recommended based on your profile to 
                      maintain/improve your health.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">How we calculate your step goal</h3>
                <p className="text-sm text-gray-600 mb-2">
                  First, we calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor formula, which is based on your height, weight, age, and gender.
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Next, we determine your Total Daily Energy Expenditure (TDEE) by multiplying your BMR by an activity factor based on your physical activity level.
                </p>
                <p className="text-sm text-gray-600">
                  Finally, we estimate what percentage of your daily energy should come from walking based on your activity level, 
                  and convert this to steps using an average calorie burn of 0.05 calories per step.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* FAQ Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about step count goals</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How many steps should I aim for each day?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      The commonly cited goal of 10,000 steps per day is a good general target, but the ideal step count varies based on your age, weight, gender, and activity level. That's why our calculator provides a personalized recommendation. For health benefits, research suggests even 7,000-8,000 steps can be beneficial.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>What's the difference between activity levels?</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li><strong>Sedentary:</strong> Little to no regular exercise, desk job (eg: office worker with no exercise)</li>
                      <li><strong>Lightly Active:</strong> Light exercise 1-3 days per week (eg: casual walking)</li>
                      <li><strong>Moderately Active:</strong> Moderate exercise 3-5 days per week (eg: brisk walking, light sports)</li>
                      <li><strong>Very Active:</strong> Hard exercise 6-7 days per week (eg: running, swimming)</li>
                      <li><strong>Super Active:</strong> Very hard exercise, physical job or training twice a day (eg: professional athlete, construction worker)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>How are step goals calculated?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      Our calculator uses the Mifflin-St Jeor formula to estimate your Basal Metabolic Rate (BMR) based on your height, weight, age, and gender. Then it calculates your Total Daily Energy Expenditure (TDEE) by applying an activity factor. A portion of this energy expenditure is allocated to steps based on your activity level, which is converted to a step count using an average calorie burn of 0.05 calories per step.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Is walking 10,000 steps a day enough for weight loss?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      Walking 10,000 steps a day can burn approximately 300-500 extra calories, which can contribute to weight loss when combined with a balanced diet. However, for significant weight loss, you may need to combine increased step count with dietary changes and possibly other forms of exercise. The key is to create a calorie deficit (burning more calories than you consume).
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>How long does it take to walk 10,000 steps?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      For most people, 10,000 steps is approximately 5 miles (8 kilometers). At an average walking pace of 3 miles per hour, it would take about 1.5-2 hours of walking to reach 10,000 steps. However, your daily activities throughout the day also contribute to your step count—you don't need to do all your steps in one session.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>How can I increase my daily step count?</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Take the stairs instead of elevators or escalators</li>
                      <li>Park farther away from entrances when shopping</li>
                      <li>Take short walking breaks during work</li>
                      <li>Walk while talking on the phone</li>
                      <li>Get off public transportation one stop early</li>
                      <li>Walk your dog more often or for longer distances</li>
                      <li>Take a short walk after meals</li>
                      <li>Set reminders to move every hour</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StepCount;
