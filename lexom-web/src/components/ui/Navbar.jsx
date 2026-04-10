// LEXOM — Navbar Component
// Section: Global / 1 - Hero
// Dependencies: react, framer-motion, react-redux, lucide-react, lenis
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { toggleCartDrawer } from '../../store/cartSlice'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { getLenis } from '../../utils/lenisConfig'
import { useMatchMedia } from '../../hooks/useMatchMedia'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_LINKS = ['Home', 'Collection', 'Stories', 'Brand']

// Framer Motion variants for entrance animations
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

// Mobile menu panel variants
const menuPanelVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeInOut' },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
}

// Mobile link stagger variants
const mobileLinkVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut', delay: i * 0.05 },
  }),
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
}

export default function Navbar() {
  const dispatch = useDispatch()
  const cartCount = useSelector((state) => state.cart.cartItems.length)
  const isCartOpen = useSelector((state) => state.cart.isCartDrawerOpen)
  const navRef = useRef(null)
  const panelRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isDesktop = useMatchMedia('(min-width: 1024px)')
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavClick = (e, link) => {
    e.preventDefault()
    if (link === 'Collection') {
      navigate('/collection')
      if (isMenuOpen) closeMenu()
    } else if (link === 'Stories') {
      navigate('/about')
      if (isMenuOpen) closeMenu()
      window.scrollTo(0, 0)
    } else if (link === 'Home') {
      navigate('/')
      if (isMenuOpen) closeMenu()
      window.scrollTo(0, 0)
    } else if (link === 'Brand') {
      navigate('/brand')
      if (isMenuOpen) closeMenu()
      window.scrollTo(0, 0)
    } else {
      // If we are on the collection page but clicking a section link, go to home first
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          const el = document.getElementById(link.toLowerCase())
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        const el = document.getElementById(link.toLowerCase())
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
      if (isMenuOpen) closeMenu()
    }
  }

  // Detect scroll for background blur effect using Lenis scroll event
  useEffect(() => {
    let lenis = getLenis()
    const checkLenis = setInterval(() => {
      lenis = getLenis()
      if (lenis) {
        clearInterval(checkLenis)
        lenis.on('scroll', ({ scroll }) => {
          setScrolled(scroll > 80)
        })
      }
    }, 100)
    return () => clearInterval(checkLenis)
  }, [])

  // Click-outside to close mobile menu
  useEffect(() => {
    if (!isMenuOpen) return
    const handleClickOutside = (e) => {
      if (
        navRef.current &&
        !navRef.current.contains(e.target) &&
        panelRef.current &&
        !panelRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  // Home (/) = Black | Collection, About, Brand, & Product = White
  const isDarkBackgroundPage =
    ['/collection', '/about', '/brand'].includes(location.pathname) ||
    location.pathname.startsWith('/product/')
  const navColor = isDarkBackgroundPage ? '#FFFFFF' : '#000000'
  const mutedNavColor = isDarkBackgroundPage ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)'

  // Unified responsive width logic
  const currentNavWidth = scrolled
    ? (isDesktop ? '50%' : 'calc(100% - 2rem)')
    : '100%'
  const currentNavRadius = scrolled ? (isDesktop ? '999px' : '24px') : '0px'
  const currentNavTop = scrolled ? '1rem' : '0'

  return (
    <>
      <motion.nav
        ref={navRef}
        className={`glass-nav ${scrolled ? 'scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: currentNavTop,
          left: '50%',
          transform: 'translateX(-50%)',
          width: currentNavWidth,
          zIndex: 100,
          padding: isDesktop ? '0 clamp(1.5rem, 4vw, 3rem)' : '0 20px',
          height: isDesktop ? 'clamp(56px, 10vw, 72px)' : '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: currentNavRadius,
          backgroundColor: scrolled ? (isDesktop ? 'rgba(255, 255, 255, 0.15)' : 'transparent') : 'transparent',
          backdropFilter: scrolled ? (isDesktop ? 'blur(16px) saturate(180%)' : 'none') : 'none',
          WebkitBackdropFilter: scrolled ? (isDesktop ? 'blur(16px) saturate(180%)' : 'none') : 'none',
          border: scrolled ? (isDesktop ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent') : '1px solid transparent',
          boxShadow: scrolled ? '0 8px 32px 0 rgba(31, 38, 135, 0.07)' : 'none',
          transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* ─── LEFT: Brand Logo ─────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <span
            onClick={() => navigate('/')}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.625rem',
              color: navColor,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'color 0.4s ease',
            }}>
            LEXOM
          </span>
        </motion.div>

        {/* ─── CENTER: Navigation Links (desktop only lg+) ── */}
        <motion.ul
          variants={containerVariants}
          style={{
            alignItems: 'center',
            gap: 'clamp(1.2rem, 2.5vw, 2.2rem)',
            listStyle: 'none',
            margin: 0, padding: 0,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          className={`hidden ${!scrolled ? 'lg:flex' : ''}`}
        >
          {NAV_LINKS.map((link, i) => (
            <motion.li
              key={`${link}-${i}`}
              variants={itemVariants}
              style={{ position: 'relative' }}
            >
              <a
                href={`#${link.toLowerCase()}`}
                onClick={(e) => handleNavClick(e, link)}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 400,
                  fontSize: '0.72rem',
                  color: mutedNavColor,
                  textDecoration: 'none',
                  letterSpacing: '0.12em',
                  transition: 'color 300ms ease',
                  padding: '10px 0',
                }}
                onMouseEnter={(e) => { e.target.style.color = navColor }}
                onMouseLeave={(e) => { e.target.style.color = mutedNavColor }}
              >
                {link}
              </a>
            </motion.li>
          ))}
        </motion.ul>

        {/* ─── RIGHT: CTA + Cart + Hamburger ───────────────── */}
        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          {/* Cart icon with count badge */}
          <motion.button
            onClick={() => {
              if (isMenuOpen) {
                setIsMenuOpen(false)
              }
              dispatch(toggleCartDrawer())
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'relative',
              background: 'transparent',
              border: 'none',
              color: navColor,
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.4s ease',
            }}
            aria-label={`Cart — ${cartCount} items`}
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#E8470A',
                color: 'white',
                fontSize: '0.6rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'DM Sans, sans-serif',
              }}>
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </motion.button>



          {/* Hamburger toggle button */}
          <button
            className={`flex items-center ${!scrolled ? 'lg:hidden' : ''}`}
            onClick={() => {
              if (isCartOpen) {
                dispatch(toggleCartDrawer())
              }
              setIsMenuOpen((prev) => !prev)
            }}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'none',
              border: 'none',
              color: navColor,
              cursor: 'pointer',
              padding: '4px',
              marginLeft: '0.25rem',
              transition: 'color 0.4s ease',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMenuOpen ? (
                <motion.span
                  key="x"
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex' }}
                >
                  <X size={24} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex' }}
                >
                  <Menu size={24} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </motion.nav>

      {/* ─── MOBILE MENU PANEL ─────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={panelRef}
            key="mobile-menu"
            variants={menuPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'fixed',
              top: `calc(${currentNavTop} + ${isDesktop ? '72px' : '64px'} - 1px)`, // 1px overlap to prevent sub-pixel gaps
              left: '50%',
              transform: 'translateX(-50%)',
              width: currentNavWidth,
              zIndex: 150,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(30px) saturate(150%)',
              WebkitBackdropFilter: 'blur(30px) saturate(150%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderTop: 'none', // Attached feel
              borderBottomLeftRadius: currentNavRadius === '999px' ? '32px' : currentNavRadius,
              borderBottomRightRadius: currentNavRadius === '999px' ? '32px' : currentNavRadius,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              padding: '2rem 1.5rem',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
            className={!scrolled ? 'lg:hidden' : ''}
          >
            {/* Nav links stacked vertically */}
            <nav>
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={`mobile-${link}-${i}`}
                  href={`#${link.toLowerCase()}`}
                  custom={i}
                  variants={mobileLinkVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={(e) => handleNavClick(e, link)}
                  style={{
                    display: 'block',
                    padding: '1rem 0',
                    borderBottom: i < NAV_LINKS.length - 1
                      ? '0.5px solid rgba(255,255,255,0.08)'
                      : 'none',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 400,
                    fontSize: '1.1rem',
                    color: 'rgba(255,255,255,0.85)',
                    textDecoration: 'none',
                    letterSpacing: '0.01em',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)' }}
                >
                  {link}
                </motion.a>
              ))}
            </nav>

            {/* Contact Lexom full-width button inside mobile panel */}
            <motion.a
              href="#contact"
              custom={NAV_LINKS.length}
              variants={mobileLinkVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                marginTop: '1.5rem',
                padding: '0.9rem 1rem',
                borderRadius: '9999px',
                border: '1.5px solid rgba(255,255,255,0.7)',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 400,
                fontSize: '1rem',
                color: '#F5F5F5',
                textDecoration: 'none',
                background: 'transparent',
                letterSpacing: '0.01em',
                transition: 'background-color 0.25s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              Contact Lexom
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
