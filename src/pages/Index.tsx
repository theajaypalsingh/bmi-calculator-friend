
import BMICalculator from "@/components/BMICalculator";
import BMIInfo from "@/components/BMIInfo";
import BMIArticle from "@/components/BMIArticle";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
          
          {/* FAQ Section - moved down just above the footer */}
          <div className="mt-12 mb-12 bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-[1.01] transition-transform">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">
                  What is BMI and how is it calculated?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    BMI (Body Mass Index) is a numerical value calculated from your weight and height. 
                    The formula is BMI = weight(kg) / height²(m²). It's used to categorize a person 
                    as underweight, normal weight, overweight, or obese based on tissue mass (muscle, fat, and bone).
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">
                  Is BMI accurate for everyone?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    BMI is a useful screening tool, but it has limitations. It doesn't directly measure body fat 
                    and doesn't account for factors like muscle mass, bone density, or distribution of fat. 
                    Athletes with high muscle mass may have higher BMIs despite low body fat. Similarly, 
                    elderly individuals might have lower BMIs despite having less muscle mass.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">
                  What are the BMI categories?
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    <li>Below 18.5: Underweight</li>
                    <li>18.5 to 24.9: Normal weight</li>
                    <li>25.0 to 29.9: Overweight</li>
                    <li>30.0 and above: Obesity</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">
                  How often should I check my BMI?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    There's no strict rule on how often to check your BMI. For most adults, checking once 
                    or twice a year is sufficient unless you're actively trying to lose or gain weight. 
                    In that case, checking every few months might help track your progress, but remember 
                    that daily or weekly fluctuations are normal and not always meaningful.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-medium">
                  Can children use adult BMI calculators?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    No, children and teens should not use adult BMI calculators. For individuals aged 2-20, 
                    BMI is age and sex-specific and is often referred to as "BMI-for-age." Growth patterns 
                    differ between boys and girls, and children's body composition changes as they grow. 
                    Special BMI calculators for children take these factors into account.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left font-medium">
                  What should I do if my BMI indicates I'm overweight or obese?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    If your BMI indicates you're overweight or obese, consider consulting with a healthcare 
                    professional. They can provide a more comprehensive assessment of your health, including 
                    additional measurements and tests. They may recommend lifestyle changes such as improved 
                    diet, increased physical activity, or in some cases, medical interventions. Remember that 
                    BMI is just one health indicator and should be considered alongside other factors.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
