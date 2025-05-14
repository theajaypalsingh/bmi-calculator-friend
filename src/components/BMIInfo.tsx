
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BMIInfo = () => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-health-primary">
      <CardHeader className="text-white rounded-t-lg bg-gradient-to-r from-gray-800 to-gray-700 mx-0 my-0 py-[22px]">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info text-health-light">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          What is BMI?
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="mb-4">
          Body Mass Index (BMI) is a numerical value calculated from your weight and height.
          It provides a simple way to classify weight categories that may lead to health problems.
        </p>
        
        <h3 className="font-bold text-lg mb-2">BMI Categories:</h3>
        <ul className="list-none pl-0 space-y-2">
          <li className="p-2 bg-blue-50 rounded-md border-l-4 border-blue-500">
            <span className="text-blue-500 font-medium">Underweight: </span> 
            <span className="text-gray-700">Less than 18.5</span>
          </li>
          <li className="p-2 bg-green-50 rounded-md border-l-4 border-green-500">
            <span className="text-green-500 font-medium">Normal weight: </span> 
            <span className="text-gray-700">18.5 to 24.9</span>
          </li>
          <li className="p-2 bg-yellow-50 rounded-md border-l-4 border-yellow-500">
            <span className="text-yellow-500 font-medium">Overweight: </span> 
            <span className="text-gray-700">25 to 29.9</span>
          </li>
          <li className="p-2 bg-red-50 rounded-md border-l-4 border-red-500">
            <span className="text-red-500 font-medium">Obesity: </span> 
            <span className="text-gray-700">30 or greater</span>
          </li>
        </ul>
        
        <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          BMI doesn't directly measure body fat and doesn't account for factors like muscle mass, 
          bone density, or overall body composition. It's best used as a screening tool rather than 
          a diagnostic tool.
        </p>
      </CardContent>
    </Card>
  );
};

export default BMIInfo;
