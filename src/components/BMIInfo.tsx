import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const BMIInfo = () => {
  return <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="text-white rounded-t-lg bg-gray-600">
        <CardTitle className="text-xl font-bold">What is BMI?</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="mb-4">
          Body Mass Index (BMI) is a numerical value calculated from your weight and height.
          It provides a simple way to classify weight categories that may lead to health problems.
        </p>
        
        <h3 className="font-bold text-lg mb-2">BMI Categories:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="text-blue-500 font-medium">Underweight: </span> Less than 18.5</li>
          <li><span className="text-green-500 font-medium">Normal weight: </span> 18.5 to 24.9</li>
          <li><span className="text-yellow-500 font-medium">Overweight: </span> 25 to 29.9</li>
          <li><span className="text-red-500 font-medium">Obesity: </span> 30 or greater</li>
        </ul>
        
        <p className="mt-4 text-sm text-gray-600">
          BMI doesn't directly measure body fat and doesn't account for factors like muscle mass, 
          bone density, or overall body composition. It's best used as a screening tool rather than 
          a diagnostic tool.
        </p>
      </CardContent>
    </Card>;
};
export default BMIInfo;