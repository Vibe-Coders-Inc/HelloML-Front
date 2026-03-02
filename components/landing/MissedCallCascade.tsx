'use client';

import { useRef, useEffect, useState } from 'react';
import { animate } from 'animejs';

const PhoneSVG = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
    <path
      d="M26 22v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 016.12 9.18 2 2 0 018.1 7h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L12.09 14.9a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0126 21.88z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function MissedCallCascade() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          runAnimation();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  function runAnimation() {
    const missedIndices = [0, 1, 2, 3, 5, 6, 7, 9];

    missedIndices.forEach((idx, i) => {
      const phone = containerRef.current?.querySelector(`[data-phone="${idx}"]`);
      if (!phone) return;

      const iconEl = phone.querySelector('.phone-icon') as HTMLElement;
      const xEl = phone.querySelector('.phone-x') as HTMLElement;

      // Ring wiggle then fade
      animate(iconEl, {
        rotate: [
          { to: -12, duration: 60 },
          { to: 12, duration: 60 },
          { to: -8, duration: 60 },
          { to: 8, duration: 60 },
          { to: -4, duration: 60 },
          { to: 0, duration: 60 },
        ],
        delay: i * 200,
        ease: 'inOutSine',
        onComplete: () => {
          // Fade to gray, shrink
          animate(iconEl, {
            scale: 0.75,
            opacity: 0.35,
            duration: 350,
            ease: 'outCubic',
          });
          // Show X
          animate(xEl, {
            opacity: 1,
            scale: 1,
            duration: 300,
            ease: 'outCubic',
          });
          iconEl.style.color = '#B0A89E';
        },
      });
    });
  }

  return (
    <div ref={containerRef} className="flex items-center justify-center gap-2 sm:gap-3 max-w-[600px] mx-auto mt-8">
      {Array.from({ length: 10 }).map((_, i) => {
        const isKept = i === 4 || i === 8;
        return (
          <div
            key={i}
            data-phone={i}
            className="relative flex items-center justify-center"
          >
            <div
              className="phone-icon w-8 h-8 sm:w-10 sm:h-10"
              style={{ color: isKept ? '#8B6F47' : '#8B6F47' }}
            >
              <PhoneSVG />
            </div>
            <svg
              className="phone-x absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 opacity-0"
              viewBox="0 0 32 32"
              fill="none"
            >
              <line x1="10" y1="10" x2="22" y2="22" stroke="#C0392B" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="22" y1="10" x2="10" y2="22" stroke="#C0392B" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
