// LEXOM — Mobile Spline Fallback
// Used by SplineViewer for screens < 640px.
// FAST LOAD: Mounts immediately → starts CDN download at once → fades in when ready.
// Explicit pixel dimensions prevent WebGL zero-size errors.
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

const MOBILE_SPLINE_URL = 'https://prod.spline.design/2MH-9oNhNBNZVL9y/scene.splinecode'
const FIXED_HEIGHT = 360 // px — hardcoded; never 0

export default function MobileVideoFallback({ className = '' }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  
  // Strict pixel guard for WebGL
  const [viewerSize, setViewerSize] = useState({ w: 0, h: 0 })

  // Dimension Guard
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (containerRef.current) {
        const measuredW = containerRef.current.clientWidth || window.innerWidth
        if (measuredW > 0) {
          setViewerSize({ w: Math.round(measuredW), h: FIXED_HEIGHT })
        }
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  // Asset Load Listener & Failsafe
  useEffect(() => {
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
  }, [viewerSize.w])

  // GSAP float animation after load
  useEffect(() => {
    if (!isLoaded || !containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { y: 0 },
        { y: -6, duration: 3, ease: 'power1.inOut', yoyo: true, repeat: -1 }
      )
    })
    return () => ctx.revert()
  }, [isLoaded])

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex items-center justify-center ${className}`}
      style={{
        height: `${FIXED_HEIGHT}px`,
        pointerEvents: 'none',
      }}
    >
      <div 
        style={{ 
          position: 'absolute', inset: 0, 
          opacity: isLoaded ? 1 : 0, transition: 'opacity 0.8s ease' 
        }}
      >
        {viewerSize.w > 0 && (
          <spline-viewer
            ref={viewerRef}
            url={MOBILE_SPLINE_URL}
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
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>

      {/* Shimmer placeholder while scene loads */}
      {!isLoaded && (
        <div style={{
          position: 'absolute', width: '220px', height: '220px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          animation: 'pulse 2s ease-in-out infinite'
        }} />
      )}
    </div>
  )
}
