import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@coreui/coreui/dist/css/coreui.min.css'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
