import React, { useState } from 'react';
import { generateDecisionTreeData, generateDecisionTree } from '../../utils/dataGenerators';
import StepNavigation from '../common/StepNavigation';

const DecisionTree = ({ isMobile }) => {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const maxSteps = 3;
  
  // Get data from utility
  const data = generateDecisionTreeData();
  const treeStructure = generateDecisionTree();
  
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
  
  // Scale data points to scatter plot coordinates
  const scaleX = (value) => value * 80 + 10; // sweetness on x-axis
  const scaleY = (value) => 90 - value * 80; // color on y-axis

  // Get point color based on class
  const getPointColor = (point) => {
    switch(point.class) {
      case 'apple': return "#E57373"; // red
      case 'orange': return "#FF9800"; // orange
      case 'lemon': return "#FFF176"; // yellow
      default: return "var(--primary-color)";
    }
  };
  
  // Calculate decision boundaries for visualization
  const decisionBoundaries = [
    { feature: 'sweetness', threshold: 0.35, x1: scaleX(0.35), y1: 10, x2: scaleX(0.35), y2: 90 },
    { feature: 'color', threshold: 0.65, x1: scaleX(0.35), y1: scaleY(0.65), x2: 90, y2: scaleY(0.65) }
  ];
  
  // Render the tree recursively
  const renderTreeNode = (node, x, y, width, depth = 0, parentX = null, parentY = null) => {
    const nodeRadius = 15;
    const nodeGap = isMobile ? 40 : 70;
    const levelHeight = isMobile ? 70 : 100;
    
    // Only render nodes for the current step
    if (depth > step) return null;
    
    // Calculate colors for distribution pie chart
    const total = node.samples;
    const applePct = (node.distribution?.apple || 0) / total;
    const orangePct = (node.distribution?.orange || 0) / total;
    const lemonPct = (node.distribution?.lemon || 0) / total;
    
    return (
      <g key={`${depth}-${x}`} className={`transition-all duration-500 ${animating ? "opacity-70" : ""}`}>
        {/* Connection line to parent */}
        {parentX !== null && (
          <line
            x1={parentX}
            y1={parentY + nodeRadius}
            x2={x}
            y2={y - nodeRadius}
            stroke="#777"
            strokeWidth="1.5"
            strokeDasharray={animating ? "4" : "none"}
            className="transition-all duration-300"
          />
        )}
        
        {/* Node circle */}
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill="white"
          stroke="#333"
          strokeWidth="1.5"
          className="transition-all duration-300"
        />
        
        {/* Sample distribution pie chart inside the node */}
        <path
          d={`M ${x} ${y} L ${x} ${y - nodeRadius} A ${nodeRadius} ${nodeRadius} 0 0 1 ${x + nodeRadius * Math.sin(2 * Math.PI * applePct)} ${y - nodeRadius * Math.cos(2 * Math.PI * applePct)} Z`}
          fill="#E57373"
          opacity="0.8"
        />
        <path
          d={`M ${x} ${y} L ${x + nodeRadius * Math.sin(2 * Math.PI * applePct)} ${y - nodeRadius * Math.cos(2 * Math.PI * applePct)} A ${nodeRadius} ${nodeRadius} 0 0 1 ${x + nodeRadius * Math.sin(2 * Math.PI * (applePct + orangePct))} ${y - nodeRadius * Math.cos(2 * Math.PI * (applePct + orangePct))} Z`}
          fill="#FF9800"
          opacity="0.8"
        />
        <path
          d={`M ${x} ${y} L ${x + nodeRadius * Math.sin(2 * Math.PI * (applePct + orangePct))} ${y - nodeRadius * Math.cos(2 * Math.PI * (applePct + orangePct))} A ${nodeRadius} ${nodeRadius} 0 0 1 ${x} ${y - nodeRadius} Z`}
          fill="#FFF176"
          opacity="0.8"
        />
        
        {/* Node text */}
        {node.feature ? (
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="3.5"
            fontWeight="bold"
            fill="#333"
          >
            {node.feature}
          </text>
        ) : (
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="3.5"
            fontWeight="bold"
            fill="#333"
          >
            {node.class}
          </text>
        )}
        
        {/* Node threshold text (if it's a split node) */}
        {node.feature && (
          <text
            x={x}
            y={y + nodeRadius + 5}
            textAnchor="middle"
            fontSize="3"
            fill="#555"
          >
            {node.threshold.toFixed(2)}
          </text>
        )}
        
        {/* Left child */}
        {node.left && renderTreeNode(
          node.left,
          x - width / 4,
          y + levelHeight,
          width / 2,
          depth + 1,
          x,
          y
        )}
        
        {/* Right child */}
        {node.right && renderTreeNode(
          node.right,
          x + width / 4,
          y + levelHeight,
          width / 2,
          depth + 1,
          x,
          y
        )}
        
        {/* Decision text */}
        {node.left && (
          <text
            x={x - width / 8}
            y={y + levelHeight / 2 - 5}
            textAnchor="middle"
            fontSize="3"
            fill="#555"
          >
            ≤ {node.threshold.toFixed(2)}
          </text>
        )}
        
        {node.right && (
          <text
            x={x + width / 8}
            y={y + levelHeight / 2 - 5}
            textAnchor="middle"
            fontSize="3"
            fill="#555"
          >
            &gt; {node.threshold.toFixed(2)}
          </text>
        )}
      </g>
    );
  };
  
  return (
    <div className="flex flex-col space-y-6">
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row justify-between items-center'}`}>
        <h2 className="text-xl font-semibold">Decision Tree Classification</h2>
        <StepNavigation 
          step={step}
          maxSteps={maxSteps}
          animating={animating}
          handleStepChange={handleStepChange}
          isMobile={isMobile}
        />
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 gap-8'}`}>
        {/* Left visualization - Data Space */}
        <div className="flex flex-col items-center visualization-container">
          <h3 className="text-lg font-medium mb-2">Feature Space</h3>
          <div className="border rounded p-4 w-full bg-gray-50 aspect-square"
               data-tooltip="Visualization of data points in feature space">
            <svg width="100%" height="100%" viewBox="0 0 100 100" 
                 preserveAspectRatio="xMidYMid meet"
                 aria-label="Feature space visualization">
              {/* Axes */}
              <line x1="10" y1="90" x2="90" y2="90" stroke="#333" strokeWidth="0.5" />
              <line x1="10" y1="10" x2="10" y2="90" stroke="#333" strokeWidth="0.5" />
              
              {/* Axis labels */}
              <text x="50" y="98" textAnchor="middle" fontSize="3.5" fill="#666">Sweetness</text>
              <text x="3" y="50" textAnchor="middle" fontSize="3.5" fill="#666" transform="rotate(-90, 3, 50)">Color</text>
              
              {/* Grid lines */}
              <line x1="10" y1="50" x2="90" y2="50" stroke="#ddd" strokeWidth="0.2" strokeDasharray="1,1" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="#ddd" strokeWidth="0.2" strokeDasharray="1,1" />
              
              {/* Decision boundaries (appear gradually based on step) */}
              {step >= 1 && (
                <line 
                  x1={decisionBoundaries[0].x1} 
                  y1={decisionBoundaries[0].y1} 
                  x2={decisionBoundaries[0].x2} 
                  y2={decisionBoundaries[0].y2} 
                  stroke="var(--warning-color)" 
                  strokeWidth="1.5" 
                  strokeDasharray="3"
                  className="transition-all duration-500"
                />
              )}
              
              {step >= 2 && (
                <line 
                  x1={decisionBoundaries[1].x1} 
                  y1={decisionBoundaries[1].y1} 
                  x2={decisionBoundaries[1].x2} 
                  y2={decisionBoundaries[1].y2} 
                  stroke="var(--warning-color)" 
                  strokeWidth="1.5" 
                  strokeDasharray="3"
                  className="transition-all duration-500"
                />
              )}
              
              {/* Region labels (only in final step) */}
              {step >= 3 && (
                <>
                  <text x={scaleX(0.15)} y={scaleY(0.5)} textAnchor="middle" fontSize="3" fill="#333" fontWeight="bold">
                    Lemon
                  </text>
                  <text x={scaleX(0.6)} y={scaleY(0.4)} textAnchor="middle" fontSize="3" fill="#333" fontWeight="bold">
                    Orange
                  </text>
                  <text x={scaleX(0.75)} y={scaleY(0.8)} textAnchor="middle" fontSize="3" fill="#333" fontWeight="bold">
                    Apple
                  </text>
                </>
              )}
              
              {/* Data points */}
              {data.map((point, i) => (
                <circle
                  key={i}
                  cx={scaleX(point.sweetness)}
                  cy={scaleY(point.color)}
                  r={hoveredPoint === point.id ? 3.5 : 2.5}
                  fill={getPointColor(point)}
                  stroke={hoveredPoint === point.id ? "#333" : "none"}
                  strokeWidth="0.5"
                  className="transition-all duration-300"
                  opacity={animating ? 0.7 : 1}
                  onMouseEnter={() => setHoveredPoint(point.id)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
              
              {/* Legend */}
              <g transform="translate(70, 20)">
                <rect width="24" height="15" fill="white" stroke="#ddd" strokeWidth="0.2" />
                <circle cx="4" cy="4" r="2" fill="#E57373" />
                <text x="8" y="4.5" fontSize="2.5" fill="#333" dominantBaseline="middle">Apple</text>
                <circle cx="4" cy="9" r="2" fill="#FF9800" />
                <text x="8" y="9.5" fontSize="2.5" fill="#333" dominantBaseline="middle">Orange</text>
                <circle cx="4" cy="14" r="2" fill="#FFF176" />
                <text x="8" y="14.5" fontSize="2.5" fill="#333" dominantBaseline="middle">Lemon</text>
              </g>
            </svg>
          </div>
          <div className="mt-4 text-sm text-gray-700 p-2 card min-h-[80px]">
            {step === 0 && "The scatter plot shows fruit data with sweetness on the x-axis and color on the y-axis. Notice how the three classes form clusters."}
            {step === 1 && "The first decision boundary splits the data based on sweetness. Points with sweetness ≤ 0.35 are mostly lemons."}
            {step === 2 && "The second decision boundary splits the remaining data based on color. Points with color > 0.65 are mostly apples."}
            {step === 3 && "The decision tree has created three regions corresponding to the three fruit types, classifying the points based on sweetness and color."}
          </div>
        </div>
        
        {/* Right visualization - Decision Tree */}
        <div className="flex flex-col items-center visualization-container">
          <h3 className="text-lg font-medium mb-2">Decision Tree Structure</h3>
          <div className="border rounded p-4 w-full bg-gray-50 aspect-square overflow-auto"
               data-tooltip="Decision tree structure visualization">
            <svg width="100%" height={isMobile ? "200%" : "150%"} viewBox="0 0 100 150" 
                 preserveAspectRatio="xMidYMin meet"
                 aria-label="Decision tree visualization">
              {/* Render tree recursively */}
              {renderTreeNode(treeStructure, 50, 30, 80)}
              
              {/* Legend */}
              <g transform="translate(5, 10)">
                <rect width="35" height="10" fill="white" stroke="#ddd" strokeWidth="0.2" />
                <circle cx="4" cy="3" r="2" fill="#E57373" />
                <text x="7" y="3.5" fontSize="2" fill="#333" dominantBaseline="middle">Apple</text>
                <circle cx="4" cy="7" r="2" fill="#FF9800" />
                <text x="7" y="7.5" fontSize="2" fill="#333" dominantBaseline="middle">Orange</text>
                <circle cx="18" cy="3" r="2" fill="#FFF176" />
                <text x="21" y="3.5" fontSize="2" fill="#333" dominantBaseline="middle">Lemon</text>
                <text x="17.5" y="7.5" fontSize="2" fill="#333" dominantBaseline="middle">Pie = distribution</text>
              </g>
            </svg>
          </div>
          <div className="mt-4 text-sm text-gray-700 p-2 card min-h-[80px]">
            {step === 0 && "The root node represents all data points. The colored pie chart shows the distribution of classes in the dataset."}
            {step === 1 && "The first decision splits data based on sweetness. Fruits with sweetness ≤ 0.35 go to the left branch (mostly lemons)."}
            {step === 2 && "The right branch is further split based on color. Fruits with color > 0.65 go to the right leaf (mostly apples)."}
            {step === 3 && "The complete tree has three leaf nodes. Each corresponds to a predicted class (lemon, orange, or apple)."}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200 info-callout">
        <h3 className="font-semibold mb-2">About Decision Trees:</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Algorithm:</strong> Decision trees classify data by creating a series of binary splits on feature values, forming a tree-like model of decisions.</li>
          <li><strong>Split Criteria:</strong> At each node, the algorithm selects the feature and threshold that best separates the classes (using metrics like Gini impurity or entropy).</li>
          <li><strong>Advantages:</strong> Easy to understand and interpret, requires minimal data preparation, handles both numerical and categorical data.</li>
          <li><strong>Limitations:</strong> Can create overly complex trees that overfit the data, may be unstable (small changes in data can result in a very different tree).</li>
          <li><strong>Applications:</strong> Credit approval, medical diagnosis, customer churn prediction, and many other classification tasks.</li>
        </ul>
      </div>
    </div>
  );
};

export default DecisionTree; 