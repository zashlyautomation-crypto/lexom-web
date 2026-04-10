import { useState, useEffect } from 'react'

/**
 * Custom hook to manage the core logic for hero section 3D assets.
 * 
 * Returns true if the screen is "Large" (>= 1024x593) for SplineViewer.
 * Returns false if the screen is "Small" ( < 1024x593) for MobileSplineHero.
 */
export function useHeroAssetVisibility() {
  const query = '(min-width: 1024px) and (min-height: 593px)'
  
  const [isLargeScreen, setIsLargeScreen] = useState(
    () => window.matchMedia(query).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handleChange = (e) => setIsLargeScreen(e.matches)

    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [query])

  return isLargeScreen
}
