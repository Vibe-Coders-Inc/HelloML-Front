'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';

interface VoiceOrbProps {
  state: 'idle' | 'connecting' | 'active' | 'ended';
  audioLevel: number; // 0-1
  aiSpeaking: boolean;
  onClick?: () => void;
}

/**
 * Glossy 3D orb with organic morphing edges.
 * Inspired by ChatGPT voice mode — fluid, blobby, alive.
 * Uses animated border-radius for the organic shape
 * and SVG feTurbulence for edge distortion.
 */
export function VoiceOrb({ state, audioLevel, aiSpeaking, onClick }: VoiceOrbProps) {
  const isActive = state === 'active';
  const isConnecting = state === 'connecting';
  const pulse = isActive ? 1 + audioLevel * 0.12 : 1;
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const frameRef = useRef<number>(0);

  // Animate the SVG turbulence for organic edge movement
  useEffect(() => {
    let seed = 0;
    const speed = isActive ? 0.04 + audioLevel * 0.08 : isConnecting ? 0.03 : 0.015;

    const tick = () => {
      seed += speed;
      if (turbRef.current) {
        // Animate baseFrequency for organic morphing
        const bfx = 0.012 + Math.sin(seed) * 0.004;
        const bfy = 0.012 + Math.cos(seed * 0.7) * 0.004;
        turbRef.current.setAttribute('baseFrequency', `${bfx} ${bfy}`);
        turbRef.current.setAttribute('seed', String(Math.floor(seed * 3) % 100));
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isActive, isConnecting, audioLevel]);

  const baseGradient = aiSpeaking
    ? 'radial-gradient(circle at 35% 30%, rgba(210,170,120,0.9) 0%, rgba(180,130,70,0.85) 25%, rgba(139,111,71,0.95) 50%, rgba(100,75,45,1) 75%, rgba(70,50,30,1) 100%)'
    : 'radial-gradient(circle at 35% 30%, rgba(220,185,140,0.9) 0%, rgba(190,150,90,0.85) 25%, rgba(155,120,70,0.95) 50%, rgba(120,90,55,1) 75%, rgba(80,58,35,1) 100%)';

  const highlight = 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.12) 35%, transparent 60%)';
  const rimLight = 'radial-gradient(circle at 70% 80%, rgba(210,175,120,0.25) 0%, transparent 50%)';
  const glowIntensity = isActive ? 0.2 + audioLevel * 0.4 : isConnecting ? 0.15 : 0.1;

  // Morphing blob animation speed based on state
  const blobDuration = isActive ? `${3 - audioLevel * 1.5}s` : isConnecting ? '4s' : '8s';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>
      {/* SVG filter for organic edge distortion */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="orb-morph" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.012 0.012"
              numOctaves={3}
              seed={1}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={isActive ? 18 + audioLevel * 25 : isConnecting ? 14 : 10}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Ambient glow */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          scale: isActive ? pulse * 1.4 : isConnecting ? [1.2, 1.35, 1.2] : [1.15, 1.25, 1.15],
          opacity: glowIntensity,
        }}
        transition={isActive
          ? { duration: 0.1, ease: 'easeOut' }
          : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(139,111,71,0.6) 0%, rgba(139,111,71,0) 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* The morphing orb */}
      <motion.div
        className="absolute"
        animate={{
          scale: isActive ? pulse : isConnecting ? [1, 1.03, 1] : [1, 1.015, 1],
        }}
        transition={isActive
          ? { duration: 0.1, ease: 'easeOut' }
          : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          width: 200,
          height: 200,
          filter: 'url(#orb-morph)',
        }}
      >
        {/* Base sphere with morphing border-radius */}
        <div
          className="w-full h-full"
          style={{
            background: baseGradient,
            borderRadius: '40% 60% 55% 45% / 55% 40% 60% 45%',
            animation: `orbMorph ${blobDuration} ease-in-out infinite`,
            boxShadow: `
              0 0 ${20 + (isActive ? audioLevel * 50 : 0)}px rgba(139,111,71,${glowIntensity}),
              inset 0 -4px 12px rgba(0,0,0,0.15),
              inset 0 4px 8px rgba(255,255,255,0.1)
            `,
          }}
        >
          {/* Glossy highlight */}
          <div
            className="absolute inset-0"
            style={{
              background: highlight,
              borderRadius: 'inherit',
            }}
          />
          {/* Rim light */}
          <div
            className="absolute inset-0"
            style={{
              background: rimLight,
              borderRadius: 'inherit',
            }}
          />
          {/* Inner depth shadow */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: 'inherit',
              boxShadow: 'inset 0 -20px 40px rgba(60,40,20,0.25), inset 0 10px 20px rgba(255,240,220,0.15)',
            }}
          />
        </div>
      </motion.div>

      {/* Clickable center */}
      <motion.button
        className="relative z-10 rounded-full flex items-center justify-center cursor-pointer"
        style={{ width: 200, height: 200 }}
        onClick={onClick}
        whileHover={state === 'idle' ? { scale: 1.04 } : undefined}
        whileTap={state === 'idle' ? { scale: 0.97 } : undefined}
      >
        {state === 'idle' && (
          <div className="flex flex-col items-center gap-2 text-white/80 drop-shadow-lg">
            <Mic className="w-8 h-8" />
            <span className="text-sm font-medium">Start Demo</span>
          </div>
        )}
        {isConnecting && (
          <motion.div
            className="w-6 h-6 border-2 border-white/40 border-t-white/90 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {isActive && (
          <motion.div
            className="flex items-end gap-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ height: 32 }}
          >
            {Array.from({ length: 7 }, (_, i) => {
              const center = 3;
              const dist = Math.abs(i - center) / center;
              const maxH = 28 - dist * 14;
              const barH = 6 + audioLevel * (maxH - 6);
              return (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 3,
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    transformOrigin: 'bottom',
                  }}
                  animate={{ height: barH }}
                  transition={{ duration: 0.1, ease: 'easeOut' }}
                />
              );
            })}
          </motion.div>
        )}
        {state === 'ended' && (
          <div className="text-white/60 text-sm font-medium drop-shadow">Done</div>
        )}
      </motion.button>
    </div>
  );
}
