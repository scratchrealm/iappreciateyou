import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/caveat'
import '@fontsource/dancing-script'
import '@fontsource/patrick-hand'
import '@fontsource/shadows-into-light'
import '@fontsource/lora'
import '@fontsource/playfair-display'
import '@fontsource/cormorant-garamond'
import '@fontsource/quicksand'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
