'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DeleteBurstProps {
  isActive: boolean;
  onComplete?: () => void;
}

export function DeleteBurst({ isActive, onComplete }: DeleteBurstProps) {
  const [particles, setParticles] = useState<Array<{ id: number; angle: number; distance: number; size: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (isActive) {
      // Generate particles when activated
      const newParticles = [];
      const colors = ['#8B6F47', '#A67A5B', '#C9B790', '#D4C4A8'];

      // Create radiating lines
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30);
        newParticles.push({
          id: i,
          angle,
          distance: 100 + Math.random() * 40,
          size: i % 2 === 0 ? 4 : 3,
          color: colors[i % 2],
          delay: i * 0.02,
        });
      }

      // Add extra small particles
      for (let i = 12; i < 24; i++) {
        const angle = (i * 30) + 15;
        newParticles.push({
          id: i,
          angle,
          distance: 60 + Math.random() * 50,
          size: 2 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: 0.05 + (i - 12) * 0.015,
        });
      }

      setParticles(newParticles);

      // Call onComplete after animation finishes
      const timer = setTimeout(() => {
        onComplete?.();
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 100,
        overflow: 'visible',
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Expanding circle rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 rounded-full border-[3px] border-[#8B6F47]"
          style={{ translateX: '-50%', translateY: '-50%' }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 180, height: 180, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 rounded-full border-2 border-[#A67A5B]"
          style={{ translateX: '-50%', translateY: '-50%' }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 140, height: 140, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
        />

        {/* Center flash */}
        <motion.div
          className="absolute top-1/2 left-1/2 rounded-full bg-[#8B6F47]"
          style={{ translateX: '-50%', translateY: '-50%' }}
          initial={{ width: 20, height: 20, opacity: 0.8 }}
          animate={{ width: 50, height: 50, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        />

        {/* Radiating particles */}
        {particles.map((particle) => {
          const radians = (particle.angle - 90) * (Math.PI / 180);
          const endX = Math.cos(radians) * particle.distance;
          const endY = Math.sin(radians) * particle.distance;

          return (
            <motion.div
              key={particle.id}
              className="absolute top-1/2 left-1/2 rounded-full"
              style={{
                width: particle.size,
                height: particle.id < 12 ? particle.size * 4 : particle.size,
                backgroundColor: particle.color,
                translateX: '-50%',
                translateY: '-50%',
                rotate: particle.id < 12 ? `${particle.angle}deg` : 0,
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 0.5,
              }}
              animate={{
                x: endX,
                y: endY,
                opacity: 0,
                scale: particle.id < 12 ? 1.5 : 0.5,
              }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
                delay: particle.delay,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
