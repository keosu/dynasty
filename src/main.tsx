import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './app.css';
import './themes.css';
import { applyTheme, readTheme } from './theme';

// Apply the saved palette before React mounts to avoid a light first frame.
applyTheme(readTheme());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
