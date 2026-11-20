import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

import {
  ThemeProvider,
  ToastProvider,
  DialogProvider,
  TooltipProvider,
  MotionProvider,
  ErrorBoundary,
  AuthProvider,
} from '@/app/providers';
import { initDB } from '@/app/bootstrap/initDB';
import { initSeed } from '@/app/bootstrap/initSeed';
import { initPWA } from '@/app/bootstrap/initPWA';

async function bootstrap() {
  try {
    await initDB();
    await initSeed();
  } catch (err) {
    console.error('[FinX] DB bootstrap failed:', err);
  }
  void initPWA();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <ThemeProvider>
          <MotionProvider>
            <ToastProvider>
              <DialogProvider>
                <TooltipProvider>
                  <AuthProvider>
                    <BrowserRouter>
                      <App />
                    </BrowserRouter>
                  </AuthProvider>
                </TooltipProvider>
              </DialogProvider>
            </ToastProvider>
          </MotionProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  );
}

void bootstrap();