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
 * Premium voice orb — organic pulsing blob with layered gradient rings.
 * Reacts to audio level and AI speaking state.
 * Inspired by LottieFiles "Med Purple Active" orb style.
 */
export function VoiceOrb({ state, audioLevel, aiSpeaking, onClick }: VoiceOrbProps) {
  const isActive = state === 'active';
  const isConnecting = state === 'connecting';
  const isEnded = state === 'ended';

  // Audio-reactive scale
  const pulse = isActive ? 1 + audioLevel * 0.3 : 1;

  // Colors based on state
  const primaryColor = aiSpeaking ? '#8B5CF6' : '#8B6F47';
  const glowColor = aiSpeaking ? 'rgba(139,92,246,' : 'rgba(139,111,71,';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>
      {/* Outermost gradient ring — soft halo */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          scale: isActive ? pulse * 1.6 : isConnecting ? [1.3, 1.45, 1.3] : [1.2, 1.3, 1.2],
          opacity: isActive ? 0.12 + audioLevel * 0.15 : isConnecting ? [0.06, 0.12, 0.06] : 0.08,
        }}
        transition={isActive
          ? { scale: { duration: 0.12, ease: 'easeOut' }, opacity: { duration: 0.12 } }
          : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          width: 200,
          height: 200,
          background: `conic-gradient(from 0deg, ${glowColor}0.2), ${glowColor}0.05), ${glowColor}0.15), ${glowColor}0.05))`,
          filter: 'blur(20px)',
        }}
      />

      {/* Ring 2 — visible gradient ring */}
      <AnimatePresence>
        {(isActive || isConnecting || state === 'idle') && (
          <motion.div
            className="absolute rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              scale: isActive ? pulse * 1.35 : isConnecting ? [1.15, 1.25, 1.15] : [1.05, 1.15, 1.05],
              opacity: isActive ? 0.2 + audioLevel * 0.2 : [0.08, 0.16, 0.08],
              rotate: isActive ? [0, 360] : [0, 180],
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={isActive
              ? { scale: { duration: 0.12 }, rotate: { duration: 8, repeat: Infinity, ease: 'linear' } }
              : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }
            style={{
              width: 180,
              height: 180,
              borderRadius: '50%',
              border: `2px solid ${glowColor}${isActive ? '0.25' : '0.12'})`,
              background: `conic-gradient(from 45deg, ${glowColor}0.15), transparent, ${glowColor}0.08), transparent)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Ring 1 — inner glow ring */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          scale: isActive ? pulse * 1.15 : isConnecting ? [1.02, 1.1, 1.02] : [1, 1.06, 1],
          opacity: isActive ? 0.25 + audioLevel * 0.3 : [0.1, 0.2, 0.1],
        }}
        transition={isActive
          ? { duration: 0.12, ease: 'easeOut' }
          : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColor}0.3) 0%, ${glowColor}0.08) 60%, transparent 80%)`,
          border: `1.5px solid ${glowColor}0.15)`,
        }}
      />

      {/* Core orb — solid center with gradient */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          scale: isActive ? pulse : isConnecting ? [1, 1.04, 1] : 1,
          boxShadow: isActive
            ? `0 0 ${25 + audioLevel * 40}px ${glowColor}${0.15 + audioLevel * 0.2}), inset 0 0 30px ${glowColor}0.1)`
            : `0 0 20px ${glowColor}0.08), inset 0 0 20px ${glowColor}0.05)`,
        }}
        transition={isActive
          ? { duration: 0.12, ease: 'easeOut' }
          : isConnecting
            ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
        style={{
          width: 120,
          height: 120,
          background: isActive && aiSpeaking
            ? 'linear-gradient(135deg, rgba(167,139,250,0.2) 0%, rgba(139,92,246,0.1) 50%, rgba(167,139,250,0.15) 100%)'
            : 'linear-gradient(135deg, rgba(201,168,124,0.22) 0%, rgba(166,122,91,0.1) 50%, rgba(201,168,124,0.18) 100%)',
          backdropFilter: 'blur(30px)',
          border: `1px solid ${glowColor}0.12)`,
        }}
      />

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
            {/* Audio bars — dome shape like wisprflow voice icon */}
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
        {isEnded && (
          <div className="text-[#6B553A]/60 text-sm font-medium">Done</div>
        )}
      </motion.button>
    </div>
  );
}
