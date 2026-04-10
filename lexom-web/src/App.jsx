// LEXOM — App Root
// Section: Global
// Dependencies: react, react-redux, gsap, barbaConfig, lenisConfig
// Routing and global utilities.

import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'
import { initLenis } from './utils/lenisConfig'

// Components
import CartSidebar from './components/ui/CartSidebar'
import ToastNotification from './components/ui/ToastNotification'
import IntroTransition from './components/ui/IntroTransition'

// Pages
import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import AboutPage from './pages/AboutPage'
import BrandPage from './pages/BrandPage'
import ProductOverviewPage from './pages/ProductOverviewPage'
import CheckoutPage from './pages/CheckoutPage'
import NotFoundPage from './pages/NotFoundPage'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    initLenis()

    // Phase 1: Immediately after Lenis init — rAF ensures Lenis has emitted its
    // first scroll event (with the correct restored scroll position from the browser),
    // so ScrollTrigger reads the real scroll position on page refresh.
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    // Phase 2: After layout settles (fonts, images may shift layout)
    const t1 = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 500)

    // Phase 3: Final catch-all for late-loading assets
    const t2 = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 1200)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div>
      {/* ── Cinematic intro — shows once per session on homepage load only ── */}
      <IntroTransition />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/brand" element={<BrandPage />} />
        <Route path="/product/:id" element={<ProductOverviewPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        
        {/* Redirects for common missing paths or old links */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/story" element={<Navigate to="/about" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <CartSidebar />
      <ToastNotification />
    </div>
  )
}
