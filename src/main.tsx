import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { officeCssVariables } from './theme/officeTheme'

for (const [property, value] of Object.entries(officeCssVariables)) {
  document.documentElement.style.setProperty(property, String(value))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
