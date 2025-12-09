import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {store} from "./services/store";

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </React.StrictMode>
);

// Service Worker registration for PWA and push notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            console.log('[SW] New service worker found, installing...');
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW] New service worker installed and ready');
                // Optionally notify user about update
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
  
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[SW] Service worker now controlling this page');
  });
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



