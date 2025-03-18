import React, { useState, useEffect, useRef } from 'react';
import { generateGraphData } from '../../utils/dataGenerators';
import StepNavigation from '../common/StepNavigation';

const GraphNeuralNetworks = ({ isMobile }) => {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const svgRef = useRef(null);
  const maxSteps = 3;
  
  // Get graph data from utility
  const { nodes, edges } = generateGraphData();
  
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
  
  // Simulate node feature updates during message passing
  const simulateMessagePassing = (nodes, edges, steps) => {
    if (steps === 0) {
      // Initial features (one-hot encoded community assignment)
      return nodes.map(node => ({
        ...node,
        features: node.community === 0 ? [1, 0] : [0, 1],
        hidden: [0, 0],
        aggregated: [0, 0],
        updated: [0, 0]
      }));
    }
    
    // Start with previous features
    const prevNodes = simulateMessagePassing(nodes, edges, steps - 1);
    
    // For each node, aggregate messages from its neighbors
    const aggregatedNodes = prevNodes.map(node => {
      // Find all edges where this node is the target
      const incomingEdges = edges.filter(e => e.target === node.id);
      
      // Aggregate features from all neighbors
      let aggregated = [0, 0];
      incomingEdges.forEach(edge => {
        const sourceNode = prevNodes.find(n => n.id === edge.source);
        // Simple sum aggregation
        aggregated[0] += sourceNode.features[0] * 0.8;
        aggregated[1] += sourceNode.features[1] * 0.8;
      });
      
      // Normalize to avoid explosion
      const sum = Math.max(0.1, aggregated[0] + aggregated[1]);
      aggregated = [aggregated[0] / sum, aggregated[1] / sum];
      
      return {
        ...node,
        aggregated
      };
    });
    
    // Update features based on aggregation
    return aggregatedNodes.map(node => {
      // Simple update function: combine original and aggregated features
      const updated = [
        0.5 * node.features[0] + 0.5 * node.aggregated[0],
        0.5 * node.features[1] + 0.5 * node.aggregated[1]
      ];
      
      return {
        ...node,
        hidden: [...node.features], // Store previous features for visualization
        features: updated,
        updated
      };
    });
  };
  
  // Nodes with features after message passing
  const processedNodes = simulateMessagePassing(nodes, edges, Math.min(step, 3));
  
  // Get all edges for the current viewed node during message passing
  const getRelevantEdges = (nodeId) => {
    if (step === 0) return [];
    
    return edges.filter(e => e.target === nodeId || e.source === nodeId);
  };
  
  // Color scaling functions
  const getNodeColor = (node) => {
    if (step === 0) {
      // Original communities
      return node.community === 0 ? "var(--primary-color)" : "var(--secondary-color)";
    } else {
      // Blend based on feature vector
      const r = Math.round(239 + (101 - 239) * node.features[1]);
      const g = Math.round(100 + (191 - 100) * node.features[1]);
      const b = Math.round(131 + (169 - 131) * node.features[1]);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };
  
  const getEdgeColor = (edge, hoveredNodeId) => {
    if (hoveredNodeId !== null && 
       (edge.source === hoveredNodeId || edge.target === hoveredNodeId)) {
      return "var(--warning-color)";
    }
    
    return edge.type === 'intra' ? '#aaa' : '#ccc';
  };
  
  return (
    <div className="flex flex-col space-y-6">
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row justify-between items-center'}`}>
        <h2 className="text-xl font-semibold">Graph Neural Networks (GNNs)</h2>
        <StepNavigation 
          step={step}
          maxSteps={maxSteps}
          animating={animating}
          handleStepChange={handleStepChange}
          isMobile={isMobile}
        />
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 gap-8'}`}>
        {/* Left visualization - Graph Network */}
        <div className="flex flex-col items-center visualization-container">
          <h3 className="text-lg font-medium mb-2">Graph Structure</h3>
          <div className="border rounded p-4 w-full bg-gray-50 aspect-square"
               data-tooltip="Visualization of graph structure and message passing">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="xMidYMid meet"
              aria-label="Graph Neural Network visualization"
              ref={svgRef}
            >
              {/* Draw edges first so they appear behind nodes */}
              {edges.map((edge, i) => {
                const source = processedNodes.find(n => n.id === edge.source);
                const target = processedNodes.find(n => n.id === edge.target);
                
                return (
                  <line
                    key={`edge-${i}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={getEdgeColor(edge, hoveredNode)}
                    strokeWidth={hoveredNode !== null && 
                                (edge.source === hoveredNode || edge.target === hoveredNode) ? 
                                "0.8" : "0.5"}
                    strokeOpacity={step === 0 ? 0.3 : 0.5}
                    className="transition-all duration-300"
                    markerEnd={step >= 1 ? "url(#arrowhead)" : ""}
                  />
                );
              })}
              
              {/* Add arrow marker for directed edges */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="4"
                  markerHeight="4"
                  refX="2"
                  refY="2"
                  orient="auto"
                >
                  <path d="M0,0 L0,4 L4,2 Z" fill="#aaa" />
                </marker>
              </defs>
              
              {/* Visualize message passing */}
              {step >= 1 && hoveredNode !== null && 
                getRelevantEdges(hoveredNode).map((edge, i) => {
                  const source = processedNodes.find(n => n.id === edge.source);
                  const target = processedNodes.find(n => n.id === edge.target);
                  
                  // Only show animation for incoming edges during message passing
                  if (edge.target !== hoveredNode) return null;
                  
                  return (
                    <circle
                      key={`message-${i}`}
                      className={`${animating ? "" : "animate-pulse"}`}
                      r="1.2"
                      fill="var(--warning-color)"
                    >
                      <animateMotion
                        path={`M${source.x},${source.y} L${target.x},${target.y}`}
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  );
                })
              }
              
              {/* Draw all nodes */}
              {processedNodes.map((node, i) => (
                <g 
                  key={`node-${i}`} 
                  className="transition-all duration-300"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={hoveredNode === node.id ? 4 : 3}
                    fill={getNodeColor(node)}
                    stroke={hoveredNode === node.id ? "#333" : "none"}
                    strokeWidth="0.5"
                    opacity={animating ? 0.7 : 1}
                  />
                  
                  {/* Show node ID for clarity */}
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="2.2"
                    fill="#fff"
                    fontWeight={hoveredNode === node.id ? "bold" : "normal"}
                  >
                    {node.id}
                  </text>
                  
                  {/* Feature visualization for hovered node */}
                  {hoveredNode === node.id && step >= 1 && (
                    <g>
                      <rect
                        x={node.x + 5}
                        y={node.y - 10}
                        width="20"
                        height="20"
                        fill="white"
                        stroke="#ddd"
                        strokeWidth="0.3"
                        rx="2"
                      />
                      <text
                        x={node.x + 15}
                        y={node.y - 5}
                        textAnchor="middle"
                        fontSize="2.5"
                        fill="#333"
                      >
                        Features:
                      </text>
                      <text
                        x={node.x + 15}
                        y={node.y}
                        textAnchor="middle"
                        fontSize="2.5"
                        fill="#333"
                      >
                        [{node.features[0].toFixed(2)}, {node.features[1].toFixed(2)}]
                      </text>
                      <text
                        x={node.x + 15}
                        y={node.y + 5}
                        textAnchor="middle"
                        fontSize="2"
                        fill="#777"
                      >
                        (hover on other nodes)
                      </text>
                    </g>
                  )}
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-4 text-sm text-gray-700 p-2 card min-h-[80px]">
            {step === 0 && "This is a graph with nodes and edges. Nodes are colored by their initial community assignment."}
            {step === 1 && "During message passing, nodes send their features to neighboring nodes. Hover over nodes to see their features."}
            {step === 2 && "Each node aggregates the messages it receives from its neighbors to update its own features."}
            {step === 3 && "After multiple rounds of message passing, node features have incorporated information from their local neighborhood."}
          </div>
        </div>
        
        {/* Right visualization - Feature Space Transformation */}
        <div className="flex flex-col items-center visualization-container">
          <h3 className="text-lg font-medium mb-2">Node Feature Space</h3>
          <div className="border rounded p-4 w-full bg-gray-50 aspect-square"
               data-tooltip="Node embeddings in feature space">
            <svg width="100%" height="100%" viewBox="0 0 100 100" 
                 preserveAspectRatio="xMidYMid meet"
                 aria-label="Feature space visualization">
              {/* Draw axes */}
              <line x1="10" y1="90" x2="90" y2="90" stroke="#333" strokeWidth="0.5" />
              <line x1="10" y1="10" x2="10" y2="90" stroke="#333" strokeWidth="0.5" />
              
              {/* Axis labels */}
              <text x="50" y="97" textAnchor="middle" fontSize="3" fill="#666">Feature 1</text>
              <text x="3" y="50" textAnchor="middle" fontSize="3" fill="#666" transform="rotate(-90, 3, 50)">Feature 2</text>
              
              {/* Grid lines */}
              <line x1="10" y1="50" x2="90" y2="50" stroke="#ddd" strokeWidth="0.2" strokeDasharray="1,1" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="#ddd" strokeWidth="0.2" strokeDasharray="1,1" />
              
              {/* Decision boundary after node classification (only in last step) */}
              {step === 3 && (
                <line 
                  x1="30" y1="10" 
                  x2="70" y2="90" 
                  stroke="var(--warning-color)" 
                  strokeWidth="0.5" 
                  strokeDasharray="2,1"
                  className="transition-all duration-500"
                />
              )}
              
              {/* Plot nodes in feature space */}
              {processedNodes.map((node, i) => {
                // Map features to coordinates
                const x = 10 + node.features[0] * 80;
                const y = 90 - node.features[1] * 80;
                
                // For step 2, show where node came from with an arrow
                return (
                  <g key={`feature-${i}`} className="transition-all duration-500">
                    {step >= 2 && node.hidden && (
                      <>
                        <line 
                          x1={10 + node.hidden[0] * 80}
                          y1={90 - node.hidden[1] * 80}
                          x2={x}
                          y2={y}
                          stroke="#aaa"
                          strokeWidth="0.3"
                          strokeDasharray="1,1"
                        />
                        <circle
                          cx={10 + node.hidden[0] * 80}
                          cy={90 - node.hidden[1] * 80}
                          r="1.5"
                          fill="#ccc"
                          opacity="0.5"
                        />
                      </>
                    )}
                    
                    <circle
                      cx={x}
                      cy={y}
                      r={hoveredNode === node.id ? 3 : 2}
                      fill={getNodeColor(node)}
                      stroke={hoveredNode === node.id ? "#333" : "none"}
                      strokeWidth="0.5"
                      className={`transition-all duration-300 ${hoveredNode === node.id ? "animate-pulse" : ""}`}
                    />
                    
                    <text
                      x={x}
                      y={y - 3}
                      textAnchor="middle"
                      fontSize="2"
                      fill={hoveredNode === node.id ? "#333" : "#777"}
                      fontWeight={hoveredNode === node.id ? "bold" : "normal"}
                    >
                      {node.id}
                    </text>
                  </g>
                );
              })}
              
              {/* Legend */}
              <g transform="translate(70, 20)">
                <rect width="20" height="14" fill="white" stroke="#ddd" strokeWidth="0.2" />
                <circle cx="4" cy="4" r="2" fill="var(--primary-color)" />
                <text x="8" y="4.5" fontSize="2.2" fill="#333" dominantBaseline="middle">Community 0</text>
                <circle cx="4" cy="9" r="2" fill="var(--secondary-color)" />
                <text x="8" y="9.5" fontSize="2.2" fill="#333" dominantBaseline="middle">Community 1</text>
                {step === 3 && (
                  <>
                    <line x1="2" y1="14" x2="7" y2="14" stroke="var(--warning-color)" strokeWidth="0.5" strokeDasharray="2,1" />
                    <text x="10" y="14.5" fontSize="2" fill="#333" dominantBaseline="middle">Boundary</text>
                  </>
                )}
              </g>
            </svg>
          </div>
          <div className="mt-4 text-sm text-gray-700 p-2 card min-h-[80px]">
            {step === 0 && "Initially, nodes have simple one-hot encoded features based on their community assignment."}
            {step === 1 && "After one round of message passing, nodes begin to incorporate information from their neighbors."}
            {step === 2 && "Node representations evolve during training, as shown by the arrows indicating movement in feature space."}
            {step === 3 && "Finally, nodes from the same community cluster together in feature space, allowing for accurate node classification."}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200 info-callout">
        <h3 className="font-semibold mb-2">About Graph Neural Networks:</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Message Passing:</strong> GNNs learn by passing messages between nodes, allowing each node to gather information from its neighborhood.</li>
          <li><strong>Node Features:</strong> Initially nodes may have basic features, but through message passing they develop rich representations that capture graph structure.</li>
          <li><strong>Applications:</strong> GNNs excel at tasks like node classification, link prediction, graph classification, and community detection.</li>
          <li><strong>Real-world Uses:</strong> Used in social network analysis, recommendation systems, molecular property prediction, traffic forecasting, and fraud detection.</li>
          <li><strong>Advantages:</strong> Can capture complex relationships and patterns in graph-structured data that traditional neural networks cannot handle.</li>
        </ul>
      </div>
    </div>
  );
};

export default GraphNeuralNetworks; 