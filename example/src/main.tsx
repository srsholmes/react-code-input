import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Demo from './Demo';
import './index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Demo />
  </StrictMode>
);
