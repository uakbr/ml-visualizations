import React, { useState } from 'react';

const MLVisualizations = () => {
  const [activeTab, setActiveTab] = useState('isolation-vs-kmeans');
  
  return (
    <div className="flex flex-col w-full h-full bg-gray-50 rounded-lg shadow p-4">
      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-4">
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'isolation-vs-kmeans' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('isolation-vs-kmeans')}
        >
          Isolation Forests vs K-Means
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'pca-vs-rcf' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('pca-vs-rcf')}
        >
          PCA vs Random Cut Forests
        </button>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow">
        {activeTab === 'isolation-vs-kmeans' ? (
          <IsolationVsKMeans />
        ) : (
          <PCAvsRCF />
        )}
      </div>
    </div>
  );
};

// Component for Isolation Forests vs K-means visualization
const IsolationVsKMeans = () => {
  const [step, setStep] = useState(0);
  
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
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Isolation Forests vs K-Means Clustering</h2>
        <div className="space-x-2">
          <button 
            className="px-3 py-1 bg-gray-200 rounded"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            Previous
          </button>
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => setStep(Math.min(3, step + 1))}
            disabled={step === 3}
          >
            Next
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Left visualization for Isolation Forest */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-medium mb-2">Isolation Forest</h3>
          <div className="border rounded p-4 w-full bg-gray-50 aspect-square">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Plot all data points */}
              {data.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x * 1.6}
                  cy={point.y * 1.6}
                  r={point.type === 'outlier' ? 3 : 2}
                  fill={point.type === 'outlier' ? 'red' : 'steelblue'}
                />
              ))}
              
              {/* Show recursive partitioning for isolation forest */}
              {step >= 1 && (
                <>
                  <line x1="30" y1="0" x2="30" y2="100" stroke="#777" strokeWidth="1" strokeDasharray="4" />
                  <line x1="0" y1="30" x2="100" y2="30" stroke="#777" strokeWidth="1" strokeDasharray="4" />
                </>
              )}
              
              {step >= 2 && (
                <>
                  <line x1="60" y1="30" x2="60" y2="100" stroke="#777" strokeWidth="1" strokeDasharray="4" />
                  <line x1="30" y1="60" x2="100" y2="60" stroke="#777" strokeWidth="1" strokeDasharray="4" />
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
                    stroke="red"
                    strokeWidth="2"
                  />
                ))
              }
            </svg>
          </div>
          <div className="mt-4 text-sm text-gray-700 p-2">
            {step === 0 && "Isolation Forests start with the raw data points. Notice the outliers (red)."}
            {step === 1 && "The algorithm begins by randomly splitting the data space with vertical and horizontal cuts."}
            {step === 2 && "It continues splitting recursively, creating smaller and smaller partitions."}
            {step === 3 && "Outliers are identified as they require fewer splits to isolate (anomaly detection)."}
          </div>
        </div>
        
        {/* Right visualization for K-means */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-medium mb-2">K-Means Clustering</h3>
          <div className="border rounded p-4 w-full bg-gray-50 aspect-square">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Plot all data points */}
              {data.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x * 1.6}
                  cy={point.y * 1.6}
                  r={2}
                  fill="steelblue"
                />
              ))}
              
              {/* Show centroids for k-means */}
              {step >= 1 && kMeansCentroids.map((centroid, i) => (
                <circle
                  key={`centroid-${i}`}
                  cx={centroid.x * 1.6}
                  cy={centroid.y * 1.6}
                  r={4}
                  fill="orange"
                  stroke="black"
                  strokeWidth="1"
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
                        strokeOpacity="0.3"
                      />
                    );
                  })}
                </>
              )}
              
              {/* Show final clusters */}
              {step >= 3 && (
                <>
                  {data.map((point, i) => {
                    // Find closest centroid
                    const dist1 = Math.sqrt(Math.pow(point.x - kMeansCentroids[0].x, 2) + Math.pow(point.y - kMeansCentroids[0].y, 2));
                    const dist2 = Math.sqrt(Math.pow(point.x - kMeansCentroids[1].x, 2) + Math.pow(point.y - kMeansCentroids[1].y, 2));
                    const closestCentroid = dist1 < dist2 ? 0 : 1;
                    
                    return (
                      <circle
                        key={`cluster-${i}`}
                        cx={point.x * 1.6}
                        cy={point.y * 1.6}
                        r={2}
                        fill={closestCentroid === 0 ? "#E57373" : "#64B5F6"}
                      />
                    );
                  })}
                </>
              )}
            </svg>
          </div>
          <div className="mt-4 text-sm text-gray-700 p-2">
            {step === 0 && "K-Means starts with the raw data points. The goal is to group them into clusters."}
            {step === 1 && "The algorithm places K centroids (orange dots) in the data space (K=2 in this example)."}
            {step === 2 && "Each data point is assigned to its closest centroid, forming initial clusters."}
            {step === 3 && "Final clusters are formed. Notice that outliers are still assigned to clusters, not treated specially."}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
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
const PCAvsRCF = () => {
  const [step, setStep] = useState(0);
  
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

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">PCA vs Random Cut Forests</h2>
        <div className="space-x-2">
          <button 
            className="px-3 py-1 bg-gray-200 rounded"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            Previous
          </button>
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => setStep(Math.min(3, step + 1))}
            disabled={step === 3}
          >
            Next
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Left visualization for PCA */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-medium mb-2">Principal Component Analysis (PCA)</h3>
          <div className="border rounded p-4 w-full bg-gray-50 aspect-square">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Plot all data points */}
              {data.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r={point.outlier ? 3 : 2}
                  fill={point.outlier ? "red" : "steelblue"}
                />
              ))}
              
              {/* Show principal components */}
              {step >= 1 && (
                <>
                  <line x1="10" y1="10" x2="90" y2="70" stroke="#FF9800" strokeWidth="2" />
                  {step >= 2 && <line x1="30" y1="70" x2="70" y2="30" stroke="#4CAF50" strokeWidth="2" />}
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
                    <g key={`proj-${i}`}>
                      <line 
                        x1={point.x} 
                        y1={point.y} 
                        x2={projX} 
                        y2={projY} 
                        stroke="#777" 
                        strokeWidth="0.5" 
                        strokeDasharray="2" 
                      />
                      <circle 
                        cx={projX} 
                        cy={projY} 
                        r="2" 
                        fill="#FF9800" 
                      />
                    </g>
                  );
                })
              }
            </svg>
          </div>
          <div className="mt-4 text-sm text-gray-700 p-2">
            {step === 0 && "PCA starts with the raw data points. The goal is to find directions of maximum variance."}
            {step === 1 && "The first principal component (orange) captures the direction of maximum variance in the data."}
            {step === 2 && "The second principal component (green) is orthogonal to the first and captures remaining variance."}
            {step === 3 && "Data can be projected onto principal components, reducing dimensionality while preserving variance."}
          </div>
        </div>
        
        {/* Right visualization for Random Cut Forests */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-medium mb-2">Random Cut Forests</h3>
          <div className="border rounded p-4 w-full bg-gray-50 aspect-square">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Plot all data points */}
              {data.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r={point.outlier ? 3 : 2}
                  fill={point.outlier ? "red" : "steelblue"}
                />
              ))}
              
              {/* Show random cuts for RCF */}
              {step >= 1 && (
                <>
                  <line x1="0" y1="40" x2="100" y2="40" stroke="#777" strokeWidth="1" strokeDasharray="4" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="#777" strokeWidth="1" strokeDasharray="4" />
                </>
              )}
              
              {step >= 2 && (
                <>
                  <line x1="75" y1="40" x2="75" y2="100" stroke="#777" strokeWidth="1" strokeDasharray="4" />
                  <line x1="0" y1="70" x2="50" y2="70" stroke="#777" strokeWidth="1" strokeDasharray="4" />
                  <line x1="50" y1="20" x2="100" y2="20" stroke="#777" strokeWidth="1" strokeDasharray="4" />
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
                    stroke="red"
                    strokeWidth="2"
                  />
                ))
              }
            </svg>
          </div>
          <div className="mt-4 text-sm text-gray-700 p-2">
            {step === 0 && "Random Cut Forests begin with the raw data points and build multiple trees through random partitioning."}
            {step === 1 && "The algorithm makes random cuts to partition the space (not based on variance like PCA)."}
            {step === 2 && "It continues making random cuts, creating a forest of random decision trees."}
            {step === 3 && "Points that require fewer cuts to isolate (like outliers) are assigned higher anomaly scores."}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
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