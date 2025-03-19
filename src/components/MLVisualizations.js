import React, { useState, useEffect, useRef } from 'react';
import IsolationVsKMeans from './visualizations/IsolationVsKMeans';
import PCAvsRCF from './visualizations/PCAvsRCF';
import TSNE from './visualizations/TSNE';
import TimeSeriesAnomalyDetection from './visualizations/TimeSeriesAnomalyDetection';
import GraphNeuralNetworks from './visualizations/GraphNeuralNetworks';
import DecisionTree from './visualizations/DecisionTree';
import ShareButton from './common/ShareButton';
import { getTabFromHash, updateUrlHash } from '../utils/navigation';

// Tab definitions for easier management
const TABS = [
  { id: 'isolation-vs-kmeans', label: 'Isolation Forests vs K-Means', description: 'Compare outlier detection with clustering' },
  { id: 'pca-vs-rcf', label: 'PCA vs Random Cut Forests', description: 'Dimensionality reduction techniques' },
  { id: 'tsne', label: 't-SNE Dimensionality Reduction', description: 'Visualize high-dimensional data' },
  { id: 'time-series', label: 'Time Series Anomaly Detection', description: 'Find anomalies in time series data' },
  { id: 'gnn', label: 'Graph Neural Networks', description: 'Neural networks for graph-structured data' },
  { id: 'decision-tree', label: 'Decision Tree Classification', description: 'Tree-based classification algorithm' },
];

// Main component for ML Visualizations
const MLVisualizations = () => {
  const [activeTab, setActiveTab] = useState(getTabFromHash);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visitedTabs, setVisitedTabs] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('ml-viz-visited-tabs');
    return saved ? JSON.parse(saved) : [getTabFromHash()];
  });
  
  const dropdownRef = useRef(null);
  
  // Get current tab info
  const currentTab = TABS.find(tab => tab.id === activeTab) || TABS[0];
  
  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsDropdownOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Update hash when tab changes and track visited tabs
  useEffect(() => {
    updateUrlHash(activeTab);
    
    // Add to visited tabs if not already there
    if (!visitedTabs.includes(activeTab)) {
      const newVisitedTabs = [...visitedTabs, activeTab];
      setVisitedTabs(newVisitedTabs);
      localStorage.setItem('ml-viz-visited-tabs', JSON.stringify(newVisitedTabs));
    }
  }, [activeTab, visitedTabs]);
  
  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsDropdownOpen(false);
  };
  
  return (
    <div className="component-container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-nav" aria-label="Breadcrumb">
        <span>Home</span>
        <span className="breadcrumb-separator" aria-hidden="true">›</span>
        <span>{currentTab.label}</span>
      </div>
    
      {/* Tab Navigation - Desktop */}
      {!isMobile ? (
        <div className="tabs-container" role="tablist" aria-label="Machine Learning Algorithm Visualizations">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'tab-active' : ''} ${visitedTabs.includes(tab.id) ? 'tab-visited' : ''}`}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              title={tab.description}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : (
        /* Tab Navigation - Mobile (Dropdown) */
        <div className="tabs-dropdown" ref={dropdownRef}>
          <button 
            className="mobile-nav-trigger"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-controls="mobile-tabs-menu"
          >
            <span>{currentTab.label}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDropdownOpen ? 'rotate-180' : ''}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          <div 
            id="mobile-tabs-menu"
            className={`tabs-dropdown-content ${isDropdownOpen ? 'open' : ''}`}
            role="menu"
          >
            {TABS.map(tab => (
              <button 
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'tab-active' : ''} ${visitedTabs.includes(tab.id) ? 'tab-visited' : ''}`}
                onClick={() => handleTabChange(tab.id)}
                role="menuitem"
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Content Area with sharing capability */}
      <div className="visualization-content">
        <div className="visualization-header-wrapper">
          <div className="share-panel">
            <ShareButton visualizationId={activeTab} />
          </div>
        </div>
        
        {/* Render active tab content */}
        {TABS.map(tab => (
          activeTab === tab.id && (
            <div 
              key={tab.id}
              role="tabpanel" 
              id={`panel-${tab.id}`} 
              aria-labelledby={`tab-${tab.id}`}
              className="bento-container fade-in"
            >
              {tab.id === 'isolation-vs-kmeans' && <IsolationVsKMeans isMobile={isMobile} />}
              {tab.id === 'pca-vs-rcf' && <PCAvsRCF isMobile={isMobile} />}
              {tab.id === 'tsne' && <TSNE isMobile={isMobile} />}
              {tab.id === 'time-series' && <TimeSeriesAnomalyDetection isMobile={isMobile} />}
              {tab.id === 'gnn' && <GraphNeuralNetworks isMobile={isMobile} />}
              {tab.id === 'decision-tree' && <DecisionTree isMobile={isMobile} />}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default MLVisualizations;
