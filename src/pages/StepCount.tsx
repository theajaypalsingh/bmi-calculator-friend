
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

// Sample data - would come from user input in a real app
const initialData = [
  { day: "Mon", steps: 5234 },
  { day: "Tue", steps: 7290 },
  { day: "Wed", steps: 6120 },
  { day: "Thu", steps: 8340 },
  { day: "Fri", steps: 9230 },
  { day: "Sat", steps: 7891 },
  { day: "Sun", steps: 4932 },
];

const StepCount = () => {
  const [dailyGoal, setDailyGoal] = useState(8000);
  const [weeklyData, setWeeklyData] = useState(initialData);
  const [todaySteps, setTodaySteps] = useState(0);
  const { toast } = useToast();

  // Calculate average steps per day
  const avgSteps = Math.round(
    weeklyData.reduce((sum, day) => sum + day.steps, 0) / weeklyData.length
  );

  // Calculate total steps for the week
  const totalSteps = weeklyData.reduce((sum, day) => sum + day.steps, 0);

  // Calculate percentage of goal achieved today
  const goalPercentage = Math.min(Math.round((todaySteps / dailyGoal) * 100), 100);

  const handleAddSteps = () => {
    // Simulate adding steps (in a real app, this might come from a pedometer)
    const newSteps = todaySteps + Math.floor(Math.random() * 1000 + 500);
    setTodaySteps(newSteps);
    
    if (newSteps >= dailyGoal && todaySteps < dailyGoal) {
      toast({
        title: "Congratulations! 🎉",
        description: "You've reached your daily step goal!",
      });
    }
  };

  const handleGoalChange = (value: number[]) => {
    setDailyGoal(value[0]);
  };

  // Function to determine health status based on average steps
  const getHealthStatus = (steps: number) => {
    if (steps < 5000) return { text: "Sedentary", color: "text-red-500" };
    if (steps < 7500) return { text: "Low Active", color: "text-yellow-500" };
    if (steps < 10000) return { text: "Somewhat Active", color: "text-blue-500" };
    return { text: "Active", color: "text-green-500" };
  };

  const status = getHealthStatus(avgSteps);

  return (
    <div className="min-h-full bg-gradient-to-b from-white to-health-light pb-0">
      <header className="py-8 text-white bg-gradient-to-r from-gray-700 to-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-2 animate-fade-in">
            <span className="text-health-light">Step</span> Counter
          </h1>
          <p className="text-center text-lg text-health-light opacity-90">
            Track and analyze your daily steps
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {/* Today's progress */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Progress</CardTitle>
                <CardDescription>Track your steps toward today's goal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{goalPercentage}%</span>
                    </div>
                    <Progress value={goalPercentage} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="text-3xl font-bold">{todaySteps.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">steps taken</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-400">{dailyGoal.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">daily goal</p>
                    </div>
                  </div>
                  
                  <Button onClick={handleAddSteps} className="w-full">
                    + Add Steps
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Daily goal setting */}
            <Card>
              <CardHeader>
                <CardTitle>Set Your Daily Goal</CardTitle>
                <CardDescription>Adjust your target steps per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-center">
                      {dailyGoal.toLocaleString()} steps
                    </p>
                    <Slider
                      defaultValue={[dailyGoal]}
                      max={15000}
                      step={500}
                      min={3000}
                      onValueChange={handleGoalChange}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>3,000</span>
                      <span>15,000</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Expert Recommendation</h4>
                    <p className="text-sm text-gray-700">
                      Health experts generally recommend 8,000-10,000 steps per day for optimal health benefits.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Weekly overview */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Weekly Overview</CardTitle>
                  <CardDescription>Your step count for the past 7 days</CardDescription>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Status: <span className={status.color}>{status.text}</span></p>
                  <p className="text-sm text-muted-foreground">Avg: {avgSteps.toLocaleString()} steps/day</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} steps`, "Count"]} />
                    <ReferenceLine y={dailyGoal} stroke="#ff4757" strokeDasharray="3 3" label="Goal" />
                    <Bar dataKey="steps" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Steps This Week</p>
                    <p className="text-2xl font-bold">{totalSteps.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Estimated Calories</p>
                    <p className="text-2xl font-bold">{Math.round(totalSteps * 0.04).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Health benefits section */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Health Benefits of Walking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Physical Benefits</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Helps maintain a healthy weight</li>
                  <li>Strengthens bones and muscles</li>
                  <li>Improves cardiovascular fitness</li>
                  <li>Reduces risk of heart disease and stroke</li>
                  <li>Improves balance and coordination</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Mental Benefits</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Reduces stress and anxiety</li>
                  <li>Improves mood and mental well-being</li>
                  <li>Boosts energy levels</li>
                  <li>Enhances creativity and cognitive function</li>
                  <li>Improves sleep quality</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StepCount;
