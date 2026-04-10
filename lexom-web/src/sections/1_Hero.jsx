// LEXOM — Hero Section (Section 1)
// Section: 1 - Hero
// Dependencies: react, gsap, framer-motion, react-redux, lucide-react,
//               WebGPUSphere, MobileVideoFallback, VideoModal, useMatchMedia

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { gsap } from 'gsap'
import { Play } from 'lucide-react'
import { toggleVideoModal } from '../store/modalSlice'
import MobileSplineHero from '../components/3d/MobileSplineHero'
import content from '../data/content.json'
import heroBg from '../assets/hero-bg.png'
import watchThumb from '../assets/watches-photos/Whisk_01c4773203b95238ca449c582dc81b64dr.jpeg'
import { useMatchMedia } from '../hooks/useMatchMedia'
import { useHeroAssetVisibility } from '../hooks/useHeroAssetVisibility'
import { useNavigate } from 'react-router-dom'

// Lazy-loaded components
import { lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'

const hero = content.hero

// Framer Motion variants
const fadeUpVariant = (delay = 0) => ({
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  },
})

const fadeInVariant = (delay = 0) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut', delay } },
})

const slideFromLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: -38 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1], delay },
  },
})

const slideFromRight = (delay = 0) => ({
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  },
})

// Mask-image gradient for the LEXOM bleed text fade effect
const lexomMaskStyle = {
  WebkitMaskImage: `linear-gradient(
    to bottom,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,1) 30%,
    rgba(0,0,0,0.6) 55%,
    rgba(0,0,0,0.1) 80%,
    rgba(0,0,0,0) 100%
  )`,
  maskImage: `linear-gradient(
    to bottom,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,1) 30%,
    rgba(0,0,0,0.6) 55%,
    rgba(0,0,0,0.1) 80%,
    rgba(0,0,0,0) 100%
  )`,
}

