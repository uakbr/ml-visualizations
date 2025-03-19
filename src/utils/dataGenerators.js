// Generate data for Isolation Forest vs K-Means visualization
export const generateClusterData = () => {
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

// Generate data for PCA vs RCF visualization
export const generatePCAData = () => {
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

// Generate 3D data for t-SNE visualization
export const generate3DData = () => {
  const points = [];
  
  // Generate 3 clusters in 3D space
  // Cluster 1
  for (let i = 0; i < 30; i++) {
    points.push({
      x: Math.random() * 10 + 5,
      y: Math.random() * 10 + 5,
      z: Math.random() * 10 + 5,
      cluster: 1
    });
  }
  
  // Cluster 2
  for (let i = 0; i < 30; i++) {
    points.push({
      x: Math.random() * 10 + 40,
      y: Math.random() * 10 + 40,
      z: Math.random() * 10 + 5,
      cluster: 2
    });
  }
  
  // Cluster 3
  for (let i = 0; i < 30; i++) {
    points.push({
      x: Math.random() * 10 + 20,
      y: Math.random() * 10 + 40,
      z: Math.random() * 10 + 30,
      cluster: 3
    });
  }
  
  return points;
};

// Generate time series data for ARIMA visualization
export const generateTimeSeriesData = (length = 100) => {
  const data = [];
  let value = 50;
  
  for (let i = 0; i < length; i++) {
    // Add trend
    const trend = i * 0.1;
    
    // Add seasonality (sine wave)
    const seasonality = 10 * Math.sin(i * 0.2);
    
    // Add random noise
    const noise = Math.random() * 5 - 2.5;
    
    // Combine components
    value = trend + seasonality + noise + value * 0.8;
    
    // Add anomalies at specific points
    if (i === 30 || i === 70) {
      value += 30;
    }
    
    data.push({
      time: i,
      value: value
    });
  }
  
  return data;
};

// Generate graph network data for GNN visualization
export const generateGraphData = () => {
  const nodes = [];
  const edges = [];
  
  // Create nodes
  for (let i = 0; i < 20; i++) {
    nodes.push({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      community: i < 10 ? 0 : 1
    });
  }
  
  // Create edges (more connections within communities, fewer between)
  for (let i = 0; i < nodes.length; i++) {
    const community = nodes[i].community;
    
    // Connect to ~3 nodes in same community
    for (let j = 0; j < 3; j++) {
      let target;
      do {
        target = Math.floor(Math.random() * 10) + (community * 10);
      } while (target === i);
      
      edges.push({
        source: i,
        target: target,
        type: 'intra'
      });
    }
    
    // Connect to ~1 node in other community
    if (Math.random() > 0.5) {
      const target = Math.floor(Math.random() * 10) + (community === 0 ? 10 : 0);
      edges.push({
        source: i,
        target: target,
        type: 'inter'
      });
    }
  }
  
  return { nodes, edges };
};

// Generate data for Decision Tree visualization
export const generateDecisionTreeData = () => {
  const dataset = [];
  
  // Class 1: Apples (mainly red, heavier, sweeter)
  for (let i = 0; i < 25; i++) {
    dataset.push({
      id: `apple-${i}`,
      color: Math.random() * 0.3 + 0.7, // 0.7-1.0 (higher is more red)
      weight: Math.random() * 0.4 + 0.6, // 0.6-1.0 (higher is heavier)
      sweetness: Math.random() * 0.5 + 0.5, // 0.5-1.0 (higher is sweeter)
      class: 'apple'
    });
  }
  
  // Class 2: Oranges (mainly orange, medium weight, medium sweet)
  for (let i = 0; i < 25; i++) {
    dataset.push({
      id: `orange-${i}`,
      color: Math.random() * 0.3 + 0.3, // 0.3-0.6 (middle range is more orange)
      weight: Math.random() * 0.4 + 0.3, // 0.3-0.7 (medium weight)
      sweetness: Math.random() * 0.5 + 0.3, // 0.3-0.8 (medium sweet)
      class: 'orange'
    });
  }
  
  // Class 3: Lemons (mainly yellow, lighter, sour)
  for (let i = 0; i < 25; i++) {
    dataset.push({
      id: `lemon-${i}`,
      color: Math.random() * 0.3 + 0.3, // 0.3-0.6 (middle-low range is more yellow)
      weight: Math.random() * 0.3 + 0.1, // 0.1-0.4 (lighter)
      sweetness: Math.random() * 0.3, // 0.0-0.3 (not sweet/sour)
      class: 'lemon'
    });
  }
  
  return dataset;
};

// Generate a decision tree structure
export const generateDecisionTree = () => {
  return {
    feature: 'sweetness',
    threshold: 0.35,
    left: {
      // If sweetness <= 0.35
      class: 'lemon',
      samples: 27,
      distribution: { apple: 2, orange: 3, lemon: 22 }
    },
    right: {
      // If sweetness > 0.35
      feature: 'color',
      threshold: 0.65,
      left: {
        // If color <= 0.65
        class: 'orange',
        samples: 28,
        distribution: { apple: 3, orange: 22, lemon: 3 }
      },
      right: {
        // If color > 0.65
        class: 'apple',
        samples: 20,
        distribution: { apple: 20, orange: 0, lemon: 0 }
      }
    }
  };
}; 