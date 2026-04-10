import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Watch, Settings, Crown, Compass, Timer } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../sections/6_Footer'
import heroVideo from '../assets/our-story-video/video.mp4'
import gradientBg from '../assets/about-us-images/center-gradient.png'
import ctaImage from '../assets/about-us-images/cta-image.png'

gsap.registerPlugin(ScrollTrigger)

const timelineItems = [
  {
    year: '1920',
    title: 'FOUNDING THE ATELIER',
    side: 'right',
    description: 'For over a century, LEXOM has embodied the pinnacle of horological craftsmanship. Heritage is built on a relentless pursuit of craftsmanship.',
  },
  {
    year: '1960',
    title: 'REVOLUTIONARY CALIBERS',
    side: 'left',
    description: 'LEXOM has defined the pursuit of perfection through innovation, combining traditional techniques and revolutionary calibers.',
  },
  {
    year: '2000',
    title: 'GLOBAL RECOGNITION',
    side: 'right',
    description: 'For over a century, LEXOM has embodied the pinnacle of horological concern, where the indicators achieved global perfection.',
  },
  {
    year: 'PRESENT',
    title: 'A LEGACY CONTINUED',
    side: 'left',
    description: 'An iconic timepiece of the heart of craftsmanship, combining half of each generation to the incredible spirit of tradition.',
  },
]

