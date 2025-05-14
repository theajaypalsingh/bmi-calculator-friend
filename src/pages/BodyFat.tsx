
import BodyFatCalculator from "@/components/BodyFatCalculator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Ruler } from "lucide-react";

const BodyFat = () => {
  return (
    <div className="min-h-full bg-gradient-to-b from-white to-health-light pb-0">
      <header className="py-8 text-white bg-gradient-to-r from-gray-700 to-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-2 animate-fade-in">
            <span className="text-health-light">Body Fat</span> Calculator
          </h1>
          <p className="text-center text-lg text-health-light opacity-90">
            Calculate your body fat using the U.S. Navy formula
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Image added below the heading */}
          <div className="mb-8">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/measuring-waist.jpg" 
                alt="Woman measuring waist circumference" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1605296867424-35fc98e937a7?q=80&w=2070";
                }}
              />
            </div>
            <p className="text-center text-gray-700 mt-4">
              This formula uses measurements of your height, neck, waist, and hip circumferences
            </p>
          </div>
          
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Calculate Your Body Fat Percentage</h2>
                <p className="text-gray-700 mb-6">
                  Use this calculator to estimate your body fat percentage using the U.S. Navy method. 
                  This formula uses measurements of your height, neck, waist, and hip circumferences for accurate results.
                </p>
                <div className="flex items-center mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Ruler className="h-8 w-8 text-health-primary mr-4 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Pro tip:</span> For most accurate results, take measurements in the morning before eating and after using the bathroom. Stand relaxed when measuring.
                  </p>
                </div>
              </div>
              
              <div className="order-1 md:order-2">
                <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.01] transition-transform duration-300">
                  <img 
                    src="/measurement.jpg" 
                    alt="Woman measuring waist circumference" 
                    className="w-full h-auto object-cover rounded-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1605296867424-35fc98e937a7?q=80&w=2070";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mb-12">
            <Card className="w-full border-0 shadow-health">
              <CardContent className="p-0">
                <BodyFatCalculator />
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-3">About Body Fat Percentage</h3>
            <div className="prose prose-blue max-w-none">
              <p>
                Body fat percentage is a key indicator of health and fitness. It represents the proportion of fat tissue versus lean tissue (muscle, bone, organs, etc.) in your body.
              </p>
              <p>
                The U.S. Navy Method estimates body fat percentage using circumference measurements from specific body parts. While not as precise as methods like DEXA scans or hydrostatic weighing, it provides a reasonably accurate estimate for most individuals.
              </p>
              <h4 className="text-lg font-medium mt-4">How to take measurements:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Neck:</strong> Measure around the neck, just below the larynx (Adam's apple), keeping the tape perpendicular to the long axis of the neck.</li>
                <li><strong>Waist:</strong> Measure at the level of the navel while standing relaxed (not sucking in).</li>
                <li><strong>Hips:</strong> (Women only) Measure around the widest part of the hips.</li>
              </ul>
              <h4 className="text-lg font-medium mt-4">Body Fat Categories:</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Category</th>
                      <th className="border border-gray-300 px-4 py-2">Men</th>
                      <th className="border border-gray-300 px-4 py-2">Women</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Essential Fat</td>
                      <td className="border border-gray-300 px-4 py-2">2-5%</td>
                      <td className="border border-gray-300 px-4 py-2">10-13%</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">Athletic</td>
                      <td className="border border-gray-300 px-4 py-2">6-13%</td>
                      <td className="border border-gray-300 px-4 py-2">14-20%</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Fitness</td>
                      <td className="border border-gray-300 px-4 py-2">14-17%</td>
                      <td className="border border-gray-300 px-4 py-2">21-24%</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">Average</td>
                      <td className="border border-gray-300 px-4 py-2">18-24%</td>
                      <td className="border border-gray-300 px-4 py-2">25-31%</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Obese</td>
                      <td className="border border-gray-300 px-4 py-2">25%+</td>
                      <td className="border border-gray-300 px-4 py-2">32%+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-2xl font-semibold mb-5 text-center">Frequently Asked Questions</h3>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">
                  How accurate is the U.S. Navy body fat calculation method?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    The U.S. Navy method is considered reasonably accurate for most people with an error margin of 3-4%. It tends to be more accurate for those with average body compositions. However, it may be less accurate for individuals with very athletic builds or those with obesity. For the most accurate measurements, methods like DEXA scans, hydrostatic weighing, or air displacement plethysmography (Bod Pod) are recommended.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">
                  How often should I measure my body fat percentage?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    For most people, measuring body fat once every 4-8 weeks is sufficient to track changes. Body fat percentage doesn't change dramatically day-to-day or even week-to-week. Measuring too frequently might lead to frustration as changes may not be noticeable in short periods. Consistency in measurement conditions (time of day, hydration status, etc.) is more important than frequency.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">
                  Why is my body fat calculation showing an error?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    Errors in calculation typically occur when there's an issue with the input measurements. Common problems include:
                    <ul className="list-disc ml-5 mt-2">
                      <li>Waist measurement smaller than or equal to neck measurement (for males)</li>
                      <li>Sum of waist and hip measurements less than or equal to neck measurement (for females)</li>
                      <li>Entering zero or negative values</li>
                      <li>Using incorrect units (mixing cm and inches)</li>
                    </ul>
                    Double-check your measurements and make sure they're entered correctly.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">
                  What is the difference between BMI and body fat percentage?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    BMI (Body Mass Index) is simply a ratio of weight to height and doesn't differentiate between fat, muscle, bone, or other tissues. Body fat percentage, on the other hand, specifically measures the proportion of fat mass to total body mass. This makes body fat percentage a more accurate indicator of health and fitness, especially for athletes or muscular individuals who may have a high BMI but low body fat.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-medium">
                  How can I reduce my body fat percentage safely?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    To reduce body fat percentage safely:
                    <ul className="list-disc ml-5 mt-2">
                      <li>Create a moderate calorie deficit (250-500 calories below maintenance)</li>
                      <li>Increase protein intake to preserve muscle mass (0.8-1g per pound of body weight)</li>
                      <li>Incorporate strength training 2-4 times per week</li>
                      <li>Include cardiovascular exercise for heart health and additional calorie burn</li>
                      <li>Ensure adequate sleep (7-9 hours)</li>
                      <li>Manage stress levels</li>
                      <li>Stay hydrated</li>
                      <li>Aim for a sustainable rate of fat loss (0.5-1% of body weight per week)</li>
                    </ul>
                    Always consult with healthcare professionals before starting any new diet or exercise program.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left font-medium">
                  Is there an "ideal" body fat percentage?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    There's no one-size-fits-all "ideal" body fat percentage, as optimal levels vary based on age, gender, fitness goals, and individual health factors. However, general health-optimal ranges are:
                    <ul className="list-disc ml-5 mt-2">
                      <li>Men: 10-20% (with 2-5% being essential fat)</li>
                      <li>Women: 18-28% (with 10-13% being essential fat)</li>
                    </ul>
                    Athletes might maintain lower percentages, while slightly higher percentages may be perfectly healthy for many individuals, especially as they age. Very low body fat percentages (below essential levels) can lead to health problems and hormonal disruptions.
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

export default BodyFat;
