import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

let lenisInstance = null

export function initLenis() {
  // Kill existing instance if any
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) =>
      Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2,
  })

  // CRITICAL FIX: Immediately sync ScrollTrigger with the browser's actual scroll
  // position before the first Lenis RAF tick fires. This ensures ScrollTriggers
  // created by section components (which mount before App's useEffect) have the
  // correct position and fire their onEnter callbacks on mid-page refresh.
  const nativeScroll = document.documentElement.scrollTop || document.body.scrollTop || 0
  if (nativeScroll > 0) {
    ScrollTrigger.update()
  }

  // Sync GSAP ticker with Lenis RAF
  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  lenisInstance.on('scroll', ({ scroll, limit, progress }) => {

    // Dispatch native scroll event
    // so external listeners (like Spline) fire
    // RECURSION GUARD: Only dispatch if not triggered by our own manual dispatch
    if (!window.__isDispatchingLenisScroll) {
      window.__isDispatchingLenisScroll = true
      window.dispatchEvent(new Event('scroll', {
        bubbles: false,
        cancelable: false,
      }))
      window.__isDispatchingLenisScroll = false
    }

    // Update GSAP ScrollTrigger
    ScrollTrigger.update()

    // Calculate Spline scroll progress
    const heroEl = document.getElementById('hero')
    const storyEl = document.getElementById('storytelling')

    if (heroEl && storyEl) {
      const heroTop = heroEl.offsetTop
      const storyBottom = storyEl.offsetTop + storyEl.offsetHeight
      const totalDistance = storyBottom - heroTop
      const splineProgress = Math.max(0, Math.min(1, (scroll - heroTop) / totalDistance))

      window.__splineScrollProgress = splineProgress

      window.dispatchEvent(
        new CustomEvent('spline-progress', {
          detail: {
            progress: splineProgress,
            scroll: scroll
          }
        })
      )
    }
  })

  return lenisInstance
}

export function getLenis() {
  return lenisInstance
}

export function destroyLenis() {
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
    gsap.ticker.remove(
      (time) => lenisInstance?.raf(time * 1000)
    )
  }
}
