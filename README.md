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
   - Interactive 3D to 2D visualization
   - Understand how t-SNE preserves neighborhood relationships

4. **Time Series Anomaly Detection**
   - Visualize ARIMA-based anomaly detection
   - Step-by-step breakdown of the modeling process

5. **Graph Neural Networks**
   - Interactive message passing visualization
   - Node feature space transformations and evolution

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
- Interact with the visualizations by hovering over elements to see additional information
- Visualizations work on both desktop and mobile devices

## Project Structure

```
ml-visualizations/
├── public/                   # Static files
├── src/                      # Source code
│   ├── components/           # React components
│   │   ├── common/           # Shared UI components
│   │   │   └── StepNavigation.js
│   │   ├── visualizations/   # Individual visualization components
│   │   │   ├── IsolationVsKMeans.js
│   │   │   ├── PCAvsRCF.js
│   │   │   ├── TSNE.js
│   │   │   ├── TimeSeriesAnomalyDetection.js
│   │   │   └── GraphNeuralNetworks.js
│   │   └── MLVisualizations.js
│   ├── utils/                # Utility functions
│   │   └── dataGenerators.js # Functions to generate sample data
│   ├── App.js                # Main app component
│   ├── App.css               # Main styles
│   └── index.js              # Entry point
└── package.json              # Dependencies and scripts
```

## Future Enhancements

- Add more ML algorithm visualizations (e.g., neural networks, decision trees)
- Implement real-time data processing with actual ML libraries
- Add ability to upload custom datasets for visualization
- Implement interactive parameter tuning to see how algorithms behave

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various educational resources on machine learning
- Thanks to the creators of the libraries used in this project
