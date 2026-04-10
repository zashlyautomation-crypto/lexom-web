// LEXOM — Cinematic Intro Transition
// Renders once per session only on the home page ('/').
// Self-contained: no external CSS files, no changes to any other component.
// Stack: GSAP (already installed), inline styles, SVG.

import { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from 'gsap'

/* ─── Session guard ────────────────────────────────────────────── */
const SEEN_KEY = 'lexom_intro_v3'

/* ─── Watch-dial tick geometry ─────────────────────────────────── */
function buildTicks() {
  const arr = []
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * 2 * Math.PI - Math.PI / 2
    const isQ = i % 15 === 0   // quarter-hour (12,3,6,9)
    const isH = i % 5 === 0    // hour
    const ro = 88               // outer radius
    const ri = isQ ? 66 : isH ? 74 : 82  // inner radius
    const cx = 100, cy = 100
    arr.push({
      x1: +(cx + ri * Math.cos(angle)).toFixed(3),
      y1: +(cy + ri * Math.sin(angle)).toFixed(3),
      x2: +(cx + ro * Math.cos(angle)).toFixed(3),
      y2: +(cy + ro * Math.sin(angle)).toFixed(3),
      color: isQ
        ? '#E8470A'                       // brand orange — quarter marks only
        : isH
          ? 'rgba(200,200,200,0.65)'      // silver — hour marks
          : 'rgba(180,180,180,0.22)',      // faint silver — minute marks
      width: isQ ? 2.2 : isH ? 1.5 : 0.75,
    })
  }
  return arr
}

/* ─── SVG Dial (rendered in each panel) ────────────────────────── */
function WatchDial({ ticks }) {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Ambient silver halo */}
      <circle
        cx="100" cy="100" r="93"
        fill="none"
        stroke="rgba(245,245,245,0.03)"
        strokeWidth="46"
      />
      {/* Outer boundary ring */}
      <circle
        cx="100" cy="100" r="90"
        fill="none"
        stroke="rgba(245,245,245,0.08)"
        strokeWidth="1.5"
      />
      {/* Main animated draw circle */}
      <circle
        className="lxi-circle"
        cx="100" cy="100" r="90"
        fill="none"
        stroke="rgba(245,245,245,0.22)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      {/* Inner bezel reference ring */}
      <circle
        cx="100" cy="100" r="62"
        fill="none"
        stroke="rgba(245,245,245,0.04)"
        strokeWidth="0.5"
      />
      {/* Tick marks — staggered in by GSAP */}
      {ticks.map((t, i) => (
        <line
          key={i}
          className="lxi-tick"
          x1={t.x1} y1={t.y1}
          x2={t.x2} y2={t.y2}
          stroke={t.color}
          strokeWidth={t.width}
          strokeLinecap="round"
          opacity="0"
        />
      ))}
      {/* Crown centre dot */}
      <circle
        className="lxi-dot"
        cx="100" cy="100" r="3.5"
        fill="#E8470A"
        opacity="0"
      />
    </svg>
  )
}

/* ─── Radial glow disk (behind each dial) ──────────────────────── */
function GlowDisk() {
  return (
    <div
      className="lxi-glow"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: '-70%',
        background:
          'radial-gradient(circle, rgba(245,245,245,0.07) 0%, rgba(200,200,200,0.025) 40%, transparent 68%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

/* ─── Film-grain texture overlay ───────────────────────────────── */
function Grain() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        pointerEvents: 'none',
        opacity: 0.42,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23g)' opacity='0.055'/%3E%3C/svg%3E")`,
      }}
    />
  )
}

