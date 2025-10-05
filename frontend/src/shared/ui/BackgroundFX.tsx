import React, { useMemo, useState, useEffect } from "react";

export default function BackgroundFX() {
  const stars = useMemo(() => makeStars(120), []);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mousePixelPos, setMousePixelPos] = useState({ x: 0, y: 0 });
  const [timeOfDay, setTimeOfDay] = useState<'dusk' | 'night' | 'dawn'>('night');

  // === Shooting stars state ===
  type Shooting = { id:number; top:number; left:number; dx:number; dy:number; dur:number; delay:number };
  const [shootings, setShootings] = useState<Shooting[]>([]);

  // マウス視差
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
      setMousePixelPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 流れ星スポーン（8〜24秒間隔・最大3本）
  useEffect(() => {
    let alive = true;
    let id = 0;
    const spawn = () => {
      if (!alive) return;
      const s: Shooting = {
        id: id++,
        top: 5 + Math.random() * 35,
        left: 5 + Math.random() * 60,
        dx: 300 + Math.random() * 400,
        dy: 180 + Math.random() * 320,
        dur: 1.6 + Math.random() * 1.8,
        delay: Math.random() * 0.6,
      };
      setShootings(prev => [...prev.slice(-2), s]); // 合計最大3本
      setTimeout(spawn, 8000 + Math.random() * 16000);
    };
    spawn();
    return () => { alive = false; };
  }, []);

  // 時間帯の自動変化（30秒ごと）
  useEffect(() => {
    const cycle = ['night', 'dusk', 'dawn'] as const;
    let index = 0;
    const timer = setInterval(() => {
      index = (index + 1) % 3;
      setTimeOfDay(cycle[index]);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const colorScheme = getColorScheme(timeOfDay);

  return (
    <div
      className="seaside-bg"
      aria-hidden="true"
      style={{
        '--bg-1': colorScheme.bg1,
        '--bg-2': colorScheme.bg2,
        '--bg-3': colorScheme.bg3,
        '--horizon-neon': colorScheme.horizon,
        '--glow-outer': colorScheme.glowOuter,
        '--glow-inner': colorScheme.glowInner,
        '--star-color': colorScheme.starColor,
      } as React.CSSProperties}
    >
      {/* sky */}
      <div
        className="sky"
        style={{ transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)` }}
      />

      {/* stars */}
      <div
        className="stars"
        style={{ transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)` }}
      >
        {stars.map((s, i) => {
          const starX = (s.x / 100) * window.innerWidth;
          const starY = (s.y / 100) * (window.innerHeight * 0.6);
          const distance = Math.hypot(starX - mousePixelPos.x, starY - mousePixelPos.y);
          const isNear = distance < 150;
          return (
            <i
              key={i}
              className={`star ${s.type} ${isNear ? 'star-hover' : ''}`}
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
          );
        })}
      </div>

      {/* shooting stars：軌跡とヘッドを完全同期（--len共有・linear） */}
      <div className="shooting-stars">
        {shootings.map(s => {
          const angleDeg = Math.atan2(s.dy, s.dx) * 180 / Math.PI;
          const dist = Math.hypot(s.dx, s.dy);
          return (
            <React.Fragment key={s.id}>
              {/* 軌跡：開始点固定→回転→widthで伸長 */}
              <div
                className="shooting-trail"
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  ['--angle' as any]: `${angleDeg}deg`,
                  ['--len' as any]: `${dist}px`,
                  ['--dur' as any]: `${s.dur}s`,
                  ['--delay' as any]: `${s.delay}s`,
                }}
              />
              {/* ヘッド：回転座標系で translateX(--len) */}
              <div
                className="shooting-star"
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  ['--angle' as any]: `${angleDeg}deg`,
                  ['--len' as any]: `${dist}px`,
                  ['--dur' as any]: `${s.dur}s`,
                  ['--delay' as any]: `${s.delay}s`,
                }}
              />
            </React.Fragment>
          );
        })}
      </div>

      {/* horizon glow light（色は CSS 変数で補間） */}
      <div
        className="horizon-glow"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '60vh',
          height: '120px',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 0.6,
        }}
      />

      {/* 追加：海と空の境界線の光（ライン＋シマー） */}
      <div className="horizon-line-glow" />

      {/* neon horizon（SVGは currentColor、色は CSS の color で制御） */}
      <div
        className="horizon"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 'calc(60vh - 60px)',
          height: '120px',
          pointerEvents: 'none',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '100% 100%',
          backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
            horizonSvgCurved(-8, '#ignored', 2)
          )}")`,
          zIndex: 3,
        }}
      />

      {/* sea */}
      <div className="sea">
        <svg width="0" height="0">
          <defs>
            <clipPath id="sea-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0,0 Q 0.5,-0.0067 1,0 L 1,1 L 0,1 Z" />
            </clipPath>
          </defs>
        </svg>

        <div className="sea-reflection" />

        {/* 追加：海側の反射帯（境界直下の霞） */}
        <div className="sea-horizon-reflection" />

        <div className="wave wave-0" />
        <div className="wave wave-1" />
        <div className="wave wave-2" />
        <div className="wave wave-3" />
      </div>

      {/* 時間帯切替UI（必要なら表示） */}
      <div className="time-controls" style={{ display: 'none' }}>
        <button onClick={() => setTimeOfDay('dusk')} className={timeOfDay === 'dusk' ? 'active' : ''}>🌅 Dusk</button>
        <button onClick={() => setTimeOfDay('night')} className={timeOfDay === 'night' ? 'active' : ''}>🌙 Night</button>
        <button onClick={() => setTimeOfDay('dawn')} className={timeOfDay === 'dawn' ? 'active' : ''}>🌄 Dawn</button>
      </div>

      <style>{css}</style>
    </div>
  );
}

