import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ToastNotification() {
  const [globalToast, setGlobalToast] = useState(null)

  useEffect(() => {
    const checkToast = () => {
      const toastData = localStorage.getItem('lexom_toast')
      if (toastData) {
        try {
          const toast = JSON.parse(toastData)
          // Only show if within last 3 seconds
          if (Date.now() - toast.timestamp < 3000) {
            setGlobalToast(toast)
            localStorage.removeItem('lexom_toast')
            setTimeout(() => setGlobalToast(null), 5000)
          } else {
            localStorage.removeItem('lexom_toast') 
          }
        } catch (e) {}
      }
    }
    
    checkToast()
    
    // Listen for cross-tab or programmatic storage events if needed
    const handleStorage = () => checkToast()
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <AnimatePresence>
      {globalToast && (
        <motion.div
          initial={{ opacity: 0, y: -60, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -60, x: '-50%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            background: '#0A0A0A',
            border: '0.5px solid rgba(232,71,10,0.4)',
            borderRadius: '8px',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 4px 32px rgba(232,71,10,0.15)',
            whiteSpace: 'nowrap',
          }}
        >
          {/* Status dot */}
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#E8470A',
            flexShrink: 0,
            animation: 'toastPulse 1.5s infinite',
          }} />

          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.72rem',
            color: '#F5F0E8',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            {globalToast.message}
          </span>

          {/* Progress bar */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '2px',
              background: '#E8470A',
              borderRadius: '0 0 8px 8px',
            }}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
