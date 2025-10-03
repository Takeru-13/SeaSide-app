import React, { useMemo } from "react";

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

      {/* neon horizon（変更なし） */}
<div
  className="horizon"
  style={{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 'calc(66vh - 66px)',   // SVG高さ120の中心を60vhへ
    height: '3px',
    pointerEvents: 'none',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '100% 100%',
    // 細線＆グロー無しSVGを直接当てる
    backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
      horizonSvgThin(3, '#9ae7ff', 1)   // ← 曲率/色/線の太さ
    )}")`,
    // グローは完全にオフ
    filter: 'none',
    zIndex: 3,
  }}
/>



      {/* sea */}
      <div className="sea">
        <div className="wave wave-0" />
        <div className="wave wave-1" />
        <div className="wave wave-2" />
        <div className="wave wave-3" />
        <div className="wash" />
      </div>

      <style>{css}</style>
    </div>
  );
}

// === helpers ===
function makeStars(n: number) {
  return Array.from({ length: n }, () => {
    const x = Math.random() * 100;
    const y = Math.random() * 60;
    const sizePx = Math.random() < 0.15 ? 2 : 1;
    const o = 0.6 + Math.random() * 0.4;
    const delay = Math.random() * 6;
    const dur = 2.5 + Math.random() * 3.5;
    return { x, y, size: `${sizePx}px`, o, delay, dur };
  });
}

const css = `
:root{
  --bg-1: #161f3fff;
  --bg-2: #276850ff;
  --horizon-neon: #9ae7ff87;
  --glow-outer: rgba(0, 208, 255, 0.65);
  --glow-inner: rgba(0, 153, 255, 0.85);
}

.seaside-bg{
  position: fixed; inset: 0; z-index: -1; overflow: hidden;
  background: radial-gradient(120% 70% at 50% 0%, var(--bg-2) 0%, var(--bg-1) 60%, #060912 100%);
}

.sky{ position:absolute; inset:0 0 40vh 0; }
.stars{ position:absolute; inset:0 0 40vh 0; pointer-events:none; filter: drop-shadow(0 0 2px rgba(255,255,255,0.35)); }
.star{
  position:absolute; border-radius:50%;
  background: radial-gradient(circle, #fff 0%, #fff 55%, rgba(255,255,255,0) 70%);
  animation: twinkle ease-in-out infinite;
}
@keyframes twinkle{
  0%, 100% { opacity: 0.3; transform: scale(1); }
  40% { opacity: 0.95; transform: scale(1.2); }
  60% { opacity: 0.6; transform: scale(0.9); }
}

/* neon horizon（据え置き） */
.horizon{
  position:absolute; left:0; right:0; top:60vh; height:2px; z-index:3;
  background: var(--horizon-neon);
  box-shadow:
    0 0 10px var(--glow-inner),
    10px -10px 22px var(--glow-outer),
    0 0 42px var(--glow-outer);
}

/* sea container */
.sea{
  position:absolute; left:0; right:0; bottom:0; top:60vh; overflow:hidden;
  background: linear-gradient(to bottom, #1a0633ff 0%, #030106ff 100%);
  z-index:1;
}

/* 波レイヤー（SVGを背景にして上下ゆらぎ＋微横移動） */
.wave{
  position:absolute; left:-10%; right:-10%;
  height: 60%;
  background-repeat: repeat-x;
  background-size: 1440px 700px;
  background-position: center bottom;
  mix-blend-mode: screen;
  will-change: transform, opacity;
  pointer-events: none;
  z-index:2;
}

/* --- 各レイヤー：色をかなり薄く、独立した上下アニメ --- */
.wave-0{
  bottom: 0%;
  opacity: 0.35;
  background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(waveSvgLayer(0, '#0073efff', '#000000ff', 0.8))}");
  animation:
    drift-0 42s linear infinite,
    bob-0 8.5s ease-in-out infinite;
}
.wave-1{
  bottom: 8%;
  opacity: 0.32;
  background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(waveSvgLayer(1, '#000000ff', '#112a39ff', .39))}");
  animation:
    drift-1 36s linear infinite,
    bob-1 10.2s ease-in-out infinite;
}
.wave-2{
  bottom: 16%;
  opacity: 0.28;
  background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(waveSvgLayer(2, '#03ffd5ff', '#03261cff', 0.22))}");
  animation:
    drift-2 30s linear infinite,
    bob-2 12.4s ease-in-out infinite;
}
.wave-3{
  bottom: 24%;
  opacity: 0.24;
  background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(waveSvgLayer(3, '#9900ef', '#8ED1FC', 0.18))}");
  animation:
    drift-3 26s linear infinite,
    bob-3 14.8s ease-in-out infinite;
}

/* 横方向はごく微小に（水平線の印象を壊さない） */
@keyframes drift-0 { from{ transform: translateX(0) } to{ transform: translateX(-120px) } }
@keyframes drift-1 { from{ transform: translateX(0) } to{ transform: translateX(-160px) } }
@keyframes drift-2 { from{ transform: translateX(0) } to{ transform: translateX(-200px) } }
@keyframes drift-3 { from{ transform: translateX(0) } to{ transform: translateX(-240px) } }

/* 上下ゆらぎ（レイヤーごとに振幅/位相を変える） */
@keyframes bob-0 { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-10px) } }
@keyframes bob-1 { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-14px) } }
@keyframes bob-2 { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-18px) } }
@keyframes bob-3 { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-22px) } }

/* motion reduce */
@media (prefers-reduced-motion: reduce){
  .star{ animation: none; }
  .wave-0, .wave-1, .wave-2, .wave-3{ animation: none; }
}
`;

