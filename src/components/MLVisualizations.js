import React, { useState, useEffect } from 'react';
import IsolationVsKMeans from './visualizations/IsolationVsKMeans';
import PCAvsRCF from './visualizations/PCAvsRCF';
import TSNE from './visualizations/TSNE';
import TimeSeriesAnomalyDetection from './visualizations/TimeSeriesAnomalyDetection';
import GraphNeuralNetworks from './visualizations/GraphNeuralNetworks';
import DecisionTree from './visualizations/DecisionTree';
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
    <div className="component-container flex flex-col w-full h-full">
      {/* Tab Navigation */}
      <div className="tabs-container overflow-x-auto mb-6" role="tablist" aria-label="Machine Learning Algorithm Visualizations">
        <button 
          className={`tab-button ${activeTab === 'isolation-vs-kmeans' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('isolation-vs-kmeans')}
          role="tab"
          aria-selected={activeTab === 'isolation-vs-kmeans'}
          aria-controls="panel-isolation-vs-kmeans"
          id="tab-isolation-vs-kmeans"
        >
          Isolation Forests vs K-Means
        </button>
        <button 
          className={`tab-button ${activeTab === 'pca-vs-rcf' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('pca-vs-rcf')}
          role="tab"
          aria-selected={activeTab === 'pca-vs-rcf'}
          aria-controls="panel-pca-vs-rcf"
          id="tab-pca-vs-rcf"
        >
          PCA vs Random Cut Forests
        </button>
        <button 
          className={`tab-button ${activeTab === 'tsne' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('tsne')}
          role="tab"
          aria-selected={activeTab === 'tsne'}
          aria-controls="panel-tsne"
          id="tab-tsne"
        >
          t-SNE Dimensionality Reduction
        </button>
        <button 
          className={`tab-button ${activeTab === 'time-series' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('time-series')}
          role="tab"
          aria-selected={activeTab === 'time-series'}
          aria-controls="panel-time-series"
          id="tab-time-series"
        >
          Time Series Anomaly Detection
        </button>
        <button 
          className={`tab-button ${activeTab === 'gnn' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('gnn')}
          role="tab"
          aria-selected={activeTab === 'gnn'}
          aria-controls="panel-gnn"
          id="tab-gnn"
        >
          Graph Neural Networks
        </button>
        <button 
          className={`tab-button ${activeTab === 'decision-tree' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('decision-tree')}
          role="tab"
          aria-selected={activeTab === 'decision-tree'}
          aria-controls="panel-decision-tree"
          id="tab-decision-tree"
        >
          Decision Tree Classification
        </button>
      </div>
      
      {/* Content Area */}
      <div className="visualization-content">
        {activeTab === 'isolation-vs-kmeans' && (
          <div 
            role="tabpanel" 
            id="panel-isolation-vs-kmeans" 
            aria-labelledby="tab-isolation-vs-kmeans"
            className="bento-container"
          >
            <IsolationVsKMeans isMobile={isMobile} />
          </div>
        )}
        
        {activeTab === 'pca-vs-rcf' && (
          <div 
            role="tabpanel" 
            id="panel-pca-vs-rcf" 
            aria-labelledby="tab-pca-vs-rcf"
            className="bento-container"
          >
            <PCAvsRCF isMobile={isMobile} />
          </div>
        )}
        
        {activeTab === 'tsne' && (
          <div 
            role="tabpanel" 
            id="panel-tsne" 
            aria-labelledby="tab-tsne"
            className="bento-container"
          >
            <TSNE isMobile={isMobile} />
          </div>
        )}
        
        {activeTab === 'time-series' && (
          <div 
            role="tabpanel" 
            id="panel-time-series" 
            aria-labelledby="tab-time-series"
            className="bento-container"
          >
            <TimeSeriesAnomalyDetection isMobile={isMobile} />
          </div>
        )}
        
        {activeTab === 'gnn' && (
          <div 
            role="tabpanel" 
            id="panel-gnn" 
            aria-labelledby="tab-gnn"
            className="bento-container"
          >
            <GraphNeuralNetworks isMobile={isMobile} />
          </div>
        )}
        
        {activeTab === 'decision-tree' && (
          <div 
            role="tabpanel" 
            id="panel-decision-tree" 
            aria-labelledby="tab-decision-tree"
            className="bento-container"
          >
            <DecisionTree isMobile={isMobile} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MLVisualizations; 