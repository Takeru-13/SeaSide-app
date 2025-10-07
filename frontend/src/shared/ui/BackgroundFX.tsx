import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
}

interface ShootingStar {
  id: number;
  left: string;
  top: string;
  angle: number;
  delay: number;
  duration: number;
}

const BackgroundFX: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    // Generate random stars (reduced for performance)
    const generatedStars: Star[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 67}%`, // 67% = 100% - 33% (wave area)
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 3
    }));
    setStars(generatedStars);

    // Generate shooting stars (very infrequent - approximately every 30 seconds)
    const generatedShootingStars: ShootingStar[] = Array.from({ length: 2 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 30}%`,
      angle: Math.random() * 20 + 35,
      delay: i * 30,
      duration: 30
    }));
    setShootingStars(generatedShootingStars);
  }, []);

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes shoot {
          0% {
            opacity: 0;
            transform: translate(0, 0);
          }
          1% {
            opacity: 1;
          }
          5% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty));
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty));
          }
        }

        @keyframes horizon-pulse {
          0%, 100% {
            opacity: 0.9;
            filter: blur(8px);
            boxShadow: 0 0 40px rgba(255, 105, 180, 1), 0 0 80px rgba(186, 85, 211, 0.8), 0 0 120px rgba(138, 43, 226, 0.6);
          }
          50% {
            opacity: 1;
            filter: blur(10px);
            boxShadow: 0 0 50px rgba(255, 105, 180, 1), 0 0 100px rgba(186, 85, 211, 0.9), 0 0 150px rgba(138, 43, 226, 0.7);
          }
        }

        @keyframes wave-motion-slow {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(-15px) translateY(-5px);
          }
        }

        @keyframes wave-motion-fast {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(-25px) translateY(-8px);
          }
        }
      `}</style>

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: `
          radial-gradient(ellipse at 50% 70%, rgba(30, 47, 74, 0.8) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 40%, rgba(24, 40, 68, 0.6) 0%, transparent 40%),
          radial-gradient(ellipse at 80% 30%, rgba(26, 44, 72, 0.5) 0%, transparent 35%),
          linear-gradient(to bottom, 
            #050b14 0%, 
            #0a1628 20%, 
            #0f1e38 40%,
            #182844 60%, 
            #1e2f4a 80%,
            #243a5e 100%
          )
        `,
        zIndex: -1,
        pointerEvents: 'none'
      }}>
        {/* Star field */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}>
          {stars.map(star => (
            <div
              key={star.id}
              style={{
                position: 'absolute',
                left: star.left,
                top: star.top,
                width: `${star.size}px`,
                height: `${star.size}px`,
                background: '#fff',
                borderRadius: '50%',
                boxShadow: '0 0 1px rgba(255, 255, 255, 0.5)',
                animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`
              }}
            />
          ))}
        </div>

        {/* Shooting stars */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '70%',
          pointerEvents: 'none',
          overflow: 'hidden'
        }}>
          {shootingStars.map(star => {
            const radian = (star.angle * Math.PI) / 180;
            const distance = 400;
            const tx = Math.cos(radian) * distance;
            const ty = Math.sin(radian) * distance;
            
            return (
              <div
                key={star.id}
                style={{
                  position: 'absolute',
                  left: star.left,
                  top: star.top,
                  width: '3px',
                  height: '3px',
                  background: 'radial-gradient(circle, #fff 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
                  borderRadius: '50%',
                  boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.9)',
                  animation: `shoot ${star.duration}s ${star.delay}s infinite`,
                  opacity: 0,
                  ['--tx' as any]: `${tx}px`,
                  ['--ty' as any]: `${ty}px`
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '120px',
                  height: '2px',
                  background: 'linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.9) 30%, rgba(135, 206, 250, 0.6) 70%, transparent 100%)',
                  transform: `translate(-100%, -50%) rotate(${star.angle}deg)`,
                  transformOrigin: 'right center',
                  filter: 'blur(0.5px)'
                }} />
              </div>
            );
          })}
        </div>

        {/* Horizon glow - enhanced */}
        <div style={{
          position: 'absolute',
          bottom: '33%',
          left: 0,
          width: '100%',
          height: '8px',
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(255, 105, 180, 0.9) 0%, transparent 70%),
            linear-gradient(90deg, 
              rgba(255, 105, 180, 0) 0%, 
              rgba(255, 105, 180, 0.8) 15%,
              rgba(255, 20, 147, 0.9) 30%,
              rgba(186, 85, 211, 1) 50%,
              rgba(255, 20, 147, 0.9) 70%,
              rgba(255, 105, 180, 0.8) 85%,
              rgba(255, 105, 180, 0) 100%
            )
          `,
          filter: 'blur(8px)',
          boxShadow: `
            0 0 40px rgba(255, 105, 180, 1),
            0 0 80px rgba(186, 85, 211, 0.8),
            0 0 120px rgba(138, 43, 226, 0.6),
            0 -20px 60px rgba(186, 85, 211, 0.4)
          `,
          animation: 'horizon-pulse 5s ease-in-out infinite',
          borderRadius: '50%',
          transform: 'scaleY(0.6)'
        }} />

        {/* Sharp bright horizon line */}
        <div style={{
          position: 'absolute',
          bottom: '33%',
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, rgba(255, 105, 180, 0) 0%, rgba(255, 182, 193, 1) 10%, rgba(255, 192, 203, 1) 50%, rgba(255, 182, 193, 1) 90%, rgba(255, 105, 180, 0) 100%)',
          boxShadow: '0 0 8px rgba(255, 192, 203, 1), 0 0 4px rgba(255, 255, 255, 0.8)',
          zIndex: 10
        }} />

        {/* Additional glow layer */}
        <div style={{
          position: 'absolute',
          bottom: '33%',
          left: 0,
          width: '100%',
          height: '30px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(186, 85, 211, 0.3) 0%, transparent 70%)',
          filter: 'blur(20px)',
          pointerEvents: 'none'
        }} />

        {/* Wave layers */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '33%',
          minHeight: '200px',
          pointerEvents: 'none'
        }}>
          {/* Back wave - static with gradient */}
          <svg style={{
            position: 'absolute',
            bottom: 0,
            left: '-5%',
            width: '110%',
            height: '100%',
            zIndex: 1
          }} viewBox="0 0 1200 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#2a3f5f', stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: '#1e2f4a', stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>
            <path d="M0,60 Q400,40 800,60 Q1000,70 1200,60 L1200,200 L0,200 Z" fill="url(#wave-grad-1)" />
          </svg>

          {/* Middle wave - slow animation with gradient */}
          <svg style={{
            position: 'absolute',
            bottom: 0,
            left: '-5%',
            width: '110%',
            height: '100%',
            zIndex: 2,
            animation: 'wave-motion-slow 14s ease-in-out infinite',
            willChange: 'transform'
          }} viewBox="0 0 1200 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#223348', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#182844', stopOpacity: 0.85 }} />
              </linearGradient>
            </defs>
            <path d="M0,100 Q400,75 800,100 Q1000,115 1200,100 L1200,200 L0,200 Z" fill="url(#wave-grad-2)" />
          </svg>

          {/* Front wave - faster animation with gradient */}
          <svg style={{
            position: 'absolute',
            bottom: 0,
            left: '-5%',
            width: '110%',
            height: '100%',
            zIndex: 3,
            animation: 'wave-motion-fast 9s ease-in-out infinite',
            willChange: 'transform'
          }} viewBox="0 0 1200 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave-grad-3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#1a2332', stopOpacity: 0.75 }} />
                <stop offset="100%" style={{ stopColor: '#0f1a28', stopOpacity: 0.95 }} />
              </linearGradient>
            </defs>
            <path d="M0,140 Q400,115 800,140 Q1000,155 1200,140 L1200,200 L0,200 Z" fill="url(#wave-grad-3)" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default BackgroundFX;