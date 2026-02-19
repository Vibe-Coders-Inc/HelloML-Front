'use client';

import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

interface VoiceOrbProps {
  state: 'idle' | 'connecting' | 'active' | 'ended';
  audioLevel: number; // 0-1
  aiSpeaking: boolean;
  onClick?: () => void;
}

export function VoiceOrb({ state, audioLevel, aiSpeaking, onClick }: VoiceOrbProps) {
  const isActive = state === 'active';
  const isConnecting = state === 'connecting';

  // Scale based on audio level when active
  const scale = isActive
    ? 1 + audioLevel * 0.3
    : isConnecting
      ? 1
      : 1;

  // Color shifts: brown/gold for user, warm amber for AI
  const glowColor = isActive
    ? aiSpeaking
      ? 'rgba(166, 122, 91, 0.6)' // AI speaking - warm amber
      : 'rgba(139, 111, 71, 0.6)' // User speaking - brown/gold
    : 'rgba(139, 111, 71, 0.3)';

  const innerColor = isActive
    ? aiSpeaking
      ? 'radial-gradient(circle, #C9A87C 0%, #A67A5B 50%, #8B6F47 100%)'
      : 'radial-gradient(circle, #B89B6A 0%, #8B6F47 50%, #6B553A 100%)'
    : 'radial-gradient(circle, #A67A5B 0%, #8B6F47 50%, #6B553A 100%)';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 280,
          height: 280,
          boxShadow: `0 0 ${40 + audioLevel * 60}px ${10 + audioLevel * 30}px ${glowColor}`,
        }}
        animate={{
          scale: isConnecting ? [1, 1.08, 1] : isActive ? scale * 1.05 : [1, 1.03, 1],
          opacity: isActive ? 0.4 + audioLevel * 0.4 : 0.3,
        }}
        transition={
          isConnecting
            ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
            : isActive
              ? { type: 'spring', stiffness: 200, damping: 15 }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      {/* Mid ring */}
      <motion.div
        className="absolute rounded-full border border-[#A67A5B]/20"
        style={{ width: 240, height: 240 }}
        animate={{
          scale: isConnecting ? [1, 1.05, 1] : isActive ? 1 + audioLevel * 0.2 : [1, 1.02, 1],
          opacity: isActive ? 0.3 + audioLevel * 0.4 : 0.2,
        }}
        transition={
          isConnecting
            ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }
            : isActive
              ? { type: 'spring', stiffness: 180, damping: 18 }
              : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      {/* Inner core */}
      <motion.button
        className="relative rounded-full flex items-center justify-center cursor-pointer z-10"
        style={{
          width: 180,
          height: 180,
          background: innerColor,
          border: '1px solid rgba(201, 168, 124, 0.3)',
        }}
        animate={{
          scale: isConnecting ? [1, 1.06, 1] : isActive ? scale : [1, 1.02, 1],
        }}
        transition={
          isConnecting
            ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
            : isActive
              ? { type: 'spring', stiffness: 220, damping: 12 }
              : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }
        onClick={onClick}
        whileHover={state === 'idle' ? { scale: 1.05 } : undefined}
        whileTap={state === 'idle' ? { scale: 0.97 } : undefined}
      >
        {state === 'idle' && (
          <div className="flex flex-col items-center gap-2 text-white">
            <Mic className="w-8 h-8" />
            <span className="text-sm font-medium">Start Demo</span>
          </div>
        )}
        {isConnecting && (
          <motion.div
            className="w-6 h-6 border-2 border-white/60 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {isActive && (
          <motion.div
            className="w-3 h-3 rounded-full bg-white/80"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.button>
    </div>
  );
}
