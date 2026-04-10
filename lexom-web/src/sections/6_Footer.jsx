import React, { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion'
import footerVideo from '../assets/footer-video/footer-bg-video.mp4'

export default function Footer() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start']
  })

  // Spring transform — content bounces into place
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [80, 0]),
    {
      stiffness: 120,
      damping: 20,
      restDelta: 0.001,
    }
  )

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.4],
    [0, 1]
  )

  const scale = useSpring(
    useTransform(scrollYProgress, [0, 1], [0.96, 1]),
    {
      stiffness: 100,
      damping: 18,
    }
  )

  return (
    <section
      ref={sectionRef}
      id="footer"
      className="footer-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        background: '#050505',
      }}
    >
      <div className="footer-video-bg">
        <video
          src={footerVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
        {/* Dark overlay on video for readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.4) 40%, rgba(5,5,5,0.85) 100%)',
          zIndex: 1,
        }} />
      </div>

      <div style={{
        position: 'absolute',
        bottom: '-2%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 'clamp(8rem, 20vw, 18rem)',
        fontWeight: 800,
        color: 'rgba(255,255,255,0.03)',
        fontFamily: 'DM Sans, sans-serif',
        letterSpacing: '-0.03em',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 1,
        lineHeight: 1,
      }}>
        LEXOM
      </div>

      <motion.div
        ref={contentRef}
        className="footer-content"
        style={{
          y,
          opacity,
          scale,
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 5%',
        }}
      >
        {/* Top Spacer equal to bottom links height to allow perfect centering */}
        <div style={{ flex: 1, width: '100%' }} />

        {/* --- CENTER SECTION (Headline + Badge) --- */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          zIndex: 10,
        }}>
          <h1 className="footer-headline" style={{
            margin: '0 auto 2px auto',
            fontSize: 'clamp(3rem, 7vw, 6.5rem)',
            fontWeight: 800,
            color: '#F5F5F5',
            fontFamily: 'DM Sans, sans-serif',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            maxWidth: '1000px',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            CRAFTED FOR
            <br />
            THE FINEST.
          </h1>

          <p style={{
            margin: 0,
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 400,
            lineHeight: 1.7,
            maxWidth: '420px',
            textAlign: 'center',
          }}>
            Our inspiration flows from the realms of
            precision engineering.
          </p>
        </div>

        {/* --- BOTTOM SECTION (Navigation + Legal) --- */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '100%',
          marginTop: 'auto',
          zIndex: 10,
        }}>
          <div className="footer-nav-links" style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '32px',
            marginBottom: '40px',
            width: '100%',
            maxWidth: '600px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '32px',
          }}>
            {['Shop', 'Our Story', 'Craftsmanship', 'Contact', 'Care Guide'].map((link) => (
              <a
                key={link || 'footer-link'}
                href={link === 'Shop' ? '/collection' : link === 'Our Story' ? '/about' : '#'}
                onClick={(e) => {
                  if (link === 'Shop' || link === 'Our Story') {
                    // Let react-router handle it
                  } else {
                    e.preventDefault();
                    const id = link.toLowerCase().replace(' ', '');
                    const el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 500,
                  textDecoration: 'none',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#E8470A'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(255,255,255,0.7)'
                }}
              >
                {link}
              </a>
            ))}
          </div>

          <div className="footer-bottom-bar" style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            flexWrap: 'wrap-reverse',
            gap: '16px',
            paddingTop: '16px',
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.05em',
            }}>
              © {new Date().getFullYear()} LEXOM Pakistan. All rights reserved.
            </p>

            <div style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
            }}>
              {['Privacy Policy', 'Terms of Service', 'Shipping Policy'].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    fontSize: '0.65rem',
                    color: 'rgba(255,255,255,0.3)',
                    fontFamily: 'DM Sans, sans-serif',
                    textDecoration: 'none',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'rgba(255,255,255,0.7)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'rgba(255,255,255,0.3)'
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
