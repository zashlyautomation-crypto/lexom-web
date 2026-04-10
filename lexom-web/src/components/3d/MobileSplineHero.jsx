// LEXOM — Mobile Spline Hero
// Mobile-only 3D scene for the Hero section (shown only below lg / 1024px).
// Uses <spline-viewer> web component — single runtime, no Three.js duplication.
// FAST LOAD: Mounts immediately → starts CDN download instantly → fades in when ready.

import { useState, useEffect, useRef } from 'react'

const MOBILE_SCENE_URL = 'https://prod.spline.design/2MH-9oNhNBNZVL9y/scene.splinecode'

function SplineLoader() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'transparent',
    }}>
      <div style={{
        width: '180px', height: '180px', borderRadius: '50%',
        border: '0.5px solid rgba(255,255,255,0.15)',
        position: 'absolute', animation: 'mobileSplinePulse 2.5s ease-in-out infinite',
      }} />
      <div style={{
        width: '110px', height: '110px', borderRadius: '50%',
        border: '0.5px solid rgba(255,255,255,0.1)',
        position: 'absolute', animation: 'mobileSplinePulse 2.5s ease-in-out infinite',
        animationDelay: '0.5s',
      }} />
      <span style={{
        fontSize: '0.55rem', letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
        fontFamily: 'DM Sans, sans-serif', userSelect: 'none',
      }}>Loading</span>
      <style>{`
        @keyframes mobileSplinePulse {
          0%   { transform: scale(0.95); opacity: 0.4; }
          50%  { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(0.95); opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

export default function MobileSplineHero({ className = '' }) {
  const [loaded, setLoaded] = useState(false)
  const viewerRef = useRef(null)
  const containerRef = useRef(null)

  // Force strict pixel layouts targeting the parent element bounds
  const [viewerSize, setViewerSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (containerRef.current) {
        const measuredW = containerRef.current.clientWidth || window.innerWidth
        const measuredH = containerRef.current.clientHeight || (window.innerHeight * 0.55)
        if (measuredW > 0 && measuredH > 0) {
          setViewerSize({ w: Math.round(measuredW), h: Math.round(measuredH) })
        }
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    // Timeout failsafe if CDN load is silent
    const timeoutId = setTimeout(() => {
      setLoaded(true)
    }, 3500)

    const handleLoad = () => {
      clearTimeout(timeoutId)
      // Force internal Canvas to be transparent (bypasses Spline scene bgColor)
      const canvas = viewer.shadowRoot?.querySelector('canvas')
      if (canvas) canvas.style.background = 'transparent'
      setLoaded(true)
    }

    viewer.addEventListener('load', handleLoad)
    return () => {
      clearTimeout(timeoutId)
      viewer.removeEventListener('load', handleLoad)
    }
  }, [viewerSize.w])

  return (
    <div ref={containerRef} className={`relative w-full h-full flex items-center justify-center ${className}`} style={{ overflow: 'visible' }}>
      {/* Container fading handles the asset appearance */}
      <div 
        style={{ 
          position: 'absolute', inset: 0, 
          opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' 
        }}
      >
        {/* Declarative spline-viewer insertion perfectly managed by React with BOUNDS! */}
        {viewerSize.w > 0 && (
          <spline-viewer
            ref={viewerRef}
            url={MOBILE_SCENE_URL}
            engine="webgpu"
            renderer="webgpu"
            style={{
              display: 'block',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${viewerSize.w}px`,
              height: `${viewerSize.h}px`,
              minWidth: '10px',
              minHeight: '10px',
              background: 'transparent',
              transform: 'translate(-50%, -50%) scale(1.8)',
              transformOrigin: 'center center',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>

      {!loaded && <SplineLoader />}
    </div>
  )
}
