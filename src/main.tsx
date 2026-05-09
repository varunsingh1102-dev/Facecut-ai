import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Radical fix for 'Cannot set property fetch of #<Window>'
if (typeof window !== 'undefined') {
  const _fetch = window.fetch;
  try {
    Object.defineProperty(window, 'fetch', {
      get: () => _fetch,
      set: (v) => { console.warn('Intercepted fetch rewrite'); },
      configurable: true
    });
  } catch (e) {}
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
