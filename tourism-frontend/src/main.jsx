import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.module.css';

// StrictMode is a development-only tool that highlights potential problems
// in an application by activating additional checks and warnings for its descendants. 
// It does not render any visible UI and has no impact on production builds.


// createRoot is the standard method for initializing a React application by 
// connecting it to a DOM element.


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);



