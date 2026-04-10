import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ChevronRight } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import Navbar from '../components/ui/Navbar'

import overviewBg from '../assets/product-overview-page/8a52aab9-455d-450a-8e75-7d3cb74cfe3d.png'
import watchImg1 from '../assets/watches-photos/Whisk_01c4773203b95238ca449c582dc81b64dr.jpeg'
import watchImg2 from '../assets/watches-photos/Whisk_0c964033581e94c87934fded00f882a7dr.jpeg'
import watchImg3 from '../assets/watches-photos/Whisk_28fa4fb12c604b0ac7e4c05a08e4dca8dr.jpeg'
import watchImg4 from '../assets/watches-photos/Whisk_30ab169035c6f878b494b4db9bc97bfadr.jpeg'
import watchImg5 from '../assets/watches-photos/Whisk_31a0ea863e06cedbb554b3e1b97aab96dr.jpeg'
import watchImg6 from '../assets/watches-photos/Whisk_34d5a76622c7728a84244ff9f1fab9d2dr.jpeg'

import watchesData from '../data/watches.json'

gsap.registerPlugin()

const imageMap = {
  'lx-101': watchImg1,
  'lx-102': watchImg2,
  'lx-103': watchImg3,
  'lx-104': watchImg4,
  'lx-105': watchImg5,
  'lx-106': watchImg6,
}

// Special luxury finishes for selected flagship models
const luxuryFinishes = {
  'lx-101': [
    {
      id: 'polished',
      name: 'Polished Steel',
      color: 'linear-gradient(135deg, #E8E8E8 0%, #B0B0B0 50%, #D8D8D8 100%)',
    },
    {
      id: 'rose-gold',
      name: 'Rose Gold',
      color: 'linear-gradient(135deg, #E8B49A 0%, #C8845A 50%, #E0A07A 100%)',
    },
    {
      id: 'dlc-black',
      name: 'DLC Black',
      color: 'linear-gradient(135deg, #4A4A4A 0%, #1A1A1A 50%, #3A3A3A 100%)',
    },
  ],
  'lx-102': [
    {
      id: 'black',
      name: 'DLC Black',
      color: 'linear-gradient(135deg, #2A2A2A 0%, #0A0A0A 50%, #1A1A1A 100%)',
    },
    {
      id: 'steel',
      name: 'Polished Steel',
      color: 'linear-gradient(135deg, #E8E8E8 0%, #B0B0B0 50%, #D8D8D8 100%)',
    }
  ]
}

const buildProductData = (watches, imageMap, luxuryFinishes) => {
  return watches.reduce((acc, watch) => {
    // Generate finishes list
    // Rule: Show available colors. If only one color is in JSON, it's the only option.
    // If it's a flagship (lx-101/102), use the luxury selection.
    let finalFinishes = luxuryFinishes[watch.id] || [
      {
        id: 'default',
        name: `${watch.color} Finish`,
        color: watch.color === 'Silver'
          ? 'linear-gradient(135deg, #E8E8E8, #B0B0B0)'
          : watch.color === 'Black'
            ? 'linear-gradient(135deg, #3A3A3A, #0A0A0A)'
            : 'linear-gradient(135deg, #E8C97A, #C9A84C)',
      }
    ];

    acc[watch.id] = {
      id: watch.id,
      name: watch.name.toUpperCase(),
      shortName: watch.name.split(' ').slice(0, 2).join(' ').toUpperCase(),
      code: watch.id.toUpperCase(),
      price: watch.price,
      priceFormatted: `PKR ${watch.price.toLocaleString('en-PK')}`,
      description: watch.description,
      caliber: watch.specs?.[0] || 'LX-Auto',
      powerReserve: watch.specs?.[1] || '48 Hours',
      frequency: '28,800 A/h',
      jewels: watch.specs?.[3]?.replace(/\D/g, '') || '24',
      collection: watch.collection,
      finishes: finalFinishes,
      thumbnails: [
        imageMap[watch.id],
        imageMap[watch.id],
        imageMap[watch.id],
        imageMap[watch.id],
      ],
      hotspots: [
        {
          id: 'dial',
          x: '50%',
          y: '50%',
          title: 'Precision Dial',
          description: watch.description.substring(0, 80) + '...',
        },
        {
          id: 'crown',
          x: '75%',
          y: '50%',
          title: 'Winding Crown',
          description: 'Hand-knurled titanium crown for precise adjustments.',
        }
      ],
      backgroundText: watch.name.split(' ').slice(0, 2).join(' ').toUpperCase(),
    }
    return acc
  }, {})
}

