import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializeDemo } from './services/api';

// Initialize demo and render app
const initializeApp = async () => {
  try {
    const demoStatus = await initializeDemo();
    console.log('🚀 Digital Twin You initialized:', demoStatus);
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Render app anyway for demo purposes
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
};

initializeApp();