/* ===== helpers ===== */
type Star = {
  x: number; y: number; size: string; o: number; delay: number; dur: number;
  type: 'normal' | 'bright' | 'sparkle';
};

function makeStars(n: number): Star[] {
  return Array.from({ length: n }, () => {
    const x = Math.random() * 100;
    const y = Math.random() * 60;
    const rand = Math.random();
    let sizePx = 1; let type: Star['type'] = 'normal';
    if (rand < 0.05) { sizePx = 3; type = 'sparkle'; }
    else if (rand < 0.20) { sizePx = 2; type = 'bright'; }
    const o = type === 'sparkle' ? 0.9 : type === 'bright' ? 0.75 : 0.6 + Math.random() * 0.3;
    const delay = Math.random() * 6;
    const dur = type === 'sparkle' ? 1.5 + Math.random() * 1.5 : 2.5 + Math.random() * 3.5;
    return { x, y, size: `${sizePx}px`, o, delay, dur, type };
  });
}

type ColorScheme = {
  bg1: string; bg2: string; bg3: string;
  horizon: string; glowOuter: string; glowInner: string; starColor: string;
};

function getColorScheme(time: 'dusk' | 'night' | 'dawn'): ColorScheme {
  switch (time) {
    case 'dusk':
      return {
        bg1: '#2d1b4e',
        bg2: '#8b4367',
        bg3: '#060912',
        horizon: '#ff9a56',
        glowOuter: 'rgba(255, 154, 86, 0.65)',
        glowInner: 'rgba(255, 120, 60, 0.85)',
        starColor: '#ffd4a3',
      };
    case 'dawn':
      return {
        bg1: '#1a3a52',
        bg2: '#5a7d9a',
        bg3: '#0a1520',
        horizon: '#ffb5e8',
        glowOuter: 'rgba(255, 181, 232, 0.65)',
        glowInner: 'rgba(255, 150, 220, 0.85)',
        starColor: '#e8f4ff',
      };
    default: // night
      return {
        bg1: '#161f3f',
        bg2: '#276850',
        bg3: '#060912',
        horizon: '#9ae7ff',
        glowOuter: 'rgba(0, 208, 255, 0.65)',
        glowInner: 'rgba(0, 153, 255, 0.85)',
        starColor: '#ffffff',
      };
  }
}

/* === 波SVG：複合ハーモニクスで“うねうね”生成 === */
function waveSvgLayer(index: number, c1: string, c2: string, opacity = 0.9) {
  const W = 1440, H = 700;

  function mulberry32(a: number) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(123456 + index * 101);

  const baseY = [105, 245, 385, 525, 605][index % 5];
  const amp   = [26, 38, 22, 18, 14][index % 5];
  const f1    = 0.006 + rnd() * 0.003;
  const f2    = 0.020 + rnd() * 0.010;
  const f3    = 0.070 + rnd() * 0.020;
  const p1 = rnd() * Math.PI * 2;
  const p2 = rnd() * Math.PI * 2;
  const p3 = rnd() * Math.PI * 2;

  const steps = 40;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    const x = (W / steps) * i;
    const y =
      baseY
      + Math.sin(x * f1 + p1) * amp
      + Math.sin(x * f2 + p2) * (amp * 0.45)
      + Math.sin(x * f3 + p3) * (amp * 0.20);
    pts.push([x, Math.max(0, Math.min(H, y))]);
  }
  const d = `M 0,${H} L 0,${pts[0][1].toFixed(0)} ${pts.slice(1).map(([x,y])=>`L ${x.toFixed(0)},${y.toFixed(0)}`).join(' ')} L ${W},${H} L 0,${H} Z`;

  return `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}' viewBox='0 0 ${W} ${H}'>
    <defs>
      <linearGradient id='g${index}' x1='0%' y1='50%' x2='100%'>
        <stop offset='5%' stop-color='${c1}'/>
        <stop offset='95%' stop-color='${c2}'/>
      </linearGradient>
    </defs>
    <path d='${d}' fill='url(#g${index})' fill-opacity='${opacity}' stroke='none'/>
  </svg>`;
}

