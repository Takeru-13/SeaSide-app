import React, { useMemo } from "react";

/**
 * SeaSide BackgroundFX
 * - Night sea in deep navy & purple
 * - Neon horizon
 * - Gentle parallax waves
 * - Twinkling stars (respect reduced motion)
 *
 * Usage:
 * <BackgroundFX />
 * Place it near the root of your app (positioned) and ensure your content sits above it.
 */
export default function BackgroundFX() {
  const stars = useMemo(() => makeStars(72), []);
  return (
    <div className="seaside-bg" aria-hidden>
      {/* sky gradient */}
      <div className="sky" />

      {/* twinkling stars */}
      <div className="stars">
        {stars.map((s, i) => (
          <i
            key={i}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              opacity: s.o,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
              width: s.size,
              height: s.size,
            }}
          />
        ))}
      </div>

      {/* neon horizon */}
      <div className="horizon" />

      {/* sea */}
      <div className="sea">
        <div className="wave wave-1" />
        <div className="wave wave-2" />
        <div className="wave wave-3" />
      </div>

      <style>{css}</style>
    </div>
  );
}

// === helpers ===
function makeStars(n: number) {
  // Spread stars mostly in the top 60% (sky area)
  const arr = Array.from({ length: n }, () => {
    const x = Math.random() * 100; // vw percentage
    const y = Math.random() * 60; // vh percentage (top 60%)
    const sizePx = Math.random() < 0.15 ? 2 : 1; // tiny + some slightly brighter
    const o = 0.6 + Math.random() * 0.4; // base opacity
    const delay = Math.random() * 6; // stagger
    const dur = 2.5 + Math.random() * 3.5; // 2.5s–6s twinkles
    return { x, y, size: `${sizePx}px`, o, delay, dur };
  });
  return arr;
}

// === CSS-in-TS for Canvas preview ===
const css = `
:root{
  /* Theme tokens */
  --bg-1: #0B0F1E;     /* deep navy */
  --bg-2: #140C1F;     /* deep purple */
  --horizon-neon: #9E5CFF;  /* violet neon */
  --sea-1: #0A1A3A;    /* dark sea */
  --sea-2: #0D234E;    /* mid sea */
  --sea-3: #112B62;    /* light sea */
  --glow-outer: rgba(158,92,255,0.22);
  --glow-inner: rgba(158,92,255,0.55);
}

.seaside-bg{
  position: fixed; inset: 0; z-index: -1; overflow: hidden;
  background: radial-gradient(120% 70% at 50% 0%, var(--bg-2) 0%, var(--bg-1) 60%, #060912 100%);
}

.sky{ position:absolute; inset:0 0 40vh 0; /* bottom stops ~horizon */ }

.stars{ position:absolute; inset:0 0 40vh 0; pointer-events:none; filter: drop-shadow(0 0 2px rgba(255,255,255,0.4)); }
.star{
  position:absolute; border-radius:50%; background: radial-gradient(circle, #fff 0%, #fff 55%, rgba(255,255,255,0.0) 70%);
  animation: twinkle ease-in-out infinite;
}
@keyframes twinkle{
  0%, 100% { opacity: 0.3; transform: scale(1); }
  40% { opacity: 0.95; transform: scale(1.2); }
  60% { opacity: 0.6; transform: scale(0.9); }
}

/* neon horizon */
.horizon{
  position:absolute; left:0; right:0; top:60vh; height:2px;
  background: var(--horizon-neon);
  box-shadow:
    0 0 10px var(--glow-inner),
    0 0 22px var(--glow-outer),
    0 0 42px var(--glow-outer);
}

/* sea layers */
.sea{ position:absolute; left:0; right:0; bottom:0; top:60vh; overflow:hidden; background: linear-gradient(to bottom, #071226 0%, #050B18 100%); }
.wave{
  position:absolute; left:-25%; right:-25%; /* wider than viewport to allow drift */
  height: 40%;
  opacity: 0.45; mix-blend-mode: lighten;
  background-size: 1800px 220px; /* SVG wave tile size */
  background-repeat: repeat-x;
  will-change: transform;
}

/* Provide three subtle parallax layers with different speeds */
.wave-1{ bottom: 0; background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(waveSvg("%230D234E"))}"); animation: swell-1 22s linear infinite; opacity:0.20; }
.wave-2{ bottom: 10%; background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(waveSvg("%23112B62"))}"); animation: swell-2 28s linear infinite; opacity:0.28; }
.wave-3{ bottom: 20%; background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(waveSvg("%230A1A3A"))}"); animation: swell-3 36s linear infinite; opacity:0.35; }

@keyframes swell-1{ from{ transform: translateX(0) } to{ transform: translateX(-600px) } }
@keyframes swell-2{ from{ transform: translateX(0) } to{ transform: translateX(-800px) } }
@keyframes swell-3{ from{ transform: translateX(0) } to{ transform: translateX(-1000px) } }

/* Accessibility: reduce motion */
@media (prefers-reduced-motion: reduce){
  .star { animation: none; }
  .wave-1, .wave-2, .wave-3 { animation: none; }
}
`;

function waveSvg(hex: string){
  // A soft sine-like wave tile (width 1800, height 220)
  return `
  <svg xmlns='http://www.w3.org/2000/svg' width='1800' height='220' viewBox='0 0 1800 220'>
    <defs>
      <linearGradient id='g' x1='0' x2='0' y1='0' y2='1'>
        <stop offset='0' stop-color='${hex}' stop-opacity='0.8'/>
        <stop offset='1' stop-color='${hex}' stop-opacity='0.0'/>
      </linearGradient>
    </defs>
    <path fill='url(#g)' d='
      M 0 120
      C 150 80, 300 80, 450 120
      S 750 160, 900 120
      S 1200 80, 1350 120
      S 1650 160, 1800 120
      L 1800 220 L 0 220 Z'
    />
  </svg>`;
}
