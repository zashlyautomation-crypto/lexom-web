// LEXOM — SplineViewer
// Section: Hero only (home page only)
// Dependencies: spline-viewer web component, useMatchMedia, gsap, ScrollTrigger, react-router-dom
//
// FIX: Replaced ScrollTrigger callback-based sticky/vanish with direct DOM scroll-position
// checks that run immediately on mount. This prevents the 3D watch from bleeding over
// other sections when the user refreshes the page while scrolled past the hero.

import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMatchMedia } from '../../hooks/useMatchMedia'
import MobileVideoFallback from './MobileVideoFallback'

const SPLINE_DESKTOP_URL = 'https://prod.spline.design/zEr2A8Ggk6VhIVrO/scene.splinecode'

/**
 * Synchronously check scroll state against storytelling section DOM position.
 * Uses document.documentElement.scrollTop — the authoritative native browser scroll
 * value that is NOT affected by Lenis's window.scrollY Object.defineProperty override.
 */
function getScrollState() {
  // document.documentElement.scrollTop is the real native scroll offset.
  // window.scrollY may be overridden/stale from Lenis's defineProperty call.
  const scrollY = (
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    window.pageYOffset ||
    0
  )
  const storyEl = document.getElementById('storytelling')

  if (!storyEl) {
    // Storytelling section not in DOM yet — page is at the top
    return { shouldRender: true, opacity: 1 }
  }

  // Use offsetTop for absolute page position (unaffected by current viewport scroll)
  const storyTop = storyEl.offsetTop
  const storyH = storyEl.offsetHeight
  const vanishEnd = storyTop + storyH * 0.25

  if (scrollY >= vanishEnd) {
    // Scrolled completely past the arm/storytelling section → hide watch
    return { shouldRender: false, opacity: 0 }
  }

  if (scrollY >= storyTop) {
    // Inside the fade-out zone (storytelling section visible)
    const progress = (scrollY - storyTop) / (storyH * 0.25)
    return { shouldRender: true, opacity: Math.max(0, 1 - progress) }
  }

  return { shouldRender: true, opacity: 1 }
}

export default function SplineViewer({ className = '', style = {} }) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const isDesktop = useMatchMedia('(min-width: 640px)')

  const [isLoaded, setIsLoaded] = useState(false)

  // Visibility state — initialised SYNCHRONOUSLY
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return { shouldRender: true, opacity: 1 }
    return getScrollState()
  })

  // 1. Force WebGL container pixel constraints to avoid zero-size crash
  const [viewerSize, setViewerSize] = useState({ w: 0, h: 0 })
  const containerRef = useRef(null)
  const viewerRef = useRef(null)

  // Initial Visibility Sync & Dimension Capture
  useEffect(() => {
    if (!isHomePage || !isDesktop) return
    const raf = requestAnimationFrame(() => {
      setVisible(getScrollState())
      
      if (containerRef.current) {
        const measuredW = containerRef.current.clientWidth || window.innerWidth
        const measuredH = containerRef.current.clientHeight || window.innerHeight
        if (measuredW > 0 && measuredH > 0) {
          setViewerSize({ w: measuredW, h: measuredH })
        }
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [isHomePage, isDesktop])

  // Asset Load & Spline Failsafe
  useEffect(() => {
    if (!isDesktop || !isHomePage) return

    const viewer = viewerRef.current
    if (!viewer) return

    const timeoutId = setTimeout(() => {
      setIsLoaded(true)
    }, 3500)

    const handleLoad = () => {
      clearTimeout(timeoutId)
      const canvas = viewer.shadowRoot?.querySelector('canvas')
      if (canvas) canvas.style.background = 'transparent'
      setIsLoaded(true)
    }

    viewer.addEventListener('load', handleLoad)
    return () => {
      clearTimeout(timeoutId)
      viewer.removeEventListener('load', handleLoad)
    }
  }, [isDesktop, isHomePage, visible.shouldRender, viewerSize.w])

  // Load animation
  useEffect(() => {
    if (!isLoaded || !containerRef.current) return
    if (!visible.shouldRender) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: visible.opacity, scale: 1, duration: 1.5, ease: 'power3.out' }
      )
    })
    return () => ctx.revert()
  }, [isLoaded])

  // Scroll listener
  useEffect(() => {
    if (!isDesktop || !isHomePage) return
    const onScroll = () => setVisible(getScrollState())
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isDesktop, isHomePage])

  if (!isHomePage) return null

  if (!isDesktop) {
    return (
      <div className={`spline-container ${className}`} style={{ minHeight: '300px', ...style }}>
        <MobileVideoFallback />
      </div>
    )
  }

  if (!visible.shouldRender) return null

  return (
    <div
      ref={containerRef}
      className={`spline-container ${className}`}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        maxWidth: '1400px',
        zIndex: 10,
        opacity: isLoaded ? visible.opacity : 0,
        pointerEvents: 'none',
        background: 'transparent',
        ...style,
      }}
    >
      {!isLoaded && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '180px', height: '180px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.1)', animation: 'ringPulse 2.5s ease-in-out infinite', position: 'absolute' }} />
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.07)', animation: 'ringPulse 2.5s ease-in-out infinite', animationDelay: '0.5s', position: 'absolute' }} />
        </div>
      )}

      {/* Declarative spline-viewer JSX safely bound to explicit px measurements */}
      {viewerSize.w > 0 && (
        <spline-viewer
          ref={viewerRef}
          url={SPLINE_DESKTOP_URL}
          engine="webgpu"
          renderer="webgpu"
          style={{
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${viewerSize.w}px`,
            height: `${viewerSize.h}px`,
            minWidth: '10px',
            minHeight: '10px',
            background: 'transparent'
          }}
        />
      )}
    </div>
  )
}
