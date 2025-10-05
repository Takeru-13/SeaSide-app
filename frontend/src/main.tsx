import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes';
import '../src/shared/styles/globals.css'; 


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
