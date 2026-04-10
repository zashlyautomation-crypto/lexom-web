// LEXOM — Application Entry Point
// Dependencies: react, react-dom, react-redux, store, lenisConfig, index.css
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store/store'
import { initLenis } from './utils/lenisConfig'
import App from './App'
import './index.css'
import './styles/index.css'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins BEFORE initLenis
gsap.registerPlugin(ScrollTrigger)

// Initialize Lenis smooth scroll before rendering
// GSAP ticker sync is handled inside initLenis()
// DEFERRED: initLenis() is now called in App.jsx after LoadingScreen

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
