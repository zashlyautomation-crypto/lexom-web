// LEXOM — VideoModal
// Section: Hero (triggered from video card)
// Dependencies: framer-motion, redux modalSlice,
//               trailer video asset, gsap

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { toggleVideoModal } from '../../store/modalSlice'
import { X } from 'lucide-react'
import trailerVideo from '../../assets/trailer/final-trailor.mp4'

export default function VideoModal() {
  const dispatch = useDispatch()
  const isOpen = useSelector(
    state => state.modal.isVideoModalOpen
  )
  const videoRef = useRef(null)

  // Auto-play when modal opens
  // Auto-pause when modal closes
  useEffect(() => {
    if (isOpen && videoRef.current) {
      // Small delay to let animation complete first
      const timer = setTimeout(() => {
        videoRef.current?.play().catch(() => {
          // Autoplay blocked — user must tap play
          // This is expected on some browsers
        })
      }, 400)
      return () => clearTimeout(timer)
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isOpen])

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(toggleVideoModal())
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, dispatch])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = () => {
    dispatch(toggleVideoModal())
  }

  const handleOverlayClick = (e) => {
    // Only close if clicking the overlay
    // not the video itself
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP OVERLAY */}
          <motion.div
            key="video-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            onClick={handleOverlayClick}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.96)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* VIDEO CONTAINER */}
            <motion.div
              key="video-container"
              initial={{
                opacity: 0,
                scale: 0.88,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
                y: 20,
              }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000000',
              }}
            >
              {/* VIDEO ELEMENT — TRUE FULLSCREEN */}
              <video
                ref={videoRef}
                src={trailerVideo}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  background: '#000',
                }}
                controls
                playsInline
                preload="metadata"
                onEnded={handleClose}
              />

              {/* CLOSE BUTTON */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.3, duration: 0.25 }}
                onClick={handleClose}
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '0.5px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'rgba(255,255,255,0.22)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'rgba(255,255,255,0.12)'
                }}
              >
                <X
                  size={20}
                  color="rgba(255,255,255,0.9)"
                  strokeWidth={1.5}
                />
              </motion.button>

              {/* LEXOM BRANDING — top left */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                style={{
                  position: 'absolute',
                  top: '28px',
                  left: '28px',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              >
                <span style={{
                  fontFamily: 'Kilotype_Sequenz, serif',
                  fontSize: '1.2rem',
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: '0.1em',
                }}>
                  LEXOM
                </span>
              </motion.div>

              {/* PROGRESS BAR at bottom */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'rgba(255,255,255,0.1)',
                zIndex: 10,
              }}>
                <VideoProgress videoRef={videoRef} />
              </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Thin progress bar component
function VideoProgress({ videoRef }) {
  const progressRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      if (!progressRef.current) return
      const pct = video.duration
        ? (video.currentTime / video.duration) * 100
        : 0
      progressRef.current.style.width = `${pct}%`
    }

    video.addEventListener('timeupdate', updateProgress)
    return () => {
      video.removeEventListener('timeupdate', updateProgress)
    }
  }, [videoRef])

  return (
    <div
      ref={progressRef}
      style={{
        height: '100%',
        width: '0%',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '0 2px 2px 0',
        transition: 'width 0.1s linear',
      }}
    />
  )
}
