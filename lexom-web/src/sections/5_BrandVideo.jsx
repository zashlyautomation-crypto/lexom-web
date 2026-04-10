import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { VolumeX, Volume2 } from 'lucide-react'
import brandVideo from '../assets/brand-trailer/0331.mp4'

gsap.registerPlugin(ScrollTrigger)

function PlayPauseButton({ videoRef }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  // Sync state with actual video state
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [videoRef])

  return (
    <motion.button
      onClick={togglePlay}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="brand-video-play-button"
      style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: isHovered
          ? 'rgba(255,255,255,0.22)'
          : 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '0.5px solid rgba(255,255,255,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.25s ease',
      }}
    >
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.div
            key="pause"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
            }}
          >
            {/* Pause icon — two bars */}
            <div style={{
              width: '3px',
              height: '18px',
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '2px',
            }} />
            <div style={{
              width: '3px',
              height: '18px',
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '2px',
            }} />
          </motion.div>
        ) : (
          <motion.div
            key="play"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            style={{
              width: 0,
              height: 0,
              borderTop: '9px solid transparent',
              borderBottom: '9px solid transparent',
              borderLeft: '16px solid rgba(255,255,255,0.9)',
              marginLeft: '3px',
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function MuteButton({ videoRef }) {
  const [isMuted, setIsMuted] = useState(true)

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <motion.button
      onClick={toggleMute}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      className="brand-video-mute-button"
      style={{
        position: 'absolute',
        bottom: '40px',
        right: '48px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
        border: '0.5px solid rgba(255,255,255,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 5,
      }}
    >
      {isMuted ? (
        <VolumeX size={16} color="rgba(255,255,255,0.8)" />
      ) : (
        <Volume2 size={16} color="rgba(255,255,255,0.8)" />
      )}
    </motion.button>
  )
}

export default function BrandVideo() {
  const sectionRef = useRef(null)
  const videoContainerRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sectionEl = sectionRef.current
      const videoContainerEl = videoContainerRef.current
      if (!sectionEl || !videoContainerEl) return

      // Initial state — video is small and hidden
      gsap.set(videoContainerEl, {
        width: '60%',
        height: '55vh',
        borderRadius: '20px',
        opacity: 0,
        scale: 0.85,
        y: 40,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'brand-video-reveal',
          trigger: sectionEl,
          start: 'top 60%',
          end: 'bottom 40%',
          toggleActions: 'play reverse play reverse',
          onEnter: () => {
            if (videoRef.current) {
              videoRef.current.muted = true
              videoRef.current.play().catch(() => {})
            }
          },
          onLeave: () => {
            if (videoRef.current) videoRef.current.pause()
          },
          onEnterBack: () => {
            if (videoRef.current) videoRef.current.play().catch(() => {})
          },
          onLeaveBack: () => {
            if (videoRef.current) videoRef.current.pause()
          }
        }
      })

      tl.to(videoContainerEl, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
      })

      tl.to(videoContainerEl, {
        width: '100%',
        height: '100vh',
        borderRadius: '0px',
        duration: 0.9,
        ease: 'power4.inOut',
      }, '-=0.1')

      tl.fromTo('.brand-video-overlay', {
        opacity: 0,
      }, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.2')

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="brand-video"
      className="brand-video-section"
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        ref={videoContainerRef}
        className="brand-video-container"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#000000',
        }}
      >
        <video
          ref={videoRef}
          src={brandVideo}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            background: '#000',
          }}
          loop
          muted
          playsInline
          preload="metadata"
        />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        <div
          className="brand-video-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
          }}
        >
          <PlayPauseButton videoRef={videoRef} />
        </div>

        <div
          className="brand-video-overlay brand-video-bottom-overlay"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '40px 48px',
            zIndex: 3,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            opacity: 0,
          }}
        >
          <div>
            <p style={{
              margin: '0 0 8px 0',
              fontSize: '0.65rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 400,
            }}>
              THE MANIFESTO
            </p>
            <h2 className="brand-video-tagline" style={{
              margin: 0,
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.9)',
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.02em',
              lineHeight: 1.2,
            }}>
              Time is the ultimate luxury.
            </h2>
          </div>

          <div style={{
            textAlign: 'right',
          }}>
            <span style={{
              fontFamily: 'Bodoni Moda, serif', /* Using Bodoni Moda instead of Kilotype_Sequenz as it is loaded */
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.12em',
            }}>
              LEXOM
            </span>
          </div>
        </div>

        <div className="brand-video-overlay">
          <MuteButton videoRef={videoRef} />
        </div>
      </div>
    </section>
  )
}
