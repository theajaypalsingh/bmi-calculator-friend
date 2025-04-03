import BMICalculator from "@/components/BMICalculator";
import BMIInfo from "@/components/BMIInfo";
const Index = () => {
  return <div className="min-h-screen bg-gradient-to-b from-white to-health-light">
      <header className="py-6 bg-health-primary text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">BMI Calculator</h1>
          <p className="text-center mt-2 text-health-light">Check your Body Mass Index quickly and easily</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-3/5">
              <BMICalculator />
            </div>
            <div className="w-full md:w-2/5">
              <BMIInfo />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-health-dark text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} BMI Calculator Friend. All rights reserved.</p>
          <p className="text-sm mt-2 text-health-light">This calculator provides general information and is not a substitute for professional medical advice.

Made by: Ajay Pal Singh Rajput (Fitelo)</p>
        </div>
      </footer>
    </div>;
};
export default Index;