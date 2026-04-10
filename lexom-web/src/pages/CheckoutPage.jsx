import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '../store/cartSlice'
import { ShoppingBag } from 'lucide-react'

// Register GSAP plugins
gsap.registerPlugin()

function FormField({
  label, value, placeholder,
  error, onChange, type = 'text',
  className = ""
}) {
  return (
    <div className={className}>
      <label style={{
        display: 'block',
        fontSize: '0.62rem',
        letterSpacing: '0.15em',
        color: 'rgba(255,255,255,0.4)',
        fontFamily: 'monospace',
        textTransform: 'uppercase',
        marginBottom: '8px',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          height: '52px',
          background: 'rgba(255,255,255,0.04)',
          border: error
            ? '0.5px solid rgba(232,71,10,0.6)'
            : '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: '6px',
          padding: '0 16px',
          fontSize: '0.82rem',
          fontFamily: 'monospace',
          letterSpacing: '0.06em',
          color: '#F5F0E8',
          outline: 'none',
          transition: 'border-color 0.2s ease',
          textTransform: 'uppercase',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(201,168,76,0.5)'
          e.target.style.background = 'rgba(255,255,255,0.06)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error
            ? 'rgba(232,71,10,0.6)'
            : 'rgba(255,255,255,0.12)'
          e.target.style.background = 'rgba(255,255,255,0.04)'
        }}
      />
      {error && (
        <p style={{
          margin: '6px 0 0 0',
          fontSize: '0.6rem',
          fontFamily: 'monospace',
          color: 'rgba(232,71,10,0.8)',
          letterSpacing: '0.08em',
        }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const pageRef = useRef(null)

  // ─── LOAD PRODUCT DATA FROM LOCALSTORAGE ───
  const [cartItems, setCartItems] = useState([])
  const [productData, setProductData] = useState(null)

  useEffect(() => {
    // Load cart items
    const savedCart = localStorage.getItem('lexom_cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        setCartItems(items)
      } catch (e) { }
    }

    // Load last viewed product
    const lastViewed = localStorage.getItem('lexom_last_viewed')
    if (lastViewed) {
      try {
        setProductData(JSON.parse(lastViewed))
      } catch (e) { }
    }
  }, [])

  // Use first cart item if no lastViewed for summary display
  const displayProduct = productData || cartItems[0] || null

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  )
  const taxRate = 0.04; // Based on requested email structure example ($1299.99 -> $51.9996)
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // ─── FORM STATE ───
  const [formData, setFormData] = useState({
    recipientName: '',
    email: '',
    mobile: '',
    regionalSector: '',
    address: '',
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.recipientName.trim()) {
      errors.recipientName = 'NAME REQUIRED'
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'EMAIL REQUIRED'
    }
    if (!formData.mobile.trim()) {
      errors.mobile = 'MOBILE REQUIRED'
    }
    if (!formData.regionalSector.trim()) {
      errors.regionalSector = 'REGION REQUIRED'
    }
    if (!formData.address.trim()) {
      errors.address = 'ADDRESS REQUIRED'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ─── FORMSPREE INTEGRATION (RESTRUCTURED) ───
  const submitToFormspree = async () => {
    const orderPayload = {
      customer: {
        address: formData.address,
        city: formData.regionalSector,
        email: formData.email,
        name: formData.recipientName,
        phone: formData.mobile,
      },
      items: cartItems.map(item => ({
        color: item.selectedFinish?.name || item.color || 'N/A',
        name: item.name,
        price: item.price,
        productID: item.id || 1,
        qty: item.quantity || 1,
        size: item.size || 'N/A',
      })),
      pricing: {
        subtotal: subtotal,
        tax: tax,
        total: total,
      },
      meta: {
        date: new Date().toISOString(),
        orderID: `ZASH-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod: 'COD',
      },
      // Subject for email overview
      _subject: `New LEXOM Order — ${formData.recipientName} — PKR ${total.toLocaleString('en-PK')}`,
    }

    try {
      const response = await axios.post(
        'https://formspree.io/f/xgoprkar',
        orderPayload,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }
      )
      return response.data.ok === true || response.status === 200
    } catch (error) {
      console.error('Formspree error:', error)
      return false
    }
  }

  const saveUserData = () => {
    const userData = {
      ...formData,
      savedAt: new Date().toISOString(),
      orderTotal: total,
      orderTotalFormatted: `PKR ${total.toLocaleString('en-PK')}`,
    }
    localStorage.setItem('lexom_user_data', JSON.stringify(userData))
  }

  const handleConfirmDispatch = async () => {
    if (!validateForm()) return
    if (isSubmitting) return

    setIsSubmitting(true)
    saveUserData()
    const success = await submitToFormspree()
    playDispatchTransition(success)
  }

  const playDispatchTransition = (success) => {
    const tl = gsap.timeline()

    // Phase 1: Black overlay floods in from top
    tl.fromTo('.dispatch-overlay', {
      clipPath: 'inset(0 0 100% 0)',
    }, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 0.7,
      ease: 'power4.inOut',
    })

    // Phase 2: LEXOM logo + status text appear
    tl.fromTo('.dispatch-logo', {
      opacity: 0,
      y: -20,
      letterSpacing: '0.8em',
    }, {
      opacity: 1,
      y: 0,
      letterSpacing: '0.15em',
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.2')

    tl.fromTo('.dispatch-status', {
      opacity: 0,
      y: 10,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.2')

    // Phase 3: Progress bar fills
    tl.fromTo('.dispatch-progress-fill', {
      scaleX: 0,
    }, {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.inOut',
    }, '-=0.2')

    // Phase 4: Navigate to home + clear cart
    tl.call(() => {
      dispatch(clearCart())
      localStorage.removeItem('lexom_cart')

      localStorage.setItem('lexom_toast', JSON.stringify({
        message: success ? 'ORDER DISPATCHED // CONFIRMATION SENT' : 'ORDER LOGGED // CHECK EMAIL',
        type: success ? 'success' : 'info',
        timestamp: Date.now(),
      }))

      navigate('/')
    }, null, '+=0.2')
  }

  // Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 })
      tl.from('.checkout-heading', {
        opacity: 0,
        x: -40,
        duration: 0.7,
        ease: 'power3.out',
      })
      tl.from('.form-field-item', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      }, '-=0.4')
      tl.from('.checkout-manifest-col', {
        opacity: 0,
        x: 40,
        duration: 0.7,
        ease: 'power3.out',
      }, '-=0.6')
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="checkout-page" ref={pageRef}>
      <div style={{ position: 'fixed', inset: 0, background: '#000000', zIndex: 0 }}>
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(180,80,10,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>

      <nav style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 5%',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <span
          onClick={() => navigate('/')}
          style={{
            fontFamily: 'Kilotype_Sequenz, serif',
            fontSize: '1.4rem',
            color: '#C9A84C',
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
        >
          LEXOM
        </span>
        <div style={{ display: 'flex', gap: '40px' }} className="checkout-nav-links">
          {['COLLECTION', 'STORIES', 'BRAND'].map(link => (
            <span
              key={link}
              onClick={() => navigate(`/${link.toLowerCase()}`)}
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 400,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = 'rgba(255,255,255,0.85)'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}
            >
              {link}
            </span>
          ))}
        </div>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
          onClick={() => navigate(-1)}
        >
          <ShoppingBag size={16} color="rgba(255,255,255,0.7)" />
        </div>
      </nav>

      <div className="checkout-main-layout" style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        gap: '60px',
        padding: '60px 5%',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 300px)',
        alignItems: 'flex-start',
      }}>
        <div className="checkout-form-col" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h1 className="checkout-heading" style={{
            margin: '0 0 48px 0',
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 900,
            color: '#F5F0E8',
            fontFamily: 'DM Sans, sans-serif',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}>
            LOGISTICS
            <br />
            HUB
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <FormField
              className="form-field-item"
              label="NAME"
              value={formData.recipientName}
              placeholder="MUHAMMAD ALI"
              error={formErrors.recipientName}
              onChange={(v) => handleInputChange('recipientName', v)}
            />
            <FormField
              className="form-field-item"
              label="EMAIL"
              value={formData.email}
              placeholder="CONTACT@LEXOM.TECH"
              error={formErrors.email}
              onChange={(v) => handleInputChange('email', v)}
              type="email"
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="checkout-two-col">
              <FormField
                className="form-field-item"
                label="PHONE NUMBER"
                value={formData.mobile}
                placeholder="+92 300 0000000"
                error={formErrors.mobile}
                onChange={(v) => handleInputChange('mobile', v)}
                type="tel"
              />
              <FormField
                className="form-field-item"
                label="REGION"
                value={formData.regionalSector}
                placeholder="PUNJAB, PAKISTAN"
                error={formErrors.regionalSector}
                onChange={(v) => handleInputChange('regionalSector', v)}
              />
            </div>
            <FormField
              className="form-field-item"
              label="ADDRESS"
              value={formData.address}
              placeholder="PUNJAB, faisalabad, shadab colony"
              error={formErrors.address}
              onChange={(v) => handleInputChange('address', v)}
            />
          </div>
        </div>

        <motion.div
          className="checkout-manifest-col"
          style={{ flexShrink: 0 }}
        >
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
          }}
            className="manifest-card-inner"
          >
            <p style={{
              margin: '0 0 20px 0',
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
            }}>
              MANIFEST SUMMARY
            </p>

            {displayProduct ? (
              <div className="manifest-horizontal-content">
                <div className="manifest-image-wrapper">
                  <div className="manifest-image-glow" />
                  <img
                    src={displayProduct.image}
                    alt={displayProduct.name}
                    loading="lazy"
                    className="manifest-product-image"
                  />
                </div>

                <div className="manifest-text-content">
                  <p className="manifest-product-name">
                    LEXOM {displayProduct.name?.toUpperCase()?.replace('LEXOM', '')?.trim() || displayProduct.name}
                  </p>
                  <p className="manifest-product-subtitle">
                    {displayProduct.selectedFinish?.name || displayProduct.color || 'MATTE BLACK'} / {displayProduct.size || '42MM'}
                  </p>
                  <p className="manifest-product-price">
                    PKR {displayProduct.price?.toLocaleString('en-PK')}
                  </p>
                </div>

                <div className="manifest-specs-content">
                  {[
                    { label: 'DELIVERY', value: '3-5 DAYS' },
                    { label: 'PAYMENT', value: 'C.O.D.' },
                    { label: 'AREA', value: 'ALL OVER PAKISTAN' },
                    { label: 'BUISNESS EMAIL', value: 'zashlycraft@gmail.com' }
                  ].map((row) => (
                    <div key={row.label} className="manifest-spec-row">
                      <span className="spec-label">{row.label}</span>
                      <span className="spec-value" style={{ color: row.color || '#F5F0E8' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: '0.72rem' }}>NO ITEMS IN MANIFEST</p>
              </div>
            )}

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '20px 0' }} />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleConfirmDispatch}
              disabled={isSubmitting}
              style={{
                width: '100%',
                height: '52px',
                background: isSubmitting ? '#B8360A' : '#E8470A',
                border: 'none',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'white',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
              }}>
                {isSubmitting ? 'DISPATCHING...' : 'CONFIRM DISPATCH'}
              </span>
              {!isSubmitting && <span style={{ color: 'white', fontSize: '1rem' }}>→</span>}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="dispatch-overlay" style={{
        position: 'fixed',
        inset: 0,
        background: '#000000',
        zIndex: 9999,
        clipPath: 'inset(0 0 100% 0)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        pointerEvents: 'none',
      }}>
        <p className="dispatch-logo" style={{
          fontFamily: 'Kilotype_Sequenz, serif',
          fontSize: 'clamp(2.5rem, 8vw, 6rem)',
          color: '#C9A84C',
          letterSpacing: '0.5em',
          margin: 0,
          opacity: 0,
        }}>
          LEXOM
        </p>
        <p className="dispatch-status" style={{
          fontFamily: 'monospace',
          fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          margin: 0,
          opacity: 0,
        }}>
          DISPATCHING ORDER // PLEASE STAND BY
        </p>
        <div style={{ width: '200px', height: '1px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          <div className="dispatch-progress-fill" style={{ height: '100%', background: '#E8470A', transformOrigin: 'left center', scaleX: 0 }} />
        </div>
      </div>
    </div>
  )
}
