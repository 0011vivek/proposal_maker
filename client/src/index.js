import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ IMPORTANT
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
