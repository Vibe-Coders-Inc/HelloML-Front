'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
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
  const isPrimary = variant === 'primary';

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-xl font-medium transition-all duration-200 cursor-pointer',
        'flex items-center justify-center gap-2',
        isPrimary
          ? 'bg-[#5D4E37] hover:bg-[#4A3E2C] text-white shadow-sm'
          : 'bg-white text-[#5D4E37] border border-[#E8DCC8] hover:border-[#8B6F47]/30 shadow-sm',
        size === 'lg' ? 'h-12 px-7 text-base' : 'h-10 px-5 text-sm',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
