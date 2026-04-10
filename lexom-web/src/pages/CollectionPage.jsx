import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { openProductModal } from '../store/modalSlice';
import Navbar from '../components/ui/Navbar';
import Footer from '../sections/6_Footer';
import ProductCard from '../components/gallery/ProductCard';
import ProductDetailModal from '../components/ui/ProductDetailModal';
import watches from '../data/watches.json';

// Carousel Variants
import img1_var1 from '../assets/carousel-images-with-variants/img-1-variants/img1-variant-1.png';
import img1_var2 from '../assets/carousel-images-with-variants/img-1-variants/img1-variant-2.png';
import img1_var3 from '../assets/carousel-images-with-variants/img-1-variants/img1-variant-3.png';
import img1_var4 from '../assets/carousel-images-with-variants/img-1-variants/img1-variant-4.png';

import img2_var1 from '../assets/carousel-images-with-variants/img-2-variants/img2-variant-1.png';
import img2_var2 from '../assets/carousel-images-with-variants/img-2-variants/img2-variant-2.png';
import img2_var3 from '../assets/carousel-images-with-variants/img-2-variants/img2-variant-3.png';
import img2_var4 from '../assets/carousel-images-with-variants/img-2-variants/img2-variant-4.png';

import img3_var1 from '../assets/carousel-images-with-variants/img-3-variants/img3-variant-1.png';
import img3_var2 from '../assets/carousel-images-with-variants/img-3-variants/img3-variant-2.png';
import img3_var3 from '../assets/carousel-images-with-variants/img-3-variants/img3-variant-3.png';
import img3_var4 from '../assets/carousel-images-with-variants/img-3-variants/img3-variant-4.png';

import img4_var1 from '../assets/carousel-images-with-variants/img-4-variants/img4-variant-1.png';
import img4_var2 from '../assets/carousel-images-with-variants/img-4-variants/img4-variant-2.png';
import img4_var3 from '../assets/carousel-images-with-variants/img-4-variants/img4-variant-3.png';
import img4_var4 from '../assets/carousel-images-with-variants/img-4-variants/img4-variant-4.png';

// Grid Images
import gridImg1 from '../assets/watches-photos/Whisk_01c4773203b95238ca449c582dc81b64dr.jpeg';
import gridImg2 from '../assets/watches-photos/Whisk_0c964033581e94c87934fded00f882a7dr.jpeg';
import gridImg3 from '../assets/watches-photos/Whisk_28fa4fb12c604b0ac7e4c05a08e4dca8dr.jpeg';
import gridImg4 from '../assets/watches-photos/Whisk_30ab169035c6f878b494b4db9bc97bfadr.jpeg';
import gridImg5 from '../assets/watches-photos/Whisk_31a0ea863e06cedbb554b3e1b97aab96dr.jpeg';
import gridImg6 from '../assets/watches-photos/Whisk_34d5a76622c7728a84244ff9f1fab9d2dr.jpeg';

const imageMap = {
  'lx-101': gridImg1,
  'lx-102': gridImg2,
  'lx-103': gridImg3,
  'lx-104': gridImg4,
  'lx-105': gridImg5,
  'lx-106': gridImg6,
};