/* ─── Main export ───────────────────────────────────────────────── */
export default function IntroTransition() {
  // Only show on the home page and if not already seen this session
  const shouldInit = useMemo(() => {
    const isHome = window.location.pathname === '/'
    const hasSeen = sessionStorage.getItem(SEEN_KEY)
    return isHome && !hasSeen
  }, [])

  const [show, setShow] = useState(shouldInit)

  const topRef = useRef(null)
  const botRef = useRef(null)
  const tlRef = useRef(null)

  const ticks = useMemo(buildTicks, [])

  // SVG is 200×200px; centre = 100px from top
  const HALF = 100

  useEffect(() => {
    if (!show || !topRef.current || !botRef.current) return

    // Lock scroll for the duration of the intro
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const R = 90
    const CIRC = 2 * Math.PI * R

    /* Initial hidden states */
    gsap.set('.lxi-circle', { strokeDasharray: CIRC, strokeDashoffset: CIRC })
    gsap.set('.lxi-dot',    { opacity: 0, scale: 0, transformOrigin: '100px 100px' })
    gsap.set('.lxi-tick',   { opacity: 0 })
    gsap.set('.lxi-glow',   { opacity: 0, scale: 0.65, transformOrigin: 'center center' })
    gsap.set('.lxi-title',  { clipPath: 'inset(0% 0% 100% 0%)' })
    gsap.set('.lxi-hrl',    { scaleX: 0, transformOrigin: 'right center' })
    gsap.set('.lxi-hrr',    { scaleX: 0, transformOrigin: 'left center' })
    gsap.set('.lxi-tag',    { opacity: 0 })
    gsap.set('.lxi-prog',   { scaleX: 0, transformOrigin: 'left center' })

    const tl = gsap.timeline({
      onComplete() {
        sessionStorage.setItem(SEEN_KEY, '1')
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
        setTimeout(() => setShow(false), 80)
      },
    })
    tlRef.current = tl

    tl
      /* ① Glow blooms in */
      .to('.lxi-glow', {
        opacity: 1, scale: 1,
        duration: 1.0, ease: 'power2.out',
      }, 0.1)

      /* ② Bezel circle draws itself */
      .to('.lxi-circle', {
        strokeDashoffset: 0,
        duration: 1.55, ease: 'power2.inOut',
      }, 0.2)

      /* ③ Tick marks materialise */
      .to('.lxi-tick', {
        opacity: 1,
        duration: 0.75, ease: 'power2.out',
        stagger: { each: 0.012, from: 'start' },
      }, 0.45)

      /* ④ Crown dot pops in with elastic snap */
      .to('.lxi-dot', {
        opacity: 1, scale: 1,
        duration: 0.38, ease: 'elastic.out(1.5, 0.42)',
        transformOrigin: '100px 100px',
      }, 1.3)

      /* ⑤ Glow breathes — subtle luxury pulse during hold  */
      .to('.lxi-glow', {
        scale: 1.09, opacity: 0.85,
        duration: 0.85, ease: 'sine.inOut',
        yoyo: true, repeat: 1,
      }, 2.0)

      /* ⑥ LEXOM wordmark wipes up from below */
      .to('.lxi-title', {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.88, ease: 'power4.out',
      }, 1.8)

      /* ⑦ Hairlines extend from centre outward */
      .to('.lxi-hrl', { scaleX: 1, duration: 0.58, ease: 'power3.inOut' }, 2.22)
      .to('.lxi-hrr', { scaleX: 1, duration: 0.58, ease: 'power3.inOut' }, 2.27)

      /* ⑧ Tagline fades in */
      .to('.lxi-tag', { opacity: 1, duration: 0.55, ease: 'power2.out' }, 2.6)

      /* ⑨ Precision progress line fills (ambient load indicator) */
      .to('.lxi-prog', { scaleX: 1, duration: 1.0, ease: 'none' }, 2.75)

      /* HOLD — give users a moment to read */
      .to({}, { duration: 0.35 }, 3.75)

      /* ⑩ Inner content dims */
      .to('.lxi-inner', {
        opacity: 0,
        duration: 0.3, ease: 'power2.in',
      }, 4.1)

      /* ⑪ CURTAIN SPLIT — panels fly apart */
      .to(topRef.current, {
        yPercent: -100,
        duration: 1.05, ease: 'power4.inOut',
      }, 4.25)
      .to(botRef.current, {
        yPercent: 100,
        duration: 1.05, ease: 'power4.inOut',
      }, 4.25)

    return () => {
      if (tlRef.current) tlRef.current.kill()
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [show])

  if (!show) return null

  /* ── Shared panel content styles ─────────────────────────── */
  const panelBase = {
    position: 'absolute',
    left: 0, right: 0,
    background: '#0A0A0A',
    overflow: 'hidden',
    zIndex: 2,
  }

  return (
    <div
      role="status"
      aria-label="LEXOM — Loading experience"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        overflow: 'hidden',
        pointerEvents: 'all',
      }}
    >

      {/* ════════════ TOP PANEL ════════════
          Shows the UPPER half of the dial.
          The dial SVG centre aligns with the panel's bottom edge (the split line).
          overflow:hidden clips everything below the split.
      ═══════════════════════════════════ */}
      <div
        ref={topRef}
        style={{ ...panelBase, top: 0, height: '50%' }}
      >
        <Grain />

        {/* Ambient top-edge progress line */}
        <div
          className="lxi-prog"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(245,245,245,0.35) 40%, rgba(245,245,245,0.35) 60%, transparent 100%)',
            zIndex: 25,
          }}
        />

        {/*
          "bottom: -HALF" places the container's bottom edge
          HALF px below the panel's bottom  → container top = panelBottom - 200 + HALF = panelBottom - HALF
          → SVG occupies from (panelBottom - 200) to panelBottom
          → SVG centre = panelBottom - 100 = panelBottom - HALF   ✓ (at the split line)
          overflow:hidden shows only the top 100px of the SVG (upper semicircle)
        */}
        <div
          className="lxi-inner"
          style={{
            position: 'absolute',
            bottom: -HALF,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div style={{ position: 'relative', width: 200, height: 200 }}>
            <GlowDisk />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <WatchDial ticks={ticks} />
            </div>
          </div>
        </div>
      </div>

      {/* ════════════ BOTTOM PANEL ════════════
          Shows the LOWER half of the dial + LEXOM wordmark + tagline.
          The dial SVG centre aligns with the panel's top edge (the split line).
          overflow:hidden clips everything above the split.
      ═══════════════════════════════════════ */}
      <div
        ref={botRef}
        style={{ ...panelBase, bottom: 0, height: '50%' }}
      >
        <Grain />

        {/* Subtle bottom-edge hairline */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, rgba(245,245,245,0.04), transparent)',
            zIndex: 25,
          }}
        />

        {/*
          "top: -HALF" places the container's top edge
          HALF px ABOVE the panel's top (split line)
          → SVG occupies from (splitLine - HALF) to (splitLine + HALF)
          → SVG centre = splitLine  ✓
          overflow:hidden shows only the bottom 100px of the SVG (lower semicircle)
          Content below the SVG (text) sits naturally inside the panel ✓
        */}
        <div
          className="lxi-inner"
          style={{
            position: 'absolute',
            top: -HALF,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Dial — only lower half visible */}
          <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
            <GlowDisk />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <WatchDial ticks={ticks} />
            </div>
          </div>

          {/* ── LEXOM wordmark ── */}
          <div
            style={{
              marginTop: 20,
              textAlign: 'center',
              padding: '0 20px',
            }}
          >
            {/* Hairlines + title row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                justifyContent: 'center',
              }}
            >
              {/* Left hairline */}
              <div
                className="lxi-hrl"
                style={{
                  width: 44,
                  height: '0.5px',
                  background:
                    'linear-gradient(90deg, transparent, rgba(245,245,245,0.45))',
                  flexShrink: 0,
                }}
              />

              {/* LEXOM */}
              <span
                className="lxi-title"
                style={{
                  fontFamily: '"Bodoni Moda", serif',
                  fontSize: 'clamp(1.85rem, 5vw, 3.6rem)',
                  fontWeight: 400,
                  letterSpacing: '0.36em',
                  color: '#F5F5F5',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                LEXOM
              </span>

              {/* Right hairline */}
              <div
                className="lxi-hrr"
                style={{
                  width: 44,
                  height: '0.5px',
                  background:
                    'linear-gradient(90deg, rgba(245,245,245,0.45), transparent)',
                  flexShrink: 0,
                }}
              />
            </div>

            {/* Tagline */}
            <p
              className="lxi-tag"
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: 'clamp(0.45rem, 1.15vw, 0.6rem)',
                letterSpacing: '0.44em',
                color: 'rgba(245,245,245,0.3)',
                textTransform: 'uppercase',
                marginTop: 9,
                whiteSpace: 'nowrap',
              }}
            >
              Precision · Perfected · Since 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
