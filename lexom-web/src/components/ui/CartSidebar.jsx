// LEXOM — CartSidebar
// Global cart sidebar component
// Dependencies: framer-motion, redux cartSlice,
//   lucide-react, localStorage sync

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ChevronRight, ShieldCheck, ShoppingBag } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import gsap from 'gsap'
import { getLenis } from '../../utils/lenisConfig'
import {
  toggleCartDrawer,
  removeFromCart,
  updateQuantity,
  clearCart,
  addToCart,
} from '../../store/cartSlice'

export default function CartSidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartItems = useSelector(s => s.cart.cartItems)
  const isOpen = useSelector(s => s.cart.isCartDrawerOpen)

  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lexom_cart')
    if (saved && cartItems.length === 0) {
      try {
        const items = JSON.parse(saved)
        if (Array.isArray(items)) {
          items.forEach(item => dispatch(addToCart(item)))
        }
      } catch (e) { }
    }
  }, [])

  // Sync to localStorage on change
  useEffect(() => {
    localStorage.setItem('lexom_cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Lock body scroll when cart open
  useEffect(() => {
    const lenis = getLenis()
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      lenis?.stop()
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      lenis?.start()
    }
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      lenis?.start()
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(toggleCartDrawer())
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen])

  const handleCheckout = () => {
    const tl = gsap.timeline()

    // 1. Show transition overlay
    tl.to('.checkout-transition-overlay', {
      clipPath: 'inset(0 0 0% 0)',
      duration: 0.5,
      ease: 'power4.inOut',
    })

    // 2. Show logo in overlay
    tl.to('.transition-logo', {
      opacity: 1,
      y: 0,
      duration: 0.4,
    }, '-=0.2')

    // 3. Navigate and Clean up
    tl.call(() => {
      dispatch(toggleCartDrawer())
      navigate('/checkout')
      
      // Hide logo immediately for next use
      gsap.set('.transition-logo', { opacity: 0, y: 20 })
      
      // Fade out overlay after a short delay on the new page
      gsap.to('.checkout-transition-overlay', {
        clipPath: 'inset(100% 0 0 0)',
        duration: 0.6,
        delay: 0.2,
        ease: 'power4.inOut',
      })
    })
  }

  const totalPKR = cartItems.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  )

  const formatPKR = (amount) => `PKR ${amount.toLocaleString('en-PK')}`

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
        <motion.div key="cart-portal-container">
          {/* BACKDROP — liquid blur */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => dispatch(toggleCartDrawer())}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 500,
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              background: 'rgba(0, 0, 0, 0.65)',
            }}
          />

          {/* CART SIDEBAR PANEL */}
          <motion.div
            key="cart-panel"
            className="cart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 300,
              mass: 0.8,
            }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '420px',
              background: '#0A0A0A',
              zIndex: 501,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >

            {/* ── HEADER ── */}
            <div style={{
              padding: '22px 18px 14px 18px',
              borderBottom: '0.5px solid rgba(255,255,255,0.08)',
              flexShrink: 0,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
                <div>
                  <h2 style={{
                    fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                    fontWeight: 900,
                    color: '#F5F0E8',
                    fontFamily: 'DM Sans, sans-serif',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    textTransform: 'uppercase',
                  }}>
                    YOUR CART
                  </h2>
                </div>

                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => dispatch(toggleCartDrawer())}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'transparent',
                    border: '0.5px solid rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginTop: '4px',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <X size={16} color="rgba(255,255,255,0.7)" />
                </motion.button>
              </div>
            </div>

            {/* ── CART ITEMS ── */}
            <div 
              data-lenis-prevent
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
              className="cart-items-scroll"
            >

              {cartItems.length === 0 ? (
                /* EMPTY CART STATE */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 0',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}>
                    <ShoppingBag size={24} color="rgba(255,255,255,0.2)" />
                  </div>
                  <p style={{
                    margin: '0 0 6px 0',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: 'DM Sans, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    INVENTORY EMPTY
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.25)',
                    fontFamily: 'monospace',
                  }}>
                    No timepieces selected
                  </p>
                </motion.div>
              ) : (
                /* PRODUCT CARDS */
                cartItems.map((item, index) => (
                  <CartItemCard
                    key={`${item.id}-${index}`}
                    item={item}
                    index={index}
                    dispatch={dispatch}
                    formatPKR={formatPKR}
                  />
                ))
              )}
            </div>

            {/* ── TOTALS + CHECKOUT ── */}
            {cartItems.length > 0 && (
              <div style={{
                padding: '10px 18px 18px 18px',
                borderTop: '0.5px solid rgba(255,255,255,0.08)',
                flexShrink: 0,
                background: '#0A0A0A',
              }}>

                {/* TOTAL row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: '10px',
                }}>
                  <span style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: '#F5F0E8',
                    fontFamily: 'DM Sans, sans-serif',
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase',
                  }}>
                    TOTAL
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      margin: 0,
                      fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                      fontWeight: 800,
                      color: '#F5F0E8',
                      fontFamily: 'DM Sans, sans-serif',
                      letterSpacing: '-0.02em',
                    }}>
                      {formatPKR(totalPKR)}
                    </p>
                  </div>
                </div>

                {/* CHECKOUT BUTTON */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  style={{
                    width: '100%',
                    height: '56px',
                    background: '#E8470A',
                    border: 'none',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#D13D08'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#E8470A'
                  }}
                >
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: 'white',
                    fontFamily: 'DM Sans, sans-serif',
                    textTransform: 'uppercase',
                  }}>
                    PROCEED TO CHECKOUT
                  </span>
                  <ChevronRight size={16} color="white" />
                </motion.button>

                {/* Secure gateway text */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}>
                  <ShieldCheck size={12} color="rgba(255,255,255,0.25)" />
                  <span style={{
                    fontSize: '0.4rem',
                    color: 'rgba(255,255,255,0.25)',
                    fontFamily: 'monospace',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}>
                    SECURE ZASH GATEWAY
                  </span>
                </div>
              </div>
            )}

            {/* CHECKOUT CONFIRMATION */}
            <AnimatePresence>
              {showCheckoutConfirm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#0A0A0A',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    zIndex: 10,
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      damping: 15,
                      delay: 0.1
                    }}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: 'rgba(232,71,10,0.15)',
                      border: '1px solid rgba(232,71,10,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ShieldCheck size={32} color="#E8470A" />
                  </motion.div>
                  <p style={{
                    margin: 0,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#F5F0E8',
                    fontFamily: 'DM Sans, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    ORDER CONFIRMED
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.35)',
                    fontFamily: 'monospace',
                    letterSpacing: '0.08em',
                  }}>
                    INVENTORY CLEARED // 0.2.1
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* Global Transition Overlay (mounted always but clipped) */}
      <motion.div key="global-checkout-overlay" className="checkout-transition-overlay" style={{
        position: 'fixed',
        inset: 0,
        background: '#000000',
        zIndex: 9999,
        clipPath: 'inset(0 0 100% 0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <p className="transition-logo" style={{
          fontFamily: 'Kilotype_Sequenz, serif',
          fontSize: '2rem',
          color: '#C9A84C',
          letterSpacing: '0.4em',
          opacity: 0,
          transform: 'translateY(20px)',
        }}>
          LEXOM
        </p>
      </motion.div>
    </>
  )
}

