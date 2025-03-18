import React, { useState, useEffect } from 'react';

// Main component for ML Visualizations
const MLVisualizations = () => {
  const [activeTab, setActiveTab] = useState('isolation-vs-kmeans');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="component-container flex flex-col w-full h-full p-4">
      {/* Tab Navigation */}
      <div className="tabs-container" role="tablist" aria-label="Machine Learning Algorithm Visualizations">
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'isolation-vs-kmeans' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('isolation-vs-kmeans')}
          role="tab"
          aria-selected={activeTab === 'isolation-vs-kmeans'}
          aria-controls="panel-isolation-vs-kmeans"
          id="tab-isolation-vs-kmeans"
        >
          <span className="font-medium">Isolation Forests vs K-Means</span>
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'pca-vs-rcf' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('pca-vs-rcf')}
          role="tab"
          aria-selected={activeTab === 'pca-vs-rcf'}
          aria-controls="panel-pca-vs-rcf"
          id="tab-pca-vs-rcf"
        >
          <span className="font-medium">PCA vs Random Cut Forests</span>
        </button>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow">
        {activeTab === 'isolation-vs-kmeans' ? (
          <div 
            role="tabpanel" 
            id="panel-isolation-vs-kmeans" 
            aria-labelledby="tab-isolation-vs-kmeans"
          >
            <IsolationVsKMeans isMobile={isMobile} />
          </div>
        ) : (
          <div 
            role="tabpanel" 
            id="panel-pca-vs-rcf" 
            aria-labelledby="tab-pca-vs-rcf"
          >
            <PCAvsRCF isMobile={isMobile} />
          </div>
        )}
      </div>
    </div>
  );
};

// Component for Isolation Forests vs K-means visualization
const IsolationVsKMeans = ({ isMobile }) => {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const maxSteps = 3;
  
  // Sample data generation - in a real scenario would be replaced with actual algorithms
  const generateData = () => {
    // Regular clusters
    const cluster1 = Array.from({ length: 30 }, () => ({
      x: Math.random() * 10 + 15,
      y: Math.random() * 10 + 15,
      type: 'normal'
    }));
    
    const cluster2 = Array.from({ length: 30 }, () => ({
      x: Math.random() * 10 + 40,
      y: Math.random() * 10 + 40,
      type: 'normal'
    }));
    
    // Outliers
    const outliers = [
      { x: 5, y: 5, type: 'outlier' },
      { x: 50, y: 10, type: 'outlier' },
      { x: 10, y: 45, type: 'outlier' },
      { x: 60, y: 60, type: 'outlier' }
    ];
    
    return [...cluster1, ...cluster2, ...outliers];
  };
  
  const data = generateData();
  
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
  
  // Progress bar calculation
  const progressPercentage = ((step + 1) / (maxSteps + 1)) * 100;
  
  return (
    <div className="flex flex-col space-y-6">
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row justify-between items-center'}`}>
        <h2 className="text-xl font-semibold">Isolation Forests vs K-Means Clustering</h2>
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
      <div className="w-full bg-gray-200 rounded-full h-2.5">
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
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 gap-8'}`}>
        {/* Left visualization for Isolation Forest */}
        <div className="flex flex-col items-center visualization-container">
          <h3 className="text-lg font-medium mb-2">Isolation Forest</h3>
          <div className="border rounded p-4 w-full bg-gray-50 aspect-square"
               data-tooltip="Interactive visualization of Isolation Forest algorithm">
            <svg width="100%" height="100%" viewBox="0 0 100 100" 
                 preserveAspectRatio="xMidYMid meet"
                 aria-label="Isolation Forest visualization">
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
          <div className="mt-4 text-sm text-gray-700 p-2 card min-h-[80px]">
            {step === 0 && "Isolation Forests start with the raw data points. Notice the outliers (red)."}
            {step === 1 && "The algorithm begins by randomly splitting the data space with vertical and horizontal cuts."}
            {step === 2 && "It continues splitting recursively, creating smaller and smaller partitions."}
            {step === 3 && "Outliers are identified as they require fewer splits to isolate (anomaly detection)."}
          </div>
        </div>
        
        {/* Right visualization for K-means */}
        <div className="flex flex-col items-center visualization-container">
          <h3 className="text-lg font-medium mb-2">K-Means Clustering</h3>
          <div className="border rounded p-4 w-full bg-gray-50 aspect-square"
               data-tooltip="Interactive visualization of K-Means clustering algorithm">
            <svg width="100%" height="100%" viewBox="0 0 100 100" 
                 preserveAspectRatio="xMidYMid meet"
                 aria-label="K-Means Clustering visualization">
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
              
              {/* Show final clusters - now handled by the point color transition above */}
            </svg>
          </div>
          <div className="mt-4 text-sm text-gray-700 p-2 card min-h-[80px]">
            {step === 0 && "K-Means starts with the raw data points. The goal is to group them into clusters."}
            {step === 1 && "The algorithm places K centroids (orange dots) in the data space (K=2 in this example)."}
            {step === 2 && "Each data point is assigned to its closest centroid, forming initial clusters."}
            {step === 3 && "Final clusters are formed. Notice that outliers are still assigned to clusters, not treated specially."}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200 info-callout">
        <h3 className="font-semibold mb-2">Key Differences:</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Purpose:</strong> Isolation Forests focus on <em>anomaly detection</em> (finding outliers), while K-Means focuses on <em>clustering</em> (grouping similar points).</li>
          <li><strong>Approach:</strong> Isolation Forests recursively partition the space to isolate points, while K-Means groups points based on distance to centroids.</li>
          <li><strong>Outlier Handling:</strong> Isolation Forests specifically identify outliers, while K-Means assigns all points to clusters, including outliers.</li>
          <li><strong>Shapes:</strong> K-Means assumes globular clusters, while Isolation Forests make no assumptions about data distribution.</li>
        </ul>
      </div>
    </div>
  );
};

// Component for PCA vs Random Cut Forests visualization
const PCAvsRCF = ({ isMobile }) => {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const maxSteps = 3;
  
  // Generate 2D data with a clear principal component
  const generateData = () => {
    const points = [];
    // Generate points along a diagonal with some noise
    for (let i = 0; i < 40; i++) {
      const x = i * 2 + Math.random() * 10 - 5;
      const y = i * 1.5 + Math.random() * 10 - 5;
      points.push({ x, y });
    }
    
    // Add some outliers
    points.push({ x: 20, y: 70, outlier: true });
    points.push({ x: 70, y: 20, outlier: true });
    points.push({ x: 90, y: 90, outlier: true });
    
    return points;
  };
  
  const data = generateData();

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
  
  // Progress bar calculation
  const progressPercentage = ((step + 1) / (maxSteps + 1)) * 100;

  return (
    <div className="flex flex-col space-y-6">
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row justify-between items-center'}`}>
        <h2 className="text-xl font-semibold">PCA vs Random Cut Forests</h2>
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
      <div className="w-full bg-gray-200 rounded-full h-2.5">
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

export default MLVisualizations;
