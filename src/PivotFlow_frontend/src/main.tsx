import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { authService } from './lib/auth';

async function init() {
  try {
    console.log('Initializing application...');
    await authService.init();
    console.log('Auth service initialized');
    
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
}

init();
