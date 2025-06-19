import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { authService } from './lib/auth';
import { ThemeProvider } from './contexts/ThemeContext'; // Import ThemeProvider

async function init() {
  try {
    console.log('Initializing application...');
    await authService.init();
    console.log('Auth service initialized');
    
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
}

init();
