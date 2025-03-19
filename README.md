# Machine Learning Algorithm Visualizations

An interactive web application demonstrating various machine learning algorithms and techniques through visual, step-by-step explanations.

## Features

This application provides interactive visualizations for several machine learning concepts:

1. **Isolation Forests vs K-Means Clustering**
   - Compare anomaly detection versus clustering approaches
   - Visualize how each algorithm processes the same dataset differently

2. **PCA vs Random Cut Forests**
   - Understand dimensionality reduction through Principal Component Analysis
   - Compare with how Random Cut Forests identify anomalies

3. **t-SNE Dimensionality Reduction**
   - Interactive 3D to 2D visualization with draggable rotation
   - Understand how t-SNE preserves neighborhood relationships

4. **Time Series Anomaly Detection**
   - Visualize ARIMA-based anomaly detection
   - Step-by-step breakdown of the modeling process

5. **Graph Neural Networks**
   - Interactive message passing visualization
   - Node feature space transformations and evolution

6. **Decision Tree Classification**
   - Interactive decision tree construction
   - Feature space partitioning visualization

## Enhanced Features

- **Dark Mode Toggle**: Switch between light and dark themes for comfortable viewing
- **Responsive Design**: Works on all screen sizes from mobile to desktop
- **URL Sharing**: Share specific visualizations with direct links
- **SVG Export**: Download any visualization as an SVG file
- **Step-by-Step Walkthrough**: Each visualization includes an interactive step-by-step guide
- **Interactive Elements**: Hover over data points and nodes for additional information

## Technologies Used

- React 19.0.0
- D3.js for data visualization
- SVG animations for interactive explanations
- Responsive design for all device sizes

## Getting Started

### Prerequisites

- Node.js (v18.0 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ml-visualizations.git
   cd ml-visualizations
   ```

2. Create and activate a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Usage

- Navigate between different visualizations using the tab navigation at the top
- Use the step navigation buttons to progress through each explanation
- Toggle between light and dark themes using the theme button in the header
- Share or download visualizations using the share button in each visualization
- Interact with the visualizations by hovering over elements to see additional information
- Drag to rotate 3D visualizations in the t-SNE component

## Project Structure

```
ml-visualizations/
├── public/                   # Static files
├── src/                      # Source code
│   ├── components/           # React components
│   │   ├── common/           # Shared UI components
│   │   │   ├── ShareButton.js
│   │   │   ├── StepNavigation.js
│   │   │   └── ThemeToggle.js
│   │   ├── visualizations/   # Individual visualization components
│   │   │   ├── IsolationVsKMeans.js
│   │   │   ├── PCAvsRCF.js
│   │   │   ├── TSNE.js
│   │   │   ├── TimeSeriesAnomalyDetection.js
│   │   │   ├── GraphNeuralNetworks.js
│   │   │   └── DecisionTree.js
│   │   └── MLVisualizations.js
│   ├── utils/                # Utility functions
│   │   └── dataGenerators.js # Functions to generate sample data
│   ├── App.js                # Main app component
│   ├── App.css               # Main styles
│   └── index.js              # Entry point
└── package.json              # Dependencies and scripts
```

## Future Enhancements

- Add more ML algorithm visualizations (neural networks, transformers)
- Implement real-time data processing with actual ML libraries
- Add ability to upload custom datasets for visualization
- Implement interactive parameter tuning to see how algorithms behave
- Add more advanced animations and transitions between visualization states
- Create a tutorial mode with guided walkthroughs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various educational resources on machine learning
- Thanks to the creators of the libraries used in this project
