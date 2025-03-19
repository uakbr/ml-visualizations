import React, { useState } from 'react';

const ShareButton = ({ visualizationId }) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleShare = () => {
    // Generate a URL with the specific visualization hash
    const shareUrl = `${window.location.origin}${window.location.pathname}#${visualizationId}`;
    
    // Use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'ML Visualization',
        text: 'Check out this ML visualization!',
        url: shareUrl,
      })
      .catch(error => {
        console.error('Error sharing:', error);
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setShowTooltip(true);
        
        // Hide tooltip after 2 seconds
        setTimeout(() => {
          setShowTooltip(false);
          setTimeout(() => setCopied(false), 300);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy to clipboard:', err);
      });
  };

  return (
    <div className="share-button-container" style={{ position: 'relative' }}>
      <button
        className="share-button"
        onClick={handleShare}
        aria-label="Share this visualization"
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
          <polyline points="16 6 12 2 8 6"></polyline>
          <line x1="12" y1="2" x2="12" y2="15"></line>
        </svg>
        {copied ? 'Copied!' : 'Share'}
      </button>
      
      <div className={`tooltip ${showTooltip ? 'visible' : ''}`} role="status">
        Link copied to clipboard!
      </div>
    </div>
  );
};

export default ShareButton;
