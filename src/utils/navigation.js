// Map hash values to tab IDs for easy lookup
export const hashToTabMap = {
  '#isolation-forest': 'isolation-vs-kmeans',
  '#kmeans': 'isolation-vs-kmeans',
  '#pca': 'pca-vs-rcf',
  '#rcf': 'pca-vs-rcf',
  '#tsne': 'tsne',
  '#time-series': 'time-series',
  '#gnn': 'gnn',
  '#decision-tree': 'decision-tree',
  // Add future routes here
};

// Map tab IDs to hash values for URL updates
export const tabToHashMap = {
  'isolation-vs-kmeans': '#isolation-forest',
  'pca-vs-rcf': '#pca',
  'tsne': '#tsne',
  'time-series': '#time-series',
  'gnn': '#gnn',
  'decision-tree': '#decision-tree',
  // Add future routes here
};

// Get tab ID from window location hash
export const getTabFromHash = () => {
  const hash = window.location.hash.toLowerCase();
  return hashToTabMap[hash] || 'isolation-vs-kmeans'; // Default tab
};

// Update URL hash based on active tab
export const updateUrlHash = (activeTab) => {
  const hash = tabToHashMap[activeTab] || '';
  
  // Only update if hash is different to avoid unnecessary history entries
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
}; 