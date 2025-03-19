import React from 'react';
import './App.css';
import MLVisualizations from './components/MLVisualizations';
import ThemeToggle from './components/common/ThemeToggle';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="title-container">
            <h1>Machine Learning Algorithm Visualizations</h1>
            <p>Interactive visualizations for understanding ML concepts</p>
          </div>
          <div className="controls-container">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="App-main">
        <MLVisualizations />
      </main>
      <footer className="App-footer">
        <p>Created with React | Educational tool for ML visualizations</p>
      </footer>
    </div>
  );
}

export default App;