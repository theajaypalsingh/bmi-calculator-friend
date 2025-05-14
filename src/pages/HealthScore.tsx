
import HealthScoreCalculator from "@/components/HealthScoreCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HealthScore = () => {
  return (
    <div className="min-h-full bg-gradient-to-b from-white to-health-light pb-0">
      <header className="py-8 text-white bg-gradient-to-r from-gray-700 to-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-2 animate-fade-in">
            <span className="text-health-light">Health Score</span> Calculator
          </h1>
          <p className="text-center text-lg text-health-light opacity-90">
            Calculate your overall health score
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Tabs defaultValue="calculator" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calculator">Calculator</TabsTrigger>
                <TabsTrigger value="about">About Health Score</TabsTrigger>
              </TabsList>
              <TabsContent value="calculator" className="py-4">
                <HealthScoreCalculator />
              </TabsContent>
              <TabsContent value="about">
                <div className="space-y-4 py-4">
                  <h3 className="text-xl font-semibold">What is a Health Score?</h3>
                  <p>
                    A Health Score is a numerical representation of your overall health status based on various health markers.
                    It takes into account multiple factors including your BMI, activity level, nutrition, sleep quality, and more.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6">How is it calculated?</h3>
                  <p>
                    Our health score calculation considers the following factors:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Body Mass Index (BMI)</li>
                    <li>Activity level (steps per day)</li>
                    <li>Nutrition (fruit and vegetable intake)</li>
                    <li>Sleep duration</li>
                    <li>Smoking status</li>
                    <li>Alcohol consumption</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-6">Interpreting your score</h3>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <p className="font-medium">0-50: Needs Improvement</p>
                      <p className="text-sm mt-1">Consider making significant lifestyle changes.</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <p className="font-medium">51-70: Fair</p>
                      <p className="text-sm mt-1">On the right track, but room for improvement.</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <p className="font-medium">71-85: Good</p>
                      <p className="text-sm mt-1">Maintaining a healthy lifestyle.</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <p className="font-medium">86-100: Excellent</p>
                      <p className="text-sm mt-1">Optimal health practices.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HealthScore;
