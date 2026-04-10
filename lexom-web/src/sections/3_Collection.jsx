import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '../components/gallery/ProductCard';
import FilterSystem from '../components/gallery/FilterSystem';
import ProductDetailModal from '../components/ui/ProductDetailModal';
import watchesData from '../data/watches.json';

// Import all 6 images individually as instructed
import img1 from '../assets/watches-photos/Whisk_01c4773203b95238ca449c582dc81b64dr.jpeg';
import img2 from '../assets/watches-photos/Whisk_0c964033581e94c87934fded00f882a7dr.jpeg';
import img3 from '../assets/watches-photos/Whisk_28fa4fb12c604b0ac7e4c05a08e4dca8dr.jpeg';
import img4 from '../assets/watches-photos/Whisk_30ab169035c6f878b494b4db9bc97bfadr.jpeg';
import img5 from '../assets/watches-photos/Whisk_31a0ea863e06cedbb554b3e1b97aab96dr.jpeg';
import img6 from '../assets/watches-photos/Whisk_34d5a76622c7728a84244ff9f1fab9d2dr.jpeg';

gsap.registerPlugin(ScrollTrigger);

const imageMap = {
  'lx-101': img1,
  'lx-102': img2,
  'lx-103': img3,
  'lx-104': img4,
  'lx-105': img5,
  'lx-106': img6,
};

const Collection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilters = useSelector((state) => state.filter.activeFilters);
  const galleryRef = useRef(null);

  // Filter logic
  const filteredWatches = watchesData.filter((watch) => {
    const matchesSearch = watch.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) || 
      watch.collection.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSize = !activeFilters.size || watch.size === activeFilters.size;
    const matchesColor = !activeFilters.color || watch.color === activeFilters.color;
    
    let matchesPrice = true;
    if (activeFilters.price === 'Under 1L') {
      matchesPrice = watch.price < 100000;
    } else if (activeFilters.price === '1L–2L') {
      matchesPrice = watch.price >= 100000 && watch.price <= 200000;
    } else if (activeFilters.price === 'Above 2L') {
      matchesPrice = watch.price > 200000;
    }

    return matchesSearch && matchesSize && matchesColor && matchesPrice;
  });

  useEffect(() => {
    // Kill any stale ScrollTrigger instances from previous renders of this section
    ScrollTrigger.getAll()
      .filter((st) => st.vars?.id?.startsWith('gallery'))
      .forEach((st) => st.kill());



    const ctx = gsap.context(() => {
      // 1. Initially hide elements
      gsap.set('.gallery-label-line', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.gallery-heading', { opacity: 0, y: 20 });
      gsap.set('.gallery-card', { opacity: 0, y: 32 });

      // 2. Trigger label line
      ScrollTrigger.create({
        id: 'gallery-label',
        trigger: galleryRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to('.gallery-label-line', { scaleX: 1, duration: 0.4, ease: 'power2.out' });
        }
      });

      // 3. Trigger heading
      ScrollTrigger.create({
        id: 'gallery-heading',
        trigger: galleryRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to('.gallery-heading', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        }
      });

      // 4. Trigger cards stagger
      ScrollTrigger.create({
        id: 'gallery-cards',
        trigger: '.gallery-grid',
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to('.gallery-card', { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
        }
      });

    }, galleryRef);

    return () => ctx.revert();
  }, [filteredWatches]);

  return (
    <section id="collection" className="gallery-section" ref={galleryRef}>
      <div className="gallery-wrapper">
        
        {/* SECTION HEADER LAYOUT */}
        <div className="gallery-header">
          {/* LEFT SIDE — label + heading */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px',
              }}
            >
              <div
                className="gallery-label-line"
                style={{
                  width: '28px',
                  height: '2px',
                  background: '#E8470A',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 400,
                }}
              >
                OUR COLLECTION
              </span>
            </div>
            <h2
              className="gallery-heading"
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 800,
                color: '#F5F5F5',
                margin: 0,
                lineHeight: 1.0,
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Special Editions
            </h2>
          </div>

          {/* RIGHT SIDE — search + filter */}
          <div className="gallery-search-row">
            <input
              type="text"
              id="watch-search"
              name="search"
              aria-label="Search watches"
              placeholder="Search watches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="gallery-search"
            />
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              style={{
                height: '42px',
                padding: '0 18px',
                background: 'rgba(255,255,255,0.06)',
                border: '0.5px solid rgba(255,255,255,0.15)',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.85)',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
          </div>
        </div>

        {/* FILTER CHIPS PANEL */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden', marginBottom: '24px' }}
            >
              <div
                style={{
                  paddingTop: '16px',
                  paddingBottom: '8px',
                  borderTop: '0.5px solid rgba(255,255,255,0.08)',
                }}
              >
                <FilterSystem />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PRODUCT GRID */}
        <div className="gallery-grid">
          {filteredWatches.map((watch) => (
            <ProductCard 
              key={watch.id} 
              watch={watch} 
              image={imageMap[watch.id]} 
            />
          ))}
        </div>

        {/* LOAD MORE SECTION */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '60px',
            position: 'relative',
          }}
        >
          {/* Decorative blob */}
          <div
            style={{
              width: '80%',
              maxWidth: '700px',
              height: '160px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '40px',
              position: 'absolute',
              top: '-20px',
            }}
          />

          {/* Load More button */}
          <button
            onClick={() => navigate('/collection')}
            style={{
              position: 'relative',
              zIndex: 1,
              height: '44px',
              width: '148px',
              background: 'transparent',
              border: '0.5px solid rgba(255,255,255,0.2)',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
            }}
          >
            LOAD MORE
          </button>

          {/* Counter */}
          <p
            style={{
              position: 'relative',
              zIndex: 1,
              marginTop: '14px',
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            SHOWING {filteredWatches.length} OF 24 TIMEPIECES
          </p>
        </div>
      </div>
      <ProductDetailModal />
    </section>
  );
};

export default Collection;
