'use client';

import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

interface VoiceOrbProps {
  state: 'idle' | 'connecting' | 'active' | 'ended';
  audioLevel: number;
  aiSpeaking: boolean;
  onClick?: () => void;
}

/**
 * Organic morphing orb — ChatGPT voice style.
 * Multiple overlapping blob layers that move independently,
 * creating fluid, amorphous edges. Each layer has different
 * animation timing for organic randomness.
 */
export function VoiceOrb({ state, audioLevel, aiSpeaking, onClick }: VoiceOrbProps) {
  const isActive = state === 'active';
  const isConnecting = state === 'connecting';
  const pulse = isActive ? 1 + audioLevel * 0.15 : 1;
  const glowIntensity = isActive ? 0.25 + audioLevel * 0.4 : isConnecting ? 0.15 : 0.1;

  // Speed multiplier for blob morphing
  const speed = isActive ? 0.6 + audioLevel * 0.4 : isConnecting ? 0.8 : 1;

  // Each blob layer has different colors and animation names
  const blobLayers = [
    {
      animation: `blobA ${4 * speed}s ease-in-out infinite`,
      bg: aiSpeaking
        ? 'radial-gradient(circle at 40% 35%, rgba(200,160,100,0.95) 0%, rgba(139,111,71,1) 60%, rgba(80,55,30,1) 100%)'
        : 'radial-gradient(circle at 40% 35%, rgba(210,175,120,0.95) 0%, rgba(150,115,65,1) 60%, rgba(90,65,35,1) 100%)',
      size: 200,
      zIndex: 1,
    },
    {
      animation: `blobB ${3.5 * speed}s ease-in-out infinite`,
      bg: aiSpeaking
        ? 'radial-gradient(circle at 55% 45%, rgba(180,140,80,0.8) 0%, rgba(120,90,50,0.85) 60%, rgba(70,50,28,0.9) 100%)'
        : 'radial-gradient(circle at 55% 45%, rgba(195,160,100,0.8) 0%, rgba(140,105,60,0.85) 60%, rgba(85,60,32,0.9) 100%)',
      size: 190,
      zIndex: 2,
    },
    {
      animation: `blobC ${5 * speed}s ease-in-out infinite`,
      bg: aiSpeaking
        ? 'radial-gradient(circle at 35% 55%, rgba(170,130,75,0.7) 0%, rgba(110,80,45,0.75) 60%, rgba(65,45,25,0.8) 100%)'
        : 'radial-gradient(circle at 35% 55%, rgba(185,150,95,0.7) 0%, rgba(130,95,55,0.75) 60%, rgba(75,55,30,0.8) 100%)',
      size: 185,
      zIndex: 3,
    },
  ];

  return (
    <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>
      {/* Ambient glow */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          scale: isActive ? pulse * 1.5 : isConnecting ? [1.2, 1.4, 1.2] : [1.15, 1.3, 1.15],
          opacity: glowIntensity,
        }}
        transition={isActive
          ? { duration: 0.1, ease: 'easeOut' }
          : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(139,111,71,0.5) 0%, rgba(139,111,71,0) 70%)',
          filter: 'blur(35px)',
        }}
      />

      {/* Blob layers — each morphs independently */}
      {blobLayers.map((layer, i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{
            scale: isActive ? pulse : isConnecting ? [1, 1.04, 1] : [1, 1.02, 1],
          }}
          transition={isActive
            ? { duration: 0.12, ease: 'easeOut' }
            : { duration: 2 + i, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{
            width: layer.size,
            height: layer.size,
            zIndex: layer.zIndex,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: layer.bg,
              animation: layer.animation,
              boxShadow: i === 0
                ? `0 0 ${25 + (isActive ? audioLevel * 40 : 0)}px rgba(139,111,71,${glowIntensity})`
                : undefined,
            }}
          />
        </motion.div>
      ))}

      {/* Glossy highlight on top */}
      <motion.div
        className="absolute"
        animate={{
          scale: isActive ? pulse : isConnecting ? [1, 1.03, 1] : 1,
        }}
        transition={isActive ? { duration: 0.12 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 200,
          height: 200,
          zIndex: 4,
          animation: `blobA ${4.5 * speed}s ease-in-out infinite`,
          background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 35%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />

      {/* Inner shadow layer */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 200,
          height: 200,
          zIndex: 5,
          borderRadius: '50%',
          boxShadow: 'inset 0 -15px 35px rgba(50,35,15,0.3), inset 0 8px 15px rgba(255,230,200,0.12)',
        }}
      />

      {/* Clickable center */}
      <motion.button
        className="relative flex items-center justify-center cursor-pointer"
        style={{ width: 200, height: 200, zIndex: 10, borderRadius: '50%' }}
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
