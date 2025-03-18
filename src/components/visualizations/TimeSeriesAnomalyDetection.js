import React, { useState, useEffect } from 'react';
import { generateTimeSeriesData } from '../../utils/dataGenerators';
import StepNavigation from '../common/StepNavigation';

const TimeSeriesAnomalyDetection = ({ isMobile }) => {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const maxSteps = 3;
  
  // Get data from utility
  const data = generateTimeSeriesData(100);
  
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
  
  // Find min and max values for scaling
  const minValue = Math.min(...data.map(d => d.value)) - 5;
  const maxValue = Math.max(...data.map(d => d.value)) + 5;
  const valueRange = maxValue - minValue;
  
  // Scale data point to SVG coordinates
  const scaleX = (time) => (time / 100) * 90 + 5;
  const scaleY = (value) => 95 - ((value - minValue) / valueRange) * 85;
  
  // Generate path string for the time series line
  const generatePath = (data) => {
    return data.map((d, i) => {
      return `${i === 0 ? 'M' : 'L'} ${scaleX(d.time)} ${scaleY(d.value)}`;
    }).join(' ');
  };
  
  // Simple moving average calculation
  const calculateMovingAverage = (data, window = 5) => {
    return data.map((d, i) => {
      if (i < window - 1) {
        // Not enough previous points for full window
        const availablePoints = data.slice(0, i + 1);
        const sum = availablePoints.reduce((acc, curr) => acc + curr.value, 0);
        return {
          time: d.time,
          value: sum / availablePoints.length
        };
      } else {
        // Full window available
        const windowPoints = data.slice(i - window + 1, i + 1);
        const sum = windowPoints.reduce((acc, curr) => acc + curr.value, 0);
        return {
          time: d.time,
          value: sum / window
        };
      }
    });
  };
  
  // Generate ARIMA-based prediction (simplified)
  const generatePrediction = (data) => {
    // This is a very simplified approximation of ARIMA
    // In a real implementation, you would use a proper ARIMA model
    
    const movingAvg = calculateMovingAverage(data, 7);
    
    return data.map((d, i) => {
      // Add seasonality component
      const seasonality = 10 * Math.sin(d.time * 0.2);
      
      // Add trend component (simple linear trend)
      const trend = d.time * 0.1;
      
      // Base prediction on moving average + seasonality + trend
      let prediction = movingAvg[i].value;
      
      // For step 3, make the prediction closer to the actual data
      if (step >= 3) {
        prediction = prediction * 0.8 + (trend + seasonality) * 0.2;
      } else {
        prediction = prediction * 0.5 + (trend + seasonality) * 0.5;
      }
      
      return {
        time: d.time,
        value: prediction
      };
    });
  };
  
  // Calculate anomaly scores
  const calculateAnomalyScores = (data, predictions) => {
    return data.map((d, i) => {
      const diff = Math.abs(d.value - predictions[i].value);
      return {
        time: d.time,
        score: diff
      };
    });
  };
  
  const movingAverage = calculateMovingAverage(data, 7);
  const predictions = generatePrediction(data);
  const anomalyScores = calculateAnomalyScores(data, predictions);
  
  // Determine anomaly threshold (for visualization purposes)
  const meanScore = anomalyScores.reduce((sum, point) => sum + point.score, 0) / anomalyScores.length;
  const stdDev = Math.sqrt(
    anomalyScores.reduce((sum, point) => sum + Math.pow(point.score - meanScore, 2), 0) / anomalyScores.length
  );
  const anomalyThreshold = meanScore + 2 * stdDev;
  
  // Detect anomalies
  const anomalies = data.filter((d, i) => anomalyScores[i].score > anomalyThreshold);
  
  return (
    <div className="flex flex-col space-y-6">
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row justify-between items-center'}`}>
        <h2 className="text-xl font-semibold">Time Series Anomaly Detection</h2>
        <StepNavigation 
          step={step}
          maxSteps={maxSteps}
          animating={animating}
          handleStepChange={handleStepChange}
          isMobile={isMobile}
        />
      </div>
      
      <div className="border rounded p-4 w-full bg-gray-50">
        <svg 
          width="100%" 
          height={isMobile ? "200" : "300"} 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          aria-label="Time Series Anomaly Detection visualization"
        >
          {/* X and Y axes */}
          <line x1="5" y1="95" x2="95" y2="95" stroke="#333" strokeWidth="0.5" />
          <line x1="5" y1="5" x2="5" y2="95" stroke="#333" strokeWidth="0.5" />
          
          {/* X-axis labels */}
          <text x="50" y="99" textAnchor="middle" fontSize="3" fill="#666">Time</text>
          <text x="5" y="98" textAnchor="middle" fontSize="2" fill="#666">0</text>
          <text x="95" y="98" textAnchor="middle" fontSize="2" fill="#666">100</text>
          
          {/* Y-axis labels */}
          <text x="3" y="50" textAnchor="middle" fontSize="3" fill="#666" transform="rotate(-90, 3, 50)">Value</text>
          
          {/* Grid lines for better readability */}
          {[0, 25, 50, 75, 100].map(tick => (
            <line 
              key={`x-grid-${tick}`} 
              x1={scaleX(tick)} 
              y1="5" 
              x2={scaleX(tick)} 
              y2="95" 
              stroke="#ddd" 
              strokeWidth="0.2" 
              strokeDasharray="1,1"
            />
          ))}
          
          {[minValue, (minValue + maxValue) / 2, maxValue].map((tick, i) => (
            <React.Fragment key={`y-grid-${i}`}>
              <line 
                x1="5" 
                y1={scaleY(tick)} 
                x2="95" 
                y2={scaleY(tick)} 
                stroke="#ddd" 
                strokeWidth="0.2" 
                strokeDasharray="1,1"
              />
              <text 
                x="4" 
                y={scaleY(tick)} 
                textAnchor="end" 
                fontSize="2" 
                fill="#666" 
                dominantBaseline="middle"
              >
                {Math.round(tick)}
              </text>
            </React.Fragment>
          ))}
          
          {/* Time series data */}
          <path 
            d={generatePath(data)} 
            fill="none" 
            stroke="var(--primary-color)" 
            strokeWidth="0.5"
            className="transition-all duration-300"
          />
          
          {/* Moving average line (step 1) */}
          {step >= 1 && (
            <path 
              d={generatePath(movingAverage)} 
              fill="none" 
              stroke="var(--success-color)" 
              strokeWidth="0.5" 
              strokeDasharray="1,1"
              className={`transition-all duration-500 ${animating ? "opacity-50" : "opacity-80"}`}
            />
          )}
          
          {/* ARIMA prediction line (step 2) */}
          {step >= 2 && (
            <path 
              d={generatePath(predictions)} 
              fill="none" 
              stroke="var(--warning-color)" 
              strokeWidth="0.8"
              className={`transition-all duration-500 ${animating ? "opacity-50" : "opacity-80"}`}
            />
          )}
          
          {/* Anomaly points (step 3) */}
          {step >= 3 && anomalies.map((point, i) => (
            <g key={`anomaly-${i}`} className="transition-all duration-500">
              <circle 
                cx={scaleX(point.time)} 
                cy={scaleY(point.value)} 
                r="1.5" 
                fill="var(--danger-color)"
                className={animating ? "animate-pulse" : ""}
              />
              <circle 
                cx={scaleX(point.time)} 
                cy={scaleY(point.value)} 
                r="3" 
                fill="none"
                stroke="var(--danger-color)"
                strokeWidth="0.5"
                className={animating ? "animate-pulse" : ""}
              />
            </g>
          ))}
          
          {/* Legend */}
          <g transform="translate(70, 10)">
            <rect width="24" height={step >= 3 ? "16" : (step >= 2 ? "12" : (step >= 1 ? "8" : "4"))} fill="white" stroke="#ddd" strokeWidth="0.2" />
            
            <line x1="2" y1="2" x2="5" y2="2" stroke="var(--primary-color)" strokeWidth="0.5" />
            <text x="7" y="2.5" fontSize="2" fill="#333" dominantBaseline="middle">Raw Data</text>
            
            {step >= 1 && (
              <>
                <line x1="2" y1="6" x2="5" y2="6" stroke="var(--success-color)" strokeWidth="0.5" strokeDasharray="1,1" />
                <text x="7" y="6.5" fontSize="2" fill="#333" dominantBaseline="middle">Moving Avg</text>
              </>
            )}
            
            {step >= 2 && (
              <>
                <line x1="2" y1="10" x2="5" y2="10" stroke="var(--warning-color)" strokeWidth="0.8" />
                <text x="7" y="10.5" fontSize="2" fill="#333" dominantBaseline="middle">ARIMA Model</text>
              </>
            )}
            
            {step >= 3 && (
              <>
                <circle cx="3.5" cy="14" r="1" fill="var(--danger-color)" />
                <text x="7" y="14.5" fontSize="2" fill="#333" dominantBaseline="middle">Anomalies</text>
              </>
            )}
          </g>
        </svg>
      </div>
      
      <div className="mt-2 text-sm text-gray-700 p-3 card">
        {step === 0 && "This is a time series showing data that fluctuates over time. Notice there are some unusual spikes in the data."}
        {step === 1 && "First, we calculate a moving average (green) to smooth out the time series and identify the overall trend."}
        {step === 2 && "Next, we fit an ARIMA model (orange) that captures the trend, seasonality, and other patterns in the data."}
        {step === 3 && "Finally, we detect anomalies (red circles) by finding points where the actual value deviates significantly from the predicted value."}
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200 info-callout">
        <h3 className="font-semibold mb-2">About Time Series Anomaly Detection:</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>ARIMA Models:</strong> (AutoRegressive Integrated Moving Average) combine autoregression, differencing, and moving average components to model time series data.</li>
          <li><strong>How it works:</strong> The model learns patterns in the data including trends, seasonality, and cyclical patterns, then uses these to make predictions.</li>
          <li><strong>Anomaly Detection:</strong> By comparing actual values with predictions, we can identify unusual points that don't follow the expected patterns.</li>
          <li><strong>Applications:</strong> Used in finance for detecting fraudulent transactions, in IoT for detecting sensor failures, in cybersecurity for identifying unusual network traffic, and more.</li>
          <li><strong>Advantages:</strong> Can detect subtle anomalies that might be missed when only looking at threshold-based approaches.</li>
        </ul>
      </div>
    </div>
  );
};

export default TimeSeriesAnomalyDetection; 