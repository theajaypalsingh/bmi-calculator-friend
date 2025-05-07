
import BodyFatCalculator from "@/components/BodyFatCalculator";

const BodyFat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-health-light">
      <header className="py-6 text-white bg-gray-700">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Body Fat Percentage Calculator</h1>
          <p className="text-center mt-2 text-health-light">Calculate your body fat using the U.S. Navy formula</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Calculate Your Body Fat Percentage</h2>
            <p className="text-center text-gray-700 max-w-2xl mx-auto">
              Use this calculator to estimate your body fat percentage using the U.S. Navy method. 
              This formula uses measurements of your height, neck, waist, and hip circumferences.
            </p>
          </div>
          
          <div className="flex justify-center">
            <BodyFatCalculator />
          </div>
          
          <div className="mt-12 max-w-3xl mx-auto">
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
        </div>
      </main>
    </div>
  );
};

export default BodyFat;
