'use client';

import { motion, AnimatePresence } from 'framer-motion';
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

  // Scale factor based on audio level for active state
  const pulse = isActive ? 1 + audioLevel * 0.35 : 1;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
      {/* Outer ambient glow rings — only visible when active */}
      <AnimatePresence>
        {isActive && (
          <>
            {/* Ring 3 — outermost */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: aiSpeaking ? [0.08, 0.15, 0.08] : [0.05, 0.1, 0.05],
                scale: pulse * 1.5,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: aiSpeaking ? 1.2 : 2.5, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 0.15, ease: 'easeOut' },
              }}
              className="absolute rounded-full"
              style={{
                width: 240,
                height: 240,
                background: aiSpeaking
                  ? 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0) 70%)'
                  : 'radial-gradient(circle, rgba(139,111,71,0.25) 0%, rgba(139,111,71,0) 70%)',
              }}
            />
            {/* Ring 2 — middle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: aiSpeaking ? [0.12, 0.25, 0.12] : [0.08, 0.18, 0.08],
                scale: pulse * 1.25,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: aiSpeaking ? 1.0 : 2.0, repeat: Infinity, ease: 'easeInOut', delay: 0.15 },
                scale: { duration: 0.15, ease: 'easeOut' },
              }}
              className="absolute rounded-full"
              style={{
                width: 200,
                height: 200,
                background: aiSpeaking
                  ? 'radial-gradient(circle, rgba(167,139,250,0.35) 0%, rgba(139,92,246,0) 70%)'
                  : 'radial-gradient(circle, rgba(201,168,124,0.3) 0%, rgba(139,111,71,0) 70%)',
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Ring 1 — inner glow (always visible, subtler when idle) */}
      <motion.div
        animate={{
          scale: isActive
            ? pulse * 1.08
            : isConnecting
              ? [1, 1.08, 1]
              : [1, 1.04, 1],
          opacity: isActive
            ? 0.4 + audioLevel * 0.3
            : isConnecting
              ? [0.15, 0.3, 0.15]
              : 0.2,
        }}
        transition={
          isActive
            ? { scale: { duration: 0.15, ease: 'easeOut' }, opacity: { duration: 0.15, ease: 'easeOut' } }
            : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
        }
        className="absolute rounded-full"
        style={{
          width: 160,
          height: 160,
          background: isActive && aiSpeaking
            ? 'radial-gradient(circle, rgba(167,139,250,0.5) 0%, rgba(139,92,246,0.15) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(201,168,124,0.5) 0%, rgba(166,122,91,0.15) 50%, transparent 70%)',
        }}
      />

      {/* Core circle */}
      <motion.div
        animate={{
          scale: isActive ? pulse : isConnecting ? [1, 1.03, 1] : 1,
          boxShadow: isActive
            ? aiSpeaking
              ? `0 0 ${30 + audioLevel * 40}px rgba(139,92,246,${0.2 + audioLevel * 0.25})`
              : `0 0 ${20 + audioLevel * 35}px rgba(166,122,91,${0.15 + audioLevel * 0.2})`
            : '0 0 20px rgba(166,122,91,0.1)',
        }}
        transition={
          isActive
            ? { duration: 0.12, ease: 'easeOut' }
            : isConnecting
              ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.3 }
        }
        className="absolute rounded-full"
        style={{
          width: 120,
          height: 120,
          background: isActive && aiSpeaking
            ? 'linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(139,92,246,0.08) 100%)'
            : 'linear-gradient(135deg, rgba(201,168,124,0.18) 0%, rgba(166,122,91,0.08) 100%)',
          backdropFilter: 'blur(20px)',
          border: isActive && aiSpeaking
            ? '1px solid rgba(167,139,250,0.15)'
            : '1px solid rgba(201,168,124,0.15)',
        }}
      />

      {/* Clickable center */}
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
            className="flex items-center gap-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Audio bars visualizer */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full"
                style={{
                  backgroundColor: aiSpeaking ? 'rgba(139,92,246,0.7)' : 'rgba(139,111,71,0.6)',
                }}
                animate={{
                  height: isActive
                    ? [8, 8 + (audioLevel * 28 * (i === 2 ? 1 : i === 1 || i === 3 ? 0.75 : 0.5)), 8]
                    : 8,
                }}
                transition={{
                  duration: 0.15,
                  ease: 'easeOut',
                  delay: i * 0.03,
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}
