'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Animated 3-step timeline with connecting lines that draw on scroll.
 * Each step appears as the connecting line reaches it.
 */

const CalendarIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);
const DocIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="13" y2="12" opacity="0.4"/>
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const steps = [
  { icon: <DocIcon />, title: 'Tell us about your business', time: '30 seconds' },
  { icon: <CalendarIcon />, title: 'Connect your calendar', time: '15 seconds' },
  { icon: <PhoneIcon />, title: 'Start answering calls', time: 'Instantly' },
];

export function StepsTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end center'],
  });

  // Line draws as you scroll
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);

  // Each step appears at different scroll positions
  const s1Op = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const s1Scale = useTransform(scrollYProgress, [0.1, 0.25], [0.7, 1]);
  const s2Op = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const s2Scale = useTransform(scrollYProgress, [0.35, 0.5], [0.7, 1]);
  const s3Op = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);
  const s3Scale = useTransform(scrollYProgress, [0.6, 0.75], [0.7, 1]);

  const opacities = [s1Op, s2Op, s3Op];
  const scales = [s1Scale, s2Scale, s3Scale];

  return (
    <div ref={ref} className="relative max-w-xs mx-auto py-8">
      {/* Vertical connecting line */}
      <div className="absolute left-[23px] top-8 bottom-8 w-[2px] bg-[#E8DCC8]/40">
        <motion.div
          style={{ height: lineHeight }}
          className="w-full bg-[#8B6F47] origin-top will-change-transform"
        />
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-12">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            style={{ opacity: opacities[i], scale: scales[i] }}
            className="flex items-start gap-4 will-change-transform"
          >
            {/* Circle node */}
            <div className="w-12 h-12 rounded-full bg-white border-2 border-[#8B6F47] flex items-center justify-center shrink-0 text-[#8B6F47] relative z-10 shadow-sm">
              {step.icon}
            </div>
            {/* Content */}
            <div className="pt-2">
              <p className="text-sm font-semibold text-[#8B6F47]">{step.title}</p>
              <p className="text-xs text-[#A67A5B]/60 mt-0.5">{step.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
