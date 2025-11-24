import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Configure global Cesium Base URL to use CDN to avoid local asset build issues in simple environments
// In a production Vite/Webpack setup, you would usually copy assets or use the 'cesium' npm package assets.
(window as any).CESIUM_BASE_URL = "https://cesium.com/downloads/cesiumjs/releases/1.114/Build/Cesium/";

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // StrictMode is removed here because CesiumJS has known issues with React 18 StrictMode double-mounting
  // which causes the viewer to crash or leak webgl contexts if not cleaned up perfectly synchronously.
  // While we have cleanup logic, for a smoother dev experience with Cesium, we disable it at root.
    <App />
);