export default function AboutPage() {
  const videoRef = useRef(null)
  const heroRef = useRef(null)
  const timelineRef = useRef(null)
  const ctaRef = useRef(null)
  const movementRef = useRef(null)

  const [videoLoaded, setVideoLoaded] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

  // Intersection Observer for the hero video
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true)
          observer.disconnect()
        }
      },
      { threshold: 0.01 }
    )
    if (heroRef.current) {
      observer.observe(heroRef.current)
    }
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (shouldLoadVideo && videoRef.current) {
      videoRef.current.load()
    }
  }, [shouldLoadVideo])

  // ScrollTrigger refresh and initializations
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Timeline GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Vertical line draws itself in
      gsap.from('.timeline-line', {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          id: 'timeline-line',
          trigger: '.timeline-container',
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1,
        }
      })

      // Each timeline item slides in
      gsap.utils.toArray('.timeline-item').forEach(
        (item, i) => {
          const isRight = i % 2 === 0
          gsap.from(item, {
            opacity: 0,
            x: isRight ? 40 : -40,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              id: `timeline-item-${i}`,
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          })
        }
      )

      // Dots pulse in
      gsap.utils.toArray('.timeline-dot').forEach(
        (dot, i) => {
          gsap.from(dot, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: 'back.out(2)',
            scrollTrigger: {
              id: `dot-${i}`,
              trigger: dot,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          })
        }
      )

    }, timelineRef)
    return () => ctx.revert()
  }, [])

  // Swiss Movement GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.movement-text', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          id: 'movement-text',
          trigger: movementRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        }
      })
    }, movementRef)
    return () => ctx.revert()
  }, [])

  // CTA GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-cards > div', {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          id: 'cta-cards',
          trigger: ctaRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        }
      })
    }, ctaRef)
    return () => ctx.revert()
  }, [])

  // Cleanup all related scroll triggers on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll()
        .filter(st =>
          st.vars?.id?.startsWith('about') ||
          st.vars?.id?.startsWith('timeline') ||
          st.vars?.id?.startsWith('movement') ||
          st.vars?.id?.startsWith('cta') ||
          st.vars?.id?.startsWith('dot')
        )
        .forEach(st => st.kill())
    }
  }, [])

  return (
    <div className="about-page">
      <Navbar />

      {/* SECTION 1 — HERO */}
      <section ref={heroRef} style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        overflow: 'hidden',
        background: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="about-hero-video"
          onCanPlay={() => setVideoLoaded(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 0,
            opacity: videoLoaded ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }}
        >
          {shouldLoadVideo && (
            <source src={heroVideo} type="video/mp4" />
          )}
        </video>

        {/* Dark gradient overlays */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '35%',
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.6) 0%, transparent 100%)',
          zIndex: 1,
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(5,5,5,0.8) 0%, transparent 100%)',
          zIndex: 1,
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 1,
        }} />

        {/* Hero Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 5%',
          maxWidth: '1000px',
          width: '100%',
          marginTop: '120px', // Space for fixed Navbar
        }}>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'power3.out', delay: 0.3 }}
            style={{
              margin: '0 0 28px 0',
              fontSize: 'clamp(3rem, 8vw, 7.5rem)',
              fontWeight: 800,
              color: '#F5F0E8',
              fontFamily: 'DM Sans, sans-serif',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            THE ART OF
            <br />
            <span style={{ color: '#C9A84C', WebkitTextStroke: '0px' }}>
              PRECISION
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              margin: '0 auto 48px auto',
              maxWidth: '640px',
              fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 400,
              lineHeight: 1.75,
              textAlign: 'center',
            }}
          >
            For over a century, LEXOM has embodied the pinnacle
            of horological craftsmanship, combining traditional
            techniques with cutting-edge innovation. Each
            timepiece is a testament to our commitment to
            excellence and the enduring spirit of luxury.
          </motion.p>

          <motion.div
            className="about-hero-cards"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '900px',
              maxHeight: '100px',
            }}
          >
            {[
              { icon: Watch, title: 'Heritage', desc: 'Crafted through generations.' },
              { icon: Settings, title: 'Innovation', desc: 'Pioneering mechanical advancements.' },
              { icon: Crown, title: 'Excellence', desc: 'Uncompromising quality standards.' },
            ].map((card, i) => (
              <div key={card.title} className="about-hero-card" style={{
                flex: '1 1 220px',
                maxWidth: '280px',
                maxHeight: '100px',
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '0.5px solid rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                overflow: 'hidden',
              }}>
                <div className="hero-card-icon" style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'rgba(201,168,76,0.15)',
                  border: '0.5px solid rgba(201,168,76,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  maxHeight: '100px'
                }}>
                  <card.icon size={20} color="rgba(201,168,76,0.9)" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h3 className="hero-card-title" style={{
                    margin: '0 0 6px 0',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#F5F0E8',
                    fontFamily: 'DM Sans, sans-serif',
                  }}>
                    {card.title}
                  </h3>
                  <p className="hero-card-desc" style={{
                    margin: 0,
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: 'DM Sans, sans-serif',
                    lineHeight: 1.5,
                  }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — TIMELINE */}
      <section ref={timelineRef} style={{ background: '#0A0A0A', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${gradientBg})`,
          backgroundPosition: 'center',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          opacity: 0.9,
          pointerEvents: 'none',
        }} />

        <div style={{
          textAlign: 'center',
          padding: '100px 5% 60px 5%',
          position: 'relative',
          zIndex: 1,
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 3vw, 2.6rem)',
            fontWeight: 400,
            color: '#F5F0E8',
            fontFamily: 'DM Sans, sans-serif',
            letterSpacing: '-0.01em',
            margin: 0,
          }}>
            Historical Timeline
          </h2>
        </div>

        <div className="timeline-container" style={{
          position: 'relative',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 5% 100px 5%',
          zIndex: 1,
        }}>
          {/* Vertical center line */}
          <div className="timeline-line timeline-center-line" style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 15%, rgba(255,255,255,0.7) 85%, transparent 100%)',
            boxShadow: '0 0 10px rgba(255,255,255,0.3)',
            transform: 'translateX(-50%)',
          }} />

          {/* Timeline items */}
          {timelineItems.map((item, i) => (
            <div
              key={item.year}
              className={`timeline-item timeline-item-${item.side}`}
              style={{ position: 'relative', width: '100%', marginBottom: i === timelineItems.length - 1 ? 0 : '100px' }}
            >
              <div className="timeline-dot" style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                transform: 'translateX(-50%)',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #d0d0d0 40%, #707070 100%)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.5), inset 0 -2px 5px rgba(0,0,0,0.3), 0 0 15px rgba(255,255,255,0.5)',
                zIndex: 2,
              }} />

              <div className={`timeline-content timeline-content-${item.side}`}>
                <h3 style={{
                  margin: '0 0 10px 0',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: '#F5F5F5',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  {item.year}: {item.title}
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: 'DM Sans, sans-serif',
                  lineHeight: 1.6,
                }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — SWISS MOVEMENT & CTA */}
      <section
        ref={movementRef}
        className="movement-section"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          background: '#0A0A0A',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <img
          src={ctaImage}
          alt="Swiss Movement"
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0,
          }}
        />

        {/* Overlays for contrast */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
          zIndex: 1,
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '65%',
          background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0) 100%)',
          zIndex: 1,
        }} />

        {/* Content Wrapper */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '0 5%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: '80px',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: '50px',
        }}>
          {/* Movement Text */}
          <div className="movement-text">
            <p style={{
              margin: '0 0 8px 0',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              SWISS MOVEMENT
            </p>
            <h2 style={{
              margin: 0,
              fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              fontWeight: 400,
              color: '#F5F5F5',
              fontFamily: 'DM Sans, sans-serif',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
            }}>
              Hand-finished Excellence.
              <br />
              The heart of every LEXOM.
            </h2>
          </div>

          {/* CTA Cards Overlaid */}
          <div
            ref={ctaRef}
            className="cta-cards"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              width: '100%',
            }}
          >
            {/* THE VISION */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '0.5px solid rgba(255,255,255,0.15)',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)',
              borderRadius: '16px',
              padding: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Compass size={24} color="rgba(255,255,255,0.9)" strokeWidth={1.5} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{
                  margin: '0 0 4px 0',
                  fontSize: '1.05rem',
                  fontWeight: 400,
                  color: '#F5F5F5',
                  fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  THE VISION
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'DM Sans, sans-serif',
                  lineHeight: 1.6,
                }}>
                  To craft timepieces that transcend time.
                </p>
              </div>
            </div>

            {/* THE LEGACY */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '0.5px solid rgba(255,255,255,0.15)',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)',
              borderRadius: '16px',
              padding: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Timer size={24} color="rgba(255,255,255,0.9)" strokeWidth={1.5} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{
                  margin: '0 0 4px 0',
                  fontSize: '1.05rem',
                  fontWeight: 400,
                  color: '#F5F5F5',
                  fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  THE LEGACY
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'DM Sans, sans-serif',
                  lineHeight: 1.6,
                }}>
                  A century of dedication to horology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
