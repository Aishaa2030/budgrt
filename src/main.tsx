import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import PowerProvider from './PowerProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PowerProvider>
      <App />
    </PowerProvider>
  </StrictMode>
)