const productData = buildProductData(watchesData, imageMap, luxuryFinishes)

export default function ProductOverviewPage() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const navigate = useNavigate()

  const product = productData[id]

  const [activeFinish, setActiveFinish] = useState(0)
  const [activeThumb, setActiveThumb] = useState(0)
  const [activeHotspot, setActiveHotspot] = useState(null)

  const bgRef = useRef(null)
  const [bgImageLoaded, setBgImageLoaded] = useState(false)
  const [shouldLoadBg, setShouldLoadBg] = useState(false)

  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const transitionRef = useRef(null)

  useEffect(() => {
    // Trigger bg load immediately on mount
    setShouldLoadBg(true)
  }, [])

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — LEXOM`
    }
    return () => {
      document.title = 'LEXOM — Luxury Timepieces'
    }
  }, [product])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })

      // Watch image rises up
      tl.from('.product-watch-center', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
      })

      // Left specs slide in
      tl.from('.product-specs-left > div', {
        opacity: 0,
        x: -30,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
      }, '-=0.6')

      // Right config slides in
      tl.from('.product-config-right > div', {
        opacity: 0,
        x: 30,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
      }, '-=0.6')

      // Bottom bar slides up
      tl.from('.product-bottom-bar', {
        y: 80,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.3')

      // Breadcrumb fades in
      tl.from('.product-breadcrumb', {
        opacity: 0,
        y: -10,
        duration: 0.4,
      }, '-=0.8')
    })
    return () => ctx.revert()
  }, [])

  const saveToLocalStorage = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      code: product.code,
      price: product.price,
      priceFormatted: product.priceFormatted,
      description: product.description,
      image: product.thumbnails[activeThumb],
      selectedFinish: product.finishes[activeFinish],
      caliber: product.caliber,
      powerReserve: product.powerReserve,
      frequency: product.frequency,
      jewels: product.jewels,
      addedAt: new Date().toISOString(),
      quantity: 1,
    }

    dispatch(addToCart(cartItem))

    const existingCart = JSON.parse(
      localStorage.getItem('lexom_cart') || '[]'
    )

    const existingIndex = existingCart.findIndex(item => item.id === product.id)

    if (existingIndex >= 0) {
      existingCart[existingIndex] = cartItem
    } else {
      existingCart.push(cartItem)
    }

    localStorage.setItem(
      'lexom_cart',
      JSON.stringify(existingCart)
    )

    localStorage.setItem(
      'lexom_last_viewed',
      JSON.stringify(cartItem)
    )
  }

  const handleAddToCart = async () => {
    if (isAddingToCart) return
    setIsAddingToCart(true)

    saveToLocalStorage()

    const tl = gsap.timeline()

    tl.fromTo('.transition-overlay', {
      clipPath: 'circle(0% at 85% 95%)',
      opacity: 1,
    }, {
      clipPath: 'circle(150% at 85% 95%)',
      duration: 0.8,
      ease: 'power4.inOut',
    })

    tl.to('.product-overview-page', {
      opacity: 0,
      duration: 0.3,
    }, '-=0.2')

    tl.fromTo('.transition-text', {
      opacity: 0,
      y: 30,
      letterSpacing: '0.5em',
    }, {
      opacity: 1,
      y: 0,
      letterSpacing: '0.1em',
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.1')

    tl.call(() => {
      navigate('/#hero')
    }, null, '+=0.3')
  }

  if (!product) {
    return (
      <div style={{
        background: '#000',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            color: '#F5F0E8',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '2rem',
            marginBottom: '16px',
          }}>
            Product Not Found
          </h1>
          <button
            onClick={() => navigate('/collection')}
            style={{
              padding: '12px 24px',
              background: '#E8470A',
              border: 'none',
              borderRadius: '9999px',
              color: 'white',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
            }}
          >
            View Collection
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className="product-overview-page"
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '90px',
        }}
      >
        {/* Background implementation */}
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          background: '#000000',
        }}>
          {shouldLoadBg && (
            <img
              ref={bgRef}
              src={overviewBg}
              alt=""
              onLoad={() => setBgImageLoaded(true)}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                opacity: bgImageLoaded ? 0.85 : 0,
                transition: 'opacity 1s ease',
              }}
            />
          )}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
          }} />
        </div>

        <Navbar />

        {/* BREADCRUMB */}
        <div className="product-breadcrumb" style={{
          padding: '16px 4% 0 4%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          position: 'relative',
          zIndex: 5,
        }}>
          {['Collections', 'Special Editions', product.name].map((crumb, i, arr) => (
            <React.Fragment key={`${crumb}-${i}`}>
              <span style={{
                fontSize: '0.75rem',
                color: i === arr.length - 1
                  ? 'rgba(255,255,255,0.6)'
                  : 'rgba(255,255,255,0.35)',
                fontFamily: 'DM Sans, sans-serif',
                cursor: i < arr.length - 1 ? 'pointer' : 'default',
              }}>
                {crumb}
              </span>
              {i < arr.length - 1 && (
                <ChevronRight
                  size={12}
                  color="rgba(255,255,255,0.25)"
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* MAIN CONTENT AREA */}
        <div
          className="product-main-layout"
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            padding: '20px 4%',
            position: 'relative',
            minHeight: 'calc(100vh - 180px)',
            gap: '0',
          }}
        >


          {/* LEFT SPECS PANEL */}
          <div
            className="product-specs-left"
            style={{
              width: '28%',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '32px',
              position: 'relative',
              zIndex: 2,
              paddingRight: '2%',
            }}
          >
            {/* Caliber */}
            <div style={{
              padding: '20px 24px',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(10px)',
              border: '0.5px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
            }}>
              <p style={{
                margin: '0 0 6px 0',
                fontSize: '0.72rem',
                color: 'rgba(255,255,255,0.45)',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 400,
              }}>
                Caliber:
              </p>
              <p style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#F5F0E8',
                fontFamily: 'DM Sans, sans-serif',
              }}>
                {product.caliber}
              </p>
            </div>

            {/* Power Reserve */}
            <div style={{
              padding: '20px 24px',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(10px)',
              border: '0.5px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
            }}>
              <p style={{
                margin: '0 0 6px 0',
                fontSize: '0.72rem',
                color: 'rgba(255,255,255,0.45)',
                fontFamily: 'DM Sans, sans-serif',
              }}>
                Power Reserve:
              </p>
              <p style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#F5F0E8',
                fontFamily: 'DM Sans, sans-serif',
              }}>
                {product.powerReserve}
              </p>
            </div>
          </div>

          {/* CENTER WATCH DISPLAY */}
          <div
            className="product-watch-center"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Watch image with hotspots */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '880px',
              height: '100%',
              maxHeight: '880px',
              aspectRatio: '1/1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <motion.img
                key={activeThumb}
                src={product.thumbnails[activeThumb]}
                alt={product.name}
                loading="lazy"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 30px 80px rgba(0,0,0,0.8))',
                  position: 'relative',
                  zIndex: 1,
                }}
              />

              {product.hotspots.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => setActiveHotspot(
                    activeHotspot === spot.id ? null : spot.id
                  )}
                  style={{
                    position: 'absolute',
                    left: spot.x,
                    top: spot.y,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 3,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    position: 'relative',
                    width: '14px',
                    height: '14px',
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: '-6px',
                      borderRadius: '50%',
                      border: '1px solid rgba(230,150,50,0.4)',
                      animation: 'hotspotPulse 2s ease-in-out infinite',
                    }} />
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: '#E8960A',
                      boxShadow: '0 0 8px rgba(232,150,10,0.6)',
                    }} />
                  </div>

                  <AnimatePresence>
                    {activeHotspot === spot.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ duration: 0.25 }}
                        style={{
                          position: 'absolute',
                          left: '20px',
                          top: '-20px',
                          background: 'rgba(20,18,15,0.92)',
                          backdropFilter: 'blur(20px)',
                          border: '0.5px solid rgba(255,255,255,0.12)',
                          borderRadius: '12px',
                          padding: '14px 18px',
                          width: '220px',
                          zIndex: 10,
                          pointerEvents: 'none',
                        }}
                      >
                        <p style={{
                          margin: '0 0 6px 0',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: '#F5F0E8',
                          fontFamily: 'DM Sans, sans-serif',
                        }}>
                          {spot.title}
                        </p>
                        <p style={{
                          margin: 0,
                          fontSize: '0.75rem',
                          color: 'rgba(255,255,255,0.5)',
                          fontFamily: 'DM Sans, sans-serif',
                          lineHeight: 1.5,
                        }}>
                          {spot.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>


          </div>

          {/* RIGHT CONFIGURATION PANEL */}
          <div
            className="product-config-right"
            style={{
              width: '28%',
              flexShrink: 0,
              paddingLeft: '2%',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div className="config-heading" style={{
              marginBottom: '32px',
              paddingBottom: '16px',
              borderBottom: '0.5px solid rgba(255,255,255,0.15)',
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '1.4rem',
                fontWeight: 400,
                color: '#F5F0E8',
                fontFamily: 'DM Sans, sans-serif',
                letterSpacing: '0.02em',
              }}>
                Configuration
              </h2>
            </div>

            {/* CASE FINISH SELECTOR — Only show if multiple options exist */}
            {product.finishes.length > 1 && (
              <div style={{ marginBottom: '48px' }}>
                <p style={{
                  margin: '0 0 16px 0',
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  CASE FINISH
                </p>

                <div style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                  justifyContent: 'center'
                }}>
                  {product.finishes.map((finish, i) => (
                    <div
                      key={finish.id}
                      onClick={() => setActiveFinish(i)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: finish.color,
                        border: i === activeFinish
                          ? '2.5px solid rgba(232,150,10,0.9)'
                          : '1.5px solid rgba(255,255,255,0.2)',
                        boxShadow: i === activeFinish
                          ? '0 0 14px rgba(232,150,10,0.4)'
                          : 'none',
                        transition: 'all 0.25s ease',
                      }} />
                      <span style={{
                        fontSize: '0.68rem',
                        color: i === activeFinish
                          ? '#F5F0E8'
                          : 'rgba(255,255,255,0.4)',
                        fontFamily: 'DM Sans, sans-serif',
                        textAlign: 'center',
                        lineHeight: 1.3,
                        transition: 'color 0.2s ease',
                      }}>
                        {finish.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  margin: '0 0 4px 0',
                  fontSize: '0.72rem',
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  Frequency:
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: '#F5F0E8',
                  fontFamily: 'DM Sans, sans-serif',
                  lineHeight: 1,
                }}>
                  {product.frequency}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{
                  margin: '0 0 4px 0',
                  fontSize: '0.72rem',
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  Jewels:
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: '#F5F0E8',
                  fontFamily: 'DM Sans, sans-serif',
                  lineHeight: 1,
                }}>
                  {product.jewels}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FIXED BOTTOM BAR */}
        <div
          className="product-bottom-bar"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'rgba(5,5,5,0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '0.5px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 4%',
            zIndex: 100,
          }}
        >
          <div>
            <p style={{
              margin: 0,
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 700,
              color: '#F5F0E8',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              {product.priceFormatted}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            style={{
              padding: '16px 36px',
              background: isAddingToCart
                ? '#B8360A'
                : '#E8470A',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'white',
              fontFamily: 'DM Sans, sans-serif',
              cursor: isAddingToCart
                ? 'not-allowed'
                : 'pointer',
              transition: 'background 0.2s ease',
              minWidth: '200px',
            }}
          >
            {isAddingToCart
              ? 'Adding...'
              : 'Pre-Order Now'}
          </motion.button>
        </div>
      </div>

      <div
        ref={transitionRef}
        className="transition-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          background: '#E8470A',
          zIndex: 9999,
          clipPath: 'circle(0% at 85% 95%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div className="transition-text" style={{
          opacity: 0,
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'Kilotype_Sequenz, serif',
            fontSize: 'clamp(2rem, 6vw, 5rem)',
            color: 'white',
            letterSpacing: '0.3em',
            margin: '0 0 16px 0',
          }}>
            LEXOM
          </p>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            Added to your collection
          </p>
        </div>
      </div>
    </>
  )
}
