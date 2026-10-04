import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { AuthProvider } from '@/app/AuthProvider';
import { UpdatePrompt } from '@/app/pwa';
import { AppRoutes } from '@/app/routes';
import { db } from '@/core/db';
import { FeedbackProvider } from '@/ui';
import './styles/index.css';

// Warm up Firestore early; pages also self-initialise, so a failure here is not fatal.
db.init().catch((e) => console.error('Database init failed', e));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FeedbackProvider>
          <AppRoutes />
          <UpdatePrompt />
        </FeedbackProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