const carouselProducts = [
  {
    id: 1,
    code: 'LX-2024-VLT',
    badge: 'LIMITED TO 15 PIECES',
    name: 'LEXOM TOURBILLON',
    nameShort: 'LEXOM TOURBILLON',
    description: 'A masterpiece of mechanical art. The flying tourbillon rotates at one revolution per minute, visible through the open-worked sapphire dial.',
    price: 'PKR 3,200,000',
    available: true,
    gradient: 'radial-gradient(ellipse 90% 100% at 50% 0%, rgba(200,100,15,0.65) 0%, rgba(80,30,5,0.4) 45%, transparent 80%)',
    variants: [img1_var1, img1_var2, img1_var3, img1_var4],
    activeVariant: 0,
  },
  {
    id: 2,
    code: 'LX-2024-OCT',
    badge: 'NEW ARRIVAL',
    name: 'OPUS\nCHRONOGRAPH\nTITANIUM',
    nameShort: 'OPUS CHRONOGRAPH',
    description: 'Precision flyback chronograph in aerospace titanium. The slate-grey dial contrasts with luminous indices for maximum legibility.',
    price: 'PKR 2,500,000',
    available: true,
    gradient: 'radial-gradient(ellipse 90% 100% at 50% 0%, rgba(100,140,200,0.55) 0%, rgba(20,40,90,0.4) 45%, transparent 80%)',
    variants: [img2_var1, img2_var2, img2_var3, img2_var4],
    activeVariant: 0,
  },
  {
    id: 3,
    code: 'LX-2024-STJ',
    badge: 'COLLECTOR\'S EDITION',
    name: 'SPACE\nTIMER\nJUPITER',
    nameShort: 'SPACE TIMER JUPITER',
    description: 'Inspired by Jupiter\'s atmospheric storms. The meteorite dial is unique to every single timepiece — no two are alike.',
    price: 'PKR 1,800,000',
    available: true,
    gradient: 'radial-gradient(ellipse 90% 100% at 50% 0%, rgba(180,120,60,0.6) 0%, rgba(70,40,10,0.4) 45%, transparent 80%)',
    variants: [img3_var1, img3_var2, img3_var3, img3_var4],
    activeVariant: 0,
  },
  {
    id: 4,
    code: 'LX-2024-PHM',
    badge: 'BESTSELLER',
    name: 'PHANTOM\nAUTOMATIC\nEDITION',
    nameShort: 'PHANTOM AUTOMATIC',
    description: 'The stealth icon. PVD-coated surgical steel with a sunburst anthracite dial. Pure mechanical excellence in complete black.',
    price: 'PKR 1,200,000',
    available: true,
    gradient: 'radial-gradient(ellipse 90% 100% at 50% 0%, rgba(120,40,20,0.6) 0%, rgba(60,15,5,0.4) 45%, transparent 80%)',
    variants: [img4_var1, img4_var2, img4_var3, img4_var4],
    activeVariant: 0,
  },
];

