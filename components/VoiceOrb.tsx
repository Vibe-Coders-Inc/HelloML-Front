'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';

interface VoiceOrbProps {
  state: 'idle' | 'connecting' | 'active' | 'ended';
  audioLevel: number; // 0-1
  aiSpeaking: boolean;
  onClick?: () => void;
}

/**
 * Glossy 3D gradient orb — looks like a glass sphere.
 * Pure CSS radial gradients for the 3D effect.
 * Audio-reactive scale + glow intensity.
 * Brown/warm palette matching HelloML brand.
 */
export function VoiceOrb({ state, audioLevel, aiSpeaking, onClick }: VoiceOrbProps) {
  const isActive = state === 'active';
  const isConnecting = state === 'connecting';
  const pulse = isActive ? 1 + audioLevel * 0.12 : 1;

  // Shift hue slightly when AI is speaking
  const baseGradient = aiSpeaking
    ? 'radial-gradient(circle at 35% 30%, rgba(210,170,120,0.9) 0%, rgba(180,130,70,0.85) 25%, rgba(139,111,71,0.95) 50%, rgba(100,75,45,1) 75%, rgba(70,50,30,1) 100%)'
    : 'radial-gradient(circle at 35% 30%, rgba(220,185,140,0.9) 0%, rgba(190,150,90,0.85) 25%, rgba(155,120,70,0.95) 50%, rgba(120,90,55,1) 75%, rgba(80,58,35,1) 100%)';

  // Highlight gives the glossy 3D look
  const highlight = 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 30%, transparent 60%)';

  // Rim light
  const rimLight = 'radial-gradient(circle at 70% 80%, rgba(210,175,120,0.3) 0%, transparent 50%)';

  const glowIntensity = isActive ? 0.2 + audioLevel * 0.4 : isConnecting ? 0.15 : 0.1;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>
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

      {/* The orb sphere */}
      <motion.div
        className="absolute rounded-full"
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
          background: baseGradient,
          boxShadow: `
            0 0 ${20 + (isActive ? audioLevel * 50 : 0)}px rgba(139,111,71,${glowIntensity}),
            inset 0 -4px 12px rgba(0,0,0,0.15),
            inset 0 4px 8px rgba(255,255,255,0.1)
          `,
        }}
      >
        {/* Glossy highlight overlay */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: highlight }}
        />
        {/* Rim light */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: rimLight }}
        />
        {/* Subtle inner shadow for depth */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: 'inset 0 -20px 40px rgba(60,40,20,0.25), inset 0 10px 20px rgba(255,240,220,0.15)',
          }}
        />
      </motion.div>

      {/* Slow rotating sheen (subtle) */}
      <motion.div
        className="absolute rounded-full overflow-hidden"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ width: 200, height: 200 }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-[0.07]"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.5) 10%, transparent 20%, transparent 100%)',
          }}
        />
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
