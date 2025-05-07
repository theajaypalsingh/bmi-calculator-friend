
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import PageHeader from '@/components/PageHeader';
import StepCountForm, { FormData } from '@/components/step-count/StepCountForm';
import ResultDisplay from '@/components/step-count/ResultDisplay';
import StepCountFooter from '@/components/step-count/StepCountFooter';
import { calculateStepGoal } from '@/utils/stepCountCalculator';

const StepCount: React.FC = () => {
  const [stepGoal, setStepGoal] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);

  const onSubmit = (data: FormData) => {
    const calculatedStepGoal = calculateStepGoal(data);
    setStepGoal(calculatedStepGoal);
    setShowResults(true);
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <PageHeader 
        title="Daily Step Goal Calculator" 
        description="Find your optimal daily step target" 
      />
      
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-white rounded-t-lg bg-gray-700">
        </CardHeader>
        
        <CardContent className="pt-6 pb-4">
          <StepCountForm onSubmit={onSubmit} />
          <ResultDisplay stepGoal={stepGoal} showResults={showResults} />
        </CardContent>
        
        <CardFooter className="border-t px-6 py-4">
          <StepCountFooter />
        </CardFooter>
      </Card>
    </div>
  );
};

export default StepCount;
