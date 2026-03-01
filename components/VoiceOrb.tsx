'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import voiceOrbData from '@/lib/voice-orb-lottie.json';

interface VoiceOrbProps {
  state: 'idle' | 'connecting' | 'active' | 'ended';
  audioLevel: number; // 0-1
  aiSpeaking: boolean;
  onClick?: () => void;
}

/**
 * Voice orb using a real Lottie animation (Med Purple Active).
 * Reacts to audio level by controlling playback speed.
 * Tinted to brown via CSS filter to match HelloML palette.
 */
export function VoiceOrb({ state, audioLevel, aiSpeaking, onClick }: VoiceOrbProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const isActive = state === 'active';
  const isConnecting = state === 'connecting';

  // Control Lottie playback speed based on audio level
  useEffect(() => {
    if (!lottieRef.current) return;
    if (isActive) {
      // Speed up animation based on audio level (0.5x idle to 3x loud)
      lottieRef.current.setSpeed(0.5 + audioLevel * 2.5);
    } else if (isConnecting) {
      lottieRef.current.setSpeed(1.2);
    } else {
      lottieRef.current.setSpeed(0.5);
    }
  }, [isActive, isConnecting, audioLevel]);

  // Scale based on audio
  const pulse = isActive ? 1 + audioLevel * 0.15 : 1;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>
      {/* Lottie orb — tinted to brown with CSS filter */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: isActive ? pulse : isConnecting ? [1, 1.05, 1] : 1,
          opacity: state === 'ended' ? 0.3 : 1,
        }}
        transition={isActive
          ? { scale: { duration: 0.12, ease: 'easeOut' } }
          : isConnecting
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.5 }
        }
        style={{
          // Tint the purple Lottie orb to warm brown
          filter: aiSpeaking
            ? 'hue-rotate(-60deg) saturate(0.8) brightness(1.1)'
            : 'hue-rotate(-60deg) saturate(0.6) sepia(0.3) brightness(1.05)',
        }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={voiceOrbData}
          loop
          autoplay
          style={{ width: 280, height: 280 }}
        />
      </motion.div>

      {/* Clickable center content */}
      <motion.button
        className="relative z-10 rounded-full flex items-center justify-center cursor-pointer"
        style={{ width: 120, height: 120 }}
        onClick={onClick}
        whileHover={state === 'idle' ? { scale: 1.05 } : undefined}
        whileTap={state === 'idle' ? { scale: 0.97 } : undefined}
      >
        {state === 'idle' && (
          <div className="flex flex-col items-center gap-2 text-[#6B553A]">
            <Mic className="w-8 h-8" />
            <span className="text-sm font-medium">Start Demo</span>
          </div>
        )}
        {isConnecting && (
          <motion.div
            className="w-6 h-6 border-2 border-[#8B6F47]/60 border-t-[#8B6F47] rounded-full"
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
                    backgroundColor: aiSpeaking ? 'rgba(167,139,250,0.8)' : 'rgba(139,111,71,0.7)',
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
          <div className="text-[#6B553A]/60 text-sm font-medium">Done</div>
        )}
      </motion.button>
    </div>
  );
}
