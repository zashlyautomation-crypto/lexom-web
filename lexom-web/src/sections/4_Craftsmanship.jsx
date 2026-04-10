import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMatchMedia } from '../hooks/useMatchMedia'

// NEW ASSETS (from feature-block-images)
import featureImg1 from '../assets/feature-block-images/097b573e-a91e-42a3-99a8-3ce78253f49e.png'
import featureImg2 from '../assets/feature-block-images/7c309b49-98b8-46d7-b580-6f98dc760d47.png'
import featureImg3 from '../assets/feature-block-images/c299135d-9a97-4b37-aedf-970013f0ca18.png'
import featureImg4 from '../assets/feature-block-images/f379e434-c353-4f26-a4cb-7fc6bba03693.png'

const features = [
  {
    id: 1,
    category: 'MATERIAL',
    title: 'Titanium Shell',
    image: featureImg1,
  },
  {
    id: 2,
    category: 'ENGINE',
    title: 'Swiss Movement',
    image: featureImg2,
  },
  {
    id: 3,
    category: 'PROTECTION',
    title: 'Sapphire Glass',
    image: featureImg3,
  },
  {
    id: 4,
    category: 'DURABILITY',
    title: 'Water Resistant',
    image: featureImg4,
  },
]

export default function Craftsmanship() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sectionRef = useRef(null)

  const isDesktop = useMatchMedia('(min-width: 1024px)')

  const handleFeatureChange = (index) => {
    if (index === activeFeature) return
    if (isTransitioning) return

    setIsTransitioning(true)
    setActiveFeature(index)

    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)

    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    if (!isDesktop) return



    const ctx = gsap.context(() => {
      // 1. Initial State
      gsap.set('.feature-row', { opacity: 0, x: -30 })
      gsap.set('.craft-watch-area', { opacity: 0, x: 40 })
      gsap.set('.craft-watermark', { opacity: 0, scale: 0.95 })

      // 2. Feature Rows Animation
      ScrollTrigger.create({
        id: 'craft-features',
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to('.feature-row', { opacity: 1, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' })
        }
      })

      // 3. Watch Image Area Animation
      ScrollTrigger.create({
        id: 'craft-watch',
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to('.craft-watch-area', { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' })
        }
      })

      // 4. LEXOM Watermark Animation
      ScrollTrigger.create({
        id: 'craft-watermark',
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to('.craft-watermark', { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' })
        }
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [isDesktop])

  if (isDesktop) {
    return (
      <section
        className="craftsmanship-section craftsmanship-desktop"
        ref={sectionRef}
        style={{
          minHeight: '100vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: '#F0F0EE', // Base color
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Glow Overlay (behind feature text) */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '60%', height: '100%',
          background: 'radial-gradient(ellipse 70% 60% at 65% 45%, rgba(240,225,200,0.5) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* LEFT COLUMN — FEATURE LIST */}
          <div style={{
            width: '40%',
            flexShrink: 0,
            padding: '80px 0 80px 8%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '0px',
            position: 'relative',
            zIndex: 10,
          }}>
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className="feature-row"
                onClick={() => handleFeatureChange(index)}
              >
                {/* Circle + button */}
                <div
                  className={`feature-circle ${activeFeature === index ? 'active' : ''}`}
                  style={{
                    background: activeFeature === index
                      ? 'rgba(80,80,85,0.85)'
                      : 'rgba(120,120,130,0.5)',
                  }}
                >
                  <span style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '1.2rem',
                    fontWeight: 300,
                    lineHeight: 1,
                    userSelect: 'none',
                    transition: 'transform 0.3s ease',
                    transform: activeFeature === index
                      ? 'rotate(45deg)'
                      : 'rotate(0deg)',
                    display: 'block',
                  }}>
                    +
                  </span>
                </div>

                {/* Text content */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: '0 0 4px 0',
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(40,40,50,0.45)',
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 400,
                  }}>
                    {feature.category}
                  </p>

                  <h3 style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: activeFeature === index
                      ? '#1A1A1A'
                      : 'rgba(30,30,40,0.65)',
                    fontFamily: 'DM Sans, sans-serif',
                    lineHeight: 1.2,
                    transition: 'color 0.3s ease',
                  }}>
                    {feature.title}
                  </h3>

                  <div style={{
                    overflow: 'hidden',
                    maxHeight: activeFeature === index ? '80px' : '0px',
                    opacity: activeFeature === index ? 1 : 0,
                    transition: 'max-height 0.4s ease, opacity 0.3s ease',
                    marginTop: activeFeature === index ? '8px' : '0',
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: '0.82rem',
                      color: 'rgba(40,40,50,0.55)',
                      fontFamily: 'DM Sans, sans-serif',
                      fontWeight: 400,
                      lineHeight: 1.6,
                    }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN — IMAGE AREA (adjusted as background image) */}
          <div className="craft-watch-area" style={{
            flex: 1,
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {/* LEXOM WATERMARK */}
            <div className="craft-watermark" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 'clamp(6rem, 14vw, 12rem)',
              fontWeight: 800,
              color: 'rgba(180,170,160,0.18)',
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              pointerEvents: 'none',
              zIndex: 0,
            }}>
              LEXOM
            </div>

            {/* FULL-AREA BACKGROUND IMAGES */}
            {features.map((feature, index) => (
              <img
                key={feature.id}
                src={feature.image}
                alt={feature.title}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: index === activeFeature ? 2 : 1,
                  opacity: activeFeature === index ? 1 : 0,
                  transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)',
                  pointerEvents: 'none',
                }}
              />
            ))}

            {/* Subtle Gradient Over the background for better text contrast if needed */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, #F0F0EE 5%, transparent 40%)',
              zIndex: 3,
              pointerEvents: 'none',
            }} />
          </div>
        </div>
      </section>
    )
  }

  // MOBILE LAYOUT
  return (
    <section className="craftsmanship-section craftsmanship-mobile" style={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: '#F0F0EE',
    }}>
      {/* MOBILE BACKGROUND IMAGES (full screen) */}
      <div style={{
        position: 'absolute',
        inset: 0,
      }}>
        {features.map((feature, index) => (
          <img
            key={feature.id}
            src={feature.image}
            alt={feature.title}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: activeFeature === index ? 1 : 0,
              transition: 'opacity 0.6s ease',
              zIndex: 1,
            }}
          />
        ))}
        {/* MOBILE OVERLAY for readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />
      </div>

      {/* MOBILE LEXOM WATERMARK */}
      <div style={{
        position: 'absolute',
        top: '18%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 'clamp(3.5rem, 18vw, 7rem)',
        fontWeight: 800,
        color: 'rgba(255,255,255,0.15)',
        fontFamily: 'DM Sans, sans-serif',
        letterSpacing: '-0.02em',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 3,
      }}>
        LEXOM
      </div>

      {/* MOBILE TOGGLE BUTTON */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '24px',
        zIndex: 10,
      }}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            backdropFilter: 'blur(12px)',
            border: '0.5px solid rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <span style={{
            color: '#FFFFFF',
            fontSize: '1.6rem',
            fontWeight: 300,
            lineHeight: 1,
            transition: 'transform 0.3s ease',
            transform: isMobileMenuOpen
              ? 'rotate(45deg)'
              : 'rotate(0deg)',
            display: 'block',
          }}>
            +
          </span>
        </button>

        {/* Dropdown feature menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '64px',
                left: '0',
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '8px',
                minWidth: '240px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                border: '0.5px solid rgba(255,255,255,0.1)',
              }}
            >
              {features.map((feature, index) => (
                <motion.button
                  key={feature.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.06,
                    duration: 0.2,
                    ease: 'easeOut'
                  }}
                  onClick={() => handleFeatureChange(index)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '12px 16px',
                    background: activeFeature === index
                      ? 'rgba(255,255,255,0.12)'
                      : 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <span style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.45)',
                    fontFamily: 'DM Sans, sans-serif',
                    marginBottom: '2px',
                    display: 'block',
                  }}>
                    {feature.category}
                  </span>
                  <span style={{
                    fontSize: '0.95rem',
                    fontWeight: activeFeature === index ? 600 : 400,
                    color: '#FFFFFF',
                    fontFamily: 'DM Sans, sans-serif',
                  }}>
                    {feature.title}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MOBILE ACTIVE FEATURE INFO */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 5,
        pointerEvents: 'none',
        width: '80%',
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <p style={{
              margin: '0 0 4px 0',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'DM Sans, sans-serif',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}>
              {features[activeFeature].category}
            </p>
            <h3 style={{
              margin: 0,
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'DM Sans, sans-serif',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}>
              {features[activeFeature].title}
            </h3>
            <p style={{
              margin: '8px 0 0 0',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.8)',
              fontFamily: 'DM Sans, sans-serif',
              lineHeight: 1.4,
              textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            }}>
              {features[activeFeature].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
