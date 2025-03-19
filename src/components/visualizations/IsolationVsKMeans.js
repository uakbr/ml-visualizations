import React, { useState } from 'react';
import { generateClusterData } from '../../utils/dataGenerators';
import StepNavigation from '../common/StepNavigation';

const IsolationVsKMeans = ({ isMobile }) => {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const maxSteps = 3;
  
  // Get data from utility
  const data = generateClusterData();
  
  // Simulated k-means centroids (manually positioned for visual clarity)
  const kMeansCentroids = [
    { x: 20, y: 20 },
    { x: 45, y: 45 }
  ];

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
    <div className="visualization-module">
      <div className="visualization-header">
        <h2>Isolation Forests vs K-Means Clustering</h2>
        <StepNavigation 
          step={step}
          maxSteps={maxSteps}
          animating={animating}
          handleStepChange={handleStepChange}
        />
      </div>
      
      <div className="visualization-content-grid">
        {/* Left visualization for Isolation Forest */}
        <div className="bento-box">
          <h3>Isolation Forest</h3>
          <div className="visualization-canvas">
            <svg 
              viewBox="0 0 100 100" 
              preserveAspectRatio="xMidYMid meet"
              aria-label="Isolation Forest visualization"
            >
              {/* Plot all data points */}
              {data.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x * 1.6}
                  cy={point.y * 1.6}
                  r={point.type === 'outlier' ? 3 : 2}
                  fill={point.type === 'outlier' ? 'var(--danger-color)' : 'var(--primary-color)'}
                  className="transition-all duration-300"
                  opacity={animating ? 0.7 : 1}
                />
              ))}
              
              {/* Show recursive partitioning for isolation forest */}
              {step >= 1 && (
                <>
                  <line 
                    x1="30" y1="0" x2="30" y2="100" 
                    stroke="#777" 
                    strokeWidth="1" 
                    strokeDasharray="4"
                    className={animating ? "animate-pulse" : ""}
                  />
                  <line 
                    x1="0" y1="30" x2="100" y2="30" 
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
                    x1="60" y1="30" x2="60" y2="100" 
                    stroke="#777" 
                    strokeWidth="1" 
                    strokeDasharray="4"
                    className={animating ? "animate-pulse" : ""}
                  />
                  <line 
                    x1="30" y1="60" x2="100" y2="60" 
                    stroke="#777" 
                    strokeWidth="1" 
                    strokeDasharray="4"
                    className={animating ? "animate-pulse" : ""}
                  />
                </>
              )}
              
              {step >= 3 && data
                .filter(p => p.type === 'outlier')
                .map((point, i) => (
                  <circle
                    key={`highlight-${i}`}
                    cx={point.x * 1.6}
                    cy={point.y * 1.6}
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
          <div className="explanation-text">
            {step === 0 && "Isolation Forests start with the raw data points. Notice the outliers (red)."}
            {step === 1 && "The algorithm begins by randomly splitting the data space with vertical and horizontal cuts."}
            {step === 2 && "It continues splitting recursively, creating smaller and smaller partitions."}
            {step === 3 && "Outliers are identified as they require fewer splits to isolate (anomaly detection)."}
          </div>
        </div>
        
        {/* Right visualization for K-means */}
        <div className="bento-box">
          <h3>K-Means Clustering</h3>
          <div className="visualization-canvas">
            <svg
              viewBox="0 0 100 100" 
              preserveAspectRatio="xMidYMid meet"
              aria-label="K-Means Clustering visualization"
            >
              {/* Plot all data points */}
              {data.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x * 1.6}
                  cy={point.y * 1.6}
                  r={2}
                  fill={step < 3 ? "var(--primary-color)" : (
                    Math.sqrt(Math.pow(point.x - kMeansCentroids[0].x, 2) + Math.pow(point.y - kMeansCentroids[0].y, 2)) <
                    Math.sqrt(Math.pow(point.x - kMeansCentroids[1].x, 2) + Math.pow(point.y - kMeansCentroids[1].y, 2))
                      ? "#E57373" : "#64B5F6"
                  )}
                  className="transition-all duration-500"
                  opacity={animating ? 0.7 : 1}
                />
              ))}
              
              {/* Show centroids for k-means */}
              {step >= 1 && kMeansCentroids.map((centroid, i) => (
                <circle
                  key={`centroid-${i}`}
                  cx={centroid.x * 1.6}
                  cy={centroid.y * 1.6}
                  r={4}
                  fill="var(--warning-color)"
                  stroke="black"
                  strokeWidth="1"
                  className={`transition-all duration-300 ${animating ? "animate-pulse" : ""}`}
                />
              ))}
              
              {/* Show association with closest centroid */}
              {step >= 2 && (
                <>
                  {data.map((point, i) => {
                    // Find closest centroid
                    const dist1 = Math.sqrt(Math.pow(point.x - kMeansCentroids[0].x, 2) + Math.pow(point.y - kMeansCentroids[0].y, 2));
                    const dist2 = Math.sqrt(Math.pow(point.x - kMeansCentroids[1].x, 2) + Math.pow(point.y - kMeansCentroids[1].y, 2));
                    const closestCentroid = dist1 < dist2 ? 0 : 1;
                    
                    return (
                      <line
                        key={`line-${i}`}
                        x1={point.x * 1.6}
                        y1={point.y * 1.6}
                        x2={kMeansCentroids[closestCentroid].x * 1.6}
                        y2={kMeansCentroids[closestCentroid].y * 1.6}
                        stroke={closestCentroid === 0 ? "#E57373" : "#64B5F6"}
                        strokeWidth="0.5"
                        strokeOpacity={animating ? 0.1 : 0.3}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </>
              )}
            </svg>
          </div>
          <div className="explanation-text">
            {step === 0 && "K-Means starts with the raw data points. The goal is to group them into clusters."}
            {step === 1 && "The algorithm places K centroids (orange dots) in the data space (K=2 in this example)."}
            {step === 2 && "Each data point is assigned to its closest centroid, forming initial clusters."}
            {step === 3 && "Final clusters are formed. Notice that outliers are still assigned to clusters, not treated specially."}
          </div>
        </div>
      </div>
      
      <div className="info-section">
        <h3>Key Differences:</h3>
        <ul>
          <li><strong>Purpose:</strong> Isolation Forests focus on <em>anomaly detection</em> (finding outliers), while K-Means focuses on <em>clustering</em> (grouping similar points).</li>
          <li><strong>Approach:</strong> Isolation Forests recursively partition the space to isolate points, while K-Means groups points based on distance to centroids.</li>
          <li><strong>Outlier Handling:</strong> Isolation Forests specifically identify outliers, while K-Means assigns all points to clusters, including outliers.</li>
          <li><strong>Shapes:</strong> K-Means assumes globular clusters, while Isolation Forests make no assumptions about data distribution.</li>
        </ul>
      </div>
    </div>
  );
};

export default IsolationVsKMeans; 