import HealthScoreCalculator from "@/components/HealthScoreCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Info, Calculator } from "lucide-react";
const HealthScore = () => {
  return <div className="min-h-full bg-gradient-to-b from-white to-health-light pb-12">
      <header className="py-10 text-white bg-gradient-to-r from-gray-700 to-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-3 animate-fade-in">
            <span className="text-health-light">Health Score</span> Calculator
          </h1>
          <p className="text-center text-lg text-health-light opacity-90 max-w-2xl mx-auto">
            Calculate your overall health score based on lifestyle factors, habits, and medical conditions
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Tabs defaultValue="calculator" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-2 bg-gray-50">
                <TabsTrigger value="calculator" className="flex items-center gap-2 py-3">
                  <Calculator size={18} />
                  <span>Calculator</span>
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2 py-3">
                  <Info size={18} />
                  <span>About Health Score</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="calculator" className="p-6">
                <HealthScoreCalculator />
              </TabsContent>
              
              <TabsContent value="about" className="p-6">
                <div className="space-y-6">
                  <section>
                    <h3 className="text-2xl font-semibold mb-3 text-gray-800">What is a Health Score?</h3>
                    <p className="text-gray-600">
                      A Health Score is a numerical representation of your overall health status based on various health markers.
                      It takes into account multiple factors including your BMI, activity level, nutrition, sleep quality, and more.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-2xl font-semibold mb-3 text-gray-800">How is it calculated?</h3>
                    <p className="text-gray-600 mb-4">
                      Our health score calculation considers the following factors:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-3">
                        <BarChart3 className="text-blue-500" size={20} />
                        <span>Body Mass Index (BMI)</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-3">
                        <BarChart3 className="text-blue-500" size={20} />
                        <span>Activity level (steps per day)</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-3">
                        <BarChart3 className="text-blue-500" size={20} />
                        <span>Nutrition (fruit and vegetable intake)</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-3">
                        <BarChart3 className="text-blue-500" size={20} />
                        <span>Sleep duration</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-3">
                        <BarChart3 className="text-blue-500" size={20} />
                        <span>Smoking status</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-3">
                        <BarChart3 className="text-blue-500" size={20} />
                        <span>Alcohol consumption</span>
                      </div>
                    </div>
                  </section>
                  
                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">Interpreting your score</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-red-100 rounded-lg border border-red-200 transition-transform hover:scale-105">
                        <h4 className="font-bold text-lg text-red-800">0-50: Needs Improvement</h4>
                        <p className="text-red-700 mt-2">Consider making significant lifestyle changes to improve your health metrics.</p>
                      </div>
                      <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-200 transition-transform hover:scale-105">
                        <h4 className="font-bold text-lg text-yellow-800">51-70: Fair</h4>
                        <p className="text-yellow-700 mt-2">You're on the right track, but there's still room for improvement in key health areas.</p>
                      </div>
                      <div className="p-4 bg-blue-100 rounded-lg border border-blue-200 transition-transform hover:scale-105">
                        <h4 className="font-bold text-lg text-blue-800">71-85: Good</h4>
                        <p className="text-blue-700 mt-2">You're maintaining a healthy lifestyle with good habits. Keep it up!</p>
                      </div>
                      <div className="p-4 bg-green-100 rounded-lg border border-green-200 transition-transform hover:scale-105">
                        <h4 className="font-bold text-lg text-green-800">86-100: Excellent</h4>
                        <p className="text-green-700 mt-2">You're practicing optimal health habits. An excellent example of wellness!</p>
                      </div>
                    </div>
                  </section>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>;
};
export default HealthScore;