export default function Hero() {
  const dispatch = useDispatch()
  const bleedTextRef = useRef(null)
  const isDesktop = useMatchMedia('(min-width: 1024px)')
  const isLargeScreenFor3D = useHeroAssetVisibility()
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  // GSAP entrance for oversized LEXOM text — slides up from below
  useEffect(() => {
    if (!bleedTextRef.current) return
    const tl = gsap.timeline({ delay: 0.4 })
    tl.fromTo(
      bleedTextRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }
    )
    return () => tl.kill()
  }, [])

  return (
    <>
      <section
        id="hero"
        className="relative min-h-screen w-full flex flex-col items-center pt-[64px] lg:block lg:pt-0"
        style={{ overflowX: 'hidden', overflowY: 'visible', minHeight: '100dvh' }}
      >
        {/* BACKGROUND: Hero Image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* ORDER-2 (mobile): Headline + subtext content block */}
        <div className="relative z-20 w-full px-6 flex flex-col items-center text-center mt-[-40px] max-w-lg mx-auto order-2 lg:order-0 mb-3 lg:mb-0 lg:absolute lg:left-[5%] lg:top-1/2 lg:-translate-y-1/2 lg:text-left lg:items-start lg:mt-0 lg:mx-0 lg:max-w-none">
          {/* Headline Line 1 */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={slideFromLeft(0.6)}
            className="hero-headline"
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 800,
              fontSize: 'clamp(1.5rem, 3.2vw, 3rem)',
              lineHeight: 1.15,
              color: isDesktop ? '#1A1A1A' : '#FFFFFF',
              textShadow: isDesktop ? 'none' : '0 2px 20px rgba(0,0,0,0.25)',
              letterSpacing: '-0.01em',
              marginBottom: 0,
            }}
          >
            LEXOM will make
          </motion.h1>

          {/* Headline Line 2 */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={slideFromLeft(0.76)}
            className="hero-headline"
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4.2vw, 3.6rem)',
              lineHeight: 1.15,
              color: isDesktop ? '#1A1A1A' : '#FFFFFF',
              textShadow: isDesktop ? 'none' : '0 2px 20px rgba(0,0,0,0.25)',
              letterSpacing: '-0.01em',
              marginBottom: '0.5rem',
            }}
          >
            your life easier
          </motion.h1>

          {/* Subtext paragraph */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInVariant(1.0)}
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 400,
              fontSize: isDesktop ? '0.85rem' : '0.9rem',
              lineHeight: 1.55,
              color: isDesktop ? '#4a4a4a' : 'rgba(255, 255, 255, 0.82)',
              textShadow: isDesktop ? 'none' : '0 1px 10px rgba(0,0,0,0.2)',
              maxWidth: '320px',
              margin: isDesktop ? '10px 0 0 0' : '10px auto 0 auto',
            }}
          >
            Explore our best products to find what you want, there you will definitely find it.
          </motion.p>

          {/* CTA Button (Desktop Only) */}
          {isDesktop && (
            <motion.button
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant(1.2)}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                navigate('/collection')
                window.scrollTo(0,0)
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 32px 8px 8px',
                height: '60px',
                borderRadius: '9999px',
                background: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
                transition: 'box-shadow 200ms ease, transform 0.15s ease',
                marginTop: '32px',
              }}
            >
              <span style={{
                width: '44px', height: '44px',
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <img src={watchThumb} alt="Watch" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </span>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#0A0A0A',
              }}>
                Shop Now
              </span>
            </motion.button>
          )}
        </div>

        {/* ORDER-3 (mobile): Shop Now button — sibling so order works independently */}
        <div className="relative z-20 flex justify-center order-3 lg:order-0 mb-0 lg:mb-0 lg:hidden mt-[24px] lg:mt-0">
          <motion.button
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant(1.2)}
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              navigate('/collection')
              window.scrollTo(0,0)
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 32px 8px 8px',
              height: '60px',
              borderRadius: '9999px',
              background: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
              transition: 'box-shadow 200ms ease, transform 0.15s ease',
            }}
          >
            <span style={{
              width: '44px', height: '44px',
              borderRadius: '50%',
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img src={watchThumb} alt="Watch" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </span>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: '1rem',
              color: '#0A0A0A',
            }}>
              Shop Now
            </span>
          </motion.button>
        </div>

        {/* ORDER-1 (mobile): Spline 3D watch — topmost on mobile, shown only if screen < 1024x593 */}
        {!isLargeScreenFor3D && (
          <div className="relative z-20 w-full h-[58vh] max-h-[520px] flex items-center justify-center order-1 lg:order-0 mb-0" style={{ overflow: 'hidden', marginTop: 0 }}>
            <MobileSplineHero className="w-full h-full" />
          </div>
        )}

        {/* 4. Video card wrapper (Correction 1) */}
        {!isDesktop ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideFromRight(1.4)}
            onClick={() => dispatch(toggleVideoModal())}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative z-20 w-[88vw] max-w-[360px] mx-auto order-4 lg:order-0 mb-4 lg:mb-0 mt-[20px] lg:absolute lg:top-[12%] lg:right-[3%] lg:w-[220px] lg:mt-0 lg:mx-0"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px',
              cursor: 'pointer',
              borderRadius: '18px',
              border: '0.5px solid rgba(255,255,255,0.18)',
              background: 'rgba(30, 28, 25, 0.55)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div style={{
              width: '52px', height: '52px', flexShrink: 0, borderRadius: '10px',
              background: 'rgba(20, 20, 20, 0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Play size={20} fill="#ffffff" stroke="none" style={{ marginLeft: '2px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{
                fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.5)', margin: 0, letterSpacing: '0.15em', textTransform: 'uppercase',
              }}>WATCH</p>
              <p className="trailer-text" style={{
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '1.1rem',
                color: 'rgba(255,255,255,0.9)', margin: 0, marginTop: '2px',
              }}>Trailer</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideFromRight(1.4)}
            onClick={() => dispatch(toggleVideoModal())}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative z-20 hidden lg:flex lg:absolute lg:top-[28%] lg:right-[3%] lg:w-[260px] lg:h-[155px] lg:mt-0 lg:mx-0 shadow-xl overflow-hidden cursor-pointer"
            style={{
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.3)',
              backgroundImage: `url(${watchThumb})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Top right "LIMITED" badge/text placeholder */}
            <div style={{
              position: 'absolute', top: '10%', right: '12%',
              fontFamily: 'Kilotype Sequenz, serif', fontSize: '1.2rem', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.15em', transform: 'rotate(-8deg)'
            }}>
              Limited
            </div>
            {/* Overlay gradient */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
            }} />
            {/* Play Button Center */}
            <div style={{
              position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '40px', height: '40px', borderRadius: '50%', background: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>
              <Play size={18} fill="#0A0A0A" stroke="none" style={{ marginLeft: '2px' }} />
            </div>
            {/* Bottom Text Area */}
            <div style={{ position: 'absolute', bottom: '16px', left: '20px', display: 'flex', flexDirection: 'column' }}>
              <p style={{
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '1.1rem',
                color: '#FFFFFF', margin: 0, letterSpacing: '0.01em',
              }}>Shop Wristwatches</p>
              <p style={{
                fontFamily: 'DM Sans, sans-serif', fontWeight: 400, fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.65)', margin: 0, marginTop: '2px',
              }}>www.lexom.com</p>
            </div>
          </motion.div>
        )}

        {/* 4. LEXOM bleed text wrapper (Correction 1) */}
        <div
          ref={bleedTextRef}
          className="relative z-5 w-full text-center order-5 lg:order-0 mt-[24px] lg:absolute lg:bottom-[-0.35em] lg:left-0 lg:mt-0"
          style={{
            pointerEvents: 'none',
            opacity: 0,
            lineHeight: 0.8,
            overflow: 'hidden',
            ...lexomMaskStyle,
          }}
        >
          <span style={{
            display: 'flex',
            justifyContent: 'center',
            fontFamily: 'var(--font-sans)',
            fontWeight: 800,
            fontSize: isDesktop ? 'clamp(10rem, 21vw, 24rem)' : 'clamp(4.5rem, 22vw, 8rem)',
            color: 'rgba(255, 255, 255, 0.92)',
            whiteSpace: 'nowrap',
            letterSpacing: isDesktop ? '-0.02em' : '0.05em',
          }}>
            LEXOM
          </span>
        </div>
      </section>
    </>
  )
}
