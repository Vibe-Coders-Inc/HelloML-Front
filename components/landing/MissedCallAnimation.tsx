'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Animated missed call visualization.
 * Phone rings → vibrates → "Missed Call" → customer walks to competitor.
 * Replaces text-heavy pain point section.
 */
export function MissedCallAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end center'],
  });

  // Scroll-linked phases
  const phoneScale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
  const phoneOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const ringOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.45, 0.5], [0, 1, 1, 0]);
  const missedOpacity = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);
  const missedScale = useTransform(scrollYProgress, [0.45, 0.55], [0.5, 1]);
  const lostOpacity = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);
  const lostX = useTransform(scrollYProgress, [0.6, 0.85], [0, 60]);
  const revenueOpacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 1]);

  return (
    <div ref={ref} className="relative w-full max-w-lg mx-auto" style={{ height: '320px' }}>
      {/* Phone icon */}
      <motion.div
        style={{ scale: phoneScale, opacity: phoneOpacity }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        {/* Phone body */}
        <div className="relative">
          <svg width="80" height="140" viewBox="0 0 80 140" fill="none" className="drop-shadow-lg">
            <rect x="4" y="4" width="72" height="132" rx="16" fill="#FAF8F3" stroke="#8B6F47" strokeWidth="2.5"/>
            <rect x="12" y="20" width="56" height="90" rx="4" fill="#F0EBE1"/>
            <circle cx="40" cy="125" r="6" stroke="#8B6F47" strokeWidth="1.5" fill="none"/>
            <rect x="28" y="10" width="24" height="4" rx="2" fill="#E8DCC8"/>
          </svg>

          {/* Ring waves */}
          <motion.div style={{ opacity: ringOpacity }} className="absolute -inset-8">
            <motion.div
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-[#8B6F47]/40"
            />
            <motion.div
              animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
              className="absolute inset-0 rounded-full border-2 border-[#8B6F47]/25"
            />
          </motion.div>

          {/* Incoming call screen */}
          <motion.div style={{ opacity: ringOpacity }} className="absolute top-[20px] left-[12px] w-[56px] h-[90px] flex flex-col items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#8B6F47">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
            <span className="text-[6px] font-bold text-[#8B6F47] mt-1">Incoming...</span>
          </motion.div>

          {/* Missed call overlay */}
          <motion.div
            style={{ opacity: missedOpacity, scale: missedScale }}
            className="absolute top-[20px] left-[12px] w-[56px] h-[90px] flex flex-col items-center justify-center bg-[#F0EBE1] rounded will-change-transform"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#c44" className="mb-1">
              <path d="M18.59 10.52c1.05.51 2.04 1.15 2.96 1.88l-1.55 1.55c-.8-.62-1.67-1.15-2.59-1.59l1.18-1.84zM3.55 12.4l-1.55-1.55c.92-.73 1.91-1.37 2.96-1.88l1.18 1.84c-.92.44-1.79.97-2.59 1.59zM12 7C7.46 7 3.34 8.78.29 11.67c-.18.18-.29.43-.29.71s.11.53.29.7l11 11c.18.18.43.29.71.29.28 0 .53-.11.71-.29l11-11c.18-.18.29-.43.29-.71s-.11-.53-.29-.71C20.66 8.78 16.54 7 12 7z"/>
            </svg>
            <span className="text-[7px] font-bold text-[#c44]">Missed Call</span>
          </motion.div>
        </div>
      </motion.div>

      {/* "Customer lost" — person walking away */}
      <motion.div
        style={{ opacity: lostOpacity, x: lostX }}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 will-change-transform"
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#A67A5B" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="7" r="4"/>
          <path d="M5.5 21v-2a4 4 0 014-4h5a4 4 0 014 4v2"/>
        </svg>
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="opacity-60">
          <path d="M2 6h16M14 2l4 4-4 4" stroke="#A67A5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[10px] text-[#A67A5B] font-medium">Gone.</span>
      </motion.div>

      {/* Revenue counter */}
      <motion.div
        style={{ opacity: revenueOpacity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center will-change-transform"
      >
        <p className="text-sm text-[#8B7355]">Average value of a missed call:</p>
        <p className="text-2xl md:text-3xl font-bold text-[#c44]">-$200</p>
      </motion.div>
    </div>
  );
}
