'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { buttonVariants } from './button';

const buttonMotion = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
};

export interface MotionButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  shine?: boolean;
}

const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant, size, children, shine = false, ...props }, ref) => {
    const isAccent = variant === 'default' || variant === undefined;

    return (
      <motion.button
        className={cn(
          buttonVariants({ variant, size, className }),
          'relative overflow-hidden'
        )}
        ref={ref}
        whileHover={buttonMotion.whileHover}
        whileTap={buttonMotion.whileTap}
        transition={buttonMotion.transition}
        {...props}
      >
        {/* Shine effect for primary buttons */}
        {(shine || isAccent) && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
            initial={{ x: '-200%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);
MotionButton.displayName = 'MotionButton';

export { MotionButton, buttonMotion };
