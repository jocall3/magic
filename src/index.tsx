import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Find the root element in the public/index.html file.
const rootElement = document.getElementById('root');

// It's a good practice to ensure the root element exists before trying to render the app.
if (!rootElement) {
  throw new Error("Fatal Error: The root element with ID 'root' was not found in the DOM. The React application cannot be mounted.");
}

// Create a root for the React application using the concurrent mode API.
const root = ReactDOM.createRoot(rootElement);

// Render the main App component into the root.
// React.StrictMode is a wrapper that helps with highlighting potential problems in an application.
// It activates additional checks and warnings for its descendants. It only runs in development mode.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, you can pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();