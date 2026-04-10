import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import notFoundVideo from '../assets/not-foundpage-video/404-video.mp4'

gsap.registerPlugin()

export default function NotFoundPage() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const pageRef = useRef(null)
  
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

  useEffect(() => {
    // Load video immediately — it's above fold
    const timer = setTimeout(() => {
      setShouldLoadVideo(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (shouldLoadVideo && videoRef.current) {
      videoRef.current.load()
    }
  }, [shouldLoadVideo])

  const handleResetClock = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        navigate('/')
        // Scroll to top after navigation
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
      }
    })

    // Clock winding up effect:
    // Page rotates slightly then fades out
    if (pageRef.current) {
      tl.to(pageRef.current, {
        opacity: 0,
        scale: 1.03,
        duration: 0.5,
        ease: 'power2.inOut',
      })
    } else {
      navigate('/')
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
  }

  const bokehOrbs = useMemo(() => [
    { w: 180, h: 180, top: '8%', left: '5%', opacity: 0.25, delay: 0 },
    { w: 220, h: 220, top: '15%', right: '6%', opacity: 0.3, delay: 0.5 },
    { w: 140, h: 140, top: '55%', left: '8%', opacity: 0.2, delay: 1.0 },
    { w: 260, h: 260, top: '45%', right: '3%', opacity: 0.28, delay: 0.3 },
    { w: 100, h: 100, top: '75%', left: '20%', opacity: 0.15, delay: 0.8 },
    { w: 160, h: 160, top: '20%', left: '35%', opacity: 0.12, delay: 1.2 },
  ], [])

  const floatingParts = useMemo(() => [
    { size: 8, top: '22%', left: '28%', rotation: 45, delay: 0.2 },
    { size: 10, top: '18%', left: '62%', rotation: -20, delay: 0.5 },
    { size: 7, top: '35%', right: '22%', rotation: 70, delay: 0.8 },
    { size: 9, top: '58%', left: '25%', rotation: -45, delay: 0.3 },
    { size: 6, top: '65%', right: '28%', rotation: 30, delay: 1.0 },
    { size: 11, top: '28%', left: '20%', rotation: -60, delay: 0.6 },
    { size: 8, top: '72%', left: '55%', rotation: 80, delay: 0.4 },
  ], [])

  const dustParticles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      size: Math.random() * 2 + 1,
      left: `${Math.random() * 80 + 10}%`,
      delay: Math.random() * 3,
      duration: Math.random() * 4 + 3,
      opacity: Math.random() * 0.4 + 0.1,
    })), [])

  return (
    <div className="not-found-page">
      <div 
        ref={pageRef}
        className="not-found-card" 
        style={{
          position: 'relative',
          width: 'calc(100% - 40px)',
          maxWidth: '1100px',
          margin: '20px auto',
          minHeight: 'calc(100vh - 40px)',
          borderRadius: '20px',
          overflow: 'hidden',
          background: '#0A0800',
        }}
      >
        <div className="not-found-video-wrapper">
          {shouldLoadVideo && (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              onCanPlay={() => setVideoLoaded(true)}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                display: 'block',
                opacity: videoLoaded ? 1 : 0,
                transition: 'opacity 1.5s ease',
                zIndex: 0,
                transform: 'translateX(-50%) translateY(-50%)',
                top: '50%',
                left: '50%',
              }}
            >
              <source src={notFoundVideo} type="video/mp4" />
            </video>
          )}

          {!videoLoaded && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(120,60,5,0.8) 0%, rgba(60,25,0,0.6) 40%, rgba(10,8,0,0.95) 80%)',
              zIndex: 0,
            }} />
          )}

          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 70% 70% at 50% 45%, transparent 0%, rgba(5,3,0,0.5) 70%, rgba(5,3,0,0.85) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }} />

          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '35%',
            background: 'linear-gradient(to top, rgba(5,3,0,0.9) 0%, transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }} />

          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '20%',
            background: 'linear-gradient(to bottom, rgba(5,3,0,0.7) 0%, transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }} />
        </div>

        {bokehOrbs.map((orb, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: orb.opacity,
              scale: [1, 1.08, 1],
            }}
            transition={{
              opacity: { delay: orb.delay, duration: 1.5 },
              scale: { delay: orb.delay, duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }}
            style={{
              position: 'absolute',
              width: orb.w,
              height: orb.h,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,120,20,0.6) 0%, rgba(180,80,5,0.3) 40%, transparent 70%)',
              filter: 'blur(30px)',
              top: orb.top,
              left: orb.left,
              right: orb.right,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        ))}

        {floatingParts.map((part, i) => (
          <motion.div
            key={`part-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.7, 0.5, 0.7],
              y: [0, -8, 4, -8],
              rotate: part.rotation,
              scale: 1,
            }}
            transition={{
              opacity: { duration: 2, delay: part.delay, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 3 + i * 0.3, delay: part.delay, repeat: Infinity, ease: 'easeInOut', yoyo: true },
              scale: { duration: 0.5, delay: part.delay },
              rotate: { duration: 0 }
            }}
            style={{
              position: 'absolute',
              width: part.size,
              height: part.size * 3,
              borderRadius: '2px',
              background: 'linear-gradient(180deg, rgba(201,168,76,0.8), rgba(160,120,40,0.4))',
              top: part.top,
              left: part.left,
              right: part.right,
              zIndex: 3,
              pointerEvents: 'none',
              transform: `rotate(${part.rotation}deg)`,
            }}
          />
        ))}

        {dustParticles.map((p, i) => (
          <motion.div
            key={`dust-${i}`}
            animate={{
              y: [0, -80, -160],
              opacity: [0, p.opacity, 0],
              x: [0, Math.random() * 20 - 10, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              bottom: '20%',
              left: p.left,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: 'rgba(220,160,40,0.8)',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          />
        ))}

        <div className="not-found-nav" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px',
        }}>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => navigate('/')}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#F5F0E8',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            LEXOM
          </motion.span>

          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => navigate('/')}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.65)',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.target.style.color = '#F5F0E8' }}
            onMouseLeave={(e) => { e.target.style.color = 'rgba(255,255,255,0.65)' }}
          >
            Return Home
          </motion.span>
        </div>

        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 5% 60px 5%',
        }}>
          <div style={{
            position: 'relative',
            width: 'clamp(280px, 55vw, 580px)',
            height: 'clamp(280px, 55vw, 580px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '-40px',
          }}>
            <motion.h1
              className="not-found-404"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              style={{
                position: 'absolute',
                margin: 0,
                fontSize: 'clamp(8rem, 22vw, 18rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                fontFamily: 'DM Sans, sans-serif',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                textShadow: '0 4px 60px rgba(0,0,0,0.5)',
                zIndex: 2,
                userSelect: 'none',
              }}
            >
              404
            </motion.h1>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            style={{
              margin: '0 0 16px 0',
              fontSize: 'clamp(1.2rem, 3.5vw, 2rem)',
              fontWeight: 700,
              color: '#F5F0E8',
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            TIME HAS STOPPED
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            style={{
              margin: '0 0 40px 0',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'DM Sans, sans-serif',
              lineHeight: 1.6,
              maxWidth: '400px',
            }}
          >
            The page you are looking for has slipped
            <br />
            through the gears of time.
          </motion.p>

          <motion.button
            className="not-found-reset-btn"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 1.1,
              ease: 'backOut'
            }}
            whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.97 }}
            onClick={handleResetClock}
            style={{
              position: 'relative',
              padding: '16px 44px',
              background: 'rgba(15,10,3,0.85)',
              border: '1px solid rgba(201,140,40,0.6)',
              borderRadius: '9999px',
              fontSize: 'clamp(0.72rem, 1.5vw, 0.82rem)',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#F5F0E8',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 0 20px rgba(201,140,40,0.15), inset 0 0 20px rgba(201,140,40,0.05)',
              transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 35px rgba(201,140,40,0.35), inset 0 0 30px rgba(201,140,40,0.1)'
              e.currentTarget.style.borderColor = 'rgba(201,140,40,0.9)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(201,140,40,0.15), inset 0 0 20px rgba(201,140,40,0.05)'
              e.currentTarget.style.borderColor = 'rgba(201,140,40,0.6)'
            }}
          >
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '40%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,200,80,0.12), transparent)',
                pointerEvents: 'none',
              }}
            />
            RESET THE CLOCK
          </motion.button>
        </div>
      </div>
    </div>
  )
}
