
import BMICalculator from "@/components/BMICalculator";
import BMIInfo from "@/components/BMIInfo";
import BMIArticle from "@/components/BMIArticle";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Index = () => {
  return (
    <div className="min-h-full bg-gradient-to-b from-white to-health-light pb-12">
      <header className="py-8 text-white bg-gradient-to-r from-gray-700 to-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-2 animate-fade-in">
            <span className="text-health-light">BMI</span> Calculator
          </h1>
          <p className="text-center text-lg text-health-light opacity-90">
            Check your Body Mass Index quickly and easily
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero image */}
          <div className="mb-10 rounded-xl overflow-hidden shadow-xl">
            <AspectRatio ratio={16/5} className="bg-muted">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80" 
                alt="Healthy lifestyle" 
                className="object-cover w-full h-full rounded-xl"
              />
            </AspectRatio>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-3/5">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-[1.01] transition-transform">
                <BMICalculator />
              </div>
            </div>
            <div className="w-full md:w-2/5">
              <BMIInfo />
            </div>
          </div>
          <div className="mt-12 transform hover:scale-[1.01] transition-transform">
            <BMIArticle />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
