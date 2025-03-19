import React, { useEffect } from 'react';

const StepNavigation = ({ step, maxSteps, animating, handleStepChange }) => {
  // Progress percentage calculation
  const progressPercentage = ((step + 1) / (maxSteps + 1)) * 100;
  
  // Auto-play effect - always runs automatically
  useEffect(() => {
    let interval;
    
    if (!animating) {
      interval = setInterval(() => {
        if (step === maxSteps) {
          // Loop back to the beginning when we reach the end
          handleStepChange(0);
        } else {
          // Move to next step
          handleStepChange(step + 1);
        }
      }, 3500); // Change steps every 3.5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, maxSteps, animating, handleStepChange]);

  // Get step description based on current step
  const getStepDescription = () => {
    if (step === 0) return "Initial Data";
    if (step === maxSteps) return "Final Result";
    return `Step ${step} of ${maxSteps}`;
  };

  return (
    <div className="animation-progress">
      {/* Progress bar */}
      <div className="progress-bar">
        <div 
          className="progress-indicator"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Progress labels */}
      <div className="progress-labels">
        <span>Start</span>
        <span>End</span>
      </div>
      
      {/* Current step indicator */}
      <div className="step-indicator">
        <div className="playing-indicator" />
        <span>{getStepDescription()}</span>
      </div>
    </div>
  );
};

export default StepNavigation; 