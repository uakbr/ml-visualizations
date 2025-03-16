import React from 'react';
import './App.css';
import MLVisualizations from './components/MLVisualizations';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Machine Learning Algorithm Visualizations</h1>
        <p>Interactive comparisons of clustering, anomaly detection, and dimensionality reduction</p>
      </header>
      <main className="App-main">
        <MLVisualizations />
      </main>
      <footer className="App-footer">
        <p>Created with React | Deployed on Netlify</p>
      </footer>
    </div>
  );
}

export default App;