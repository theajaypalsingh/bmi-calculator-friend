
import React from 'react';

interface ResultDisplayProps {
  stepGoal: number;
  showResults: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ stepGoal, showResults }) => {
  if (!showResults) return null;
  
  return (
    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
      <p className="text-center font-medium">Your recommended daily step goal:</p>
      <p className="text-center text-2xl font-bold text-green-600">
        {stepGoal.toLocaleString()} steps/day
      </p>
      <p className="text-center text-sm text-gray-600 mt-2">
        {stepGoal.toLocaleString()} steps/day is recommended based on your profile to improve your health.
      </p>
    </div>
  );
};

export default ResultDisplay;
