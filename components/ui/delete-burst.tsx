'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface DeleteBurstProps {
  isActive: boolean;
  onComplete?: () => void;
}

export function DeleteBurst({ isActive, onComplete }: DeleteBurstProps) {
  const lineCount = 12;
  const lines = Array.from({ length: lineCount }, (_, i) => i);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          {/* Expanding circle ring */}
          <motion.div
            className="absolute rounded-full border-2 border-[#8B6F47]"
            initial={{ width: 20, height: 20, opacity: 0.8 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Second ring for layered effect */}
          <motion.div
            className="absolute rounded-full border-2 border-[#A67A5B]"
            initial={{ width: 10, height: 10, opacity: 0.6 }}
            animate={{ width: 150, height: 150, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
          />

          {/* Radiating lines */}
          {lines.map((i) => {
            const angle = (i * 360) / lineCount;
            const isAlternate = i % 2 === 0;

            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: '3px',
                  height: isAlternate ? '20px' : '14px',
                  backgroundColor: isAlternate ? '#8B6F47' : '#A67A5B',
                  borderRadius: '2px',
                  transformOrigin: 'center center',
                  rotate: `${angle}deg`,
                }}
                initial={{
                  opacity: 1,
                  scale: 0.5,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: Math.cos((angle - 90) * Math.PI / 180) * (isAlternate ? 80 : 60),
                  y: Math.sin((angle - 90) * Math.PI / 180) * (isAlternate ? 80 : 60),
                }}
                transition={{
                  duration: 0.4,
                  ease: 'easeOut',
                  delay: i * 0.015,
                }}
              />
            );
          })}

          {/* Small dots/particles */}
          {lines.map((i) => {
            const angle = (i * 360) / lineCount + 15; // Offset from lines
            const size = Math.random() * 4 + 3;

            return (
              <motion.div
                key={`dot-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: i % 3 === 0 ? '#8B6F47' : i % 3 === 1 ? '#A67A5B' : '#C9B790',
                }}
                initial={{
                  opacity: 0.8,
                  scale: 1,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: 0,
                  scale: 0.5,
                  x: Math.cos((angle - 90) * Math.PI / 180) * (50 + Math.random() * 40),
                  y: Math.sin((angle - 90) * Math.PI / 180) * (50 + Math.random() * 40),
                }}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                  delay: 0.05 + i * 0.02,
                }}
                onAnimationComplete={i === lines.length - 1 ? onComplete : undefined}
              />
            );
          })}

          {/* Center flash */}
          <motion.div
            className="absolute rounded-full bg-[#8B6F47]"
            initial={{ width: 30, height: 30, opacity: 0.6 }}
            animate={{ width: 60, height: 60, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
