import React, { useState, useEffect } from 'react';
import './App.css';
import MLVisualizations from './components/MLVisualizations';
import ThemeToggle from './components/common/ThemeToggle';

function App() {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll to toggle header compact styling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="App">
      <header className={`App-header ${scrolled ? 'header-scrolled' : ''}`}>
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
        <p>
          Created with React | Educational tool for ML visualizations | 
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="ml-2">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
