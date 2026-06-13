import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import PowerProvider from './PowerProvider'
import { initSP } from "./services/sharepointService";
declare global { interface Window { _pcfContext?: any; } }
if (window._pcfContext) { initSP(window._pcfContext); }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PowerProvider>
      <App />
    </PowerProvider>
  </StrictMode>
)
