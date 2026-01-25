'use client';

import { motion } from 'framer-motion';
import { Phone, Sparkles } from 'lucide-react';
import { GlowButton } from '@/components/ui/glow-button';

interface EmptyStateProps {
  onCreateBusiness: () => void;
}

export function EmptyState({ onCreateBusiness }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-24 px-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] bg-gradient-radial from-[#E8DCC8]/40 via-[#E8DCC8]/10 to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
      >
        {/* Glowing ring */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B6F47]/20 to-[#A67A5B]/20 rounded-3xl blur-xl scale-110" />

        {/* Icon container */}
        <div className="relative w-24 h-24 bg-gradient-to-br from-[#8B6F47] to-[#A67A5B] rounded-3xl flex items-center justify-center shadow-xl shadow-[#8B6F47]/20">
          <Phone className="h-10 w-10 text-white" strokeWidth={1.5} />
        </div>
      </motion.div>

      <motion.h3
        className="text-2xl font-semibold text-[#8B6F47] mb-3 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
      >
        Create your first business
      </motion.h3>

      <motion.p
        className="text-[#A67A5B]/60 text-center max-w-md mb-10 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
      >
        Deploy an AI-powered voice agent that handles customer calls around the clock, so you never miss an opportunity.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
      >
        <GlowButton onClick={onCreateBusiness} size="lg">
          <Sparkles className="h-5 w-5" />
          Get Started
        </GlowButton>
      </motion.div>
    </motion.div>
  );
}
