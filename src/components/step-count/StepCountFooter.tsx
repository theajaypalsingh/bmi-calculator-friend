
import React from 'react';

const StepCountFooter: React.FC = () => {
  return (
    <div className="text-sm text-gray-500 space-y-2 w-full">
      <p className="text-center">
        Step goals are calculated based on your BMR, activity level, and estimated caloric needs.
        Note - There's no single universal formula to calculate "Ideal daily step count," 
        The above calculation is based on research from ACSM (American College of Sports Medicine) 
        and public health bodies like WHO and CDC.
      </p>
      <p className="text-center text-xs">
        Consult your healthcare provider before starting any new fitness program.
      </p>
    </div>
  );
};

export default StepCountFooter;