function CartItemCard({ item, index, dispatch, formatPKR }) {
  const qty = item.quantity || 1

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '0.5px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        gap: '16px',
        position: 'relative',
      }}
    >
      {/* Watch thumbnail */}
      <div style={{
        width: '90px',
        height: '90px',
        borderRadius: '6px',
        overflow: 'hidden',
        background: '#1A1A1A',
        flexShrink: 0,
        border: '0.5px solid rgba(255,255,255,0.08)',
      }}>
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      </div>

      {/* Product details */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Product name */}
        <p style={{
          margin: '0 0 10px 0',
          fontSize: '0.88rem',
          fontWeight: 700,
          color: '#F5F0E8',
          fontFamily: 'DM Sans, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          paddingRight: '40px',
        }}>
          LEXOM {item.name?.toUpperCase()?.replace('LEXOM', '')?.trim() || item.name}
        </p>

        {/* Spec rows — monospace style */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          marginBottom: '12px',
        }}>
          {/* Case Size */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              CASE SIZE:
            </span>
            <span style={{
              fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
            }}>
              {item.size || '42MM'}
            </span>
          </div>

          {/* Case Finish */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              CASE FINISH:
            </span>
            <span style={{
              fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {item.selectedFinish?.name || item.strap || 'POLISHED STEEL'}
            </span>
          </div>

          {/* Price */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              PRICE:
            </span>
            <span style={{
              fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'monospace',
              fontWeight: 600,
            }}>
              {formatPKR(item.price * qty)}
            </span>
          </div>
        </div>

        {/* Quantity controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(updateQuantity({ index, quantity: qty - 1 }))}
            disabled={qty <= 1}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: qty <= 1 ? 'not-allowed' : 'pointer',
              opacity: qty <= 1 ? 0.4 : 1,
            }}
          >
            <Minus size={12} color="rgba(255,255,255,0.7)" />
          </motion.button>

          <span style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#F5F0E8',
            fontFamily: 'monospace',
            minWidth: '28px',
            textAlign: 'center',
          }}>
            {String(qty).padStart(2, '0')}
          </span>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(updateQuantity({ index, quantity: qty + 1 }))}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Plus size={12} color="rgba(255,255,255,0.7)" />
          </motion.button>
        </div>
      </div>

      {/* DECLINE (remove) button */}
      <motion.button
        whileHover={{ color: '#E8470A' }}
        onClick={() => dispatch(removeFromCart(index))}
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.6rem',
          fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '4px 0',
          transition: 'color 0.2s ease',
        }}
      >
        DECLINE
      </motion.button>
    </motion.div>
  )
}
