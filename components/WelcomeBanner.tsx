'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface WelcomeBannerProps {
  userName?: string;
}

// Greeting variations for different times of day
const morningGreetings = [
  'Good morning',
  'Rise and shine',
  'Ready to start the day',
  'Fresh start today',
  'Morning',
];

const afternoonGreetings = [
  'Good afternoon',
  'Back at it',
  'Hope your day is going well',
  'Afternoon',
  'Keep up the momentum',
];

const eveningGreetings = [
  'Good evening',
  'Winding down',
  'Evening',
  'Still at it',
  'Burning the midnight oil',
];

// Subtitle variations
const subtitles = [
  'Your voice agents are ready when you are.',
  'Let\'s make something great today.',
  'Ready to handle calls around the clock.',
  'Your AI assistants await.',
  'Time to build something amazing.',
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getGreeting(): { greeting: string; subtitle: string } {
  const hour = new Date().getHours();

  let greetings: string[];
  if (hour < 12) {
    greetings = morningGreetings;
  } else if (hour < 18) {
    greetings = afternoonGreetings;
  } else {
    greetings = eveningGreetings;
  }

  return {
    greeting: getRandomItem(greetings),
    subtitle: getRandomItem(subtitles),
  };
}

export function WelcomeBanner({ userName }: WelcomeBannerProps) {
  // useMemo ensures the greeting stays consistent during the session
  const { greeting, subtitle } = useMemo(() => getGreeting(), []);
  const displayName = userName || 'there';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl mb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Multi-layer gradient background - Liquid Glass inspired */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B6F47] via-[#A67A5B] to-[#C9B790]" />

      {/* Animated mesh gradient orbs */}
      <motion.div
        className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-white/25 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -left-20 w-96 h-96 bg-gradient-to-tr from-[#C9B790]/40 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Glass overlay with subtle noise texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

      {/* Content */}
      <div className="relative px-10 py-12">
        <motion.p
          className="text-white/70 text-sm font-medium tracking-wide mb-2"
          variants={itemVariants}
        >
          Welcome back
        </motion.p>

        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          variants={itemVariants}
        >
          {greeting}, {displayName}
        </motion.h1>

        <motion.p
          className="text-white/60 text-lg mt-3 max-w-md"
          variants={itemVariants}
        >
          {subtitle}
        </motion.p>
      </div>
    </motion.div>
  );
}