const CollectionPage = () => {
  const dispatch = useDispatch();
  const particleCanvasRef = useRef(null);

  const [activeProduct, setActiveProduct] = useState(0);
  const [activeVariant, setActiveVariant] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      handleProductChange(
        (activeProduct + 1) % carouselProducts.length,
        1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [activeProduct, isTransitioning]);

  // Progress Bar tracking
  useEffect(() => {
    setProgress(0);
    const startTime = Date.now();
    const duration = 5000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [activeProduct]);

  // Particle System
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width * 0.6 + canvas.width * 0.2,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speedY: -(Math.random() * 0.4 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.25 + 0.05,
    }));

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,220,150,${p.opacity})`;
        ctx.fill();
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
        }
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleProductChange = (index, dir = 1) => {
    if (isTransitioning || index === activeProduct) return;
    setDirection(dir);
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveProduct(index);
      setActiveVariant(0);
      setIsTransitioning(false);
    }, 500);
  };

  const handleVariantChange = (variantIndex) => {
    if (variantIndex === activeVariant) return;
    setActiveVariant(variantIndex);
  };

  return (
    <div className="collection-page base-page-transition">
      <Navbar />

      {/* HERO CAROUSEL */}
      <section className="collection-hero" style={{ height: 'calc(100vh - 70px)', marginTop: '70px', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              background: carouselProducts[activeProduct].gradient,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        </AnimatePresence>

        <canvas
          ref={particleCanvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            opacity: 0.6,
          }}
        />

        <div className="collection-hero-inner">
          {/* CENTER WATCH IMAGE (Absolutely positioned to guarantee true center) */}
          <div className="collection-hero-watch">
            <AnimatePresence mode="wait">
              <motion.img
                key={`watch-${activeProduct}-${activeVariant}`}
                src={carouselProducts[activeProduct].variants[activeVariant]}
                alt={carouselProducts[activeProduct].nameShort}
                initial={{ opacity: 0, scale: 0.92, x: direction * 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.92, x: direction * -40 }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 30px 80px rgba(0,0,0,0.7))',
                  position: 'relative',
                  pointerEvents: 'auto',
                }}
              />
            </AnimatePresence>

          </div>

          {/* LEFT CONTENT BLOCK */}
          <div className="collection-hero-text">
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${activeProduct}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 18px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '9999px',
                  marginBottom: '20px',
                }}>
                  <span style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.15em',
                    color: 'rgba(255,255,255,0.85)',
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                  }}>
                    {carouselProducts[activeProduct].badge}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`code-${activeProduct}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {carouselProducts[activeProduct].code}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.h1
                key={`name-${activeProduct}`}
                className="collection-hero-name"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{
                  margin: '0 0 28px 0',
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  fontFamily: 'DM Sans, sans-serif',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  whiteSpace: 'pre-line',
                }}
              >
                {carouselProducts[activeProduct].name}
              </motion.h1>
            </AnimatePresence>

            <div className="find-out-more-wrapper">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '16px 32px',
                  background: '#CA5A11',
                  border: 'none',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'white',
                  fontFamily: 'DM Sans, sans-serif',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#BA500E'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#CA5A11'}
              >
                Find Out More
              </motion.button>
            </div>
          </div>

          {/* RIGHT SIDE ABSOLUTE ELEMENTS */}
          <div className="collection-hero-right">
            {/* AVAILABLE TEXT (Partially behind the watch edge) */}
            <div style={{
              fontSize: 'clamp(2rem, 6vw, 5.5rem)',
              fontWeight: 950,
              color: 'rgba(255,255,255,0.06)',
              letterSpacing: '0.15em',
              fontFamily: 'DM Sans, sans-serif',
              pointerEvents: 'none',
              marginLeft: '-150px', // Overlap effect
              textTransform: 'uppercase',
            }}>
              AVAILABLE
            </div>

            {/* VIDEO THUMBNAIL (Large aspect ratio matching reference) */}
            <div
              style={{
                width: '320px',
                height: '180px',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(0,0,0,0.4)',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                display: 'none',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }}
              className="lg:flex"
              onClick={() => dispatch(openProductModal({}))}
            >
              <img
                src={gridImg1}
                alt="Craftsmanship Video"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.4)',
                }}>
                  <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid white', marginLeft: '4px' }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* PAGINATION BAR */}
        <div className="collection-pagination collection-pagination-area" style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 5%',
          borderTop: '0.5px solid rgba(255,255,255,0.08)',
        }}>
          <button
            className="collection-prev-next"
            onClick={() => handleProductChange(
              (activeProduct - 1 + carouselProducts.length) % carouselProducts.length,
              -1
            )}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
          >
            <span style={{ fontSize: '1rem', marginTop: '-2px' }}>&lsaquo;</span>
            <span style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '2px' }}>
              {carouselProducts[(activeProduct - 1 + carouselProducts.length) % carouselProducts.length].nameShort}
            </span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 300 }}>||</span>
            {carouselProducts.map((_, i) => (
              <React.Fragment key={i}>
                <button
                  onClick={() => handleProductChange(i, i > activeProduct ? 1 : -1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 4px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: activeProduct === i ? 700 : 400,
                    color: activeProduct === i
                      ? '#FFFFFF'
                      : 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.1em',
                    transition: 'all 0.3s ease',
                    lineHeight: 1,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
                {i < carouselProducts.length - 1 && (
                  <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.8rem', margin: '0 -4px' }}>|</span>
                )}
              </React.Fragment>
            ))}
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 300 }}>||</span>
          </div>

          <button
            className="collection-prev-next"
            onClick={() => handleProductChange(
              (activeProduct + 1) % carouselProducts.length,
              1
            )}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
          >
            <span style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '2px' }}>
              {carouselProducts[(activeProduct + 1) % carouselProducts.length].nameShort}
            </span>
            <span style={{ fontSize: '1rem', marginTop: '-2px' }}>&rsaquo;</span>
          </button>
        </div>

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'rgba(255,255,255,0.06)',
          zIndex: 3,
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'rgba(255,255,255,0.35)',
            transition: 'width 0.05s linear',
          }} />
        </div>
      </section>

      {/* ALL COLLECTION GRID */}
      <section className="collection-all">
        <div style={{
          padding: '80px 5% 40px 5%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
          }}>
            <div style={{
              width: '28px',
              height: '2px',
              background: '#E8470A',
            }} />
            <span style={{
              fontSize: '0.68rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              ALL TIMEPIECES
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: '#F5F5F5',
            fontFamily: 'DM Sans, sans-serif',
            margin: 0,
          }}>
            The Collection
          </h2>
        </div>

        <div
          className="collection-grid mobile-responsive-grid"
          style={{
            gap: '28px',
            padding: '0 5% 80px 5%',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {watches.map(watch => (
            <ProductCard
              key={watch.id}
              watch={watch}
              image={imageMap[watch.id]}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CollectionPage;
