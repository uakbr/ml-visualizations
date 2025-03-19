import React, { useState } from 'react';

const ShareButton = ({ visualizationId }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleDownload = () => {
    // Get the SVG element
    const svgElement = document.querySelector(`#${visualizationId} svg`);
    if (!svgElement) {
      console.error('SVG element not found');
      return;
    }
    
    // Create a clone of the SVG to avoid modifying the original
    const svgClone = svgElement.cloneNode(true);
    
    // Add xmlns attribute for valid SVG
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    // Convert SVG to string
    const svgData = new XMLSerializer().serializeToString(svgClone);
    
    // Create a Blob from the SVG data
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ml-visualization-${visualizationId}.svg`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Close the options
    setShowOptions(false);
  };
  
  const handleCopyLink = () => {
    // Create URL with visualization tab in the hash
    const url = `${window.location.origin}${window.location.pathname}#${visualizationId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
          setShowOptions(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };
  
  return (
    <div className="share-button-container">
      <button 
        className="share-button"
        onClick={() => setShowOptions(!showOptions)}
        aria-label="Share or download visualization"
        title="Share or download visualization"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>
      
      {showOptions && (
        <div className="share-options">
          <button 
            className="share-option-btn"
            onClick={handleDownload}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download SVG</span>
          </button>
          
          <button 
            className="share-option-btn"
            onClick={handleCopyLink}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span>{copied ? "Link copied!" : "Copy link"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton; 