
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const BMIArticle = () => {
  return (
    <Card className="mt-12 max-w-4xl mx-auto">
      <CardContent className="prose prose-slate max-w-none p-6">
        <h1 className="text-3xl font-bold mb-6">Understanding BMI: Your Guide to a Healthy Weight</h1>
        
        <p className="lead text-lg text-gray-700 mb-6">
          Body Mass Index (BMI) is a widely used screening tool that helps assess whether someone is at a healthy weight for their height. While it's not a diagnostic tool, knowing your <Link to="/" className="text-blue-600 hover:text-blue-800">BMI</Link> can be a valuable first step in understanding your overall health status.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What is BMI and How is it Calculated?</h2>
        <p>
          <Link to="/" className="text-blue-600 hover:text-blue-800">BMI</Link> is calculated by dividing your weight in kilograms by your height in meters squared. While this may sound complex, modern <Link to="/" className="text-blue-600 hover:text-blue-800">BMI calculators</Link> make it simple to determine your body mass index instantly. The resulting number falls into one of these categories:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Underweight: BMI less than 18.5</li>
          <li>Normal weight: BMI between 18.5 and 24.9</li>
          <li>Overweight: BMI between 25 and 29.9</li>
          <li>Obese: BMI of 30 or greater</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Health Risks Associated with Being Overweight</h2>
        <p>
          Maintaining a healthy weight is crucial for overall wellbeing. When your <Link to="/" className="text-blue-600 hover:text-blue-800">BMI</Link> indicates you're overweight or obese, you may be at increased risk for several health conditions:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Type 2 diabetes</li>
          <li>Heart disease and high blood pressure</li>
          <li>Certain types of cancer</li>
          <li>Sleep apnea and breathing problems</li>
          <li>Osteoarthritis and joint problems</li>
          <li>Mental health issues like depression and anxiety</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Understanding BMI Limitations</h3>
        <p>
          While <Link to="/" className="text-blue-600 hover:text-blue-800">BMI</Link> is a useful screening tool, it's important to note that it doesn't:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Directly measure body fat</li>
          <li>Account for muscle mass</li>
          <li>Consider age, gender, or ethnicity</li>
          <li>Reflect fitness level</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Steps to Maintain a Healthy BMI</h2>
        <p>
          Achieving and maintaining a healthy weight involves several lifestyle factors:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Regular physical activity (aim for 150 minutes per week)</li>
          <li>Balanced, nutritious diet</li>
          <li>Adequate sleep (7-9 hours per night)</li>
          <li>Stress management</li>
          <li>Regular health check-ups</li>
        </ul>

        <div className="bg-blue-50 p-6 rounded-lg mt-8">
          <p className="text-lg font-semibold mb-2">Ready to Check Your BMI?</p>
          <p className="mb-4">
            Use our free <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">BMI Calculator</Link> to quickly determine your body mass index and get personalized recommendations for your health journey.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Calculate Your BMI Now
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BMIArticle;
