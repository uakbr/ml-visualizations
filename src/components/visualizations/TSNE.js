import React, { useState, useEffect, useRef } from 'react';
import { generate3DData } from '../../utils/dataGenerators';
import StepNavigation from '../common/StepNavigation';

const TSNE = ({ isMobile }) => {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const maxSteps = 3;
  
  // Get data from utility
  const data = generate3DData();

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

  // Project 3D points to 2D based on current rotation
  const project = (point) => {
    // Simple orthographic projection with rotation
    const rad = Math.PI / 180;
    const cosX = Math.cos(rotation.x * rad);
    const sinX = Math.sin(rotation.x * rad);
    const cosY = Math.cos(rotation.y * rad);
    const sinY = Math.sin(rotation.y * rad);
    
    // Apply rotation
    const rotX = point.x * cosY + point.z * sinY;
    const rotY = point.y * cosX - (point.x * sinY - point.z * cosY) * sinX;
    
    // Center in view
    return {
      x: rotX + 50,
      y: rotY + 50
    };
  };

  // Mouse event handlers for 3D rotation
  const handleMouseDown = (e) => {
    setDragging(true);
    setLastPosition({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  const handleMouseMove = (e) => {
    if (!dragging) return;
    
    const deltaX = e.clientX - lastPosition.x;
    const deltaY = e.clientY - lastPosition.y;
    
    setRotation({
      x: rotation.x + deltaY * 0.5,
      y: rotation.y + deltaX * 0.5
    });
    
    setLastPosition({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  const handleMouseUp = () => {
    setDragging(false);
  };

  // t-SNE embedding calculation (simplified)
  const calculateTSNE = (data, step) => {
    // This is a simplified placeholder for t-SNE
    // In a real implementation, you would use a proper t-SNE algorithm
    
    if (step === 0) {
      // Initial random positions for 2D embedding
      return data.map(point => ({
        ...point,
        x2d: Math.random() * 80 + 10,
        y2d: Math.random() * 80 + 10
      }));
    } else if (step === 1) {
      // Partial clustering effect
      return data.map(point => {
        let x2d, y2d;
        
        if (point.cluster === 1) {
          x2d = Math.random() * 20 + 20;
          y2d = Math.random() * 20 + 20;
        } else if (point.cluster === 2) {
          x2d = Math.random() * 20 + 60;
          y2d = Math.random() * 20 + 60;
        } else {
          x2d = Math.random() * 20 + 60;
          y2d = Math.random() * 20 + 20;
        }
        
        return { ...point, x2d, y2d };
      });
    } else {
      // Final well-defined clusters
      return data.map(point => {
        let x2d, y2d;
        
        if (point.cluster === 1) {
          x2d = Math.random() * 10 + 25;
          y2d = Math.random() * 10 + 25;
        } else if (point.cluster === 2) {
          x2d = Math.random() * 10 + 65;
          y2d = Math.random() * 10 + 65;
        } else {
          x2d = Math.random() * 10 + 65;
          y2d = Math.random() * 10 + 25;
        }
        
        return { ...point, x2d, y2d };
      });
    }
  };
  
  const tSNEData = calculateTSNE(data, Math.min(step, 2));
  
  return (
    <div className="flex flex-col space-y-6">
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row justify-between items-center'}`}>
        <h2 className="text-xl font-semibold">t-SNE: Dimensionality Reduction</h2>
        <StepNavigation 
          step={step}
          maxSteps={maxSteps}
          animating={animating}
          handleStepChange={handleStepChange}
          isMobile={isMobile}
        />
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 gap-8'}`}>
        {/* Left visualization - 3D Data */}
        <div className="flex flex-col items-center visualization-container">
          <h3 className="text-lg font-medium mb-2">Original 3D Data</h3>
          <div 
            className="border rounded p-4 w-full bg-gray-50 aspect-square relative"
            data-tooltip="Interactive 3D visualization - drag to rotate"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="absolute top-2 right-2 text-xs bg-gray-200 px-2 py-1 rounded">
              Drag to rotate 3D view
            </div>
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="xMidYMid meet"
              aria-label="3D data visualization"
              ref={svgRef}
              className="cursor-move"
            >
              {/* Plot all data points in 3D projection */}
              {data.map((point, i) => {
                const projectedPoint = project(point);
                return (
                  <circle
                    key={i}
                    cx={projectedPoint.x}
                    cy={projectedPoint.y}
                    r={2.5}
                    fill={point.cluster === 1 ? "#E57373" : point.cluster === 2 ? "#64B5F6" : "#81C784"}
                    className="transition-all duration-300"
                    opacity={animating ? 0.7 : 1}
                  />
                );
              })}
              
              {/* If we want to show connections in 3D space */}
              {step >= 1 && data.map((point, i) => {
                if (i % 5 !== 0) return null; // Only show some connections for clarity
                
                // Find 2 nearest neighbors of the same cluster
                const neighbors = data
                  .filter(p => p.cluster === point.cluster && p !== point)
                  .map(p => ({
                    point: p,
                    distance: Math.sqrt(
                      Math.pow(p.x - point.x, 2) + 
                      Math.pow(p.y - point.y, 2) + 
                      Math.pow(p.z - point.z, 2)
                    )
                  }))
                  .sort((a, b) => a.distance - b.distance)
                  .slice(0, 2)
                  .map(n => n.point);
                
                return neighbors.map((neighbor, j) => {
                  const p1 = project(point);
                  const p2 = project(neighbor);
                  
                  return (
                    <line
                      key={`${i}-${j}`}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={point.cluster === 1 ? "#E57373" : point.cluster === 2 ? "#64B5F6" : "#81C784"}
                      strokeWidth="0.3"
                      strokeOpacity={0.3}
                      className="transition-all duration-300"
                    />
                  );
                });
              })}
            </svg>
          </div>
          <div className="mt-4 text-sm text-gray-700 p-2 card min-h-[80px]">
            {step === 0 && "Here is the original 3D data with 3 clusters. Each color represents a different cluster."}
            {step === 1 && "In high-dimensional data, points within the same cluster are typically closer to each other."}
            {step === 2 && "t-SNE will attempt to preserve these neighborhood relationships in a lower-dimensional space."}
            {step === 3 && "Notice how the original structure of the data is maintained in 3D space."}
          </div>
        </div>
        
        {/* Right visualization - t-SNE 2D projection */}
        <div className="flex flex-col items-center visualization-container">
          <h3 className="text-lg font-medium mb-2">t-SNE 2D Projection</h3>
          <div className="border rounded p-4 w-full bg-gray-50 aspect-square"
               data-tooltip="t-SNE dimensionality reduction visualization">
            <svg width="100%" height="100%" viewBox="0 0 100 100" 
                 preserveAspectRatio="xMidYMid meet"
                 aria-label="t-SNE visualization">
              {/* Plot the t-SNE projected points */}
              {tSNEData.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x2d}
                  cy={point.y2d}
                  r={2.5}
                  fill={point.cluster === 1 ? "#E57373" : point.cluster === 2 ? "#64B5F6" : "#81C784"}
                  className="transition-all duration-500"
                  opacity={animating ? 0.7 : 1}
                />
              ))}
              
              {/* Show connections in t-SNE space */}
              {step >= 2 && tSNEData.map((point, i) => {
                if (i % 5 !== 0) return null;
                
                // Find 2 nearest neighbors of the same cluster in 2D
                const neighbors = tSNEData
                  .filter(p => p.cluster === point.cluster && p !== point)
                  .map(p => ({
                    point: p,
                    distance: Math.sqrt(
                      Math.pow(p.x2d - point.x2d, 2) + 
                      Math.pow(p.y2d - point.y2d, 2)
                    )
                  }))
                  .sort((a, b) => a.distance - b.distance)
                  .slice(0, 2)
                  .map(n => n.point);
                
                return neighbors.map((neighbor, j) => (
                  <line
                    key={`${i}-${j}`}
                    x1={point.x2d}
                    y1={point.y2d}
                    x2={neighbor.x2d}
                    y2={neighbor.y2d}
                    stroke={point.cluster === 1 ? "#E57373" : point.cluster === 2 ? "#64B5F6" : "#81C784"}
                    strokeWidth="0.4"
                    strokeOpacity={0.4}
                    className="transition-all duration-300"
                  />
                ));
              })}
            </svg>
          </div>
          <div className="mt-4 text-sm text-gray-700 p-2 card min-h-[80px]">
            {step === 0 && "Initially, t-SNE places points randomly in a 2D space."}
            {step === 1 && "The algorithm calculates pairwise similarities between points in both high and low dimensions."}
            {step === 2 && "t-SNE optimizes the 2D positions to preserve neighborhood relationships from the 3D space."}
            {step === 3 && "The final result shows well-separated clusters that preserve the structure of the original data."}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200 info-callout">
        <h3 className="font-semibold mb-2">About t-SNE:</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Purpose:</strong> t-SNE (t-Distributed Stochastic Neighbor Embedding) is a dimensionality reduction technique specifically designed for visualizing high-dimensional data.</li>
          <li><strong>How it works:</strong> Unlike PCA, t-SNE focuses on preserving local neighborhood structures. It models probabilities of point pairs being neighbors and minimizes the difference between these probabilities in high and low dimensions.</li>
          <li><strong>Advantages:</strong> Excellent at revealing clusters and preserving local structures in the data, making it ideal for visualization.</li>
          <li><strong>Limitations:</strong> Results are sensitive to hyperparameters, can be computationally expensive, and doesn't preserve global structure as well as PCA.</li>
          <li><strong>Applications:</strong> Widely used in bioinformatics, image processing, and natural language processing for visualizing complex datasets.</li>
        </ul>
      </div>
    </div>
  );
};

export default TSNE; 