/** もとのSVGの4本の波パスを分解して吐き出す（超薄い発色） */
function waveSvgLayer(index: 0|1|2|3, c1: string, c2: string, opacity = 0.9){
  const paths = [
    // path-0
    "M 0,700 L 0,105 C 140.96428571428572,103.39285714285714 281.92857142857144,101.78571428571429 394,102 C 506.07142857142856,102.21428571428571 589.2500000000001,104.25 696,95 C 802.7499999999999,85.75 933.0714285714287,65.21428571428571 1061,65 C 1188.9285714285713,64.78571428571429 1314.4642857142858,84.89285714285714 1440,105 L 1440,700 L 0,700 Z",
    // path-1
    "M 0,700 L 0,245 C 112.42857142857142,219.03571428571428 224.85714285714283,193.07142857142858 347,199 C 469.14285714285717,204.92857142857142 601,242.75 712,253 C 823,263.25 913.1428571428571,245.92857142857142 1031,240 C 1148.857142857143,234.07142857142858 1294.4285714285716,239.53571428571428 1440,245 L 1440,700 L 0,700 Z",
    // path-2
    "M 0,700 L 0,385 C 140.5,394.17857142857144 281,403.35714285714283 393,392 C 505,380.64285714285717 588.5,348.75 716,349 C 843.5,349.25 1015,381.64285714285717 1143,393 C 1271,404.35714285714283 1355.5,394.67857142857144 1440,385 L 1440,700 L 0,700 Z",
    // path-3
    "M 0,700 L 0,525 C 113.89285714285714,499.92857142857144 227.78571428571428,474.85714285714283 344,489 C 460.2142857142857,503.14285714285717 578.7499999999999,556.5 699,574 C 819.2500000000001,591.5 941.2142857142858,573.1428571428571 1065,559 C 1188.7857142857142,544.8571428571429 1314.392857142857,534.9285714285714 1440,525 L 1440,700 L 0,700 Z",
  ];
  const d = paths[index];

  return `
  <svg xmlns='http://www.w3.org/2000/svg' width='1440' height='700' viewBox='0 0 1440 700'>
    <defs>
      <linearGradient id='g${index}' x1='0%' y1='50%' x2='100%' y2='50%'>
        <stop offset='5%' stop-color='${c1}'/>
        <stop offset='95%' stop-color='${c2}'/>
      </linearGradient>
    </defs>
    <path d='${d}' fill='url(#g${index})' fill-opacity='${opacity}' stroke='none'/>
  </svg>`;
}
function horizonSvgThin(curve = 90, color = '#9ae7ff', stroke = 1) {
  return `
<svg xmlns='http://www.w3.org/2000/svg' width='1440' height='120' viewBox='0 0 1440 120'>
  <path d='M0 60 Q 720 ${60 - curve} 1440 60'
        fill='none'
        stroke='${color}'
        stroke-width='${stroke}'
        vector-effect='non-scaling-stroke'
        shape-rendering='geometricPrecision'/>
</svg>`;
}