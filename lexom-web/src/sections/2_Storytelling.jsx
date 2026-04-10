// LEXOM — Storytelling Section (Section 2)
// Section: 2 - Storytelling / Comfort
// Dependencies: react, gsap
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from '../data/content.json';
import armImage from '../assets/arm-for-story/067ac466-01c3-4987-8619-5f79c6bfa83a.png';

gsap.registerPlugin(ScrollTrigger);

export default function Storytelling() {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Only run animations on desktop (where the section is displayed)
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {


      // 1. Initial State Definitions
      gsap.set('.story-label', { opacity: 0, y: -10 });
      gsap.set('.story-head-1', { opacity: 0, x: -30 });
      gsap.set('.story-head-2', { opacity: 0, x: -30 });
      gsap.set('.story-line', { strokeDashoffset: 1 });
      gsap.set('.story-dot', { opacity: 0, scale: 0 });
      gsap.set('.card-engineering', { opacity: 0, x: 30 });
      gsap.set('.card-casing', { opacity: 0, x: -30 });
      gsap.set('.card-material', { opacity: 0, x: 30 });
      gsap.set('.story-cta', { opacity: 0, scale: 0.8 });

      // 2. Build Paused Timeline
      const tl = gsap.timeline({ paused: true });

      tl.to(".story-label", { opacity: 1, y: 0, duration: 0.5 }, 0);
      tl.to(".story-head-1", { opacity: 1, x: 0, duration: 0.7 }, 0.15);
      tl.to(".story-head-2", { opacity: 1, x: 0, duration: 0.7 }, 0.3);
      tl.to(".story-line", { strokeDashoffset: 0, duration: 0.8, stagger: 0.2, ease: "power2.inOut" }, 0.5);
      tl.to(".story-dot", { opacity: 1, scale: 1, duration: 0.3, stagger: 0.2 }, 0.7);
      tl.to(".card-engineering", { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, 0.8);
      tl.to(".card-casing", { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, 0.95);
      tl.to(".card-material", { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, 1.1);
      tl.to(".story-cta", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" }, 1.2);

      // 3. Fire-And-Forget Trigger
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => tl.play()
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="storytelling"
      className="hidden lg:block relative overflow-hidden"
      style={{ height: '100vh', width: '100vw', backgroundColor: '#FAFAFA' }}
    >
      {/* BACKGROUND: Arm Image */}
      <img
        src={armImage}
        alt="Lexom Experience"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0, objectPosition: 'center center' }}
      />

      {/* ATMOSPHERE: Warm Underglow */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: 'radial-gradient(ellipse 50% 35% at 50% 65%, rgba(220, 150, 60, 0.35) 0%, rgba(255, 200, 100, 0.15) 50%, transparent 80%)'
        }}
      />

      {/* SVG CONNECTOR LINES */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }}>
        {/* Line 1 - Engineering */}
        <line className="story-line" x1="62%" y1="42%" x2="78%" y2="16%" stroke="rgba(200, 195, 188, 0.7)" strokeWidth="0.8" fill="none" pathLength="1" strokeDasharray="1px" strokeDashoffset="1px" />
        <circle className="story-dot origin-center" style={{ transformOrigin: '62% 42%' }} cx="62%" cy="42%" r="3" fill="rgba(200, 195, 188, 0.9)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

        {/* Line 2 - Casing */}
        <line className="story-line" x1="42%" y1="58%" x2="22%" y2="82%" stroke="rgba(200, 195, 188, 0.7)" strokeWidth="0.8" fill="none" pathLength="1" strokeDasharray="1px" strokeDashoffset="1px" />
        <circle className="story-dot origin-center" style={{ transformOrigin: '42% 58%' }} cx="42%" cy="58%" r="3" fill="rgba(200, 195, 188, 0.9)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

        {/* Line 3 - Material */}
        <line className="story-line" x1="58%" y1="62%" x2="78%" y2="88%" stroke="rgba(200, 195, 188, 0.7)" strokeWidth="0.8" fill="none" pathLength="1" strokeDasharray="1px" strokeDashoffset="1px" />
        <circle className="story-dot origin-center" style={{ transformOrigin: '58% 62%' }} cx="58%" cy="62%" r="3" fill="rgba(200, 195, 188, 0.9)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      </svg>

      {/* HEADLINE BLOCK */}
      <div
        className="absolute z-10 w-full max-w-[600px] flex flex-col items-start"
        style={{ left: '8%', top: '8%' }}
      >
        <span
          className="story-label block mb-3 uppercase"
          style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 400, fontSize: '0.7rem', color: 'rgba(0,0,0,0.55)', letterSpacing: '0.25em' }}
        >
          {content.storytelling.label}
        </span>
        <h2
          className="leading-none text-left"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(3rem, 5.5vw, 5.5rem)', color: '#0A0A0A' }}
        >
          <div className="story-head-1" style={{ fontWeight: 400 }}>
            {content.storytelling.headline_light}
          </div>
          <div className="story-head-2" style={{ fontWeight: 800 }}>
            {content.storytelling.headline_bold}
          </div>
        </h2>
      </div>

      {/* CARD 1: ENGINEERING (Top Right) */}
      <div
        className="card-engineering absolute z-20 flex flex-col"
        style={{
          top: '12%', right: '3%', width: 'clamp(240px, 20vw, 320px)',
          background: 'rgba(40, 38, 35, 0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.2rem 1.4rem'
        }}
      >
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontSize: '0.65rem', color: 'rgba(200,190,175,0.8)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          {content.storytelling.cards[0].category}
        </span>
        <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 'clamp(0.9rem, 1.1vw, 1.1rem)', color: '#F5F5F5', lineHeight: 1.25, marginBottom: '0.5rem' }}>
          {content.storytelling.cards[0].title}
        </h3>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontSize: 'clamp(0.75rem, 0.85vw, 0.85rem)', color: 'rgba(220,210,195,0.85)', lineHeight: 1.5, margin: 0 }}>
          {content.storytelling.cards[0].description}
        </p>
      </div>

      {/* CARD 2: CASING (Bottom Left) */}
      <div
        className="card-casing absolute z-20 flex flex-col"
        style={{
          bottom: '14%', left: '2%', width: 'clamp(240px, 20vw, 320px)',
          background: 'rgba(40, 38, 35, 0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.2rem 1.4rem'
        }}
      >
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontSize: '0.65rem', color: 'rgba(200,190,175,0.8)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          {content.storytelling.cards[1].category}
        </span>
        <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 'clamp(0.9rem, 1.1vw, 1.1rem)', color: '#F5F5F5', lineHeight: 1.25, marginBottom: '0.5rem' }}>
          {content.storytelling.cards[1].title}
        </h3>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontSize: 'clamp(0.75rem, 0.85vw, 0.85rem)', color: 'rgba(220,210,195,0.85)', lineHeight: 1.5, margin: 0 }}>
          {content.storytelling.cards[1].description}
        </p>
      </div>

      {/* CARD 3: MATERIAL (Bottom Right) */}
      <div
        className="card-material absolute z-20 flex flex-col"
        style={{
          bottom: '8%', right: '2%', width: 'clamp(240px, 20vw, 320px)',
          background: 'rgba(40, 38, 35, 0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.2rem 1.4rem'
        }}
      >
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontSize: '0.65rem', color: 'rgba(200,190,175,0.8)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          {content.storytelling.cards[2].category}
        </span>
        <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 'clamp(0.9rem, 1.1vw, 1.1rem)', color: '#F5F5F5', lineHeight: 1.25, marginBottom: '0.5rem' }}>
          {content.storytelling.cards[2].title}
        </h3>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontSize: 'clamp(0.75rem, 0.85vw, 0.85rem)', color: 'rgba(220,210,195,0.85)', lineHeight: 1.5, margin: 0 }}>
          {content.storytelling.cards[2].description}
        </p>
      </div>

      {/* SHOP NOW BUTTON */}
      <div className="absolute z-20 flex justify-center w-full" style={{ bottom: '8%' }}>
        <button
          onClick={() => navigate('/collection')}
          className="story-cta transition-all duration-250 hover:scale-[1.03] uppercase cursor-pointer hover:bg-[rgba(30,30,30,0.95)]"
          style={{
            background: 'rgba(15, 15, 15, 0.92)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '9999px', padding: '14px 36px',
            color: '#F5F5F5', fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
            fontSize: '0.85rem', letterSpacing: '0.15em'
          }}
        >
          {content.storytelling.cta}
        </button>
      </div>
    </section>
  );
}
