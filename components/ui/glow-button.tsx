'use client';

import * as React from 'react';
import { motion, useMotionTemplate, useMotionValue, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'lg';
}

export function GlowButton({
  children,
  className,
  variant = 'primary',
  size = 'default',
  onClick,
  disabled,
  type,
  ...props
}: GlowButtonProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const background = useMotionTemplate`
    radial-gradient(
      ${size === 'lg' ? '180px' : '120px'} circle at ${mouseX}px ${mouseY}px,
      rgba(255, 255, 255, 0.15),
      transparent 80%
    )
  `;

  const isPrimary = variant === 'primary';

  return (
    <motion.button
      className={cn(
        'group relative overflow-hidden rounded-2xl font-medium transition-all duration-300',
        'flex items-center justify-center gap-3',
        isPrimary
          ? 'bg-gradient-to-r from-[#8B6F47] via-[#9D7B52] to-[#A67A5B] text-white shadow-xl shadow-[#8B6F47]/25'
          : 'bg-white/80 backdrop-blur-sm text-[#8B6F47] border border-[#E8DCC8]/50 shadow-lg shadow-black/5',
        size === 'lg' ? 'h-14 px-8 text-base' : 'h-12 px-6 text-sm',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {/* Mouse-following glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background }}
      />

      {/* Animated border glow for primary */}
      {isPrimary && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['200% 0', '-200% 0'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Inner glow ring */}
      <div
        className={cn(
          'absolute inset-[1px] rounded-[15px] transition-opacity duration-300',
          isPrimary
            ? 'bg-gradient-to-b from-white/10 to-transparent opacity-50'
            : 'bg-gradient-to-b from-[#FAF8F3] to-white opacity-80'
        )}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