/* 水平線：色は currentColor を使い、CSSの .horizon { color: var(--horizon-neon) } で補間 */
function horizonSvgCurved(curve = 30, _color = '#9ae7ff', stroke = 2) {
  return `<svg xmlns='http://www.w3.org/2000/svg' width='1440' height='120' viewBox='0 0 1440 120' preserveAspectRatio='none'>
  <path d='M0 60 Q 720 ${60 + curve} 1440 60' fill='none' stroke='currentColor' stroke-width='${stroke}' stroke-linecap='round' vector-effect='non-scaling-stroke'/>
</svg>`;
}

const css = `
/* === Animatable Color Variables (Houdini) === */
@property --bg-1 { syntax: '<color>'; inherits: true; initial-value: #161f3f; }
@property --bg-2 { syntax: '<color>'; inherits: true; initial-value: #276850; }
@property --bg-3 { syntax: '<color>'; inherits: true; initial-value: #060912; }
@property --horizon-neon { syntax: '<color>'; inherits: true; initial-value: #9ae7ff; }
@property --glow-outer { syntax: '<color>'; inherits: true; initial-value: rgba(0, 208, 255, 0.65); }
@property --glow-inner { syntax: '<color>'; inherits: true; initial-value: rgba(0, 153, 255, 0.85); }
@property --star-color { syntax: '<color>'; inherits: true; initial-value: #ffffff; }

/* 背景：色変数そのものを補間 */
.seaside-bg{
  position: fixed; inset: 0; z-index: -1;
  overflow: clip;             /* ← 横スクロール抑止（hiddenより堅い） */
  contain: paint;             /* ← 子の影/フィルタをこの中に閉じる */
  background: radial-gradient(120% 70% at 50% 0%, var(--bg-2) 0%, var(--bg-1) 60%, var(--bg-3) 100%);
  transition:
    --bg-1 8s ease-in-out,
    --bg-2 8s ease-in-out,
    --bg-3 8s ease-in-out;
}

.sky{ position:absolute; inset:0 0 40vh 0; transition: transform .3s ease-out; }

.stars{ position:absolute; inset:0 0 40vh 0; pointer-events:none; transition: transform .2s ease-out; }

.star{
  position:absolute; border-radius:50%;
  animation: twinkle ease-in-out infinite;
  transition: --star-color 8s ease-in-out, filter .3s ease, transform .3s ease;
}
.star.normal {
  background: radial-gradient(circle, var(--star-color) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 70%);
  filter: drop-shadow(0 0 2px rgba(255,255,255,0.5));
}
.star.bright {
  background: radial-gradient(circle, var(--star-color) 0%, #e6ff40 45%, rgba(255,255,255,0) 70%);
  filter: drop-shadow(0 0 4px rgba(255,255,255,0.8)) drop-shadow(0 0 8px rgba(230,255,64,0.6));
}
.star.sparkle {
  background: radial-gradient(circle, var(--star-color) 0%, #fff 30%, #e6ff40 50%, rgba(255,255,255,0) 70%);
  filter: drop-shadow(0 0 6px rgba(255,255,255,1)) drop-shadow(0 0 12px rgba(230,255,64,0.8));
}
.star-hover {
  animation: twinkle-bright ease-in-out infinite !important;
  transform: scale(1.5) !important;
  filter: drop-shadow(0 0 10px rgba(255,255,255,1)) drop-shadow(0 0 20px rgba(230,255,64,1)) !important;
  transition: all .3s ease;
}

@keyframes twinkle{
  0%,100% { opacity: .3; transform: scale(1); }
  40% { opacity: 1; transform: scale(1.3); }
  60% { opacity: .6; transform: scale(.85); }
}
@keyframes twinkle-bright{
  0%,100% { opacity: 1; transform: scale(1.5); }
  50% { opacity: 1; transform: scale(1.8); }
}

/* === Shooting stars：軌跡とヘッドを完全同期（--len共有・linear） === */
.shooting-stars {
  position: absolute;
  inset: 0 0 40vh 0;
  pointer-events: none;
  z-index: 2;
}
.shooting-trail {
  position: absolute;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0));
  transform-origin: left center;
  transform: rotate(var(--angle));
  filter:
    drop-shadow(0 0 6px rgba(255,255,255,0.9))
    drop-shadow(0 0 12px rgba(255,255,255,0.6));
  animation: trail-grow var(--dur) linear forwards;
  animation-delay: var(--delay);
  opacity: 0;
  will-change: transform, width, opacity;
}
.shooting-star {
  position: absolute;
  width: 2px; height: 2px;
  background: white; border-radius: 50%;
  transform-origin: left center;
  filter:
    drop-shadow(0 0 6px rgba(255,255,255,0.9))
    drop-shadow(0 0 12px rgba(255,255,255,0.7));
  animation: shoot var(--dur) linear forwards;
  animation-delay: var(--delay);
  opacity: 0;
  will-change: transform, opacity;
}
@keyframes trail-grow {
  0%   { width: 0; opacity: 1; }
  85%  { width: calc(var(--len) * 0.85); opacity: 1; }
  100% { width: var(--len); opacity: 0; }
}
@keyframes shoot {
  0%   { transform: rotate(var(--angle)) translateX(0); opacity: 1; }
  85%  { transform: rotate(var(--angle)) translateX(calc(var(--len) * 0.85)); opacity: 1; }
  100% { transform: rotate(var(--angle)) translateX(var(--len)); opacity: 0; }
}

/* 水平線（SVGは currentColor）+ グローを変数で補間 */
.horizon{
  position:absolute; left:0; right:0; top:60vh; height:2px; z-index:3;
  color: var(--horizon-neon);
  filter:
    drop-shadow(0 0 8px var(--glow-inner))
    drop-shadow(0 0 16px var(--glow-outer))
    drop-shadow(0 0 24px var(--glow-outer));
  transition:
    color 8s ease-in-out,
    --glow-inner 8s ease-in-out,
    --glow-outer 8s ease-in-out,
    transform .3s ease-out;
  contain: paint;        /* ← 影を閉じ込める */
  overflow: clip;
}

/* 水平線下のグロー（色は --glow-inner を補間） */
.horizon-glow{
  position:absolute; left:0; right:0; top:60vh; height:120px; pointer-events:none; z-index:2;
  background: radial-gradient(ellipse 100% 50% at 50% 0%, var(--glow-inner) 0%, transparent 70%);
  opacity: .6;
  transition: --glow-inner 8s ease-in-out, opacity .6s ease;
  contain: paint;
  overflow: clip;
}

/* === 境界線の光（ライン＋シマー） === */
.horizon-line-glow{
  position: absolute;
  left: 0;
  right: 0;
  top: calc(60vh - 1px);
  height: 2px;
  z-index: 4; /* horizon(3)より上 */
  background: var(--horizon-neon);
  box-shadow:
    0 0 8px  var(--glow-inner),
    0 0 16px var(--glow-outer),
    0 0 28px var(--glow-outer);
  transition: --glow-inner 8s ease-in-out, --glow-outer 8s ease-in-out;
  isolation: isolate;
  contain: paint;
  overflow: clip;
}
.horizon-line-glow::before{
  content: '';
  position: absolute;
  inset: -6px 0 -6px 0; /* 横方向のはみ出しを0に */
  background:
    linear-gradient(90deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.85) 50%,
      rgba(255,255,255,0) 100%);
  mix-blend-mode: screen;
  opacity: 0.18;
  background-size: 200% 100%;
  animation: horizon-shimmer-bg 6.5s linear infinite;
  pointer-events: none;
}
@keyframes horizon-shimmer-bg{
  0%   { background-position: -50% 0; }
  100% { background-position: 150% 0; }
}

/* === 海側の反射帯（境界直下の霞） === */
.sea-horizon-reflection{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;            /* .sea内: 海の最上端＝地平線 */
  height: 22%;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(to bottom,
      color-mix(in oklab, var(--glow-inner) 70%, transparent) 0%,
      color-mix(in oklab, var(--glow-inner) 35%, transparent) 30%,
      transparent 100%);
  opacity: 0.55;

  -webkit-mask-image:
    repeating-linear-gradient(
      to bottom,
      rgba(0,0,0,0.95) 0px,
      rgba(0,0,0,0.95) 4px,
      rgba(0,0,0,0.65) 10px,
      rgba(0,0,0,0.65) 16px
    ),
    repeating-linear-gradient(
      110deg,
      rgba(0,0,0,0.9) 0,
      rgba(0,0,0,0.9) 10px,
      rgba(0,0,0,0.4) 18px,
      rgba(0,0,0,0.4) 28px
    );
  mask-image:
    repeating-linear-gradient(
      to bottom,
      rgba(0,0,0,0.95) 0px,
      rgba(0,0,0,0.95) 4px,
      rgba(0,0,0,0.65) 10px,
      rgba(0,0,0,0.65) 16px
    ),
    repeating-linear-gradient(
      110deg,
      rgba(0,0,0,0.9) 0,
      rgba(0,0,0,0.9) 10px,
      rgba(0,0,0,0.4) 18px,
      rgba(0,0,0,0.4) 28px
    );

  animation: sea-reflect-wobble 12s ease-in-out infinite;
  transition: --glow-inner 8s ease-in-out;
  contain: paint;
  overflow: clip;
}
@keyframes sea-reflect-wobble{
  0%   { transform: translateY(0px); opacity: 0.55; }
  50%  { transform: translateY(2px); opacity: 0.62; }
  100% { transform: translateY(0px); opacity: 0.55; }
}

.sea{
  position:absolute; left:0; right:0; bottom:0; top:60vh;
  overflow: clip;                     /* ← ここも clip */
  background: linear-gradient(to bottom, #1a0633 0%, #030106 100%);
  z-index:1; clip-path: url(#sea-clip);
}

.wave{
  position:absolute; left:0; right:0; height:64%;
  background-repeat: repeat-x; background-size: 1440px 700px; background-position: center bottom;
  mix-blend-mode: screen; pointer-events: none; z-index:2;
  will-change: transform; transform: translateZ(0);
}
.wave-0{
  bottom:0%; opacity:.42;
  background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(waveSvgLayer(0, '#0073ef', '#000000', 0.8))}");
  animation: drift-0 38s linear infinite, bob-0 7.8s ease-in-out infinite;
}
.wave-1{
  bottom:9%; opacity:.36;
  background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(waveSvgLayer(1, '#000000', '#112a39', .39))}");
  animation: drift-1 33s linear infinite, bob-1 9.6s ease-in-out infinite;
}
.wave-2{
  bottom:18%; opacity:.32;
  background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(waveSvgLayer(2, '#03ffd5', '#03261c', 0.22))}");
  animation: drift-2 28s linear infinite, bob-2 12.2s ease-in-out infinite;
}
.wave-3{
  bottom:26%; opacity:.28;
  background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(waveSvgLayer(3, '#9900ef', '#8ED1FC', 0.18))}");
  animation: drift-3 24s linear infinite, bob-3 14.2s ease-in-out infinite;
}

/* 横流れは手前ほど速く */
@keyframes drift-0 { from{ transform: translateX(0) } to{ transform: translateX(-180px) } }
@keyframes drift-1 { from{ transform: translateX(0) } to{ transform: translateX(-220px) } }
@keyframes drift-2 { from{ transform: translateX(0) } to{ transform: translateX(-260px) } }
@keyframes drift-3 { from{ transform: translateX(0) } to{ transform: translateX(-320px) } }

/* 縦ゆらぎは手前ほど大きく速く */
@keyframes bob-0 { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-16px) } }
@keyframes bob-1 { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-18px) } }
@keyframes bob-2 { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-22px) } }
@keyframes bob-3 { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-26px) } }

/* 時間帯コントロール */
.time-controls{
  position:fixed; top:20px; right:20px; display:flex; gap:10px; z-index:1000;
}
.time-controls button{
  padding:8px 16px; background:rgba(0,0,0,.5);
  border:1px solid rgba(255,255,255,.2); border-radius:8px; color:#fff; cursor:pointer;
  font-size:14px; transition:all .3s ease; backdrop-filter: blur(10px);
}
.time-controls button:hover{ background:rgba(0,0,0,.7); border-color:rgba(255,255,255,.4); transform: translateY(-2px); }
.time-controls button.active{ background:rgba(255,255,255,.2); border-color:rgba(255,255,255,.6); box-shadow:0 0 20px rgba(255,255,255,.3); }

/* 軽減モーション */
@media (prefers-reduced-motion: reduce){
  .star{ animation:none; }
  .wave-0, .wave-1, .wave-2, .wave-3{ animation:none; }
  .shooting-star, .shooting-trail { animation:none; opacity:0; }
  .sky, .stars, .horizon, .sea { transition:none !important; }
  .sea-reflection { animation:none; }
}
`;

/* ===== ここまで ===== */
