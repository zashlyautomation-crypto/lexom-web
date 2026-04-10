import { useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Navbar from '../components/ui/Navbar'
import Footer from '../sections/6_Footer'
import { Settings, PenTool, Search } from 'lucide-react'

import heroImg from '../assets/brand-page-imgs/hero.png'
import storyImg1 from '../assets/brand-page-imgs/story.png'
import ctaImg from '../assets/brand-page-imgs/cta-image.png' 

import sliderImg1 from '../assets/watches-photos/Whisk_0c964033581e94c87934fded00f882a7dr.jpeg'
import sliderImg2 from '../assets/watches-photos/Whisk_28fa4fb12c604b0ac7e4c05a08e4dca8dr.jpeg'

gsap.registerPlugin(ScrollTrigger)

export default function BrandPage() {

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo('.brand-parallax-bg', 
        { y: '-5%' },
        {
          y: '5%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.precision-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="brand-page bg-black">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: '100vh', background: '#000' }}>
        
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
           <img src={heroImg} alt="Hero Watch" className="w-full h-full object-cover object-right" />
           <div className="absolute inset-0" style={{
             background: 'linear-gradient(to right, #000 0%, rgba(0,0,0,0.85) 30%, transparent 60%)'
           }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col" style={{ minHeight: '100vh', paddingTop: '15vh' }}>
          
          <div style={{ padding: '0 8%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
                color: '#F5F5F5',
                fontWeight: 400,
                lineHeight: 1.05,
                marginTop: '-10vh',
                marginBottom: '24px',
                textTransform: 'uppercase'
              }}
            >
              THE SOUL<br/>OF LEXOM
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '1rem',
                maxWidth: '320px',
                lineHeight: 1.6
              }}
            >
              A commitment to perfection, engineering, and timeless beauty.
            </motion.p>
          </div>

          {/* 1. OVERLAPPING CARDS (Now safely pushed away from text via flex flow) */}
          <div className="brand-cards-container relative w-full z-20 flex justify-center gap-6" style={{ padding: '0 5%', paddingBottom: '60px', marginTop: 'auto' }}>
          {[
            {
              icon: <Settings size={22} color="#C9A84C" strokeWidth={1.5} />,
              title: 'Engineering Perfection',
              desc: 'Relentless pursuit of mechanical precision.'
            },
            {
              icon: <PenTool size={22} color="#C9A84C" strokeWidth={1.5} />,
              title: 'Timeless Aesthetics',
              desc: 'Designs that transcend generations.'
            },
            {
              icon: <Search size={22} color="#C9A84C" strokeWidth={1.5} />,
              title: 'Horological Mastery',
              desc: 'Hand-crafted by skilled artisans.'
            }
          ].map((card, i) => (
            <motion.div 
              key={i}
              className="brand-feature-card flex items-center gap-4"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{
                background: 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '24px 28px',
                width: '340px',
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2), 0 10px 40px rgba(200, 140, 60, 0.15)' 
              }}
            >
              <div style={{
                width: '48px', height: '48px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {card.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#FFF', fontSize: '0.95rem', fontWeight: 500, fontFamily: 'var(--font-sans)', marginBottom: '4px' }}>
                  {card.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontFamily: 'var(--font-sans)', lineHeight: 1.4 }}>
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </section>

      {/* 2. BRAND STORY SECTION */}
      <section className="relative w-full bg-[#0A0A0A] flex flex-col items-center overflow-hidden" style={{ paddingTop: '100px', paddingBottom: '120px' }}>

        {/* 2. BRAND STORY SECTION (Perfectly Aligned & Bigger Image) */}
        <div className="w-full max-w-[1700px] mx-auto flex flex-col lg:flex-row items-center relative">
          
          {/* Top Gold Line */}
          <div style={{ 
            position: 'absolute', top: '-70px', left: '50%', transform: 'translateX(-50%)', 
            width: '60%', height: '1px', 
            background: 'radial-gradient(ellipse at center, rgba(201, 168, 76, 0.5) 0%, transparent 70%)',
            boxShadow: '0 0 15px rgba(201,168,76, 0.3)'
          }} />

          {/* Left: Exploded Watch Image (Size Bigger & PERFECT ALIGNMENT) */}
          <div className="w-full lg:w-[55%] relative flex items-center justify-center lg:justify-start" style={{ minHeight: '450px' }}>
            <img 
              src={storyImg1} 
              alt="Exploded Watch Movement" 
              className="w-full object-contain scale-125 lg:scale-100 mt-8 lg:mt-0"
              style={{ maxHeight: '85vh', objectPosition: 'center', paddingLeft: '5%' }}
            />
          </div>

          {/* Right: Features Text (Perfect Alignment) */}
          <div className="w-full lg:w-[40%] px-6 lg:px-[6%] flex flex-col justify-center items-center lg:items-start gap-16 lg:gap-[64px] mt-16 lg:mt-0 relative" style={{ zIndex: 10 }}>
            {[
              {
                title: 'ENGINEERING PERFECTION',
                subtitle: 'mono',
                desc: 'Relentless pursuit of mechanical precision.'
              },
              {
                title: 'TIMELESS AESTHETICS',
                subtitle: 'mono',
                desc: 'Designs that transcend mechanical artisans.'
              },
              {
                title: 'HOROLOGICAL MASTERY',
                subtitle: 'mono',
                desc: 'Hand-crafted by skilled artisans.'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                <span className="mb-2 lg:mb-3" style={{ 
                  color: 'rgba(255,255,255,0.4)', 
                  fontSize: '0.85rem', 
                  fontFamily: 'var(--font-sans)', 
                  display: 'block'
                }}>
                  {feature.subtitle}
                </span>
                <h3 className="mb-3 lg:mb-4" style={{ 
                  color: '#FFF', 
                  fontSize: '1.25rem', 
                  fontWeight: 600, 
                  fontFamily: 'var(--font-sans)', 
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase'
                }}>
                  {feature.title}
                </h3>
                <p className="mx-auto lg:mx-0" style={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  fontSize: '1rem', 
                  fontFamily: 'var(--font-sans)', 
                  lineHeight: 1.4,
                  maxWidth: '260px'
                }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. WHITE SECTION (Masonry only) */}
      <section className="brand-masonry-section relative w-full bg-white" style={{ background: '#FFFFFF', paddingBottom: '120px', transition: 'background-color 0.3s ease' }}>

        {/* 2. WHERE DREAMS ARE FORGED */}
        <div className="relative z-10" style={{ paddingTop: '100px', paddingLeft: '5%', paddingRight: '5%' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="brand-masonry-title"
            style={{ 
              textAlign: 'center', 
              fontFamily: 'var(--font-sans)', 
              color: '#111', 
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
              fontWeight: 400, 
              letterSpacing: '0.02em',
              marginBottom: '60px' 
            }}
          >
            WHERE DREAMS ARE FORGED
          </motion.h2>

          <div className="brand-masonry-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: '24px',
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            {/* Left Large Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ borderRadius: '20px', overflow: 'hidden', height: '640px' }}
            >
              <img src={sliderImg1} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Gold Movement" />
            </motion.div>
            
            {/* Right Stacked Column */}
            <div className="brand-masonry-right-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '640px' }}>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ borderRadius: '20px', overflow: 'hidden', flex: 1 }}
              >
                 <img src={ctaImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Crafting" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ borderRadius: '20px', overflow: 'hidden', flex: 1 }}
              >
                 <img src={sliderImg2} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Movement Close-up" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* PRECISION SECTION (Dark) */}
      <section className="precision-section relative w-full overflow-hidden" style={{ height: '80vh', minHeight: '600px', background: '#000' }}>
         <img src={storyImg1} alt="Precision" className="brand-parallax-bg" style={{ width: '100%', height: '115%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
         
         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)', zIndex: 1 }} />
         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)', zIndex: 1 }} />
         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #000 0%, transparent 15%)', zIndex: 1 }} />

         <div className="relative z-10 flex flex-col justify-center h-full" style={{ padding: '0 8%' }}>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{
                fontFamily: 'var(--font-sans)',
                color: '#FFF',
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight: 500,
                lineHeight: 1.15,
                marginBottom: '16px'
              }}
            >
              Precision Without<br/>Compromise
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '1rem',
                maxWidth: '360px',
                lineHeight: 1.6
              }}
            >
              The heart of every LEXOM, engineered<br/>for eternity.
            </motion.p>
         </div>
      </section>

      <Footer />
    </div>
  )
}
