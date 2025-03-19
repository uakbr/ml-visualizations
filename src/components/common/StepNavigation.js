import React from 'react';

const StepNavigation = ({ step, maxSteps, animating, handleStepChange }) => {
  // Calculate percentage for progress bar based on current step
  const progressPercentage = ((step + 1) / (maxSteps + 1)) * 100;
  
  // Generate step buttons dynamically
  const renderStepButtons = () => {
    const buttons = [];
    for (let i = 0; i <= maxSteps; i++) {
      buttons.push(
        <button
          key={i}
          className={`step-button ${step === i ? 'step-active' : ''} ${animating ? 'animating' : ''}`}
          onClick={() => handleStepChange(i)}
          disabled={animating}
          aria-label={`Go to step ${i + 1}`}
          aria-current={step === i ? 'step' : false}
        >
          {i + 1}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="animation-progress" role="navigation" aria-label="Animation Steps">
      <div className="step-buttons-container">
        {renderStepButtons()}
      </div>
      
      <div className="progress-bar" aria-hidden="true">
        <div 
          className="progress-indicator" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="step-indicator">
        {animating && <div className="playing-indicator" aria-hidden="true"></div>}
        <span>
          Step <strong>{step + 1}</strong> of {maxSteps + 1}
          {animating && <span className="visually-hidden"> - Animation in progress</span>}
        </span>
      </div>

      <div className="step-controls">
        <button 
          className="step-control-btn"
          onClick={() => handleStepChange(0)}
          disabled={animating || step === 0}
          aria-label="Reset to first step"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="19 20 9 12 19 4 19 20"></polygon>
            <line x1="5" y1="19" x2="5" y2="5"></line>
          </svg>
        </button>
        
        <button 
          className="step-control-btn"
          onClick={() => handleStepChange(Math.max(0, step - 1))}
          disabled={animating || step === 0}
          aria-label="Previous step"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <button 
          className="step-control-btn play-btn"
          onClick={() => {
            // Automatically advance through all steps
            if (animating) return;
            
            const playAllSteps = (currentStep) => {
              if (currentStep > maxSteps) return;
              
              handleStepChange(currentStep);
              setTimeout(() => {
                playAllSteps(currentStep + 1);
              }, 1500); // Time between steps
            };
            
            playAllSteps(0);
          }}
          disabled={animating}
          aria-label="Play all steps"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </button>
        
        <button 
          className="step-control-btn"
          onClick={() => handleStepChange(Math.min(maxSteps, step + 1))}
          disabled={animating || step === maxSteps}
          aria-label="Next step"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        
        <button 
          className="step-control-btn"
          onClick={() => handleStepChange(maxSteps)}
          disabled={animating || step === maxSteps}
          aria-label="Go to last step"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4"></polygon>
            <line x1="19" y1="5" x2="19" y2="19"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StepNavigation;
