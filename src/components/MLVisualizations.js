import React, { useState, useEffect } from 'react';
import IsolationVsKMeans from './visualizations/IsolationVsKMeans';
import PCAvsRCF from './visualizations/PCAvsRCF';
import TSNE from './visualizations/TSNE';
import TimeSeriesAnomalyDetection from './visualizations/TimeSeriesAnomalyDetection';
import GraphNeuralNetworks from './visualizations/GraphNeuralNetworks';

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
      <div className="tabs-container overflow-x-auto whitespace-nowrap mb-4" role="tablist" aria-label="Machine Learning Algorithm Visualizations">
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
          className={`px-4 py-2 rounded ml-2 ${activeTab === 'pca-vs-rcf' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('pca-vs-rcf')}
          role="tab"
          aria-selected={activeTab === 'pca-vs-rcf'}
          aria-controls="panel-pca-vs-rcf"
          id="tab-pca-vs-rcf"
        >
          <span className="font-medium">PCA vs Random Cut Forests</span>
        </button>
        <button 
          className={`px-4 py-2 rounded ml-2 ${activeTab === 'tsne' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('tsne')}
          role="tab"
          aria-selected={activeTab === 'tsne'}
          aria-controls="panel-tsne"
          id="tab-tsne"
        >
          <span className="font-medium">t-SNE Dimensionality Reduction</span>
        </button>
        <button 
          className={`px-4 py-2 rounded ml-2 ${activeTab === 'time-series' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('time-series')}
          role="tab"
          aria-selected={activeTab === 'time-series'}
          aria-controls="panel-time-series"
          id="tab-time-series"
        >
          <span className="font-medium">Time Series Anomaly Detection</span>
        </button>
        <button 
          className={`px-4 py-2 rounded ml-2 ${activeTab === 'gnn' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('gnn')}
          role="tab"
          aria-selected={activeTab === 'gnn'}
          aria-controls="panel-gnn"
          id="tab-gnn"
        >
          <span className="font-medium">Graph Neural Networks</span>
        </button>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow">
        {activeTab === 'isolation-vs-kmeans' && (
          <div 
            role="tabpanel" 
            id="panel-isolation-vs-kmeans" 
            aria-labelledby="tab-isolation-vs-kmeans"
          >
            <IsolationVsKMeans isMobile={isMobile} />
          </div>
        )}
        
        {activeTab === 'pca-vs-rcf' && (
          <div 
            role="tabpanel" 
            id="panel-pca-vs-rcf" 
            aria-labelledby="tab-pca-vs-rcf"
          >
            <PCAvsRCF isMobile={isMobile} />
          </div>
        )}
        
        {activeTab === 'tsne' && (
          <div 
            role="tabpanel" 
            id="panel-tsne" 
            aria-labelledby="tab-tsne"
          >
            <TSNE isMobile={isMobile} />
          </div>
        )}
        
        {activeTab === 'time-series' && (
          <div 
            role="tabpanel" 
            id="panel-time-series" 
            aria-labelledby="tab-time-series"
          >
            <TimeSeriesAnomalyDetection isMobile={isMobile} />
          </div>
        )}
        
        {activeTab === 'gnn' && (
          <div 
            role="tabpanel" 
            id="panel-gnn" 
            aria-labelledby="tab-gnn"
          >
            <GraphNeuralNetworks isMobile={isMobile} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MLVisualizations; 