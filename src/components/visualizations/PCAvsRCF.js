import React, { useState } from 'react';
import { generatePCAData } from '../../utils/dataGenerators';
import StepNavigation from '../common/StepNavigation';

const PCAvsRCF = ({ isMobile }) => {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const maxSteps = 3;
  
  // Get data from utility
  const data = generatePCAData();

  // Handle step navigation with animation
  const handleStepChange = (newStep) => {
    if (animating) return;
    
    setAnimating(true);
    setStep(newStep);
    
    // Reset animation state after transition
    setTimeout(() => {
      setAnimating(false);
    }, 500);
  };
  
  return (
    <div className="flex flex-col space-y-6">
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row justify-between items-center'}`}>
        <h2 className="text-xl font-semibold">PCA vs Random Cut Forests</h2>
        <StepNavigation 
          step={step}
          maxSteps={maxSteps}
          animating={animating}
          handleStepChange={handleStepChange}
          isMobile={isMobile}
        />
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 gap-8'}`}>
        {/* Left visualization for PCA */}
        <div className="flex flex-col items-center visualization-container">
          <h3 className="text-lg font-medium mb-2">Principal Component Analysis (PCA)</h3>
          <div className="border rounded p-4 w-full bg-gray-50 aspect-square"
               data-tooltip="Interactive visualization of Principal Component Analysis">
            <svg width="100%" height="100%" viewBox="0 0 100 100" 
                 preserveAspectRatio="xMidYMid meet"
                 aria-label="Principal Component Analysis visualization">
              {/* Plot all data points */}
              {data.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r={point.outlier ? 3 : 2}
                  fill={point.outlier ? "var(--danger-color)" : "var(--primary-color)"}
                  className="transition-all duration-300"
                  opacity={animating ? 0.7 : 1}
                />
              ))}
              
              {/* Show principal components */}
              {step >= 1 && (
                <>
                  <line 
                    x1="10" y1="10" x2="90" y2="70" 
                    stroke="var(--warning-color)" 
                    strokeWidth="2"
                    className={`transition-all duration-300 ${animating ? "animate-pulse" : ""}`}
                  />
                  {step >= 2 && 
                    <line 
                      x1="30" y1="70" x2="70" y2="30" 
                      stroke="var(--success-color)" 
                      strokeWidth="2"
                      className={`transition-all duration-300 ${animating ? "animate-pulse" : ""}`}
                    />
                  }
                </>
              )}
              
              {/* Show projection onto principal component */}
              {step >= 3 && data
                .filter(p => !p.outlier)
                .map((point, i) => {
                  // Calculate projection point on the first principal component
                  // This is a simplified approximation
                  const t = ((point.x - 10) * (90 - 10) + (point.y - 10) * (70 - 10)) / 
                          (Math.pow(90 - 10, 2) + Math.pow(70 - 10, 2));
                  
                  const projX = 10 + t * (90 - 10);
                  const projY = 10 + t * (70 - 10);
                  
                  return (
                    <g key={`proj-${i}`} className="transition-all duration-500">
                      <line 
                        x1={point.x} 
                        y1={point.y} 
                        x2={projX} 
                        y2={projY} 
                        stroke="#777" 
                        strokeWidth="0.5" 
                        strokeDasharray="2"
                        strokeOpacity={animating ? 0.3 : 0.6}
                      />
                      <circle 
                        cx={projX} 
                        cy={projY} 
                        r="2" 
                        fill="var(--warning-color)"
                        opacity={animating ? 0.7 : 1}
                      />
                    </g>
                  );
                })
              }
            </svg>
          </div>
          <div className="mt-4 text-sm text-gray-700 p-2 card min-h-[80px]">
            {step === 0 && "PCA starts with the raw data points. The goal is to find directions of maximum variance."}
            {step === 1 && "The first principal component (orange) captures the direction of maximum variance in the data."}
            {step === 2 && "The second principal component (green) is orthogonal to the first and captures remaining variance."}
            {step === 3 && "Data can be projected onto principal components, reducing dimensionality while preserving variance."}
          </div>
        </div>
        
        {/* Right visualization for Random Cut Forests */}
        <div className="flex flex-col items-center visualization-container">
          <h3 className="text-lg font-medium mb-2">Random Cut Forests</h3>
          <div className="border rounded p-4 w-full bg-gray-50 aspect-square"
               data-tooltip="Interactive visualization of Random Cut Forests algorithm">
            <svg width="100%" height="100%" viewBox="0 0 100 100" 
                 preserveAspectRatio="xMidYMid meet"
                 aria-label="Random Cut Forests visualization">
              {/* Plot all data points */}
              {data.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r={point.outlier ? 3 : 2}
                  fill={point.outlier ? "var(--danger-color)" : "var(--primary-color)"}
                  className="transition-all duration-300"
                  opacity={animating ? 0.7 : 1}
                />
              ))}
              
              {/* Show random cuts for RCF */}
              {step >= 1 && (
                <>
                  <line 
                    x1="0" y1="40" x2="100" y2="40" 
                    stroke="#777" 
                    strokeWidth="1" 
                    strokeDasharray="4"
                    className={animating ? "animate-pulse" : ""}
                  />
                  <line 
                    x1="50" y1="0" x2="50" y2="100" 
                    stroke="#777" 
                    strokeWidth="1" 
                    strokeDasharray="4"
                    className={animating ? "animate-pulse" : ""}
                  />
                </>
              )}
              
              {step >= 2 && (
                <>
                  <line 
                    x1="75" y1="40" x2="75" y2="100" 
                    stroke="#777" 
                    strokeWidth="1" 
                    strokeDasharray="4"
                    className={animating ? "animate-pulse" : ""}
                  />
                  <line 
                    x1="0" y1="70" x2="50" y2="70" 
                    stroke="#777" 
                    strokeWidth="1" 
                    strokeDasharray="4"
                    className={animating ? "animate-pulse" : ""}
                  />
                  <line 
                    x1="50" y1="20" x2="100" y2="20" 
                    stroke="#777" 
                    strokeWidth="1" 
                    strokeDasharray="4"
                    className={animating ? "animate-pulse" : ""}
                  />
                </>
              )}
              
              {step >= 3 && data
                .filter(p => p.outlier)
                .map((point, i) => (
                  <circle
                    key={`highlight-${i}`}
                    cx={point.x}
                    cy={point.y}
                    r={6}
                    fill="none"
                    stroke="var(--danger-color)"
                    strokeWidth="2"
                    className={`transition-all duration-500 ${animating ? "animate-pulse" : ""}`}
                  />
                ))
              }
            </svg>
          </div>
          <div className="mt-4 text-sm text-gray-700 p-2 card min-h-[80px]">
            {step === 0 && "Random Cut Forests begin with the raw data points and build multiple trees through random partitioning."}
            {step === 1 && "The algorithm makes random cuts to partition the space (not based on variance like PCA)."}
            {step === 2 && "It continues making random cuts, creating a forest of random decision trees."}
            {step === 3 && "Points that require fewer cuts to isolate (like outliers) are assigned higher anomaly scores."}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200 info-callout">
        <h3 className="font-semibold mb-2">Key Differences:</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Purpose:</strong> PCA focuses on <em>dimensionality reduction</em> by finding important features, while Random Cut Forests focus on <em>anomaly detection</em>.</li>
          <li><strong>Approach:</strong> PCA identifies directions of maximum variance, while RCF partitions the space randomly to isolate points.</li>
          <li><strong>Information Preservation:</strong> PCA preserves variance information, while RCF preserves isolation depth information.</li>
          <li><strong>Use Cases:</strong> PCA is used for feature extraction, visualization, and noise reduction; RCF is used primarily for detecting outliers and anomalies.</li>
        </ul>
      </div>
    </div>
  );
};

export default PCAvsRCF; 