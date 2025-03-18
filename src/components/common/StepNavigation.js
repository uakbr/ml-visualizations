import React from 'react';

const StepNavigation = ({ step, maxSteps, animating, handleStepChange, isMobile }) => {
  // Progress bar calculation
  const progressPercentage = ((step + 1) / (maxSteps + 1)) * 100;

  return (
    <>
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row justify-between items-center'}`}>
        <div className={`${isMobile ? 'flex justify-between' : 'space-x-2'}`}>
          <button 
            className="px-3 py-1 bg-gray-200 rounded"
            onClick={() => handleStepChange(Math.max(0, step - 1))}
            disabled={step === 0 || animating}
            aria-label="Previous step"
          >
            <span aria-hidden="true">←</span> Previous
          </button>
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => handleStepChange(Math.min(maxSteps, step + 1))}
            disabled={step === maxSteps || animating}
            aria-label="Next step"
          >
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin="1"
          aria-valuemax={maxSteps + 1}
          aria-label={`Step ${step + 1} of ${maxSteps + 1}`}
        ></div>
      </div>
    </>
  );
};

export default StepNavigation; 