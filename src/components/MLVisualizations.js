import React, { useState, useEffect } from 'react';
import IsolationVsKMeans from './visualizations/IsolationVsKMeans';
import PCAvsRCF from './visualizations/PCAvsRCF';
import TSNE from './visualizations/TSNE';
import TimeSeriesAnomalyDetection from './visualizations/TimeSeriesAnomalyDetection';
import GraphNeuralNetworks from './visualizations/GraphNeuralNetworks';
import DecisionTree from './visualizations/DecisionTree';
import ShareButton from './common/ShareButton';
import { getTabFromHash, updateUrlHash } from '../utils/navigation';

// Main component for ML Visualizations
const MLVisualizations = () => {
  const [activeTab, setActiveTab] = useState(getTabFromHash);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Update hash when tab changes
  useEffect(() => {
    updateUrlHash(activeTab);
  }, [activeTab]);
  
  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
        <button 
          className={`px-4 py-2 rounded ml-2 ${activeTab === 'decision-tree' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('decision-tree')}
          role="tab"
          aria-selected={activeTab === 'decision-tree'}
          aria-controls="panel-decision-tree"
          id="tab-decision-tree"
        >
          <span className="font-medium">Decision Tree Classification</span>
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
            <div className="relative">
              <ShareButton visualizationId="panel-isolation-vs-kmeans" />
              <IsolationVsKMeans isMobile={isMobile} />
            </div>
          </div>
        )}
        
        {activeTab === 'pca-vs-rcf' && (
          <div 
            role="tabpanel" 
            id="panel-pca-vs-rcf" 
            aria-labelledby="tab-pca-vs-rcf"
          >
            <div className="relative">
              <ShareButton visualizationId="panel-pca-vs-rcf" />
              <PCAvsRCF isMobile={isMobile} />
            </div>
          </div>
        )}
        
        {activeTab === 'tsne' && (
          <div 
            role="tabpanel" 
            id="panel-tsne" 
            aria-labelledby="tab-tsne"
          >
            <div className="relative">
              <ShareButton visualizationId="panel-tsne" />
              <TSNE isMobile={isMobile} />
            </div>
          </div>
        )}
        
        {activeTab === 'time-series' && (
          <div 
            role="tabpanel" 
            id="panel-time-series" 
            aria-labelledby="tab-time-series"
          >
            <div className="relative">
              <ShareButton visualizationId="panel-time-series" />
              <TimeSeriesAnomalyDetection isMobile={isMobile} />
            </div>
          </div>
        )}
        
        {activeTab === 'gnn' && (
          <div 
            role="tabpanel" 
            id="panel-gnn" 
            aria-labelledby="tab-gnn"
          >
            <div className="relative">
              <ShareButton visualizationId="panel-gnn" />
              <GraphNeuralNetworks isMobile={isMobile} />
            </div>
          </div>
        )}
        
        {activeTab === 'decision-tree' && (
          <div 
            role="tabpanel" 
            id="panel-decision-tree" 
            aria-labelledby="tab-decision-tree"
          >
            <div className="relative">
              <ShareButton visualizationId="panel-decision-tree" />
              <DecisionTree isMobile={isMobile} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MLVisualizations; 