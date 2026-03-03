'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface WelcomeBannerProps {
  userName?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function WelcomeBanner({ userName }: WelcomeBannerProps) {
  const greeting = useMemo(() => getGreeting(), []);
  const displayName = userName || 'there';

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl md:text-3xl font-semibold text-[#5D4E37] tracking-tight">
        {greeting}, {displayName}
      </h1>
      <p className="text-sm text-[#8B7355] mt-1">
        Here are your businesses
      </p>
    </motion.div>
  );
}
