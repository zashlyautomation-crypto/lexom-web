// LEXOM — Home Page Template
// Assembles all primary landing sections.

import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/ui/Navbar'
import Hero from '../sections/1_Hero'
import Storytelling from '../sections/2_Storytelling'
import Collection from '../sections/3_Collection'
import Craftsmanship from '../sections/4_Craftsmanship'
import BrandVideo from '../sections/5_BrandVideo'
import VideoModal from '../components/ui/VideoModal'
import SplineViewer from '../components/3d/SplineViewer'
import Footer from '../sections/6_Footer'
import { useHeroAssetVisibility } from '../hooks/useHeroAssetVisibility'

const HomePage = () => {
  const isLargeScreen = useHeroAssetVisibility()

  useEffect(() => {
    // ScrollTrigger.refresh() is handled here for overall layout stability
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)

    return () => clearTimeout(timer)
  }, [isLargeScreen])

  return (
    <div className="relative">
      <div className="relative">
        <Navbar />
        <main className="relative">
          {/* Global Dynamic Spline Container (Fixed & Parallax-Controlled) - DESKTOP ONLY */}
          {isLargeScreen && (
            <div className="spline-global-wrapper fixed top-0 left-0 w-full h-screen pointer-events-none z-10">
              <div className="w-full h-full flex items-center justify-center">
                <SplineViewer />
              </div>
            </div>
          )}
          <Hero />
          <Storytelling />
          <Collection />
          <Craftsmanship />
          <BrandVideo />
        </main>
        <Footer />
        <VideoModal />
      </div>
    </div>
  )
}

export default HomePage
