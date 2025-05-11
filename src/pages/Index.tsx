
import BMICalculator from "@/components/BMICalculator";
import BMIInfo from "@/components/BMIInfo";
import BMIArticle from "@/components/BMIArticle";

const Index = () => {
  return (
    <div className="min-h-full bg-gradient-to-b from-white to-health-light pb-0">
      <header className="py-6 text-white bg-gray-700">
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
          <BMIArticle />
        </div>
      </main>
    </div>
  );
};

export default Index;
