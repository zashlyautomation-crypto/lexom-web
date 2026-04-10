// LEXOM — useMatchMedia Hook
// Section: Global
// Dependencies: react
import { useState, useEffect } from 'react'

/**
 * Responsive breakpoint detector.
 * Usage: const isDesktop = useMatchMedia('(min-width: 768px)')
 * Returns true when media query matches.
 */
export function useMatchMedia(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handleChange = (e) => setMatches(e.matches)

    // Modern browsers
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [query])

  return matches
}
